"""
PunarSwasth — LangGraph Multi-Agent System
Agents:
  1. RiskAgent        — interpret risk score + SHAP
  2. RecommendAgent   — generate clinical recommendations
  3. SocialAgent      — assess social determinants
  4. WhatsAppAgent    — compose Hindi patient message
  Orchestrated by LangGraph StateGraph
"""

from typing import TypedDict, List, Dict, Any
from langgraph.graph import StateGraph, END

# ── Agent State ──────────────────────────────────────────
class AgentState(TypedDict):
    patient:         Dict[str, Any]
    risk:            Dict[str, Any]
    explanation:     str
    recommendations: List[str]
    social_note:     str
    whatsapp_msg:    str


# ── Agent 1: Risk Interpreter ────────────────────────────
def risk_agent(state: AgentState) -> dict:
    """
    Converts SHAP values into a doctor-friendly clinical explanation.
    """
    risk       = state["risk"]
    score      = risk["risk_score"]
    level      = risk["risk_level"]
    shap_vals  = risk.get("shap_values", {})

    # Sort SHAP by absolute contribution
    top = sorted(shap_vals.items(), key=lambda x: abs(x[1]), reverse=True)[:3]

    lines = [f"Patient readmission risk is {level} ({score}%)."]
    for feat, val in top:
        direction = "elevated" if val > 0 else "within range"
        label = feat.replace("_", " ").title()
        lines.append(f"• {label}: {direction} (impact: {val:+.3f})")

    return {"explanation": " ".join(lines)}


# ── Agent 2: Recommendation Generator ───────────────────
def recommendation_agent(state: AgentState) -> dict:
    """
    Generates clinically appropriate recommendations based on risk level
    and key SHAP features.
    """
    level     = state["risk"]["risk_level"]
    shap_vals = state["risk"].get("shap_values", {})
    patient   = state["patient"]

    recs = []

    # Base recommendations by risk level
    if level == "High":
        recs.append("Schedule urgent follow-up within 3 days")
        recs.append("Daily medication adherence check via WhatsApp")
        recs.append("Alert family caregiver immediately")
        recs.append("Monitor BP and blood glucose daily")
    elif level == "Medium":
        recs.append("Schedule follow-up within 2 weeks")
        recs.append("Weekly WhatsApp medication reminder")
        recs.append("HbA1c recheck in 6 weeks")
    else:
        recs.append("Monthly check-in sufficient")
        recs.append("Encourage healthy diet and daily walk")

    # Feature-specific additions
    if shap_vals.get("hba1c", 0) > 0.2:
        recs.append("Consult endocrinologist — HbA1c critically high")
    if shap_vals.get("creatinine", 0) > 0.15:
        recs.append("Kidney function test recommended")
    if shap_vals.get("distance_km", 0) > 0.1:
        recs.append("Arrange transport support or teleconsultation")
    if patient.get("caregiver_score", 1) == 0:
        recs.append("Connect with community health worker for home visit")

    return {"recommendations": recs}


# ── Agent 3: Social Determinant Analyzer ────────────────
def social_agent(state: AgentState) -> dict:
    """
    Evaluates social risk factors and generates contextual note.
    """
    patient = state["patient"]
    notes   = []

    dist = patient.get("distance_km", 10)
    if dist > 30:
        notes.append(f"Lives {dist:.0f}km away — transport barrier")

    income = patient.get("income_proxy", 2)
    if income == 1:
        notes.append("Low income household — medication cost risk")

    caregiver = patient.get("caregiver_score", 1)
    labels = {0: "No caregiver at home", 1: "Partial support", 2: "Full caregiver support"}
    notes.append(labels.get(caregiver, "Unknown caregiver status"))

    social_note = "Social factors: " + " | ".join(notes) if notes else "Social profile: moderate risk"
    return {"social_note": social_note}


# ── Agent 4: WhatsApp Message Composer ──────────────────
def whatsapp_agent(state: AgentState) -> dict:
    """
    Composes a personalised Hindi WhatsApp message for the patient.
    """
    patient  = state["patient"]
    level    = state["risk"]["risk_level"]
    recs     = state["recommendations"]
    name     = patient.get("name", "Patient").split()[0]

    level_map = {
        "High":   f"⚠️ BAHUT ZYADA ({state['risk']['risk_score']}%)",
        "Medium": f"⚡ MADHYAM ({state['risk']['risk_score']}%)",
        "Low":    f"✅ THEEK HAI ({state['risk']['risk_score']}%)",
    }

    first_rec = recs[0] if recs else "Doctor se milein"

    msg = (
        f"Namaste {name} ji! 🙏\n\n"
        f"Aapka health update:\n"
        f"Risk level: {level_map.get(level, level)}\n\n"
        f"Aaj ki sabse zaroori baat:\n"
        f"👉 {first_rec}\n\n"
        f"Apni dawai samay pe lein.\n"
        f"Koi takleef ho toh reply karein: HELP\n\n"
        f"— PunarSwasth AI System 🏥"
    )

    return {"whatsapp_msg": msg}


# ── Build LangGraph ──────────────────────────────────────
def _build_graph() -> StateGraph:
    wf = StateGraph(AgentState)

    wf.add_node("risk_agent",           risk_agent)
    wf.add_node("recommendation_agent", recommendation_agent)
    wf.add_node("social_agent",         social_agent)
    wf.add_node("whatsapp_agent",       whatsapp_agent)

    wf.set_entry_point("risk_agent")
    wf.add_edge("risk_agent",           "recommendation_agent")
    wf.add_edge("recommendation_agent", "social_agent")
    wf.add_edge("social_agent",         "whatsapp_agent")
    wf.add_edge("whatsapp_agent",       END)

    return wf.compile()


# Singleton graph — compiled once at startup
_graph = _build_graph()


def run_agents(patient: dict, risk: dict) -> dict:
    """
    Entry point: runs all 4 agents in sequence.
    Returns full AgentState with explanation, recommendations, whatsapp_msg.
    """
    initial_state: AgentState = {
        "patient":         patient,
        "risk":            risk,
        "explanation":     "",
        "recommendations": [],
        "social_note":     "",
        "whatsapp_msg":    "",
    }
    result = _graph.invoke(initial_state)
    return {
        "explanation":     result["explanation"],
        "recommendations": result["recommendations"],
        "social_note":     result["social_note"],
        "whatsapp_msg":    result["whatsapp_msg"],
    }
