const { getStatus } = require("./thresholdService");

function average(data, field) {

    const values = data
        .map(row => Number(row[field]))
        .filter(value => !isNaN(value));

    if (values.length === 0)
        return 0;

    const total = values.reduce((sum, value) => sum + value, 0);

    return Number((total / values.length).toFixed(2));
}

function sum(data, field) {

    return data.reduce((total, row) => {

        return total + (Number(row[field]) || 0);

    }, 0);

}

function calculateP95FromValues(values) {

    const sorted = values
        .filter(value => !isNaN(value))
        .sort((a, b) => a - b);

    if (sorted.length === 0)
        return 0;

    const index = Math.floor(sorted.length * 0.95);

    return sorted[index];

}

function calculateP95(data) {

    const values = data
        .map(row => Number(row["P95_Latency_ms"]))
        .filter(value => !isNaN(value));

    return calculateP95FromValues(values);

}

function calculateApplicationMetrics(data) {

    const grouped = data.reduce((accumulator, row) => {

        const application = row.Application || "Unknown";

        if (!accumulator[application]) {
            accumulator[application] = {
                application,
                records: 0,
                responseTimeSum: 0,
                cpuSum: 0,
                memorySum: 0,
                availabilitySum: 0,
                errorRateSum: 0,
                throughputSum: 0,
                http4xxSum: 0,
                http5xxSum: 0,
                p95Values: []
            };
        }

        const entry = accumulator[application];
        entry.records += 1;
        entry.responseTimeSum += Number(row["Response_Time_ms"]) || 0;
        entry.cpuSum += Number(row["CPU_Usage_%"]) || 0;
        entry.memorySum += Number(row["Memory_Usage_%"]) || 0;
        entry.availabilitySum += Number(row["Availability_%"]) || 0;
        entry.errorRateSum += Number(row["Error_Rate_%"]) || 0;
        entry.throughputSum += Number(row["Request_Throughput_RPM"]) || 0;
        entry.http4xxSum += Number(row["HTTP_4XX_Count"]) || 0;
        entry.http5xxSum += Number(row["HTTP_5XX_Count"]) || 0;
        entry.p95Values.push(Number(row["P95_Latency_ms"]) || 0);

        return accumulator;
    }, {});

    return Object.values(grouped).map((entry) => {
        const averageResponseTime = Number((entry.responseTimeSum / entry.records).toFixed(2));
        const averageCPU = Number((entry.cpuSum / entry.records).toFixed(2));
        const averageMemory = Number((entry.memorySum / entry.records).toFixed(2));
        const averageAvailability = Number((entry.availabilitySum / entry.records).toFixed(2));
        const averageErrorRate = Number((entry.errorRateSum / entry.records).toFixed(2));
        const averageThroughput = Number((entry.throughputSum / entry.records).toFixed(2));

        const health = {
            cpuStatus: getStatus("cpu", averageCPU),
            memoryStatus: getStatus("memory", averageMemory),
            responseStatus: getStatus("response", averageResponseTime),
            availabilityStatus: getStatus("availability", averageAvailability),
            errorStatus: getStatus("error", averageErrorRate)
        };

        const statuses = Object.values(health);
        const status = statuses.includes("Critical")
            ? "Critical"
            : statuses.includes("Warning")
                ? "Warning"
                : "Healthy";

        return {
            application: entry.application,
            records: entry.records,
            averageResponseTime,
            averageCPU,
            averageMemory,
            averageAvailability,
            averageErrorRate,
            averageThroughput,
            totalHTTP4XX: entry.http4xxSum,
            totalHTTP5XX: entry.http5xxSum,
            p95Latency: calculateP95FromValues(entry.p95Values),
            ...health,
            status
        };
    }).sort((a, b) => b.averageResponseTime - a.averageResponseTime);
}

function calculateMetrics(data) {

    return {

        totalApplications:
            [...new Set(data.map(row => row.Application))].length,

        totalRecords:
            data.length,

        averageResponseTime:
            average(data, "Response_Time_ms"),

        averageCPU:
            average(data, "CPU_Usage_%"),

        averageMemory:
            average(data, "Memory_Usage_%"),

        averageAvailability:
            average(data, "Availability_%"),

        averageErrorRate:
            average(data, "Error_Rate_%"),

        averageThroughput:
            average(data, "Request_Throughput_RPM"),

        totalHTTP4XX:
            sum(data, "HTTP_4XX_Count"),

        totalHTTP5XX:
            sum(data, "HTTP_5XX_Count"),

        p95Latency:
            calculateP95(data)

    };

}

function calculateTimeSeries(data) {
    const points = [];

    if (!data || data.length === 0) {
        return points;
    }

    const sorted = [...data].sort((a, b) => {
        const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : NaN;
        const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : NaN;
        return aTime - bTime;
    });
    const bucketCount = 12;
    const bucketSize = Math.max(1, Math.floor(sorted.length / bucketCount));

    for (let index = 0; index < bucketCount; index += 1) {
        const start = index * bucketSize;
        const end = start + bucketSize;
        const slice = sorted.slice(start, end);

        if (slice.length === 0) {
            continue;
        }

        const response = average(slice, "Response_Time_ms");
        const cpu = average(slice, "CPU_Usage_%");
        const memory = average(slice, "Memory_Usage_%");
        const availability = average(slice, "Availability_%");
        const errors = average(slice, "Error_Rate_%");

        // compute average timestamp for the bucket (if available) and include it
        const timestamps = slice
            .map(r => (r.timestamp instanceof Date ? r.timestamp.getTime() : null))
            .filter(t => t != null);

        const bucketTimestamp = timestamps.length > 0
            ? Math.round(timestamps.reduce((s, t) => s + t, 0) / timestamps.length)
            : null;

        points.push({
            label: bucketTimestamp ? new Date(bucketTimestamp).toISOString() : `T${index + 1}`,
            timestamp: bucketTimestamp,
            timestampISO: bucketTimestamp ? new Date(bucketTimestamp).toISOString() : null,
            response,
            cpu,
            memory,
            availability,
            errors,
        });
    }

    return points;
}

module.exports = {
    calculateMetrics,
    calculateApplicationMetrics,
    calculateTimeSeries
};