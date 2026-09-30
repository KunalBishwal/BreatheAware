import assert from "node:assert";
import {
  calculateAqi,
  computeOverallAqi,
  HEALTH_ADVISORIES,
  normalizeParameterName,
} from "../src/services/aqi.service";

console.log("Running AQI calculation engine tests...");

// Test parameter name normalization
assert.strictEqual(normalizeParameterName("PM2.5"), "pm25");
assert.strictEqual(normalizeParameterName("pm10"), "pm10");
assert.strictEqual(normalizeParameterName("Ozone"), "o3");
assert.strictEqual(normalizeParameterName("NO2"), "no2");

// Test PM2.5 breakpoints
// 0 - 30 -> 0 - 50
const pm25Good = calculateAqi("pm25", 15);
assert.strictEqual(pm25Good.category, "Good");
assert.strictEqual(pm25Good.aqiValue, 25);

// 31 - 60 -> 51 - 100
const pm25Sat = calculateAqi("pm25", 45);
assert.strictEqual(pm25Sat.category, "Satisfactory");
assert.strictEqual(pm25Sat.aqiValue, 75);

// 61 - 90 -> 101 - 200
const pm25Mod = calculateAqi("pm25", 75);
assert.strictEqual(pm25Mod.category, "Moderate");
assert.strictEqual(pm25Mod.aqiValue, 149);

// 91 - 120 -> 201 - 300
const pm25Poor = calculateAqi("pm25", 105);
assert.strictEqual(pm25Poor.category, "Poor");
assert.strictEqual(pm25Poor.aqiValue, 249);

// 121 - 250 -> 301 - 400
const pm25VeryPoor = calculateAqi("pm25", 185);
assert.strictEqual(pm25VeryPoor.category, "Very Poor");
assert.strictEqual(pm25VeryPoor.aqiValue, 350);

// 251 - 500 -> 401 - 500
const pm25Severe = calculateAqi("pm25", 350);
assert.strictEqual(pm25Severe.category, "Severe");
assert(pm25Severe.aqiValue >= 401 && pm25Severe.aqiValue <= 500);

// Above 500
const pm25Extreme = calculateAqi("pm25", 650);
assert.strictEqual(pm25Extreme.category, "Severe");
assert.strictEqual(pm25Extreme.aqiValue, 500);

// Test PM10 calculation
const pm10Mod = calculateAqi("pm10", 175);
assert.strictEqual(pm10Mod.category, "Moderate");
assert.strictEqual(pm10Mod.aqiValue, 150);

// Test overall AQI computation
const overall = computeOverallAqi({
  pm25: 149,
  pm10: 85,
  no2: 45,
  so2: 20,
  co: 50,
  o3: 60,
});
assert.strictEqual(overall.overallAqi, 149);
assert.strictEqual(overall.dominantPollutant, "pm25");
assert.strictEqual(overall.category, "Moderate");

// Test severe overall AQI
const severeOverall = computeOverallAqi({
  pm25: 420,
  pm10: 310,
  no2: 120,
});
assert.strictEqual(severeOverall.overallAqi, 420);
assert.strictEqual(severeOverall.dominantPollutant, "pm25");
assert.strictEqual(severeOverall.category, "Severe");
assert(HEALTH_ADVISORIES.Severe.includes("Stay indoors"));

console.log("All AQI calculation engine tests PASSED successfully!");
