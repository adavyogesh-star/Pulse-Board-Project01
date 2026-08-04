function AlertTable({ alerts }) {
  const sortedAlerts = [...(alerts || [])].sort((a, b) => {
    const priority = {
      Critical: 0,
      Warning: 1,
      Unknown: 2,
    }

    return (priority[a.severity] ?? 3) - (priority[b.severity] ?? 3)
  })

  const criticalCount = sortedAlerts.filter((alert) => alert.severity === 'Critical').length

  return (
    <section className="panel table-panel" id="alerts">
      <div className="panel-heading">
        <h3>Active Alerts</h3>
        <p>Current incidents and threshold breaches</p>
      </div>

      {(!sortedAlerts || sortedAlerts.length === 0) ? (
        <p className="empty-state">No alerts at the moment.</p>
      ) : (
        <>
          <div className="alert-summary" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div>
              <strong>{sortedAlerts.length}</strong> Active Alerts
            </div>
            <div>
              <strong>{criticalCount}</strong> Critical Alerts
            </div>
          </div>
          <div className="alerts-list">
            {sortedAlerts.map((alert, index) => (
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
        </>
      )}
    </section>
  )
}

export default AlertTable
