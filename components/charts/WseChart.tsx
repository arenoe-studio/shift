'use client'

import type { WadukHistory } from '@/types'

import Card from '@/components/ui/Card'
import Divider from '@/components/ui/Divider'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type WseChartProps = {
  data: WadukHistory
  days: number
  onDaysChange: (days: number) => void
}

function formatShortDate(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function formatLongDate(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function tickIntervalForDays(days: number): number {
  if (days <= 30) return 4
  if (days <= 90) return 9
  return 29
}

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #EAECF0',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  fontFamily: 'var(--font-dmsans)',
  fontSize: 12,
}

export default function WseChart({ data, days, onDaysChange }: WseChartProps) {
  const interval = tickIntervalForDays(days)

  return (
    <Card variant="default" className="flex flex-col gap-6">
      <SectionHeader title="Tren Muka Air Waduk" subtitle="Elevasi harian (masl)" />

      <div className="flex items-center gap-2">
        {([30, 90, 365] as const).map((d) => {
          const active = days === d
          return (
            <button
              key={d}
              type="button"
              onClick={() => onDaysChange(d)}
              className={
                active
                  ? 'h-8 px-3 py-1.5 rounded-lg bg-[#1E2178] text-white text-[11px] font-dmsans'
                  : 'h-8 px-3 py-1.5 rounded-lg border border-[#EAECF0] text-[#64748B] text-[11px] font-dmsans hover:bg-[#F8FAFC]'
              }
            >
              {d === 30 ? '30 Hari' : d === 90 ? '90 Hari' : '1 Tahun'}
            </button>
          )
        })}
      </div>

      <Divider orientation="h" />

      <div className="h-[200px] md:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="tanggal"
              interval={interval}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
              tickFormatter={(v) => formatShortDate(String(v))}
            />
            <YAxis
              domain={[80, 115]}
              width={45}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
              label={{
                value: 'masl',
                angle: -90,
                position: 'insideLeft',
                fill: '#94A3B8',
                fontSize: 10,
                fontFamily: 'var(--font-dmsans)',
              }}
            />

            <ReferenceLine
              y={94.44}
              stroke="#DC2626"
              strokeDasharray="3 3"
              label={{ value: 'Kritis 94.44', position: 'insideTopLeft', fontSize: 10, fill: '#DC2626' }}
            />
            <ReferenceLine
              y={100}
              stroke="#D97706"
              strokeDasharray="3 3"
              label={{ value: 'Waspada 100', position: 'insideTopLeft', fontSize: 10, fill: '#D97706' }}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: unknown, name) => {
                const key = String(name ?? '')
                if (key === 'wse') return [`${Number(value).toFixed(2)} masl`, 'WSE']
                return [String(value), key]
              }}
              labelFormatter={(label) => formatLongDate(String(label))}
            />

            <Area
              type="monotone"
              dataKey="wse"
              stroke="#1E2178"
              strokeWidth={2}
              fill="rgba(30,33,120,0.05)"
              dot={false}
              activeDot={{ r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
