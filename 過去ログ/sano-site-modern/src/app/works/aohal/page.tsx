import { metadata, structuredData } from './metadata'
import Script from 'next/script'
import AohalPageClient from './AohalPageClient'

export { metadata }

export default function AohalPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AohalPageClient />
    </>
  )
}