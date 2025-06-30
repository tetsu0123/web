'use client'

import Image from 'next/image'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { LayoutV2 } from '@/components/LayoutV2'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 1rem;
`


const HeroSection = styled.section`
  display: flex;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: flex-start;
  margin-top: 0;

  ${mediaQuery.tablet} {
    flex-direction: column;
    text-align: left;
    align-items: flex-start;
  }
`

const ProfileImage = styled.div`
  width: 240px;
  height: auto;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  filter: grayscale(20%);
  flex-shrink: 0;
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;

  ${mediaQuery.tablet} {
    max-width: 250px;
    margin: 0 auto 1rem;
  }
`

const ProfileInfo = styled.div`
  flex: 1;
`

const ProfileLabel = styled.h3`
  font-family: ${theme.fonts.inter};
  font-weight: 400;
  font-size: 0.9rem;
  margin: 0 0 0.8rem;
  color: #666;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const ProfileName = styled.h1`
  font-family: ${theme.fonts.serifJp};
  font-weight: 200;
  font-size: 2rem;
  margin: 0 0 1rem;
  line-height: 1.2;
  letter-spacing: 0.03em;
`

const ProfileText = styled.div`
  font-size: 0.75rem;
  line-height: 1.7;
  color: #444;

  p {
    margin-bottom: 1rem;
  }
`

const Section = styled.section`
  margin-bottom: 4rem;

  &:last-of-type {
    margin-bottom: 1rem;
  }
`

const SectionTitle = styled.h2`
  font-family: ${theme.fonts.inter};
  font-weight: 400;
  font-size: 1rem;
  margin: 3rem 0 1.5rem;
  color: #666;
  letter-spacing: 0.1em;
  text-transform: uppercase;

  &:first-of-type {
    margin-top: 2rem;
  }
`

const TimelineGrid = styled.div`
  max-width: 800px;
  margin: 2rem 0;
`

const TimelineCard = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 2rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  ${mediaQuery.tablet} {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`

const TimelineYear = styled.div`
  font-family: ${theme.fonts.inter};
  font-weight: 300;
  font-size: 0.85rem;
  color: #aaa;
  text-align: right;
  padding-right: 1.5rem;
  border-right: 1px solid #e8e8e8;

  ${mediaQuery.tablet} {
    text-align: left;
    padding-right: 0;
    border-right: none;
    margin-bottom: 0.5rem;
  }
`

const TimelineContent = styled.div`
  font-size: 0.85rem;
  line-height: 1.6;
  color: #333;
  font-weight: 400;
`

const timelineData = [
  {
    year: '2016',
    content: '『君は月夜に光り輝く』で第23回電撃小説大賞〈大賞〉を受賞し、デビュー。',
  },
  {
    year: '2017',
    content: 'デビュー作『君は月夜に光り輝く』刊行。<br>第2作『この世界にiをこめて』発表。',
  },
  {
    year: '2018',
    content: '第3作『アオハル・ポイント』刊行。<br>漫画『君は月夜に光り輝く』（作画：マツセダイチ）連載開始。',
  },
  {
    year: '2019',
    content: '映画『君は月夜に光り輝く』公開（監督：月川翔）。<br>『君は月夜に光り輝く +Fragments』刊行。',
  },
  {
    year: '2020',
    content: '『さよなら世界の終わり』刊行（新潮社・新潮文庫nex）。',
  },
  {
    year: '2022',
    content: '「カクヨム甲子園 2022」最終選考委員を務める。<br>新潮社「yom yom」でエッセイ〈母へ〉連載開始。',
  },
  {
    year: '2023',
    content: '『透明になれなかった僕たちのために』刊行（河出書房新社）。<br>漫画『一年に一度しか会えない君の話。』連載開始。',
  },
  {
    year: '2024',
    content: 'コミック『一年に一度しか会えない君の話。』1巻刊行。<br>短編アンソロジー『君に贈る15ページ』に書き下ろし「わたしたちの教室」収録。',
  },
]

export default function AboutPageClient() {
  return (
    <LayoutV2>
      <Container>
        <HeroSection>
          <ProfileImage>
            <Image
              src="/profile.jpg"
              alt="佐野徹夜"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </ProfileImage>
          
          <ProfileInfo>
            <ProfileLabel>プロフィール</ProfileLabel>
            <ProfileName>佐野徹夜</ProfileName>
            <ProfileText>
              <p>1987年京都府生まれ。同志社大学文学部卒。</p>
              <p>2016年『君は月夜に光り輝く』で第23回電撃小説大賞〈大賞〉を受賞しデビュー。翌17年に同作を刊行しロングセラーとなる。</p>
              <p>以降『この世界にiをこめて』（2017）、『アオハル・ポイント』（2018）、『さよなら世界の終わり』（2020）、『透明になれなかった僕たちのために』（2023）など青春の痛みを描く長篇を次々と発表。</p>
              <p>近年は映像脚本や漫画原作、アニメ原案など活動領域を拡大中。</p>
            </ProfileText>
          </ProfileInfo>
        </HeroSection>

        <Section>
          <SectionTitle>年譜</SectionTitle>
          
          <TimelineGrid>
            {timelineData.map((item, index) => (
              <TimelineCard key={index}>
                <TimelineYear>{item.year}</TimelineYear>
                <TimelineContent dangerouslySetInnerHTML={{ __html: item.content }} />
              </TimelineCard>
            ))}
          </TimelineGrid>
        </Section>
      </Container>
    </LayoutV2>
  )
}