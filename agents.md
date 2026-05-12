# agents.md — SHIFT+ Agent Reference

> **Instruksi untuk AI Agent:**
> - Baca file ini PERTAMA sebelum mengerjakan apapun.
> - Update file ini SETIAP SELESAI satu unit kerja (bukan di akhir sesi).
> - Jangan tulis narasi panjang. Tabel, list, dan baris singkat saja.
> - Jika ada konflik antara file ini dan kode aktual, kode aktual yang benar — update file ini.

---

## Project State

| Key | Value |
|---|---|
| Status | 🟡 In Progress |
| Frontend | Next.js → Vercel |
| Backend | FastAPI → Coolify (Ubuntu Server) |
| Last updated | 2026-05-13 |
| Last worked on | 2026-05-13 |

---

## Repo Structure

```
shift-plus/
├── apps/
│   ├── frontend/
│   │   ├── app/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── widgets/
│   │   │   ├── charts/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── constants.ts
│   │   └── types/
│   │       └── index.ts
│   └── backend/
│       ├── main.py
│       ├── routers/
│       │   ├── waduk.py
│       │   ├── bmkg.py
│       │   ├── solar.py
│       │   └── rekomendasi.py
│       ├── services/
│       │   ├── waduk_service.py
│       │   ├── bmkg_service.py
│       │   ├── solar_service.py
│       │   └── shift_engine.py
│       ├── data/
│       │   └── pjt2_historical.json
│       └── models/
│           └── schemas.py
├── docs/
│   ├── 01-project-brief-techstack.md
│   ├── 02-frontend.md
│   ├── 03-backend.md
│   └── 04-implementation-notes.md
├── claude.md
└── README.md
```

---

## Dependency Registry

Update tabel ini setiap `npm install` atau `pip install` baru.

### Frontend (`apps/frontend`)
| Package | Fungsi | Status |
|---|---|---|
| next | Framework utama, App Router | — |
| tailwindcss | Styling | — |
| recharts | Grafik WSE, energi | — |
| axios | HTTP client ke backend | — |
| lucide-react | Icon set | — |

### Backend (`apps/backend`)
| Package | Fungsi | Status |
|---|---|---|
| fastapi | Framework API | — |
| uvicorn | ASGI server | — |
| pandas | Kalkulasi data PJT II | — |
| httpx | Proxy request BMKG | — |
| python-dotenv | Env variable | — |

---

## Function Registry

Format: `FungsiName | file | L[start]-[end] | input → output | memanggil`

Update setiap fungsi baru dibuat atau diubah.

### Frontend
| Fungsi | File | Lines | I/O | Memanggil |
|---|---|---|---|---|
| — | — | — | — | — |

### Backend
| Fungsi | File | Lines | I/O | Memanggil |
|---|---|---|---|---|
| — | — | — | — | — |

---

## API Endpoints

| Method | Path | Service | Returns | Dipanggil dari |
|---|---|---|---|---|
| GET | `/api/waduk/current` | waduk_service | WSE, volume, bulan | `api.ts` |
| GET | `/api/bmkg/weather` | bmkg_service | cuaca, prakiraan hujan | `api.ts` |
| GET | `/api/solar/irradiance` | solar_service | IRR harian (kWh/m²) | `api.ts` |
| GET | `/api/rekomendasi` | shift_engine | dispatch MW, status, alasan | `api.ts` |

---

## Data Flow

```
BMKG API
  └── bmkg_service.py → /api/bmkg/weather → api.ts → WeatherWidget

pjt2_historical.json
  └── waduk_service.py → /api/waduk/current → api.ts → WadukWidget + Chart

NASA POWER (hardcoded)
  └── solar_service.py → /api/solar/irradiance → api.ts → SolarWidget

Ketiga data di atas
  └── shift_engine.py → /api/rekomendasi → api.ts → RekomendasiWidget
```

---

## Known Issues

| ID | Status | File | Line | Deskripsi | Solusi |
|---|---|---|---|---|---|
| — | — | — | — | — | — |

---

## Changelog

Format: `[YYYY-MM-DD] [file/area] perubahan singkat`

```
[2026-05-13] [init] repo scaffolded, Next.js installed, backend structure created
```
