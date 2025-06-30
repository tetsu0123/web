'use client'

import { Section, SectionTitle } from '@/components/common'
import { NewsList } from '@/components/features'
import { NewsItem } from '@/types'

interface NewsSectionProps {
  newsItems: NewsItem[]
  showLink?: boolean
}

export const NewsSection: React.FC<NewsSectionProps> = ({ newsItems, showLink = true }) => {
  return (
    <Section id="news" spacing="small" transition={{ delay: 0.2, duration: 0.8 }}>
      <SectionTitle href={showLink ? "/news" : undefined}>最新情報</SectionTitle>
      <NewsList items={newsItems} animationDelay={0.3} />
    </Section>
  )
}