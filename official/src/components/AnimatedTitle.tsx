'use client'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'

const Title = styled(motion.h1)<{ fontSize?: string }>`
  font-size: ${props => props.fontSize || '2.5rem'};
  margin: 0;
`

const Character = styled(motion.span)`
  display: inline-block;
`

interface AnimatedTitleProps {
  text: string
  fontSize?: string
  delay?: number
  className?: string
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  text,
  fontSize,
  delay = 0,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [delay])

  const characters = text.split('')

  return (
    <Title fontSize={fontSize} className={className}>
      {characters.map((char, index) => (
        <Character
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </Character>
      ))}
    </Title>
  )
}