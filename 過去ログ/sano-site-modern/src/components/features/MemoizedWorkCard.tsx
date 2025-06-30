'use client'

import { memo } from 'react'
import Image from 'next/image'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { Work } from '@/types'
import { OptimizedImage } from '../OptimizedImage'

const WorkItem = styled(motion.a)`
  display: block;
  transition: ${theme.transitions.hover};
  border-radius: 4px;
  overflow: hidden;
  background: ${theme.colors.light.surface};
  position: relative;
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(10, 77, 162, 0.1), rgba(74, 144, 164, 0.1));
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  &:hover::before {
    opacity: 1;
  }
`

interface MemoizedWorkCardProps {
  work: Work
  index?: number
  priority?: boolean
}

export const MemoizedWorkCard = memo<MemoizedWorkCardProps>(({ 
  work, 
  index = 0,
  priority = false 
}) => {
  return (
    <WorkItem
      href={work.amazonUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <OptimizedImage
        src={work.coverUrl}
        alt={work.title}
        width={200}
        height={283}
        style={{ width: '100%', height: 'auto' }}
        priority={priority}
        aspectRatio="200/283"
      />
    </WorkItem>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return prevProps.work.id === nextProps.work.id &&
         prevProps.index === nextProps.index &&
         prevProps.priority === nextProps.priority
})

MemoizedWorkCard.displayName = 'MemoizedWorkCard'