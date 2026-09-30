import { onSchedule } from "firebase-functions/v2/scheduler";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import {
  calculateAqi,
  HEALTH_ADVISORIES,
} from "../services/aqi.service";
import {
  openaqService,
  OpenAQSensor,
} from "../services/openaq.service";
import { Alert, Measurement, Sensor, Station } from "../types";
import { FirestoreBatcher } from "../utils/batcher";
import { logger } from "../utils/logger";

function formatHourlyDocId(sensorId: string, date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const hh = String(date.getUTCHours()).padStart(2, "0");
  return `${sensorId}_${yyyy}-${mm}-${dd}-${hh}`;
}

export async function processOpenAQSync(): Promise<{
  stationsCount: number;
  sensorsCount: number;
  measurementsCount: number;
  alertsCount: number;
}> {
  logger.info("Starting OpenAQ hourly synchronization...");
  const batcher = new FirestoreBatcher({ maxBatchSize: 450 });

  let stationsCount = 0;
  let sensorsCount = 0;
  let measurementsCount = 0;
  let alertsCount = 0;

  try {
    // 1. Fetch Indian stations (paginated, 500ms delay handled in service)
    const locations = await openaqService.fetchIndianStations(5, 100);
    logger.info(`Fetched ${locations.length} locations from OpenAQ v3.`);

    const now = new Date();
    const alertHourTag = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}-${String(
      now.getUTCHours()
    ).padStart(2, "0")}`;

    for (const loc of locations) {
      const stationDoc = openaqService.mapLocationToStation(loc);
      const stationRef = db.collection("stations").doc(stationDoc.id);

      await batcher.set<Station>(stationRef, stationDoc, { merge: true });
      stationsCount++;

      // 2. Fetch or extract sensors
      let sensorsList: OpenAQSensor[] = loc.sensors || [];
      if (!sensorsList || sensorsList.length === 0) {
        try {
          sensorsList = await openaqService.getLocationSensors(loc.id);
        } catch (err) {
          logger.warn(`Could not fetch sensors for location ${loc.id}`, {
            error: String(err),
          });
          continue;
        }
      }

      // Track max AQI at this station for potential severe alert
      let stationMaxAqi = 0;

      for (const s of sensorsList) {
        const sensorModel = openaqService.mapSensorToModel(stationDoc.id, s);
        if (!sensorModel) continue;

        const sensorRef = db.collection("sensors").doc(sensorModel.id);
        await batcher.set<Sensor>(sensorRef, sensorModel, { merge: true });
        sensorsCount++;

        // 3. Process latest measurement
        if (sensorModel.latestValue !== null && !isNaN(sensorModel.latestValue)) {
          const rawValue = sensorModel.latestValue;
          const aqiResult = calculateAqi(sensorModel.parameterName, rawValue);
          const measDate = sensorModel.latestTimestamp
            ? sensorModel.latestTimestamp.toDate()
            : now;

          if (aqiResult.aqiValue > stationMaxAqi) {
            stationMaxAqi = aqiResult.aqiValue;
          }

          const measDocId = formatHourlyDocId(sensorModel.id, measDate);
          const measDoc: Measurement = {
            sensorId: sensorModel.id,
            stationId: stationDoc.id,
            parameterName: sensorModel.parameterName,
            value: rawValue,
            aqiValue: aqiResult.aqiValue,
            timestamp: Timestamp.fromDate(measDate),
            period: "hourly",
          };

          const measRef = db.collection("measurements").doc(measDocId);
          await batcher.set<Measurement>(measRef, measDoc, { merge: true });
          measurementsCount++;
        }
      }

      // 4. Alert Check: If computed station AQI >= 401 ("Severe")
      if (stationMaxAqi >= 401) {
        const alertId = `alert_openaq_${stationDoc.id}_${alertHourTag}`;
        const alertDoc: Alert = {
          stationId: stationDoc.id,
          stationName: stationDoc.name,
          city: stationDoc.city,
          aqiValue: stationMaxAqi,
          category: "Severe",
          message: HEALTH_ADVISORIES.Severe,
          triggeredAt: Timestamp.now(),
          isActive: true,
        };

        const alertRef = db.collection("alerts").doc(alertId);
        await batcher.set<Alert>(alertRef, alertDoc, { merge: true });
        alertsCount++;
      }
    }

    // Flush any pending batched writes
    await batcher.commit();
    logger.info("OpenAQ synchronization completed successfully.", {
      stationsCount,
      sensorsCount,
      measurementsCount,
      alertsCount,
    });

    return { stationsCount, sensorsCount, measurementsCount, alertsCount };
  } catch (error) {
    logger.error("OpenAQ synchronization failed", error);
    await batcher.commit(); // Ensure already batched records are not lost
    throw error;
  }
}

/**
 * Scheduled Cloud Function v2: Runs every hour at :00 UTC
 */
export const syncOpenAQ = onSchedule(
  {
    schedule: "0 * * * *",
    timeZone: "UTC",
    memory: "1GiB",
    timeoutSeconds: 540,
  },
  async () => {
    await processOpenAQSync();
  }
);
