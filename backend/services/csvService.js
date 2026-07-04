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

module.exports = { loadCSV };