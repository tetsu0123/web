'use client'

import styled from '@emotion/styled'
import { motion } from 'framer-motion'
import { theme } from '@/styles/theme'
import { NewsItem } from '@/types'

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 1.8;
`

const Item = styled(motion.li)`
  font-size: 0.9rem;
  color: ${theme.colors.light.text};
  transition: all 0.6s ease;
  margin-top: 1rem;

  &:first-of-type {
    margin-top: 0;
  }

  &:hover {
    color: ${theme.colors.light.hoverBlue};
    transform: translateX(3px);
  }

  a {
    color: inherit;
    text-decoration: none;
    font: inherit;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.light.hoverBlue};
    }
  }
`

interface NewsListProps {
  items: NewsItem[]
  animationDelay?: number
}

export const NewsList: React.FC<NewsListProps> = ({ items, animationDelay = 0 }) => {
  return (
    <List>
      {items.map((news, index) => (
        <Item
          key={news.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: animationDelay + index * 0.1 }}
        >
          {news.date}　
          {news.url ? (
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              {news.title}
            </a>
          ) : (
            news.title
          )}
        </Item>
      ))}
    </List>
  )
}