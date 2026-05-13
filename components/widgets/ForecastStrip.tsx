'use client'

import type { ForecastDay } from '@/types'

import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
  TrendingUp,
} from 'lucide-react'

type ForecastStripProps = {
  data: ForecastDay[]
}

function formatTanggal(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

function weatherIcon(cuaca: string) {
  const c = cuaca.toLowerCase()
  if (c.includes('proyeksi')) return { Icon: TrendingUp, color: '#9CA3AF' }
  if (c.includes('hujan lebat')) return { Icon: CloudLightning, color: '#2563EB' }
  if (c.includes('hujan')) return { Icon: CloudRain, color: '#2563EB' }
  if (c.includes('cerah berawan')) return { Icon: CloudSun, color: '#FACC15' }
  if (c.includes('cerah')) return { Icon: Sun, color: '#FACC15' }
  if (c.includes('berawan')) return { Icon: Cloud, color: '#6B7280' }
  return { Icon: Cloud, color: '#6B7280' }
}

function wseColor(wse: number) {
  if (wse >= 100) return '#16A34A'
  if (wse >= 94.44) return '#D97706'
  return '#DC2626'
}

export default function ForecastStrip({ data }: ForecastStripProps) {
  return (
    <Card variant="default" className="flex flex-col gap-5">
      <SectionHeader title="Forecast 7 Hari" subtitle="3 hari BMKG · 4 hari proyeksi" />

      <div className="-mx-5 px-5 md:mx-0 md:px-0 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {data.map((day) => {
          const { Icon, color } = weatherIcon(day.cuaca)

          return (
            <div
              key={day.tanggal + day.hari}
              className={[
                'min-w-[140px] snap-start rounded-xl p-4 border flex flex-col gap-1.5',
                day.is_actual
                  ? 'bg-white border-[#EAECF0]'
                  : 'bg-[#FAFBFC] border-dashed border-[#E2E8F0]',
              ].join(' ')}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="font-dmsans text-[8px] md:text-[9px] font-semibold uppercase tracking-widest text-[#94A3B8]">
                  {day.hari}
                </div>
                <span
                  className={[
                    'inline-flex items-center rounded-full px-2 py-[2px] font-dmsans text-[9px] font-semibold',
                    day.is_actual ? 'bg-[#F0FDF4] text-[#15803D]' : 'bg-[#F8FAFC] text-[#475569]',
                  ].join(' ')}
                >
                  {day.is_actual ? 'Live' : 'Est.'}
                </span>
              </div>

              <div className="font-mono text-[10px] text-[#CBD5E1]">{formatTanggal(day.tanggal)}</div>

              <div className="h-px bg-[#F0F4F8] my-1" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color }} />
                  <div className="font-dmsans text-[11px] text-[#475569] truncate">{day.cuaca}</div>
                </div>
                <div className="font-mono text-[11px] text-[#0F172A] shrink-0">
                  {`${Math.round(day.suhu)}°C`}
                </div>
              </div>

              <div className="flex items-center gap-1 font-dmsans text-[10px] text-[#94A3B8]">
                <CloudRain className="h-3 w-3" />
                <span className="font-mono text-[10px] text-[#475569]">{`${Math.round(day.curah_hujan)} mm`}</span>
              </div>

              <div className="h-px bg-[#F0F4F8] my-1" />

              <div className="flex items-baseline justify-between gap-3">
                <div className="font-dmsans text-[9px] text-[#94A3B8]">WSE</div>
                <div className="flex items-baseline gap-1">
                  <div
                    className="font-mono font-semibold text-[12px] md:text-[13px]"
                    style={{ color: wseColor(day.wse_proyeksi) }}
                  >
                    {day.wse_proyeksi.toFixed(2)}
                  </div>
                  <div className="font-dmsans text-[9px] text-[#94A3B8]">masl</div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-dmsans text-[10px] text-[#94A3B8]">Turbin</div>
                <div className="font-mono text-[10px] md:text-[11px] text-[#475569]">{`${Math.round(day.dispatch_turbin_mw)} MW`}</div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-dmsans text-[10px] text-[#94A3B8]">FPV</div>
                <div className="font-mono text-[10px] md:text-[11px] text-[#F5C400]">{`${Math.round(day.dispatch_fpv_mw)} MW`}</div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-dmsans text-[10px] text-[#94A3B8]">Total</div>
                <div className="font-mono font-semibold text-[12px] text-[#0F172A]">{`${Math.round(day.total_mw)} MW`}</div>
              </div>

              <div className="h-px bg-[#F0F4F8] my-1" />

              <div className="flex items-center justify-between gap-3">
                <div className="font-dmsans text-[9px] text-[#94A3B8]">IRR Est.</div>
                <div className="font-mono text-[10px] text-[#64748B]">{`${day.irr_estimasi.toFixed(2)} kWh/m²`}</div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
