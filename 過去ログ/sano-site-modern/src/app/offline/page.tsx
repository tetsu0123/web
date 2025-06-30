'use client'

import styled from '@emotion/styled'
import { Layout } from '@/components/Layout'
import { Container } from '@/components/common'
import { theme } from '@/styles/theme'

const OfflineContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`

const Title = styled.h1`
  font-family: ${theme.fonts.serifJp};
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${theme.colors.light.text};
`

const Message = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.light.textLight};
  line-height: 1.8;
  margin-bottom: 2rem;
`

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
  opacity: 0.5;
`

export default function OfflinePage() {
  return (
    <Layout>
      <Container>
        <OfflineContainer>
          <Icon>📡</Icon>
          <Title>オフラインです</Title>
          <Message>
            インターネット接続がありません。<br />
            接続を確認してから、もう一度お試しください。
          </Message>
        </OfflineContainer>
      </Container>
    </Layout>
  )
}