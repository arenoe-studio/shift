# SHIFT+ Dashboard — Backend Spec

---

## 1. Database (NeonDB — PostgreSQL)

**Koneksi:** via `asyncpg` atau `sqlalchemy[asyncio]` + `psycopg2`.
**Connection string:** dari env var `DATABASE_URL`.

### Tabel: `waduk_data`

```sql
CREATE TABLE waduk_data (
    id          SERIAL PRIMARY KEY,
    tahun       INTEGER NOT NULL,
    bulan       VARCHAR(3) NOT NULL,       -- 'Jan', 'Feb', ..., 'Dec'
    wse         FLOAT NOT NULL,            -- masl
    irr         FLOAT NOT NULL,            -- kWh/m²/day
    turbine_outflow FLOAT NOT NULL,        -- m³/s
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_waduk_tahun_bulan ON waduk_data (tahun, bulan);
```

**Seed data:** dari `data/pjt2_historical.json` (dataset 2000–2025, 312 baris).
**Data terkini untuk dashboard:** query bulan/tahun terbaru yang tersedia.

---

## 2. Routers

### 2.1 `routers/waduk.py`

| Method | Path | Service call | Returns |
|---|---|---|---|
| GET | `/api/waduk/current` | `get_current_waduk()` | `WadukCurrentSchema` |
| GET | `/api/waduk/history` | `get_waduk_history(months)` | `WadukHistorySchema[]` |

Query param `/history`: `months` (int, default `12`, max `60`).

---

### 2.2 `routers/bmkg.py`

| Method | Path | Service call | Returns |
|---|---|---|---|
| GET | `/api/bmkg/weather` | `get_weather()` | `WeatherSchema` |

---

### 2.3 `routers/solar.py`

| Method | Path | Service call | Returns |
|---|---|---|---|
| GET | `/api/solar/irradiance` | `get_irradiance()` | `SolarSchema` |

---

### 2.4 `routers/rekomendasi.py`

| Method | Path | Service call | Returns |
|---|---|---|---|
| GET | `/api/rekomendasi` | `get_rekomendasi()` | `RekomendasiSchema` |

`get_rekomendasi()` memanggil ketiga service lain secara paralel (`asyncio.gather`), lalu meneruskan hasilnya ke `shift_engine.compute()`.

---

## 3. Services

### 3.1 `waduk_service.py`

**`get_current_waduk()`**
- Query: `SELECT * FROM waduk_data ORDER BY tahun DESC, bulan DESC LIMIT 1`
- Tambahkan field `status` berdasarkan threshold WSE (lihat konstanta di bawah)
- Return: `WadukCurrentSchema`

**`get_waduk_history(months: int)`**
- Query: `SELECT tahun, bulan, wse FROM waduk_data ORDER BY tahun DESC, bulan DESC LIMIT {months}`
- Return list dibalik (ascending) agar grafik kiri ke kanan
- Return: `WadukHistorySchema[]`

---

### 3.2 `bmkg_service.py`

**Endpoint BMKG:**
```
GET https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=32.02.12.2001
```
Kode wilayah `32.02.12.2001` = Jatiluhur, Purwakarta, Jawa Barat.

**`get_weather()`**
- Fetch via `httpx.AsyncClient`, timeout `5s`
- Parse field: `cuaca`, `t` (suhu), `hu` (kelembaban), `tp` (curah hujan)
- Ambil data hari ini + 2 hari ke depan untuk prakiraan
- Fallback: kalau fetch gagal, return `last_known_weather` dari cache in-memory (disimpan saat fetch terakhir berhasil)
- Map kode cuaca BMKG ke label: `0,1→Cerah`, `2,3→Berawan`, `60–69→Hujan Ringan`, `80–99→Hujan Lebat`
- Return: `WeatherSchema`

**Cache:** simpan response terakhir yang berhasil di variabel modul `_weather_cache`. Update setiap fetch sukses.

---

### 3.3 `solar_service.py`

**Endpoint NASA POWER:**
```
GET https://power.larc.nasa.gov/api/temporal/daily/point
  ?parameters=ALLSKY_SFC_SW_DWN
  &community=RE
  &longitude=107.3342
  &latitude=-6.5081
  &start={YYYYMMDD_7_hari_lalu}
  &end={YYYYMMDD_hari_ini}
  &format=JSON
```

**`get_irradiance()`**
- Fetch 7 hari terakhir, ambil nilai hari ini dan rata-rata 7 hari
- Kalkulasi estimasi output FPV hari ini:
  ```
  estimasi_output_mwh = irr_hari_ini × FPV_CAPACITY_MWP × PR
  PR (Performance Ratio) = 0.78 (standar industri FPV)
  ```
- Tentukan `status_surya` berdasarkan threshold IRR
- Fallback: kalau fetch gagal, pakai rata-rata IRR bulanan dari konstanta hardcoded (dari dataset NASA POWER historis Jatiluhur)
- Return: `SolarSchema`

**IRR fallback per bulan (rata-rata historis Jatiluhur):**
```python
IRR_MONTHLY_FALLBACK = {
    'Jan': 4.32, 'Feb': 4.71, 'Mar': 4.87, 'Apr': 4.75,
    'May': 4.88, 'Jun': 4.48, 'Jul': 5.11, 'Aug': 5.33,
    'Sep': 5.97, 'Oct': 5.13, 'Nov': 4.47, 'Dec': 5.40
}
```

---

### 3.4 `shift_engine.py`

**`compute(wse, curah_hujan, irr)`** → `RekomendasiSchema`

Logika rule-based berdasarkan tiga input. Semua threshold dari `constants.py`.

#### Konstanta Engine

```python
WSE_CRITICAL   = 94.44   # masl — ambang batas kritis operasional
WSE_WARNING    = 100.0   # masl — ambang batas waspada
TURBINE_MAX    = 187.0   # MW — kapasitas terpasang
TURBINE_MIN    = 60.0    # MW — minimum operasional turbin
FPV_MAX        = 651.0   # MWp — kapasitas FPV terpasang
PR             = 0.78    # Performance Ratio FPV
CO2_FACTOR     = 0.846   # tCO₂/MWh — faktor emisi grid Indonesia
```

#### Decision Table

| Kondisi WSE | Curah Hujan | IRR | Dispatch Turbin | Dispatch FPV | Alasan |
|---|---|---|---|---|---|
| ≥ 100 | berapapun | berapapun | `TURBINE_MAX` (187 MW) | sesuai IRR | WSE normal, turbin full capacity |
| 94.44–99.99 | ≥ 10 mm | berapapun | 150 MW | sesuai IRR | WSE waspada, hujan masuk — kurangi discharge |
| 94.44–99.99 | < 10 mm | ≥ 5.5 | 130 MW | sesuai IRR | WSE waspada, cerah — andalkan FPV |
| 94.44–99.99 | < 10 mm | < 5.5 | 150 MW | sesuai IRR | WSE waspada, mendung — turbin kompensasi |
| < 94.44 | ≥ 10 mm | berapapun | `TURBINE_MIN` (60 MW) | sesuai IRR | WSE kritis, hujan masuk — minimal discharge |
| < 94.44 | < 10 mm | ≥ 5.5 | `TURBINE_MIN` (60 MW) | sesuai IRR | WSE kritis, cerah — FPV ambil alih |
| < 94.44 | < 10 mm | < 5.5 | 80 MW | sesuai IRR | WSE kritis, mendung — turbin minimum+buffer |

**Kalkulasi FPV dispatch "sesuai IRR":**
```python
dispatch_fpv = irr × FPV_MAX × PR  # dalam MWh/day → konversi ke MW rata-rata
dispatch_fpv = min(dispatch_fpv, FPV_MAX)
```

**Kalkulasi output & dampak:**
```python
total_energi_mwh = (dispatch_turbin + dispatch_fpv) × 24
co2_avoided      = dispatch_fpv × 24 × CO2_FACTOR
status_aman      = wse >= WSE_CRITICAL
```

---

## 4. Pydantic Schemas (`models/schemas.py`)

```python
class WadukCurrentSchema(BaseModel):
    wse: float
    volume: float
    bulan_tahun: str
    status: Literal['normal', 'warning', 'critical']

class WadukHistoryItem(BaseModel):
    bulan: str
    wse: float

class WeatherSchema(BaseModel):
    kondisi: str
    suhu: float
    curah_hujan: float
    prakiraan: list[dict]   # [{hari, kondisi, suhu}]
    lokasi: str
    is_cached: bool

class SolarSchema(BaseModel):
    irr_hari_ini: float
    irr_rata_bulan: float
    estimasi_output_fpv: float
    status_surya: Literal['optimal', 'moderat', 'rendah']
    is_fallback: bool

class RekomendasiSchema(BaseModel):
    dispatch_turbin_mw: float
    dispatch_fpv_mw: float
    total_mw: float
    energi_mwh: float
    co2_avoided_ton: float
    status_waduk_aman: bool
    alasan: str
```

---

## 5. Environment Variables (`apps/backend/.env`)

| Variable | Keterangan |
|---|---|
| `DATABASE_URL` | NeonDB PostgreSQL connection string |
| `BMKG_WILAYAH_CODE` | Default `32.02.12.2001` (Jatiluhur) |
| `FRONTEND_URL` | URL frontend untuk CORS whitelist |
| `PORT` | Default `8000` |

---

## 6. CORS

Whitelist origin dari `FRONTEND_URL`. Saat development tambahkan `http://localhost:3000`.

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL"), "http://localhost:3000"],
    allow_methods=["GET"],
    allow_headers=["*"],
)
```
