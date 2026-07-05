import { useState } from 'react'

function StatusPieChart({ data = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!data.length) {
    return null
  }

  const total = data.reduce((sum, item) => sum + Number(item.value || 0), 0)
  const colors = ['#10b981', '#f59e0b', '#ef4444']

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0)
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  const describeArc = (startAngle, endAngle, radius) => {
    const start = polarToCartesian(0, 0, radius, endAngle)
    const end = polarToCartesian(0, 0, radius, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`
  }

  let startAngle = 0

  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <h3>Service Health</h3>
        <p>Distribution of healthy, warning, and critical services</p>
      </div>

      <div className="pie-chart-wrapper">
        <svg viewBox="-100 -100 200 200" className="pie-svg" role="img" aria-label="Service health distribution">
          {data.map((item, index) => {
            const value = Number(item.value || 0)
            const angle = total === 0 ? 0 : (value / total) * 360
            const endAngle = startAngle + angle
            const path = describeArc(startAngle, endAngle, 78)
            startAngle = endAngle

            return (
              <path
                key={item.name}
                d={path}
                fill={item.color || colors[index % colors.length]}
                opacity={activeIndex === index ? 0.95 : 0.78}
                stroke="#ffffff"
                strokeWidth="2"
                onMouseEnter={() => setActiveIndex(index)}
                style={{ cursor: 'pointer' }}
              />
            )
          })}

          <circle cx="0" cy="0" r="44" fill="#ffffff" />
          <text x="0" y="-4" textAnchor="middle" className="pie-center-value">{total}</text>
          <text x="0" y="16" textAnchor="middle" className="pie-center-label">services</text>
        </svg>

        <div className="legend-list-wrapper">
          <ul className="legend-list">
            {data.map((item, index) => (
              <li key={item.name} className={activeIndex === index ? 'legend-item active' : 'legend-item'} onMouseEnter={() => setActiveIndex(index)}>
                <span className="legend-dot" style={{ background: item.color || colors[index % colors.length] }} />
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StatusPieChart
