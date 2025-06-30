'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { Header } from './Header'
import { Footer } from './Footer'
import { GlobalStyles } from '@/styles/GlobalStyles'
import { FloatingParticles } from './FloatingParticles'
import { mediaQuery } from '@/styles/responsive'
import { theme } from '@/styles/theme'

const Main = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: ${theme.spacing[3]} ${theme.spacing[5]} 0;
  
  ${mediaQuery.tablet} {
    padding: ${theme.spacing[2]} ${theme.spacing[4]} 0;
  }
  
  ${mediaQuery.mobile} {
    padding: ${theme.spacing[2]} ${theme.spacing[3]} 0;
  }
`

interface LayoutProps {
  children: ReactNode
  showHeaderTitle?: boolean
  footerLayout?: 'default' | 'homepage'
  disableFloatingParticles?: boolean
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showHeaderTitle = false,
  footerLayout = 'default',
  disableFloatingParticles = false
}) => {
  return (
    <>
      <GlobalStyles />
      {!disableFloatingParticles && <FloatingParticles />}
      <Header showTitle={showHeaderTitle} />
      <Main id="main">{children}</Main>
      <Footer layout={footerLayout} />
    </>
  )
}