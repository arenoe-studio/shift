type BadgeProps = {
  label: string
  color: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
}

const COLOR_MAP: Record<BadgeProps['color'], { bg: string; text: string }> = {
  primary: { bg: 'bg-[#EEF2FF]', text: 'text-[#3730A3]' },
  secondary: { bg: 'bg-[#FEFCE8]', text: 'text-[#854D0E]' },
  tertiary: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]' },
  success: { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]' },
  warning: { bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]' },
  error: { bg: 'bg-[#FFF1F2]', text: 'text-[#9F1239]' },
}

export default function Badge({ label, color }: BadgeProps) {
  const c = COLOR_MAP[color]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-[3px] font-dmsans text-[11px] font-medium ${c.bg} ${c.text}`}>
      {label}
    </span>
  )
}
