function SummaryTable({ rows }) {
  return (
    <section className="panel table-panel" id="summary">
      <div className="panel-heading">
        <h3>Performance Summary</h3>
        <p>High-level indicators across monitored services</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <td>{row.label}</td>
              <td>{row.value}</td>
              <td>
                <span className={`status-pill ${row.status?.toLowerCase()}`}>{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default SummaryTable
