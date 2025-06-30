import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '透明になれなかった僕たちのために | 佐野徹夜 作品詳細',
  description: '生まれてきたことに意味を見出せない少年少女の彷徨、破滅と再生を描く青春サスペンス。',
  openGraph: {
    title: '透明になれなかった僕たちのために | 佐野徹夜',
    description: '生まれてきたことに意味を見出せない少年少女の彷徨、破滅と再生を描く青春サスペンス。',
    type: 'book',
    locale: 'ja_JP',
    images: [
      {
        url: 'https://images-na.ssl-images-amazon.com/images/P/4309031293.09.LZZZZZZZ.jpg',
        width: 353,
        height: 500,
        alt: '透明になれなかった僕たちのために 書影',
      }
    ],
  },
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "透明になれなかった僕たちのために",
  "author": {
    "@type": "Person",
    "name": "佐野徹夜",
    "url": "https://sanotetsuyaofficial.com/about"
  },
  "isbn": "978-4-309-03129-3",
  "bookFormat": "Paperback",
  "publisher": {
    "@type": "Organization",
    "name": "河出書房新社"
  },
  "datePublished": "2023-11-09",
  "inLanguage": "ja",
  "numberOfPages": 264,
  "description": "双子のアリオとユリオ、幼馴染の深雪。天才的な頭脳に恵まれながらも、自分の中に潜むある欲望に苦しみつつ成長する少年少女の破滅と再生を描く青春サスペンス。",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "JPY",
    "price": "1397",
    "availability": "https://schema.org/InStock",
    "url": "https://www.amazon.co.jp/dp/4309031293"
  }
}