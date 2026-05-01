const COLORS = ['var(--red)', 'var(--red)', 'var(--amber)', 'var(--amber)', 'var(--muted)']

export default function ShapChart({ shapData }) {
  const entries = Object.entries(shapData)

  return (
    <div>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:10 }}>
        SHAP — Risk Factor Importance
      </div>
      {entries.map(([key, val], i) => (
        <div key={key} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', width:88, flexShrink:0, textAlign:'right' }}>
            {key}
          </div>
          <div style={{ flex:1, height:6, background:'var(--surface2)', borderRadius:3, overflow:'hidden' }}>
            <div style={{
              height:6, borderRadius:3, width:`${val.pct}%`,
              background: COLORS[i] || 'var(--muted)',
              transition:'width 0.7s ease'
            }} />
          </div>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color: COLORS[i], width:36, flexShrink:0 }}>
            +{val.value.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}