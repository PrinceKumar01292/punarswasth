from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.database import get_db, Patient
from models.schemas import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats, summary="Get dashboard summary stats")
def get_stats(db: Session = Depends(get_db)):
    all_patients = db.query(Patient).all()
    high   = sum(1 for p in all_patients if p.risk_level == "High")
    medium = sum(1 for p in all_patients if p.risk_level == "Medium")
    low    = sum(1 for p in all_patients if p.risk_level == "Low")
    total  = len(all_patients)

    # Estimated savings (avg ₹31,500 saved per prevented readmission)
    prevented = int(high * 0.25 + medium * 0.10)
    savings   = prevented * 31500
    savings_str = f"₹{savings/100000:.1f}L" if savings >= 100000 else f"₹{savings:,}"

    return DashboardStats(
        high_count   = high,
        medium_count = medium,
        low_count    = low,
        total        = total,
        savings_est  = savings_str,
    )
