from __future__ import annotations

import os
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from sqlalchemy.orm import declarative_base
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

_ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)


def _normalize_database_url(url: str) -> str:
    normalized = url.strip().strip('"').strip("'")
    if normalized.startswith("postgresql://"):
        normalized = normalized.replace("postgresql://", "postgresql+asyncpg://", 1)
    parts = urlsplit(normalized)
    if parts.query:
        query_pairs = [(k, v) for (k, v) in parse_qsl(parts.query, keep_blank_values=True)]
        query_pairs = [(k, v) for (k, v) in query_pairs if k not in {"sslmode", "channel_binding"}]
        normalized = urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query_pairs), parts.fragment))
    return normalized


_RAW_DATABASE_URL = os.getenv("DATABASE_URL")
if not _RAW_DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set (expected in backend/.env).")

DATABASE_URL = _normalize_database_url(_RAW_DATABASE_URL)

engine = create_async_engine(DATABASE_URL, pool_pre_ping=True, connect_args={"ssl": True})
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
