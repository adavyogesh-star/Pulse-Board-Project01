function AlertTable({ alerts }) {
  return (
    <section className="panel table-panel" id="alerts">
      <div className="panel-heading">
        <h3>Active Alerts</h3>
        <p>Current incidents and threshold breaches</p>
      </div>

      {(!alerts || alerts.length === 0) ? (
        <p className="empty-state">No alerts at the moment.</p>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, index) => (
            <div key={`${alert.metric}-${index}`} className="alert-row panel">
              <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
                <span className={`status-pill ${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
                <div>
                  <strong>{alert.metric}</strong>
                  <div className="muted" style={{marginTop: 6}}>{alert.message}</div>
                </div>
              </div>

              <div style={{display: 'flex', gap: 18, alignItems: 'center'}}>
                <div className="muted">{new Date(alert.firstSeenISO || Date.now()).toLocaleString()}</div>
                <div className="muted">{new Date(alert.lastSeenISO || Date.now()).toLocaleString()}</div>
                <div><strong>{alert.count || 1}</strong></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default AlertTable
