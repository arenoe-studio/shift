import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusChip from '@/components/ui/StatusChip'
import { IRR_MODERAT, IRR_OPTIMAL } from '@/lib/constants'
import type { SolarData } from '@/types'

type SolarWidgetProps = {
  data: SolarData & { is_fallback?: boolean }
}

function computeSolarStatus(irrHariIni: number): 'normal' | 'warning' | 'critical' {
  if (irrHariIni >= IRR_OPTIMAL) return 'normal'
  if (irrHariIni >= IRR_MODERAT) return 'warning'
  return 'critical'
}

export default function SolarWidget({ data }: SolarWidgetProps) {
  const status = computeSolarStatus(data.irr_hari_ini)
  const label = status === 'normal' ? 'Optimal' : status === 'warning' ? 'Moderat' : 'Rendah'

  return (
    <Card variant="default" className="w-full">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <SectionHeader subtitle="Irradiasi Surya" />
          {data.is_fallback ? <Badge label="fallback" color="warning" /> : null}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-2">
            <div className="text-4xl font-bold leading-none">{data.irr_hari_ini.toFixed(2)}</div>
            <div className="text-sm text-gray-500">kWh/m²/day</div>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium text-gray-900">{data.irr_rata_bulan.toFixed(2)}</span> rata-rata bulan ini
          </div>
          <div className="text-sm text-gray-600">
            Estimasi output FPV:{' '}
            <span className="font-medium text-gray-900">{data.estimasi_output_fpv.toFixed(0)}</span> MWh est. hari ini
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <StatusChip status={status} label={label} />
        </div>
      </div>
    </Card>
  )
}

