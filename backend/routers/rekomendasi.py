from __future__ import annotations

import asyncio

from fastapi import APIRouter

from models.schemas import RekomendasiSchema
from services.bmkg_service import get_weather
from services.shift_engine import compute
from services.solar_service import get_irradiance
from services.waduk_service import get_current_waduk

router = APIRouter(prefix="/rekomendasi", tags=["rekomendasi"])


@router.get("", response_model=RekomendasiSchema)
async def rekomendasi() -> RekomendasiSchema:
    waduk, weather, solar = await asyncio.gather(get_current_waduk(), get_weather(), get_irradiance())
    return compute(wse=waduk.wse, curah_hujan=weather.curah_hujan, irr=solar.irr_hari_ini)
