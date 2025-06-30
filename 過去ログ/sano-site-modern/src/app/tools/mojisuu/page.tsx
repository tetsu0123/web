'use client'

import { useState } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { TextArea } from '@/components/TextArea'
import { theme } from '@/styles/theme'

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const Title = styled(motion.h1)`
  font-family: ${theme.fonts.serifJp};
  font-weight: 400;
  font-size: 2.5rem;
  margin: 0 0 1rem;
  text-align: center;
`

const Description = styled.p`
  text-align: center;
  color: ${theme.colors.light.textLight};
  margin-bottom: 2rem;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
`

const StatCard = styled(motion.div)`
  background: ${theme.colors.light.surface};
  border: 1px solid ${theme.colors.light.border};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`

const StatValue = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 2rem;
  font-weight: 600;
  color: ${theme.colors.light.hoverBlue};
  margin-bottom: 0.25rem;
`

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.light.textLight};
`

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function MojisuuPage() {
  const [text, setText] = useState('')

  // 文字数計算
  const totalChars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const lines = text.split('\n').length
  const manuscriptPages = Math.ceil(charsNoSpaces / 400)

  return (
    <Layout>
      <Container>
        <Title
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
        >
          文字数カウンタ
        </Title>
        <Description>
          原稿の文字数と原稿用紙換算枚数を確認できます
        </Description>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <TextArea
            value={text}
            onChange={setText}
            placeholder="ここに文章を入力してください"
            rows={15}
          />
        </motion.div>

        <StatsGrid>
          <StatCard
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatValue>{totalChars}</StatValue>
            <StatLabel>総文字数</StatLabel>
          </StatCard>
          
          <StatCard
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <StatValue>{charsNoSpaces}</StatValue>
            <StatLabel>文字数（空白除く）</StatLabel>
          </StatCard>
          
          <StatCard
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <StatValue>{lines}</StatValue>
            <StatLabel>行数</StatLabel>
          </StatCard>
          
          <StatCard
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <StatValue>{manuscriptPages}</StatValue>
            <StatLabel>原稿用紙換算</StatLabel>
          </StatCard>
        </StatsGrid>
      </Container>
    </Layout>
  )
}