# FastAPI server
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import predict_risk
from agents import run_agents

app = FastAPI(title="PunarSwasth API")

app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"], allow_headers=["*"])

@app.get("/")
def root():
    return {"status": "PunarSwasth running!"}

@app.post("/predict")
def predict(patient: dict):
    risk = predict_risk(patient)
    result = run_agents(patient, risk)
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)