function getStatus(metric, value) {

    switch (metric) {

        case "cpu":

            if (value > 85) return "Critical";
            if (value >= 70) return "Warning";
            return "Healthy";

        case "memory":

            if (value > 85) return "Critical";
            if (value >= 75) return "Warning";
            return "Healthy";

        case "response":

            if (value > 400) return "Critical";
            if (value >= 300) return "Warning";
            return "Healthy";

        case "availability":

            if (value < 99) return "Critical";
            if (value < 99.5) return "Warning";
            return "Healthy";

        case "error":

            if (value > 3) return "Critical";
            if (value > 1) return "Warning";
            return "Healthy";

        default:
            return "Healthy";

    }

}

module.exports = {
    getStatus
};