import assert from "node:assert";
import { cpcbService, CPCBRecord } from "../src/services/cpcb.service";

console.log("Running CPCB service parser tests...");

const mockRecords: CPCBRecord[] = [
  {
    country: "India",
    state: "Delhi",
    city: "Delhi",
    station: "Anand Vihar, Delhi - DPCC",
    last_update: "30-09-2024 18:00:00",
    latitude: "28.6508",
    longitude: "77.3152",
    pollutant_id: "PM2.5",
    pollutant_min: "180",
    pollutant_max: "440",
    pollutant_avg: "415",
  },
  {
    country: "India",
    state: "Delhi",
    city: "Delhi",
    station: "Anand Vihar, Delhi - DPCC",
    last_update: "30-09-2024 18:00:00",
    latitude: "28.6508",
    longitude: "77.3152",
    pollutant_id: "PM10",
    pollutant_min: "150",
    pollutant_max: "380",
    pollutant_avg: "360",
  },
  {
    country: "India",
    state: "Delhi",
    city: "Delhi",
    station: "Anand Vihar, Delhi - DPCC",
    last_update: "30-09-2024 18:00:00",
    latitude: "28.6508",
    longitude: "77.3152",
    pollutant_id: "NO2",
    pollutant_min: "30",
    pollutant_max: "95",
    pollutant_avg: "78",
  },
  {
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    station: "Bandra, Mumbai - MPCB",
    last_update: "30-09-2024 18:00:00",
    latitude: "19.0596",
    longitude: "72.8295",
    pollutant_id: "PM2.5",
    pollutant_min: "50",
    pollutant_max: "110",
    pollutant_avg: "92",
  },
];

const parsed = cpcbService.groupAndParseRecords(mockRecords);

assert.strictEqual(parsed.length, 2, "Should group into 2 distinct stations");

// Station 1: Anand Vihar
const anandVihar = parsed.find((s) => s.station.name.includes("Anand Vihar"));
assert(anandVihar, "Anand Vihar station must exist");
assert.strictEqual(anandVihar.station.city, "Delhi");
assert.strictEqual(anandVihar.overallAqi, 415, "Overall AQI must be max pollutant_avg (415)");
assert.strictEqual(anandVihar.dominantPollutant, "pm25");
assert.strictEqual(anandVihar.sensors.length, 3, "Must have 3 sensors (PM2.5, PM10, NO2)");
assert.strictEqual(anandVihar.measurements.length, 3, "Must have 3 measurements");

// Station 2: Bandra
const bandra = parsed.find((s) => s.station.name.includes("Bandra"));
assert(bandra, "Bandra station must exist");
assert.strictEqual(bandra.station.city, "Mumbai");
assert.strictEqual(bandra.overallAqi, 92);
assert.strictEqual(bandra.dominantPollutant, "pm25");

console.log("CPCB service parser tests PASSED successfully!");
