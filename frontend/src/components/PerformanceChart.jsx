import { useState } from 'react'

function PerformanceChart({ data = [], timeSeries = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null)

  if (!data.length && !timeSeries.length) {
    return null
  }

  const maxValue = Math.max(
    100,
    ...timeSeries.flatMap((item) => [item.response, item.cpu, item.memory]),
    ...data.flatMap((item) => [item.response, item.cpu, item.memory])
  )

  const width = 560
  const height = 260
  const padding = 24
  const innerWidth = width - padding * 2
  const innerHeight = height - padding * 2
  const stepX = timeSeries.length > 1 ? innerWidth / (timeSeries.length - 1) : innerWidth

  const seriesConfig = [
    { key: 'response', color: '#365cff', label: 'Response' },
    { key: 'cpu', color: '#f59e0b', label: 'CPU' },
    { key: 'memory', color: '#10b981', label: 'Memory' },
  ]

  const buildPath = (key) => {
    if (!timeSeries.length) {
      return ''
    }

    return timeSeries.map((point, index) => {
      const x = padding + stepX * index
      const y = padding + innerHeight - (Number(point[key]) / maxValue) * innerHeight
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
  }

  const buildAreaPath = (key) => {
    if (!timeSeries.length) {
      return ''
    }

    const linePath = buildPath(key)
    const baseline = `L ${padding + stepX * (timeSeries.length - 1)} ${padding + innerHeight} L ${padding} ${padding + innerHeight} Z`
    return `${linePath} ${baseline}`
  }

  const formatTimestamp = (iso) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return iso
    }
  }

  const chartPoints = timeSeries.map((point, index) => ({
    label: point.timestampISO ? formatTimestamp(point.timestampISO) : point.label,
    timestampISO: point.timestampISO || null,
    x: padding + stepX * index,
    values: {
      response: Number(point.response) || 0,
      cpu: Number(point.cpu) || 0,
      memory: Number(point.memory) || 0,
    },
  }))

  return (
    <div className="panel chart-panel">
      <div className="panel-heading">
        <h3>Performance Trend</h3>
        <p>Interactive latency, CPU, and memory signals across the selected range</p>
      </div>

      <div className="time-chart">
        <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" role="img" aria-label="Performance trend graph over time">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              x2={width - padding}
              y1={padding + innerHeight * ratio}
              y2={padding + innerHeight * ratio}
              stroke="#e6ebf6"
              strokeDasharray="4 4"
            />
          ))}

          <defs>
            {seriesConfig.map((series) => (
              <linearGradient key={`${series.key}-gradient`} id={`${series.key}-gradient`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={series.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={series.color} stopOpacity="0.03" />
              </linearGradient>
            ))}
          </defs>

          {seriesConfig.map((series) => (
            <path key={`${series.key}-area`} d={buildAreaPath(series.key)} fill={`url(#${series.key}-gradient)`} />
          ))}

          {seriesConfig.map((series) => (
            <path key={series.key} d={buildPath(series.key)} fill="none" stroke={series.color} strokeWidth="3.4" strokeLinecap="round" />
          ))}

          {chartPoints.map((point) => (
            <g key={point.label}>
              {seriesConfig.map((series) => {
                const y = padding + innerHeight - (Number(point.values[series.key]) / maxValue) * innerHeight
                return (
                  <circle
                    key={`${point.label}-${series.key}`}
                    cx={point.x}
                    cy={y}
                    r={hoveredPoint?.label === point.label ? '5.8' : '4.2'}
                    fill={series.color}
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  />
                )
              })}
            </g>
          ))}

          {chartPoints.map((point) => (
            <text key={`${point.label}-label`} x={point.x} y={height - 8} textAnchor="middle" className="axis-label">
              {point.label}
            </text>
          ))}
        </svg>

        <div className="legend-row">
          {seriesConfig.map((series) => (
            <span key={series.key}><i className="legend-dot" style={{ background: series.color }} /> {series.label}</span>
          ))}
        </div>
      </div>

      <div className="chart-tooltip-panel">
        {hoveredPoint ? (
          <>
            <strong>{hoveredPoint.label}</strong>
            {hoveredPoint.timestampISO && <small>{formatTimestamp(hoveredPoint.timestampISO)}</small>}
            <span>Response {hoveredPoint.values.response}ms</span>
            <span>CPU {hoveredPoint.values.cpu}%</span>
            <span>Memory {hoveredPoint.values.memory}%</span>
          </>
        ) : (
          <span>Hover a point to inspect the live metric snapshot.</span>
        )}
      </div>

      <div className="time-series-summary">
        {data.slice(0, 5).map((item) => (
          <div key={item.application} className="summary-chip">
            <strong>{item.application}</strong>
            <span>R {item.response}ms • C {item.cpu}% • M {item.memory}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PerformanceChart
