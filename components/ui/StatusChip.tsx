type StatusChipProps = {
  status: 'normal' | 'warning' | 'critical' | 'active'
  label: string
}

const STATUS_MAP: Record<StatusChipProps['status'], { bg: string; text: string; dot: string; pulse: boolean }> = {
  normal: { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', dot: 'bg-[#22C55E]', pulse: false },
  warning: { bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', dot: 'bg-[#F59E0B]', pulse: false },
  critical: { bg: 'bg-[#FFF1F2]', text: 'text-[#9F1239]', dot: 'bg-[#F43F5E]', pulse: true },
  active: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', dot: 'bg-[#2563EB]', pulse: true },
}

export default function StatusChip({ status, label }: StatusChipProps) {
  const s = STATUS_MAP[status]
  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 font-dmsans text-[11px] font-medium ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} ${s.pulse ? 'animate-pulse' : ''}`} />
      <span>{label}</span>
    </span>
  )
}
