from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.database import get_db, Patient
from models.schemas import PatientCreate, PatientResponse

router = APIRouter(prefix="/patients", tags=["Patients"])


@router.get("/", response_model=List[PatientResponse], summary="Get all patients sorted by risk")
def get_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).order_by(Patient.risk_score.desc()).all()
    return patients


@router.post("/", response_model=PatientResponse, summary="Add new patient")
def create_patient(body: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(**body.model_dump())
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/{patient_id}", response_model=PatientResponse, summary="Get patient by ID")
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.put("/{patient_id}", response_model=PatientResponse, summary="Update patient data")
def update_patient(patient_id: int, body: PatientCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, val in body.model_dump().items():
        setattr(patient, key, val)
    db.commit()
    db.refresh(patient)
    return patient


@router.delete("/{patient_id}", summary="Delete patient")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"message": f"Patient {patient_id} deleted"}
