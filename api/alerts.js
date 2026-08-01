const { loadCSV } = require('../backend/services/csvService');
const { calculateMetrics } = require('../backend/services/metricsService');
const { calculateHealth } = require('../backend/services/healthService');
const { generateAlerts } = require('../backend/services/alertService');

module.exports = async (req, res) => {
  try {
    const rows = loadCSV();
    const metrics = calculateMetrics(rows);
    const health = calculateHealth(metrics);
    const alerts = generateAlerts(metrics, health).map((a) => ({
      ...a,
      firstSeenISO: new Date(a.firstSeen || Date.now()).toISOString(),
      lastSeenISO: new Date(a.lastSeen || Date.now()).toISOString(),
    }));

    res.status(200).json(alerts);
  } catch (error) {
    console.error('API alerts error:', error);
    res.status(500).json({ error: 'Unable to load alerts' });
  }
};
