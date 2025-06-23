export interface Work {
  id: string
  title: string
  publisher: string
  year: number
  coverUrl: string
  amazonUrl: string
  description?: string
  featured?: boolean
  number?: string
}

export interface NewsItem {
  id: string
  date: string
  title: string
  url?: string
  description?: string
}

export interface WritingTool {
  id: string
  name: string
  description: string
  path: string
}

export interface SocialLink {
  name: string
  url: string
  icon: 'x' | 'instagram' | 'note'
}