export const WSE_CRITICAL = 94.44 // masl
export const WSE_WARNING = 100 // masl
export const IRR_OPTIMAL = 5.5 // kWh/m²/day
export const IRR_MODERAT = 4.0 // kWh/m²/day
export const FPV_CAPACITY_MWP = 651 // MWp
export const TURBINE_MAX_MW = 187 // MW
export const CO2_FACTOR = 0.846 // tCO₂/MWh (faktor emisi grid Indonesia)
export const JATILUHUR_LAT = -6.5081
export const JATILUHUR_LON = 107.3342

export const IRR_MONTHLY_FALLBACK: Record<string, number> = {
  Jan: 4.32,
  Feb: 4.71,
  Mar: 4.87,
  Apr: 4.75,
  May: 4.88,
  Jun: 4.48,
  Jul: 5.11,
  Aug: 5.33,
  Sep: 5.97,
  Oct: 5.13,
  Nov: 4.47,
  Dec: 5.4,
}

export function getIrrFallbackForDate(d = new Date()): number {
  const monthKey = d.toLocaleString('en-US', { month: 'short', timeZone: 'Asia/Jakarta' })
  return IRR_MONTHLY_FALLBACK[monthKey] ?? 4.8
}
