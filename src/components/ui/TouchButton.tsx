'use client'

import styled from '@emotion/styled'
import { motion, HTMLMotionProps } from 'framer-motion'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const StyledButton = styled(motion.button)<{
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
}>`
  font-family: ${theme.fonts.sansJp};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: ${theme.transitions.default};
  font-weight: 500;
  position: relative;
  overflow: hidden;
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          min-height: 36px;
        `
      case 'large':
        return `
          padding: 0.875rem 2rem;
          font-size: 1.125rem;
          min-height: 52px;
        `
      default:
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          min-height: 44px;
        `
    }
  }}
  
  /* Mobile touch target optimization */
  ${mediaQuery.mobile} {
    min-height: 48px;
    min-width: 48px;
    padding: 0.875rem 1.25rem;
  }
  
  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${theme.colors.light.hoverBlue}, ${theme.colors.light.meterFill});
          color: white;
          
          &:hover:not(:disabled) {
            box-shadow: 0 4px 15px rgba(10, 77, 162, 0.3);
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'secondary':
        return `
          background: ${theme.colors.light.surface};
          color: ${theme.colors.light.text};
          border: 1px solid ${theme.colors.light.border};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.light.meterBg};
            border-color: ${theme.colors.light.hoverBlue};
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.light.border};
          }
        `
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.light.hoverBlue};
          border: 2px solid ${theme.colors.light.hoverBlue};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.light.hoverBlue};
            color: white;
          }
          
          &:active:not(:disabled) {
            background: ${theme.colors.light.meterFill};
            border-color: ${theme.colors.light.meterFill};
          }
        `
      default:
        return ''
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Touch feedback ripple effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.3s, transform 0.6s;
  }
  
  &:active::after {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0s, transform 0s;
  }
`

interface TouchButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </StyledButton>
  )
}