'use client'

import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { motion, AnimatePresence } from 'framer-motion'

const ParticleContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`

const Particle = styled(motion.div)<{ size: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%);
  border-radius: 50%;
`

interface ParticleData {
  id: number
  x: number
  y: number
  size: number
  duration: number
}

export const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<ParticleData[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const maxParticles = 15
    let particleId = 0

    const createParticle = () => {
      if (particles.length >= maxParticles) return

      const newParticle: ParticleData = {
        id: particleId++,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        size: Math.random() * 3 + 2,
        duration: Math.random() * 10 + 15,
      }

      setParticles(prev => [...prev, newParticle])

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id))
      }, newParticle.duration * 1000)
    }

    const interval = setInterval(createParticle, 1000)

    return () => clearInterval(interval)
  }, [isClient, particles.length])

  if (!isClient) return null

  return (
    <ParticleContainer>
      <AnimatePresence>
        {particles.map(particle => (
          <Particle
            key={particle.id}
            size={particle.size}
            initial={{ x: particle.x, y: particle.y, opacity: 0 }}
            animate={{
              y: -50,
              opacity: [0, 0.5, 0.5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.duration,
              ease: 'linear',
            }}
          />
        ))}
      </AnimatePresence>
    </ParticleContainer>
  )
}