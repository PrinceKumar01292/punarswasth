from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

# ── Auth Schemas ────────────────────────────────────────

class LoginRequest(BaseModel):
    email:    EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    user_name:    str
    user_role:    str

# ── Patient Schemas ─────────────────────────────────────

class PatientCreate(BaseModel):
    name:              str
    age:               int
    gender:            str
    phone:             Optional[str] = ""
    condition:         str
    pincode:           Optional[str] = ""
    hba1c:             float
    bp_systolic:       int
    creatinine:        Optional[float] = 1.0
    medication_count:  Optional[int]   = 1
    prev_admissions:   Optional[int]   = 0
    length_of_stay:    Optional[int]   = 3
    distance_km:       Optional[float] = 10.0
    income_proxy:      Optional[int]   = 2
    caregiver_score:   Optional[int]   = 1

class PatientResponse(BaseModel):
    id:               int
    name:             str
    age:              int
    gender:           str
    phone:            Optional[str]
    condition:        str
    hba1c:            Optional[float]
    bp_systolic:      Optional[int]
    prev_admissions:  Optional[int]
    distance_km:      Optional[float]
    risk_score:       float
    risk_level:       str
    created_at:       Optional[datetime]

    class Config:
        from_attributes = True

# ── Predict Schemas ─────────────────────────────────────

class PredictRequest(BaseModel):
    age:              int
    hba1c:            float
    bp_systolic:      int
    creatinine:       Optional[float] = 1.0
    medication_count: Optional[int]   = 1
    prev_admissions:  Optional[int]   = 0
    length_of_stay:   Optional[int]   = 3
    distance_km:      Optional[float] = 10.0
    income_proxy:     Optional[int]   = 2
    caregiver_score:  Optional[int]   = 1

class ShapValue(BaseModel):
    feature:   str
    value:     float
    pct:       float

class PredictResponse(BaseModel):
    risk_score:      float
    risk_level:      str
    explanation:     str
    shap_values:     Dict[str, float]
    recommendations: List[str]
    whatsapp_msg:    str

# ── Dashboard Schemas ────────────────────────────────────

class DashboardStats(BaseModel):
    high_count:    int
    medium_count:  int
    low_count:     int
    total:         int
    savings_est:   str

# ── WhatsApp Schemas ─────────────────────────────────────

class WhatsAppRequest(BaseModel):
    patient_id: int
    message:    Optional[str] = ""

class WhatsAppResponse(BaseModel):
    status:     str
    message:    str
    patient:    str
