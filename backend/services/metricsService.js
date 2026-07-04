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

function calculateP95(data) {

    const values = data
        .map(row => Number(row["P95_Latency_ms"]))
        .filter(value => !isNaN(value))
        .sort((a, b) => a - b);

    if (values.length === 0)
        return 0;

    const index = Math.floor(values.length * 0.95);

    return values[index];

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

module.exports = {
    calculateMetrics
};