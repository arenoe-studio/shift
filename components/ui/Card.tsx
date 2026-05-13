import type { CSSProperties, ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  variant?: 'default' | 'glass'
  borderColor?: string
  accentColor?: string
  className?: string
}

export default function Card({ children, variant = 'default', borderColor, accentColor, className }: CardProps) {
  const base =
    'rounded-xl p-5 border border-[#EAECF0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.03)] transition-shadow hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]'

  const glass =
    'rounded-xl p-5 border bg-white/[0.85] backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] border-white/70'

  const classes = [
    variant === 'glass' ? glass : base,
    borderColor ?? '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const style: CSSProperties = accentColor
    ? { borderTop: `3px solid ${accentColor}` }
    : {}

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  )
}
