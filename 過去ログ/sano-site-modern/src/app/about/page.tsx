import type { Metadata } from 'next'
import Script from 'next/script'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'プロフィール | 佐野徹夜 公式サイト',
  description: '作家・佐野徹夜のプロフィール。2016年メディアワークス文庫賞デビュー、映画化作品『君は月夜に光り輝く』の著者。受賞歴・経歴・執筆活動について。',
  openGraph: {
    title: 'プロフィール | 佐野徹夜 公式サイト',
    description: '作家・佐野徹夜のプロフィール。『君は月夜に光り輝く』著者。',
    type: 'profile',
    locale: 'ja_JP',
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "mainEntity": {
    "@type": "Person",
    "name": "佐野徹夜",
    "alternateName": "Tetsuya Sano",
    "jobTitle": "小説家",
    "description": "『君は月夜に光り輝く』で第23回電撃小説大賞〈大賞〉を受賞しデビューした日本の小説家。青春の痛みを描く長篇を次々と発表。",
    "url": "https://sanotetsuyaofficial.com",
    "birthDate": "1987",
    "birthPlace": {
      "@type": "Place",
      "name": "京都府"
    },
    "sameAs": [
      "https://x.com/dame_murahito",
      "https://www.instagram.com/tetsuya.sano123/",
      "https://note.com/sano_tetsuya"
    ],
    "award": [
      "第23回電撃小説大賞 大賞（2016年）"
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "同志社大学文学部"
    },
    "workExample": [
      {
        "@type": "Book",
        "name": "君は月夜に光り輝く",
        "datePublished": "2017-02-25",
        "publisher": {
          "@type": "Organization",
          "name": "KADOKAWA"
        },
        "isbn": "978-4-04-892639-1"
      },
      {
        "@type": "Book", 
        "name": "透明になれなかった僕たちのために",
        "datePublished": "2023-11-08",
        "publisher": {
          "@type": "Organization",
          "name": "河出書房新社"
        },
        "isbn": "978-4-309-031293"
      },
      {
        "@type": "Book",
        "name": "この世界にiはいない",
        "datePublished": "2021-09-03",
        "publisher": {
          "@type": "Organization",
          "name": "河出書房新社"
        },
        "isbn": "978-4-309-029634"
      },
      {
        "@type": "Book",
        "name": "透明な夜の香り",
        "datePublished": "2018-05-17",
        "publisher": {
          "@type": "Organization",
          "name": "KADOKAWA"
        },
        "isbn": "978-4-04-893731-1"
      },
      {
        "@type": "Movie",
        "name": "君は月夜に光り輝く",
        "datePublished": "2019-03-15",
        "director": {
          "@type": "Person",
          "name": "月川翔"
        },
        "actor": [
          {
            "@type": "Person",
            "name": "永野芽郁"
          },
          {
            "@type": "Person",
            "name": "北村匠海"
          }
        ],
        "isBasedOn": {
          "@type": "Book",
          "name": "君は月夜に光り輝く",
          "author": {
            "@type": "Person",
            "name": "佐野徹夜"
          }
        }
      }
    ]
  }
}

export default function AboutPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AboutPageClient />
    </>
  )
}