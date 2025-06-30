'use client'

import { Section, SectionTitle } from '@/components/common'
import { WorksGrid } from '@/components/WorksGrid'
import { Work } from '@/types'

interface WorksSectionProps {
  works: Work[]
  showLink?: boolean
}

export const WorksSection: React.FC<WorksSectionProps> = ({ works, showLink = true }) => {
  return (
    <Section id="works" transition={{ delay: 0.1, duration: 0.8 }}>
      <SectionTitle href={showLink ? "/works" : undefined}>作品</SectionTitle>
      <WorksGrid works={works} />
    </Section>
  )
}