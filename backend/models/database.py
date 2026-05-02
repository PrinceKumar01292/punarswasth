from sqlalchemy import create_engine, Column, Integer, Float, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from sqlalchemy.sql import func
from config import DATABASE_URL

# ── Engine + Session ────────────────────────────────────
engine  = create_engine(DATABASE_URL, echo=False)
Base    = declarative_base()
Session = sessionmaker(bind=engine)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

# ── ORM Models ──────────────────────────────────────────

class User(Base):
    """Doctors / Admins who log in"""
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(120), unique=True, nullable=False, index=True)
    password   = Column(String(200), nullable=False)
    role       = Column(String(20), default="doctor")   # doctor | admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active  = Column(Boolean, default=True)

    patients   = relationship("Patient", back_populates="doctor")


class Patient(Base):
    """Patient clinical + social data"""
    __tablename__ = "patients"

    id                 = Column(Integer, primary_key=True, index=True)
    name               = Column(String(100), nullable=False)
    age                = Column(Integer)
    gender             = Column(String(1))          # M / F
    phone              = Column(String(15))
    condition          = Column(String(100))        # Diabetic / Cardiac etc.
    pincode            = Column(String(10))

    # Clinical features
    hba1c              = Column(Float)
    bp_systolic        = Column(Integer)
    creatinine         = Column(Float)
    medication_count   = Column(Integer, default=1)
    prev_admissions    = Column(Integer, default=0)
    length_of_stay     = Column(Integer, default=3)

    # Social determinants
    distance_km        = Column(Float, default=10.0)
    income_proxy       = Column(Integer, default=2)  # 1=Low 2=Mid 3=High
    caregiver_score    = Column(Integer, default=1)  # 0=None 1=Partial 2=Full

    # Computed risk
    risk_score         = Column(Float, default=0.0)
    risk_level         = Column(String(10), default="Low")

    doctor_id          = Column(Integer, ForeignKey("users.id"), nullable=True)
    doctor             = relationship("User", back_populates="patients")
    created_at         = Column(DateTime(timezone=True), server_default=func.now())
    updated_at         = Column(DateTime(timezone=True), onupdate=func.now())

    risk_logs          = relationship("RiskLog", back_populates="patient")
    whatsapp_logs      = relationship("WhatsAppLog", back_populates="patient")


class RiskLog(Base):
    """History of risk score predictions per patient"""
    __tablename__ = "risk_logs"

    id            = Column(Integer, primary_key=True)
    patient_id    = Column(Integer, ForeignKey("patients.id"), nullable=False)
    risk_score    = Column(Float)
    risk_level    = Column(String(10))
    shap_values   = Column(Text)      # JSON string
    explanation   = Column(Text)
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    patient       = relationship("Patient", back_populates="risk_logs")


class WhatsAppLog(Base):
    """History of WhatsApp messages sent"""
    __tablename__ = "whatsapp_logs"

    id            = Column(Integer, primary_key=True)
    patient_id    = Column(Integer, ForeignKey("patients.id"), nullable=False)
    message       = Column(Text)
    status        = Column(String(20), default="sent")   # sent | failed
    sent_at       = Column(DateTime(timezone=True), server_default=func.now())

    patient       = relationship("Patient", back_populates="whatsapp_logs")


def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
