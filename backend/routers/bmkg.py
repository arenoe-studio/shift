from __future__ import annotations

from fastapi import APIRouter

from models.schemas import WeatherSchema
from services.bmkg_service import get_weather

router = APIRouter(prefix="/bmkg", tags=["bmkg"])


@router.get("/weather", response_model=WeatherSchema)
async def bmkg_weather() -> WeatherSchema:
    return await get_weather()
