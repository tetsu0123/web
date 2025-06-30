export const SITE_CONFIG = {
  name: '佐野徹夜 Official Site',
  shortName: '佐野徹夜',
  description: '作家 佐野徹夜の公式ウェブサイト。『君は月夜に光り輝く』でデビュー。作品情報、最新ニュース、プロフィールなど。',
  url: 'https://sanotetsuyaofficial.com',
  author: {
    name: '佐野徹夜',
    birthDate: '1987年1月23日',
    birthPlace: '京都府',
    twitter: '@dame_murahito',
  },
} as const

export const SOCIAL_LINKS = {
  twitter: {
    name: 'X',
    url: 'https://x.com/dame_murahito',
    icon: 'x' as const,
  },
  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com/tetsuya.sano123/',
    icon: 'instagram' as const,
  },
  note: {
    name: 'note',
    url: 'https://note.com/sano_tetsuya',
    icon: 'note' as const,
  },
} as const

export const WRITING_CONFIG = {
  manuscriptPageChars: 400,
  defaultProgress: 65,
  defaultStatus: '初稿完成',
} as const

export const ANIMATION_CONFIG = {
  defaultDuration: 0.8,
  defaultDelay: 0,
  staggerDelay: 0.1,
  hover: {
    duration: 0.4,
    scale: 1.02,
  },
} as const

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1200,
} as const