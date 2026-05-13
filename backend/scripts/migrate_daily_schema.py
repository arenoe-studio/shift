from __future__ import annotations

import asyncio
import sys
from pathlib import Path

from sqlalchemy import text

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from database import engine  # noqa: E402


DDL = """
DROP TABLE IF EXISTS waduk_data;
DROP TABLE IF EXISTS waduk_daily;

CREATE TABLE waduk_daily (
    id              SERIAL PRIMARY KEY,
    tanggal         DATE NOT NULL UNIQUE,
    wse             FLOAT NOT NULL,
    ghi             FLOAT NOT NULL,
    turbine_outflow FLOAT NOT NULL
);

CREATE INDEX idx_waduk_daily_tanggal ON waduk_daily (tanggal DESC);
"""


async def migrate() -> None:
    async with engine.begin() as conn:
        for stmt in [s.strip() for s in DDL.split(";") if s.strip()]:
            await conn.execute(text(stmt))
    print("[migrate_daily_schema] done")


def main() -> None:
    asyncio.run(migrate())


if __name__ == "__main__":
    main()

