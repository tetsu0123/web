'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

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

const Section = styled.section`
  margin-bottom: 1rem;
`

const SectionIntro = styled.div`
  margin-bottom: 1rem;
  text-align: center;
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.5rem;
  font-weight: 300;
  color: ${theme.colors.light.textLight};
  margin: 0 0 1rem;
  letter-spacing: 0.08em;
`

const WorksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
`

const WorkItem = styled(motion.div)`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 3rem;
  align-items: center;
  padding: 2rem 0;
  border-bottom: 1px solid rgba(229, 229, 229, 0.3);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    transform: translateX(0.3rem);
    opacity: 0.85;
  }
  
  ${mediaQuery.tablet} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem 0;
    
    &:hover {
      transform: none;
    }
  }
  
  ${mediaQuery.mobile} {
    padding: 1.5rem 0;
  }
`

const WorkNumber = styled.div`
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: ${theme.colors.light.textLighter};
  letter-spacing: 0.1em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-width: 1rem;
  position: relative;
  
  &::before {
    content: 'No.';
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.6rem;
  }
  
  ${mediaQuery.tablet} {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
    order: 2;
    
    &::before {
      display: inline;
      margin-right: 0.5rem;
      margin-bottom: 0;
    }
  }
`

const WorkDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  
  ${mediaQuery.tablet} {
    order: 1;
  }
`

const WorkTitle = styled.h3`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.4rem;
  font-weight: 300;
  margin: 0.3rem 0 0;
  color: ${theme.colors.light.text};
  line-height: 1.5;
  letter-spacing: 0.03em;
  
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.4s ease;
    
    &:hover {
      color: ${theme.colors.light.hoverBlue};
    }
  }
  
  ${mediaQuery.mobile} {
    font-size: 1.2rem;
  }
`

const WorkMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`

const WorkPublisher = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.light.textLighter};
  letter-spacing: 0.05em;
`

const WorkNote = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.light.hoverBlue};
  font-weight: 400;
  letter-spacing: 0.03em;
`

const WorkYear = styled.div`
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: ${theme.colors.light.textLighter};
  letter-spacing: 0.1em;
  
  ${mediaQuery.tablet} {
    order: 3;
  }
`

const OtherWorks = styled.section`
  margin-top: 0;
  padding-top: 0;
`

const OtherIntro = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`

const OtherSectionTitle = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1rem;
  font-weight: 300;
  color: ${theme.colors.light.textLight};
  margin: 0 0 1rem;
  letter-spacing: 0.1em;
`

const OtherDescription = styled.p`
  font-size: 0.7rem;
  color: ${theme.colors.light.textLighter};
  line-height: 1.6;
  max-width: 350px;
  margin: 0 auto 1rem;
  letter-spacing: 0.03em;
`

const OtherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem 3rem;
  
  ${mediaQuery.tablet} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`

const OtherItem = styled(motion.div)`
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(229, 229, 229, 0.2);
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    transform: translateX(0.2rem);
    opacity: 0.8;
  }
  
  ${mediaQuery.tablet} {
    &:hover {
      transform: none;
    }
  }
`

const OtherItemTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: ${theme.colors.light.text};
  line-height: 1.4;
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

const OtherItemYear = styled.div`
  font-size: 0.6rem;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-weight: 300;
  color: ${theme.colors.light.textLighter};
  letter-spacing: 0.05em;
`

// 作品データ
const mainWorks = [
  {
    id: 'toumei',
    number: '06',
    title: '透明になれなかった僕たちのために',
    href: '/works/toumei',
    publisher: '河出書房新社',
    year: '2023'
  },
  {
    id: 'sayonara',
    number: '05',
    title: 'さよなら世界の終わり',
    href: '/works/sayonara',
    publisher: '新潮社（新潮文庫nex）',
    year: '2020'
  },
  {
    id: 'fragments',
    number: '04',
    title: '君は月夜に光り輝く +Fragments',
    href: '/works/fragments',
    publisher: 'KADOKAWA（メディアワークス文庫）',
    year: '2019'
  },
  {
    id: 'aohal',
    number: '03',
    title: 'アオハル・ポイント',
    href: '/works/aohal',
    publisher: 'KADOKAWA（メディアワークス文庫）',
    year: '2018'
  },
  {
    id: 'konosekainii',
    number: '02',
    title: 'この世界にiをこめて',
    href: '/works/konosekainii',
    publisher: 'KADOKAWA（メディアワークス文庫）',
    year: '2017'
  },
  {
    id: 'kimitsuki',
    number: '01',
    title: '君は月夜に光り輝く',
    href: '/works/kimitsuki',
    publisher: 'KADOKAWA（メディアワークス文庫）',
    note: '第23回電撃小説大賞 大賞受賞作品',
    year: '2017'
  }
]

const otherWorks = [
  {
    id: 'oyasumi',
    title: '短編『「おやすみ、ずっとそばにいるね」』',
    subtitle: '（TikTokドラマ化）',
    href: 'https://sudohkazuki.studio.site/works/kodansha',
    year: '2024'
  },
  {
    id: 'watashitachi',
    title: '短編『わたしたちの教室』',
    subtitle: '（『君に贈る15ページ』収録）',
    href: 'https://www.kadokawa.co.jp/product/322407000894/',
    year: '2024'
  },
  {
    id: 'haha-e',
    title: 'エッセイ〈母へ〉',
    subtitle: '（新潮社「yom yom」連載）',
    href: 'https://www.shinchosha.co.jp/yomyom/',
    year: '2024〜'
  },
  {
    id: 'ichinen',
    title: '漫画『一年に一度しか会えない君の話。』',
    subtitle: '作画: 伊緒直道',
    href: 'https://ichijin-plus.com/comics/98388282229054',
    year: '2023〜'
  },
  {
    id: 'kimitsuki-movie',
    title: '映画『君は月夜に光り輝く』',
    subtitle: '監督: 月川翔',
    href: 'https://www.instagram.com/kimitsuki0315',
    year: '2019'
  },
  {
    id: 'kimitsuki-manga',
    title: '漫画『君は月夜に光り輝く』',
    subtitle: '作画: マツセダイチ',
    href: 'https://www.kadokawa.co.jp/product/321806000202/',
    year: '2018'
  }
]

export default function WorksPage() {
  return (
    <Layout>
      <Container>
        <BackLink href="/">←戻る</BackLink>
        <Section>
          <SectionIntro>
            <SectionTitle>長編小説</SectionTitle>
          </SectionIntro>
          
          <WorksGrid>
            {mainWorks.map((work, index) => (
              <WorkItem
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <WorkNumber>{work.number}</WorkNumber>
                <WorkDetails>
                  <WorkTitle>
                    <Link href={work.href}>
                      {work.title}
                    </Link>
                  </WorkTitle>
                  <WorkMeta>
                    <WorkPublisher>{work.publisher}</WorkPublisher>
                    {work.note && <WorkNote>{work.note}</WorkNote>}
                  </WorkMeta>
                </WorkDetails>
                <WorkYear>{work.year}</WorkYear>
              </WorkItem>
            ))}
          </WorksGrid>
        </Section>

        <OtherWorks>
          <OtherIntro>
            <OtherSectionTitle>その他の作品</OtherSectionTitle>
            <OtherDescription>短編、映像化作品、漫画原作、エッセイなど。</OtherDescription>
          </OtherIntro>
          
          <OtherGrid>
            {otherWorks.map((work, index) => (
              <OtherItem
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.05 }}
              >
                <OtherItemTitle>
                  <a href={work.href} target="_blank" rel="noopener">
                    {work.title}
                    {work.subtitle && (
                      <>
                        <br />
                        {work.subtitle}
                      </>
                    )}
                  </a>
                </OtherItemTitle>
                <OtherItemYear>{work.year}</OtherItemYear>
              </OtherItem>
            ))}
          </OtherGrid>
        </OtherWorks>
      </Container>
    </Layout>
  )
}