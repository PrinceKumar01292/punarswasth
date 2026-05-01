# ← XGBoost ML model
import xgboost as xgb
import shap
import pandas as pd
import numpy as np

model = xgb.XGBClassifier(n_estimators=100, random_state=42)

def generate_sample_data():
    np.random.seed(42)
    n = 500
    df = pd.DataFrame({
        'age': np.random.randint(40,80,n),
        'hba1c': np.random.uniform(5.5,12,n),
        'bp': np.random.randint(100,180,n),
        'prev_admissions': np.random.randint(0,5,n),
        'distance_km': np.random.uniform(1,50,n),
    })
    df['readmitted'] = ((df['hba1c']>8.5) & (df['prev_admissions']>1)).astype(int)
    return df

df = generate_sample_data()
X = df.drop('readmitted', axis=1)
y = df['readmitted']
model.fit(X, y)
explainer = shap.TreeExplainer(model)

def predict_risk(patient: dict):
    df_p = pd.DataFrame([patient])
    prob = float(model.predict_proba(df_p)[0][1])
    shap_vals = explainer.shap_values(df_p)[0].tolist()
    level = "High" if prob>0.7 else "Medium" if prob>0.4 else "Low"
    return {"risk_score": round(prob*100,1),
            "risk_level": level,
            "shap_values": dict(zip(X.columns, shap_vals))}