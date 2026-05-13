from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import desc, extract, func, select

from database import AsyncSessionLocal
from models.schemas import ForecastDaySchema
from services.bmkg_service import get_weather
from services.shift_engine import compute

_TZ = ZoneInfo("Asia/Jakarta")

_WSE_MIN = 80.0
_WSE_MAX = 115.0
_IRR_FALLBACK = 4.8


def _label_for_day(offset: int) -> str:
    if offset == 0:
        return "Hari ini"
    if offset == 1:
        return "Besok"
    return f"+{offset} Hari"


async def _get_last_wse() -> float:
    from models.schemas import WadukDaily

    async with AsyncSessionLocal() as session:
        row = (await session.execute(select(WadukDaily.wse).order_by(desc(WadukDaily.tanggal)).limit(1))).first()
    if not row or row[0] is None:
        return 100.0
    try:
        return float(row[0])
    except Exception:
        return 100.0


async def _get_monthly_avg(month: int) -> tuple[float | None, float | None]:
    from models.schemas import WadukDaily

    async with AsyncSessionLocal() as session:
        row = (
            await session.execute(
                select(func.avg(WadukDaily.wse), func.avg(WadukDaily.ghi)).where(extract("month", WadukDaily.tanggal) == month)
            )
        ).first()

    if not row:
        return (None, None)
    avg_wse, avg_ghi = row
    wse_val = float(avg_wse) if avg_wse is not None else None
    ghi_val = float(avg_ghi) if avg_ghi is not None else None
    return (wse_val, ghi_val)


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


async def get_forecast() -> list[ForecastDaySchema]:
    weather = await get_weather()

    today = datetime.now(_TZ).date()
    wse_today = await _get_last_wse()

    # Pre-compute monthly averages for each target month (may cross month boundary).
    monthly_cache: dict[int, tuple[float | None, float | None]] = {}

    # Fill cache lazily but deterministically in one pass.
    for i in range(7):
        d = today + timedelta(days=i)
        if d.month not in monthly_cache:
            monthly_cache[d.month] = await _get_monthly_avg(d.month)

    bmkg_by_day: dict[str, tuple[str, float, float]] = {}
    bmkg_by_day[today.isoformat()] = (weather.kondisi, float(weather.suhu), float(weather.curah_hujan))
    for item in weather.prakiraan or []:
        hari = str(item.get("hari") or "")
        if not hari:
            continue
        kondisi = str(item.get("kondisi") or weather.kondisi)
        suhu = float(item.get("suhu") or weather.suhu)
        # BMKG prakiraan endpoint used here doesn't provide rainfall per-day reliably; keep 0.0 for forward days.
        bmkg_by_day.setdefault(hari, (kondisi, suhu, 0.0))

    result: list[ForecastDaySchema] = []
    wse_running = float(wse_today)

    for offset in range(7):
        d = today + timedelta(days=offset)
        tanggal = d.isoformat()

        is_actual = offset <= 2
        if is_actual and tanggal in bmkg_by_day:
            cuaca, suhu, curah_hujan = bmkg_by_day[tanggal]
        elif is_actual:
            cuaca, suhu, curah_hujan = (weather.kondisi, float(weather.suhu), 0.0)
        else:
            cuaca, suhu, curah_hujan = ("Proyeksi", float(weather.suhu), 0.0)

        avg_wse, avg_ghi = monthly_cache.get(d.month, (None, None))
        irr = float(avg_ghi) if avg_ghi is not None else _IRR_FALLBACK
        irr = max(0.1, irr)

        # Apply simple daily balance after "today" (offset 0 remains last-known WSE).
        if offset > 0:
            delta = (float(curah_hujan) * 0.001) - 0.05
            wse_running = float(wse_running) + float(delta)
        wse_running = _clamp(float(wse_running), _WSE_MIN, _WSE_MAX)

        rekom = compute(wse=float(wse_running), curah_hujan=float(curah_hujan), irr=float(irr))

        result.append(
            ForecastDaySchema(
                tanggal=tanggal,
                hari=_label_for_day(offset),
                cuaca=str(cuaca),
                suhu=float(suhu),
                curah_hujan=float(curah_hujan),
                wse_proyeksi=float(wse_running),
                irr_estimasi=float(irr),
                dispatch_turbin_mw=float(rekom.dispatch_turbin_mw),
                dispatch_fpv_mw=float(rekom.dispatch_fpv_mw),
                total_mw=float(rekom.total_mw),
                is_actual=bool(is_actual),
            )
        )

    return result
