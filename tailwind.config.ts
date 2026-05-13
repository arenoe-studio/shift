import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1E2178', light: '#2D35C4', dark: '#15186B', bg: '#ECEEFF' },
        gold: { DEFAULT: '#F5C400', light: '#FFE566', dark: '#C9A000' },
        surface: { DEFAULT: '#FFFFFF', subtle: '#F1F5F9', base: '#F8FAFC' },
        border: { DEFAULT: '#E2E8F0', subtle: '#F1F5F9' },
      },
      fontFamily: {
        sans: ['var(--font-dmsans)'],
        display: ['var(--font-poppins)'],
        poppins: ['var(--font-poppins)'],
        dmsans: ['var(--font-dmsans)'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        navy: '0 4px 16px rgba(30,33,120,0.12)',
        gold: '0 4px 16px rgba(245,196,0,0.20)',
        card: '0 2px 8px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
