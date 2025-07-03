'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'
import { newsItems } from '@/data/news'

const BackLink = styled(Link)`
  display: inline-block;
  font-family: ${theme.fonts.sansJp};
  font-size: 0.9rem;
  color: ${theme.colors.light.textLight};
  text-decoration: none;
  margin-bottom: 2rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: ${theme.colors.light.hoverBlue};
  }
  
  ${mediaQuery.mobile} {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
  }
`

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
  
  ${mediaQuery.mobile} {
    padding: 0 0.75rem;
  }
`

const Title = styled(motion.h1)`
  font-family: ${theme.fonts.inter};
  font-weight: 350;
  font-size: 2.5rem;
  margin: 0 0 2rem;
  text-align: center;
  letter-spacing: 0.08em;
  line-height: 1.3;
  text-transform: uppercase;
  
  ${mediaQuery.tablet} {
    font-size: 2.5rem;
    margin-bottom: 4rem;
  }
  
  ${mediaQuery.mobile} {
    font-size: 2rem;
    margin-bottom: 3rem;
  }
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.5rem;
  font-weight: 300;
  color: ${theme.colors.light.textLight};
  margin: 0 0 1rem;
  letter-spacing: 0.08em;
  text-align: center;
`

const NewsSection = styled.section`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  ${mediaQuery.mobile} {
    margin-bottom: 2rem;
  }
`

const YearHeader = styled(motion.div)`
  padding: 1rem 0 0.8rem;
  border-bottom: 1px solid ${theme.colors.light.border};
`

const YearTitle = styled.h2`
  font-family: ${theme.fonts.inter};
  font-size: 1rem;
  font-weight: 500;
  color: ${theme.colors.light.textLight};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const NewsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`

const NewsItem = styled(motion.li)`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(229, 229, 229, 0.3);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    transform: translateX(0.1rem);
    opacity: 0.9;
    background: rgba(26, 26, 26, 0.01);
  }
  
  ${mediaQuery.mobile} {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.25rem 1.5rem;
  }
`

const NewsDate = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 0.75rem;
  font-weight: 400;
  color: ${theme.colors.light.textLighter};
  width: 3.5rem;
  text-align: right;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
  
  ${mediaQuery.mobile} {
    width: auto;
    text-align: left;
    font-size: 0.8rem;
  }
`

const NewsContent = styled.div`
  flex: 1;
`

const NewsTitle = styled.div`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.9rem;
  font-weight: 400;
  color: ${theme.colors.light.text};
  margin-bottom: 0;
  line-height: 1.5;
  letter-spacing: 0.02em;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.light.hoverBlue};
    }
  }
`

// Format date to MM-DD
const formatDate = (dateString: string) => {
  const [, month, day] = dateString.split('-')
  return `${month}-${day}`
}

// Group news by year
const groupNewsByYear = () => {
  const grouped: { [key: string]: typeof newsItems } = {}
  
  newsItems.forEach(item => {
    const year = item.date.split('-')[0]
    if (!grouped[year]) {
      grouped[year] = []
    }
    grouped[year].push(item)
  })
  
  return Object.entries(grouped).sort(([a], [b]) => b.localeCompare(a))
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function NewsPage() {
  const groupedNews = groupNewsByYear()

  return (
    <Layout>
      <Container>
        <BackLink href="/">←戻る</BackLink>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SectionTitle>新着情報</SectionTitle>
        </motion.div>
        
        {groupedNews.map(([year, items], yearIndex) => (
          <NewsSection key={year}>
            <YearHeader
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.2 + yearIndex * 0.1 }}
            >
              <YearTitle>{year}</YearTitle>
            </YearHeader>
            <NewsList>
              {items.map((news, index) => (
                <NewsItem
                  key={news.id}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.4 + yearIndex * 0.1 + index * 0.1 
                  }}
                >
                  <NewsDate>{formatDate(news.date)}</NewsDate>
                  <NewsContent>
                    <NewsTitle>
                      {news.url ? (
                        <a href={news.url} target="_blank" rel="noopener noreferrer">
                          {news.title}
                        </a>
                      ) : (
                        news.title
                      )}
                    </NewsTitle>
                  </NewsContent>
                </NewsItem>
              ))}
            </NewsList>
          </NewsSection>
        ))}
      </Container>
    </Layout>
  )
}