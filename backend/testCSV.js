const { loadCSV } = require("./services/csvService");

const data = loadCSV();

console.log("Total Rows:", data.length);

console.log("\nFirst Record:\n");

console.log(data[0]);

console.log("\nApplications:");

const applications = [...new Set(data.map(row => row.Application))];

console.log(applications);
