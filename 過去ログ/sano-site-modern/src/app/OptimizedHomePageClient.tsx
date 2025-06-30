'use client'

import { lazy, Suspense } from 'react'
import { Layout } from '@/components/Layout'
import { AboutSection, WorksSection, NewsSection } from '@/components/sections'
import { ResponsiveProgressMeter } from '@/components/ResponsiveProgressMeter'

// データを親コンポーネントから受け取る
interface OptimizedHomePageClientProps {
  works: any[]
  newsItems: any[]
  disableFloatingParticles?: boolean
}

// 遅延読み込みコンポーネント
const LazyProgressMeter = lazy(() => 
  import('@/components/ResponsiveProgressMeter').then(mod => ({ 
    default: mod.ResponsiveProgressMeter 
  }))
)

export default function OptimizedHomePageClient({ 
  works, 
  newsItems,
  disableFloatingParticles = false 
}: OptimizedHomePageClientProps) {
  return (
    <Layout 
      showHeaderTitle={true} 
      footerLayout="homepage"
      disableFloatingParticles={disableFloatingParticles}
    >
      <AboutSection />
      <WorksSection works={works} />
      <NewsSection newsItems={newsItems} />
      <Suspense fallback={<div style={{ height: '200px' }} />}>
        <LazyProgressMeter progress={70} status="第二稿完成" />
      </Suspense>
    </Layout>
  )
}