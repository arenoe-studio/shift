# SHIFT+ Dashboard — Frontend Spec

---

## 1. Design System

Menggunakan **CreateSpace Design System**. Referensi lengkap di `docs/createspace.md`.

| Token | Value |
|---|---|
| Primary | `#E11D48` |
| Secondary | `#2563EB` |
| Tertiary | `#FACC15` |
| Surface Base | `#FFFFFF` |
| Surface Glass | `rgba(255,255,255,0.65)` + `backdrop-filter: blur(16px)` |
| Success | `#16A34A` |
| Warning | `#D97706` |
| Error | `#DC2626` |
| Headline Font | Poppins |
| Body Font | DM Sans |
| Mono Font | Fira Code |

---

## 2. Layout

Single-page. Tidak ada routing. Semua konten dalam satu scroll view.

```
┌─────────────────────────────────────────────────────┐
│ HEADER                                              │
│ Nama sistem | Lokasi | Timestamp | Status Bar       │
├──────────────┬──────────────┬───────────────────────┤
│ WadukWidget  │ WeatherWidget│ SolarWidget            │
│ (1/3 width)  │ (1/3 width)  │ (1/3 width)           │
├──────────────┴──────────────┴───────────────────────┤
│ RekomendasiWidget (full width)                      │
├─────────────────────────────────────────────────────┤
│ WseChart (full width)                               │
└─────────────────────────────────────────────────────┘
```

**Grid:** 3-column CSS grid, gap `24px`, max-width `1280px`, centered.
**Padding:** `32px` horizontal pada viewport ≥ 1024px, `16px` pada mobile.
**Background:** `#F8FAFC` (off-white, bukan CreateSpace default agar grafik lebih kontras).

---

## 3. Header

**File:** `components/ui/Header.tsx`

| Elemen | Detail |
|---|---|
| Kiri | Logo teks "SHIFT+" (Poppins bold, Primary `#E11D48`) + subtitle "Solar Hydro Integrated Framework" (DM Sans, gray) |
| Kanan | Timestamp update terakhir + 3 status indicator pill |

**Status Bar (3 pill):**

| Pill | Label | Kondisi hijau | Kondisi merah |
|---|---|---|---|
| 1 | PJT II / NeonDB | Koneksi DB berhasil | Query gagal |
| 2 | BMKG | Fetch berhasil | Fetch gagal / timeout |
| 3 | NASA POWER | Fetch berhasil | Fetch gagal / timeout |

Pill menggunakan `StatusChip` component. Pulse indicator saat status active.

---

## 4. Widgets (Baris 1)

### 4.1 WadukWidget

**File:** `components/widgets/WadukWidget.tsx`
**Data dari:** `GET /api/waduk/current`

| Field | Tampil sebagai |
|---|---|
| `wse` | Angka besar (Display, Poppins bold) + satuan "masl" |
| `volume` | Angka sekunder + satuan "juta m³" |
| `bulan_tahun` | Label kecil "Data: Oct 2023" |
| `status` | StatusChip (Normal / Warning / Critical) |

**Threshold WSE:**
| Kondisi | Range | Warna chip |
|---|---|---|
| Normal | ≥ 100 masl | Success `#16A34A` |
| Warning | 94.44 – 99.99 masl | Warning `#D97706` |
| Critical | < 94.44 masl | Error `#DC2626` |

---

### 4.2 WeatherWidget

**File:** `components/widgets/WeatherWidget.tsx`
**Data dari:** `GET /api/bmkg/weather`

| Field | Tampil sebagai |
|---|---|
| `kondisi` | Icon cuaca + label (Cerah / Berawan / Hujan) |
| `suhu` | Angka + "°C" |
| `curah_hujan` | Angka + "mm/hari" |
| `prakiraan` | 3-hari prakiraan horizontal (hari, icon, suhu) |
| `lokasi` | Label kecil "Purwakarta, Jawa Barat" |

**Warna kondisi:**
| Kondisi | Warna |
|---|---|
| Cerah | Tertiary `#FACC15` |
| Berawan | Gray `#6B7280` |
| Hujan | Secondary `#2563EB` |

---

### 4.3 SolarWidget

**File:** `components/widgets/SolarWidget.tsx`
**Data dari:** `GET /api/solar/irradiance`

| Field | Tampil sebagai |
|---|---|
| `irr_hari_ini` | Angka besar + satuan "kWh/m²/day" |
| `irr_rata_bulan` | Angka sekunder + "rata-rata bulan ini" |
| `estimasi_output_fpv` | Angka + "MWh (estimasi hari ini)" |
| `status_surya` | Chip: Optimal / Moderat / Rendah |

**Threshold IRR:**
| Kondisi | Range | Warna |
|---|---|---|
| Optimal | ≥ 5.5 kWh/m²/day | Success |
| Moderat | 4.0 – 5.49 | Warning |
| Rendah | < 4.0 | Error |

---

## 5. RekomendasiWidget (Baris 2)

**File:** `components/widgets/RekomendasiWidget.tsx`
**Data dari:** `GET /api/rekomendasi`

Ini focal point halaman. Card full-width dengan glass effect.

**Layout internal (3 kolom dalam card):**

```
┌─────────────────────┬──────────────────────┬─────────────────────┐
│ INPUT KONDISI       │ REKOMENDASI DISPATCH  │ ESTIMASI DAMPAK     │
│                     │                       │                     │
│ WSE: 91.6 masl ⚠️   │ Turbin: 145 MW        │ Energi: 4,521 MWh   │
│ Hujan: 12 mm/hari   │ FPV: 387 MW           │ CO₂ avoided: 3,812t │
│ IRR: 6.25 kWh/m²    │ Total: 532 MW         │ Status waduk: Aman  │
│                     │                       │                     │
│                     │ [alasan singkat]      │                     │
└─────────────────────┴──────────────────────┴─────────────────────┘
```

| Elemen | Detail |
|---|---|
| Header card | "Rekomendasi SHIFT+" + badge mode: "Rule-Based Optimization" |
| Kolom kiri | Ringkasan 3 input kondisi dengan status chip masing-masing |
| Kolom tengah | Angka dispatch turbin + FPV dalam besar, plus alasan 1 kalimat |
| Kolom kanan | Output energi total + CO₂ avoided + status aman/tidak aman |
| Warna card border | Mengikuti status WSE: Success / Warning / Error |

---

## 6. WseChart (Baris 3)

**File:** `components/charts/WseChart.tsx`
**Data dari:** `GET /api/waduk/history?months=12`

Grafik line chart WSE 12 bulan terakhir dari NeonDB.

| Properti | Detail |
|---|---|
| Library | Recharts `LineChart` |
| X-axis | Bulan (Jan–Des) |
| Y-axis | Elevasi masl |
| Line | WSE aktual — warna Primary `#E11D48` |
| Reference line | Threshold 94.44 masl — dashed, warna Error `#DC2626`, label "Critical" |
| Reference line | Threshold 100 masl — dashed, warna Warning `#D97706`, label "Warning" |
| Tooltip | Bulan, WSE, status |
| Area fill | Di bawah garis WSE, Primary 10% opacity |

---

## 7. Komponen Primitif

**Semua di `components/ui/`**

| File | Komponen | Props utama |
|---|---|---|
| `Card.tsx` | Wrapper card standar | `variant: default\|glass`, `borderColor?` |
| `Badge.tsx` | Label kecil berwarna | `label`, `color` |
| `StatusChip.tsx` | Pill status dengan pulse | `status: normal\|warning\|critical\|active`, `label` |
| `SectionHeader.tsx` | Judul tiap section | `title`, `subtitle?` |
| `Divider.tsx` | Garis pemisah | `orientation: h\|v` |

---

## 8. Types

**File:** `types/index.ts`

```typescript
type WadukData = {
  wse: number
  volume: number
  bulan_tahun: string
  status: 'normal' | 'warning' | 'critical'
}

type WeatherData = {
  kondisi: string
  suhu: number
  curah_hujan: number
  prakiraan: { hari: string; kondisi: string; suhu: number }[]
  lokasi: string
}

type SolarData = {
  irr_hari_ini: number
  irr_rata_bulan: number
  estimasi_output_fpv: number
  status_surya: 'optimal' | 'moderat' | 'rendah'
}

type RekomendasiData = {
  dispatch_turbin_mw: number
  dispatch_fpv_mw: number
  total_mw: number
  energi_mwh: number
  co2_avoided_ton: number
  status_waduk_aman: boolean
  alasan: string
}

type WadukHistory = {
  bulan: string
  wse: number
}[]
```

---

## 9. API Calls

**File:** `lib/api.ts`

Semua fetch ke backend terpusat di satu file ini. Tidak ada fetch langsung dari komponen.

| Fungsi | Endpoint | Return type |
|---|---|---|
| `getWadukCurrent()` | `GET /api/waduk/current` | `WadukData` |
| `getWeather()` | `GET /api/bmkg/weather` | `WeatherData` |
| `getSolarIrradiance()` | `GET /api/solar/irradiance` | `SolarData` |
| `getRekomendasi()` | `GET /api/rekomendasi` | `RekomendasiData` |
| `getWadukHistory(months)` | `GET /api/waduk/history?months=12` | `WadukHistory` |

---

## 10. Constants

**File:** `lib/constants.ts`

```typescript
export const WSE_CRITICAL = 94.44      // masl
export const WSE_WARNING = 100         // masl
export const IRR_OPTIMAL = 5.5         // kWh/m²/day
export const IRR_MODERAT = 4.0         // kWh/m²/day
export const FPV_CAPACITY_MWP = 651    // MWp
export const TURBINE_MAX_MW = 187      // MW
export const CO2_FACTOR = 0.846        // tCO₂/MWh (faktor emisi grid Indonesia)
export const JATILUHUR_LAT = -6.5081
export const JATILUHUR_LON = 107.3342
```
