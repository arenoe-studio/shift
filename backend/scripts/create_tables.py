from __future__ import annotations

import asyncio
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from database import Base, engine  # noqa: E402
from models import schemas as _schemas  # noqa: F401,E402


async def create_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


def main() -> None:
    asyncio.run(create_tables())


if __name__ == "__main__":
    main()
