const fs = require("fs");
const path = require("path");

const testsDir = path.join(__dirname, "lib", "tests");

if (!fs.existsSync(testsDir)) {
  console.error("Tests directory not found in lib/tests. Run 'npm run build' first.");
  process.exit(1);
}

const testFiles = fs.readdirSync(testsDir).filter((f) => f.endsWith(".test.js"));

console.log(`Discovered ${testFiles.length} test suites.`);

for (const file of testFiles) {
  const filePath = path.join(testsDir, file);
  console.log(`\n========================================`);
  console.log(`Executing: ${file}`);
  console.log(`========================================`);
  require(filePath);
}

console.log("\n========================================");
console.log("ALL TESTS COMPLETED SUCCESSFULLY!");
console.log("========================================\n");
