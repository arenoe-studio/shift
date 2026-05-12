# SHIFT+ Dashboard — Project Brief & Tech Stack

---

## 1. Project Overview

**Nama sistem:** SHIFT+ (Solar Hydro Integrated Framework for Turbine-dispatch)
**Tipe:** Web-based operational decision support dashboard
**Konteks:** Dikembangkan sebagai demonstrasi inovasi dalam kompetisi IDIC CEIC Season XIV, dengan studi kasus Waduk Ir. H. Djuanda (Jatiluhur), dikelola oleh Perum Jasa Tirta II (PJT II), Jawa Barat.

---

## 2. Masalah yang Dijawab

- Waduk Jatiluhur mengalami penurunan muka air signifikan saat El Niño — pada Oktober 2023 WSE turun ke 91.61 masl, melewati ambang kritis operasional 94.44 masl.
- Operasi turbin hidropower (187 MW, 6 unit) tidak terkoordinasi secara optimal dengan potensi energi surya dari sistem Floating PV (FPV) 651 MWp yang direncanakan.
- Tidak ada sistem yang secara eksplisit mengintegrasikan jadwal dispatch turbin dengan kondisi waduk, prakiraan cuaca, dan output FPV dalam satu antarmuka operasional.

---

## 3. Tujuan Dashboard

- Menampilkan kondisi waduk terkini (WSE, volume tampungan) berbasis data historis PJT II.
- Menampilkan kondisi cuaca dan prakiraan hujan real-time dari BMKG.
- Menampilkan estimasi irradiasi surya harian dari data NASA POWER.
- Menghasilkan rekomendasi jadwal dispatch turbin berdasarkan kombinasi tiga data di atas menggunakan logika rule-based SHIFT+.
- Menampilkan estimasi output energi FPV dan dampak emisi CO₂ yang dihindari.

---

## 4. Scope & Batasan

| Item | Keterangan |
|---|---|
| Tipe sistem | Decision support — rekomendasi ke operator, bukan otomasi eksekusi |
| Halaman | Single-page dashboard |
| Data PJT II | Hardcoded dari dataset historis 2000–2025 (bulanan), representasi kondisi terkini pakai data 2023 |
| Data BMKG | Live fetch via API publik BMKG |
| Data NASA POWER | Hardcoded dari nilai IRR rata-rata bulanan koordinat Jatiluhur (-6.5081°, 107.3342°) |
| Autentikasi | Tidak ada |
| Multi-user | Tidak ada |
| Mobile | Responsif, tapi dioptimalkan untuk desktop/presentasi |

---

## 5. Target Pengguna

**Primary:** Operator PJT II — membaca rekomendasi dispatch dan kondisi waduk.
**Demo context:** Ditampilkan ke juri kompetisi sebagai demonstrasi fungsionalitas SHIFT+. Dashboard berjalan live, dapat dioperasikan langsung saat sesi tanya jawab juri.

---

## 6. Tech Stack

### Frontend
| Package | Fungsi |
|---|---|
| `next@latest` | Framework utama (App Router) |
| `tailwindcss@latest` | Styling utility-first |
| `recharts@latest` | Visualisasi grafik (WSE trend, output energi) |
| `axios@latest` | HTTP client untuk fetch data dari backend |
| `lucide-react@latest` | Icon set |

### Backend
| Package | Fungsi |
|---|---|
| `fastapi@latest` | Framework API utama |
| `uvicorn@latest` | ASGI server |
| `pandas@latest` | Kalkulasi dan pemrosesan data PJT II |
| `httpx@latest` | Proxy request ke BMKG dari server |
| `python-dotenv@latest` | Manajemen environment variable |

---

## 7. Struktur Repo

```
shift-plus/
├── apps/
│   ├── frontend/               # Next.js app
│   │   ├── app/
│   │   │   ├── page.tsx        # Single-page dashboard entry
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── widgets/        # Tiap widget = 1 file
│   │   │   ├── charts/         # Tiap chart = 1 file
│   │   │   └── ui/             # Komponen primitif (card, badge, dll)
│   │   ├── lib/
│   │   │   ├── api.ts          # Semua fungsi fetch ke backend
│   │   │   └── constants.ts    # Threshold, label, konstanta sistem
│   │   └── types/
│   │       └── index.ts        # Type definitions
│   │
│   └── backend/                # FastAPI app
│       ├── main.py             # Entry point, route registration
│       ├── routers/
│       │   ├── waduk.py        # Endpoint data PJT II
│       │   ├── bmkg.py         # Endpoint proxy BMKG
│       │   ├── solar.py        # Endpoint data NASA POWER
│       │   └── rekomendasi.py  # Endpoint logika SHIFT+
│       ├── services/
│       │   ├── waduk_service.py
│       │   ├── bmkg_service.py
│       │   ├── solar_service.py
│       │   └── shift_engine.py # Logika rule-based SHIFT+
│       ├── data/
│       │   └── pjt2_historical.json  # Dataset PJT II hardcoded
│       └── models/
│           └── schemas.py      # Pydantic schemas
│
├── docs/
│   ├── 01-project-brief-techstack.md
│   ├── 02-frontend.md
│   ├── 03-backend.md
│   └── 04-implementation-notes.md
│
├── claude.md                   # Agent reference — wajib dibaca pertama
└── README.md
```

---

## 8. Deployment

| Target | Detail |
|---|---|
| Frontend | Vercel (Next.js) |
| Backend | Ubuntu Server, self-hosted via Coolify (FastAPI container) |
| Komunikasi | Frontend → Backend via REST API (JSON) |
| Environment | `.env` di masing-masing app untuk base URL dan API config |

---

## 9. Agent Reference

`claude.md` berada di root repo. Wajib dibaca agent sebelum mengerjakan apapun. Berisi: project state, dependency registry, function registry, API endpoints, data flow, known issues, dan changelog. Agent wajib update setiap selesai satu unit kerja.
