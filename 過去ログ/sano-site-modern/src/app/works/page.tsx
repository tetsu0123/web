import type { Metadata } from 'next'
import { Layout } from '@/components/Layout'
import WorksPageClient from './WorksPageClient'

export const metadata: Metadata = {
  title: '作品一覧 | 佐野徹夜 公式サイト',
  description: '佐野徹夜の全作品一覧。『君は月夜に光り輝く』『この世界にiはいない』『透明な夜の香り』など、デビュー作から最新作まで全ての出版作品を紹介。',
  openGraph: {
    title: '作品一覧 | 佐野徹夜 公式サイト',
    description: '佐野徹夜の全作品一覧。デビュー作から最新作まで全ての出版作品を紹介。',
    type: 'website',
    locale: 'ja_JP',
  },
}

export default function WorksPage() {
  return (
    <Layout>
      <WorksPageClient />
    </Layout>
  )
}