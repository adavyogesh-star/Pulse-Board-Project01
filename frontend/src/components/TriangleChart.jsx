import React from 'react'

function TriangleChart({ data = [] }) {
  if (!data.length) return null

  const width = 520
  const height = 260
  const padding = 28
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2

  const cols = data.length
  const stepX = cols > 1 ? innerWidth / (cols - 1) : innerWidth

  // draw stacked triangular spikes
  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <h3>Situation Distribution</h3>
        <p>Triangle spike view of incident volumes</p>
      </div>

      <div className="chart-wrapper">
        <svg viewBox={`0 0 ${width} ${height}`} className="triangle-svg" role="img" aria-label="Situation distribution chart">
          {data.map((d, i) => {
            const x = padding + i * stepX
            const v = Number(d.throughput || d.response || d.errorRate || 0)
            const peak = padding + innerHeight - (Math.min(1, v / 2000) * innerHeight)
            const path = `M ${x} ${height - padding} L ${x + stepX / 2} ${peak} L ${x + stepX} ${height - padding} Z`
            return (
              <path key={d.application || i} d={path} fill={d.color || '#ff7b7b'} opacity={0.88} />
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default TriangleChart
