from __future__ import annotations

from datetime import date
from pathlib import Path

import numpy as np
from sqlalchemy import desc, select

from database import AsyncSessionLocal
from models.schemas import WadukCurrentSchema, WadukDaily, WadukHistoryItem, WadukLogItem

WSE_WARNING = 100.0
WSE_CRITICAL = 94.44

_CURVE_WSE: np.ndarray | None = None
_CURVE_VOL: np.ndarray | None = None


def _compute_status(wse: float) -> str:
    if wse >= WSE_WARNING:
        return "normal"
    if wse >= WSE_CRITICAL:
        return "warning"
    return "critical"


def _load_elevation_volume_curve() -> tuple[np.ndarray, np.ndarray] | tuple[None, None]:
    path = Path(__file__).resolve().parents[1] / "data" / "elevation_volume.csv"
    if not path.exists():
        return (None, None)

    try:
        data = np.genfromtxt(path, delimiter=",", names=True, dtype=float, encoding="utf-8")
        if not getattr(data, "dtype", None) or not data.dtype.names:
            return (None, None)

        by_lower = {name.lstrip("\ufeff").lower(): name for name in data.dtype.names}
        wse_col = by_lower.get("wse_masl") or next((n for n in data.dtype.names if n.lower().startswith("wse")), None)
        vol_col = by_lower.get("volume_juta_m3") or next((n for n in data.dtype.names if "volume" in n.lower()), None)

        if wse_col is None or vol_col is None:
            return (None, None)

        wse = np.asarray(data[wse_col], dtype=float)
        vol = np.asarray(data[vol_col], dtype=float)
        order = np.argsort(wse)
        return (wse[order], vol[order])
    except Exception:
        return (None, None)


def _ensure_curve_loaded() -> None:
    global _CURVE_WSE, _CURVE_VOL
    if _CURVE_WSE is not None and _CURVE_VOL is not None:
        return
    _CURVE_WSE, _CURVE_VOL = _load_elevation_volume_curve()


def _interpolate_volume(wse: float) -> float:
    _ensure_curve_loaded()
    if _CURVE_WSE is None or _CURVE_VOL is None:
        return 0.0
    return round(float(np.interp(float(wse), _CURVE_WSE, _CURVE_VOL)), 2)


_ensure_curve_loaded()


async def get_current_waduk() -> WadukCurrentSchema:
    async with AsyncSessionLocal() as session:
        row = (
            await session.execute(
                select(WadukDaily.tanggal, WadukDaily.wse).order_by(desc(WadukDaily.tanggal)).limit(1)
            )
        ).first()

    if not row:
        return WadukCurrentSchema(wse=0.0, volume=0.0, bulan_tahun="-", status="critical")

    tanggal, wse = row
    tanggal_str = "-"
    if isinstance(tanggal, date):
        tanggal_str = tanggal.strftime("%d %b %Y")
    wse_f = float(wse)

    return WadukCurrentSchema(
        wse=wse_f,
        volume=_interpolate_volume(wse_f),
        bulan_tahun=tanggal_str,
        status=_compute_status(wse_f),
    )


async def get_waduk_history(days: int = 30) -> list[WadukHistoryItem]:
    async with AsyncSessionLocal() as session:
        rows = (
            await session.execute(
                select(WadukDaily.tanggal, WadukDaily.wse, WadukDaily.ghi, WadukDaily.turbine_outflow)
                .order_by(desc(WadukDaily.tanggal))
                .limit(days)
            )
        ).all()

    rows_asc = list(reversed(rows))
    result: list[WadukHistoryItem] = []
    for (tanggal, wse, ghi, turbine_outflow) in rows_asc:
        tanggal_s = tanggal.isoformat() if isinstance(tanggal, date) else str(tanggal)
        result.append(
            WadukHistoryItem(
                tanggal=tanggal_s,
                wse=float(wse),
                ghi=float(ghi),
                turbine_outflow=float(turbine_outflow),
            )
        )
    return result


async def get_waduk_log(days: int = 30) -> list[WadukLogItem]:
    async with AsyncSessionLocal() as session:
        rows = (
            await session.execute(
                select(WadukDaily.tanggal, WadukDaily.wse, WadukDaily.ghi, WadukDaily.turbine_outflow)
                .order_by(desc(WadukDaily.tanggal))
                .limit(days)
            )
        ).all()

    result: list[WadukLogItem] = []
    for (tanggal, wse, ghi, turbine_outflow) in rows:
        tanggal_s = tanggal.isoformat() if isinstance(tanggal, date) else str(tanggal)
        wse_f = float(wse)
        result.append(
            WadukLogItem(
                tanggal=tanggal_s,
                wse=wse_f,
                ghi=float(ghi),
                turbine_outflow=float(turbine_outflow),
                volume=_interpolate_volume(wse_f),
                status=_compute_status(wse_f),
            )
        )
    return result
