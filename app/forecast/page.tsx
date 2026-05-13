'use client'

import { useEffect, useRef, useState } from 'react'

import ForecastEnergyChart from '@/components/charts/ForecastEnergyChart'
import ForecastWseChart from '@/components/charts/ForecastWseChart'
import { useAppShell } from '@/components/layout/AppShell'
import HeroHeader from '@/components/layout/HeroHeader'
import Card from '@/components/ui/Card'
import ForecastTable from '@/components/tables/ForecastTable'
import LogTable from '@/components/tables/LogTable'
import { getForecast, getWadukLog } from '@/lib/api'
import type { ForecastDay, WadukLogItem } from '@/types'

function SkeletonBlock({ height }: { height: number }) {
  return <div className="w-full animate-pulse bg-[#F1F5F9] rounded-2xl" style={{ height }} />
}

function DataUnavailable() {
  return (
    <Card variant="default" className="w-full flex items-center justify-center min-h-[180px]">
      <div className="font-dmsans text-sm text-gray-500">Data tidak tersedia</div>
    </Card>
  )
}

export default function ForecastPage() {
  const { setActivePage } = useAppShell()

  const [forecastData, setForecastData] = useState<ForecastDay[] | null>(null)
  const [logData, setLogData] = useState<WadukLogItem[] | null>(null)
  const [logDays, setLogDays] = useState<number>(30)
  const [loading, setLoading] = useState<boolean>(true)
  const didInitFetch = useRef(false)

  useEffect(() => {
    setActivePage('forecast')
  }, [setActivePage])

  useEffect(() => {
    let isMounted = true

    async function run() {
      const results = await Promise.allSettled([getForecast(), getWadukLog(logDays)])
      if (!isMounted) return

      const [forecastRes, logRes] = results
      setForecastData(forecastRes.status === 'fulfilled' ? forecastRes.value : null)
      setLogData(logRes.status === 'fulfilled' ? logRes.value : null)
      setLoading(false)
      didInitFetch.current = true
    }

    run()

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let isMounted = true

    async function refetchLog() {
      if (!didInitFetch.current) return
      setLoading(true)
      setLogData(null)
      try {
        const data = await getWadukLog(logDays)
        if (isMounted) setLogData(data)
      } catch {
        if (isMounted) setLogData(null)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    refetchLog()

    return () => {
      isMounted = false
    }
  }, [logDays])

  return (
    <div className="flex flex-col min-h-full">
      <HeroHeader
        lastUpdated={new Date().toLocaleString('id-ID')}
        bmkgStatus={{ state: 'cached', lokasi: '', timestamp: '' }}
        neondbStatus={{ state: logData === null ? 'error' : 'live' }}
        nasaStatus={{ state: 'cached', timestamp: '' }}
      />
      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col gap-4 md:gap-6 w-full">
        {loading && !forecastData ? <SkeletonBlock height={280} /> : forecastData ? <ForecastTable data={forecastData} /> : <DataUnavailable />}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {loading && !forecastData ? <SkeletonBlock height={320} /> : forecastData ? <ForecastWseChart data={forecastData} /> : <DataUnavailable />}
          {loading && !forecastData ? <SkeletonBlock height={320} /> : forecastData ? <ForecastEnergyChart data={forecastData} /> : <DataUnavailable />}
        </div>

        {loading && !logData ? <SkeletonBlock height={480} /> : logData ? <LogTable data={logData} days={logDays} onDaysChange={setLogDays} /> : <DataUnavailable />}
      </main>
    </div>
  )
}
