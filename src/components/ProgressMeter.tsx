'use client'

import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { motion } from 'framer-motion'

const Container = styled.div`
  background: ${theme.colors.light.surface};
  border: 1px solid rgba(229, 229, 229, 0.4);
  border-radius: 8px;
  padding: 0.4rem;
  margin: 1.33rem 0 0.25rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  animation: breathe 6s ease-in-out infinite;
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.005); }
  }
`

const Label = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 0.7rem;
  color: ${theme.colors.light.textLighter};
  margin-bottom: 0.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-align: center;
`

const ProgressBar = styled.div`
  width: 85%;
  height: 3px;
  background: ${theme.colors.light.meterBg};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  margin: 0.3rem auto;
`

const ProgressFill = styled(motion.div)<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.light.meterFill}, #6BA6CD);
  border-radius: 2px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: progressShine 6s ease-in-out infinite;
    opacity: 0.6;
  }

  @keyframes progressShine {
    0% { transform: translateX(-100%); opacity: 0; }
    50% { opacity: 0.6; }
    100% { transform: translateX(200%); opacity: 0; }
  }
`

const ProgressText = styled.div`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.8rem;
  color: ${theme.colors.light.textLight};
  margin-top: 0.5rem;
  text-align: center;
  letter-spacing: 0.03em;
`

interface ProgressMeterProps {
  progress?: number
  status?: string
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({ 
  progress = 65, 
  status = '初稿完成' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.3, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.8 }}
    >
      <Container>
        <Label>新作メーター</Label>
        <ProgressBar>
          <ProgressFill
            progress={progress}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 4, ease: 'easeOut' }}
          />
        </ProgressBar>
        <ProgressText>{progress}% ({status})</ProgressText>
      </Container>
    </motion.div>
  )
}