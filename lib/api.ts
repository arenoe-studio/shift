import axios from 'axios'

import type { ForecastDay, RekomendasiData, SolarData, WadukData, WadukHistory, WadukLogItem, WeatherData } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

export default api

export async function getWadukCurrent(): Promise<WadukData> {
  const res = await api.get<WadukData>('/api/waduk/current')
  return res.data
}

export async function getWeather(): Promise<WeatherData> {
  const res = await api.get<WeatherData>('/api/bmkg/weather')
  return res.data
}

export async function getSolarIrradiance(): Promise<SolarData> {
  const res = await api.get<SolarData>('/api/solar/irradiance')
  return res.data
}

export async function getRekomendasi(): Promise<RekomendasiData> {
  const res = await api.get<RekomendasiData>('/api/rekomendasi')
  return res.data
}

export async function getWadukHistory(days: number = 30): Promise<WadukHistory> {
  const res = await api.get<WadukHistory>('/api/waduk/history', { params: { days } })
  return res.data
}

export async function getForecast(): Promise<ForecastDay[]> {
  const res = await api.get<ForecastDay[]>('/api/forecast')
  return res.data
}

export async function getWadukLog(days: number = 30): Promise<WadukLogItem[]> {
  const res = await api.get<WadukLogItem[]>('/api/waduk/log', { params: { days } })
  return res.data
}
