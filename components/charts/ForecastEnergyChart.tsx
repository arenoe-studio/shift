'use client'

import type { ForecastDay } from '@/types'

import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type ForecastEnergyChartProps = {
  data: ForecastDay[]
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

export default function ForecastEnergyChart({ data }: ForecastEnergyChartProps) {
  const boundaryX = data[2]?.tanggal

  return (
    <Card variant="default" className="flex flex-col gap-6">
      <SectionHeader title="Proyeksi Energi" subtitle="Dispatch turbin + FPV (MW/hari)" />

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" opacity={0.5} vertical={false} />
          <XAxis
            dataKey="tanggal"
            tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
            tickFormatter={(v) => formatTanggalShort(String(v))}
          />
          <YAxis
            domain={[0, 900]}
            width={45}
            tick={{ fontSize: 11, fill: '#94A3B8', fontFamily: 'var(--font-dmsans)' }}
            label={{
              value: 'MW',
              angle: -90,
              position: 'insideLeft',
              fill: '#94A3B8',
              fontSize: 11,
              fontFamily: 'var(--font-dmsans)',
            }}
          />

          {boundaryX ? <ReferenceLine x={boundaryX} stroke="#9CA3AF" strokeDasharray="4 4" /> : null}

          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: unknown, name) => {
              const key = String(name ?? '')
              if (key === 'dispatch_turbin_mw') return [`${Number(value).toFixed(2)} MW`, 'Turbin']
              if (key === 'dispatch_fpv_mw') return [`${Number(value).toFixed(2)} MW`, 'FPV']
              if (key === 'total_mw') return [`${Number(value).toFixed(2)} MW`, 'Total']
              return [String(value), key]
            }}
            labelFormatter={(label) => formatTanggalLong(String(label))}
          />

          <Legend
            verticalAlign="bottom"
            formatter={(value) => {
              const key = String(value ?? '')
              if (key === 'dispatch_turbin_mw') return 'Turbin'
              if (key === 'dispatch_fpv_mw') return 'FPV'
              if (key === 'total_mw') return 'Total'
              return key
            }}
            wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-dmsans)', color: '#94A3B8' }}
          />

          <Bar dataKey="dispatch_turbin_mw" fill="#1E2178" opacity={0.85} stackId="energy" barSize={28} />
          <Bar dataKey="dispatch_fpv_mw" fill="#F5C400" opacity={0.85} stackId="energy" barSize={28} />
          <Line type="monotone" dataKey="total_mw" stroke="#0F172A" strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  )
}
