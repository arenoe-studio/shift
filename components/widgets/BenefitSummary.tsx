'use client'

import { Leaf, Sun, Zap } from 'lucide-react'

import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import type { RekomendasiData, SolarData } from '@/types'

type BenefitSummaryProps = {
  rekomendasi: RekomendasiData
  solarData: SolarData
}

function Row({
  icon: Icon,
  iconColor,
  label,
  value,
}: {
  icon: typeof Zap
  iconColor: string
  label: string
  value: string
}) {
  return (
    <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Icon className="h-5 w-5 shrink-0" style={{ color: iconColor }} />
        <div className="font-dmsans text-[11px] text-[#64748B]">{label}</div>
      </div>
      <div className="font-mono font-bold text-[18px] md:text-[22px] text-[#0F172A]">{value}</div>
    </div>
  )
}

export default function BenefitSummary({ rekomendasi, solarData }: BenefitSummaryProps) {
  const energi = Math.max(0, Math.round(rekomendasi.energi_mwh))
  const co2 = Math.max(0, Math.round(rekomendasi.co2_avoided_ton))
  const fpv = Math.max(0, Math.round(solarData.estimasi_output_fpv))

  return (
    <Card variant="default" className="h-full flex flex-col gap-5">
      <SectionHeader title="Estimasi Dampak" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Row icon={Zap} iconColor="#1E2178" label="Total Energi" value={`${energi.toLocaleString()} MWh/hari`} />
        <Row icon={Leaf} iconColor="#16A34A" label="CO₂ Avoided" value={`${co2.toLocaleString()} tCO₂/hari`} />
        <Row icon={Sun} iconColor="#F5C400" label="FPV Output" value={`${fpv.toLocaleString()} MWh`} />
      </div>
    </Card>
  )
}
