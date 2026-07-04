const { getStatus } = require("./thresholdService");

function calculateHealth(metrics) {

    return {

        cpuStatus:
            getStatus("cpu", metrics.averageCPU),

        memoryStatus:
            getStatus("memory", metrics.averageMemory),

        responseStatus:
            getStatus("response", metrics.averageResponseTime),

        availabilityStatus:
            getStatus("availability", metrics.averageAvailability),

        errorStatus:
            getStatus("error", metrics.averageErrorRate)

    };

}

module.exports = {
    calculateHealth
};