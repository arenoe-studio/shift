from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel
from sqlalchemy import DATE, FLOAT, Column, Index, Integer

from database import Base


class WadukCurrentSchema(BaseModel):
    wse: float
    volume: float
    bulan_tahun: str
    status: Literal["normal", "warning", "critical"]


class WadukHistoryItem(BaseModel):
    tanggal: str
    wse: float
    ghi: float
    turbine_outflow: float


class WadukLogItem(BaseModel):
    tanggal: str
    wse: float
    ghi: float
    turbine_outflow: float
    volume: float
    status: Literal["normal", "warning", "critical"]


class WeatherSchema(BaseModel):
    kondisi: str
    suhu: float
    curah_hujan: float
    prakiraan: list[dict[str, Any]]  # [{hari, kondisi, suhu}]
    lokasi: str
    is_cached: bool


class SolarSchema(BaseModel):
    irr_hari_ini: float
    irr_rata_bulan: float
    estimasi_output_fpv: float
    status_surya: Literal["optimal", "moderat", "rendah"]
    is_fallback: bool


class RekomendasiSchema(BaseModel):
    dispatch_turbin_mw: float
    dispatch_fpv_mw: float
    total_mw: float
    energi_mwh: float
    co2_avoided_ton: float
    status_waduk_aman: bool
    alasan: str


class ForecastDaySchema(BaseModel):
    tanggal: str  # "2026-05-13"
    hari: str  # "Hari ini", "Besok", "+2 Hari", ...
    cuaca: str
    suhu: float
    curah_hujan: float
    wse_proyeksi: float
    irr_estimasi: float
    dispatch_turbin_mw: float
    dispatch_fpv_mw: float
    total_mw: float
    is_actual: bool  # True (BMKG), False (projection)


class WadukDaily(Base):
    __tablename__ = "waduk_daily"
    __table_args__ = (Index("idx_waduk_daily_tanggal", "tanggal"),)

    id = Column(Integer, primary_key=True)
    tanggal = Column(DATE, nullable=False, unique=True)
    wse = Column(FLOAT, nullable=False)  # masl
    ghi = Column(FLOAT, nullable=False)  # kWh/m²/day
    turbine_outflow = Column(FLOAT, nullable=False)  # m³/s
