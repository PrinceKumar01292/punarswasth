from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, Patient, WhatsAppLog
from models.schemas import WhatsAppRequest, WhatsAppResponse
from config import TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


def _send_twilio(to_phone: str, message: str) -> bool:
    """Send via Twilio WhatsApp API. Returns True if sent."""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print(f"[MOCK WhatsApp] To: {to_phone}\n{message}")
        return True  # Mock send — no credentials needed for demo
    try:
        from twilio.rest import Client
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        client.messages.create(
            body = message,
            from_ = TWILIO_WHATSAPP_FROM,
            to    = f"whatsapp:{to_phone}"
        )
        return True
    except Exception as e:
        print(f"Twilio error: {e}")
        return False


@router.post("/send", response_model=WhatsAppResponse, summary="Send WhatsApp message to patient")
def send_whatsapp(req: WhatsAppRequest, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == req.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Default message if none provided
    level_emoji = {"High": "⚠️", "Medium": "⚡", "Low": "✅"}.get(patient.risk_level, "")
    default_msg = (
        f"Namaste {patient.name.split()[0]} ji! 🙏\n"
        f"Risk level: {level_emoji} {patient.risk_level} ({patient.risk_score:.0f}%)\n"
        f"Apni dawai samay pe lein. Koi takleef ho: HELP\n"
        f"— PunarSwasth 🏥"
    )
    message = req.message if req.message.strip() else default_msg

    # Send via Twilio (or mock)
    ok = _send_twilio(patient.phone or "+910000000000", message)

    # Log to DB
    log = WhatsAppLog(patient_id=patient.id, message=message, status="sent" if ok else "failed")
    db.add(log)
    db.commit()

    if not ok:
        raise HTTPException(status_code=500, detail="Failed to send WhatsApp message")

    return WhatsAppResponse(status="sent", message=message, patient=patient.name)


@router.get("/logs/{patient_id}", summary="Get WhatsApp message history for patient")
def get_logs(patient_id: int, db: Session = Depends(get_db)):
    logs = db.query(WhatsAppLog).filter(WhatsAppLog.patient_id == patient_id).order_by(WhatsAppLog.sent_at.desc()).all()
    return [{"message": l.message, "status": l.status, "sent_at": l.sent_at} for l in logs]
