const ACCENT = { red:'var(--red)', amber:'var(--amber)', green:'var(--green)', blue:'var(--blue)' }

export default function StatCard({ label, value, sub, accent = 'blue', delay = 0 }) {
  const color = ACCENT[accent]
  return (
    <div style={{
      background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12,
      padding:'16px', position:'relative', overflow:'hidden',
      animation:`fadeUp 0.4s ease ${delay}s both`
    }}>
      {/* Top accent line */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
        {label}
      </div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:30, fontWeight:700, color, lineHeight:1 }}>
        {value}
      </div>
      <div style={{ fontSize:11, color:'var(--muted)', marginTop:6 }}>
        {sub}
      </div>
    </div>
  )
}