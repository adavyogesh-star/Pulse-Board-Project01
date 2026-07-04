const { loadCSV } = require("./services/csvService");
const { calculateMetrics } = require("./services/metricsService");
const { calculateHealth } = require("./services/healthService");
const { generateAlerts } = require("./services/alertService");

const data = loadCSV();

const metrics = calculateMetrics(data);

const health = calculateHealth(metrics);

const alerts = generateAlerts(metrics, health);

console.log("\n===== Metrics =====");
console.log(metrics);

console.log("\n===== Health =====");
console.log(health);

console.log("\n===== Alerts =====");
console.table(alerts);