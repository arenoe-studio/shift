type DataStatusBarProps = {
  bmkg: { live: boolean; timestamp: string; lokasi: string }
  neondb: { live: boolean }
  nasapower: { live: boolean; timestamp: string }
}

function Dot({ state }: { state: 'live' | 'cached' | 'error' }) {
  if (state === 'live') {
    return (
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-[#22C55E]"
        style={{ boxShadow: '0 0 0 3px rgba(34,197,94,0.12)' }}
      />
    )
  }
  return <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#EF4444]" />
}

export default function DataStatusBar({ bmkg, neondb, nasapower }: DataStatusBarProps) {
  return (
    <div className="w-full bg-white border-b border-[#F0F4F8] px-8 py-2">
      <div className="max-w-screen-xl mx-auto flex items-center gap-0 divide-x divide-[#F0F4F8]">
        <div className="flex items-center gap-2 pr-6">
          <Dot state={bmkg.live ? 'live' : 'cached'} />
          <span className="font-dmsans text-[10px] text-[#94A3B8]">
            <span className="font-semibold text-[#475569]">BMKG</span>
            {' '}
            {bmkg.live ? `Live — ${bmkg.timestamp} · ${bmkg.lokasi}` : 'Cached'}
          </span>
        </div>

        <div className="flex items-center gap-2 px-6">
          <Dot state={neondb.live ? 'live' : 'error'} />
          <span className="font-dmsans text-[10px] text-[#94A3B8]">
            <span className="font-semibold text-[#475569]">NeonDB</span>
            {' '}
            {neondb.live ? 'Connected — data per 31 Des 2025' : 'Error'}
          </span>
        </div>

        <div className="flex items-center gap-2 pl-6">
          <Dot state={nasapower.live ? 'live' : 'cached'} />
          <span className="font-dmsans text-[10px] text-[#94A3B8]">
            <span className="font-semibold text-[#475569]">NASA POWER</span>
            {' '}
            {nasapower.live ? `Live — ${nasapower.timestamp}` : 'Fallback'}
          </span>
        </div>
      </div>
    </div>
  )
}
