'use client'

import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 2rem;
  font-family: ${theme.fonts.sansJp};
  font-size: 0.95rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, ${theme.colors.light.hoverBlue}, ${theme.colors.light.meterFill});
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(10, 77, 162, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  ` : `
    background: ${theme.colors.light.surface};
    color: ${theme.colors.light.text};
    border: 1px solid ${theme.colors.light.border};
    
    &:hover {
      background: ${theme.colors.light.bg};
      border-color: ${theme.colors.light.hoverBlue};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
}) => {
  return (
    <StyledButton
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {children}
    </StyledButton>
  )
}