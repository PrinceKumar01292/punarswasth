import { useState } from 'react'
import { MOCK_PATIENTS } from '../utils/api'
import RiskGauge from '../components/RiskGauge'
import ShapChart from '../components/ShapChart'
import InterventionSimulator from '../components/InterventionSimulator'
import { MOCK_SHAP } from '../utils/api'

const LEVEL_COLOR = { High:'var(--red)', Medium:'var(--amber)', Low:'var(--green)' }
const LEVEL_BG    = { High:'var(--red-bg)', Medium:'var(--amber-bg)', Low:'var(--green-bg)' }

export default function Patients() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('All')
  const [search, setSearch]     = useState('')

  const filtered = MOCK_PATIENTS.filter(p => {
    const matchLevel = filter === 'All' || p.risk_level === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchSearch
  })

  return (
    <div style={{ padding:24, display:'grid', gridTemplateColumns: selected ? '1fr 360px' : '1fr', gap:20 }}>

      {/* ── LEFT: Patient Table ── */}
      <div>
        <div style={{ marginBottom:20, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800 }}>All Patients</div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            style={{ marginLeft:'auto', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'7px 12px', color:'var(--text)', fontSize:13, outline:'none', width:200 }}
          />
          {['All','High','Medium','Low'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'6px 14px', borderRadius:20, fontSize:12, cursor:'pointer', border:'1px solid var(--border)', fontFamily:"'IBM Plex Mono',monospace",
                background: filter === f ? (f === 'All' ? 'var(--blue-bg)' : LEVEL_BG[f] || 'var(--blue-bg)') : 'var(--surface)',
                color: filter === f ? (f === 'All' ? 'var(--blue)' : LEVEL_COLOR[f] || 'var(--blue)') : 'var(--muted)'
              }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'10px 18px', borderBottom:'1px solid var(--border)', fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>
            <span>Patient</span><span>Condition</span><span>HbA1c</span><span>Risk Score</span><span>Level</span>
          </div>
          {filtered.map(p => {
            const c = LEVEL_COLOR[p.risk_level]
            const b = LEVEL_BG[p.risk_level]
            return (
              <div key={p.id}
                onClick={() => setSelected(p)}
                style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'12px 18px', borderBottom:'1px solid var(--border)', cursor:'pointer', alignItems:'center', background: selected?.id === p.id ? 'var(--blue-bg)' : 'transparent', transition:'background .12s' }}
                onMouseEnter={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'var(--surface2)' }}
                onMouseLeave={e => { if (selected?.id !== p.id) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:b, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>{p.initials}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500 }}>{p.name}</div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)' }}>{p.gender} · {p.age} yrs</div>
                  </div>
                </div>
                <span style={{ fontSize:12, color:'var(--muted)' }}>{p.condition}</span>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:12, color: p.hba1c > 9 ? 'var(--red)' : p.hba1c > 7.5 ? 'var(--amber)' : 'var(--green)' }}>{p.hba1c}</span>
                <div>
                  <div style={{ width:60, height:5, background:'var(--surface2)', borderRadius:3, marginBottom:4 }}>
                    <div style={{ width:`${p.risk_score}%`, height:5, borderRadius:3, background:c }} />
                  </div>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:c }}>{p.risk_score}%</span>
                </div>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, padding:'3px 10px', borderRadius:20, background:b, color:c, display:'inline-block' }}>
                  {p.risk_level.toUpperCase()}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── RIGHT: Detail Panel ── */}
      {selected && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:17, fontWeight:800 }}>{selected.name}</div>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--muted)', marginTop:2 }}>
                  {selected.condition} · {selected.phone}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ marginLeft:'auto', background:'none', border:'none', color:'var(--muted)', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>
            <div style={{ padding:'14px 18px' }}>
              <RiskGauge score={selected.risk_score} level={selected.risk_level} />
              <ShapChart shapData={MOCK_SHAP} />
            </div>
          </div>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
            <InterventionSimulator baseRisk={selected.risk_score} patientName={selected.name} />
          </div>
        </div>
      )}
    </div>
  )
}