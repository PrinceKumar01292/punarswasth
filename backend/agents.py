# LangGraph AI agent
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    patient: dict
    risk: dict
    explanation: str
    recommendations: list
    whatsapp_msg: str

def risk_agent(state):
    r = state["risk"]
    exp = f"Risk score: {r['risk_score']}% ({r['risk_level']}). "
    top = sorted(r['shap_values'].items(),
                 key=lambda x: abs(x[1]), reverse=True)[:2]
    for feat, val in top:
        direction = "high" if val>0 else "low"
        exp += f"{feat} is {direction}. "
    return {"explanation": exp}

def recommendation_agent(state):
    level = state["risk"]["risk_level"]
    recs = {
        "High": ["Urgent follow-up in 3 days",
                 "Daily medication reminder", "Family caregiver alert"],
        "Medium": ["Follow-up in 2 weeks",
                   "Weekly medication check"],
        "Low": ["Monthly check-in", "Lifestyle guidance"]
    }
    return {"recommendations": recs.get(level, [])}

def whatsapp_agent(state):
    name = state["patient"].get("name", "Patient")
    recs = state["recommendations"]
    msg = f"Namaste {name}! Aapka risk level: {state['risk']['risk_level']}. "
    msg += f"Suggestion: {recs[0] if recs else 'Doctor se milein'}."
    return {"whatsapp_msg": msg}

workflow = StateGraph(AgentState)
workflow.add_node("risk_agent", risk_agent)
workflow.add_node("recommendation_agent", recommendation_agent)
workflow.add_node("whatsapp_agent", whatsapp_agent)
workflow.set_entry_point("risk_agent")
workflow.add_edge("risk_agent", "recommendation_agent")
workflow.add_edge("recommendation_agent", "whatsapp_agent")
workflow.add_edge("whatsapp_agent", END)
graph = workflow.compile()

def run_agents(patient, risk):
    result = graph.invoke({"patient": patient, "risk": risk})
    return result