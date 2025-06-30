'use client'

import { ReactNode } from 'react'
import styled from '@emotion/styled'
import { HeaderV2 } from './HeaderV2'
import { Footer } from './Footer'
import { GlobalStyles } from '@/styles/GlobalStyles'
import { FloatingParticles } from './FloatingParticles'
import { mediaQuery } from '@/styles/responsive'
import { theme } from '@/styles/theme'

const Main = styled.main`
  max-width: 720px;
  margin: 0 auto;
  padding: 80px ${theme.spacing[5]} ${theme.spacing[5]};
  min-height: calc(100vh - 200px);
  
  ${mediaQuery.tablet} {
    padding: 70px ${theme.spacing[4]} ${theme.spacing[4]};
  }
  
  ${mediaQuery.mobile} {
    padding: 60px ${theme.spacing[3]} ${theme.spacing[3]};
  }
`

interface LayoutV2Props {
  children: ReactNode
  footerLayout?: 'default' | 'homepage'
  disableFloatingParticles?: boolean
}

export const LayoutV2: React.FC<LayoutV2Props> = ({ 
  children, 
  footerLayout = 'default',
  disableFloatingParticles = false
}) => {
  return (
    <>
      <GlobalStyles />
      {!disableFloatingParticles && <FloatingParticles />}
      <HeaderV2 />
      <Main id="main">{children}</Main>
      <Footer layout={footerLayout} />
    </>
  )
}