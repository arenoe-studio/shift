import { Cloud, CloudLightning, CloudRain, Sun } from 'lucide-react'

import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Divider from '@/components/ui/Divider'
import SectionHeader from '@/components/ui/SectionHeader'
import type { WeatherData } from '@/types'

type WeatherWidgetProps = {
  data: WeatherData & { is_cached?: boolean }
}

function weatherIcon(kondisi: string) {
  if (kondisi === 'Cerah') return Sun
  if (kondisi === 'Berawan') return Cloud
  if (kondisi === 'Hujan Ringan') return CloudRain
  if (kondisi === 'Hujan Lebat') return CloudLightning
  return Cloud
}

function weatherColor(kondisi: string): { icon: string } {
  if (kondisi === 'Cerah') return { icon: 'text-yellow-500' }
  if (kondisi === 'Berawan') return { icon: 'text-gray-500' }
  if (kondisi.startsWith('Hujan')) return { icon: 'text-blue-600' }
  return { icon: 'text-gray-500' }
}

function shortDate(isoOrDate: string): string {
  const d = new Date(isoOrDate)
  if (Number.isNaN(d.getTime())) return isoOrDate
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

export default function WeatherWidget({ data }: WeatherWidgetProps) {
  const Icon = weatherIcon(data.kondisi)
  const color = weatherColor(data.kondisi)

  return (
    <Card variant="default" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader subtitle="Cuaca & Prakiraan" />
          {data.is_cached ? <Badge label="cached" color="warning" /> : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon className={`h-7 w-7 ${color.icon}`} />
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-900">{data.kondisi}</div>
              <div className="text-xs text-gray-500">Suhu & curah hujan</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="text-gray-700">
              <span className="font-medium text-gray-900">{data.suhu.toFixed(1)}</span> °C
            </div>
            <Divider orientation="v" />
            <div className="text-gray-700">
              <span className="font-medium text-gray-900">{data.curah_hujan.toFixed(1)}</span> mm/hari
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {data.prakiraan.slice(0, 3).map((p) => {
            const PIcon = weatherIcon(p.kondisi)
            const pColor = weatherColor(p.kondisi)
            return (
              <div key={p.hari} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-3">
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500">{shortDate(p.hari)}</div>
                  <div className="text-sm font-medium text-gray-900">{p.suhu.toFixed(0)}°C</div>
                </div>
                <PIcon className={`h-5 w-5 ${pColor.icon}`} />
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Badge label={data.lokasi} color="secondary" />
        </div>
      </div>
    </Card>
  )
}
