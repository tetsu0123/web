'use client'

import { Section, SectionTitle } from '@/components/common'

interface AboutSectionProps {
  showLink?: boolean
}

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p style={{ margin: '0.5rem 0' }}>{children}</p>
)

export const AboutSection: React.FC<AboutSectionProps> = ({ showLink = true }) => {
  return (
    <Section id="about">
      <SectionTitle href={showLink ? "/about" : undefined}>ABOUT</SectionTitle>
      <Paragraph>1987年1月23日、京都府生まれ。</Paragraph>
      <Paragraph>『君は月夜に光り輝く』でデビュー。同作は映画化された。</Paragraph>
      <Paragraph>現在は新作長編小説を準備中。</Paragraph>
    </Section>
  )
}