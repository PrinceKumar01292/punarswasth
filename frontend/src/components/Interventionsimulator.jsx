import { useState } from 'react'

export default function InterventionSimulator({ baseRisk = 82, patientName = '' }) {
  const [followups, setFollowups] = useState(0)
  const [medication, setMedication] = useState(0)
  const [caregiver, setCaregiver] = useState(0)

  const careLabels = ['None', 'Partial', 'Full support']
  const reduction  = followups * 4 + medication * 0.15 + caregiver * 6
  const newRisk    = Math.max(10, Math.round(baseRisk - reduction))
  const saved      = Math.round((baseRisk - newRisk) * 0.3 * 18000)
  const newColor   = newRisk > 65 ? 'var(--red)' : newRisk > 40 ? 'var(--amber)' : 'var(--green)'

  const SliderRow = ({ label, value, max, unit, onChange, display }) => (
    <div style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
        <span style={{ fontSize:12, color:'var(--muted)' }}>{label}</span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color:'var(--cyan)' }}>{display}</span>
      </div>
      <input type="range" min="0" max={max} value={value} onChange={e => onChange(parseInt(e.target.value))} />
    </div>
  )

  return (
    <div style={{ padding:'16px 18px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
        <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
          <path d="M8 2v4l3 2" stroke="var(--cyan)" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="8" cy="8" r="6" stroke="var(--cyan)" strokeWidth="1.5"/>
        </svg>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700 }}>Intervention Simulator</span>
        {patientName && <span style={{ marginLeft:'auto', fontSize:10, fontFamily:"'IBM Plex Mono',monospace", color:'var(--muted)' }}>{patientName}</span>}
      </div>

      <SliderRow label="Follow-up calls" value={followups} max={5} onChange={setFollowups} display={`${followups} call${followups !== 1 ? 's' : ''}`} />
      <SliderRow label="Medication adherence" value={medication} max={100} onChange={setMedication} display={`${medication}%`} />
      <SliderRow label="Caregiver support" value={caregiver} max={2} onChange={setCaregiver} display={careLabels[caregiver]} />

      {/* Result */}
      <div style={{ background:'var(--surface2)', border:'1px solid var(--border2)', borderRadius:10, padding:14, marginTop:6, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:'var(--red)', lineHeight:1 }}>{baseRisk}%</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:'var(--muted)', marginTop:4 }}>current</div>
        </div>
        <div style={{ fontSize:20, color:'var(--green)' }}>→</div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:800, color:newColor, lineHeight:1, transition:'color .3s' }}>{newRisk}%</div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:'var(--muted)', marginTop:4 }}>predicted</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:800, color:'var(--green)', lineHeight:1 }}>
            ₹{saved.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:'var(--muted)', marginTop:4 }}>est. savings</div>
        </div>
      </div>
    </div>
  )
}