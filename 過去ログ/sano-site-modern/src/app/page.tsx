import type { Metadata } from 'next'
import Script from 'next/script'
import HomePageV2Client from './HomePageV2Client'
import { works } from '@/data/works'
import { newsItems } from '@/data/news'

export const metadata: Metadata = {
  title: '佐野徹夜 | 作家・小説家 - 公式サイト',
  description: '『君は月夜に光り輝く』『透明になれなかった僕たちのために』著者・佐野徹夜の公式サイト。最新作品情報、執筆進捗、プロフィール、メディア出演情報を掲載。',
  openGraph: {
    title: '佐野徹夜 | 作家・小説家 - 公式サイト',
    description: '『君は月夜に光り輝く』著者・佐野徹夜の公式サイト。最新作品情報、執筆進捗、プロフィール、メディア出演情報を掲載。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '佐野徹夜 | 作家・小説家 - 公式サイト',
    description: '『君は月夜に光り輝く』著者・佐野徹夜の公式サイト',
  },
}

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://sanotetsuyaofficial.com/#website",
      "url": "https://sanotetsuyaofficial.com/",
      "name": "佐野徹夜 公式サイト",
      "description": "作家・佐野徹夜の公式ウェブサイト",
      "publisher": {
        "@id": "https://sanotetsuyaofficial.com/#person"
      },
      "inLanguage": "ja-JP"
    },
    {
      "@type": "Person",
      "@id": "https://sanotetsuyaofficial.com/#person",
      "name": "佐野徹夜",
      "alternateName": "Tetsuya Sano",
      "url": "https://sanotetsuyaofficial.com",
      "image": "https://sanotetsuyaofficial.com/profile.jpg",
      "description": "『君は月夜に光り輝く』でデビューした日本の小説家",
      "sameAs": [
        "https://x.com/dame_murahito",
        "https://www.instagram.com/tetsuya.sano123/",
        "https://note.com/sano_tetsuya"
      ],
      "jobTitle": "小説家"
    }
  ]
}

export default function HomePage() {
  const recentWorks = works.slice(0, 6)
  const recentNews = newsItems.slice(0, 3)

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageV2Client 
        works={recentWorks}
        newsItems={recentNews}
      />
    </>
  )
}