from __future__ import annotations

from fastapi import APIRouter

from models.schemas import SolarSchema
from services.solar_service import get_irradiance

router = APIRouter(prefix="/solar", tags=["solar"])


@router.get("/irradiance", response_model=SolarSchema)
async def solar_irradiance() -> SolarSchema:
    return await get_irradiance()
