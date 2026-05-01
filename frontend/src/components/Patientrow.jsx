const LEVEL_STYLES = {
  High:   { bg:'var(--red-bg)',   color:'var(--red)',   border:'rgba(255,71,87,0.3)'   },
  Medium: { bg:'var(--amber-bg)', color:'var(--amber)', border:'rgba(255,181,71,0.3)'  },
  Low:    { bg:'var(--green-bg)', color:'var(--green)', border:'rgba(0,214,143,0.3)'   },
}

export default function PatientRow({ patient, selected, onClick }) {
  const s = LEVEL_STYLES[patient.risk_level] || LEVEL_STYLES.Low

  return (
    <div
      onClick={onClick}
      style={{
        padding:'11px 18px', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', gap:12, cursor:'pointer',
        background: selected ? 'var(--blue-bg)' : 'transparent',
        borderLeft: selected ? '2px solid var(--blue)' : '2px solid transparent',
        transition:'background .12s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = 'var(--surface2)' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}
    >
      {/* Avatar */}
      <div style={{ width:36, height:36, borderRadius:'50%', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, flexShrink:0 }}>
        {patient.initials}
      </div>

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:500, fontSize:13, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
          {patient.name}
        </div>
        <div style={{ fontSize:11, color:'var(--muted)', marginTop:2, fontFamily:"'IBM Plex Mono',monospace" }}>
          {patient.gender} · {patient.age} · {patient.condition}
        </div>
      </div>

      {/* Score */}
      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:13, fontWeight:500, color:s.color, minWidth:34, textAlign:'right' }}>
        {patient.risk_score}%
      </span>

      {/* Pill */}
      <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, fontWeight:500, padding:'3px 10px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}`, whiteSpace:'nowrap' }}>
        {patient.risk_level.toUpperCase()}
      </span>
    </div>
  )
}