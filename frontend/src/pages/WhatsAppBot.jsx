import { useState } from 'react'
import { MOCK_PATIENTS } from '../utils/api'

const MSG_TEMPLATES = {
  High:   (name) => `Namaste ${name} ji! 🙏\n\nAapka readmission risk BAHUT ZYADA (High) hai.\n\nAaj ki reminder:\n• Metformin 500mg - subah\n• Amlodipine 5mg - raat\n• BP check karein\n\nKal 10:30 AM - Dr. Sharma se milein.\n\nKoi takleef? Reply karein: HELP`,
  Medium: (name) => `Namaste ${name} ji! 🙏\n\nAapka health update:\nRisk level: MEDIUM - dhyan rakhein.\n\nIs hafte ki reminder:\n• Regular dawai lein\n• BP check karein\n\n2 hafte baad follow-up hai.\n\nSawal ho toh reply: HELP`,
  Low:    (name) => `Namaste ${name} ji! 🙏\n\nAapki sehat theek lag rahi hai! ✅\nRisk level: LOW - great!\n\nMahine mein ek baar check-in karein.\nHealthy khana khayein, walk karein.\n\nKoi baat ho toh: HELP`,
}

export default function WhatsAppBot() {
  const [selected, setSelected]  = useState(MOCK_PATIENTS[0])
  const [sent, setSent]          = useState([])
  const [custom, setCustom]      = useState('')
  const [loading, setLoading]    = useState(false)

  const message = MSG_TEMPLATES[selected.risk_level](selected.name.split(' ')[0])
  const levelColor = { High:'var(--red)', Medium:'var(--amber)', Low:'var(--green)' }[selected.risk_level]

  const sendMsg = async (msg) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(prev => [{ id:Date.now(), patient:selected.name, msg, time: new Date().toLocaleTimeString(), level:selected.risk_level }, ...prev])
    setLoading(false)
  }

  return (
    <div style={{ padding:24 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:6 }}>WhatsApp Bot</div>
      <div style={{ fontSize:13, color:'var(--muted)', marginBottom:24 }}>Patients ko AI-generated Hindi reminders bhejein</div>

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr 340px', gap:16 }}>

        {/* Patient list */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700 }}>Select Patient</span>
          </div>
          {MOCK_PATIENTS.map(p => {
            const c = { High:'var(--red)', Medium:'var(--amber)', Low:'var(--green)' }[p.risk_level]
            const b = { High:'var(--red-bg)', Medium:'var(--amber-bg)', Low:'var(--green-bg)' }[p.risk_level]
            return (
              <div key={p.id} onClick={() => setSelected(p)}
                style={{ padding:'10px 16px', borderBottom:'1px solid var(--border)', cursor:'pointer', background: selected.id === p.id ? 'var(--blue-bg)' : 'transparent', display:'flex', alignItems:'center', gap:10, transition:'background .12s' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:b, color:c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600, flexShrink:0 }}>{p.initials}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:c }}>{p.risk_level} · {p.risk_score}%</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message composer */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', display:'flex', flexDirection:'column' }}>
          {/* Header */}
          <div style={{ padding:'12px 18px', background:'rgba(0,214,143,0.07)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:8, height:8, background:'var(--green)', borderRadius:'50%', animation:'pulse 2s infinite' }} />
            <span style={{ fontWeight:500, color:'var(--green)', fontSize:13 }}>WhatsApp — {selected.name}</span>
            <span style={{ marginLeft:'auto', fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:levelColor }}>{selected.risk_level} Risk</span>
          </div>

          {/* Message preview */}
          <div style={{ flex:1, padding:'18px', display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>AI Generated Message Preview</div>
            <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:10, padding:'14px 16px', fontFamily:"'IBM Plex Mono',monospace", fontSize:12, lineHeight:2, color:'var(--text)', whiteSpace:'pre-wrap', flex:1 }}>
              {message}
            </div>

            {/* Custom message */}
            <div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', marginBottom:6 }}>CUSTOM MESSAGE (OPTIONAL)</div>
              <textarea
                value={custom}
                onChange={e => setCustom(e.target.value)}
                placeholder="Apna custom message type karo..."
                style={{ width:'100%', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', color:'var(--text)', fontSize:12, fontFamily:"'IBM Plex Mono',monospace", outline:'none', resize:'vertical', minHeight:70 }}
              />
            </div>

            {/* Send buttons */}
            <div style={{ display:'flex', gap:10 }}>
              <button
                onClick={() => sendMsg(message)}
                disabled={loading}
                style={{ flex:1, background:'var(--green-bg)', border:'1px solid rgba(0,214,143,0.3)', color:'var(--green)', padding:'10px', borderRadius:8, fontSize:13, cursor:'pointer', fontWeight:500, opacity: loading ? 0.6 : 1 }}>
                {loading ? 'Sending...' : 'Send AI Message'}
              </button>
              {custom && (
                <button
                  onClick={() => sendMsg(custom)}
                  disabled={loading}
                  style={{ flex:1, background:'var(--blue-bg)', border:'1px solid rgba(79,172,254,0.3)', color:'var(--blue)', padding:'10px', borderRadius:8, fontSize:13, cursor:'pointer', fontWeight:500 }}>
                  Send Custom
                </button>
              )}
            </div>

            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', textAlign:'center' }}>
              Connect Twilio API in backend to send real messages
            </div>
          </div>
        </div>

        {/* Sent log */}
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'12px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700 }}>Sent Log</span>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', marginLeft:'auto' }}>{sent.length} messages</span>
          </div>
          <div style={{ maxHeight:500, overflowY:'auto' }}>
            {sent.length === 0 && (
              <div style={{ padding:24, textAlign:'center', color:'var(--muted)', fontSize:12, fontFamily:"'IBM Plex Mono',monospace" }}>No messages sent yet</div>
            )}
            {sent.map(s => {
              const c = { High:'var(--red)', Medium:'var(--amber)', Low:'var(--green)' }[s.level] || 'var(--green)'
              return (
                <div key={s.id} style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:500 }}>{s.patient}</span>
                    <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)' }}>{s.time}</span>
                  </div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:c, marginBottom:4 }}>{s.level} Risk</div>
                  <div style={{ fontSize:11, color:'var(--muted)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {s.msg.substring(0,80)}...
                  </div>
                  <div style={{ fontSize:10, color:'var(--green)', marginTop:6 }}>✓ Sent successfully</div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}