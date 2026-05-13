import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import Divider from '@/components/ui/Divider'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusChip from '@/components/ui/StatusChip'
import type { RekomendasiData } from '@/types'

type RekomendasiWidgetProps = {
  data: RekomendasiData
}

function borderForAman(isAman: boolean): string {
  return isAman ? 'border-green-600' : 'border-red-600'
}

export default function RekomendasiWidget({ data }: RekomendasiWidgetProps) {
  const wadukChip = data.status_waduk_aman
    ? ({ status: 'normal' as const, label: 'Waduk Aman' })
    : ({ status: 'critical' as const, label: 'Waduk Kritis' })

  return (
    <Card variant="glass" borderColor={borderForAman(data.status_waduk_aman)} className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-[22px] font-bold">Rekomendasi SHIFT+</div>
              <Badge label="Rule-Based Optimization" color="secondary" />
            </div>
          </div>
          <StatusChip status={wadukChip.status} label={wadukChip.label} />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <SectionHeader subtitle="Input Kondisi" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div className="text-sm text-gray-700">WSE</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900">— masl</div>
                  <StatusChip status={wadukChip.status} label={wadukChip.status === 'normal' ? 'Normal' : 'Critical'} />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div className="text-sm text-gray-700">Curah Hujan</div>
                <div className="text-sm font-medium text-gray-900">— mm/hari</div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div className="text-sm text-gray-700">IRR</div>
                <div className="text-sm font-medium text-gray-900">— kWh/m²/day</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SectionHeader subtitle="Dispatch Rekomendasi" />
            <div className="flex flex-col gap-4">
              <div className="flex items-end justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500">Turbin</div>
                  <div className="text-3xl font-bold leading-none">{data.dispatch_turbin_mw.toFixed(0)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">MW</div>
                  <Badge label="Turbin" color="primary" />
                </div>
              </div>

              <div className="flex items-end justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="flex flex-col">
                  <div className="text-xs text-gray-500">FPV</div>
                  <div className="text-3xl font-bold leading-none">{data.dispatch_fpv_mw.toFixed(0)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">MW</div>
                  <Badge label="FPV" color="success" />
                </div>
              </div>

              <Divider orientation="h" />

              <div className="flex items-end justify-between gap-3">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-xl font-bold">
                  {data.total_mw.toFixed(0)} <span className="text-sm font-medium text-gray-500">MW total</span>
                </div>
              </div>

              <div className="text-[13px] italic text-gray-500">{data.alasan}</div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SectionHeader subtitle="Estimasi Dampak" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div className="text-sm text-gray-700">Energi</div>
                <div className="text-sm font-medium text-gray-900">{data.energi_mwh.toFixed(0)} MWh/hari</div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div className="text-sm text-gray-700">CO₂ avoided</div>
                <div className="text-sm font-medium text-gray-900">{data.co2_avoided_ton.toFixed(0)} tCO₂/hari</div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3">
                <div className="text-sm text-gray-700">Status Aman</div>
                <StatusChip status={wadukChip.status} label={wadukChip.label} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

