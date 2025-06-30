'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import type { Work, NewsItem as NewsItemType } from '@/types'
import { mediaQuery } from '@/styles/responsive'
import { Footer } from '@/components/Footer'
import { MobileNav } from '@/components/MobileNav'
import { GlobalStyles } from '@/styles/GlobalStyles'

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.light.bg};
`

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(252, 252, 252, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${mediaQuery.tablet} {
    padding: 1rem;
  }
`

const Logo = styled.h1`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.65rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  margin: 0;
  
  ${mediaQuery.mobile} {
    font-size: 1.35rem;
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 3rem;
  
  ${mediaQuery.tablet} {
    display: none;
  }
`

const NavLink = styled(Link)`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.9rem;
  color: ${theme.colors.light.text};
  text-decoration: none;
  position: relative;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.6;
  }
`

const Main = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 200px);
`


const ContentSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  
  ${mediaQuery.tablet} {
    padding: 0 1rem 3rem;
  }
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${theme.colors.light.border};
  padding-bottom: 0.5rem;
`

const SectionTitle = styled.h3`
  font-family: ${theme.fonts.sansJp};
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.05em;
`

const SectionLink = styled(Link)`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.85rem;
  color: ${theme.colors.light.textLight};
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${theme.colors.light.hoverBlue};
  }
`

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1.5rem;
  
  ${mediaQuery.mobile} {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
`

const WorkItem = styled(motion.a)`
  display: block;
  aspect-ratio: 0.7;
  position: relative;
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const NewsItem = styled(motion.li)`
  padding: 1rem 0;
  border-bottom: 1px solid ${theme.colors.light.border};
  display: flex;
  gap: 1rem;
  font-family: ${theme.fonts.sansJp};
  font-size: 0.9rem;
  
  &:last-child {
    border-bottom: none;
  }
`

const NewsDate = styled.span`
  color: ${theme.colors.light.textLight};
  min-width: 100px;
`

const NewsTitle = styled.span`
  color: ${theme.colors.light.text};
`

const AboutSection = styled(motion.div)`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${theme.colors.light.text};
`

const ProgressSection = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
  background: ${theme.colors.light.surface};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const ProgressLabel = styled.div`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.8rem;
  color: ${theme.colors.light.textLight};
  margin-bottom: 0.5rem;
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.light.meterBg};
  border-radius: 2px;
  overflow: hidden;
`

const ProgressFill = styled(motion.div)<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: ${theme.colors.light.meterFill};
`

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-family: ${theme.fonts.sansJp};
  font-size: 0.85rem;
`

interface HomePageV2ClientProps {
  works: Work[]
  newsItems: NewsItemType[]
}

export default function HomePageV2Client({ works, newsItems }: HomePageV2ClientProps) {
  return (
    <>
      <GlobalStyles />
      <MobileNav />
      <PageWrapper>
        <HeaderWrapper>
          <HeaderContent>
            <Logo>佐野徹夜</Logo>
            <Nav>
              <NavLink href="/about">プロフィール</NavLink>
              <NavLink href="/works">作品</NavLink>
              <NavLink href="/news">最新情報</NavLink>
            </Nav>
          </HeaderContent>
        </HeaderWrapper>

        <Main>
          <ContentSection style={{ paddingTop: '2rem' }}>
            <SectionHeader>
              <SectionTitle>プロフィール</SectionTitle>
              <SectionLink href="/about">詳しく →</SectionLink>
            </SectionHeader>
            <AboutSection
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: 'left', margin: 0, padding: 0 }}
            >
              <p style={{ margin: '0.375rem 0' }}>1987年1月23日、京都府生まれ。</p>
              <p style={{ margin: '0.375rem 0' }}>『君は月夜に光り輝く』でデビュー。同作は映画化された。</p>
              <p style={{ margin: '0.375rem 0 0' }}>現在は新作長編小説を準備中。</p>
            </AboutSection>
          </ContentSection>

          <ContentSection>
            <SectionHeader>
              <SectionTitle>作品</SectionTitle>
              <SectionLink href="/works">すべて →</SectionLink>
            </SectionHeader>
            <WorksGrid>
              {works.map((work, index) => (
                <WorkItem
                  key={work.id}
                  href={work.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Image
                    src={work.coverUrl}
                    alt={work.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 30vw, 120px"
                  />
                </WorkItem>
              ))}
            </WorksGrid>
          </ContentSection>

          <ContentSection>
            <SectionHeader>
              <SectionTitle>最新情報</SectionTitle>
              <SectionLink href="/news">さらに →</SectionLink>
            </SectionHeader>
            <NewsList>
              {newsItems.map((news, index) => (
                <NewsItem
                  key={news.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <NewsDate>{news.date}</NewsDate>
                  <NewsTitle>{news.title}</NewsTitle>
                </NewsItem>
              ))}
            </NewsList>
          </ContentSection>

          <ContentSection style={{ paddingBottom: '2rem' }}>
            <ProgressSection>
              <ProgressLabel>新作執筆進捗</ProgressLabel>
              <ProgressBar>
                <ProgressFill
                  progress={70}
                  initial={{ width: 0 }}
                  animate={{ width: '70%' }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </ProgressBar>
              <ProgressInfo>
                <span>第二稿完成</span>
                <span>70%</span>
              </ProgressInfo>
            </ProgressSection>
          </ContentSection>
        </Main>

        <Footer layout="homepage" />
      </PageWrapper>
    </>
  )
}