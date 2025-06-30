'use client'

import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/react'

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`

const skeletonBase = css`
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
`

export const Skeleton = styled.div<{
  width?: string
  height?: string
  variant?: 'text' | 'circular' | 'rectangular'
}>`
  ${skeletonBase}
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '1rem'};
  
  ${props => props.variant === 'circular' && css`
    border-radius: 50%;
  `}
  
  ${props => props.variant === 'text' && css`
    border-radius: 4px;
    transform: scale(1, 0.8);
  `}
`

export const SkeletonGroup = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.gap || '0.5rem'};
`

// Preset skeleton components
export const TextSkeleton = () => (
  <SkeletonGroup>
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="text" width="100%" />
    <Skeleton variant="text" width="60%" />
  </SkeletonGroup>
)

export const CardSkeleton = styled.div`
  ${skeletonBase}
  width: 100%;
  height: 300px;
  border-radius: 8px;
`

export const WorksGridSkeleton = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
    {[1, 2, 3, 4, 5, 6].map(i => (
      <CardSkeleton key={i} />
    ))}
  </div>
)

export const NewsListSkeleton = () => (
  <SkeletonGroup gap="1rem">
    {[1, 2, 3].map(i => (
      <Skeleton key={i} height="2rem" width="90%" />
    ))}
  </SkeletonGroup>
)