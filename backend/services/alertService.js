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
            message: "Error rate has exceeded the acceptable threshold."
        });
    }

    return alerts;
}

module.exports = {
    generateAlerts
};