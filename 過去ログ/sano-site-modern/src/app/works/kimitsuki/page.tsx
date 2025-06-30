import { metadata, structuredData } from './metadata'
import Script from 'next/script'
import KimitsukiPageClient from './KimitsukiPageClient'

export { metadata }

export default function KimitsukiPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <KimitsukiPageClient />
    </>
  )
}