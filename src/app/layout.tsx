import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: '佐野徹夜 | Official Site',
  description: '作家 佐野徹夜の公式ウェブサイト。『君は月夜に光り輝く』でデビュー。作品情報、最新ニュース、プロフィールなど。',
  keywords: '佐野徹夜,君は月夜に光り輝く,小説家,作家',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
  openGraph: {
    title: '佐野徹夜 | Official Site',
    description: '作家 佐野徹夜の公式ウェブサイト',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@dame_murahito',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}