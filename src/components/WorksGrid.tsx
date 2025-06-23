'use client'

import Image from 'next/image'
import Link from 'next/link'
import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { Work } from '@/types'
import { mediaQuery } from '@/styles/responsive'
import { useResponsive } from '@/hooks/useResponsive'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;

  ${mediaQuery.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  ${mediaQuery.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`

const WorkItem = styled(motion.a)`
  display: block;
  transition: ${theme.transitions.hover};
  border-radius: 4px;
  overflow: hidden;
  background: ${theme.colors.light.surface};
  position: relative;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  
  ${mediaQuery.mobile} {
    border-radius: 6px;
  }

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
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  &:hover::before {
    opacity: 1;
  }
  
  /* Touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: scale(0.98);
    }
    
    &:active::before {
      opacity: 1;
    }
  }

  img {
    transition: transform 0.4s ease;
  }

  &:hover img {
    transform: scale(1.02);
  }
`

interface WorksGridProps {
  works: Work[]
}

export const WorksGrid: React.FC<WorksGridProps> = ({ works }) => {
  const { isTouch } = useResponsive()
  
  return (
    <Grid>
      {works.map((work, index) => (
        <WorkItem
          key={work.id}
          href={work.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={!isTouch ? { y: -6 } : {}}
          whileTap={isTouch ? { scale: 0.98 } : {}}
        >
          <Image
            src={work.coverUrl}
            alt={work.title}
            width={200}
            height={283}
            style={{ width: '100%', height: 'auto' }}
            sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 200px"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        </WorkItem>
      ))}
    </Grid>
  )
}