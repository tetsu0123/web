'use client'

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const ImageWrapper = styled.div<{ aspectRatio?: string }>`
  position: relative;
  width: 100%;
  aspect-ratio: ${props => props.aspectRatio || 'auto'};
  overflow: hidden;
  background: ${theme.colors.light.meterBg};
  
  ${mediaQuery.mobile} {
    aspect-ratio: ${props => props.aspectRatio || '16/9'};
  }
`

const StyledImage = styled(Image)`
  object-fit: cover;
  transition: opacity 0.3s ease;
  
  &.loading {
    opacity: 0;
  }
  
  &.loaded {
    opacity: 1;
  }
`

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.light.meterBg};
  opacity: 1;
  transition: opacity 0.3s ease;
  
  &.loaded {
    opacity: 0;
    pointer-events: none;
  }
`

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.light.border};
  border-top-color: ${theme.colors.light.hoverBlue};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

interface ResponsiveImageProps extends Omit<ImageProps, 'fill'> {
  aspectRatio?: string
  mobileSrc?: string
  tabletSrc?: string
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  aspectRatio,
  mobileSrc,
  tabletSrc,
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Determine which source to use based on screen size
  const imageSrc = src
  
  return (
    <ImageWrapper aspectRatio={aspectRatio}>
      <picture>
        {mobileSrc && (
          <source
            media={`(max-width: ${theme.breakpoints.mobile})`}
            srcSet={mobileSrc}
          />
        )}
        {tabletSrc && (
          <source
            media={`(max-width: ${theme.breakpoints.tablet})`}
            srcSet={tabletSrc}
          />
        )}
        <StyledImage
          src={imageSrc}
          alt={alt}
          fill
          priority={priority}
          className={isLoaded ? 'loaded' : 'loading'}
          onLoad={() => setIsLoaded(true)}
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
          {...props}
        />
      </picture>
      <LoadingOverlay className={isLoaded ? 'loaded' : ''}>
        <LoadingSpinner />
      </LoadingOverlay>
    </ImageWrapper>
  )
}