from __future__ import annotations

from fastapi import APIRouter, Query

from models.schemas import WadukCurrentSchema, WadukHistoryItem, WadukLogItem
from services.waduk_service import get_current_waduk, get_waduk_history, get_waduk_log

router = APIRouter(prefix="/waduk", tags=["waduk"])


@router.get("/current", response_model=WadukCurrentSchema)
async def waduk_current() -> WadukCurrentSchema:
    return await get_current_waduk()


@router.get("/history", response_model=list[WadukHistoryItem])
async def waduk_history(days: int = Query(default=30, ge=1, le=365)) -> list[WadukHistoryItem]:
    return await get_waduk_history(days=days)


@router.get("/log", response_model=list[WadukLogItem])
async def waduk_log(days: int = Query(default=30, ge=1, le=365)) -> list[WadukLogItem]:
    return await get_waduk_log(days=days)
