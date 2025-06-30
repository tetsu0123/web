export const theme = {
  colors: {
    light: {
      bg: '#FCFCFC',
      text: '#1A1A1A',
      accent: '#1A1A1A',
      hoverBlue: '#0A4DA2',
      meterFill: '#4A90A4',
      meterBg: '#F0F4F6',
      footerBg: '#2C2C2C',
      footerText: '#FFFFFF',
      border: '#E5E5E5',
      surface: '#FFFFFF',
      textLight: '#666666',
      textLighter: '#999999',
    },
    dark: {
      bg: '#0A0A0A',
      text: '#E8E8E8',
      accent: '#E8E8E8',
      hoverBlue: '#4A90E2',
      hoverGold: '#FFD700',
      footerBg: '#1A1A1A',
      footerText: '#FFFFFF',
      border: '#333333',
      surface: '#1A1A1A',
      textLight: '#888888',
      gradientStart: '#4A90E2',
      gradientEnd: '#FFD700',
      glow: 'rgba(74, 144, 226, 0.3)',
    },
  },
  fonts: {
    serifJp: 'var(--font-noto-serif-jp), "Yu Mincho", "Hiragino Mincho ProN", serif',
    sansJp: 'var(--font-noto-sans-jp), "Hiragino Sans", "Yu Gothic", sans-serif',
    inter: 'var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },
  transitions: {
    default: 'all 0.6s ease',
    hover: 'all 0.6s ease',
    slow: 'all 1.2s ease',
  },
  spacing: {
    // 黄金比と音楽的比率に基づく新しい余白システム
    0: '0',
    0.5: '0.25rem',    // 4px
    1: '0.5rem',       // 8px - base
    1.5: '0.625rem',   // 10px
    2: '0.813rem',     // 13px - base × φ
    2.5: '0.875rem',   // 14px
    3: '1rem',         // 16px
    4: '1.25rem',      // 20px - major third
    5: '1.5rem',       // 24px - perfect fifth
    6: '2rem',         // 32px
    7: '2.5rem',       // 40px
    8: '3rem',         // 48px
    9: '4rem',         // 64px
    10: '5rem',        // 80px
    11: '6.5rem',      // 104px
    // Legacy aliases
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
    xxxl: '4rem',
  },
} as const

export type Theme = typeof theme