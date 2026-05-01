import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const riskTrend = [
  { month:'Nov', high:6, medium:8, low:10 },
  { month:'Dec', high:5, medium:9, low:11 },
  { month:'Jan', high:4, medium:7, low:13 },
  { month:'Feb', high:4, medium:6, low:14 },
  { month:'Mar', high:3, medium:5, low:14 },
  { month:'Apr', high:3, medium:5, low:12 },
]

const savingsData = [
  { month:'Nov', savings:320000 },
  { month:'Dec', savings:410000 },
  { month:'Jan', savings:560000 },
  { month:'Feb', savings:620000 },
  { month:'Mar', savings:740000 },
  { month:'Apr', savings:840000 },
]

const pieData = [
  { name:'High',   value:3,  color:'#FF4757' },
  { name:'Medium', value:5,  color:'#FFB547' },
  { name:'Low',    value:12, color:'#00D68F' },
]

const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 14px' }}>
      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:11, color:'var(--muted)', marginBottom:6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize:12, color:p.color, marginBottom:2 }}>{p.name}: {p.value?.toLocaleString('en-IN')}</div>
      ))}
    </div>
  )
}

const Panel = ({ title, children, style = {} }) => (
  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', ...style }}>
    <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)' }}>
      <span style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700 }}>{title}</span>
    </div>
    <div style={{ padding:'18px' }}>{children}</div>
  </div>
)

export default function Analytics() {
  return (
    <div style={{ padding:24 }}>
      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, marginBottom:6 }}>Analytics</div>
      <div style={{ fontSize:13, color:'var(--muted)', marginBottom:24 }}>6-month trends · PunarSwasth performance</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

        {/* Risk Trend Line Chart */}
        <Panel title="Risk Level Trend (6 months)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={riskTrend}>
              <XAxis dataKey="month" stroke="#5A7599" tick={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fill:'#5A7599' }} />
              <YAxis stroke="#5A7599" tick={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fill:'#5A7599' }} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="high"   stroke="#FF4757" strokeWidth={2} dot={{ fill:'#FF4757', r:3 }} name="High" />
              <Line type="monotone" dataKey="medium" stroke="#FFB547" strokeWidth={2} dot={{ fill:'#FFB547', r:3 }} name="Medium" />
              <Line type="monotone" dataKey="low"    stroke="#00D68F" strokeWidth={2} dot={{ fill:'#00D68F', r:3 }} name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        {/* Risk Distribution Pie */}
        <Panel title="Current Risk Distribution">
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1 }}>
              {pieData.map((d, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ width:10, height:10, borderRadius:'50%', background:d.color, flexShrink:0 }} />
                  <span style={{ fontSize:13, flex:1 }}>{d.name} Risk</span>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:d.color }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

      </div>

      {/* Savings Bar Chart */}
      <Panel title="Estimated Readmission Savings (₹)">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={savingsData} barCategoryGap="40%">
            <XAxis dataKey="month" stroke="#5A7599" tick={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fill:'#5A7599' }} />
            <YAxis stroke="#5A7599" tick={{ fontSize:11, fontFamily:"'IBM Plex Mono',monospace", fill:'#5A7599' }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
            <Tooltip content={<TT />} formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Savings']} />
            <Bar dataKey="savings" fill="#4FACFE" radius={[4,4,0,0]} name="Savings" />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      {/* Key Metrics Row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:16 }}>
        {[
          { label:'Avg Risk Score',    value:'54%',  color:'var(--amber)' },
          { label:'Readmissions Prevented', value:'14',   color:'var(--green)' },
          { label:'Model Accuracy',    value:'84%',  color:'var(--blue)'  },
          { label:'WhatsApp Response', value:'73%',  color:'var(--cyan)'  },
        ].map((m, i) => (
          <div key={i} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:14 }}>
            <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:'var(--muted)', marginBottom:6 }}>{m.label}</div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:26, fontWeight:700, color:m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}