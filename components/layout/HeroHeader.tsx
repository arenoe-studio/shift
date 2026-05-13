'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin } from 'lucide-react'

type HeroHeaderProps = {
  lastUpdated: string
  bmkgStatus: { state: 'live' | 'cached' | 'error'; lokasi: string; timestamp: string }
  neondbStatus: { state: 'live' | 'cached' | 'error' }
  nasaStatus: { state: 'live' | 'cached' | 'error'; timestamp: string }
}

function StatusDot({ state, size = 6 }: { state: 'live' | 'cached' | 'error'; size?: number }) {
  const color = state === 'live' ? '#22C55E' : state === 'cached' ? '#F59E0B' : '#EF4444'
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  )
}

export default function HeroHeader({ lastUpdated, bmkgStatus, neondbStatus, nasaStatus }: HeroHeaderProps) {
  return (
    <motion.header
      className="w-full relative overflow-hidden"
      style={{
        background: '#FFFFFF',
        borderBottom: '1px solid rgba(30,33,120,0.08)',
        boxShadow: '0 2px 20px rgba(30,33,120,0.06)',
      }}
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(135deg, rgba(30,33,120,0.05) 0%, rgba(30,33,120,0.02) 50%, rgba(245,196,0,0.03) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(30,33,120,0.07) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative max-w-screen-xl mx-auto px-4 md:px-10 py-6 md:py-9 min-h-[120px] md:min-h-[110px]">
        {/* Desktop layout */}
        <div className="hidden md:flex items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <img
                src="/logo.webp"
                width={48}
                height={48}
                alt="SHIFT+"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(30,33,120,0.15))' }}
              />
              <div className="flex flex-col gap-0 leading-none">
                <div className="font-poppins font-bold text-[28px] text-[#1E2178]">
                  SHIFT<span className="text-base text-[#F5C400] font-bold">+</span>
                </div>
                <div className="font-dmsans text-[11px] text-[#94A3B8] tracking-wide">
                  Solar Hydro Integrated Framework for Turbine-dispatch
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-[60px]">
              <MapPin className="h-3 w-3 text-[#CBD5E1]" />
              <span className="font-dmsans text-[11px] text-[#94A3B8]">
                Waduk Ir. H. Djuanda, Jatiluhur — Purwakarta, Jawa Barat
              </span>
              <span className="text-[#CBD5E1] font-dmsans text-[11px]">·</span>
              <span className="font-dmsans text-[11px] text-[#CBD5E1]">Perum Jasa Tirta II</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="hidden lg:block w-px h-10 bg-gradient-to-b from-[#F5C400] to-transparent mt-1" />

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-[rgba(30,33,120,0.04)] border border-[rgba(30,33,120,0.08)]">
                  <StatusDot state={bmkgStatus.state} />
                  <span className="font-dmsans text-[10px] text-[#475569]">BMKG Live</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-[rgba(30,33,120,0.04)] border border-[rgba(30,33,120,0.08)]">
                  <StatusDot state={neondbStatus.state} />
                  <span className="font-dmsans text-[10px] text-[#475569]">NeonDB</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1 bg-[rgba(30,33,120,0.04)] border border-[rgba(30,33,120,0.08)]">
                  <StatusDot state={nasaStatus.state} />
                  <span className="font-dmsans text-[10px] text-[#475569]">NASA POWER</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-[11px] w-[11px] text-[#CBD5E1]" />
                <span className="font-dmsans text-[10px] text-[#94A3B8]">Updated</span>
                <span className="font-mono text-[10px] text-[#475569]">{lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col gap-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src="/logo.webp"
                width={36}
                height={36}
                alt="SHIFT+"
                style={{ filter: 'drop-shadow(0 2px 8px rgba(30,33,120,0.15))' }}
              />
              <div className="min-w-0 flex flex-col">
                <div className="font-poppins font-bold text-[20px] text-[#1E2178] leading-none">
                  SHIFT<span className="text-[12px] text-[#F5C400] font-bold">+</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <StatusDot state={bmkgStatus.state} size={8} />
              <StatusDot state={neondbStatus.state} size={8} />
              <StatusDot state={nasaStatus.state} size={8} />
            </div>
          </div>

          <div className="font-dmsans text-[10px] text-[#94A3B8] leading-tight">
            Solar Hydro Integrated Framework for Turbine-dispatch
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="h-2.5 w-2.5 text-[#CBD5E1] shrink-0" />
              <span className="font-dmsans text-[10px] text-[#94A3B8] truncate">
                Waduk Ir. H. Djuanda, Jatiluhur — Purwakarta, Jawa Barat
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#CBD5E1] shrink-0">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
