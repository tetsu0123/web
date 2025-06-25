import { useState, useEffect } from 'react'
import { useScroll, useTransform, MotionValue } from 'framer-motion'

interface UseParallaxOptions {
  offset?: number
  damping?: number
}

export const useParallax = (
  options: UseParallaxOptions = {}
): MotionValue<number> => {
  const { offset = 50, damping = 0.5 } = options
  const { scrollY } = useScroll()
  
  const y = useTransform(
    scrollY,
    [0, offset],
    [0, -offset * damping]
  )

  return y
}

export const useHeaderParallax = () => {
  const [headerOffset, setHeaderOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.1
      setHeaderOffset(rate)
    }

    let ticking = false
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', requestTick)
    return () => window.removeEventListener('scroll', requestTick)
  }, [])

  return headerOffset
}