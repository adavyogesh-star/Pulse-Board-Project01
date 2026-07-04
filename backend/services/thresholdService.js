function getStatus(metric, value) {

    switch (metric) {

        case "cpu":

            if (value > 90) return "Critical";
            if (value >= 70) return "Warning";
            return "Healthy";

        case "memory":

            if (value > 90) return "Critical";
            if (value >= 75) return "Warning";
            return "Healthy";

        case "response":

            if (value > 500) return "Critical";
            if (value >= 300) return "Warning";
            return "Healthy";

        case "availability":

            if (value < 98) return "Critical";
            if (value < 99) return "Warning";
            return "Healthy";

        case "error":

            if (value > 5) return "Critical";
            if (value > 1) return "Warning";
            return "Healthy";

        default:
            return "Healthy";

    }

}

module.exports = {
    getStatus
};