'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'
import { writingTools } from '@/data/tools'

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
  
  ${mediaQuery.mobile} {
    padding: 0 0.75rem;
  }
`

const Title = styled(motion.h1)`
  font-family: ${theme.fonts.serifJp};
  font-weight: 300;
  font-size: 3rem;
  margin: 0 0 1rem;
  text-align: center;
  letter-spacing: 0.08em;
  
  ${mediaQuery.tablet} {
    font-size: 2.5rem;
  }
  
  ${mediaQuery.mobile} {
    font-size: 2rem;
    margin: 0 0 0.75rem;
    letter-spacing: 0.06em;
  }
`

const Subtitle = styled(motion.p)`
  font-family: ${theme.fonts.sansJp};
  font-size: 1.1rem;
  color: ${theme.colors.light.textLight};
  text-align: center;
  margin-bottom: 3rem;
  
  ${mediaQuery.mobile} {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  ${mediaQuery.tablet} {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  
  ${mediaQuery.mobile} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const ToolCard = styled(motion(Link))`
  background: ${theme.colors.light.surface};
  border: 1px solid ${theme.colors.light.border};
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  transition: ${theme.transitions.hover};
  position: relative;
  overflow: hidden;
  
  ${mediaQuery.tablet} {
    padding: 1.5rem;
  }
  
  ${mediaQuery.mobile} {
    padding: 1.25rem;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(10, 77, 162, 0.05), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    border-color: ${theme.colors.light.hoverBlue};
  }

  &:hover::before {
    left: 100%;
  }
`

const ToolIcon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, ${theme.colors.light.hoverBlue}, ${theme.colors.light.meterFill});
  border-radius: 12px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  
  ${mediaQuery.mobile} {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    border-radius: 10px;
    margin-bottom: 0.75rem;
  }
`

const ToolName = styled.h3`
  font-family: ${theme.fonts.sansJp};
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${theme.colors.light.text};
  
  ${mediaQuery.mobile} {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }
`

const ToolDescription = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.light.textLight};
  line-height: 1.6;
  
  ${mediaQuery.mobile} {
    font-size: 0.85rem;
    line-height: 1.5;
  }
`

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

const getToolIcon = (id: string) => {
  const icons: { [key: string]: string } = {
    henkan: '⚡',
    mojisuu: '📊',
    kaigyou: '✂️',
    jisage: '📐',
    zenkaku: '🔤',
    texttohtml: '🌐',
    scenario: '🎬',
    txttougou: '🔗',
    pdfketugou: '📑',
    hozon: '💾',
    bukken: '🏠',
  }
  return icons[id] || '📝'
}

export default function ToolsPage() {
  return (
    <Layout>
      <Container>
        <Title
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          Writing Tools
        </Title>
        <Subtitle
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          執筆活動をサポートする便利なツール集
        </Subtitle>

        <ToolsGrid>
          {writingTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              href={tool.path}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.3 + index * 0.05 }}
            >
              <ToolIcon>{getToolIcon(tool.id)}</ToolIcon>
              <ToolName>{tool.name}</ToolName>
              <ToolDescription>{tool.description}</ToolDescription>
            </ToolCard>
          ))}
        </ToolsGrid>
      </Container>
    </Layout>
  )
}