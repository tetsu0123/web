import dynamic from 'next/dynamic'

// Lazy load heavy components
export const LazyWorksGrid = dynamic(
  () => import('./WorksGrid').then(mod => mod.WorksGrid),
  { 
    loading: () => <div>Loading...</div>,
    ssr: true 
  }
)

export const LazyProgressMeter = dynamic(
  () => import('./ProgressMeter').then(mod => mod.ProgressMeter),
  { 
    loading: () => <div style={{ height: '100px' }} />,
    ssr: true 
  }
)

export const LazyFloatingParticles = dynamic(
  () => import('./FloatingParticles').then(mod => mod.FloatingParticles),
  { 
    loading: () => null,
    ssr: false 
  }
)