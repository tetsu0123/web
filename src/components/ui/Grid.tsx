'use client'

import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

const StyledGrid = styled.div<{
  columns?: number
  gap?: string
  minChildWidth?: string
}>`
  display: grid;
  gap: ${props => props.gap || '2rem'};
  
  ${props => props.columns 
    ? `grid-template-columns: repeat(${props.columns}, 1fr);`
    : `grid-template-columns: repeat(auto-fit, minmax(${props.minChildWidth || '280px'}, 1fr));`
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: ${props => 
      props.columns && props.columns > 2 
        ? 'repeat(2, 1fr)' 
        : props.columns 
          ? `repeat(${props.columns}, 1fr)`
          : `repeat(auto-fit, minmax(${props.minChildWidth || '280px'}, 1fr))`
    };
    gap: ${props => props.gap === '2rem' ? '1rem' : props.gap};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    grid-template-columns: ${props => 
      props.columns === 1 
        ? '1fr' 
        : 'repeat(auto-fit, minmax(200px, 1fr))'
    };
  }
`

interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: string
  minChildWidth?: string
  className?: string
}

export const Grid: React.FC<GridProps> = ({ 
  children,
  columns,
  gap,
  minChildWidth,
  className
}) => {
  return (
    <StyledGrid 
      columns={columns} 
      gap={gap} 
      minChildWidth={minChildWidth}
      className={className}
    >
      {children}
    </StyledGrid>
  )
}