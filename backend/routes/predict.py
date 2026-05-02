from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Patient, RiskLog
from models.schemas import PredictRequest, PredictResponse
from ml.model import predict_risk
from agents.agents import run_agents
import json

router = APIRouter(prefix="/predict", tags=["Prediction"])


@router.post("/", response_model=PredictResponse, summary="Predict readmission risk for a patient")
def predict(req: PredictRequest, db: Session = Depends(get_db)):
    """
    Main prediction endpoint — runs XGBoost + SHAP + LangGraph agents.
    Returns: risk score, level, SHAP explanation, recommendations, WhatsApp message.
    """
    patient_dict = req.model_dump()

    # Step 1: ML Model — XGBoost + SHAP
    risk_result = predict_risk(patient_dict)

    # Step 2: LangGraph agents — explanation + recommendations + WhatsApp
    agent_result = run_agents(patient_dict, risk_result)

    # Step 3: Save prediction log to DB
    try:
        log = RiskLog(
            patient_id   = patient_dict.get("patient_id", 1),
            risk_score   = risk_result["risk_score"],
            risk_level   = risk_result["risk_level"],
            shap_values  = json.dumps(risk_result["shap_values"]),
            explanation  = agent_result["explanation"],
        )
        db.add(log)
        db.commit()
    except Exception:
        pass  # Don't fail prediction if log fails

    return PredictResponse(
        risk_score      = risk_result["risk_score"],
        risk_level      = risk_result["risk_level"],
        explanation     = agent_result["explanation"],
        shap_values     = risk_result["shap_values"],
        recommendations = agent_result["recommendations"],
        whatsapp_msg    = agent_result["whatsapp_msg"],
    )


@router.post("/patient/{patient_id}", summary="Predict risk for existing patient in DB")
def predict_for_patient(patient_id: int, db: Session = Depends(get_db)):
    """Fetch patient from DB and run prediction."""
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    patient_dict = {
        "age":              patient.age,
        "hba1c":            patient.hba1c,
        "bp_systolic":      patient.bp_systolic,
        "creatinine":       patient.creatinine or 1.0,
        "medication_count": patient.medication_count or 1,
        "prev_admissions":  patient.prev_admissions or 0,
        "length_of_stay":   patient.length_of_stay or 3,
        "distance_km":      patient.distance_km or 10.0,
        "income_proxy":     patient.income_proxy or 2,
        "caregiver_score":  patient.caregiver_score or 1,
        "patient_id":       patient.id,
    }

    risk_result  = predict_risk(patient_dict)
    agent_result = run_agents(patient_dict, risk_result)

    # Update patient risk in DB
    patient.risk_score = risk_result["risk_score"]
    patient.risk_level = risk_result["risk_level"]
    db.commit()

    return PredictResponse(
        risk_score      = risk_result["risk_score"],
        risk_level      = risk_result["risk_level"],
        explanation     = agent_result["explanation"],
        shap_values     = risk_result["shap_values"],
        recommendations = agent_result["recommendations"],
        whatsapp_msg    = agent_result["whatsapp_msg"],
    )
