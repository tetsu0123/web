// 黄金比と音楽的比率に基づいた余白システム
// Base unit: 8px (0.5rem)
// Golden ratio (φ): 1.618
// Musical intervals: Major third (1.25), Perfect fourth (1.333), Perfect fifth (1.5)

export const spacing = {
  // Core spacing scale
  0: '0',
  0.5: '0.25rem',    // 4px - micro
  1: '0.5rem',       // 8px - base unit
  1.5: '0.625rem',   // 10px - micro
  2: '0.813rem',     // 13px - base × φ
  2.5: '0.875rem',   // 14px - micro
  3: '1rem',         // 16px - base × 2
  4: '1.25rem',      // 20px - base × 2.5 (major third)
  5: '1.5rem',       // 24px - base × 3 (perfect fifth)
  6: '2rem',         // 32px - base × 4
  7: '2.5rem',       // 40px - base × 5 (fibonacci)
  8: '3rem',         // 48px - base × 6
  9: '4rem',         // 64px - base × 8 (fibonacci)
  10: '5rem',        // 80px - base × 10
  11: '6.5rem',      // 104px - space-9 × φ
  12: '8rem',        // 128px - base × 16
  13: '10.5rem',     // 168px - space-11 × φ
} as const

// Responsive multipliers
export const responsiveMultipliers = {
  desktop: 1.0,      // 100%
  tablet: 0.875,     // 87.5% (7/8 - minor second)
  mobile: 0.75,      // 75% (3/4 - perfect fourth)
} as const

// Component-specific spacing
export const componentSpacing = {
  layout: {
    desktop: { paddingTop: spacing[9], paddingX: spacing[5] },
    tablet: { paddingTop: spacing[8], paddingX: spacing[4] },
    mobile: { paddingTop: spacing[7], paddingX: spacing[3] },
  },
  header: {
    desktop: { paddingTop: spacing[10], paddingX: spacing[5], paddingBottom: spacing[5] },
    tablet: { paddingTop: spacing[9], paddingX: spacing[4], paddingBottom: spacing[4] },
    mobile: { paddingTop: spacing[8], paddingX: spacing[3], paddingBottom: spacing[3] },
    nav: {
      marginTop: spacing[7],
      gap: spacing[8],
    },
    title: {
      marginBottom: spacing[7],
    },
  },
  section: {
    normal: spacing[10],
    large: spacing[11],
    small: spacing[7],
  },
  sectionTitle: {
    desktop: { marginTop: spacing[10], marginBottom: spacing[7] },
    tablet: { marginTop: spacing[9], marginBottom: spacing[6] },
    mobile: { marginTop: spacing[8], marginBottom: spacing[5] },
  },
  progressMeter: {
    desktop: { padding: spacing[5], marginTop: spacing[9], marginBottom: spacing[3] },
    tablet: { padding: spacing[4], marginTop: spacing[8], marginBottom: spacing[2] },
    mobile: { padding: spacing[3], marginTop: spacing[7], marginBottom: spacing[1] },
  },
  footer: {
    desktop: { padding: spacing[9] },
    mobile: { padding: spacing[8] },
    columnGap: spacing[10],
    socialGap: spacing[8],
  },
} as const