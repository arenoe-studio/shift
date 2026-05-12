# SHIFT+ Dashboard — Catatan Implementasi

---

## 1. Urutan Pengerjaan

Agent harus mengerjakan dalam urutan ini. Jangan loncat tahap.

```
1. Setup monorepo (folder structure, git init)
2. Backend — setup FastAPI + koneksi NeonDB + seed data
3. Backend — waduk_service + endpoint /api/waduk/*
4. Backend — bmkg_service + endpoint /api/bmkg/weather
5. Backend — solar_service + endpoint /api/solar/irradiance
6. Backend — shift_engine + endpoint /api/rekomendasi
7. Frontend — setup Next.js + Tailwind + install dependencies
8. Frontend — komponen primitif (Card, Badge, StatusChip, dll)
9. Frontend — lib/api.ts + types/index.ts + lib/constants.ts
10. Frontend — WadukWidget
11. Frontend — WeatherWidget
12. Frontend — SolarWidget
13. Frontend — RekomendasiWidget
14. Frontend — WseChart
15. Frontend — Header + layout page.tsx
16. Testing end-to-end: semua endpoint → semua widget
17. Update claude.md secara menyeluruh
```

---

## 2. Prinsip Penulisan Kode

| Prinsip | Detail |
|---|---|
| Satu file, satu tanggung jawab | Tidak ada file yang mengerjakan lebih dari satu hal |
| Tidak ada fetch di komponen | Semua HTTP call hanya dari `lib/api.ts` |
| Tidak ada logika bisnis di frontend | Kalkulasi dan threshold hanya di backend |
| Konstanta tidak di-hardcode inline | Semua dari `constants.ts` (frontend) atau `constants.py` (backend) |
| File kecil | Jika satu file melebihi ~150 baris, pertimbangkan untuk dipecah |

---

## 3. Seed Data NeonDB

Seed dari `apps/backend/data/pjt2_historical.json`. Format:

```json
[
  { "tahun": 2000, "bulan": "Jan", "wse": 99.60, "irr": 4.32, "turbine_outflow": 192.21 },
  ...
]
```

Buat script `apps/backend/scripts/seed.py` untuk insert ke NeonDB. Jalankan sekali saat setup awal. Script harus idempotent (cek duplikat sebelum insert).

---

## 4. Deployment Notes

### Frontend (Vercel)
- Set environment variable `NEXT_PUBLIC_API_URL` di Vercel dashboard → URL backend Coolify
- Semua fetch di `lib/api.ts` menggunakan `process.env.NEXT_PUBLIC_API_URL` sebagai base URL

### Backend (Coolify — Ubuntu Server)
- Buat `Dockerfile` di `apps/backend/`
- Expose port `8000`
- Set semua env var di Coolify dashboard, bukan di file `.env` yang di-commit
- `.env` hanya untuk development lokal, masuk `.gitignore`

---

## 5. Error Handling

| Skenario | Penanganan |
|---|---|
| BMKG fetch timeout | Return cache terakhir, set `is_cached: true` |
| NASA POWER fetch gagal | Return IRR fallback bulanan, set `is_fallback: true` |
| NeonDB query gagal | Return HTTP 503 dengan pesan jelas |
| Frontend fetch gagal | Tampilkan skeleton loader per widget, bukan blank atau crash |
| Semua fetch gagal | Dashboard tetap render, tiap widget tampilkan status "Data tidak tersedia" |

Frontend tidak boleh crash karena satu widget gagal. Gunakan error boundary per widget.

---

## 6. Hal yang Perlu Diverifikasi Agent Sebelum Build

- [ ] Konfirmasi endpoint BMKG `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=32.02.12.2001` masih aktif dan struktur response-nya sesuai
- [ ] Konfirmasi endpoint NASA POWER parameter `ALLSKY_SFC_SW_DWN` tersedia untuk koordinat Jatiluhur
- [ ] Konfirmasi NeonDB connection string valid sebelum seed
- [ ] Test CORS: frontend localhost bisa hit backend localhost

---

## 7. Instruksi claude.md

Agent wajib menjaga `claude.md` di root repo dengan ketentuan berikut:

| Kapan | Apa yang diupdate |
|---|---|
| Setiap install package baru | Dependency Registry |
| Setiap fungsi baru dibuat | Function Registry (nama, file, line start-end, I/O, memanggil siapa) |
| Setiap endpoint aktif | API Endpoints table |
| Setiap ada bug ditemukan | Known Issues (tambah baris baru) |
| Setiap bug diselesaikan | Known Issues (update status → resolved, tulis solusi) |
| Setiap selesai satu unit kerja | Changelog (satu baris, format `[YYYY-MM-DD] [area] deskripsi singkat`) |
| Setiap selesai satu unit kerja | Project State (`Last updated`, `Last worked on`) |

**Aturan penulisan claude.md:**
- Tidak ada kalimat panjang — tabel dan list saja
- Line number di Function Registry harus akurat — update kalau ada refactor
- Jangan hapus entri lama di Changelog dan Known Issues — append saja
- Kalau ada ketidaksesuaian antara claude.md dan kode aktual, kode yang benar — update claude.md

---

## 8. Struktur File yang Tidak Boleh Diubah Tanpa Konfirmasi

File-file berikut adalah kontrak antara frontend dan backend. Perubahan di sini berdampak ke dua sisi sekaligus:

- `types/index.ts` — type definitions
- `models/schemas.py` — Pydantic schemas
- `lib/constants.ts` dan `constants.py` — threshold values
- Semua path endpoint di `routers/`

Kalau agent perlu mengubah salah satu dari file ini, catat dulu di `claude.md` Known Issues sebelum eksekusi, dan pastikan perubahan propagated ke kedua sisi (frontend + backend).
