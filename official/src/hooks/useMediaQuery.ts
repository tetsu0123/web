import { useState, useEffect } from 'react'
import { theme } from '@/styles/theme'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      media.addListener(listener)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [matches, query])

  return matches
}

export const useIsMobile = () => useMediaQuery(`(max-width: ${theme.breakpoints.mobile})`)
export const useIsTablet = () => useMediaQuery(`(max-width: ${theme.breakpoints.tablet})`)
export const useIsDesktop = () => useMediaQuery(`(min-width: ${theme.breakpoints.desktop})`)