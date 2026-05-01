import { useState } from 'react'
import StatCard from '../components/StatCard'
import PatientRow from '../components/PatientRow'
import RiskGauge from '../components/RiskGauge'
import ShapChart from '../components/ShapChart'
import InterventionSimulator from '../components/InterventionSimulator'
import { MOCK_PATIENTS, MOCK_SHAP } from '../utils/api'

const RECS = {
  High:   [
    { icon:'!', bg:'var(--red-bg)',   color:'var(--red)',   title:'Urgent 3-day follow-up',         sub:'High HbA1c + prev admissions — critical' },
    { icon:'💊', bg:'var(--amber-bg)', color:'var(--amber)', title:'Daily WhatsApp medication reminder', sub:'Metformin + Amlodipine schedule' },
    { icon:'👨‍👩', bg:'var(--blue-bg)',  color:'var(--blue)',  title:'Caregiver alert — notify family',   sub:'Patient lives far from hospital' },
  ],
  Medium: [
    { icon:'📅', bg:'var(--amber-bg)', color:'var(--amber)', title:'Follow-up in 2 weeks',             sub:'Monitor HbA1c closely' },
    { icon:'💊', bg:'var(--blue-bg)',  color:'var(--blue)',  title:'Weekly medication check',           sub:'WhatsApp reminder every Monday' },
  ],
  Low: [
    { icon:'✓',  bg:'var(--green-bg)', color:'var(--green)', title:'Monthly check-in sufficient',      sub:'Patient is stable' },
  ],
}

export default function Dashboard() {
  const [selected, setSelected] = useState(MOCK_PATIENTS[0])
  const [search, setSearch]     = useState('')

  const filtered = MOCK_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.condition.toLowerCase().includes(search.toLowerCase())
  )

  const highCount   = MOCK_PATIENTS.filter(p => p.risk_level === 'High').length
  const medCount    = MOCK_PATIENTS.filter(p => p.risk_level === 'Medium').length
  const lowCount    = MOCK_PATIENTS.filter(p => p.risk_level === 'Low').length
  const savedAmount = '₹8.4L'
  const recs        = RECS[selected?.risk_level] || RECS.Low

  return (
    <div style={{ padding:24 }}>

      {/* ── STAT CARDS ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:24 }}>
        <StatCard label="High Risk"          value={highCount}   sub="patients — needs attention" accent="red"   delay={0}    />
        <StatCard label="Medium Risk"        value={medCount}    sub="patients — monitor closely" accent="amber" delay={0.06} />
        <StatCard label="Low Risk"           value={lowCount}    sub="patients — stable"          accent="green" delay={0.12} />
        <StatCard label="Readmissions Saved" value={savedAmount} sub="estimated this month"       accent="blue"  delay={0.18} />
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16 }}>

        {/* ── PATIENT LIST ── */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', animation:'fadeUp 0.5s ease 0.2s both' }}>
          {/* Header */}
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:700 }}>Patient Risk Queue</span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)' }}>sorted by risk ↓</span>
            <span style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--muted)', background:'var(--surface2)', border:'1px solid var(--border)', padding:'2px 8px', borderRadius:4 }}>
              {MOCK_PATIENTS.length} patients
            </span>
          </div>
          {/* Search */}
          <div style={{ padding:'10px 18px', borderBottom:'1px solid var(--border)' }}>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search patient name or condition..."
              style={{ width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding:'8px 12px', color:'var(--text)', fontSize:13, fontFamily:"'DM Sans',sans-serif", outline:'none' }}
            />
          </div>
          {/* Rows */}
          <div style={{ maxHeight:460, overflowY:'auto' }}>
            {filtered.map(p => (
              <PatientRow
                key={p.id}
                patient={p}
                selected={selected?.id === p.id}
                onClick={() => setSelected(p)}
              />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding:'24px', textAlign:'center', color:'var(--muted)', fontSize:13 }}>No patients found</div>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Detail card */}
          {selected && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', animation:'slideIn 0.35s ease both' }}>
              <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800 }}>{selected.name}</div>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--muted)', marginTop:3 }}>
                  {selected.gender} · {selected.age} · {selected.condition} · HbA1c: {selected.hba1c} · BP: {selected.bp}
                </div>
              </div>
              <div style={{ padding:'14px 18px' }}>
                <RiskGauge score={selected.risk_score} level={selected.risk_level} />
                <ShapChart shapData={MOCK_SHAP} />
              </div>
            </div>
          )}

          {/* Recommendations */}
          {selected && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', animation:'fadeUp 0.4s ease 0.1s both' }}>
              <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)' }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700 }}>AI Recommendations</span>
              </div>
              {recs.map((r, i) => (
                <div key={i} style={{ padding:'10px 18px', borderBottom: i < recs.length - 1 ? '1px solid var(--border)' : 'none', display:'flex', alignItems:'flex-start', gap:10 }}>
                  <div style={{ width:24, height:24, borderRadius:6, background:r.bg, color:r.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, flexShrink:0, marginTop:1 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:500 }}>{r.title}</div>
                    <div style={{ fontSize:11, color:'var(--muted)', marginTop:2 }}>{r.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop:16 }}>

        {/* Intervention Simulator */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', animation:'fadeUp 0.5s ease 0.3s both' }}>
          <InterventionSimulator baseRisk={selected?.risk_score || 82} patientName={selected?.name} />
        </div>

        {/* WhatsApp Bot Preview */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', animation:'fadeUp 0.5s ease 0.4s both' }}>
          {/* Header */}
          <div style={{ padding:'10px 18px', background:'rgba(0,214,143,0.08)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:8, height:8, background:'var(--green)', borderRadius:'50%', animation:'pulse 2s infinite' }} />
            <span style={{ fontSize:12, fontWeight:500, color:'var(--green)' }}>WhatsApp Bot — Active</span>
            <span style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)' }}>+91 XXXXX XXXXX</span>
          </div>
          {/* Message */}
          <div style={{ padding:'14px 18px', fontFamily:"'IBM Plex Mono',monospace", fontSize:12, lineHeight:1.8, color:'var(--muted)', borderBottom:'1px solid var(--border)' }}>
            Namaste <span style={{ color:'var(--text)' }}>{selected?.name?.split(' ')[0] || 'Patient'} ji</span>! 🙏<br/>
            Aapka risk level: <span style={{ color: selected?.risk_level === 'High' ? 'var(--red)' : selected?.risk_level === 'Medium' ? 'var(--amber)' : 'var(--green)' }}>{selected?.risk_level?.toUpperCase()} ({selected?.risk_score}%)</span><br/><br/>
            Reminder: <span style={{ color:'var(--text)' }}>Metformin 500mg + Amlodipine 5mg</span><br/>
            Follow-up: <span style={{ color:'var(--text)' }}>Kal 10:30 AM — Dr. Sharma</span><br/><br/>
            Takleef ho toh reply: <span style={{ color:'var(--cyan)' }}>HELP</span>
          </div>
          {/* Send button */}
          <div style={{ padding:'12px 18px' }}>
            <button style={{ width:'100%', background:'var(--green-bg)', border:'1px solid rgba(0,214,143,0.3)', color:'var(--green)', padding:'9px 14px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", fontWeight:500, transition:'background .15s' }}
              onMouseEnter={e => e.target.style.background='rgba(0,214,143,0.2)'}
              onMouseLeave={e => e.target.style.background='var(--green-bg)'}
              onClick={() => alert(`WhatsApp message sent to ${selected?.name}!\n\n(Connect Twilio API for real messages)`)}>
              Send WhatsApp Message Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}