"""
Run this once to populate DB with sample patients:
  python seed.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from models.database import Session, init_db, Patient, User
from routes.auth import hash_password
from ml.model import predict_risk

SAMPLE_PATIENTS = [
    dict(name="Ramu Verma",    age=67, gender="M", phone="+919876543210", condition="Diabetic + Cardiac",  pincode="462001", hba1c=11.2, bp_systolic=168, creatinine=1.8, medication_count=5, prev_admissions=3, length_of_stay=7, distance_km=34, income_proxy=1, caregiver_score=0),
    dict(name="Sunita Devi",   age=58, gender="F", phone="+918765432109", condition="Diabetic",             pincode="462002", hba1c=10.1, bp_systolic=155, creatinine=1.4, medication_count=3, prev_admissions=2, length_of_stay=5, distance_km=12, income_proxy=1, caregiver_score=1),
    dict(name="Mohan Lal",     age=72, gender="M", phone="+917654321098", condition="Cardiac",              pincode="462003", hba1c=9.8,  bp_systolic=162, creatinine=2.1, medication_count=4, prev_admissions=2, length_of_stay=6, distance_km=45, income_proxy=2, caregiver_score=0),
    dict(name="Priya Sharma",  age=51, gender="F", phone="+916543210987", condition="Diabetic",             pincode="462011", hba1c=8.4,  bp_systolic=138, creatinine=1.1, medication_count=2, prev_admissions=1, length_of_stay=3, distance_km=8,  income_proxy=2, caregiver_score=1),
    dict(name="Arun Kumar",    age=44, gender="M", phone="+915432109876", condition="Hypertensive",         pincode="462012", hba1c=7.9,  bp_systolic=142, creatinine=0.9, medication_count=2, prev_admissions=1, length_of_stay=2, distance_km=22, income_proxy=2, caregiver_score=2),
    dict(name="Kavita Singh",  age=39, gender="F", phone="+914321098765", condition="Diabetic",             pincode="462016", hba1c=7.1,  bp_systolic=122, creatinine=0.8, medication_count=1, prev_admissions=0, length_of_stay=2, distance_km=5,  income_proxy=3, caregiver_score=2),
    dict(name="Rajesh Gupta",  age=55, gender="M", phone="+913210987654", condition="Diabetic + BP",        pincode="462021", hba1c=9.1,  bp_systolic=148, creatinine=1.3, medication_count=3, prev_admissions=1, length_of_stay=4, distance_km=18, income_proxy=2, caregiver_score=1),
    dict(name="Meena Patel",   age=63, gender="F", phone="+912109876543", condition="Cardiac",              pincode="462022", hba1c=6.8,  bp_systolic=118, creatinine=0.9, medication_count=2, prev_admissions=0, length_of_stay=2, distance_km=3,  income_proxy=3, caregiver_score=2),
]

def seed():
    init_db()
    db = Session()

    # Create default doctor account
    if not db.query(User).filter(User.email == "doctor@punarswasth.ai").first():
        doctor = User(name="Dr. Arvind Sharma", email="doctor@punarswasth.ai",
                      password=hash_password("doctor123"), role="doctor")
        db.add(doctor)
        db.commit()
        print("✅ Doctor account created: doctor@punarswasth.ai / doctor123")

    # Add patients with predicted risk
    for p_data in SAMPLE_PATIENTS:
        if db.query(Patient).filter(Patient.name == p_data["name"]).first():
            continue  # skip duplicates

        risk = predict_risk(p_data)
        patient = Patient(
            **p_data,
            risk_score = risk["risk_score"],
            risk_level = risk["risk_level"],
        )
        db.add(patient)
        print(f"  + {p_data['name']} — {risk['risk_level']} ({risk['risk_score']}%)")

    db.commit()
    db.close()
    print("\n✅ Seed complete! 8 patients added.")

if __name__ == "__main__":
    seed()
