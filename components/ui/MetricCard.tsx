'use client'

import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'

type MetricCardProps = {
  label: string
  value: string | number
  unit: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  statusColor?: string
}

export default function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  statusColor,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl px-4 py-3.5 md:px-5 md:py-4 border border-[#EAECF0] shadow-[0_1px_2px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:border-[#E2E8F0] transition-[box-shadow,border-color] duration-200 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="font-dmsans text-[10px] uppercase tracking-widest text-[#94A3B8]">{label}</div>
        <Icon className="h-4 w-4 md:h-[18px] md:w-[18px]" style={{ color: statusColor ?? '#CBD5E1' }} />
      </div>

      <div className="flex items-baseline gap-1">
        <div className="font-mono font-bold text-[26px] md:text-[42px] leading-none text-[#0F172A]">{value}</div>
        <div className="font-dmsans text-[12px] md:text-[14px] text-[#94A3B8] leading-none">{unit}</div>
      </div>

      {trend && trend !== 'neutral' ? (
        <div className="flex items-center gap-1.5">
          {trend === 'up' ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium bg-[#F0FDF4] text-[#16A34A]">
              <TrendingUp className="h-3 w-3" />
              Naik
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[11px] font-medium bg-[#FEF2F2] text-[#DC2626]">
              <TrendingDown className="h-3 w-3" />
              Turun
            </span>
          )}
        </div>
      ) : null}
    </div>
  )
}
