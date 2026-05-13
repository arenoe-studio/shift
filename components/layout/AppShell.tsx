'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, LayoutDashboard } from 'lucide-react'

import Sidebar from '@/components/layout/Sidebar'

type ActivePage = 'dashboard' | 'forecast'

type AppShellContextValue = {
  activePage: ActivePage
  setActivePage: (page: ActivePage) => void
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

export function useAppShell() {
  const ctx = useContext(AppShellContext)
  if (!ctx) throw new Error('useAppShell must be used within <AppShell />')
  return ctx
}

const TRANSITION = { duration: 0.2, ease: 'easeInOut' } as const

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/forecast', label: 'Forecast', icon: BarChart2 },
] as const

export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')
  const pathname = usePathname()

  const value = useMemo(() => ({ activePage, setActivePage }), [activePage])

  const sidebarWidth = collapsed ? 64 : 220

  return (
    <AppShellContext.Provider value={value}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <motion.div
        className="relative min-h-full bg-[#F4F6F9] max-md:!ml-0 pb-24 md:pb-0"
        animate={{ marginLeft: sidebarWidth }}
        transition={TRANSITION}
      >
        {/* Decorative background logo (all pages) */}
        <div className="fixed bottom-0 right-0 w-[420px] h-[420px] translate-x-1/4 translate-y-1/4 opacity-[0.08] pointer-events-none z-0">
          <img src="/logo.webp" alt="" className="w-full h-full" />
        </div>

        <div className="relative z-[1] min-h-full">{children}</div>
      </motion.div>

      {/* Floating bottom nav — mobile only, frosted glass */}
      <nav
        className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-8 items-center justify-center"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 9999,
          border: '1px solid rgba(30,33,120,0.10)',
          padding: '10px 24px',
          minWidth: 200,
          boxShadow: '0 8px 32px rgba(30,33,120,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1">
              <Icon
                className="h-5 w-5"
                style={{ color: active ? '#1E2178' : '#94A3B8' }}
              />
              <span
                className="font-dmsans text-[9px]"
                style={{
                  color: active ? '#1E2178' : '#94A3B8',
                  fontWeight: active ? 600 : 400,
                }}
              >
                {label}
              </span>
              {active && (
                <span className="w-1 h-1 rounded-full bg-[#F5C400]" />
              )}
            </Link>
          )
        })}
      </nav>
    </AppShellContext.Provider>
  )
}
