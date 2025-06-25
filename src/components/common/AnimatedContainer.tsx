'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import styled from '@emotion/styled'

const StyledContainer = styled(motion.div)<{ maxWidth?: string }>`
  max-width: ${props => props.maxWidth || '800px'};
  margin: 0 auto;
`

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  maxWidth?: string
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({ 
  children,
  maxWidth,
  initial = { opacity: 0, y: 10 },
  animate = { opacity: 1, y: 0 },
  transition = { duration: 1.2 },
  ...props
}) => {
  return (
    <StyledContainer
      maxWidth={maxWidth}
      initial={initial}
      animate={animate}
      transition={transition}
      {...props}
    >
      {children}
    </StyledContainer>
  )
}