import React from 'react'

function KPICard({ label, value, unit, description, status }) {
  // compute a friendly percentage for the ring visualization
  const computePercent = () => {
    const num = Number(value) || 0
    if (unit === '%') return Math.max(0, Math.min(100, Math.round(num)))
    if (unit && unit.toLowerCase().includes('ms')) return Math.max(0, Math.min(100, Math.round((num / 2000) * 100)))
    if (unit === 'apps') return 100
    // fallback: scale relative to 1000
    return Math.max(0, Math.min(100, Math.round((num / 1000) * 100)))
  }

  const percent = computePercent()
  const radius = 28
  const stroke = 5
  const normalizedRadius = radius - stroke * 0.5
  const circumference = 2 * Math.PI * normalizedRadius
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <article className="panel kpi-card kpi-small">
      <div className="kpi-ring">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            strokeOpacity="0.12"
            stroke="#ffffff"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#58a6ff"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="kpi-ring-label">
            {percent}%
          </text>
        </svg>
      </div>

      <div className="kpi-body">
        <div className="kpi-header">
          <p>{label}</p>
          <span className={`status-pill ${status?.toLowerCase()}`}>{status || 'Healthy'}</span>
        </div>

        <strong className="kpi-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit ? <span className="unit">{unit}</span> : null}
        </strong>
        <p className="kpi-description">{description}</p>
      </div>
    </article>
  )
}

export default KPICard

