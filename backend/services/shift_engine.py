from __future__ import annotations

from models.schemas import RekomendasiSchema

WSE_CRITICAL = 94.44
WSE_WARNING = 100.0

TURBINE_MAX = 187.0
TURBINE_MIN = 60.0

FPV_MAX = 651.0
PR = 0.78
CO2_FACTOR = 0.846


def compute(wse: float, curah_hujan: float, irr: float) -> RekomendasiSchema:
    dispatch_turbin: float
    alasan: str

    if wse >= WSE_WARNING:
        dispatch_turbin = TURBINE_MAX
        alasan = "WSE normal, turbin full capacity"
    elif wse >= WSE_CRITICAL:
        if curah_hujan >= 10.0:
            dispatch_turbin = 150.0
            alasan = "WSE waspada, hujan masuk — kurangi discharge"
        elif irr >= 5.5:
            dispatch_turbin = 130.0
            alasan = "WSE waspada, cerah — andalkan FPV"
        else:
            dispatch_turbin = 150.0
            alasan = "WSE waspada, mendung — turbin kompensasi"
    else:
        if curah_hujan >= 10.0:
            dispatch_turbin = TURBINE_MIN
            alasan = "WSE kritis, hujan masuk — minimal discharge"
        elif irr >= 5.5:
            dispatch_turbin = TURBINE_MIN
            alasan = "WSE kritis, cerah — FPV ambil alih"
        else:
            dispatch_turbin = 80.0
            alasan = "WSE kritis, mendung — turbin minimum+buffer"

    dispatch_fpv = min(irr * FPV_MAX * PR, FPV_MAX)
    total_mw = dispatch_turbin + dispatch_fpv
    energi_mwh = total_mw * 24.0
    co2_avoided_ton = dispatch_fpv * 24.0 * CO2_FACTOR
    status_waduk_aman = wse >= WSE_CRITICAL

    return RekomendasiSchema(
        dispatch_turbin_mw=float(dispatch_turbin),
        dispatch_fpv_mw=float(dispatch_fpv),
        total_mw=float(total_mw),
        energi_mwh=float(energi_mwh),
        co2_avoided_ton=float(co2_avoided_ton),
        status_waduk_aman=bool(status_waduk_aman),
        alasan=alasan,
    )
