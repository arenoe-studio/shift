from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.bmkg import router as bmkg_router
from routers.forecast import router as forecast_router
from routers.rekomendasi import router as rekomendasi_router
from routers.solar import router as solar_router
from routers.waduk import router as waduk_router

app = FastAPI(title="SHIFT+ Backend", version="0.1.0")

allowed_origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
    "https://shift.arenoe-studio.my.id",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["GET"],
    allow_headers=["*"],
    allow_credentials=False,
)

app.include_router(waduk_router, prefix="/api")
app.include_router(bmkg_router, prefix="/api")
app.include_router(solar_router, prefix="/api")
app.include_router(rekomendasi_router, prefix="/api")
app.include_router(forecast_router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "SHIFT+ API",
        "version": "1.0.0",
    }
