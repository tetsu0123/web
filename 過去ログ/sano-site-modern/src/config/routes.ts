export const ROUTES = {
  home: '/',
  about: '/about',
  works: '/works',
  news: '/news',
  tools: {
    index: '/tools',
    mojisuu: '/tools/mojisuu',
    henkan: '/tools/henkan',
    kaigyou: '/tools/kaigyou',
    jisage: '/tools/jisage',
    zenkaku: '/tools/zenkaku',
    texttohtml: '/tools/texttohtml',
    scenario: '/tools/scenario',
    txttougou: '/tools/txttougou',
    pdfketugou: '/tools/pdfketugou',
    hozon: '/tools/hozon',
    bukken: '/tools/bukken',
  },
  work: (id: string) => `/works/${id}`,
} as const

export const NAV_ITEMS = [
  { label: 'プロフィール', href: ROUTES.about },
  { label: '作品', href: ROUTES.works },
  { label: '最新情報', href: ROUTES.news },
] as const