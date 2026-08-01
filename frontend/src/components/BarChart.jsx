import React from 'react'

function BarChart({ data = [] }) {
  if (!data.length) return null

  const width = 520
  const height = 260
  const padding = 32
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const maxValue = Math.max(...data.map((d) => d.throughput || d.response || 0), 100)
  const barWidth = innerWidth / data.length - 8

  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <h3>Alert Distribution</h3>
        <p>Bar chart of application-level throughput</p>
      </div>

      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="bar-svg" role="img" aria-label="Application throughput bar chart">
          {data.map((d, i) => {
            const x = padding + i * (barWidth + 8)
            const v = Number(d.throughput || d.response || 0)
            const h = (v / maxValue) * innerHeight
            const y = padding + innerHeight - h
            return (
              <g key={d.application}>
                <rect x={x} y={y} width={barWidth} height={h} rx={6} fill="#58a6ff" opacity={0.95} />
                <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" className="axis-label">{d.application}</text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default BarChart
