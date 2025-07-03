'use client'

import { Layout } from '@/components/Layout'
import { ResponsiveProgressMeter } from '@/components/ResponsiveProgressMeter'
import { AboutSection, WorksSection, NewsSection } from '@/components/sections'
import { works } from '@/data/works'
import { newsItems } from '@/data/news'

export default function HomePage() {
  const recentWorks = works.slice(0, 6)
  const recentNews = newsItems.slice(0, 3)

  return (
    <Layout showHeaderTitle={true} footerLayout="homepage">
      <AboutSection />
      <WorksSection works={recentWorks} />
      <NewsSection newsItems={recentNews} />
      <ResponsiveProgressMeter progress={70} status="第二稿完成" />
    </Layout>
  )
}