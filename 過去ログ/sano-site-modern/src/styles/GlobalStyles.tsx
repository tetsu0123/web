'use client'

import { Global, css } from '@emotion/react'
import { theme } from './theme'

export const GlobalStyles = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        font-size: 16px;
        scroll-behavior: smooth;
        -webkit-text-size-adjust: 100%;
        -webkit-tap-highlight-color: transparent;
      }

      body {
        background: ${theme.colors.light.bg};
        color: ${theme.colors.light.text};
        font-family: ${theme.fonts.sansJp};
        line-height: 1.75;
        font-size: 0.95rem;
        letter-spacing: 0.02em;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        touch-action: manipulation;
        overscroll-behavior-y: none;
        
        @media (max-width: ${theme.breakpoints.mobile}) {
          font-size: 0.9rem;
          line-height: 1.65;
        }
      }

      img {
        max-width: 100%;
        height: auto;
      }

      a {
        color: inherit;
        text-decoration: none;
        -webkit-tap-highlight-color: rgba(10, 77, 162, 0.1);
      }

      button, a, input, textarea, select {
        touch-action: manipulation;
      }

      :focus-visible {
        outline: 2px solid ${theme.colors.light.hoverBlue};
        outline-offset: 2px;
      }
      
      /* Improve touch targets on mobile */
      @media (max-width: ${theme.breakpoints.mobile}) {
        button, a {
          min-height: 44px;
          min-width: 44px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: ${theme.colors.light.bg};
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.light.textLight};
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.light.text};
      }
    `}
  />
)