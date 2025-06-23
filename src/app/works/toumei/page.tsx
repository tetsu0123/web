'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
  
  ${mediaQuery.mobile} {
    padding: 0 0.75rem;
  }
`

const BackLink = styled(Link)`
  display: inline-block;
  font-family: ${theme.fonts.inter};
  font-size: 0.7rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.light.textLighter};
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${theme.colors.light.hoverBlue};
  }

  &::before {
    content: "← ";
  }
`

const Title = styled(motion.h1)`
  font-family: ${theme.fonts.serifJp};
  font-weight: 300;
  font-size: 2rem;
  margin: 0 0 2rem;
  text-align: center;
  letter-spacing: 0.05em;
  line-height: 1.3;
  
  ${mediaQuery.mobile} {
    font-size: 1.5rem;
  }
`

const HeroSection = styled.section`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  align-items: start;

  ${mediaQuery.mobile} {
    grid-template-columns: 1fr;
    text-align: center;
  }
`

const BookCover = styled.a`
  display: block;
  width: 100%;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-4px);
  }

  img {
    width: 100%;
    height: auto;
    border-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  ${mediaQuery.mobile} {
    max-width: 200px;
    margin: 0 auto;
  }
`

const BookInfo = styled.div`
  ${mediaQuery.mobile} {
    margin-top: 1rem;
  }
`

const BookTitle = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0 0 1rem;
  line-height: 1.4;
  letter-spacing: 0.05em;
  
  ${mediaQuery.mobile} {
    font-size: 1.5rem;
  }
`

const Publisher = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.light.textLight};
  margin: 0.5rem 0;
`

const PublishDate = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.light.textLighter};
  margin: 0.5rem 0;
`

const Links = styled.div`
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  ${mediaQuery.mobile} {
    justify-content: center;
  }
`

const LinkButton = styled.a`
  display: inline-block;
  padding: 0.5rem 1.2rem;
  background: ${theme.colors.light.surface};
  color: ${theme.colors.light.text};
  text-decoration: none;
  border: 1px solid ${theme.colors.light.border};
  border-radius: 4px;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.light.text};
    color: ${theme.colors.light.bg};
  }
`

const Section = styled.section`
  margin: 3rem 0;
  padding: 2rem 0;
  border-top: 1px solid ${theme.colors.light.border};
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: ${theme.colors.light.hoverBlue};
  }
`

const Content = styled.div`
  font-size: 0.95rem;
  line-height: 1.8;
  color: ${theme.colors.light.text};
  
  p {
    margin: 1rem 0;
  }
`

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
  
  ${mediaQuery.tablet} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const ThemeCard = styled(motion.div)`
  background: ${theme.colors.light.surface};
  border: 1px solid ${theme.colors.light.border};
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
`

const ThemeTitle = styled.h3`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.5rem;
  color: ${theme.colors.light.text};
`

const ThemeDescription = styled.p`
  font-size: 0.85rem;
  color: ${theme.colors.light.textLight};
  line-height: 1.6;
  margin: 0;
`

export default function ToumeiPage() {
  return (
    <Layout>
      <Container>
        <BackLink href="/works">Back to Works</BackLink>
        
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          透明になれなかった僕たちのために
        </Title>

        <HeroSection>
          <BookCover href="https://www.amazon.co.jp/dp/4309031293" target="_blank" rel="noopener">
            <img
              src="https://images-na.ssl-images-amazon.com/images/P/4309031293.09.LZZZZZZZ.jpg"
              alt="透明になれなかった僕たちのために 書影"
            />
          </BookCover>

          <BookInfo>
            <Publisher><strong>著者:</strong> 佐野徹夜</Publisher>
            <Publisher><strong>出版社:</strong> 河出書房新社</Publisher>
            <Publisher><strong>発売日:</strong> 2023年11月9日</Publisher>
            <Publisher><strong>ページ数:</strong> 264ページ</Publisher>
            <Publisher><strong>装画:</strong> loundraw</Publisher>
            <Links>
              <LinkButton href="https://www.kawade.co.jp/np/isbn/9784309031293/" target="_blank" rel="noopener">
                河出書房新社公式
              </LinkButton>
            </Links>
          </BookInfo>
        </HeroSection>

        <Section>
          <SectionTitle>あらすじ</SectionTitle>
          <Content>
            <p>
              双子の<strong>アリオ</strong>と<strong>ユリオ</strong>、幼馴染の<strong>深雪</strong>。天才的な頭脳に恵まれながらも、自分の中に潜むある欲望に苦しみつつ成長する。
            </p>
            <p>
              ユリオの自殺と連続する殺人事件を契機に、驚愕の真相が明らかになっていく。
            </p>
            <p>
              生まれてきたことに意味を見出せない少年少女の彷徨、破滅と再生を描く青春サスペンス。
            </p>
          </Content>
        </Section>

        <Section>
          <SectionTitle>登場人物</SectionTitle>
          <ThemeGrid>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThemeTitle>アリオ</ThemeTitle>
              <ThemeDescription>
                双子の一人。ユリオの自殺後、深雪と再会し、自分の出生の秘密に気づいていく。
              </ThemeDescription>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThemeTitle>ユリオ</ThemeTitle>
              <ThemeDescription>
                アリオの双子の兄弟。物語冒頭で自殺している。天才的な頭脳を持っていた。
              </ThemeDescription>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThemeTitle>深雪</ThemeTitle>
              <ThemeDescription>
                アリオとユリオの幼馴染。大学生になって再会する。ある事件をきっかけにアリオと離れ離れになった。
              </ThemeDescription>
            </ThemeCard>
          </ThemeGrid>
        </Section>

        <Section>
          <SectionTitle>テーマ</SectionTitle>
          <ThemeGrid>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ textAlign: 'center' }}
            >
              <ThemeTitle style={{ marginBottom: 0 }}>生の意味</ThemeTitle>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ textAlign: 'center' }}
            >
              <ThemeTitle style={{ marginBottom: 0 }}>破滅と再生</ThemeTitle>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ textAlign: 'center' }}
            >
              <ThemeTitle style={{ marginBottom: 0 }}>青春サスペンス</ThemeTitle>
            </ThemeCard>
          </ThemeGrid>
        </Section>


        <Section>
          <SectionTitle>出版情報</SectionTitle>
          <ThemeGrid style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <ThemeCard style={{ textAlign: 'center' }}>
              <ThemeDescription style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '0.5rem', color: theme.colors.light.textLight }}>ISBN</ThemeDescription>
              <ThemeTitle style={{ fontSize: '0.9rem', marginBottom: 0 }}>978-4-309-03129-3</ThemeTitle>
            </ThemeCard>
            <ThemeCard style={{ textAlign: 'center' }}>
              <ThemeDescription style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '0.5rem', color: theme.colors.light.textLight }}>定価</ThemeDescription>
              <ThemeTitle style={{ fontSize: '0.9rem', marginBottom: 0 }}>1,397円（本体1,270円）</ThemeTitle>
            </ThemeCard>
          </ThemeGrid>
        </Section>
      </Container>
    </Layout>
  )
}