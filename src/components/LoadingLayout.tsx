'use client'

import { Suspense, ReactNode } from 'react'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { Skeleton } from './ui/Skeleton'

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
`

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${theme.colors.light.border};
  border-top-color: ${theme.colors.light.hoverBlue};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const LoadingText = styled.p`
  margin-top: 1rem;
  color: ${theme.colors.light.textLight};
  font-size: 0.9rem;
`

interface LoadingLayoutProps {
  children: ReactNode
  fallback?: ReactNode
  text?: string
}

export const LoadingSpinner = ({ text = '読み込み中...' }: { text?: string }) => (
  <LoadingContainer>
    <Spinner />
    <LoadingText>{text}</LoadingText>
  </LoadingContainer>
)

export const LoadingLayout: React.FC<LoadingLayoutProps> = ({ 
  children, 
  fallback,
  text 
}) => {
  return (
    <Suspense fallback={fallback || <LoadingSpinner text={text} />}>
      {children}
    </Suspense>
  )
}

// Page-specific loading components
export const PageSkeleton = () => (
  <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
    <Skeleton height="3rem" width="60%" style={{ marginBottom: '2rem' }} />
    <Skeleton height="1.5rem" width="80%" style={{ marginBottom: '1rem' }} />
    <Skeleton height="1rem" width="100%" style={{ marginBottom: '0.5rem' }} />
    <Skeleton height="1rem" width="90%" style={{ marginBottom: '0.5rem' }} />
    <Skeleton height="1rem" width="70%" style={{ marginBottom: '2rem' }} />
    <Skeleton height="200px" width="100%" />
  </div>
)