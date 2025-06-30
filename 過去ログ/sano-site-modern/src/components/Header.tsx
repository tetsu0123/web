'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { NAV_ITEMS } from '@/config'
import { MobileNav } from './MobileNav'
import { mediaQuery, responsiveFontSizes } from '@/styles/responsive'

const HeaderWrapper = styled.header`
  width: 100%;
  padding: ${theme.spacing[5]} ${theme.spacing[5]} ${theme.spacing[3]};
  text-align: center;
  
  ${mediaQuery.tablet} {
    padding: ${theme.spacing[4]} ${theme.spacing[4]} ${theme.spacing[2]};
  }
  
  ${mediaQuery.mobile} {
    padding: ${theme.spacing[3]} ${theme.spacing[3]} ${theme.spacing[2]};
  }
`

const Nav = styled.nav`
  margin-top: ${theme.spacing[3]};
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
  justify-items: center;

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
  transition: ${theme.transitions.hover};

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: ${props => props.isActive ? '100%' : '0'};
    height: 1px;
    background: ${theme.colors.light.hoverBlue};
    transition: width 0.4s ease;
  }

  &:hover {
    color: ${theme.colors.light.hoverBlue};
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
  margin: 0 auto ${theme.spacing[2]};
  max-width: 720px;
  letter-spacing: 0.15em;
  color: ${theme.colors.light.text};
  
  ${mediaQuery.tablet} {
    font-size: 2.5rem;
    margin: 0 auto ${theme.spacing[1]};
  }
  
  ${mediaQuery.mobile} {
    font-size: 2rem;
    letter-spacing: 0.12em;
    margin: 0 auto ${theme.spacing[1]};
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
          {NAV_ITEMS.map((item, index) => (
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