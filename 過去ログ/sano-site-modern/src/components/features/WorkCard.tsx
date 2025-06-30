'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { Work } from '@/types'

const WorkItem = styled(motion.a)`
  display: block;
  transition: all 0.3s ease;
  border-radius: 4px;
  overflow: hidden;
  background: ${theme.colors.light.surface};
  position: relative;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);  // -4px → -2pxに減少
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);  // より控えめな影
  }
`

interface WorkCardProps {
  work: Work
  index?: number
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, index = 0 }) => {
  // 各カードを個別にアニメーションさせる代わりに、
  // グループとしてアニメーションさせる
  const shouldAnimate = index < 3  // 最初の3つだけアニメーション
  
  return (
    <WorkItem
      href={work.amazonUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { 
        duration: 0.4, 
        delay: index * 0.05,  // 0.1 → 0.05に減少
        ease: 'easeOut'
      } : undefined}
    >
      <Image
        src={work.coverUrl}
        alt={work.title}
        width={200}
        height={283}
        style={{ width: '100%', height: 'auto' }}
      />
    </WorkItem>
  )
}