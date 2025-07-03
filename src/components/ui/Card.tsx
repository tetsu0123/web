'use client'

import styled from '@emotion/styled'
import { motion, HTMLMotionProps } from 'framer-motion'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const StyledCard = styled(motion.div)<{ 
  variant?: 'default' | 'bordered' | 'elevated' 
  hoverable?: boolean
}>`
  background: ${theme.colors.light.surface};
  border-radius: ${props => props.variant === 'bordered' ? '8px' : '12px'};
  padding: ${props => props.variant === 'bordered' ? '2rem' : '1.5rem'};
  transition: ${theme.transitions.default};
  
  ${mediaQuery.tablet} {
    padding: ${props => props.variant === 'bordered' ? '1.5rem' : '1.25rem'};
  }
  
  ${mediaQuery.mobile} {
    padding: ${props => props.variant === 'bordered' ? '1.25rem' : '1rem'};
    border-radius: ${props => props.variant === 'bordered' ? '6px' : '8px'};
  }
  
  ${props => props.variant === 'bordered' && `
    border: 1px solid ${theme.colors.light.border};
  `}
  
  ${props => props.variant === 'elevated' && `
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  `}
  
  ${props => props.hoverable && `
    cursor: pointer;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
    }
  `}
`

interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  variant?: 'default' | 'bordered' | 'elevated'
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({ 
  children,
  variant = 'default',
  hoverable = false,
  ...props
}) => {
  return (
    <StyledCard variant={variant} hoverable={hoverable} {...props}>
      {children}
    </StyledCard>
  )
}