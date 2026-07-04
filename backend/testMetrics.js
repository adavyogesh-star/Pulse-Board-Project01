const { loadCSV } = require("./services/csvService");
const { calculateMetrics } = require("./services/metricsService");

const data = loadCSV();

const metrics = calculateMetrics(data);

console.log(metrics);