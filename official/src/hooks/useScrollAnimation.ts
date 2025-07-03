import { useEffect, useRef } from 'react'
import { useAnimation, useInView } from 'framer-motion'

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useScrollAnimation = (
  options: UseScrollAnimationOptions = {}
): [React.RefObject<HTMLDivElement | null>, ReturnType<typeof useAnimation>] => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options
  
  const ref = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(ref, {
    amount: threshold,
    once: triggerOnce,
  })

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!triggerOnce) {
      controls.start('hidden')
    }
  }, [isInView, controls, triggerOnce])

  return [ref, controls]
}