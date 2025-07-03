'use client'

import { useState, useEffect } from 'react'
import { theme } from '@/styles/theme'

interface ResponsiveState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  screenWidth: number
  screenHeight: number
}

export const useResponsive = (): ResponsiveState => {
  const [state, setState] = useState<ResponsiveState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
    screenWidth: 0,
    screenHeight: 0,
  })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const mobileBreakpoint = parseInt(theme.breakpoints.mobile)
      const tabletBreakpoint = parseInt(theme.breakpoints.tablet)
      
      setState({
        isMobile: width <= mobileBreakpoint,
        isTablet: width > mobileBreakpoint && width <= tabletBreakpoint,
        isDesktop: width > tabletBreakpoint,
        isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        screenWidth: width,
        screenHeight: height,
      })
    }

    // Initial check
    checkDevice()

    // Add resize listener with debounce
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkDevice, 150)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', checkDevice)
      clearTimeout(timeoutId)
    }
  }, [])

  return state
}

// Custom hook for responsive values
export const useResponsiveValue = <T,>(
  mobile: T,
  tablet: T,
  desktop: T
): T => {
  const { isMobile, isTablet } = useResponsive()
  
  if (isMobile) return mobile
  if (isTablet) return tablet
  return desktop
}