'use client'

import { Section, SectionTitle } from '@/components/common'

interface AboutSectionProps {
  showLink?: boolean
}

const Paragraph = ({ children, isLast = false }: { children: React.ReactNode, isLast?: boolean }) => (
  <p style={{ margin: isLast ? '0.375rem 0 0' : '0.375rem 0', lineHeight: '1.6' }}>{children}</p>
)

export const AboutSection: React.FC<AboutSectionProps> = ({ showLink = true }) => {
  return (
    <Section id="about">
      <SectionTitle href={showLink ? "/about" : undefined}>プロフィール</SectionTitle>
      <Paragraph>1987年1月23日、京都府生まれ。</Paragraph>
      <Paragraph>『君は月夜に光り輝く』でデビュー。同作は映画化された。</Paragraph>
      <Paragraph isLast={true}>現在は新作長編小説を準備中。</Paragraph>
    </Section>
  )
}