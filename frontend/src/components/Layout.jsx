import { Outlet, NavLink, useLocation } from 'react-router-dom'

const NAV = [
  { to:'/dashboard', label:'Dashboard',      icon:'grid'    },
  { to:'/patients',  label:'Patients',       icon:'users'   },
  { to:'/analytics', label:'Analytics',      icon:'chart'   },
  { to:'/whatsapp',  label:'WhatsApp Bot',   icon:'message' },
]

const ICONS = {
  grid:    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>,
  users:   <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  chart:   <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 12l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  message: <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 3h12v9H9l-3 2v-2H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
}

export default function Layout() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', gridTemplateRows:'56px 1fr', minHeight:'100vh' }}>

      {/* ── TOPBAR ── */}
      <div style={{
        gridColumn:'1/-1', background:'var(--surface)', borderBottom:'1px solid var(--border)',
        display:'flex', alignItems:'center', padding:'0 20px', gap:'14px',
        position:'sticky', top:0, zIndex:100
      }}>
        {/* Logo */}
        <div style={{ width:32, height:32, background:'linear-gradient(135deg,#4FACFE,#00F5FF)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'IBM Plex Mono',monospace", fontSize:13, fontWeight:500, color:'#060B14', flexShrink:0 }}>Ps</div>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, letterSpacing:'-0.5px' }}>
          Punar<span style={{ color:'var(--cyan)' }}>Swasth</span>
        </span>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', background:'var(--surface2)', border:'1px solid var(--border)', padding:'3px 8px', borderRadius:4 }}>
          HACKATHON 2026
        </span>

        {/* Right side */}
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:7, height:7, background:'var(--green)', borderRadius:'50%', animation:'pulse 2s infinite' }} />
          <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--green)' }}>LIVE</span>
          <div style={{ width:32, height:32, background:'var(--blue-bg)', border:'1px solid var(--blue)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:600, color:'var(--blue)' }}>DR</div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <div style={{ background:'var(--surface)', borderRight:'1px solid var(--border)', padding:'16px 0', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', padding:'10px 20px 4px', letterSpacing:'0.08em' }}>MAIN</span>
        {NAV.map(n => (
          <NavLink key={n.to} to={n.to} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:10, padding:'9px 20px',
            textDecoration:'none', fontSize:13, borderLeft: isActive ? '2px solid var(--blue)' : '2px solid transparent',
            color: isActive ? 'var(--blue)' : 'var(--muted)',
            background: isActive ? 'var(--blue-bg)' : 'transparent',
            transition:'all .15s', cursor:'pointer'
          })}>
            {ICONS[n.icon]}
            {n.label}
            {n.to === '/dashboard' && (
              <span style={{ marginLeft:'auto', fontSize:10, background:'var(--red)', color:'#fff', padding:'1px 6px', borderRadius:10, fontFamily:"'IBM Plex Mono',monospace" }}>3</span>
            )}
          </NavLink>
        ))}

        {/* Bottom info */}
        <div style={{ marginTop:'auto', padding:'16px 20px', borderTop:'1px solid var(--border)' }}>
          <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', marginBottom:4 }}>TEAM STACKVERSE</div>
          <div style={{ fontSize:11, color:'var(--dim)' }}>JNCT · Technoverse 2026</div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ overflowY:'auto', background:'var(--bg)' }}>
        <Outlet />
      </div>

    </div>
  )
}