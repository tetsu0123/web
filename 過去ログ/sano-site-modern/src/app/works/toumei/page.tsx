import { metadata, structuredData } from './metadata'
import Script from 'next/script'
import ToumeiPageClient from './ToumeiPageClient'

export { metadata }

export default function ToumeiPage() {
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ToumeiPageClient />
    </>
  )
}