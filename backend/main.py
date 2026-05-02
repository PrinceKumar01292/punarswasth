"""
PunarSwasth — AI Readmission Prevention System
Backend API — FastAPI + LangGraph + XGBoost + SHAP

Run:  python main.py
Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.database import init_db
# from routes import auth, patients, predict, dashboard, whatsapp
from routes import auth, patients, predict,  whatsapp



# ── App setup ────────────────────────────────────────────
app = FastAPI(
    title       = "PunarSwasth API",
    description = "AI-powered hospital readmission prevention — Cognizant Technoverse 2026",
    version     = "1.0.0",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# ── CORS ─────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Routers ──────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(predict.router)
# app.include_router(dashboard.router)
app.include_router(whatsapp.router)

# ── Startup ──────────────────────────────────────────────
@app.on_event("startup")
def startup():
    init_db()
    print("🚀 PunarSwasth API is running!")
    print("📋 API Docs: http://localhost:8000/docs")

# ── Health check ─────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "status":  "running",
        "project": "PunarSwasth",
        "team":    "Stackverse — JNCT",
        "event":   "Cognizant Technoverse Hackathon 2026",
        "docs":    "http://localhost:8000/docs",
    }

@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}

# ── Run ──────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
