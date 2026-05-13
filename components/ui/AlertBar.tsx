'use client'

import { AlertOctagon, AlertTriangle, CheckCircle } from 'lucide-react'

type AlertBarProps = {
  status: 'normal' | 'warning' | 'critical'
  message: string
}

const MAP = {
  normal: {
    wrap: 'bg-[#F0FDF4] border-b border-[#D1FAE5]',
    text: 'text-[#166534]',
    icon: 'text-[#22C55E]',
    Icon: CheckCircle,
    pulse: false,
  },
  warning: {
    wrap: 'bg-[#FFFBEB] border-b border-[#FDE68A]',
    text: 'text-[#92400E]',
    icon: 'text-[#F59E0B]',
    Icon: AlertTriangle,
    pulse: false,
  },
  critical: {
    wrap: 'bg-[#FFF1F2] border-b border-[#FECDD3]',
    text: 'text-[#BE123C]',
    icon: 'text-[#F43F5E]',
    Icon: AlertOctagon,
    pulse: true,
  },
} as const

export default function AlertBar({ status, message }: AlertBarProps) {
  const s = MAP[status]
  const Icon = s.Icon

  return (
    <div className={`w-full h-10 flex items-center justify-center gap-2 ${s.wrap} ${s.text}`}>
      <Icon className={`h-[15px] w-[15px] ${s.icon} ${s.pulse ? 'animate-pulse' : ''}`} />
      <span className="font-dmsans text-[13px] font-medium">{message}</span>
    </div>
  )
}
