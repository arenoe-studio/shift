'use client'

import type { WadukHistory } from '@/types'

import Card from '@/components/ui/Card'
import Divider from '@/components/ui/Divider'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type GhiTurbineChartProps = {
  data: WadukHistory
  days: number
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

export default function GhiTurbineChart({ data, days }: GhiTurbineChartProps) {
  const interval = tickIntervalForDays(days)
  const barSize = days === 365 ? 1 : days === 90 ? 2 : 4

  return (
    <Card variant="default" className="flex flex-col gap-6">
      <SectionHeader title="GHI & Operasional Turbin" subtitle="Irradiasi surya dan debit turbin harian" />

      <Divider orientation="h" />

      <div className="h-[200px] md:h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="tanggal"
              interval={interval}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
              tickFormatter={(v) => formatShortDate(String(v))}
            />
            <YAxis
              yAxisId="ghi"
              domain={[0, 10]}
              width={45}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
              label={{
                value: 'kWh/m²',
                angle: -90,
                position: 'insideLeft',
                fill: '#94A3B8',
                fontSize: 10,
                fontFamily: 'var(--font-dmsans)',
              }}
            />
            <YAxis
              yAxisId="turbin"
              orientation="right"
              domain={[0, 250]}
              width={45}
              tick={{ fontSize: 9, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
              label={{
                value: 'm³/s',
                angle: -90,
                position: 'insideRight',
                fill: '#94A3B8',
                fontSize: 10,
                fontFamily: 'var(--font-dmsans)',
              }}
            />

            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value: unknown, name) => {
                const key = String(name ?? '')
                if (key === 'ghi') return [`${Number(value).toFixed(2)} kWh/m²`, 'GHI']
                if (key === 'turbine_outflow') return [`${Number(value).toFixed(1)} m³/s`, 'Turbin']
                return [String(value), key]
              }}
              labelFormatter={(label) => formatLongDate(String(label))}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => {
                const key = String(value ?? '')
                if (key === 'ghi') return 'GHI (kWh/m²)'
                if (key === 'turbine_outflow') return 'Turbin (m³/s)'
                return key
              }}
              wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-dmsans)', color: '#94A3B8' }}
            />

            <Bar yAxisId="turbin" dataKey="turbine_outflow" fill="#E2E8F0" opacity={0.8} barSize={barSize} />
            <Line yAxisId="ghi" type="monotone" dataKey="ghi" stroke="#F5C400" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
