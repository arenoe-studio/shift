export type WadukData = {
  wse: number
  volume: number
  bulan_tahun: string
  status: 'normal' | 'warning' | 'critical'
}

export type WeatherData = {
  kondisi: string
  suhu: number
  curah_hujan: number
  prakiraan: { hari: string; kondisi: string; suhu: number }[]
  lokasi: string
  is_cached?: boolean
}

export type SolarData = {
  irr_hari_ini: number
  irr_rata_bulan: number
  estimasi_output_fpv: number
  status_surya: 'optimal' | 'moderat' | 'rendah'
  is_fallback?: boolean
}

export type RekomendasiData = {
  dispatch_turbin_mw: number
  dispatch_fpv_mw: number
  total_mw: number
  energi_mwh: number
  co2_avoided_ton: number
  status_waduk_aman: boolean
  alasan: string
}

export type WadukHistory = {
  tanggal: string
  wse: number
  ghi: number
  turbine_outflow: number
}[]

export type WadukLogItem = {
  tanggal: string
  wse: number
  ghi: number
  turbine_outflow: number
  volume: number
  status: 'normal' | 'warning' | 'critical'
}

export type ForecastDay = {
  tanggal: string
  hari: string
  cuaca: string
  suhu: number
  curah_hujan: number
  wse_proyeksi: number
  irr_estimasi: number
  dispatch_turbin_mw: number
  dispatch_fpv_mw: number
  total_mw: number
  is_actual: boolean
}
