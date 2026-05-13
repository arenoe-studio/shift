'use client'

import { useEffect, useMemo, useState } from 'react'

import dynamic from 'next/dynamic'

const WseChart = dynamic(() => import('@/components/charts/WseChart'), { ssr: false })
const GhiTurbineChart = dynamic(() => import('@/components/charts/GhiTurbineChart'), { ssr: false })
import { useAppShell } from '@/components/layout/AppShell'
import HeroHeader from '@/components/layout/HeroHeader'
import AlertBar from '@/components/ui/AlertBar'
import Card from '@/components/ui/Card'
import MetricCard from '@/components/ui/MetricCard'
import BenefitSummary from '@/components/widgets/BenefitSummary'
import DispatchRecommendation from '@/components/widgets/DispatchRecommendation'
import ForecastStrip from '@/components/widgets/ForecastStrip'
import {
  getForecast,
  getRekomendasi,
  getSolarIrradiance,
  getWadukCurrent,
  getWadukHistory,
  getWeather,
} from '@/lib/api'
import { getIrrFallbackForDate } from '@/lib/constants'
import type { ForecastDay, RekomendasiData, SolarData, WadukData, WadukHistory, WeatherData } from '@/types'
import { CloudRain, Droplets, Sun, Zap } from 'lucide-react'

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

export default function Home() {
  const { setActivePage } = useAppShell()

  const [loading, setLoading] = useState(true)

  const [wadukData, setWadukData] = useState<WadukData | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [solarData, setSolarData] = useState<SolarData | null>(null)
  const [rekomendasiData, setRekomendasiData] = useState<RekomendasiData | null>(null)
  const [wadukHistory, setWadukHistory] = useState<WadukHistory | null>(null)
  const [forecastData, setForecastData] = useState<ForecastDay[] | null>(null)

  const [chartDays, setChartDays] = useState<number>(30)

  useEffect(() => {
    let isMounted = true

    async function run() {
      const results = await Promise.allSettled([
        getWadukCurrent(),
        getWeather(),
        getSolarIrradiance(),
        getRekomendasi(),
        getForecast(),
      ])

      if (!isMounted) return

      const [wadukRes, weatherRes, solarRes, rekomRes, forecastRes] = results

      setWadukData(wadukRes.status === 'fulfilled' ? wadukRes.value : null)
      setWeatherData(weatherRes.status === 'fulfilled' ? weatherRes.value : null)
      setSolarData(solarRes.status === 'fulfilled' ? solarRes.value : null)
      setRekomendasiData(rekomRes.status === 'fulfilled' ? rekomRes.value : null)
      setForecastData(forecastRes.status === 'fulfilled' ? forecastRes.value : null)

      setLoading(false)
    }

    run()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    async function fetchHistory() {
      try {
        const data = await getWadukHistory(chartDays)
        if (isMounted) setWadukHistory(data)
      } catch {
        if (isMounted) setWadukHistory(null)
      }
    }
    fetchHistory()
    return () => {
      isMounted = false
    }
  }, [chartDays])

  useEffect(() => {
    setActivePage('dashboard')
  }, [setActivePage])

  const irrFallback = useMemo(() => {
    if (solarData?.irr_rata_bulan && Number.isFinite(solarData.irr_rata_bulan) && solarData.irr_rata_bulan > 0) {
      return solarData.irr_rata_bulan
    }
    return getIrrFallbackForDate()
  }, [solarData])

  const alertStatus: 'normal' | 'warning' | 'critical' = wadukData?.status === 'critical' ? 'critical' : wadukData?.status === 'warning' ? 'warning' : 'normal'
  const alertMessage =
    alertStatus === 'normal'
      ? 'Kondisi waduk normal — operasional berjalan optimal'
      : alertStatus === 'warning'
        ? 'Perhatian — elevasi waduk mendekati ambang batas waspada'
        : 'KRITIS — elevasi waduk di bawah ambang batas operasional 94.44 masl'

  const wseColor = wadukData?.status === 'critical' ? '#DC2626' : wadukData?.status === 'warning' ? '#D97706' : '#16A34A'

  return (
    <div className="flex flex-col min-h-full">
      <HeroHeader
        lastUpdated={new Date().toLocaleString('id-ID')}
        bmkgStatus={{
          state: weatherData === null ? 'error' : weatherData.is_cached ? 'cached' : 'live',
          lokasi: weatherData?.lokasi ?? '',
          timestamp: new Date().toLocaleString('id-ID'),
        }}
        neondbStatus={{ state: wadukData === null ? 'error' : 'live' }}
        nasaStatus={{
          state: solarData === null ? 'error' : solarData.is_fallback ? 'cached' : 'live',
          timestamp: new Date().toLocaleString('id-ID'),
        }}
      />

      <div className="sticky top-0 z-10">
        <AlertBar status={alertStatus} message={alertMessage} />
      </div>

      <main className="max-w-screen-xl mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col gap-4 md:gap-6 w-full">
        {loading ? (
          <>
            <SkeletonBlock height={44} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SkeletonBlock height={140} />
              <SkeletonBlock height={140} />
              <SkeletonBlock height={140} />
              <SkeletonBlock height={140} />
            </div>
            <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-6">
              <div className="md:col-span-2">
                <SkeletonBlock height={360} />
              </div>
              <div className="md:col-span-3">
                <SkeletonBlock height={360} />
              </div>
            </div>
            <SkeletonBlock height={180} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wadukData ? (
                <MetricCard label="WSE" value={wadukData.wse.toFixed(2)} unit="masl" icon={Droplets} statusColor={wseColor} />
              ) : (
                <DataUnavailable />
              )}
              {weatherData ? (
                <MetricCard label="Curah Hujan" value={weatherData.curah_hujan.toFixed(1)} unit="mm/hari" icon={CloudRain} />
              ) : (
                <DataUnavailable />
              )}
              {solarData ? (
                <MetricCard
                  label="IRR"
                  value={(solarData.irr_hari_ini > 0 ? solarData.irr_hari_ini : irrFallback).toFixed(2)}
                  unit="kWh/m²/day"
                  icon={Sun}
                />
              ) : (
                <DataUnavailable />
              )}
              {rekomendasiData ? (
                <MetricCard label="Dispatch Turbin" value={Math.round(rekomendasiData.dispatch_turbin_mw)} unit="MW" icon={Zap} />
              ) : (
                <DataUnavailable />
              )}
            </div>

            <div className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-6">
              <div className="md:col-span-2">
                {rekomendasiData ? <DispatchRecommendation data={rekomendasiData} /> : <DataUnavailable />}
              </div>
              <div className="md:col-span-3">
                {forecastData ? <ForecastStrip data={forecastData} /> : <DataUnavailable />}
              </div>
            </div>

            <div className="w-full">
              {rekomendasiData && solarData ? (
                <BenefitSummary rekomendasi={rekomendasiData} solarData={solarData} />
              ) : (
                <DataUnavailable />
              )}
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                {wadukHistory ? (
                  <>
                    <WseChart data={wadukHistory} days={chartDays} onDaysChange={setChartDays} />
                    <GhiTurbineChart data={wadukHistory} days={chartDays} />
                  </>
                ) : (
                  <>
                    <DataUnavailable />
                    <DataUnavailable />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
