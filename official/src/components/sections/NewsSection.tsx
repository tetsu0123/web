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
    <Section id="news" spacing="small" transition={{ delay: 0.4 }}>
      <SectionTitle href={showLink ? "/news" : undefined}>NEWS</SectionTitle>
      <NewsList items={newsItems} animationDelay={0.6} />
    </Section>
  )
}