import type { Metadata } from 'next'
import { Layout } from '@/components/Layout'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: '最新情報 | 佐野徹夜 公式サイト',
  description: '佐野徹夜の最新情報。新刊発売、メディア出演、イベント登壇、推薦コメント、連載情報など最新のお知らせを掲載。',
  openGraph: {
    title: '最新情報 | 佐野徹夜 公式サイト',
    description: '佐野徹夜の最新情報。新刊発売、メディア出演、イベント登壇など。',
    type: 'website',
    locale: 'ja_JP',
  },
}

export default function NewsPage() {
  return (
    <Layout>
      <NewsPageClient />
    </Layout>
  )
}