from __future__ import annotations

from fastapi import APIRouter

from models.schemas import ForecastDaySchema
from services.forecast_service import get_forecast

router = APIRouter(prefix="/forecast", tags=["forecast"])


@router.get("", response_model=list[ForecastDaySchema])
async def forecast() -> list[ForecastDaySchema]:
    return await get_forecast()

