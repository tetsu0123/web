#!/usr/bin/env python3
"""Build a broad event panel with only information known by next-session open."""
from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np
import pandas as pd

import expanded_backtest as eb

OUT = Path(__file__).resolve().parent / "event_output"
OUT.mkdir(parents=True, exist_ok=True)
HORIZONS = (1, 2, 3, 5)


def safe_float(value):
    try:
        out = float(value)
        return out if np.isfinite(out) else np.nan
    except Exception:
        return np.nan


def main():
    current_sp500, expanded_symbols, changes, counts = eb.get_universes()
    download_symbols = (
        expanded_symbols | set(current_sp500) |
        set(changes.get("added", pd.Series(dtype=object)).dropna()) |
        set(changes.get("removed", pd.Series(dtype=object)).dropna()) |
        eb.ORIGINAL_28 | {"QQQ"}
    )
    download_symbols = {s for s in download_symbols if s}
    raw, missing = eb.yf_download(download_symbols)
    if "QQQ" not in raw or len(raw) < 700:
        raise RuntimeError(f"Insufficient broad data: {len(raw)} usable")

    qqq = raw["QQQ"].copy()
    calendar = qqq.index[(qqq.index >= eb.DATA_START) & (qqq.index <= eb.OOS_END)].sort_values()
    qqq = qqq.reindex(calendar)
    qret = qqq["close"].pct_change()
    qsma50 = qqq["close"].rolling(50, min_periods=50).mean()
    qsma200 = qqq["close"].rolling(200, min_periods=200).mean()
    qdist50 = qqq["close"] / qsma50 - 1.0
    qdist200 = qqq["close"] / qsma200 - 1.0
    qvol20 = qret.rolling(20, min_periods=20).std(ddof=0) * math.sqrt(252)
    qvol60 = qret.rolling(60, min_periods=60).std(ddof=0) * math.sqrt(252)
    qpre5 = qqq["close"].shift(1) / qqq["close"].shift(6) - 1.0
    qpre20 = qqq["close"].shift(1) / qqq["close"].shift(21) - 1.0
    qdd20 = qqq["close"] / qqq["close"].rolling(20, min_periods=20).max() - 1.0
    qnext_gap = qqq["open"].shift(-1) / qqq["close"] - 1.0

    rows = []
    coverage = []
    tradable = sorted(set(raw) - {"QQQ"})

    for n, symbol in enumerate(tradable, 1):
        f = raw[symbol].reindex(calendar).copy()
        prev = f["close"].shift(1)
        sret = f["close"] / prev - 1.0
        gap = f["open"] / prev - 1.0
        span = (f["high"] - f["low"]).replace(0, np.nan)
        stock_range = span / prev
        close_loc = (f["close"] - f["low"]) / span
        body = (f["close"] - f["open"]) / span
        open_close = f["close"] / f["open"] - 1.0
        gap_hold = f["low"] / prev - 1.0
        vol20avg = f["volume"].shift(1).rolling(20, min_periods=20).mean()
        rvol = f["volume"] / vol20avg
        dollar_avg20 = (f["close"] * f["volume"]).shift(1).rolling(20, min_periods=20).mean()
        sma50 = f["close"].rolling(50, min_periods=50).mean()
        sma200 = f["close"].rolling(200, min_periods=200).mean()
        dist50 = f["close"] / sma50 - 1.0
        dist200 = f["close"] / sma200 - 1.0
        sret_daily = f["close"].pct_change()
        svol20 = sret_daily.shift(1).rolling(20, min_periods=20).std(ddof=0) * math.sqrt(252)
        svol60 = sret_daily.shift(1).rolling(60, min_periods=60).std(ddof=0) * math.sqrt(252)
        spre5 = f["close"].shift(1) / f["close"].shift(6) - 1.0
        spre20 = f["close"].shift(1) / f["close"].shift(21) - 1.0
        spre60 = f["close"].shift(1) / f["close"].shift(61) - 1.0
        sdd20 = f["close"] / f["close"].rolling(20, min_periods=20).max() - 1.0
        corr60 = sret_daily.shift(1).rolling(60, min_periods=40).corr(qret.shift(1))
        cov60 = sret_daily.shift(1).rolling(60, min_periods=40).cov(qret.shift(1))
        qvar60 = qret.shift(1).rolling(60, min_periods=40).var(ddof=0)
        beta60 = cov60 / qvar60.replace(0, np.nan)
        excess = sret - qret
        entry_open = f["open"].shift(-1)
        entry_date_series = pd.Series(calendar, index=calendar).shift(-1)
        entry_chase = entry_open / f["close"] - 1.0
        total_entry_gap = entry_open / prev - 1.0
        relative_entry_gap = entry_chase - qnext_gap

        relaxed = (
            qdist50.between(-0.05, 0.20, inclusive="both") &
            gap.between(0.02, 0.20, inclusive="both") &
            rvol.between(1.0, 10.0, inclusive="both") &
            (close_loc >= 0.55) &
            (f["close"] >= f["open"]) &
            (excess >= -0.01) &
            (dist50 <= 0.60) &
            (f["close"] >= 5.0) &
            (dollar_avg20 >= 30_000_000)
        )

        event_count = 0
        for date in calendar[relaxed.fillna(False)]:
            i = int(calendar.get_loc(date))
            if i + 1 + max(HORIZONS) >= len(calendar):
                continue
            values = {
                "gap": gap.loc[date], "rvol": rvol.loc[date],
                "close_location": close_loc.loc[date], "body_strength": body.loc[date],
                "open_to_close": open_close.loc[date], "gap_hold": gap_hold.loc[date],
                "stock_range": stock_range.loc[date], "excess_return": excess.loc[date],
                "stock_dist50": dist50.loc[date], "stock_dist200": dist200.loc[date],
                "stock_vol20": svol20.loc[date], "stock_vol60": svol60.loc[date],
                "pre5": spre5.loc[date], "pre20": spre20.loc[date], "pre60": spre60.loc[date],
                "stock_dd20": sdd20.loc[date], "corr60_qqq": corr60.loc[date],
                "beta60_qqq": beta60.loc[date], "dollar_avg20": dollar_avg20.loc[date],
                "qqq_return": qret.loc[date], "qqq_dist50": qdist50.loc[date],
                "qqq_dist200": qdist200.loc[date], "qqq_vol20": qvol20.loc[date],
                "qqq_vol60": qvol60.loc[date], "qqq_pre5": qpre5.loc[date],
                "qqq_pre20": qpre20.loc[date], "qqq_dd20": qdd20.loc[date],
                "entry_chase": entry_chase.loc[date], "total_entry_gap": total_entry_gap.loc[date],
                "qqq_entry_gap": qnext_gap.loc[date], "relative_entry_gap": relative_entry_gap.loc[date],
            }
            if any(not np.isfinite(safe_float(v)) for v in values.values()):
                continue
            p0 = safe_float(f["open"].iloc[i + 1])
            if not np.isfinite(p0) or p0 <= 0:
                continue
            row = {
                "signal_date": date, "entry_date": entry_date_series.loc[date],
                "symbol": symbol, "signal_close": safe_float(f["close"].loc[date]),
                "prev_close": safe_float(prev.loc[date]), "entry_open": p0,
                "in_original_28": symbol in eb.ORIGINAL_28,
                "in_current_sp500": symbol in current_sp500,
                "in_expanded_static": symbol in expanded_symbols,
                **{k: safe_float(v) for k, v in values.items()},
            }
            for step in range(0, max(HORIZONS) + 1):
                row[f"open_t{step}"] = safe_float(f["open"].iloc[i + 1 + step])
            valid = True
            for horizon in HORIZONS:
                exit_open = row[f"open_t{horizon}"]
                if not np.isfinite(exit_open) or exit_open <= 0:
                    valid = False
                    break
                row[f"gross_h{horizon}"] = exit_open / p0 - 1.0
                low_path = f["low"].iloc[i + 1:i + 1 + horizon]
                high_path = f["high"].iloc[i + 1:i + 1 + horizon]
                row[f"mae_h{horizon}"] = safe_float(low_path.min() / p0 - 1.0)
                row[f"mfe_h{horizon}"] = safe_float(high_path.max() / p0 - 1.0)
                q0 = safe_float(qqq["open"].iloc[i + 1])
                qh = safe_float(qqq["open"].iloc[i + 1 + horizon])
                row[f"qqq_gross_h{horizon}"] = qh / q0 - 1.0 if q0 > 0 else np.nan
            if valid:
                rows.append(row)
                event_count += 1

        coverage.append({
            "symbol": symbol, "first_date": f.dropna(subset=["close"]).index.min(),
            "last_date": f.dropna(subset=["close"]).index.max(),
            "rows": int(f["close"].notna().sum()), "relaxed_events": event_count,
        })
        if n % 200 == 0:
            print(f"Built events for {n}/{len(tradable)} symbols", flush=True)

    panel = pd.DataFrame(rows)
    panel["signal_date"] = pd.to_datetime(panel["signal_date"])
    panel["entry_date"] = pd.to_datetime(panel["entry_date"])
    panel["same_day_count"] = panel.groupby("signal_date")["symbol"].transform("size")
    for col in ["gap", "rvol", "close_location", "body_strength", "excess_return",
                "stock_range", "entry_chase", "stock_vol60", "dollar_avg20"]:
        panel[f"rank_{col}"] = panel.groupby("signal_date")[col].rank(pct=True, method="average")
    panel = panel.sort_values(["signal_date", "symbol"]).reset_index(drop=True)
    panel.to_csv(OUT / "event_panel.csv", index=False)
    pd.DataFrame(coverage).to_csv(OUT / "coverage.csv", index=False)
    pd.DataFrame({"missing_symbol": missing}).to_csv(OUT / "missing_symbols.csv", index=False)
    qout = pd.DataFrame({
        "date": calendar, "open": qqq["open"].values, "high": qqq["high"].values,
        "low": qqq["low"].values, "close": qqq["close"].values,
        "return": qret.values, "dist50": qdist50.values, "dist200": qdist200.values,
        "vol20": qvol20.values, "vol60": qvol60.values,
    })
    qout.to_csv(OUT / "qqq_features.csv", index=False)
    summary = {
        "universe_counts": counts, "downloaded_usable": len(raw),
        "missing": len(missing), "event_rows": len(panel),
        "date_min": str(panel["signal_date"].min().date()),
        "date_max": str(panel["signal_date"].max().date()),
    }
    (OUT / "summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2), flush=True)


if __name__ == "__main__":
    main()
