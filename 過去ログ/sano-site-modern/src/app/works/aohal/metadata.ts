import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アオハル・ポイント | 佐野徹夜 作品詳細',
  description: '人の頭上に見える「ポイント」を通して、現代の評価社会と人間関係を描く青春小説。',
  openGraph: {
    title: 'アオハル・ポイント | 佐野徹夜',
    description: '人の頭上に見える「ポイント」を通して、現代の評価社会と人間関係を描く青春小説。',
    type: 'book',
    locale: 'ja_JP',
    images: [
      {
        url: 'https://images-na.ssl-images-amazon.com/images/P/4049120372.09.LZZZZZZZ.jpg',
        width: 353,
        height: 500,
        alt: 'アオハル・ポイント 書影',
      }
    ],
  },
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "アオハル・ポイント",
  "author": {
    "@type": "Person",
    "name": "佐野徹夜",
    "url": "https://sanotetsuyaofficial.com/about"
  },
  "isbn": "978-4-04-912037-0",
  "bookFormat": "Paperback",
  "publisher": {
    "@type": "Organization",
    "name": "KADOKAWA"
  },
  "datePublished": "2018-10-25",
  "inLanguage": "ja",
  "numberOfPages": 320,
  "description": "人の頭上に見える「ポイント」を通して、現代の評価社会と人間関係を描く青春小説。誰もが誰かを評価し、評価される世界で本当の価値とは何かを問う。",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "JPY",
    "price": "737",
    "availability": "https://schema.org/InStock",
    "url": "https://www.amazon.co.jp/dp/4049120372"
  }
}