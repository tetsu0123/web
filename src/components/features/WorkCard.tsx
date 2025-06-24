'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { Work } from '@/types'

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
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0.02) 100%
    );
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.04),
      0 4px 8px rgba(0, 0, 0, 0.04);
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    opacity: 1;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.06),
      0 8px 24px rgba(0, 0, 0, 0.04);
  }

  img {
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover img {
    transform: scale(1.008);
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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
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