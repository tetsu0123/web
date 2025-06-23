'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import styled from '@emotion/styled'

const ImageWrapper = styled.div<{ aspectRatio?: string }>`
  position: relative;
  width: 100%;
  ${props => props.aspectRatio && `aspect-ratio: ${props.aspectRatio};`}
  overflow: hidden;
  background-color: #f0f0f0;
`

const StyledImage = styled(Image)<{ isLoading: boolean }>`
  transition: opacity 0.3s ease-in-out;
  opacity: ${props => props.isLoading ? 0 : 1};
`

const Placeholder = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  aspectRatio?: string
  showPlaceholder?: boolean
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  aspectRatio,
  showPlaceholder = true,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <ImageWrapper aspectRatio={aspectRatio}>
      {showPlaceholder && isLoading && <Placeholder />}
      <StyledImage
        {...props}
        isLoading={isLoading}
        onLoadingComplete={() => setIsLoading(false)}
        loading="lazy"
        quality={85}
      />
    </ImageWrapper>
  )
}