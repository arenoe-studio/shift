'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { BarChart2, ChevronLeft, ChevronRight, LayoutDashboard } from 'lucide-react'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

const TRANSITION = { duration: 0.2, ease: 'easeInOut' } as const

function NavItem({
  collapsed,
  active,
  label,
  href,
  icon: Icon,
}: {
  collapsed: boolean
  active: boolean
  label: string
  href: string
  icon: typeof LayoutDashboard
}) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={[
        'relative w-full h-10 rounded-lg flex items-center gap-3 px-3 transition-colors duration-150',
        active
          ? 'bg-[#EEF2FF] text-[#1E2178]'
          : 'text-[#64748B] hover:text-[#1E2178] hover:bg-[#F8FAFC]',
        collapsed ? 'justify-center px-0' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#F5C400] rounded-r-full" />
      )}
      <Icon
        className="h-4 w-4 shrink-0"
        style={{ color: active ? '#1E2178' : '#94A3B8' }}
      />
      {collapsed ? null : (
        <span className="font-dmsans text-[13px] font-medium">{label}</span>
      )}
    </Link>
  )
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const isForecast = pathname === '/forecast' || pathname.startsWith('/forecast/')
  const isDashboard = !isForecast

  return (
    <motion.aside
      className="max-md:hidden fixed left-0 top-0 h-screen bg-white border-r border-[#F0F4F8] z-30 flex flex-col"
      animate={{ width: collapsed ? 64 : 220 }}
      transition={TRANSITION}
    >
      <div className={['pt-5 pb-4', collapsed ? 'px-3' : 'px-4'].join(' ')}>
        <div className={collapsed ? 'flex items-center justify-center' : 'flex flex-col'}>
          {collapsed ? (
            <img src="/logo.webp" width={28} height={28} alt="SHIFT+" />
          ) : (
            <div className="flex items-center gap-2">
              <img src="/logo.webp" width={28} height={28} alt="SHIFT+" />
              <div className="font-poppins font-bold text-[18px] text-[#1E2178] leading-none">SHIFT+</div>
            </div>
          )}
          {collapsed ? null : (
            <div className="font-dmsans text-[10px] text-[#94A3B8] mt-1.5">Jatiluhur · PJT II</div>
          )}
        </div>
      </div>

      <div className="mx-3 h-px bg-[#F0F4F8] mb-2" />

      <nav className={['flex flex-col gap-1', collapsed ? 'px-2' : 'px-3'].join(' ')}>
        <NavItem collapsed={collapsed} active={isDashboard} label="Dashboard" href="/" icon={LayoutDashboard} />
        <NavItem collapsed={collapsed} active={isForecast} label="Forecast & Log" href="/forecast" icon={BarChart2} />
      </nav>

      <div className="mt-auto flex flex-col gap-3 p-3">
        {collapsed ? null : (
          <div className="font-dmsans text-[10px] text-[#CBD5E1] text-center">v1.0</div>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="w-full h-9 rounded-lg flex items-center justify-center transition-colors duration-150 bg-[#F8FAFC] border border-[#F0F4F8] text-[#64748B] hover:bg-[#EEF2FF] hover:text-[#1E2178]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  )
}
