import { css } from '@emotion/react'
import { theme } from './theme'

// Responsive breakpoint utilities
export const mediaQuery = {
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`,
  wide: `@media (min-width: ${theme.breakpoints.wide})`,
}

// Responsive font sizes
export const responsiveFontSizes = {
  h1: css`
    font-size: 2.5rem;
    line-height: 1.2;
    
    ${mediaQuery.tablet} {
      font-size: 2rem;
    }
    
    ${mediaQuery.mobile} {
      font-size: 1.75rem;
    }
  `,
  
  h2: css`
    font-size: 2rem;
    
    ${mediaQuery.tablet} {
      font-size: 1.75rem;
    }
    
    ${mediaQuery.mobile} {
      font-size: 1.5rem;
    }
  `,
  
  h3: css`
    font-size: 1.5rem;
    
    ${mediaQuery.mobile} {
      font-size: 1.25rem;
    }
  `,
  
  body: css`
    font-size: 1rem;
    
    ${mediaQuery.mobile} {
      font-size: 0.95rem;
    }
  `,
  
  small: css`
    font-size: 0.875rem;
    
    ${mediaQuery.mobile} {
      font-size: 0.825rem;
    }
  `,
}

// Responsive spacing
export const responsiveSpacing = {
  section: css`
    padding: 4rem 2rem;
    
    ${mediaQuery.tablet} {
      padding: 3rem 1.5rem;
    }
    
    ${mediaQuery.mobile} {
      padding: 2rem 1rem;
    }
  `,
  
  container: css`
    padding: 0 2rem;
    
    ${mediaQuery.tablet} {
      padding: 0 1.5rem;
    }
    
    ${mediaQuery.mobile} {
      padding: 0 1rem;
    }
  `,
}

// Touch-friendly sizes
export const touchTargetSize = '44px'

export const touchFriendly = css`
  min-height: ${touchTargetSize};
  min-width: ${touchTargetSize};
  
  ${mediaQuery.desktop} {
    min-height: auto;
    min-width: auto;
  }
`