'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'

const Title = styled.h2`
  font-family: ${theme.fonts.serifJp};
  font-weight: 300;
  letter-spacing: 0.08em;
  font-size: 1.3rem;
  margin: 3rem 0 1.5rem;
  color: ${theme.colors.light.textLight};

  &:first-of-type {
    margin-top: 0;
  }
  
  ${mediaQuery.tablet} {
    font-size: 1.2rem;
    margin: 2.5rem 0 1.25rem;
  }
  
  ${mediaQuery.mobile} {
    font-size: 1.1rem;
    margin: 2rem 0 1rem;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.3s ease;
    font-family: ${theme.fonts.inter};
    font-weight: 350;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-size: 1.2rem;

    &:hover {
      color: ${theme.colors.light.hoverBlue};
    }
    
    ${mediaQuery.mobile} {
      font-size: 1.1rem;
      letter-spacing: 0.12em;
    }
  }
`

interface SectionTitleProps {
  children: React.ReactNode
  href?: string
  as?: 'h1' | 'h2' | 'h3'
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ 
  children, 
  href,
  as = 'h2' 
}) => {
  const content = href ? (
    <Link href={href}>{children}</Link>
  ) : (
    children
  )

  return <Title as={as}>{content}</Title>
}