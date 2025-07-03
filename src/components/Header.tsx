'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { NAV_ITEMS } from '@/config'
import { MobileNav } from './MobileNav'
import { mediaQuery, responsiveFontSizes } from '@/styles/responsive'

const HeaderWrapper = styled.header`
  max-width: 720px;
  margin: 0 auto;
  padding: 3rem 1rem 1rem;
  text-align: center;
  
  ${mediaQuery.tablet} {
    padding: 2rem 1rem 1rem;
  }
  
  ${mediaQuery.mobile} {
    padding: 1.5rem 1rem 1rem;
  }
`

const Nav = styled.nav`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 3rem;

  ${mediaQuery.tablet} {
    display: none;
  }
`

const NavLink = styled(Link)<{ isActive: boolean }>`
  font-family: ${theme.fonts.inter};
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.75rem;
  color: ${props => props.isActive ? theme.colors.light.hoverBlue : theme.colors.light.textLighter};
  text-decoration: none;
  position: relative;
  transition: color 0.6s ease, opacity 0.6s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 1px;
    background: ${theme.colors.light.hoverBlue};
    transition: width 0.6s ease;
  }

  &:hover {
    color: ${theme.colors.light.hoverBlue};
    opacity: 0.9;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.7rem;
  }
`

const Title = styled.h1`
  font-family: ${theme.fonts.serifJp};
  font-size: 3rem;
  font-weight: 300;
  margin: 0 0 2rem;
  letter-spacing: 0.15em;
  color: ${theme.colors.light.text};
  
  ${mediaQuery.tablet} {
    font-size: 2.5rem;
    margin: 0 0 1.5rem;
  }
  
  ${mediaQuery.mobile} {
    font-size: 2rem;
    letter-spacing: 0.12em;
  }
`

interface HeaderProps {
  showTitle?: boolean
}

export const Header: React.FC<HeaderProps> = ({ showTitle = false }) => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  return (
    <>
      <MobileNav />
      <HeaderWrapper>
        {showTitle && <Title>佐野徹夜</Title>}
        <Nav>
          {NAV_ITEMS.map(item => (
            <NavLink 
              key={item.href} 
              href={item.href} 
              isActive={isActive(item.href)}
            >
              {item.label}
            </NavLink>
          ))}
        </Nav>
      </HeaderWrapper>
    </>
  )
}