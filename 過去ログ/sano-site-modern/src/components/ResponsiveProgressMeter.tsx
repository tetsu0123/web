'use client'

import styled from '@emotion/styled'
import { theme } from '@/styles/theme'
import { motion } from 'framer-motion'
import { mediaQuery } from '@/styles/responsive'

const Container = styled.div`
  background: ${theme.colors.light.surface};
  border: 1px solid rgba(229, 229, 229, 0.4);
  border-radius: 8px;
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  margin: 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  
  ${mediaQuery.tablet} {
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    margin: 0;
  }
  
  ${mediaQuery.mobile} {
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    margin: 0;
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
  
  ${mediaQuery.mobile} {
    font-size: 0.65rem;
    margin-bottom: 0.4rem;
  }
`

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${theme.colors.light.meterBg};
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  margin: 0.5rem 0;
  
  ${mediaQuery.mobile} {
    height: 3px;
    margin: 0.4rem 0;
  }
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
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: progressShine 6s ease-in-out infinite;  // さらにゆっくりに
    opacity: 0.3;  // より控えめな透明度
  }

  @keyframes progressShine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(400%); }
  }
`

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  
  ${mediaQuery.mobile} {
    margin-top: 0.4rem;
  }
`

const ProgressText = styled.div`
  font-family: ${theme.fonts.sansJp};
  font-size: 0.8rem;
  color: ${theme.colors.light.textLight};
  letter-spacing: 0.03em;
  
  ${mediaQuery.mobile} {
    font-size: 0.75rem;
  }
`

const ProgressPercentage = styled.div`
  font-family: ${theme.fonts.inter};
  font-size: 0.9rem;
  font-weight: 600;
  color: ${theme.colors.light.hoverBlue};
  
  ${mediaQuery.mobile} {
    font-size: 0.85rem;
  }
`

interface ResponsiveProgressMeterProps {
  progress?: number
  status?: string
}

export const ResponsiveProgressMeter: React.FC<ResponsiveProgressMeterProps> = ({ 
  progress = 65, 
  status = '初稿完成' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Container>
      <Label>新作メーター</Label>
      <ProgressBar>
        <ProgressFill
          progress={progress}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </ProgressBar>
      <ProgressInfo>
        <ProgressText>{status}</ProgressText>
        <ProgressPercentage>{progress}%</ProgressPercentage>
      </ProgressInfo>
      </Container>
    </motion.div>
  )
}