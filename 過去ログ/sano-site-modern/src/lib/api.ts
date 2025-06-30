import { Work, NewsItem, WritingTool } from '@/types'
import { works } from '@/data/works'
import { newsItems } from '@/data/news'
import { writingTools } from '@/data/tools'

// Works API
export const worksApi = {
  getAll: async (): Promise<Work[]> => {
    // In the future, this could fetch from an API
    return Promise.resolve(works)
  },

  getById: async (id: string): Promise<Work | undefined> => {
    return Promise.resolve(works.find(work => work.id === id))
  },

  getFeatured: async (): Promise<Work | undefined> => {
    return Promise.resolve(works.find(work => work.featured))
  },

  getRecent: async (limit: number = 6): Promise<Work[]> => {
    return Promise.resolve(works.slice(0, limit))
  },
}

// News API
export const newsApi = {
  getAll: async (): Promise<NewsItem[]> => {
    return Promise.resolve(newsItems)
  },

  getRecent: async (limit: number = 3): Promise<NewsItem[]> => {
    return Promise.resolve(newsItems.slice(0, limit))
  },

  getByYear: async (year: string): Promise<NewsItem[]> => {
    return Promise.resolve(
      newsItems.filter(item => item.date.startsWith(year))
    )
  },

  getGroupedByYear: async (): Promise<Record<string, NewsItem[]>> => {
    const grouped: Record<string, NewsItem[]> = {}
    
    newsItems.forEach(item => {
      const year = item.date.split('-')[0]
      if (!grouped[year]) {
        grouped[year] = []
      }
      grouped[year].push(item)
    })
    
    return Promise.resolve(grouped)
  },
}

// Tools API
export const toolsApi = {
  getAll: async (): Promise<WritingTool[]> => {
    return Promise.resolve(writingTools)
  },

  getById: async (id: string): Promise<WritingTool | undefined> => {
    return Promise.resolve(writingTools.find(tool => tool.id === id))
  },
}