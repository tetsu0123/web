import { Noto_Sans_JP, Noto_Serif_JP, Inter } from 'next/font/google'

// 日本語サンセリフフォント（サブセット化）
export const notoSansJP = Noto_Sans_JP({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['Hiragino Sans', 'Yu Gothic', 'Meiryo', 'sans-serif'],
  variable: '--font-noto-sans-jp',
})

// 日本語セリフフォント（サブセット化）
export const notoSerifJP = Noto_Serif_JP({
  weight: ['200', '300', '400'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['Yu Mincho', 'Hiragino Mincho ProN', 'serif'],
  variable: '--font-noto-serif-jp',
})

// 英語フォント
export const inter = Inter({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})