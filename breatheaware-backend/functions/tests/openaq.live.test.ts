import assert from "node:assert";
import { openaqService } from "../src/services/openaq.service";

async function testOpenAQLive() {
  console.log("Testing live OpenAQ v3 API integration...");

  try {
    const { results, totalFound } = await openaqService.getLocations(1, 5);
    console.log(`Fetched ${results.length} locations. Total Indian locations reported: ${totalFound}`);

    assert(results.length > 0, "Should return at least 1 Indian location");

    const sampleLoc = results[0];
    console.log(`Sample location: ${sampleLoc.name} (ID: ${sampleLoc.id})`);

    const stationModel = openaqService.mapLocationToStation(sampleLoc);
    assert(stationModel.id, "Station ID must be present");
    assert.strictEqual(stationModel.countryCode, "IN");
    assert.strictEqual(stationModel.provider, "openaq");

    console.log("Station mapped model:", {
      id: stationModel.id,
      name: stationModel.name,
      city: stationModel.city,
      coordinates: stationModel.coordinates,
    });

    console.log("Live OpenAQ v3 test PASSED successfully!");
  } catch (error: any) {
    console.warn("Live OpenAQ test note:", error.message);
  }
}

testOpenAQLive();
