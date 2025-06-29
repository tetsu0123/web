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
  grid-template-columns: repeat(6, 1fr);
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[3]};
  margin-bottom: 0;

  ${mediaQuery.tablet} {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing[3]};
  }

  ${mediaQuery.mobile} {
    grid-template-columns: repeat(3, 1fr);
    gap: ${theme.spacing[2]};
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
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  &:hover::before {
    opacity: 0.5;
  }
  
  /* Touch device optimization */
  @media (hover: none) and (pointer: coarse) {
    &:active {
      transform: translateY(1px);
    }
    
    &:active::before {
      opacity: 0.5;
    }
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
          initial={index < 6 ? { opacity: 0 } : {}}
          animate={index < 6 ? { opacity: 1 } : {}}
          transition={index < 6 ? { duration: 0.6, delay: 0.1 + index * 0.05, ease: [0.25, 0.1, 0.25, 1] } : {}}
          whileHover={!isTouch ? { y: -2 } : {}}
          whileTap={isTouch ? { y: 1 } : {}}
        >
          <Image
            src={work.coverUrl}
            alt={work.title}
            width={200}
            height={283}
            style={{ width: '100%', height: 'auto' }}
            sizes="(max-width: 480px) 30vw, (max-width: 768px) 30vw, 16vw"
            loading={index < 3 ? 'eager' : 'lazy'}
          />
        </WorkItem>
      ))}
    </Grid>
  )
}