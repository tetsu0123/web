# 佐野徹夜 Official Site - Modern React/Next.js Version

作家 佐野徹夜の公式ウェブサイトをモダンなReact/Next.js/TypeScriptでリファクタリングしたバージョンです。

## 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS) + Tailwind CSS
- **Animation**: Framer Motion
- **Font**: Google Fonts (Noto Sans/Serif JP, Inter)

## 主な機能

### 1. メインサイト
- **ホーム**: 作家プロフィール、最新作品、ニュース、進捗メーター
- **About**: 詳細プロフィール、タイムライン形式の経歴
- **Works**: 作品一覧（フィーチャード作品 + 全作品リスト）
- **News**: 年別に整理されたニュース一覧

### 2. ライティングツール
- 文字数カウンタ（原稿用紙換算付き）
- その他のツールも順次実装予定

### 3. デザイン特徴
- オリジナルのミニマルデザインを完全に維持
- スムーズなアニメーションとインタラクション
- レスポンシブ対応
- アクセシビリティ対応（WAI-ARIA、キーボードナビゲーション）
- パフォーマンス最適化

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm start
```

## プロジェクト構造

```
src/
├── app/              # Next.js App Router pages
├── components/       # 再利用可能なコンポーネント
├── data/            # 静的データ（作品、ニュース等）
├── hooks/           # カスタムフック
├── styles/          # グローバルスタイル、テーマ
├── types/           # TypeScript型定義
└── utils/           # ユーティリティ関数
```

## パフォーマンス最適化

- 画像の最適化（Next.js Image）
- フォントの最適化（font-display: swap）
- コード分割とレイジーローディング
- SEO最適化（メタデータ、構造化データ）
- アニメーションのGPU最適化

## デプロイ

Vercelへのデプロイが推奨されます：

```bash
npm run build
# Vercel CLIまたはGitHub連携でデプロイ
```

## ライセンス

このプロジェクトは佐野徹夜氏の公式サイトのリファクタリング版です。