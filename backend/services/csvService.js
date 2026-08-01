const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

function loadCSV() {

    const filePath = path.join(
        __dirname,
        "..",
        "data",
        "PulseBoard_APM_14400_Dataset_With_HTTP_Status.csv"
    );

    const csvData = fs.readFileSync(filePath, "utf8");

    const result = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
    });

    return result.data;
}

function filterRowsByApplication(rows, application) {
    if (!application || application === "All") {
        return rows;
    }

    return rows.filter((row) => (row.Application || "Unknown") === application);
}

function filterRowsByRegion(rows, region) {
    if (!region || region === "All") {
        return rows;
    }

    return rows.filter((row) => (row.Region || "Unknown") === region);
}

function filterRowsByEnvironment(rows, environment) {
    if (!environment || environment === "All") {
        return rows;
    }

    return rows.filter((row) => (row.Environment || "Unknown") === environment);
}

function filterRowsBySeverity(rows, severity) {
    if (!severity || severity === "All") {
        return rows;
    }

    return rows.filter((row) => (row.Severity || "Unknown") === severity);
}

function filterRowsByEvent(rows, event) {
    if (!event || event === "All") {
        return rows;
    }

    return rows.filter((row) => (row.Event || "Unknown") === event);
}

function filterRowsByHealthStatus(rows, healthStatus) {
    if (!healthStatus || healthStatus === "All") {
        return rows;
    }

    return rows.filter((row) => (row.Health_Status || "Unknown") === healthStatus);
}

function filterRowsByTimeRange(rows, timeRange) {
    const dayCount = {
        "Last 24 Hours": 1,
        "Last 7 Days": 7,
        "Last 30 Days": 30,
    }[timeRange] || 30;

    if (!dayCount || rows.length === 0) {
        return rows;
    }

    const totalRows = rows.length;
    const limit = Math.max(1, Math.floor(totalRows * (dayCount / 30)));

    return rows.slice(0, limit);
}

module.exports = {
    loadCSV,
    filterRowsByApplication,
    filterRowsByRegion,
    filterRowsByEnvironment,
    filterRowsBySeverity,
    filterRowsByEvent,
    filterRowsByHealthStatus,
    filterRowsByTimeRange,
};