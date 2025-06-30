'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { mediaQuery } from '@/styles/responsive'
import { MobileNav } from './MobileNav'

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(252, 252, 252, 0.95);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${mediaQuery.tablet} {
    padding: 1rem;
  }
`

const Logo = styled(Link)`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.65rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  margin: 0;
  color: ${theme.colors.light.text};
  text-decoration: none;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.7;
  }
  
  ${mediaQuery.mobile} {
    font-size: 1.35rem;
  }
`

const Nav = styled.nav`
  display: flex;
  gap: 3rem;
  
  ${mediaQuery.tablet} {
    display: none;
  }
`

const NavLink = styled(Link)`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.9rem;
  color: ${theme.colors.light.text};
  text-decoration: none;
  position: relative;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.6;
  }
`

export const HeaderV2: React.FC = () => {
  return (
    <>
      <MobileNav />
      <HeaderWrapper>
        <HeaderContent>
          <Logo href="/">佐野徹夜</Logo>
          <Nav>
            <NavLink href="/about">プロフィール</NavLink>
            <NavLink href="/works">作品</NavLink>
            <NavLink href="/news">最新情報</NavLink>
          </Nav>
        </HeaderContent>
      </HeaderWrapper>
    </>
  )
}