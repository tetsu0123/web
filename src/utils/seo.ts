import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
}

const defaultMeta = {
  title: '佐野徹夜 | Official Site',
  description: '作家 佐野徹夜の公式ウェブサイト。『君は月夜に光り輝く』でデビュー。作品情報、最新ニュース、プロフィールなど。',
  image: '/profile.jpg',
  siteName: '佐野徹夜 Official Site',
}

export const generateMetadata = (props: SEOProps = {}): Metadata => {
  const title = props.title ? `${props.title} | ${defaultMeta.siteName}` : defaultMeta.title
  const description = props.description || defaultMeta.description
  const image = props.image || defaultMeta.image
  const url = props.url || 'https://sanotetsuyaofficial.com'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      url,
      siteName: defaultMeta.siteName,
      type: 'website',
      locale: 'ja_JP',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@dame_murahito',
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}