'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

const StyledSection = styled(motion.section)<{ spacing?: 'normal' | 'large' | 'small' }>`
  margin-top: ${props => {
    if (props.spacing === 'large') return '4rem';
    if (props.spacing === 'small') return '1rem';
    return '3rem';
  }};

  &:first-of-type {
    margin-top: 0;
  }
`

interface SectionProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode
  spacing?: 'normal' | 'large' | 'small'
}

const defaultVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  spacing = 'normal',
  variants = defaultVariants,
  initial = 'hidden',
  animate = 'visible',
  transition = { duration: 0.8 },
  ...props 
}) => {
  return (
    <StyledSection
      spacing={spacing}
      variants={variants}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </StyledSection>
  )
}