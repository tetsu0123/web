'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

const StyledSection = styled(motion.section)<{ spacing?: 'normal' | 'large' | 'small' }>`
  margin-top: ${props => {
    if (props.spacing === 'large') return theme.spacing[6];  // 32px
    if (props.spacing === 'small') return theme.spacing[3];  // 16px
    return theme.spacing[5];  // 24px
  }};
  margin-bottom: 0;

  &:first-of-type {
    margin-top: 0;
  }
`

interface SectionProps extends HTMLMotionProps<'section'> {
  children: React.ReactNode
  spacing?: 'normal' | 'large' | 'small'
}

// より落ち着いたアニメーション設定
const defaultVariants = {
  hidden: { opacity: 0, y: 10 },  // さらに控えめに10pxに減少
  visible: { opacity: 1, y: 0 },
}

export const Section: React.FC<SectionProps> = ({ 
  children, 
  spacing = 'normal',
  variants = defaultVariants,
  initial = 'hidden',
  animate = 'visible',
  transition = { 
    duration: 0.8,  // ゆっくりとしたフェードイン
    ease: [0.25, 0.1, 0.25, 1] // カスタムイージング（より自然な動き）
  },
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