import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '君は月夜に光り輝く | 佐野徹夜 作品詳細',
  description: '第23回電撃小説大賞〈大賞〉受賞作。発光病を患う少女と高校生の切ない恋物語。映画化もされたベストセラー小説。',
  openGraph: {
    title: '君は月夜に光り輝く | 佐野徹夜',
    description: '第23回電撃小説大賞〈大賞〉受賞作。発光病を患う少女と高校生の切ない恋物語。',
    type: 'book',
    locale: 'ja_JP',
    images: [
      {
        url: 'https://images-na.ssl-images-amazon.com/images/P/4048926756.09.LZZZZZZZ.jpg',
        width: 353,
        height: 500,
        alt: '君は月夜に光り輝く 書影',
      }
    ],
  },
}

export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Book",
  "name": "君は月夜に光り輝く",
  "author": {
    "@type": "Person",
    "name": "佐野徹夜",
    "url": "https://sanotetsuyaofficial.com/about"
  },
  "isbn": "978-4-04-892675-1",
  "bookFormat": "Paperback",
  "publisher": {
    "@type": "Organization",
    "name": "KADOKAWA"
  },
  "datePublished": "2017-03-25",
  "inLanguage": "ja",
  "numberOfPages": 290,
  "description": "第23回電撃小説大賞〈大賞〉受賞作。発光病を患う少女・まみずと高校生・卓也の切ない恋物語。限られた時間の中で生きることの意味を見つめ直す青春小説。",
  "award": "第23回電撃小説大賞 大賞",
  "workExample": {
    "@type": "Movie",
    "name": "君は月夜に光り輝く",
    "datePublished": "2019-03-15",
    "director": {
      "@type": "Person",
      "name": "月川翔"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "ratingCount": "1200"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "JPY",
    "price": "737",
    "availability": "https://schema.org/InStock",
    "url": "https://www.amazon.co.jp/dp/4048926756"
  }
}