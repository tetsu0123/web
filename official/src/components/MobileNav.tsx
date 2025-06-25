'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '@/styles/theme'
import { NAV_ITEMS } from '@/config'
import { mediaQuery } from '@/styles/responsive'

const MobileNavWrapper = styled.div`
  display: none;
  
  ${mediaQuery.tablet} {
    display: block;
  }
`

const MenuButton = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1001;
  background: ${theme.colors.light.surface};
  border: 1px solid ${theme.colors.light.border};
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    background: ${theme.colors.light.bg};
  }
`

const MenuBar = styled.span<{ isOpen: boolean }>`
  width: 24px;
  height: 2px;
  background: ${theme.colors.light.text};
  transition: ${theme.transitions.default};
  
  &:nth-of-type(1) {
    transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
  }
  
  &:nth-of-type(2) {
    opacity: ${props => props.isOpen ? 0 : 1};
  }
  
  &:nth-of-type(3) {
    transform: ${props => props.isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
  }
`

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${theme.colors.light.bg};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`

const MobileNavLink = styled(Link)`
  font-family: ${theme.fonts.inter};
  font-size: 1.5rem;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${theme.colors.light.text};
  text-decoration: none;
  padding: 1rem 0;
  transition: ${theme.transitions.default};
  
  &:hover {
    color: ${theme.colors.light.hoverBlue};
  }
`

const CloseArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
`

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <MobileNavWrapper>
      <MenuButton onClick={() => setIsOpen(!isOpen)} aria-label="メニュー">
        <MenuBar isOpen={isOpen} />
        <MenuBar isOpen={isOpen} />
        <MenuBar isOpen={isOpen} />
      </MenuButton>

      <AnimatePresence>
        {isOpen && (
          <MobileMenu
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <CloseArea onClick={() => setIsOpen(false)} />
            {NAV_ITEMS.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MobileNavLink href={item.href} onClick={() => setIsOpen(false)}>
                  {item.label}
                </MobileNavLink>
              </motion.div>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </MobileNavWrapper>
  )
}