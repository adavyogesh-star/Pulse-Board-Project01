function KPICard({ label, value, unit, description, status }) {
  return (
    <article className="panel kpi-card">
      <div className="kpi-header">
        <p>{label}</p>
        <span className={`status-pill ${status?.toLowerCase()}`}>{status || 'Healthy'}</span>
      </div>
      <strong className="kpi-value">
        {typeof value === 'number' ? value.toLocaleString() : value}
        {unit ? <span className="unit">{unit}</span> : null}
      </strong>
      <p className="kpi-description">{description}</p>
    </article>
  )
}

export default KPICard
