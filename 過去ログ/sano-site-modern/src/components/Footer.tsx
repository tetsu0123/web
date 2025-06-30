'use client'

import Link from 'next/link'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { SOCIAL_LINKS } from '@/config'
import { mediaQuery } from '@/styles/responsive'

const FooterWrapper = styled.footer`
  margin-top: 0;
  padding: ${theme.spacing[6]} 0;
  
  ${mediaQuery.mobile} {
    padding: ${theme.spacing[5]} 0;
  }
`

const FooterContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[3]};
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: ${theme.spacing[9]};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[7]};
    text-align: center;
  }
`

const FooterName = styled.div`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.2rem;
  font-weight: 300;
  color: ${theme.colors.light.text};
  letter-spacing: 0.12em;
  margin-top: -0.5rem;
`

const FooterNameLink = styled(Link)`
  font-family: ${theme.fonts.serifJp};
  font-size: 1.2rem;
  font-weight: 300;
  color: ${theme.colors.light.text};
  letter-spacing: 0.12em;
  text-decoration: none;
  transition: ${theme.transitions.hover};
  
  &:hover {
    color: ${theme.colors.light.hoverBlue};
  }
`

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[5]};
  align-items: flex-end;
  
  ${mediaQuery.tablet} {
    align-items: center;
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing[6]};
  align-items: center;

  ${mediaQuery.tablet} {
    gap: ${theme.spacing[5]};
  }
  
  ${mediaQuery.mobile} {
    gap: ${theme.spacing[4]};
  }
`

const SocialLinkItem = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: ${theme.transitions.hover};
  opacity: 0.6;
  filter: grayscale(100%);
  position: relative;
  padding: 4px;

  ${mediaQuery.mobile} {
    padding: 8px;
  }

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
    filter: grayscale(0%);
  }
  
  img {
    display: block;
  }
`

const Copyright = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 0.65rem;
  color: ${theme.colors.light.textLighter};
  letter-spacing: 0.08em;
  opacity: 0.6;
  text-align: right;
  
  ${mediaQuery.tablet} {
    text-align: center;
  }
`

const HomepageFooterContent = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[3]};
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${theme.spacing[5]};
`

const socialLinks = Object.values(SOCIAL_LINKS)

interface FooterProps {
  layout?: 'default' | 'homepage'
}

export const Footer: React.FC<FooterProps> = ({ layout = 'default' }) => {
  if (layout === 'homepage') {
    return (
      <FooterWrapper>
        <HomepageFooterContent>
          <SocialLinks style={{ justifyContent: 'center' }}>
            {socialLinks.map((link) => (
              <SocialLinkItem
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
              >
                <img
                  src={`/${link.icon === 'instagram' ? 'insta' : link.icon}.png`}
                  alt={link.name}
                  style={{ 
                    width: link.icon === 'x' ? '13px' : link.icon === 'note' ? '12px' : '16px',
                    height: link.icon === 'x' ? '13px' : link.icon === 'note' ? '12px' : '16px',
                  }}
                />
              </SocialLinkItem>
            ))}
          </SocialLinks>
          <Copyright style={{ textAlign: 'center' }}>© 2025 Tetsuya Sano</Copyright>
        </HomepageFooterContent>
      </FooterWrapper>
    )
  }

  return (
    <FooterWrapper>
      <HomepageFooterContent>
        <SocialLinks style={{ justifyContent: 'center' }}>
          {socialLinks.map((link) => (
            <SocialLinkItem
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
            >
              <img
                src={`/${link.icon === 'instagram' ? 'insta' : link.icon}.png`}
                alt={link.name}
                style={{ 
                  width: link.icon === 'x' ? '13px' : link.icon === 'note' ? '12px' : '16px',
                  height: link.icon === 'x' ? '13px' : link.icon === 'note' ? '12px' : '16px',
                }}
              />
            </SocialLinkItem>
          ))}
        </SocialLinks>
        <Copyright style={{ textAlign: 'center' }}>© 2025 Tetsuya Sano</Copyright>
      </HomepageFooterContent>
    </FooterWrapper>
  )
}