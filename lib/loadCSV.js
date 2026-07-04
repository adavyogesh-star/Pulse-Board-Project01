const fs = require("fs");
const Papa = require("papaparse");
const path = require("path");

function loadCSV() {
    return new Promise((resolve, reject) => {

        const filePath = path.join(
            __dirname,
            "../CSV File/PulseBoard_APM_14400_Dataset_With_HTTP_Status.csv"
        );

        fs.readFile(filePath, "utf8", (err, fileData) => {

            if (err) {
                reject(err);
                return;
            }

            const parsed = Papa.parse(fileData, {
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true
            });

            resolve(parsed.data);
        });
    });
}

async function main() {
    try {
        const data = await loadCSV();

        console.log("Total Rows:", data.length);
        console.table(data.slice(0, 5));

    } catch (err) {
        console.error(err);
    }
}

main();