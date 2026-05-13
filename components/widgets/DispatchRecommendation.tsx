'use client'

import { Info } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Divider from '@/components/ui/Divider'
import StatusChip from '@/components/ui/StatusChip'
import type { RekomendasiData } from '@/types'

type DispatchRecommendationProps = {
  data: RekomendasiData
}

export default function DispatchRecommendation({ data }: DispatchRecommendationProps) {
  const status = data.status_waduk_aman ? 'normal' : 'critical'
  const label = data.status_waduk_aman ? 'Waduk Aman' : 'Waduk Kritis'

  return (
    <Card variant="default" accentColor="#1E2178" className="h-full flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-poppins font-semibold text-base md:text-[18px] text-[#0F172A] leading-snug">Rekomendasi SHIFT+</h2>
        <Badge label="Rule-Based" color="primary" />
      </div>

      <Divider orientation="h" />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <div className="font-dmsans text-[9px] uppercase tracking-widest text-[#94A3B8]">Dispatch Turbin</div>
          <div className="flex items-end gap-2">
            <div className="font-mono font-bold text-[40px] md:text-[56px] leading-none text-[#1E2178]">
              {Math.round(data.dispatch_turbin_mw)}
            </div>
            <div className="font-dmsans text-[18px] text-[#94A3B8] mb-[8px]">MW</div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="font-dmsans text-[9px] uppercase tracking-widest text-[#94A3B8]">Dispatch FPV</div>
          <div className="flex items-end gap-2">
            <div className="font-mono font-bold text-[28px] md:text-[40px] leading-none text-[#F5C400]">
              {Math.round(data.dispatch_fpv_mw)}
            </div>
            <div className="font-dmsans text-[15px] text-[#94A3B8] mb-[4px]">MW</div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Info className="h-[13px] w-[13px] text-[#94A3B8] mt-[2px] shrink-0" />
        <div className="font-dmsans text-[11px] italic text-[#94A3B8] leading-relaxed line-clamp-2">{data.alasan}</div>
      </div>

      <Divider orientation="h" />

      <div className="mt-auto">
        <div className="bg-[#F8FAFC] rounded-lg px-3 md:px-4 py-2.5 flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <div className="font-dmsans text-[10px] uppercase tracking-widest text-[#94A3B8]">Total Output</div>
            <div className="font-mono font-semibold text-[20px] text-[#0F172A]">
              {Math.round(data.total_mw)} MW
            </div>
          </div>
          <StatusChip status={status} label={label} />
        </div>
      </div>
    </Card>
  )
}
