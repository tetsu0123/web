'use client'

import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { NewsItem } from '@/types'
import { Card } from '@/components/ui'

const NewsDate = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 0.85rem;
  color: ${theme.colors.light.textLight};
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.05em;
`

const NewsTitle = styled.h3`
  font-family: ${theme.fonts.sansJp};
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;

  a {
    color: ${theme.colors.light.text};
    text-decoration: none;
    transition: ${theme.transitions.default};

    &:hover {
      color: ${theme.colors.light.hoverBlue};
    }
  }
`

const NewsDescription = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.light.textLight};
  margin-top: 0.5rem;
  line-height: 1.6;
`

const StyledCard = styled(Card)`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${theme.colors.light.hoverBlue};
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  }

  &:hover::before {
    transform: translateX(0);
  }
`

interface NewsCardProps {
  item: NewsItem
  index?: number
  animationDelay?: number
}

export const NewsCard: React.FC<NewsCardProps> = ({ 
  item, 
  index = 0,
  animationDelay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 1.2, 
        delay: animationDelay + index * 0.1 
      }}
    >
      <StyledCard variant="bordered">
        <NewsDate>{item.date}</NewsDate>
        <NewsTitle>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          ) : (
            item.title
          )}
        </NewsTitle>
        {item.description && (
          <NewsDescription>{item.description}</NewsDescription>
        )}
      </StyledCard>
    </motion.div>
  )
}