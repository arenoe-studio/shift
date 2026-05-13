'use client'

import type { ForecastDay } from '@/types'

import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusChip from '@/components/ui/StatusChip'
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSun,
  Sun,
  TrendingUp,
} from 'lucide-react'

type ForecastTableProps = {
  data: ForecastDay[]
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

function wseStatus(wse: number): 'normal' | 'warning' | 'critical' {
  if (wse >= 100) return 'normal'
  if (wse >= 94.44) return 'warning'
  return 'critical'
}

function formatTanggalLong(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ForecastTable({ data }: ForecastTableProps) {
  return (
    <Card variant="default" className="flex flex-col gap-5">
      <SectionHeader
        title="Detail Forecast 7 Hari"
        subtitle="3 hari data BMKG · 4 hari proyeksi historis"
      />

      <div className="w-full overflow-x-auto">
        <table className="min-w-[800px] md:min-w-[1100px] w-full text-left font-dmsans text-[11px] md:text-[12px]">
          <thead className="sticky top-0 z-10 bg-[#F8FAFC] border-b-2 border-[#F0F4F8]">
            <tr className="font-dmsans text-[9px] font-medium text-[#94A3B8] uppercase tracking-widest">
              <th className="py-2 px-3 md:py-3 md:px-4">Hari</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Tanggal</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Cuaca</th>
              <th className="hidden md:table-cell py-2 px-3 md:py-3 md:px-4">Suhu (°C)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Hujan (mm)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">WSE Proj. (masl)</th>
              <th className="hidden md:table-cell py-2 px-3 md:py-3 md:px-4">IRR (kWh/m²)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Turbin (MW)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">FPV (MW)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Total (MW)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => {
              const { Icon, color } = weatherIcon(row.cuaca)
              const status = wseStatus(row.wse_proyeksi)
              const statusLabel = status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Critical'

              return (
                <tr
                  key={row.tanggal + row.hari}
                  className={[
                    'h-10 md:h-11 border-b border-[#F8FAFC] transition-colors hover:bg-[#FAFBFC]',
                    row.is_actual ? 'bg-white' : 'bg-[#F8FAFC]',
                    status === 'warning' ? 'border-l-[3px] border-l-[#D97706]' : '',
                    status === 'critical' ? 'border-l-[3px] border-l-[#DC2626]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <td className="py-2 px-3 md:py-3 md:px-4">
                    <div className="flex items-center gap-2">
                      <div className="font-dmsans text-[11px] md:text-[12px] text-[#0F172A] font-semibold">{row.hari}</div>
                      {row.is_actual ? (
                        <Badge label="Live" color="success" />
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2 py-[2px] text-[10px] font-medium bg-[#F1F5F9] text-[#475569]">
                          Est.
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-2 px-3 md:py-3 md:px-4 font-dmsans text-[11px] md:text-[12px] text-[#0F172A]">{formatTanggalLong(row.tanggal)}</td>

                  <td className="py-2 px-3 md:py-3 md:px-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                      <span className="font-dmsans text-[11px] md:text-[12px] text-[#0F172A] truncate">{row.cuaca}</span>
                    </div>
                  </td>

                  <td className="hidden md:table-cell py-2 px-3 md:py-3 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.suhu.toFixed(2)}</td>
                  <td className="py-2 px-3 md:py-3 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.curah_hujan.toFixed(2)}</td>

                  <td className="py-2 px-3 md:py-3 md:px-4 font-mono font-semibold text-[11px] md:text-[12px]" style={{ color: wseColor(row.wse_proyeksi) }}>
                    {row.wse_proyeksi.toFixed(2)}
                  </td>

                  <td className="hidden md:table-cell py-2 px-3 md:py-3 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.irr_estimasi.toFixed(2)}</td>
                  <td className="py-2 px-3 md:py-3 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.dispatch_turbin_mw.toFixed(2)}</td>
                  <td className="py-2 px-3 md:py-3 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.dispatch_fpv_mw.toFixed(2)}</td>
                  <td className="py-2 px-3 md:py-3 md:px-4 font-mono font-semibold text-[11px] md:text-[12px] text-[#0F172A]">{row.total_mw.toFixed(2)}</td>

                  <td className="py-2 px-3 md:py-3 md:px-4">
                    <StatusChip status={status} label={statusLabel} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
