const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

function loadCSV() {
    return new Promise((resolve, reject) => {

        const results = [];

        const filePath = path.join(
            __dirname,
            "../CSV File/PulseBoard_APM_14400_Dataset_With_HTTP_Status.csv"
        );

        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", reject);
    });
}

async function main() {
    const data = await loadCSV();

    console.log("Rows:", data.length);
    console.table(data.slice(0, 5));
}

main();