from __future__ import annotations

import os
from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

import httpx

from models.schemas import WeatherSchema

_BMKG_BASE_URL = "https://api.bmkg.go.id/publik/prakiraan-cuaca"
_BMKG_WILAYAH_CODE = os.getenv("BMKG_WILAYAH_CODE", "32.14.03.2001")
_BMKG_URL = f"{_BMKG_BASE_URL}?adm4={_BMKG_WILAYAH_CODE}"
_TZ = ZoneInfo("Asia/Jakarta")

_weather_cache: WeatherSchema | None = None
_resolved_bmkg_url: str | None = None
_resolved_bmkg_code: str | None = None


def _map_weather_code(code: int | None) -> str:
    if code in {0, 1}:
        return "Cerah"
    if code in {2, 3}:
        return "Berawan"
    if code is not None and 60 <= code <= 69:
        return "Hujan Ringan"
    if code is not None and 80 <= code <= 99:
        return "Hujan Lebat"
    return "Berawan"


def _parse_local_date(value: str | None) -> date | None:
    if not value:
        return None
    try:
        # "2026-05-13 06:00:00"
        if "T" not in value and " " in value:
            return datetime.strptime(value, "%Y-%m-%d %H:%M:%S").date()
        # "2026-05-12T23:00:00Z"
        if value.endswith("Z"):
            dt = datetime.fromisoformat(value.replace("Z", "+00:00")).astimezone(_TZ)
            return dt.date()
        return datetime.fromisoformat(value).astimezone(_TZ).date()
    except Exception:
        return None


def _choose_current_slot(slots: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not slots:
        return None
    now = datetime.now(_TZ)

    best: dict[str, Any] | None = None
    best_delta: timedelta | None = None
    for item in slots:
        local_dt = item.get("local_datetime")
        try:
            if isinstance(local_dt, str):
                dt = datetime.strptime(local_dt, "%Y-%m-%d %H:%M:%S").replace(tzinfo=_TZ)
            else:
                continue
        except Exception:
            continue

        delta = abs(dt - now)
        if best is None or best_delta is None or delta < best_delta:
            best = item
            best_delta = delta
    return best or slots[0]


def _is_purwakarta(payload: dict[str, Any]) -> bool:
    lokasi_raw = payload.get("lokasi") or {}
    kotkab = str(lokasi_raw.get("kotkab") or "")
    return "purwakarta" in kotkab.lower()


async def _fetch_bmkg_payload() -> dict[str, Any]:
    global _resolved_bmkg_code, _resolved_bmkg_url

    if _resolved_bmkg_url is not None:
        headers = {"User-Agent": "shift-plus/1.0", "Accept": "application/json"}
        timeout = httpx.Timeout(5.0)
        async with httpx.AsyncClient(timeout=timeout, headers=headers) as client:
            resp = await client.get(_resolved_bmkg_url)
            resp.raise_for_status()
            return resp.json()

    candidates = [
        _BMKG_WILAYAH_CODE,
        "32.03.10.2004",  # Jatiluhur (requested, may be invalid)
        "32.03.10.2001",  # Cirata area (requested)
        "32.03",  # requested fallback (often invalid for adm4)
        "32.14.03.2001",  # Jatiluhur, Purwakarta (verified)
    ]

    headers = {"User-Agent": "shift-plus/1.0", "Accept": "application/json"}
    timeout = httpx.Timeout(5.0)
    last_ok: tuple[str, dict[str, Any]] | None = None

    async with httpx.AsyncClient(timeout=timeout, headers=headers) as client:
        for code in candidates:
            url = f"{_BMKG_BASE_URL}?adm4={code}"
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                payload = resp.json()
            except Exception:
                continue

            last_ok = (code, payload)
            if _is_purwakarta(payload):
                _resolved_bmkg_code = code
                _resolved_bmkg_url = url
                return payload

    if last_ok is not None:
        _resolved_bmkg_code = last_ok[0]
        _resolved_bmkg_url = f"{_BMKG_BASE_URL}?adm4={last_ok[0]}"
        return last_ok[1]

    raise RuntimeError("BMKG request failed for all candidates.")


async def get_weather() -> WeatherSchema:
    global _weather_cache

    try:
        payload = await _fetch_bmkg_payload()

        lokasi_raw = payload.get("lokasi") or {}
        lokasi = ", ".join(
            [p for p in [lokasi_raw.get("desa"), lokasi_raw.get("kecamatan"), lokasi_raw.get("kotkab"), lokasi_raw.get("provinsi")] if p]
        ) or "Jatiluhur"

        data_list = payload.get("data") or []
        cuaca_days = (data_list[0].get("cuaca") if data_list else None) or []

        today = datetime.now(_TZ).date()
        wanted_days = [today + timedelta(days=i) for i in range(3)]

        by_date: dict[date, list[dict[str, Any]]] = {}
        for day_slots in cuaca_days:
            if not isinstance(day_slots, list):
                continue
            for item in day_slots:
                if not isinstance(item, dict):
                    continue
                d = _parse_local_date(item.get("local_datetime")) or _parse_local_date(item.get("datetime"))
                if d is None:
                    continue
                by_date.setdefault(d, []).append(item)

        today_slots = by_date.get(today, [])
        current_item = _choose_current_slot(today_slots) or (today_slots[0] if today_slots else None)

        kondisi = _map_weather_code(int(current_item.get("weather")) if current_item and current_item.get("weather") is not None else None)
        suhu = float(current_item.get("t")) if current_item and current_item.get("t") is not None else 28.0
        curah = float(current_item.get("tp")) if current_item and current_item.get("tp") is not None else 0.0

        prakiraan: list[dict[str, Any]] = []
        for d in wanted_days:
            slots = by_date.get(d, [])
            item = slots[0] if slots else None
            prakiraan.append(
                {
                    "hari": d.isoformat(),
                    "kondisi": _map_weather_code(int(item.get("weather")) if item and item.get("weather") is not None else None),
                    "suhu": float(item.get("t")) if item and item.get("t") is not None else suhu,
                }
            )

        result = WeatherSchema(
            kondisi=kondisi,
            suhu=suhu,
            curah_hujan=curah,
            prakiraan=prakiraan,
            lokasi=lokasi,
            is_cached=False,
        )
        _weather_cache = result
        return result
    except Exception:
        if _weather_cache is not None:
            cached = WeatherSchema(**_weather_cache.model_dump(), is_cached=True)
            return cached

        return WeatherSchema(
            kondisi="Berawan",
            suhu=28.0,
            curah_hujan=0.0,
            prakiraan=[
                {"hari": datetime.now(_TZ).date().isoformat(), "kondisi": "Berawan", "suhu": 28.0},
            ],
            lokasi="Jatiluhur, Purwakarta, Jawa Barat",
            is_cached=True,
        )
