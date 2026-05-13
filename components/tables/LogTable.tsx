'use client'

import type { WadukLogItem } from '@/types'

import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusChip from '@/components/ui/StatusChip'
import { Download } from 'lucide-react'

type LogTableProps = {
  data: WadukLogItem[]
  days: number
  onDaysChange: (days: number) => void
}

function statusLabel(status: WadukLogItem['status']): string {
  if (status === 'normal') return 'Normal'
  if (status === 'warning') return 'Warning'
  return 'Critical'
}

function toCsv(rows: WadukLogItem[]) {
  const header = ['tanggal', 'wse', 'ghi', 'turbine_outflow', 'volume', 'status']
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    const needs = s.includes(',') || s.includes('"') || s.includes('\n')
    const quoted = `"${s.replace(/\"/g, '""')}"`
    return needs ? quoted : s
  }
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        r.tanggal,
        r.wse.toFixed(2),
        r.ghi.toFixed(2),
        r.turbine_outflow.toFixed(2),
        r.volume.toFixed(2),
        r.status,
      ]
        .map(escape)
        .join(','),
    )
  }
  return lines.join('\n')
}

function downloadCsv(rows: WadukLogItem[]) {
  const csv = toCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const tanggal = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `shift-plus-log-${tanggal}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function LogTable({ data, days, onDaysChange }: LogTableProps) {
  return (
    <Card variant="default" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <SectionHeader title="Log Harian Waduk" subtitle="Data operasional dari NeonDB" />

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => downloadCsv(data)}
            className="h-8 px-3 rounded-lg text-[11px] font-dmsans text-[#64748B] border border-[#EAECF0] bg-white hover:bg-[#F8FAFC] inline-flex items-center gap-2"
            title="Export CSV"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>

          {([30, 90, 365] as const).map((d) => {
            const active = days === d
            return (
              <button
                key={d}
                type="button"
                onClick={() => onDaysChange(d)}
                className={
                  active
                    ? 'h-8 px-3 rounded-lg bg-[#1E2178] text-white text-[11px] font-dmsans'
                    : 'h-8 px-3 rounded-lg border border-[#EAECF0] bg-white text-[#64748B] text-[11px] font-dmsans hover:bg-[#F8FAFC]'
                }
              >
                {d === 30 ? '30 Hari' : d === 90 ? '90 Hari' : '1 Tahun'}
              </button>
            )
          })}
        </div>
      </div>

      <div className="max-h-[400px] overflow-x-auto overflow-y-auto rounded-xl border border-[#EAECF0]">
        <table className="w-full text-left font-dmsans text-[11px] md:text-[12px]">
          <thead className="sticky top-0 z-10 bg-[#F8FAFC] border-b-2 border-[#F0F4F8]">
            <tr className="font-dmsans text-[9px] font-medium text-[#94A3B8] uppercase tracking-widest">
              <th className="py-2 px-3 md:py-3 md:px-4">Tanggal</th>
              <th className="py-2 px-3 md:py-3 md:px-4">WSE (masl)</th>
              <th className="hidden md:table-cell py-2 px-3 md:py-3 md:px-4">GHI (kWh/m²)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Turbin (m³/s)</th>
              <th className="hidden md:table-cell py-2 px-3 md:py-3 md:px-4">Volume (juta m³)</th>
              <th className="py-2 px-3 md:py-3 md:px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => {
              const border =
                row.status === 'critical'
                  ? 'border-l-[3px] border-l-[#DC2626]'
                  : row.status === 'warning'
                    ? 'border-l-[3px] border-l-[#D97706]'
                    : 'border-l-[3px] border-l-transparent'

              const bg = idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFBFC]'

              return (
                <tr
                  key={row.tanggal}
                  className={`${bg} ${border} h-10 md:h-11 border-b border-[#F8FAFC] hover:bg-[#FAFBFC] transition-colors`}
                >
                  <td className="py-2 px-3 md:py-2.5 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.tanggal}</td>
                  <td className="py-2 px-3 md:py-2.5 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.wse.toFixed(2)}</td>
                  <td className="hidden md:table-cell py-2 px-3 md:py-2.5 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.ghi.toFixed(2)}</td>
                  <td className="py-2 px-3 md:py-2.5 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.turbine_outflow.toFixed(2)}</td>
                  <td className="hidden md:table-cell py-2 px-3 md:py-2.5 md:px-4 font-mono text-[11px] md:text-[12px] text-[#0F172A]">{row.volume.toFixed(2)}</td>
                  <td className="py-2 px-3 md:py-2.5 md:px-4">
                    <StatusChip status={row.status} label={statusLabel(row.status)} />
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
