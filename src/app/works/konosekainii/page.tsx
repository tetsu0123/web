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

const Quote = styled.div`
  position: relative;
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.02), rgba(26, 26, 26, 0.01));
  padding: 1.5rem 2rem;
  margin: 2rem 0;
  border-radius: 12px;
  text-align: center;
  font-family: ${theme.fonts.serifJp};
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${theme.colors.light.text};
  letter-spacing: 0.05em;
  border: 1px solid rgba(229, 229, 229, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
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

export default function KonosekainiiPage() {
  return (
    <Layout>
      <Container>
        <BackLink href="/works">Back to Works</BackLink>
        
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          この世界にiをこめて
        </Title>

        <HeroSection>
          <BookCover href="https://www.amazon.co.jp/dp/4048934147" target="_blank" rel="noopener">
            <img
              src="https://images-na.ssl-images-amazon.com/images/P/4048934147.09.LZZZZZZZ.jpg"
              alt="この世界にiをこめて 書影"
            />
          </BookCover>

          <BookInfo>
            <Publisher><strong>著者:</strong> 佐野徹夜</Publisher>
            <Publisher><strong>出版社:</strong> KADOKAWA</Publisher>
            <Publisher><strong>レーベル:</strong> メディアワークス文庫</Publisher>
            <Publisher><strong>発売日:</strong> 2017年10月25日</Publisher>
            <Publisher><strong>ページ数:</strong> 306ページ</Publisher>
            <Links>
              <LinkButton href="https://www.kadokawa.co.jp/product/321707000186/" target="_blank" rel="noopener">
                KADOKAWA公式
              </LinkButton>
            </Links>
          </BookInfo>
        </HeroSection>

        <Section>
          <SectionTitle>あらすじ</SectionTitle>
          <Content>
            <p>
              半年前に亡くなった友人<strong>吉野紫苑</strong>から、突然メールが届く。
            </p>
            <p>
              読書好きの高校生<strong>染井浩平</strong>は、死んだはずの彼女に返事を書く。やがて始まる、不可思議なメールのやり取り。
            </p>
            <p>失ったものを取り戻すことはできないけれど——。</p>
          </Content>
          <Quote>「現実に期待なんかしてるから駄目なんだよ」</Quote>
        </Section>

        <Section>
          <SectionTitle>登場人物</SectionTitle>
          <ThemeGrid>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThemeTitle>染井浩平（そめい こうへい）</ThemeTitle>
              <ThemeDescription>
                読書好きの高校生。死んだ友人にメールを送り続けている。
              </ThemeDescription>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThemeTitle>吉野紫苑（よしの しおん）</ThemeTitle>
              <ThemeDescription>小説を書いていた少女。半年前に逝去。</ThemeDescription>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ThemeTitle>真白（ましろ）</ThemeTitle>
              <ThemeDescription>転校生。吉野の作品の読者。</ThemeDescription>
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
              <ThemeTitle style={{ marginBottom: 0 }}>喪失と再生</ThemeTitle>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ textAlign: 'center' }}
            >
              <ThemeTitle style={{ marginBottom: 0 }}>創作への憧れ</ThemeTitle>
            </ThemeCard>
            <ThemeCard
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ textAlign: 'center' }}
            >
              <ThemeTitle style={{ marginBottom: 0 }}>言葉の力</ThemeTitle>
            </ThemeCard>
          </ThemeGrid>
        </Section>

        <Section>
          <SectionTitle>出版情報</SectionTitle>
          <ThemeGrid style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <ThemeCard style={{ textAlign: 'center' }}>
              <ThemeDescription style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '0.5rem', color: theme.colors.light.textLight }}>ISBN</ThemeDescription>
              <ThemeTitle style={{ fontSize: '0.9rem', marginBottom: 0 }}>978-4-04-893414-5</ThemeTitle>
            </ThemeCard>
            <ThemeCard style={{ textAlign: 'center' }}>
              <ThemeDescription style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '0.5rem', color: theme.colors.light.textLight }}>定価</ThemeDescription>
              <ThemeTitle style={{ fontSize: '0.9rem', marginBottom: 0 }}>650円+税</ThemeTitle>
            </ThemeCard>
          </ThemeGrid>
        </Section>
      </Container>
    </Layout>
  )
}