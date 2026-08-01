function FilterBar({
  applications,
  regions,
  selectedApplication,
  selectedRegion,
  selectedTimeRange,
  onApplicationChange,
  onRegionChange,
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
