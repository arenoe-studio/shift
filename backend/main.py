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

frontend_url = os.getenv("FRONTEND_URL")
allow_origins = [o for o in [frontend_url, "http://localhost:3000"] if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(waduk_router, prefix="/api")
app.include_router(bmkg_router, prefix="/api")
app.include_router(solar_router, prefix="/api")
app.include_router(rekomendasi_router, prefix="/api")
app.include_router(forecast_router, prefix="/api")


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}
