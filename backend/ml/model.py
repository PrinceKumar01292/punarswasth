import xgboost as xgb
import shap
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, f1_score, recall_score
from imblearn.over_sampling import SMOTE

# ── Feature columns (must match PredictRequest) ──────────
FEATURES = [
    "age", "hba1c", "bp_systolic", "creatinine",
    "medication_count", "prev_admissions", "length_of_stay",
    "distance_km", "income_proxy", "caregiver_score"
]

# ── Generate Synthetic Indian EHR Data ──────────────────
def _generate_data(n: int = 2000) -> pd.DataFrame:
    np.random.seed(42)

    # Clinical features — calibrated to Indian disease profiles
    age              = np.random.randint(40, 82, n)
    hba1c            = np.random.uniform(5.5, 13.0, n)
    bp_systolic      = np.random.randint(100, 185, n)
    creatinine       = np.random.uniform(0.6, 3.5, n)
    medication_count = np.random.randint(1, 7, n)
    prev_admissions  = np.random.randint(0, 6, n)
    length_of_stay   = np.random.randint(1, 14, n)

    # Social determinants — Tier-2 India profiles
    distance_km      = np.random.uniform(1, 65, n)
    income_proxy     = np.random.choice([1, 2, 3], n, p=[0.5, 0.35, 0.15])
    caregiver_score  = np.random.choice([0, 1, 2], n, p=[0.35, 0.40, 0.25])

    df = pd.DataFrame({
        "age":              age,
        "hba1c":            hba1c,
        "bp_systolic":      bp_systolic,
        "creatinine":       creatinine,
        "medication_count": medication_count,
        "prev_admissions":  prev_admissions,
        "length_of_stay":   length_of_stay,
        "distance_km":      distance_km,
        "income_proxy":     income_proxy,
        "caregiver_score":  caregiver_score,
    })

    # Readmission label — realistic India weights
    score = (
        (hba1c > 8.5).astype(int) * 3 +
        (prev_admissions > 1).astype(int) * 3 +
        (bp_systolic > 150).astype(int) * 2 +
        (creatinine > 2.0).astype(int) * 2 +
        (distance_km > 30).astype(int) * 1 +
        (income_proxy == 1).astype(int) * 1 +
        (caregiver_score == 0).astype(int) * 1
    )
    prob = 1 / (1 + np.exp(-0.6 * (score - 5)))
    label = (np.random.rand(n) < prob).astype(int)

    df["readmitted"] = label
    return df

# ── Train Model ──────────────────────────────────────────
def _train():
    df = _generate_data(2000)
    X  = df[FEATURES]
    y  = df["readmitted"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # SMOTE — handle class imbalance (readmissions are minority)
    sm = SMOTE(random_state=42)
    X_res, y_res = sm.fit_resample(X_train, y_train)

    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=5,
        learning_rate=0.08,
        scale_pos_weight=3,
        eval_metric="auc",
        random_state=42,
        verbosity=0,
    )
    model.fit(X_res, y_res)

    # Evaluate
    y_pred  = model.predict(X_test)
    y_prob  = model.predict_proba(X_test)[:, 1]
    auc     = roc_auc_score(y_test, y_prob)
    f1      = f1_score(y_test, y_pred)
    recall  = recall_score(y_test, y_pred)
    print(f"✅ Model trained — AUC: {auc:.3f} | F1: {f1:.3f} | Recall: {recall:.3f}")

    # SHAP explainer
    explainer = shap.TreeExplainer(model)
    return model, explainer

# ── Singleton — load once at startup ────────────────────
print("⏳ Training XGBoost model on synthetic Indian EHR data...")
_model, _explainer = _train()

# ── Public predict function ──────────────────────────────
def predict_risk(data: dict) -> dict:
    """
    Takes patient feature dict, returns:
    - risk_score  (0–100)
    - risk_level  (Low / Medium / High)
    - shap_values (dict of feature → contribution)
    - explanation (human-readable string)
    """
    df = pd.DataFrame([data])[FEATURES]

    prob       = float(_model.predict_proba(df)[0][1])
    risk_score = round(prob * 100, 1)
    risk_level = "High" if prob > 0.65 else "Medium" if prob > 0.40 else "Low"

    # SHAP values
    sv_raw  = _explainer.shap_values(df)[0]
    sv_dict = dict(zip(FEATURES, [round(float(v), 4) for v in sv_raw]))

    # Top 3 contributing factors for explanation
    top3 = sorted(sv_dict.items(), key=lambda x: abs(x[1]), reverse=True)[:3]
    parts = []
    for feat, val in top3:
        direction = "high" if val > 0 else "low"
        label = feat.replace("_", " ").title()
        parts.append(f"{label} is {direction}")
    explanation = f"Risk {risk_level} ({risk_score}%): " + ", ".join(parts) + "."

    return {
        "risk_score":  risk_score,
        "risk_level":  risk_level,
        "shap_values": sv_dict,
        "explanation": explanation,
    }
