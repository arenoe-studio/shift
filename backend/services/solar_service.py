from __future__ import annotations

from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

import httpx

from models.schemas import SolarSchema

_TZ = ZoneInfo("Asia/Jakarta")

FPV_MAX = 651.0
PR = 0.78

IRR_MONTHLY_FALLBACK: dict[str, float] = {
    "Jan": 4.32,
    "Feb": 4.71,
    "Mar": 4.87,
    "Apr": 4.75,
    "May": 4.88,
    "Jun": 4.48,
    "Jul": 5.11,
    "Aug": 5.33,
    "Sep": 5.97,
    "Oct": 5.13,
    "Nov": 4.47,
    "Dec": 5.40,
}


def _status_surya(irr: float) -> str:
    if irr >= 5.5:
        return "optimal"
    if irr >= 4.0:
        return "moderat"
    return "rendah"


def _format_day(d: date) -> str:
    return d.strftime("%Y%m%d")


async def get_irradiance() -> SolarSchema:
    today = datetime.now(_TZ).date()
    start = today - timedelta(days=7)

    try:
        url = "https://power.larc.nasa.gov/api/temporal/daily/point"
        params = {
            "parameters": "ALLSKY_SFC_SW_DWN",
            "community": "RE",
            "longitude": "107.3342",
            "latitude": "-6.5081",
            "start": _format_day(start),
            "end": _format_day(today),
            "format": "JSON",
        }
        headers = {"User-Agent": "shift-plus/1.0", "Accept": "application/json"}

        async with httpx.AsyncClient(timeout=httpx.Timeout(8.0), headers=headers) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            payload = resp.json()

        values: dict[str, float] = (
            payload.get("properties", {}).get("parameter", {}).get("ALLSKY_SFC_SW_DWN", {}) or {}
        )

        daily_vals: list[float] = []
        for i in range(8):
            d = start + timedelta(days=i)
            v = values.get(_format_day(d))
            if v is None:
                continue
            try:
                fv = float(v)
            except Exception:
                continue
            # NASA POWER sentinel for missing data is typically -999.
            if fv <= -990:
                continue
            daily_vals.append(fv)

        if not daily_vals:
            raise RuntimeError("No irradiance values returned.")

        irr_rata_bulan = float(sum(daily_vals) / len(daily_vals))
        raw_today = values.get(_format_day(today))
        irr_hari_ini = irr_rata_bulan
        if raw_today is not None:
            try:
                parsed_today = float(raw_today)
                if parsed_today > -990:
                    irr_hari_ini = parsed_today
            except Exception:
                pass
        estimasi_output_fpv = irr_hari_ini * FPV_MAX * PR

        return SolarSchema(
            irr_hari_ini=irr_hari_ini,
            irr_rata_bulan=irr_rata_bulan,
            estimasi_output_fpv=estimasi_output_fpv,
            status_surya=_status_surya(irr_hari_ini),
            is_fallback=False,
        )
    except Exception:
        month_key = today.strftime("%b")
        irr = float(IRR_MONTHLY_FALLBACK.get(month_key, 4.8))
        return SolarSchema(
            irr_hari_ini=irr,
            irr_rata_bulan=irr,
            estimasi_output_fpv=irr * FPV_MAX * PR,
            status_surya=_status_surya(irr),
            is_fallback=True,
        )
