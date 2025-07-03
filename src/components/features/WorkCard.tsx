'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { Work } from '@/types'

const WorkItem = styled(motion.a)`
  display: block;
  transition: all 0.6s ease;
  border-radius: 4px;
  overflow: hidden;
  background: ${theme.colors.light.surface};
  position: relative;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
    border-color: rgba(10, 77, 162, 0.1);
  }
`

interface WorkCardProps {
  work: Work
  index?: number
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, index = 0 }) => {
  return (
    <WorkItem
      href={work.amazonUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: index * 0.1 }}
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