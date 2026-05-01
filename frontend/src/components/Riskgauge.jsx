export default function RiskGauge({ score = 0, level = 'Low' }) {
  const color = level === 'High' ? '#FF4757' : level === 'Medium' ? '#FFB547' : '#00D68F'
  const total = 204
  const offset = total - (total * score / 100)

  return (
    <div style={{ display:'flex', justifyContent:'center', margin:'8px 0 14px' }}>
      <svg viewBox="0 0 160 90" width="180" height="100">
        <defs>
          <linearGradient id="grd" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#00D68F" />
            <stop offset="50%"  stopColor="#FFB547" />
            <stop offset="100%" stopColor="#FF4757" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path d="M15 85 A65 65 0 0 1 145 85" fill="none" stroke="#1E2D42" strokeWidth="12" strokeLinecap="round" />
        {/* Fill */}
        <path
          d="M15 85 A65 65 0 0 1 145 85"
          fill="none" stroke="url(#grd)" strokeWidth="12" strokeLinecap="round"
          strokeDasharray={total} strokeDashoffset={offset}
          style={{ transition:'stroke-dashoffset 0.7s ease' }}
        />
        {/* Score text */}
        <text x="80" y="76" textAnchor="middle" fontFamily="'Syne',sans-serif" fontSize="24" fontWeight="800" fill={color}
          style={{ transition:'fill 0.4s' }}>
          {score}%
        </text>
        <text x="80" y="89" textAnchor="middle" fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="#5A7599">
          READMISSION RISK
        </text>
        <text x="14" y="89" fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="#5A7599">LOW</text>
        <text x="118" y="89" fontFamily="'IBM Plex Mono',monospace" fontSize="7.5" fill="#5A7599">HIGH</text>
      </svg>
    </div>
  )
}