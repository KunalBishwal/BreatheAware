import { onSchedule } from "firebase-functions/v2/scheduler";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { HEALTH_ADVISORIES } from "../services/aqi.service";
import { cpcbService } from "../services/cpcb.service";
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

export async function processCPCBSync(): Promise<{
  stationsCount: number;
  sensorsCount: number;
  measurementsCount: number;
  alertsCount: number;
}> {
  logger.info("Starting CPCB hourly synchronization from data.gov.in...");
  const batcher = new FirestoreBatcher({ maxBatchSize: 450 });

  let stationsCount = 0;
  let sensorsCount = 0;
  let measurementsCount = 0;
  let alertsCount = 0;

  try {
    const rawRecords = await cpcbService.fetchRecords(1000);
    logger.info(`Fetched ${rawRecords.length} raw records from CPCB API.`);

    if (rawRecords.length === 0) {
      logger.info("No records returned from CPCB API.");
      return { stationsCount, sensorsCount, measurementsCount, alertsCount };
    }

    const parsedStations = cpcbService.groupAndParseRecords(rawRecords);
    logger.info(`Grouped CPCB data into ${parsedStations.length} distinct stations.`);

    const now = new Date();
    const alertHourTag = `${now.getUTCFullYear()}-${String(
      now.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(now.getUTCDate()).padStart(2, "0")}-${String(
      now.getUTCHours()
    ).padStart(2, "0")}`;

    for (const parsed of parsedStations) {
      // 1. Upsert Station
      const stationRef = db.collection("stations").doc(parsed.station.id);
      await batcher.set<Station>(stationRef, parsed.station, { merge: true });
      stationsCount++;

      // 2. Upsert Sensors
      for (const sensor of parsed.sensors) {
        const sensorRef = db.collection("sensors").doc(sensor.id);
        await batcher.set<Sensor>(sensorRef, sensor, { merge: true });
        sensorsCount++;
      }

      // 3. Upsert Measurements
      for (const meas of parsed.measurements) {
        const measDate = meas.timestamp ? meas.timestamp.toDate() : now;
        const docId = formatHourlyDocId(meas.sensorId, measDate);
        const measRef = db.collection("measurements").doc(docId);
        await batcher.set<Measurement>(measRef, meas, { merge: true });
        measurementsCount++;
      }

      // 4. Alert Check: If overall AQI >= 401 ("Severe")
      if (parsed.overallAqi >= 401) {
        const alertId = `alert_cpcb_${parsed.station.id}_${alertHourTag}`;
        const alertDoc: Alert = {
          stationId: parsed.station.id,
          stationName: parsed.station.name,
          city: parsed.station.city,
          aqiValue: parsed.overallAqi,
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

    await batcher.commit();
    logger.info("CPCB synchronization completed successfully.", {
      stationsCount,
      sensorsCount,
      measurementsCount,
      alertsCount,
    });

    return { stationsCount, sensorsCount, measurementsCount, alertsCount };
  } catch (error) {
    logger.error("CPCB synchronization failed", error);
    await batcher.commit();
    throw error;
  }
}

/**
 * Scheduled Cloud Function v2: Runs every hour at :30 UTC to offset load
 */
export const syncCPCB = onSchedule(
  {
    schedule: "30 * * * *",
    timeZone: "UTC",
    memory: "1GiB",
    timeoutSeconds: 540,
  },
  async () => {
    await processCPCBSync();
  }
);
