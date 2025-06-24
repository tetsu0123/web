'use client'

import Image from 'next/image'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const Container = styled.div`
  max-width: 800px;
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

const ProfileSection = styled(motion.section)`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: stretch;

  ${mediaQuery.tablet} {
    grid-template-columns: 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  ${mediaQuery.mobile} {
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
`

const ProfileImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 3/4.2;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  max-height: 450px;
  
  ${mediaQuery.tablet} {
    max-width: 400px;
    margin: 0 auto;
  }
  
  ${mediaQuery.mobile} {
    max-width: 300px;
    border-radius: 6px;
  }
`

const ProfileContent = styled.div`
  padding-top: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const ProfileName = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 0.8rem;
  color: ${theme.colors.light.text};
  
  ${mediaQuery.mobile} {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  }
`

const ProfileText = styled.p`
  font-size: 0.78rem;
  line-height: 1.55;
  margin-bottom: 1.2rem;
  color: ${theme.colors.light.text};
  
  ${mediaQuery.mobile} {
    font-size: 0.8rem;
    line-height: 1.5;
    margin-bottom: 1.2rem;
  }
`

const TimelineSection = styled(motion.section)`
  margin-top: 2.4rem;
  
  ${mediaQuery.tablet} {
    margin-top: 1.8rem;
  }
  
  ${mediaQuery.mobile} {
    margin-top: 1.5rem;
  }
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.5rem;
  font-weight: 300;
  color: ${theme.colors.light.textLight};
  margin: 0 0 1.2rem;
  letter-spacing: 0.08em;
  text-align: center;
`

const Timeline = styled.div`
  position: relative;
  padding: 0 0 2.5rem;
`

const TimelineItem = styled(motion.div)`
  padding: 0;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`

const TimelineContent = styled.div`
  display: flex;
  gap: 2rem;
  align-items: baseline;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(229, 229, 229, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(26, 26, 26, 0.01);
  }
  
  ${mediaQuery.mobile} {
    gap: 1rem;
    padding: 0.8rem 0;
  }
`

const TimelineYear = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.colors.light.textLight};
  min-width: 3.5rem;
  flex-shrink: 0;
  
  ${mediaQuery.mobile} {
    font-size: 0.85rem;
    min-width: 3rem;
  }
`

const TimelineText = styled.div`
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${theme.colors.light.text};
  white-space: pre-line;
  
  ${mediaQuery.mobile} {
    font-size: 0.8rem;
    line-height: 1.4;
  }
`

const timelineData = [
  { year: '2016', content: '『君は月夜に光り輝く』で第23回電撃小説大賞〈大賞〉を受賞し、デビュー。' },
  { year: '2017', content: 'デビュー作『君は月夜に光り輝く』刊行。\n第2作『この世界にiをこめて』発表。' },
  { year: '2018', content: '第3作『アオハル・ポイント』刊行。\n漫画『君は月夜に光り輝く』（作画：マツセダイチ）連載開始。' },
  { year: '2019', content: '映画『君は月夜に光り輝く』公開（監督：月川翔）。\n『君は月夜に光り輝く +Fragments』刊行。' },
  { year: '2020', content: '『さよなら世界の終わり』刊行（新潮社・新潮文庫nex）。' },
  { year: '2022', content: '「カクヨム甲子園 2022」最終選考委員を務める。\n新潮社「yom yom」でエッセイ〈母へ〉連載開始。' },
  { year: '2023', content: '『透明になれなかった僕たちのために』刊行（河出書房新社）。\n漫画『一年に一度しか会えない君の話。』連載開始。' },
  { year: '2024', content: 'コミック『一年に一度しか会えない君の話。』1巻刊行。\n短編アンソロジー『君に贈る15ページ』に書き下ろし「わたしたちの教室」収録。' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export default function AboutPage() {
  return (
    <Layout showHeaderTitle={false} footerLayout="homepage">
      <Container>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          <SectionTitle>プロフィール</SectionTitle>
        </motion.div>

        <ProfileSection
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ProfileImageWrapper>
            <Image
              src="/profile.jpg"
              alt="佐野徹夜"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </ProfileImageWrapper>
          <ProfileContent>
            <ProfileName>佐野徹夜</ProfileName>
            <ProfileText>
              1987年京都府生まれ。同志社大学文学部卒。
            </ProfileText>
            <ProfileText>
              2016年『君は月夜に光り輝く』で第23回電撃小説大賞〈大賞〉を受賞しデビュー。翌17年に同作を刊行しロングセラーとなる。
            </ProfileText>
            <ProfileText>
              以降『この世界にiをこめて』（2017）、『アオハル・ポイント』（2018）、『さよなら世界の終わり』（2020）、『透明になれなかった僕たちのために』（2023）など青春の痛みを描く長篇を次々と発表。
            </ProfileText>
            <ProfileText>
              近年は映像脚本や漫画原作、アニメ原案など活動領域を拡大中。
            </ProfileText>
          </ProfileContent>
        </ProfileSection>

        <TimelineSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SectionTitle>年譜</SectionTitle>
          <Timeline>
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <TimelineContent>
                  <TimelineYear>{item.year}</TimelineYear>
                  <TimelineText>{item.content}</TimelineText>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </TimelineSection>
      </Container>
    </Layout>
  )
}