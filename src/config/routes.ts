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
  { label: 'HOME', href: ROUTES.home },
  { label: 'ABOUT', href: ROUTES.about },
  { label: 'WORKS', href: ROUTES.works },
  { label: 'NEWS', href: ROUTES.news },
] as const