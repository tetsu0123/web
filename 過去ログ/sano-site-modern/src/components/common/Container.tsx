'use client'

import styled from '@emotion/styled'

const StyledContainer = styled.div<{ maxWidth?: string }>`
  max-width: ${props => props.maxWidth || '720px'};
  margin: 0 auto;
  padding: 0 1rem;
`

interface ContainerProps {
  children: React.ReactNode
  maxWidth?: '720px' | '800px' | '900px' | '1200px'
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth,
  className 
}) => {
  return (
    <StyledContainer maxWidth={maxWidth} className={className}>
      {children}
    </StyledContainer>
  )
}