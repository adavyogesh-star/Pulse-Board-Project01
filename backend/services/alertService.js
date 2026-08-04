function generateAlerts(metrics, health) {

    const alerts = [];

    if (health.cpuStatus === "Critical") {
        alerts.push({
            severity: "Critical",
            metric: "CPU Usage",
            message: "CPU usage is above 90%."
        });
    }

    if (health.memoryStatus === "Critical") {
        alerts.push({
            severity: "Critical",
            metric: "Memory Usage",
            message: "Memory usage is above 90%."
        });
    }

    if (health.responseStatus === "Critical") {
        alerts.push({
            severity: "Critical",
            metric: "Response Time",
            message: "Response time is above 500 ms."
        });
    }

    if (health.availabilityStatus !== "Healthy") {
        alerts.push({
            severity: health.availabilityStatus,
            metric: "Availability",
            message: "Application availability is below expected level."
        });
    }

    if (health.errorStatus !== "Healthy") {
        alerts.push({
            severity: health.errorStatus,
            metric: "Error Rate",
            message: "Error rate has exceeded the acceptable threshold.",
            firstSeen: Date.now() - 1000 * 60 * 5,
            lastSeen: Date.now(),
            count: Math.max(1, Math.floor((metrics.averageErrorRate || 1) * 3))
        });
    }

    return alerts;
}

function generateRowAlerts(rows) {
    const alertGroups = new Map();

    rows.forEach((row) => {
        const severity = row.Severity || row.Health_Status;

        if (!severity || severity === "Info" || severity === "Healthy") {
            return;
        }

        const application = row.Application || "Unknown application";
        const event = row.Event || "Service health issue";
        const key = `${severity}|${application}|${event}`;
        const timestamp = row.timestamp instanceof Date ? row.timestamp : null;
        const existing = alertGroups.get(key);

        if (existing) {
            existing.count += 1;
            if (timestamp && (!existing.firstSeen || timestamp < existing.firstSeen)) {
                existing.firstSeen = timestamp;
            }
            if (timestamp && (!existing.lastSeen || timestamp > existing.lastSeen)) {
                existing.lastSeen = timestamp;
            }
            return;
        }

        alertGroups.set(key, {
            severity,
            metric: application,
            message: event,
            firstSeen: timestamp,
            lastSeen: timestamp,
            count: 1,
        });
    });

    return [...alertGroups.values()]
        .sort((a, b) => b.count - a.count)
        .slice(0, 50);
}

module.exports = {
    generateAlerts,
    generateRowAlerts
};
