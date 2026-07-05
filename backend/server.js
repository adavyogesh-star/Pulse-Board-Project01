const express = require("express");
const cors = require("cors");
const { loadCSV, filterRowsByApplication, filterRowsByTimeRange } = require("./services/csvService");
const { calculateMetrics, calculateApplicationMetrics, calculateTimeSeries } = require("./services/metricsService");
const { calculateHealth } = require("./services/healthService");
const { generateAlerts } = require("./services/alertService");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        project: "Pulse Board",
        status: "Backend Running"
    });
});

app.get("/api/overview", (req, res) => {
    try {
        const application = req.query.application || "All";
        const timeRange = req.query.timeRange || "Last 30 Days";
        const rows = loadCSV();
        const filteredRows = filterRowsByTimeRange(filterRowsByApplication(rows, application), timeRange);
        const metrics = calculateMetrics(filteredRows);
        const health = calculateHealth(metrics);
        const alerts = generateAlerts(metrics, health);
        const applications = [...new Set(rows.map((row) => row.Application || "Unknown"))];
        const applicationMetrics = calculateApplicationMetrics(filteredRows);
        const timeSeries = calculateTimeSeries(filteredRows);
        const healthBreakdown = applicationMetrics.reduce((accumulator, applicationMetric) => {
            const key = applicationMetric.status.toLowerCase();
            accumulator[key] = (accumulator[key] || 0) + 1;
            return accumulator;
        }, {});

        res.json({
            metrics,
            health,
            alerts,
            applications,
            applicationMetrics,
            timeSeries,
            healthBreakdown,
            healthChartData: [
                { name: "Healthy", value: healthBreakdown.healthy || 0, color: "#10b981" },
                { name: "Warning", value: healthBreakdown.warning || 0, color: "#f59e0b" },
                { name: "Critical", value: healthBreakdown.critical || 0, color: "#ef4444" }
            ].filter((item) => item.value > 0)
        });
    } catch (error) {
        console.error("Overview error:", error);
        res.status(500).json({ error: "Unable to load dashboard data" });
    }
});

app.get("/api/alerts", (req, res) => {
    try {
        const rows = loadCSV();
        const metrics = calculateMetrics(rows);
        const health = calculateHealth(metrics);
        const alerts = generateAlerts(metrics, health);

        res.json(alerts);
    } catch (error) {
        console.error("Alerts error:", error);
        res.status(500).json({ error: "Unable to load alerts" });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});