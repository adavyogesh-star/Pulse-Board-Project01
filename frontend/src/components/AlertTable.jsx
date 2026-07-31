function AlertTable({ alerts }) {
  return (
    <section className="panel table-panel" id="alerts">
      <div className="panel-heading">
        <h3>Active Alerts</h3>
        <p>Current incidents and threshold breaches</p>
      </div>

      {alerts.length === 0 ? (
        <p className="empty-state">No alerts at the moment.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Severity</th>
              <th>Metric</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr key={`${alert.metric}-${index}`}>
                <td>
                  <span className={`status-pill ${alert.severity?.toLowerCase()}`}>{alert.severity}</span>
                </td>
                <td>{alert.metric}</td>
                <td>{alert.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default AlertTable
