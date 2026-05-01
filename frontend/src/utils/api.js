import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// ── PATIENT APIs ─────────────────────────────────────────
export const getPatients = () => api.get('/patients')

export const predictRisk = (patientData) =>
  api.post('/predict', patientData)

export const getPatientDetail = (id) =>
  api.get(`/patients/${id}`)

// ── DASHBOARD APIs ───────────────────────────────────────
export const getDashboardStats = () =>
  api.get('/dashboard/stats')

// ── WHATSAPP APIs ────────────────────────────────────────
export const sendWhatsApp = (patientId, message) =>
  api.post('/whatsapp/send', { patient_id: patientId, message })

// ── MOCK DATA (use when backend is not ready) ────────────
export const MOCK_PATIENTS = [
  { id:1, name:'Ramu Verma',   initials:'RV', age:67, gender:'M', condition:'Diabetic + Cardiac', risk_score:82, risk_level:'High',   hba1c:11.2, bp:168, prev_admissions:3, distance_km:34, phone:'+91 98765 43210' },
  { id:2, name:'Sunita Devi',  initials:'SD', age:58, gender:'F', condition:'Diabetic',           risk_score:74, risk_level:'High',   hba1c:10.1, bp:155, prev_admissions:2, distance_km:12, phone:'+91 87654 32109' },
  { id:3, name:'Mohan Lal',    initials:'ML', age:72, gender:'M', condition:'Cardiac',            risk_score:68, risk_level:'High',   hba1c:9.8,  bp:162, prev_admissions:2, distance_km:45, phone:'+91 76543 21098' },
  { id:4, name:'Priya Sharma', initials:'PS', age:51, gender:'F', condition:'Diabetic',           risk_score:52, risk_level:'Medium', hba1c:8.4,  bp:138, prev_admissions:1, distance_km:8,  phone:'+91 65432 10987' },
  { id:5, name:'Arun Kumar',   initials:'AK', age:44, gender:'M', condition:'Hypertensive',       risk_score:44, risk_level:'Medium', hba1c:7.9,  bp:142, prev_admissions:1, distance_km:22, phone:'+91 54321 09876' },
  { id:6, name:'Kavita Singh', initials:'KS', age:39, gender:'F', condition:'Diabetic',           risk_score:28, risk_level:'Low',    hba1c:7.1,  bp:122, prev_admissions:0, distance_km:5,  phone:'+91 43210 98765' },
  { id:7, name:'Rajesh Gupta', initials:'RG', age:55, gender:'M', condition:'Diabetic + BP',      risk_score:61, risk_level:'Medium', hba1c:9.1,  bp:148, prev_admissions:1, distance_km:18, phone:'+91 32109 87654' },
  { id:8, name:'Meena Patel',  initials:'MP', age:63, gender:'F', condition:'Cardiac',            risk_score:19, risk_level:'Low',    hba1c:6.8,  bp:118, prev_admissions:0, distance_km:3,  phone:'+91 21098 76543' },
]

export const MOCK_SHAP = {
  'HbA1c':         { value: 0.34, pct: 88 },
  'Prev Admissions':{ value: 0.28, pct: 72 },
  'Blood Pressure': { value: 0.21, pct: 55 },
  'Distance (km)':  { value: 0.12, pct: 30 },
  'Age':            { value: 0.08, pct: 20 },
}