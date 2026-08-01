const {
  loadCSV,
  filterRowsByApplication,
  filterRowsByRegion,
  filterRowsByEnvironment,
  filterRowsBySeverity,
  filterRowsByEvent,
  filterRowsByHealthStatus,
  filterRowsByTimeRange,
} = require('../backend/services/csvService');
const { calculateMetrics, calculateApplicationMetrics, calculateTimeSeries } = require('../backend/services/metricsService');
const { calculateHealth } = require('../backend/services/healthService');
const { generateAlerts } = require('../backend/services/alertService');

module.exports = async (req, res) => {
  try {
    const application = req.query.application || 'All';
    const region = req.query.region || 'All';
    const environment = req.query.environment || 'All';
    const severity = req.query.severity || 'All';
    const event = req.query.event || 'All';
    const healthStatus = req.query.healthStatus || 'All';
    const timeRange = req.query.timeRange || 'Last 30 Days';

    const rows = loadCSV();
    const regions = [...new Set(rows.map((row) => row.Region || 'Unknown'))].sort();
    const applications = [...new Set(rows.map((row) => row.Application || 'Unknown'))].sort();
    const environments = [...new Set(rows.map((row) => row.Environment || 'Unknown'))].sort();
    const severities = [...new Set(rows.map((row) => row.Severity || 'Unknown'))].sort();
    const events = [...new Set(rows.map((row) => row.Event || 'Unknown'))].sort();
    const healthStatuses = [...new Set(rows.map((row) => row.Health_Status || 'Unknown'))].sort();

    let filteredRows = rows;
    filteredRows = filterRowsByApplication(filteredRows, application);
    filteredRows = filterRowsByRegion(filteredRows, region);
    filteredRows = filterRowsByEnvironment(filteredRows, environment);
    filteredRows = filterRowsBySeverity(filteredRows, severity);
    filteredRows = filterRowsByEvent(filteredRows, event);
    filteredRows = filterRowsByHealthStatus(filteredRows, healthStatus);
    filteredRows = filterRowsByTimeRange(filteredRows, timeRange);

    const metrics = calculateMetrics(filteredRows);
    const health = calculateHealth(metrics);
    const alerts = generateAlerts(metrics, health);
    const applicationMetrics = calculateApplicationMetrics(filteredRows);
    const timeSeries = calculateTimeSeries(filteredRows);
    const healthBreakdown = applicationMetrics.reduce((accumulator, applicationMetric) => {
      const key = applicationMetric.status.toLowerCase();
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    res.status(200).json({
      metrics,
      health,
      alerts,
      applications,
      regions,
      environments,
      severities,
      events,
      healthStatuses,
      applicationMetrics,
      timeSeries,
      healthBreakdown,
      healthChartData: [
        { name: 'Healthy', value: healthBreakdown.healthy || 0, color: '#10b981' },
        { name: 'Warning', value: healthBreakdown.warning || 0, color: '#f59e0b' },
        { name: 'Critical', value: healthBreakdown.critical || 0, color: '#ef4444' },
      ].filter((item) => item.value > 0),
    });
  } catch (error) {
    console.error('API overview error:', error);
    res.status(500).json({ error: 'Unable to load dashboard data' });
  }
};
