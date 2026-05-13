from __future__ import annotations

import asyncio
import sys
from datetime import date
from pathlib import Path

import pandas as pd
from sqlalchemy import func, select
from sqlalchemy.dialects.postgresql import insert as pg_insert

_ROOT = Path(__file__).resolve().parents[1]
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from database import AsyncSessionLocal  # noqa: E402
from models.schemas import WadukDaily  # noqa: E402


DEFAULT_CSV_PATH = _ROOT / "data" / "waduk_daily.csv"


def _parse_csv(path: Path) -> pd.DataFrame:
    df = pd.read_csv(path)
    expected = {"Tanggal", "TMA Realisasi_masl", "GHI_", "Turbines"}
    missing = expected.difference(set(df.columns))
    if missing:
        raise RuntimeError(f"CSV missing columns: {sorted(missing)}")

    parsed = pd.DataFrame(
        {
            "tanggal": pd.to_datetime(df["Tanggal"], format="%m/%d/%Y", errors="coerce").dt.date,
            "wse": pd.to_numeric(df["TMA Realisasi_masl"], errors="coerce"),
            "ghi": pd.to_numeric(df["GHI_"], errors="coerce"),
            "turbine_outflow": pd.to_numeric(df["Turbines"], errors="coerce"),
        }
    )

    parsed = parsed.dropna(subset=["tanggal", "wse", "ghi", "turbine_outflow"])
    parsed = parsed.drop_duplicates(subset=["tanggal"], keep="last")
    return parsed


async def seed(csv_path: Path) -> int:
    df = _parse_csv(csv_path)
    total = len(df)
    if total == 0:
        print("[seed_daily] no valid rows after cleaning")
        return 0

    rows: list[dict[str, object]] = []
    for _, r in df.iterrows():
        tanggal_val = r["tanggal"]
        if not isinstance(tanggal_val, date):
            continue
        rows.append(
            {
                "tanggal": tanggal_val,
                "wse": float(r["wse"]),
                "ghi": float(r["ghi"]),
                "turbine_outflow": float(r["turbine_outflow"]),
            }
        )

    inserted_total = 0
    processed = 0

    async with AsyncSessionLocal() as session:
        batch: list[dict[str, object]] = []

        for item in rows:
            batch.append(item)
            processed += 1
            if len(batch) >= 1000:
                stmt = pg_insert(WadukDaily).values(batch).on_conflict_do_nothing(index_elements=["tanggal"])
                result = await session.execute(stmt)
                inserted_total += int(result.rowcount or 0)
                await session.commit()
                batch = []
                print(f"[seed_daily] processed {processed}/{total} (inserted {inserted_total})")

        if batch:
            stmt = pg_insert(WadukDaily).values(batch).on_conflict_do_nothing(index_elements=["tanggal"])
            result = await session.execute(stmt)
            inserted_total += int(result.rowcount or 0)
            await session.commit()
            print(f"[seed_daily] processed {processed}/{total} (inserted {inserted_total})")

        final_count = await session.scalar(select(func.count()).select_from(WadukDaily))
        print(f"[seed_daily] done: inserted={inserted_total}, total_rows={final_count}")

    return inserted_total


def main() -> None:
    csv_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_CSV_PATH
    if not csv_path.exists():
        raise SystemExit(f"CSV not found: {csv_path}")
    asyncio.run(seed(csv_path))


if __name__ == "__main__":
    main()

