import { onSchedule } from "firebase-functions/v2/scheduler";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import {
  computeOverallAqi,
  normalizeParameterName,
} from "../services/aqi.service";
import { DailyAqi } from "../types";
import { FirestoreBatcher } from "../utils/batcher";
import { logger } from "../utils/logger";

export async function processDailyAggregation(targetDate?: Date): Promise<number> {
  logger.info("Starting Daily AQI Aggregation job...");
  const batcher = new FirestoreBatcher({ maxBatchSize: 450 });

  // Default to yesterday IST if targetDate is not supplied
  const baseDate = targetDate || new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const yesterday = new Date(baseDate.getTime() - dayMs);

  // Set start of day and end of day in UTC / IST boundaries
  const startOfDay = new Date(
    Date.UTC(
      yesterday.getUTCFullYear(),
      yesterday.getUTCMonth(),
      yesterday.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
  const endOfDay = new Date(
    Date.UTC(
      yesterday.getUTCFullYear(),
      yesterday.getUTCMonth(),
      yesterday.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  const yyyy = yesterday.getUTCFullYear();
  const mm = String(yesterday.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(yesterday.getUTCDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  logger.info(`Aggregating daily AQI for date: ${dateStr} (${startOfDay.toISOString()} to ${endOfDay.toISOString()})`);

  const startTimestamp = Timestamp.fromDate(startOfDay);
  const endTimestamp = Timestamp.fromDate(endOfDay);

  // 1. Fetch station metadata (id -> city)
  const stationsSnapshot = await db.collection("stations").get();
  const stationCityMap = new Map<string, string>();
  for (const doc of stationsSnapshot.docs) {
    const data = doc.data();
    stationCityMap.set(doc.id, data.city || "Unknown");
  }

  // 2. Fetch measurements within the 24 hour window
  const measurementsSnapshot = await db
    .collection("measurements")
    .where("timestamp", ">=", startTimestamp)
    .where("timestamp", "<=", endTimestamp)
    .get();

  logger.info(`Found ${measurementsSnapshot.docs.length} measurements to aggregate for ${dateStr}.`);

  // Group by stationId -> parameterName -> array of aqiValues
  const stationAggregates = new Map<
    string,
    Map<string, number[]>
  >();

  for (const doc of measurementsSnapshot.docs) {
    const data = doc.data();
    const stationId = data.stationId;
    const param = normalizeParameterName(data.parameterName || "");
    const val = data.aqiValue ?? data.value;

    if (!stationId || !param || val === null || val === undefined || isNaN(val)) {
      continue;
    }

    if (!stationAggregates.has(stationId)) {
      stationAggregates.set(stationId, new Map());
    }

    const paramMap = stationAggregates.get(stationId)!;
    if (!paramMap.has(param)) {
      paramMap.set(param, []);
    }
    paramMap.get(param)!.push(val);
  }

  let aggregatedCount = 0;

  for (const [stationId, paramMap] of stationAggregates.entries()) {
    const subIndices: Record<string, number | null> = {
      pm25: null,
      pm10: null,
      no2: null,
      so2: null,
      co: null,
      o3: null,
    };

    for (const [param, values] of paramMap.entries()) {
      if (values.length > 0) {
        const sum = values.reduce((acc, curr) => acc + curr, 0);
        const avg = Math.round(sum / values.length);
        if (param in subIndices) {
          subIndices[param] = avg;
        }
      }
    }

    // Determine overall AQI and dominant pollutant
    const { overallAqi, dominantPollutant, category } = computeOverallAqi(subIndices);

    const docId = `${stationId}_${dateStr}`;
    const city = stationCityMap.get(stationId) || "Unknown";

    const dailyDoc: DailyAqi = {
      stationId,
      city,
      date: Timestamp.fromDate(startOfDay),
      overallAqi,
      dominantPollutant,
      pm25Aqi: subIndices.pm25,
      pm10Aqi: subIndices.pm10,
      no2Aqi: subIndices.no2,
      so2Aqi: subIndices.so2,
      coAqi: subIndices.co,
      o3Aqi: subIndices.o3,
      category,
    };

    const dailyRef = db.collection("dailyAqi").doc(docId);
    await batcher.set<DailyAqi>(dailyRef, dailyDoc, { merge: true });
    aggregatedCount++;
  }

  await batcher.commit();
  logger.info(`Daily aggregation completed. Stored ${aggregatedCount} records for ${dateStr}.`);
  return aggregatedCount;
}

/**
 * Scheduled Cloud Function v2: Daily at 02:00 IST
 */
export const computeDailyAqi = onSchedule(
  {
    schedule: "0 2 * * *",
    timeZone: "Asia/Kolkata",
    memory: "1GiB",
    timeoutSeconds: 540,
  },
  async () => {
    await processDailyAggregation();
  }
);
