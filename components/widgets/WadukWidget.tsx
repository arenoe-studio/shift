import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusChip from '@/components/ui/StatusChip'
import { WSE_CRITICAL, WSE_WARNING } from '@/lib/constants'
import type { WadukData } from '@/types'

type WadukWidgetProps = {
  data: WadukData
}

function computeWseStatus(wse: number): 'normal' | 'warning' | 'critical' {
  if (wse >= WSE_WARNING) return 'normal'
  if (wse >= WSE_CRITICAL) return 'warning'
  return 'critical'
}

function borderClassForStatus(status: 'normal' | 'warning' | 'critical'): string {
  if (status === 'normal') return 'border-[#16A34A]'
  if (status === 'warning') return 'border-[#D97706]'
  return 'border-[#DC2626]'
}

export default function WadukWidget({ data }: WadukWidgetProps) {
  const status = computeWseStatus(data.wse)

  return (
    <Card variant="default" borderColor={borderClassForStatus(status)} className="w-full">
      <div className="flex flex-col gap-4">
        <SectionHeader subtitle="Kondisi Waduk" />

        <div className="flex flex-col gap-1">
          <div className="flex items-end gap-2">
            <div className="text-4xl font-bold leading-none">{data.wse.toFixed(2)}</div>
            <div className="text-sm text-gray-500">masl</div>
          </div>
          <div className="text-sm text-gray-600">
            Volume: <span className="font-medium text-gray-900">{data.volume.toFixed(2)}</span> juta m³
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <StatusChip
            status={status}
            label={status === 'normal' ? 'Normal' : status === 'warning' ? 'Warning' : 'Critical'}
          />
          <Badge label={data.bulan_tahun} color="secondary" />
        </div>
      </div>
    </Card>
  )
}
