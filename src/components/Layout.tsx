'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalStyles } from '@/styles/GlobalStyles'
import { FloatingParticles } from './FloatingParticles'
import { mediaQuery } from '@/styles/responsive'

const Main = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem 0;
  
  ${mediaQuery.tablet} {
    padding: 1.5rem 1rem 0;
  }
  
  ${mediaQuery.mobile} {
    padding: 1rem 0.75rem 0;
  }
`

interface LayoutProps {
  children: ReactNode
  showHeaderTitle?: boolean
  footerLayout?: 'default' | 'homepage'
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeaderTitle = false,
  footerLayout = 'default' 
}) => {
  return (
    <>
      <GlobalStyles />
      <FloatingParticles />
      <Header showTitle={showHeaderTitle} />
      <Main id="main">{children}</Main>
      <Footer layout={footerLayout} />
    </>
  )
}