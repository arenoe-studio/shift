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
| Status | 🟢 MVP Complete |
| Frontend | Next.js → Vercel |
| Backend | FastAPI → Coolify (Ubuntu Server) |
| Last updated | 2026-05-13 |
| Last worked on | 2026-05-13 |

---

## Repo Structure

```
project-root/
├── app/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── layout/
│   ├── widgets/
│   ├── charts/
│   ├── tables/
│   └── ui/
├── lib/
│   ├── api.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── backend/
│   ├── main.py
│   ├── routers/
│   │   ├── waduk.py
│   │   ├── bmkg.py
│   │   ├── solar.py
│   │   └── rekomendasi.py
│   ├── services/
│   │   ├── waduk_service.py
│   │   ├── bmkg_service.py
│   │   ├── solar_service.py
│   │   └── shift_engine.py
│   ├── data/
│   ├── models/
│   │   └── schemas.py
│   └── scripts/
│       └── seed.py
├── docs/
├── DESIGN.md
└── .gitignore
```

---

## Dependency Registry

Update tabel ini setiap `npm install` atau `pip install` baru.

### Frontend (repo root)
| Package | Fungsi | Status |
|---|---|---|
| next | Framework utama, App Router | — |
| tailwindcss | Styling | — |
| recharts | Grafik WSE, energi | — |
| axios | HTTP client ke backend | — |
| lucide-react | Icon set | — |
| framer-motion | Sidebar animation + motion UI | — |
| sharp | Optimize assets (PNG→WebP) | ✅ |
| @next/bundle-analyzer | Bundle analysis (webpack) | ✅ |

### Backend (`backend/`)
| Package | Fungsi | Status |
|---|---|---|
| fastapi | Framework API | — |
| uvicorn | ASGI server | — |
| pandas | Kalkulasi data PJT II | — |
| httpx | Proxy request BMKG | — |
| python-dotenv | Env variable | — |
| asyncpg | Driver PostgreSQL async | ✅ (py312) |
| sqlalchemy[asyncio] | ORM async engine/session | ✅ (py312) |
| psycopg2-binary | Driver sync (ops/debug) | ✅ (py312) |
| (schema) waduk_daily | New daily table | ✅ |

---

## Function Registry

Format: `FungsiName | file | L[start]-[end] | input → output | memanggil`

Update setiap fungsi baru dibuat atau diubah.

### Frontend
| Fungsi | File | Lines | I/O | Memanggil |
|---|---|---|---|---|
| getWadukCurrent | lib/api.ts | L11-14 | — → WadukData | axios instance |
| getWeather | lib/api.ts | L16-19 | — → WeatherData | axios instance |
| getSolarIrradiance | lib/api.ts | L21-24 | — → SolarData | axios instance |
| getRekomendasi | lib/api.ts | L26-29 | — → RekomendasiData | axios instance |
| getWadukHistory | lib/api.ts | L31-34 | days:number → WadukHistory | axios instance |
| getForecast | lib/api.ts | L36-39 | — → ForecastDay[] | axios instance |
| getWadukLog | lib/api.ts | L41-44 | days:number → WadukLogItem[] | axios instance |
| HeroHeader | components/layout/HeroHeader.tsx | L1-100 | bmkgStatus,neondbStatus,nasaStatus,lastUpdated → JSX | framer-motion |
| Sidebar | components/layout/Sidebar.tsx | L1-85 | props → JSX | next/link, usePathname, framer-motion, lucide |
| AppShell + useAppShell | components/layout/AppShell.tsx | L1-80 | children → JSX | Sidebar, HeroHeader ctx, framer-motion, next/link, usePathname |
| AlertBar | components/ui/AlertBar.tsx | L16-26 | status,message → JSX | lucide |
| MetricCard | components/ui/MetricCard.tsx | L15-41 | props → JSX | lucide icons |
| DataStatusBar | components/ui/DataStatusBar.tsx | L16-51 | props → JSX | — |
| WadukWidget | components/widgets/WadukWidget.tsx | L24-52 | WadukData → JSX | Card, StatusChip, Badge, constants |
| WeatherWidget | components/widgets/WeatherWidget.tsx | L34-88 | WeatherData → JSX | Card, Badge, lucide icons |
| SolarWidget | components/widgets/SolarWidget.tsx | L18-50 | SolarData → JSX | Card, StatusChip, constants |
| RekomendasiWidget | components/widgets/RekomendasiWidget.tsx | L16-115 | RekomendasiData → JSX | Card(glass), StatusChip, Badge |
| getIrrFallbackForDate | lib/constants.ts | L26-29 | d?:Date → number | IRR_MONTHLY_FALLBACK |
| BenefitSummary | components/widgets/BenefitSummary.tsx | L36-51 | rekomendasi,solar → JSX | Card, SectionHeader, lucide |
| DispatchRecommendation | components/widgets/DispatchRecommendation.tsx | L15-92 | data:RekomendasiData → JSX | Card, SectionHeader, StatusChip, lucide |
| ForecastStrip | components/widgets/ForecastStrip.tsx | L43-140 | data:ForecastDay[] → JSX | Card, SectionHeader, lucide |
| WseChart | components/charts/WseChart.tsx | L43-131 | data:WadukHistory,days → JSX | Card, Divider, SectionHeader, recharts |
| GhiTurbineChart | components/charts/GhiTurbineChart.tsx | L43-121 | data:WadukHistory,days → JSX | Card, Divider, SectionHeader, recharts |
| ForecastTable | components/tables/ForecastTable.tsx | L1-134 | data:ForecastDay[] → JSX | Card, SectionHeader, StatusChip, Badge, lucide |
| ForecastWseChart | components/charts/ForecastWseChart.tsx | L1-117 | data:ForecastDay[] → JSX | Card, SectionHeader, recharts |
| ForecastEnergyChart | components/charts/ForecastEnergyChart.tsx | L1-98 | data:ForecastDay[] → JSX | Card, SectionHeader, recharts |
| LogTable | components/tables/LogTable.tsx | L1-140 | data,days,onDaysChange → JSX | Card, SectionHeader, StatusChip, lucide |
| Header | components/ui/Header.tsx | L11-35 | props → JSX | StatusChip, Divider |
| Home (Dashboard) | app/page.tsx | L30-184 | — → JSX | AppShell ctx, AlertBar, MetricCard, DispatchRecommendation, BenefitSummary, DailyChart |
| ForecastPage | app/forecast/page.tsx | L1-97 | — → JSX | ForecastTable, ForecastWseChart, ForecastEnergyChart, LogTable |

### Backend
| Fungsi | File | Lines | I/O | Memanggil |
|---|---|---|---|---|
| get_db | backend/database.py | L44-46 | — → AsyncSession | — |
| create_tables | backend/scripts/create_tables.py | L15-17 | — → create tables | Base.metadata |
| get_current_waduk | backend/services/waduk_service.py | L69-91 | — → WadukCurrentSchema | AsyncSessionLocal, WadukDaily, numpy.interp |
| get_waduk_history | backend/services/waduk_service.py | L94-116 | days:int → list[WadukHistoryItem] | AsyncSessionLocal, WadukDaily |
| get_waduk_log | backend/services/waduk_service.py | L119-143 | days:int → list[WadukLogItem] | AsyncSessionLocal, WadukDaily, numpy.interp |
| get_weather | backend/services/bmkg_service.py | L127-199 | — → WeatherSchema | httpx.AsyncClient, _weather_cache |
| get_irradiance | backend/services/solar_service.py | L43-115 | — → SolarSchema | httpx.AsyncClient, IRR_MONTHLY_FALLBACK |
| compute | backend/services/shift_engine.py | L16-58 | wse,curah_hujan,irr → RekomendasiSchema | constants in-module |
| get_forecast | backend/services/forecast_service.py | L63-132 | — → list[ForecastDaySchema] | get_weather, waduk_daily, shift_engine.compute |

---

## API Endpoints

| Method | Path | Service | Returns | Dipanggil dari |
|---|---|---|---|---|
| GET | `/health` | backend/main.py | status ok | — |
| GET | `/api/waduk/current` | waduk_service | WSE, volume, bulan | `api.ts` |
| GET | `/api/waduk/history` | waduk_service | list WSE history (param: days) | `api.ts` |
| GET | `/api/waduk/log` | waduk_service | log harian (param: days) | `api.ts` |
| GET | `/api/bmkg/weather` | bmkg_service | cuaca, prakiraan hujan | `api.ts` |
| GET | `/api/solar/irradiance` | solar_service | IRR harian (kWh/m²) | `api.ts` |
| GET | `/api/rekomendasi` | shift_engine | dispatch MW, status, alasan | `api.ts` |
| GET | `/api/forecast` | forecast_service | forecast 7 hari (BMKG+proyeksi) | — |

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
| KI-001 | ✅ Resolved | backend/services/waduk_service.py | L107 | History sorting alfabet (bulan) | Sort by tahun + month order map |
| KI-002 | ✅ Resolved | backend/services/waduk_service.py | L83 | Volume selalu 0.0 (WSE→Volume) | Interp dari `backend/data/elevation_volume.csv` |
| KI-003 | ✅ Resolved | backend/services/bmkg_service.py | L12 | BMKG wilayah salah (Sukabumi) | Set code Purwakarta (Jatiluhur) + fallback candidates |

---

## Changelog

Format: `[YYYY-MM-DD] [file/area] perubahan singkat`

```
[2026-05-13] [init] repo scaffolded, Next.js installed, backend structure created
[2026-05-13] [cleanup] removed legacy apps/ monorepo folder
[2026-05-13] [backend] NeonDB connected, waduk_data table created (seed pending)
[2026-05-13] [backend] pjt2_historical.json generated, 312 rows seeded
[2026-05-13] [backend] waduk service + router implemented
[2026-05-13] [backend] bmkg/solar services + shift_engine + routers + main wired
[2026-05-13] [backend] add __init__.py for routers/services
[2026-05-13] [backend] all services + endpoints implemented and tested
[2026-05-13] [backend] fixed history sorting, volume estimation from CSV curve, BMKG wilayah code
[2026-05-13] [frontend] types, constants, api.ts, and 5 primitive components created
[2026-05-13] [docs] extracted Widget + RekomendasiWidget field requirements
[2026-05-13] [frontend] 4 widgets implemented
[2026-05-13] [frontend] WseChart implemented (AreaChart + reference lines)
[2026-05-13] [frontend] Header implemented (status bar + last updated)
[2026-05-13] [frontend] page.tsx assembled (fetch 5 endpoints + skeleton + null fallback)
[2026-05-13] [frontend] fonts updated (Poppins + DM Sans) + tailwind fontFamily vars
[2026-05-13] [frontend] chart, header, page assembly complete — dashboard fully rendered
[2026-05-13] [planning] reviewed docs/02-frontend.md + DESIGN.md for redesign
[2026-05-13] [frontend] installed framer-motion
[2026-05-13] [backend] solar_service filter -999 IRR + safe today fallback
[2026-05-13] [frontend] add AppShell + fixed Sidebar (collapse + motion)
[2026-05-13] [frontend] add AlertBar, MetricCard, DailyChart, TurbineControl, BenefitSummary
[2026-05-13] [backend] waduk history include irr + turbine_outflow
[2026-05-13] [frontend] rebuild app/page.tsx dashboard layout (metrics + chart + control)
[2026-05-13] [frontend] fix DailyChart tooltip TS typing
[2026-05-13] [frontend] full dashboard redesign — sidebar, alert bar, metric cards, turbine control, daily chart, benefit summary
[2026-05-13] [fix] IRR sentinel, negative value guards, number formatting
[2026-05-13] [migration] waduk_data replaced with waduk_daily (daily resolution, 9497 rows: 2000-01-01 → 2025-12-31), chart updated to 30/90/365 day filter
[2026-05-13] [frontend] dashboard layout restructured — dispatch recommendation replaces slider, benefit summary vertical, chart full width
[2026-05-13] [frontend] DailyChart rebuilt as stacked dual-chart — WSE top, GHI+Turbine bottom
[2026-05-13] [backend] forecast endpoint added, 7-day projection
[2026-05-13] [frontend] forecast strip + data status bar added to dashboard
[2026-05-13] [frontend] ForecastStrip expanded, charts split into WseChart + GhiTurbineChart
[2026-05-13] [frontend] charts layout stacked (1 column)
[2026-05-13] [backend] add /api/waduk/log endpoint (log harian + volume + status)
[2026-05-13] [frontend] add WadukLogItem type + getWadukLog client
[2026-05-13] [frontend] add ForecastTable + ForecastWseChart + ForecastEnergyChart + LogTable components
[2026-05-13] [frontend] add /forecast page (Forecast & Log)
[2026-05-13] [frontend] sidebar nav: Link + active via usePathname
[2026-05-13] [frontend+backend] Forecast & Log page complete
[2026-05-13] [debug] set NEXT_PUBLIC_API_URL to http://localhost:8001 (local backend port)
[2026-05-13] [design] designmd kit download blocked (missing DESIGNMD_API_KEY)
[2026-05-13] [design] user set DESIGNMD_API_KEY but current session env not updated (needs restart or session export)
[2026-05-13] [design] tailwind theme tokens: primary/gold/surface/border + shadows
[2026-05-13] [design] globals.css: base bg/text + primary/gold/bg CSS variables
[2026-05-13] [design] Sidebar: navy bg + gold active indicator + /logo.webp placement
[2026-05-13] [design] AlertBar: success/warn/error palette + icon colors
[2026-05-13] [design] Card: radius 14 + border/shadows + glass styling
[2026-05-13] [design] Badge: navy/blue/neutral + semantic background colors
[2026-05-13] [design] StatusChip: semantic bg/text + pulsing dot colors
[2026-05-13] [design] DataStatusBar: white surface + semantic live/cached/error dots
[2026-05-13] [design] Header: navy title + white surface/border tokens
[2026-05-13] [design] MetricCard: card border/radius/shadows + typography colors
[2026-05-13] [design] WadukWidget: status border colors (success/warn/error)
[2026-05-13] [design] DispatchRecommendation: navy/ink KPI colors for Turbin/FPV/Total
[2026-05-13] [design] ForecastStrip: card borders + Live/Est. badge palette
[2026-05-13] [design] BenefitSummary: icon colors (navy/green/gold)
[2026-05-13] [design] WseChart: navy area series + tokenized grid + filter buttons
[2026-05-13] [design] GhiTurbineChart: gold GHI line + slate turbine bars + grid token
[2026-05-13] [design] ForecastWseChart: navy line + tokenized grid
[2026-05-13] [design] ForecastEnergyChart: navy+gold bars + ink total line + grid token
[2026-05-13] [design] ForecastTable: header/row palette + Live/Est badges + status borders
[2026-05-13] [design] LogTable: navy filter buttons + ghost export + table palette tokens
[2026-05-13] [design] Dashboard page skeleton: bg-subtle token (#F1F5F9)
[2026-05-13] [design] Forecast page skeleton: bg-subtle token (#F1F5F9)
[2026-05-13] [design] applied SHIFT+ navy+gold design system, replaced all red accents
[2026-05-13] [design] refined technical redesign — JetBrains Mono, navy+gold system, WattVision-inspired hierarchy
[2026-05-13] [design] switched to light sidebar (white bg, navy text/accent, gold active indicator), WattVision-inspired hierarchy, monospace KPIs 42-56px, subtle card accents, #F4F6F9 page bg
[2026-05-13] [frontend] mobile responsive layout — floating bottom nav pill, 2-col metric grid, stacked sections, table column hiding, chart height responsive, scaled KPI typography
[2026-05-13] [frontend] hero header added (logo + subtitle + data source status dots + timestamp, dot pattern bg, fade-in animation), mobile nav switched to frosted glass pill with navy icons + gold dot indicator
[2026-05-13] [frontend] add static asset public/logo.webp (from components/logo)
[2026-05-13] [frontend] AppShell: decorative fixed background logo on all pages
[2026-05-13] [frontend] HeroHeader redesign: gradient overlay + dot texture + status pills/dots
[2026-05-13] [frontend] hero section redesigned with gradient + dot texture + logo, decorative background logo added to all pages
[2026-05-13] [polish] hero height increased, metric cards fit-to-content
[2026-05-13] [cleanup] removed root/backend dev logs + backend/test_nasa.py (uvicorn.*.log pending delete: file lock)
[2026-05-13] [cleanup] expanded root .gitignore (deps/env/python/logs/build/ide + ignore components/logo/)
[2026-05-13] [cleanup] logo optimized: PNG → WebP (public/logo.webp), updated img src refs, deleted public/logo.png
[2026-05-13] [cleanup] removed log files and test scripts, optimized logo to WebP, updated .gitignore for production
[2026-05-13] [cleanup] git hygiene: ignore .claude/ local state (prevent accidental commit)
[2026-05-13] [git] committed MVP snapshot (pre-push)
[2026-05-13] [git] initial push to github.com/arenoe-studio/shift
[2026-05-13] [perf] added bundle analyzer config (ANALYZE=true + webpack build) + next.config optimizations scaffold
[2026-05-13] [perf] dynamic imports for charts (ssr:false) in app/page.tsx + app/forecast/page.tsx
[2026-05-13] [perf] HeroHeader: framer-motion → CSS fadeIn animation (globals.css animate-fadeIn)
[2026-05-13] [perf] recharts imports verified: named-only (no wildcard) across chart components
[2026-05-13] [perf] bundle optimization, dynamic chart imports, CSS animation replacing framer-motion
[2026-05-13] [deploy] frontend: added `vercel.json`, added `.env.production.local` (gitignored) + committed `.env.example`
[2026-05-13] [deploy] backend: added `backend/Dockerfile` + `backend/.dockerignore` (exclude pjt2_historical.json from image)
[2026-05-13] [deploy] backend: production CORS origins + improved `/health` payload (service/version)
[2026-05-13] [deploy] docs: added `DEPLOY.md` (Vercel + Coolify steps + checklist)
```


<claude-mem-context>
# Memory Context

# [shift+] recent context, 2026-05-13 11:35pm GMT+7

Legend: 🎯session 🔴bugfix 🟣feature 🔄refactor ✅change 🔵discovery ⚖️decision 🚨security_alert 🔐security_note
Format: ID TIME TYPE TITLE
Fetch details: get_observations([IDs]) | Search: mem-search skill

Stats: 50 obs (16,443t read) | 541,363t work | 97% savings

### May 13, 2026
S29 Mobile responsive layout for SHIFT+ dashboard — floating bottom nav, scaled typography, stacked sections, table column hiding (May 13, 4:32 PM)
S28 Uninstall RTK tools from Claude Code on Windows due to frequent PowerShell command failures (May 13, 4:32 PM)
62 5:08p 🔴 Missing Closing Div Fixed in app/forecast/page.tsx
63 " ✅ Agents.md Updated: HeroHeader Registered, Changelog Appended
64 " 🔵 Production Build Passes Clean After HeroHeader and Frosted Glass Nav Changes
S30 SHIFT+ Dashboard UI Refresh — HeroHeader component + frosted glass mobile bottom nav (frontend-only, no backend changes) (May 13, 5:08 PM)
65 6:03p 🟣 HeroHeader.tsx — Full Visual Redesign with Gradient, Dot Texture & Framer Motion
66 " 🟣 AppShell.tsx — Fixed Decorative Background Logo Added to All Pages
67 " ✅ Logo Asset Copied to Public Directory for Static Serving
68 " ✅ Agents.md Changelog Updated for 2026-05-13 Visual Polish Session
69 6:06p 🟣 Hero Section Full Redesign — SHIFT+ Dashboard
70 " 🟣 Decorative Background Logo Added to All Pages via AppShell
71 " ✅ Logo Asset Copied to Public Directory for Static Serving
72 " ✅ Agents.md Changelog Updated for 2026-05-13 Visual Polish Session
73 6:07p 🔵 DESIGN.md Contains Stale WattVision Design Spec — Not SHIFT+
74 " 🟣 Decorative Background Logo Added to AppShell
75 " 🟣 HeroHeader Redesigned with Tri-State Status Dots, Pills, and motion.header
76 " ✅ HeroHeader Status Props Updated in Both Pages to Match New Tri-State API
77 6:21p 🟣 SHIFT+ Hero Section Redesign + Decorative Background Logo
78 " 🟣 SHIFT+ Visual Polish Build Verified and Deployed Successfully
79 10:04p ✅ HeroHeader Desktop & Mobile Spacing Polish
80 " ✅ MetricCard Fit-to-Content Sizing Refactor
81 " ✅ Agents.md Changelog Entry for 2026-05-13 Polish Session
82 10:07p 🔴 HeroHeader Patch Required Two-Pass Strategy After Initial Context Mismatch
83 " ✅ Mobile Subtitle Row Extracted to Standalone Element in HeroHeader
84 " ✅ MetricCard Spacer Elements Removed to Achieve Fit-to-Content Height
85 " ✅ AGENTS.md Changelog Entry Appended for 2026-05-13 Polish Session
86 10:39p ✅ HeroHeader.tsx — increased vertical breathing room on desktop and mobile
87 " ✅ MetricCard.tsx — removed fixed height, tightened padding to fit content snugly
88 " ✅ Agents.md changelog updated for 2026-05-13 polish session
89 " ✅ Polish session fully verified — build clean, dev server live, all changes confirmed in-file
90 10:48p ✅ Pre-Git-Push Codebase Cleanup Session Initiated
91 " ✅ .gitignore Hardened for Production Repository
92 " 🟣 Logo Optimized from PNG to WebP via Sharp Script
93 " ✅ Agents.md Changelog Updated for Cleanup Session
94 " 🔵 Root Directory Audit: 13 Log Files Confirmed, No OUTLINE File Present
95 10:49p 🔵 backend/database.py Is Actively Used — Must Not Be Deleted
96 " 🔵 AGENTS.md Reveals Project Identity: SHIFT+ Is a Water Dam Dispatch Coordinator
97 " ✅ 22 Log and Test Files Identified and Deletion Attempted
98 10:50p ✅ Log File Deletion Partially Succeeded — uvicorn Logs Still Present in backend/
99 " 🔵 uvicorn Log Files Locked by Unidentified Process — Multiple Kill Attempts Failed
100 " 🔵 uvicorn Log File Lock Is Exclusive — Clear-Content Also Blocked
101 " 🔵 Existing .gitignore Has Minimal Coverage — Missing Logs, IDE, Build Patterns
102 10:51p ✅ .gitignore Replaced with Production-Ready Coverage (8 → 35+ Patterns)
103 11:13p ✅ Pre-Git-Push Codebase Cleanup Session
104 11:14p 🟣 Logo Optimized PNG→WebP with Full Reference Migration
105 " 🔵 Build Succeeds; Bundle Sizes Exceed 500KB Threshold on All Routes
106 " 🔵 uvicorn Log Files Cannot Be Deleted — File Lock From Running Backend Process
107 11:19p 🟣 SHIFT+ Dashboard MVP — Initial GitHub Push
108 11:20p 🟣 SHIFT+ MVP Committed — 67 Files, Full Stack Snapshot
109 " ✅ Git Hygiene — .claude/ Excluded and Push to GitHub Succeeded
110 " ✅ SHIFT+ GitHub Push Finalized — HEAD Confirmed and Changelog Closed
111 11:23p ✅ agents.md Changelog Pushed — Final Commit on Main

Access 541k tokens of past work via get_observations([IDs]) or mem-search skill.
</claude-mem-context>
