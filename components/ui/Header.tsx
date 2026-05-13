import Divider from '@/components/ui/Divider'
import StatusChip from '@/components/ui/StatusChip'

type HeaderProps = {
  lastUpdated: string
  statusPjtii: 'normal' | 'critical'
  statusBmkg: 'normal' | 'critical'
  statusNasa: 'normal' | 'critical'
}

export default function Header({ lastUpdated, statusPjtii, statusBmkg, statusNasa }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-[#E2E8F0] px-8 py-4 flex justify-between items-center">
      <div className="flex flex-col">
        <div className="font-poppins font-bold text-[28px] leading-none text-[#1E2178]">SHIFT+</div>
        <div className="mt-1 font-dmsans text-[13px] text-[#475569]">
          Solar Hydro Integrated Framework for Turbine-dispatch
        </div>
        <div className="mt-1 font-dmsans text-[12px] text-[#475569]">
          Waduk Ir. H. Djuanda — Jatiluhur, Purwakarta
        </div>
      </div>

      <div className="flex gap-3 items-center">
        <StatusChip status={statusPjtii} label="PJT II / NeonDB" />
        <StatusChip status={statusBmkg} label="BMKG" />
        <StatusChip status={statusNasa} label="NASA POWER" />
        <div className="h-8">
          <Divider orientation="v" />
        </div>
        <div className="font-dmsans text-[12px] text-[#475569]">Updated: {lastUpdated}</div>
      </div>
    </header>
  )
}
