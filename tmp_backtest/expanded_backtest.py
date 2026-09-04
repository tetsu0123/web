#!/usr/bin/env python3
"""
Expanded-universe backtest for a daily event-reaction strategy.

Signal is evaluated at the close; entry is next session's open; exit is the
open two sessions after entry. All signal inputs are known before execution.
"""
from __future__ import annotations

import io
import itertools
import json
import math
import os
import sys
import time
import warnings
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import numpy as np
import pandas as pd
import requests
import yfinance as yf

warnings.filterwarnings("ignore")

DATA_START = pd.Timestamp("2018-01-01")
DATA_END_EXCLUSIVE = pd.Timestamp("2026-09-03")
OOS_START = pd.Timestamp("2025-09-03")
OOS_END = pd.Timestamp("2026-09-02")
LONG_START = pd.Timestamp("2021-01-04")
COST_PER_SIDE = 0.0015
HOLD_SESSIONS = 2
MAX_POSITIONS = 5
BASE_GROSS_CAP = 0.75
TARGET_VOL = 0.18
FINANCING_RATE = 0.05
OUTPUT_DIR = Path(__file__).resolve().parent / "output"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ORIGINAL_28 = {
    "ONDS", "AMZN", "UBER", "AVAV", "AMD", "NVDA", "ORCL", "KTOS",
    "GRAB", "TSLA", "AVGO", "META", "NU", "SNDK", "MRVL", "INTC",
    "VST", "NBIS", "PL", "WDC", "RKLB", "TSM", "MU", "SOFI", "IONQ",
    "PLTR", "GOOG", "MSFT",
}

SUPPLEMENTAL = {
    "TSM", "ASML", "NVO", "SAP", "BABA", "JD", "PDD", "MELI", "SE",
    "NU", "SHOP", "CRWD", "SNOW", "PLTR", "AVAV", "IONQ", "RKLB",
    "NBIS", "SOFI", "UBER", "ABNB", "ARM", "SMCI", "MSTR", "HOOD",
    "COIN", "NET", "DDOG", "MDB", "HUBS", "TEAM", "ZS", "OKTA",
    "PATH", "APP", "RBLX", "DKNG", "RDDT", "CAVA", "ELF", "CELH",
    "GEV", "VST", "CEG", "NRG", "CCJ", "LEU", "OKLO", "SMR", "CRDO",
    "ALAB", "TEM", "HIMS", "CLS", "LITE", "COHR", "FN", "DELL", "HPE",
    "WDC", "SNDK", "STX", "MU", "MRVL", "AVGO", "SHEL", "BP", "TTE",
    "HSBC", "BHP", "RIO", "VALE", "TM", "SONY", "HMC", "NVS", "AZN",
    "NIO", "XPEV", "LI", "TME", "BIDU", "NTES", "TCOM", "BEKE",
    "FUTU", "GLOB", "CPNG", "ONON", "SPOT", "GRAB", "ONDS", "KTOS",
    "PL", "ASTS", "RDW", "LUNR", "JOBY", "ACHR", "RXST", "TMDX",
    "AXON", "CVNA", "DUOL", "FIVE", "CIEN", "SMMT", "NTSK",
}

CONFIGS = [
    {
        "id": idx,
        "market_vol_min": mv,
        "stock_range_min": sr,
        "market_dist_max": md,
    }
    for idx, (mv, sr, md) in enumerate(
        itertools.product(
            [0.15, 0.175, 0.20, 0.225, 0.25],
            [0.06, 0.07, 0.08, 0.09, 0.10],
            [0.08, 0.10, 0.12, 0.15],
        )
    )
]


def normalize_symbol(value: Any) -> str | None:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return None
    symbol = str(value).strip().upper()
    symbol = symbol.replace(".", "-")
    symbol = symbol.replace("/", "-")
    symbol = symbol.replace(" ", "")
    symbol = symbol.replace("\u00a0", "")
    symbol = symbol.split("[")[0].strip()
    if not symbol or symbol in {"NAN", "NONE", "—", "-"}:
        return None
    if len(symbol) > 12:
        return None
    return symbol


def flatten_columns(columns: Iterable[Any]) -> list[str]:
    out: list[str] = []
    for column in columns:
        if isinstance(column, tuple):
            pieces = [
                str(piece).strip()
                for piece in column
                if str(piece).strip() and not str(piece).startswith("Unnamed")
            ]
            out.append("_".join(pieces))
        else:
            out.append(str(column).strip())
    return out


def fetch_tables(url: str) -> list[pd.DataFrame]:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (compatible; expanded-backtest/1.0; "
            "+https://github.com)"
        )
    }
    for attempt in range(4):
        try:
            response = requests.get(url, headers=headers, timeout=45)
            response.raise_for_status()
            return pd.read_html(io.StringIO(response.text))
        except Exception as exc:
            if attempt == 3:
                raise RuntimeError(f"Could not read tables from {url}: {exc}") from exc
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Could not read tables from {url}")


def symbols_from_tables(url: str) -> set[str]:
    tables = fetch_tables(url)
    best: set[str] = set()
    for table in tables:
        table = table.copy()
        table.columns = flatten_columns(table.columns)
        for column in table.columns:
            normalized = column.lower().replace("_", " ")
            if normalized in {
                "symbol", "ticker", "ticker symbol", "ticker ticker",
                "company ticker", "added ticker",
            } or normalized.endswith(" ticker"):
                values = {normalize_symbol(v) for v in table[column].tolist()}
                values.discard(None)
                plausible = {
                    s for s in values
                    if s and 1 <= len(s) <= 8 and not s[0].isdigit()
                }
                if len(plausible) > len(best):
                    best = plausible
    if not best:
        raise RuntimeError(f"No symbol table found at {url}")
    return best


def get_universes() -> tuple[set[str], set[str], pd.DataFrame, dict[str, int]]:
    sp500_url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    sp400_url = "https://en.wikipedia.org/wiki/List_of_S%26P_400_companies"
    sp600_url = "https://en.wikipedia.org/wiki/List_of_S%26P_600_companies"
    nasdaq_url = "https://en.wikipedia.org/wiki/Nasdaq-100"

    sp500_tables = fetch_tables(sp500_url)
    current_sp500: set[str] = set()
    changes = pd.DataFrame()

    for table in sp500_tables:
        temp = table.copy()
        temp.columns = flatten_columns(temp.columns)
        lower = {column: column.lower() for column in temp.columns}
        symbol_cols = [
            column for column, name in lower.items()
            if name in {"symbol", "ticker", "ticker_symbol"}
        ]
        if symbol_cols and len(temp) >= 450:
            current_sp500 = {
                s for s in (normalize_symbol(v) for v in temp[symbol_cols[0]])
                if s
            }
        date_cols = [column for column, name in lower.items() if "date" in name]
        added_cols = [
            column for column, name in lower.items()
            if "added" in name and "ticker" in name
        ]
        removed_cols = [
            column for column, name in lower.items()
            if "removed" in name and "ticker" in name
        ]
        if date_cols and added_cols and removed_cols and len(temp) > 50:
            changes = temp[[date_cols[0], added_cols[0], removed_cols[0]]].copy()
            changes.columns = ["date", "added", "removed"]

    if len(current_sp500) < 450:
        current_sp500 = symbols_from_tables(sp500_url)
    if changes.empty:
        # Wikipedia occasionally changes the historical-changes table headers.
        # The broad test does not depend on that table: fall back to the current
        # S&P 500 list and label the comparison explicitly as current-static.
        changes = pd.DataFrame(columns=["date", "added", "removed"])
    else:
        changes["date"] = pd.to_datetime(changes["date"], errors="coerce")
        changes["added"] = changes["added"].map(normalize_symbol)
        changes["removed"] = changes["removed"].map(normalize_symbol)
        changes = changes.dropna(subset=["date"]).sort_values("date")
        changes = changes[changes["date"] >= DATA_START - pd.Timedelta(days=7)]

    sp400 = symbols_from_tables(sp400_url)
    sp600 = symbols_from_tables(sp600_url)
    try:
        nasdaq100 = symbols_from_tables(nasdaq_url)
    except RuntimeError:
        # Nasdaq-100 page structure changes often; S&P 1500 plus the explicit
        # supplemental growth/ADR list is already the main broad universe.
        nasdaq100 = set()

    historical_sp500 = set(current_sp500)
    historical_sp500.update(s for s in changes["added"].dropna() if s)
    historical_sp500.update(s for s in changes["removed"].dropna() if s)

    expanded = set(current_sp500) | sp400 | sp600 | nasdaq100 | SUPPLEMENTAL
    download = expanded | historical_sp500 | ORIGINAL_28 | {"QQQ"}

    counts = {
        "current_sp500": len(current_sp500),
        "historical_sp500_symbols": len(historical_sp500),
        "current_sp400": len(sp400),
        "current_sp600": len(sp600),
        "current_nasdaq100": len(nasdaq100),
        "supplemental": len(SUPPLEMENTAL),
        "expanded_unique": len(expanded),
        "download_unique": len(download),
    }
    return current_sp500, expanded, changes, counts


def extract_one(raw: pd.DataFrame, ticker: str) -> pd.DataFrame | None:
    if raw is None or raw.empty:
        return None
    frame: pd.DataFrame
    if isinstance(raw.columns, pd.MultiIndex):
        level0 = set(map(str, raw.columns.get_level_values(0)))
        level1 = set(map(str, raw.columns.get_level_values(1)))
        if ticker in level0:
            frame = raw[ticker].copy()
        elif ticker in level1:
            frame = raw.xs(ticker, axis=1, level=1).copy()
        else:
            return None
    else:
        frame = raw.copy()

    frame.columns = [str(c).strip().lower().replace(" ", "_") for c in frame.columns]
    aliases = {
        "open": "open", "high": "high", "low": "low", "close": "close",
        "volume": "volume",
    }
    if not all(column in frame.columns for column in aliases):
        return None
    frame = frame[["open", "high", "low", "close", "volume"]].copy()
    frame.index = pd.to_datetime(frame.index).tz_localize(None)
    for column in frame.columns:
        frame[column] = pd.to_numeric(frame[column], errors="coerce")
    frame = frame.replace([np.inf, -np.inf], np.nan)
    frame = frame.dropna(subset=["open", "high", "low", "close"])
    frame = frame[(frame["open"] > 0) & (frame["high"] > 0) &
                  (frame["low"] > 0) & (frame["close"] > 0)]
    frame["volume"] = frame["volume"].fillna(0)
    frame = frame[~frame.index.duplicated(keep="last")].sort_index()
    frame = frame.loc[(frame.index >= DATA_START) &
                      (frame.index < DATA_END_EXCLUSIVE)]
    return frame if len(frame) >= 80 else None


def yf_download(tickers: set[str]) -> tuple[dict[str, pd.DataFrame], list[str]]:
    ordered = sorted(tickers)
    data: dict[str, pd.DataFrame] = {}
    failures: set[str] = set()
    batch_size = 80

    def run_chunk(chunk: list[str], attempt: int = 0) -> None:
        try:
            raw = yf.download(
                tickers=chunk,
                start=DATA_START.strftime("%Y-%m-%d"),
                end=DATA_END_EXCLUSIVE.strftime("%Y-%m-%d"),
                auto_adjust=True,
                actions=False,
                group_by="ticker",
                threads=True,
                progress=False,
                timeout=45,
            )
            for ticker in chunk:
                frame = extract_one(raw, ticker)
                if frame is not None:
                    data[ticker] = frame
                else:
                    failures.add(ticker)
        except Exception as exc:
            print(f"batch failed ({len(chunk)} symbols): {exc}", flush=True)
            failures.update(chunk)

    for start in range(0, len(ordered), batch_size):
        chunk = ordered[start:start + batch_size]
        print(
            f"Downloading {start + 1}-{min(start + batch_size, len(ordered))}"
            f" / {len(ordered)}",
            flush=True,
        )
        run_chunk(chunk)
        time.sleep(0.8)

    for pass_no, retry_size in enumerate([20, 5], start=1):
        retry = sorted(failures - set(data))
        if not retry:
            break
        print(f"Retry pass {pass_no}: {len(retry)} symbols", flush=True)
        failures.clear()
        for start in range(0, len(retry), retry_size):
            chunk = retry[start:start + retry_size]
            run_chunk(chunk, pass_no)
            time.sleep(1.2)

    missing = sorted(set(ordered) - set(data))
    return data, missing


def build_membership_by_date(
    calendar: pd.DatetimeIndex,
    current_sp500: set[str],
    changes: pd.DataFrame,
) -> dict[pd.Timestamp, frozenset[str]]:
    change_rows = [
        (pd.Timestamp(row.date).normalize(), row.added, row.removed)
        for row in changes.itertuples(index=False)
    ]
    change_rows.sort(key=lambda item: item[0], reverse=True)
    membership = set(current_sp500)
    result: dict[pd.Timestamp, frozenset[str]] = {}
    pointer = 0

    for date in reversed(calendar):
        normalized_date = pd.Timestamp(date).normalize()
        while pointer < len(change_rows) and change_rows[pointer][0] > normalized_date:
            _, added, removed = change_rows[pointer]
            if added:
                membership.discard(added)
            if removed:
                membership.add(removed)
            pointer += 1
        result[normalized_date] = frozenset(membership)
    return result


@dataclass(frozen=True)
class Event:
    signal_idx: int
    symbol: str
    col: int
    score: float
    market_vol: float
    stock_range: float
    market_dist: float
    gap: float
    rvol: float
    excess: float
    close_location: float


def prepare_market(
    raw_data: dict[str, pd.DataFrame],
    expanded_symbols: set[str],
    current_sp500: set[str],
    changes: pd.DataFrame,
):
    if "QQQ" not in raw_data:
        raise RuntimeError("QQQ download failed")

    qqq = raw_data["QQQ"].copy()
    calendar = qqq.index[(qqq.index >= DATA_START) &
                         (qqq.index <= OOS_END)].sort_values()
    if len(calendar) < 1200:
        raise RuntimeError(f"QQQ calendar is too short: {len(calendar)}")

    tradable_symbols = sorted(set(raw_data) - {"QQQ"})
    symbol_to_col = {symbol: idx for idx, symbol in enumerate(tradable_symbols)}
    open_matrix = np.full((len(calendar), len(tradable_symbols)), np.nan, dtype=float)

    qqq = qqq.reindex(calendar)
    qqq_prev = qqq["close"].shift(1)
    qqq_ret = qqq["close"] / qqq_prev - 1.0
    qqq_sma50 = qqq["close"].rolling(50, min_periods=50).mean()
    qqq_dist = qqq["close"] / qqq_sma50 - 1.0
    qqq_vol20 = qqq_ret.rolling(20, min_periods=20).std(ddof=0) * math.sqrt(252)
    market_ok = (
        (qqq["close"] > qqq_sma50) &
        (qqq_dist >= 0) &
        (qqq_dist <= 0.15)
    )
    market_features = pd.DataFrame({
        "close": qqq["close"],
        "return": qqq_ret,
        "sma50": qqq_sma50,
        "dist50": qqq_dist,
        "vol20": qqq_vol20,
        "market_ok": market_ok,
    }, index=calendar)

    all_events: list[Event] = []
    coverage_rows: list[dict[str, Any]] = []

    for n, symbol in enumerate(tradable_symbols, start=1):
        frame = raw_data[symbol].copy()
        aligned_open = frame["open"].reindex(calendar)
        open_matrix[:, symbol_to_col[symbol]] = aligned_open.to_numpy(float)

        f = frame.join(
            market_features[["return", "dist50", "vol20", "market_ok"]].rename(
                columns={
                    "return": "qqq_return",
                    "dist50": "qqq_dist",
                    "vol20": "qqq_vol",
                }
            ),
            how="inner",
        )
        prev_close = f["close"].shift(1)
        stock_return = f["close"] / prev_close - 1.0
        gap = f["open"] / prev_close - 1.0
        stock_range = (f["high"] - f["low"]) / prev_close
        day_span = (f["high"] - f["low"]).replace(0, np.nan)
        close_location = (f["close"] - f["low"]) / day_span
        vol_avg20 = f["volume"].shift(1).rolling(20, min_periods=20).mean()
        rvol = f["volume"] / vol_avg20
        dollar_volume = f["close"] * f["volume"]
        dollar_avg20 = dollar_volume.shift(1).rolling(20, min_periods=20).mean()
        stock_sma50 = f["close"].rolling(50, min_periods=50).mean()
        stock_dist = f["close"] / stock_sma50 - 1.0
        excess = stock_return - f["qqq_return"]

        base = (
            f["market_ok"].fillna(False) &
            gap.between(0.04, 0.12, inclusive="both") &
            rvol.between(1.1, 5.0, inclusive="both") &
            (close_location >= 0.70) &
            (f["close"] >= f["open"]) &
            (excess >= 0) &
            (stock_dist <= 0.30) &
            (f["close"] >= 5.0) &
            (dollar_avg20 >= 50_000_000)
        )

        signal_dates = f.index[base.fillna(False)]
        for date in signal_dates:
            if date not in calendar:
                continue
            signal_idx = int(calendar.get_loc(date))
            entry_idx = signal_idx + 1
            exit_idx = entry_idx + HOLD_SESSIONS
            if exit_idx >= len(calendar):
                continue
            col = symbol_to_col[symbol]
            if not (
                np.isfinite(open_matrix[entry_idx, col]) and
                np.isfinite(open_matrix[exit_idx, col])
            ):
                continue
            values = {
                "gap": float(gap.loc[date]),
                "rvol": float(rvol.loc[date]),
                "excess": float(excess.loc[date]),
                "close_location": float(close_location.loc[date]),
                "stock_range": float(stock_range.loc[date]),
                "market_vol": float(f.loc[date, "qqq_vol"]),
                "market_dist": float(f.loc[date, "qqq_dist"]),
            }
            if not all(np.isfinite(v) for v in values.values()):
                continue
            score = (
                values["gap"] * 100.0 +
                max(0.0, values["rvol"] - 1.1) +
                max(0.0, values["excess"]) * 50.0 +
                values["close_location"]
            )
            all_events.append(
                Event(
                    signal_idx=signal_idx,
                    symbol=symbol,
                    col=col,
                    score=float(score),
                    market_vol=values["market_vol"],
                    stock_range=values["stock_range"],
                    market_dist=values["market_dist"],
                    gap=values["gap"],
                    rvol=values["rvol"],
                    excess=values["excess"],
                    close_location=values["close_location"],
                )
            )

        coverage_rows.append({
            "symbol": symbol,
            "first_date": frame.index.min().date().isoformat(),
            "last_date": frame.index.max().date().isoformat(),
            "rows": int(len(frame)),
            "base_events": int(base.fillna(False).sum()),
            "in_expanded_static": symbol in expanded_symbols,
            "in_original_28": symbol in ORIGINAL_28,
        })
        if n % 200 == 0:
            print(f"Prepared features for {n}/{len(tradable_symbols)} symbols", flush=True)

    membership_by_date = build_membership_by_date(calendar, current_sp500, changes)
    modes = {
        "original_28_static": defaultdict(list),
        "sp500_current_static": defaultdict(list),
        "expanded_static": defaultdict(list),
    }
    for event in all_events:
        date = calendar[event.signal_idx].normalize()
        if event.symbol in ORIGINAL_28:
            modes["original_28_static"][event.signal_idx].append(event)
        if event.symbol in membership_by_date.get(date, frozenset()):
            modes["sp500_current_static"][event.signal_idx].append(event)
        if event.symbol in expanded_symbols:
            modes["expanded_static"][event.signal_idx].append(event)

    for mode_events in modes.values():
        for idx in list(mode_events):
            mode_events[idx] = sorted(
                mode_events[idx], key=lambda event: event.score, reverse=True
            )

    events_df = pd.DataFrame([
        {
            "signal_date": calendar[event.signal_idx],
            "symbol": event.symbol,
            "score": event.score,
            "gap": event.gap,
            "rvol": event.rvol,
            "excess_return": event.excess,
            "close_location": event.close_location,
            "stock_range": event.stock_range,
            "qqq_vol20": event.market_vol,
            "qqq_dist50": event.market_dist,
        }
        for event in all_events
    ])
    coverage = pd.DataFrame(coverage_rows)
    return calendar, open_matrix, symbol_to_col, market_features, modes, events_df, coverage


def is_high(event: Event, config: dict[str, float]) -> bool:
    return (
        event.market_vol >= config["market_vol_min"] and
        event.stock_range >= config["stock_range_min"] and
        event.market_dist <= config["market_dist_max"]
    )


def candidate_weights(
    candidates: list[Event],
    configs: list[dict[str, float]],
    available_cap: float,
    available_slots: int,
) -> dict[int, float]:
    if not candidates or available_cap <= 1e-9 or available_slots <= 0:
        return {}
    combined = defaultdict(float)
    divisor = float(len(configs))
    for config in configs:
        remaining = available_cap
        used = 0
        for event in candidates:
            if used >= available_slots or remaining <= 1e-9:
                break
            desired = 0.40 if is_high(event, config) else 0.25
            weight = min(desired, remaining)
            if weight < 0.005:
                break
            combined[event.col] += weight / divisor
            remaining -= weight
            used += 1
    return dict(combined)


def simulate(
    calendar: pd.DatetimeIndex,
    open_matrix: np.ndarray,
    events_by_idx,
    config_provider,
    cost_per_side: float = COST_PER_SIDE,
    start_date: pd.Timestamp = DATA_START,
    end_date: pd.Timestamp = OOS_END,
):
    n_dates = len(calendar)
    start_idx = int(calendar.searchsorted(start_date, side="left"))
    end_idx = int(calendar.searchsorted(end_date, side="right")) - 1
    start_idx = max(0, start_idx)
    end_idx = min(n_dates - 1, end_idx)

    cash = 1_000_000.0
    positions = {}
    records = []
    trades = []
    previous_equity = cash

    for idx in range(start_idx, end_idx + 1):
        date = calendar[idx]
        market_value = 0.0
        for col, position in list(positions.items()):
            price = open_matrix[idx, col]
            if not np.isfinite(price):
                price = position["last_price"]
            else:
                position["last_price"] = float(price)
            market_value += position["shares"] * float(price)

        for col, position in list(positions.items()):
            if idx >= position["exit_idx"]:
                price = open_matrix[idx, col]
                if not np.isfinite(price):
                    price = position["last_price"]
                proceeds = position["shares"] * float(price)
                exit_cost = proceeds * cost_per_side
                cash += proceeds - exit_cost
                gross_pnl = position["shares"] * (float(price) - position["entry_price"])
                net_pnl = gross_pnl - position["entry_cost"] - exit_cost
                trades.append({
                    "signal_date": calendar[position["signal_idx"]],
                    "entry_date": position["entry_date"],
                    "exit_date": date,
                    "symbol": position["symbol"],
                    "weight": position["weight"],
                    "entry_price": position["entry_price"],
                    "exit_price": float(price),
                    "notional": position["notional"],
                    "net_pnl": net_pnl,
                    "return_on_notional": net_pnl / position["notional"],
                    "high_vote": position["high_vote"],
                })
                del positions[col]

        market_value = sum(
            position["shares"] * (
                float(open_matrix[idx, col])
                if np.isfinite(open_matrix[idx, col])
                else position["last_price"]
            )
            for col, position in positions.items()
        )
        equity = cash + market_value
        gross = market_value / equity if equity > 0 else 0.0
        slots = MAX_POSITIONS - len(positions)
        available_cap = max(0.0, BASE_GROSS_CAP - gross)

        signal_idx = idx - 1
        configs = config_provider(signal_idx, date)
        if signal_idx >= 0 and configs and slots > 0 and available_cap > 0:
            candidates = [
                event for event in events_by_idx.get(signal_idx, [])
                if event.col not in positions
                and idx + HOLD_SESSIONS <= end_idx
                and np.isfinite(open_matrix[idx, event.col])
                and np.isfinite(open_matrix[idx + HOLD_SESSIONS, event.col])
            ]
            weights = candidate_weights(
                candidates, configs, available_cap, slots
            )
            event_by_col = {event.col: event for event in candidates}
            base_equity = equity
            ordered_cols = [
                event.col for event in candidates if event.col in weights
            ]
            for col in ordered_cols:
                if len(positions) >= MAX_POSITIONS:
                    break
                price = float(open_matrix[idx, col])
                weight = float(weights[col])
                if weight <= 0:
                    continue
                notional = base_equity * weight
                shares = notional / price
                entry_cost = notional * cost_per_side
                cash -= notional + entry_cost
                event = event_by_col[col]
                high_vote = float(
                    np.mean([is_high(event, config) for config in configs])
                )
                positions[col] = {
                    "shares": shares,
                    "entry_price": price,
                    "entry_cost": entry_cost,
                    "entry_date": date,
                    "exit_idx": idx + HOLD_SESSIONS,
                    "signal_idx": signal_idx,
                    "symbol": event.symbol,
                    "weight": weight,
                    "notional": notional,
                    "last_price": price,
                    "high_vote": high_vote,
                }

        market_value = sum(
            position["shares"] * (
                float(open_matrix[idx, col])
                if np.isfinite(open_matrix[idx, col])
                else position["last_price"]
            )
            for col, position in positions.items()
        )
        equity = cash + market_value
        gross = market_value / equity if equity > 0 else 0.0
        daily_return = equity / previous_equity - 1.0 if previous_equity > 0 else 0.0
        records.append({
            "date": date,
            "equity": equity,
            "return": daily_return,
            "gross": gross,
            "positions": len(positions),
        })
        previous_equity = equity

    return pd.DataFrame(records).set_index("date"), pd.DataFrame(trades)


def performance(daily, trades, start, end):
    segment = daily.loc[(daily.index >= start) & (daily.index <= end)].copy()
    if segment.empty:
        return {}
    returns = segment["return"].fillna(0)
    equity = (1.0 + returns).cumprod()
    total_return = float(equity.iloc[-1] - 1.0)
    years = max(len(returns) / 252.0, 1 / 252.0)
    cagr = float(equity.iloc[-1] ** (1.0 / years) - 1.0)
    drawdown = equity / equity.cummax() - 1.0
    max_dd = float(drawdown.min())
    std = float(returns.std(ddof=0))
    sharpe = float(math.sqrt(252) * returns.mean() / std) if std > 0 else 0.0
    downside = returns[returns < 0]
    down_std = float(downside.std(ddof=0)) if len(downside) else 0.0
    sortino = float(math.sqrt(252) * returns.mean() / down_std) if down_std > 0 else 0.0
    annual_vol = std * math.sqrt(252)

    selected_trades = trades.copy()
    if not selected_trades.empty:
        selected_trades["entry_date"] = pd.to_datetime(selected_trades["entry_date"])
        selected_trades = selected_trades[
            selected_trades["entry_date"].between(start, end)
        ]
    trade_count = int(len(selected_trades))
    if trade_count:
        wins = selected_trades["net_pnl"] > 0
        win_rate = float(wins.mean())
        gross_profit = float(selected_trades.loc[wins, "net_pnl"].sum())
        gross_loss = float(-selected_trades.loc[~wins, "net_pnl"].sum())
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else float("inf")
        median_trade = float(selected_trades["return_on_notional"].median())
        total_trade_pnl = float(selected_trades["net_pnl"].sum())
        top5_share = (
            float(selected_trades.nlargest(min(5, trade_count), "net_pnl")["net_pnl"].sum() / total_trade_pnl)
            if total_trade_pnl > 0 else float("nan")
        )
    else:
        win_rate = profit_factor = median_trade = top5_share = 0.0

    return {
        "total_return": total_return,
        "cagr": cagr,
        "max_drawdown": max_dd,
        "sharpe": sharpe,
        "sortino": sortino,
        "annual_volatility": annual_vol,
        "trade_count": trade_count,
        "win_rate": win_rate,
        "profit_factor": profit_factor,
        "median_trade_return": median_trade,
        "top5_pnl_share": top5_share,
        "average_gross": float(segment["gross"].mean()),
        "maximum_gross": float(segment["gross"].max()),
        "invested_days": float((segment["gross"] > 0.001).mean()),
    }


def three_block_returns(returns, quarter_start):
    output = []
    for years_back in [3, 2, 1]:
        block_start = quarter_start - pd.DateOffset(years=years_back)
        block_end = quarter_start - pd.DateOffset(years=years_back - 1)
        block = returns[(returns.index >= block_start) & (returns.index < block_end)]
        output.append(float((1.0 + block).prod() - 1.0) if len(block) else -1.0)
    return output


def config_score(daily, trade_dates, quarter_start):
    train_start = quarter_start - pd.DateOffset(years=3)
    train_end = quarter_start - pd.Timedelta(days=1)
    returns = daily.loc[
        (daily.index >= train_start) & (daily.index <= train_end), "return"
    ].fillna(0)
    if len(returns) < 600:
        return -1e9, {}
    count = int(
        ((trade_dates >= train_start) & (trade_dates <= train_end)).sum()
    ) if len(trade_dates) else 0
    if count < 15:
        return -1e9, {"trade_count": count}

    blocks = three_block_returns(returns, quarter_start)
    equity = (1.0 + returns).cumprod()
    max_dd = float((equity / equity.cummax() - 1.0).min())
    mean_block = float(np.mean(blocks))
    worst_block = float(np.min(blocks))
    dispersion = float(np.std(blocks, ddof=0))
    score = (
        0.40 * worst_block +
        0.30 * mean_block -
        0.20 * abs(max_dd) -
        0.10 * dispersion
    )
    return score, {
        "score": score,
        "worst_12m_block": worst_block,
        "mean_12m_block": mean_block,
        "max_drawdown": max_dd,
        "dispersion": dispersion,
        "trade_count": count,
    }


def quarter_starts(calendar):
    dates = calendar[(calendar >= LONG_START) & (calendar <= OOS_END)]
    periods = dates.to_period("Q")
    starts = []
    for period in periods.unique():
        period_dates = dates[periods == period]
        if len(period_dates):
            starts.append(pd.Timestamp(period_dates[0]))
    return starts


def select_quarterly_configs(fixed_results, calendar, mode):
    mapping = {}
    rows = []

    for qstart in quarter_starts(calendar):
        scored = []
        for config in CONFIGS:
            daily, trades = fixed_results[config["id"]]
            trade_dates = (
                pd.to_datetime(trades["entry_date"])
                if not trades.empty else pd.Series([], dtype="datetime64[ns]")
            )
            score, details = config_score(daily, trade_dates, qstart)
            scored.append((score, config["id"], details))
        scored.sort(reverse=True, key=lambda item: item[0])
        top = [item for item in scored if item[0] > -1e8][:5]
        if len(top) < 5:
            top_ids = [49, 45, 53, 29, 69]
        else:
            top_ids = [item[1] for item in top]
        selected = [CONFIGS[config_id] for config_id in top_ids]
        mapping[qstart.to_period("Q")] = selected

        for rank, (score, config_id, details) in enumerate(top, start=1):
            if rank > 5:
                break
            config = CONFIGS[config_id]
            rows.append({
                "mode": mode,
                "quarter_start": qstart,
                "rank": rank,
                "config_id": config_id,
                **config,
                **details,
            })
        print(f"{mode}: selected configs for {qstart.date()}: {top_ids}", flush=True)

    return mapping, pd.DataFrame(rows)


def apply_risk_overlay(base_daily):
    returns = base_daily["return"].fillna(0.0)
    base_gross_for_return = base_daily["gross"].shift(1).fillna(0.0)
    quarterly_multiplier = {}

    for period in returns.index.to_period("Q").unique():
        period_dates = returns.index[returns.index.to_period("Q") == period]
        start = period_dates[0]
        history = returns[returns.index < start].tail(252)
        if len(history) >= 120:
            vol = float(history.std(ddof=0) * math.sqrt(252))
            multiplier = float(np.clip(TARGET_VOL / vol, 0.5, 2.0)) if vol > 1e-6 else 1.0
        else:
            multiplier = 1.0
        quarterly_multiplier[period] = multiplier

    equity = 1.0
    peak = 1.0
    rows = []
    for date, base_return in returns.items():
        drawdown_before = equity / peak - 1.0
        if drawdown_before <= -0.08:
            dd_factor = 0.35
        elif drawdown_before <= -0.05:
            dd_factor = 0.60
        else:
            dd_factor = 1.0
        vol_multiplier = quarterly_multiplier[date.to_period("Q")]
        scale = min(2.0, vol_multiplier * dd_factor)
        scaled_gross = float(base_gross_for_return.loc[date]) * scale
        financing = max(0.0, scaled_gross - 1.0) * FINANCING_RATE / 252.0
        adjusted_return = float(base_return) * scale - financing
        equity *= 1.0 + adjusted_return
        peak = max(peak, equity)
        rows.append({
            "date": date,
            "equity": equity,
            "return": adjusted_return,
            "gross": float(base_daily.loc[date, "gross"]) * scale,
            "positions": int(base_daily.loc[date, "positions"]),
            "vol_multiplier": vol_multiplier,
            "drawdown_factor": dd_factor,
            "scale": scale,
            "financing_cost": financing,
        })
    return pd.DataFrame(rows).set_index("date")


def analyze_mode(mode, calendar, open_matrix, events_by_idx):
    print(f"\nRunning fixed-grid simulations: {mode}", flush=True)
    fixed = {}
    for n, config in enumerate(CONFIGS, start=1):
        provider = lambda signal_idx, date, c=config: [c]
        fixed[config["id"]] = simulate(
            calendar, open_matrix, events_by_idx, provider,
            cost_per_side=COST_PER_SIDE,
            start_date=DATA_START, end_date=OOS_END,
        )
        if n % 20 == 0:
            print(f"{mode}: {n}/100 fixed configs", flush=True)

    mapping, selection_df = select_quarterly_configs(fixed, calendar, mode)

    def ensemble_provider(signal_idx, date):
        if signal_idx < 0:
            return None
        signal_date = calendar[signal_idx]
        return mapping.get(signal_date.to_period("Q"))

    base_daily, trades = simulate(
        calendar, open_matrix, events_by_idx, ensemble_provider,
        cost_per_side=COST_PER_SIDE,
        start_date=LONG_START, end_date=OOS_END,
    )
    risk_daily = apply_risk_overlay(base_daily)

    metrics = {
        "base_oos": performance(base_daily, trades, OOS_START, OOS_END),
        "risk_oos": performance(risk_daily, trades, OOS_START, OOS_END),
        "base_long": performance(base_daily, trades, LONG_START, OOS_END),
        "risk_long": performance(risk_daily, trades, LONG_START, OOS_END),
    }

    sensitivity_rows = []
    if mode in {"sp500_current_static", "expanded_static"}:
        for side_cost in [0.0015, 0.0025, 0.0040, 0.0060, 0.0100]:
            daily_cost, trades_cost = simulate(
                calendar, open_matrix, events_by_idx, ensemble_provider,
                cost_per_side=side_cost,
                start_date=LONG_START, end_date=OOS_END,
            )
            risk_cost = apply_risk_overlay(daily_cost)
            for variant, frame in [("base", daily_cost), ("risk", risk_cost)]:
                stats = performance(frame, trades_cost, OOS_START, OOS_END)
                sensitivity_rows.append({
                    "mode": mode,
                    "variant": variant,
                    "cost_per_side": side_cost,
                    **stats,
                })

    fixed_distribution = pd.DataFrame([
        {
            "config_id": config_id,
            **performance(result[0], result[1], OOS_START, OOS_END),
        }
        for config_id, result in fixed.items()
    ])

    return {
        "metrics": metrics,
        "base_daily": base_daily,
        "risk_daily": risk_daily,
        "trades": trades,
        "selection": selection_df,
        "sensitivity": pd.DataFrame(sensitivity_rows),
        "fixed_oos_distribution": fixed_distribution,
    }


def qqq_performance(market_features, start, end):
    returns = market_features.loc[
        (market_features.index >= start) & (market_features.index <= end),
        "return",
    ].fillna(0.0)
    equity = (1.0 + returns).cumprod()
    dd = equity / equity.cummax() - 1.0
    std = float(returns.std(ddof=0))
    return {
        "total_return": float(equity.iloc[-1] - 1.0),
        "max_drawdown": float(dd.min()),
        "sharpe": float(math.sqrt(252) * returns.mean() / std) if std > 0 else 0.0,
        "annual_volatility": std * math.sqrt(252),
    }


def pct(value):
    return f"{value * 100:.2f}%"


def create_markdown_report(counts, downloaded_count, missing_count, events_df, results, market_features):
    lines = [
        "# 拡張銘柄ユニバース・超短期イベント反応戦略バックテスト",
        "",
        f"- データ期間: {DATA_START.date()}〜{OOS_END.date()}",
        f"- 主評価期間: {OOS_START.date()}〜{OOS_END.date()}",
        f"- 取得成功: {downloaded_count}銘柄（QQQを含む）",
        f"- 取得失敗またはデータ不足: {missing_count}銘柄",
        f"- 全ユニバースの基礎シグナル数: {len(events_df):,}",
        f"- 片道コスト: {COST_PER_SIDE * 100:.2f}%",
        "",
        "## ユニバース",
        "",
        "|項目|銘柄数|",
        "|---|---:|",
    ]
    for key, value in counts.items():
        lines.append(f"|{key}|{value:,}|")

    lines.extend([
        "", "## 直近一年の比較", "",
        "|ユニバース|戦略|収益率|最大DD|Sharpe|取引数|平均グロス|最大グロス|",
        "|---|---|---:|---:|---:|---:|---:|---:|",
    ])
    for mode, result in results.items():
        for key, label in [("base_oos", "WF"), ("risk_oos", "WF＋リスク調整")]:
            m = result["metrics"][key]
            lines.append(
                f"|{mode}|{label}|{pct(m['total_return'])}|"
                f"{pct(m['max_drawdown'])}|{m['sharpe']:.2f}|"
                f"{m['trade_count']}|{pct(m['average_gross'])}|"
                f"{pct(m['maximum_gross'])}|"
            )

    qqq_oos = qqq_performance(market_features, OOS_START, OOS_END)
    lines.append(
        f"|QQQ|買い持ち|{pct(qqq_oos['total_return'])}|"
        f"{pct(qqq_oos['max_drawdown'])}|{qqq_oos['sharpe']:.2f}|—|100%|100%|"
    )

    lines.extend([
        "", "## 2021年以降の比較", "",
        "|ユニバース|戦略|累積収益|最大DD|Sharpe|取引数|",
        "|---|---|---:|---:|---:|---:|",
    ])
    for mode, result in results.items():
        for key, label in [("base_long", "WF"), ("risk_long", "WF＋リスク調整")]:
            m = result["metrics"][key]
            lines.append(
                f"|{mode}|{label}|{pct(m['total_return'])}|"
                f"{pct(m['max_drawdown'])}|{m['sharpe']:.2f}|"
                f"{m['trade_count']}|"
            )
    qqq_long = qqq_performance(market_features, LONG_START, OOS_END)
    lines.append(
        f"|QQQ|買い持ち|{pct(qqq_long['total_return'])}|"
        f"{pct(qqq_long['max_drawdown'])}|{qqq_long['sharpe']:.2f}|—|"
    )

    lines.extend([
        "", "## ルール", "",
        "- QQQが50日移動平均線を上回り、乖離が15%以下",
        "- 上方ギャップ4〜12%",
        "- RVOL 1.1〜5.0",
        "- 終値が日中値幅の上位30%以内、かつ終値が始値以上",
        "- 当日リターンがQQQを上回る",
        "- 株価5ドル以上、直前20日平均売買代金5,000万ドル以上",
        "- 当日引けで判定、翌営業日寄りで買い、2営業日後の寄りで売却",
        "- 高確度40%、通常25%、最大5銘柄、基礎グロス上限75%",
        "- 100条件から直前三年で四半期ごとに上位5条件を選び均等平均",
        "- リスク調整は直前一年の戦略ボラティリティを使い年率18%を目標",
        "- ドローダウン5%超で倍率60%、8%超で35%",
        "", "## 制約", "",
        "- 日足の価格・出来高だけを使った近似で、ニュース内容や決算予想差は未使用",
        "- expanded_staticは現在のS&P 1500・Nasdaq-100等を過去へ遡るためサバイバーシップ・バイアスがある",
        "- sp500_current_staticは現在のS&P 500構成銘柄を過去へ遡るため、サバイバーシップ・バイアスがある",
        "- Yahoo Financeから取得できなかった銘柄は除外",
        "- 直近一年は過去の改善過程でも参照済みで、完全な未使用ホールドアウトではない",
    ])

    for mode, result in results.items():
        trades = result["trades"]
        if trades.empty:
            continue
        t = trades.copy()
        t["entry_date"] = pd.to_datetime(t["entry_date"])
        t = t[t["entry_date"].between(OOS_START, OOS_END)]
        if t.empty:
            continue
        contributors = t.groupby("symbol")["net_pnl"].sum().sort_values(ascending=False).head(10)
        lines.extend(["", f"## {mode}：直近一年の上位寄与銘柄", "", "|銘柄|純損益|", "|---|---:|"])
        for symbol, pnl in contributors.items():
            lines.append(f"|{symbol}|{pnl:,.0f}|")

    return "\n".join(lines) + "\n"


def main():
    print("Building universes", flush=True)
    current_sp500, expanded_symbols, changes, counts = get_universes()
    download_symbols = (
        expanded_symbols |
        set(current_sp500) |
        set(changes["added"].dropna()) |
        set(changes["removed"].dropna()) |
        ORIGINAL_28 |
        {"QQQ"}
    )
    download_symbols = {s for s in download_symbols if s}
    print(json.dumps(counts, indent=2), flush=True)

    raw_data, missing = yf_download(download_symbols)
    print(f"Downloaded usable data for {len(raw_data)} symbols; missing {len(missing)}", flush=True)
    if len(raw_data) < 700:
        raise RuntimeError(
            f"Too few usable symbols ({len(raw_data)}); refusing to report a broad test"
        )

    calendar, open_matrix, symbol_to_col, market_features, mode_events, events_df, coverage = prepare_market(
        raw_data, expanded_symbols, current_sp500, changes
    )

    coverage.to_csv(OUTPUT_DIR / "data_coverage.csv", index=False)
    events_df.to_csv(OUTPUT_DIR / "all_base_events.csv", index=False)
    pd.DataFrame({"missing_symbol": missing}).to_csv(
        OUTPUT_DIR / "missing_symbols.csv", index=False
    )

    results = {}
    for mode in ["original_28_static", "sp500_current_static", "expanded_static"]:
        results[mode] = analyze_mode(mode, calendar, open_matrix, mode_events[mode])
        result = results[mode]
        result["base_daily"].to_csv(OUTPUT_DIR / f"{mode}_base_equity.csv")
        result["risk_daily"].to_csv(OUTPUT_DIR / f"{mode}_risk_equity.csv")
        result["trades"].to_csv(OUTPUT_DIR / f"{mode}_trades.csv", index=False)
        result["selection"].to_csv(OUTPUT_DIR / f"{mode}_quarterly_selections.csv", index=False)
        result["sensitivity"].to_csv(OUTPUT_DIR / f"{mode}_cost_sensitivity.csv", index=False)
        result["fixed_oos_distribution"].to_csv(OUTPUT_DIR / f"{mode}_fixed_config_distribution.csv", index=False)

    metrics_json = {
        "run_parameters": {
            "data_start": DATA_START.date().isoformat(),
            "data_end": OOS_END.date().isoformat(),
            "oos_start": OOS_START.date().isoformat(),
            "oos_end": OOS_END.date().isoformat(),
            "cost_per_side": COST_PER_SIDE,
            "hold_sessions": HOLD_SESSIONS,
            "max_positions": MAX_POSITIONS,
            "base_gross_cap": BASE_GROSS_CAP,
            "target_vol": TARGET_VOL,
        },
        "universe_counts": counts,
        "downloaded_usable": len(raw_data),
        "missing_or_short": len(missing),
        "base_event_count": len(events_df),
        "modes": {mode: result["metrics"] for mode, result in results.items()},
        "qqq_oos": qqq_performance(market_features, OOS_START, OOS_END),
        "qqq_long": qqq_performance(market_features, LONG_START, OOS_END),
    }
    with open(OUTPUT_DIR / "metrics.json", "w", encoding="utf-8") as handle:
        json.dump(metrics_json, handle, ensure_ascii=False, indent=2)

    report = create_markdown_report(
        counts, len(raw_data), len(missing), events_df, results, market_features
    )
    (OUTPUT_DIR / "expanded_backtest_report.md").write_text(report, encoding="utf-8")
    print(report, flush=True)


if __name__ == "__main__":
    main()
