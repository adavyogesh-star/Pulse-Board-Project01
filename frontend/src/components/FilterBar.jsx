function FilterBar({
  applications,
  regions,
  environments,
  selectedApplication,
  selectedRegion,
  selectedEnvironment,
  selectedTimeRange,
  onApplicationChange,
  onRegionChange,
  onEnvironmentChange,
  onTimeRangeChange,
}) {
  return (
    <section className="filter-bar panel">
      <div>
        <label htmlFor="application-filter">Application</label>
        <select
          id="application-filter"
          value={selectedApplication}
          onChange={(event) => onApplicationChange(event.target.value)}
        >
          <option value="All">All Applications</option>
          {applications.map((application) => (
            <option key={application} value={application}>
              {application}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="region-filter">City</label>
        <select
          id="region-filter"
          value={selectedRegion}
          onChange={(event) => onRegionChange(event.target.value)}
        >
          <option value="All">All Cities</option>
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="environment-filter">Environment</label>
        <select
          id="environment-filter"
          value={selectedEnvironment}
          onChange={(event) => onEnvironmentChange(event.target.value)}
        >
          <option value="All">All Environments</option>
          {environments.map((environment) => (
            <option key={environment} value={environment}>
              {environment}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="time-range">Time Range</label>
        <select
          id="time-range"
          value={selectedTimeRange}
          onChange={(event) => onTimeRangeChange(event.target.value)}
        >
          <option value="Last 24 Hours">Last 24 Hours</option>
          <option value="Last 7 Days">Last 7 Days</option>
          <option value="Last 30 Days">Last 30 Days</option>
        </select>
      </div>
    </section>
  )
}

export default FilterBar
