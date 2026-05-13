'use client'

import type { ForecastDay } from '@/types'

import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ForecastWseChartProps = {
  data: ForecastDay[]
}

function dotColor(wse: number) {
  if (wse >= 100) return '#16A34A'
  if (wse >= 94.44) return '#D97706'
  return '#DC2626'
}

function formatTanggalShort(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function formatTanggalLong(iso: string): string {
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return iso
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #EAECF0',
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  fontFamily: 'var(--font-dmsans)',
  fontSize: 12,
}

export default function ForecastWseChart({ data }: ForecastWseChartProps) {
  const boundaryX = data[2]?.tanggal

  return (
    <Card variant="default" className="flex flex-col gap-6">
      <SectionHeader title="Proyeksi Muka Air Waduk" subtitle="7 hari ke depan" />

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" opacity={0.5} vertical={false} />
          <XAxis
            dataKey="tanggal"
            tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
            tickFormatter={(v) => formatTanggalShort(String(v))}
          />
          <YAxis
            domain={[94, 110]}
            width={45}
            tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
            label={{
              value: 'masl',
              angle: -90,
              position: 'insideLeft',
              fill: '#94A3B8',
              fontSize: 11,
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

          {boundaryX ? (
            <ReferenceLine
              x={boundaryX}
              stroke="#9CA3AF"
              strokeDasharray="4 4"
              label={{ value: 'BMKG / Proyeksi', position: 'top', fontSize: 10, fill: '#9CA3AF' }}
            />
          ) : null}

          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: unknown, name, ctx) => {
              const key = String(name ?? '')
              if (key === 'wse_proyeksi') return [`${Number(value).toFixed(2)} masl`, 'WSE']
              if (key === 'is_actual') return [ctx?.payload?.is_actual ? 'BMKG (Actual)' : 'Proyeksi', 'Sumber']
              return [String(value), key]
            }}
            labelFormatter={(label) => formatTanggalLong(String(label))}
          />

          <Line
            type="monotone"
            dataKey="wse_proyeksi"
            stroke="#1E2178"
            strokeWidth={2}
            dot={({ cx, cy, payload }) => {
              if (cx == null || cy == null) return null
              const fill = dotColor(Number(payload?.wse_proyeksi))
              return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="#ffffff" strokeWidth={1} />
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
