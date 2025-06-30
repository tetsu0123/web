/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-light': '#FCFCFC',
        'text-primary': '#1A1A1A',
        'accent': '#1A1A1A',
        'hover-blue': '#0A4DA2',
        'meter-fill': '#4A90A4',
        'meter-bg': '#F0F4F6',
        'footer-bg': '#2C2C2C',
        'footer-text': '#FFFFFF',
        'border': '#E5E5E5',
        'surface': '#FFFFFF',
        'text-light': '#666666',
        'text-lighter': '#999999',
        'bg-dark': '#0A0A0A',
        'text-dark': '#E8E8E8',
        'hover-gold': '#FFD700',
      },
      fontFamily: {
        'serif-jp': ['"Noto Serif JP"', 'Yu Mincho', 'Hiragino Mincho ProN', 'serif'],
        'sans-jp': ['"Noto Sans JP"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'shimmer': 'shimmer 3s infinite',
        'progress-load': 'progressLoad 2.5s ease-out',
        'progress-shine': 'progressShine 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        progressLoad: {
          '0%': { width: '0' },
          '100%': { width: '65%' },
        },
        progressShine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
      },
    },
  },
  plugins: [],
}

