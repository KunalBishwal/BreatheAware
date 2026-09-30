import { onSchedule } from "firebase-functions/v2/scheduler";
import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { mlService } from "../services/ml.service";
import { Cluster, StationMLFeature } from "../types";
import { FirestoreBatcher } from "../utils/batcher";
import { logger } from "../utils/logger";

export async function processClusterSync(): Promise<{
  stationsClustered: number;
  clustersSaved: number;
}> {
  logger.info("Starting Weekly Station ML Clustering synchronization...");
  const batcher = new FirestoreBatcher({ maxBatchSize: 450 });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysTimestamp = Timestamp.fromDate(thirtyDaysAgo);

  // 1. Fetch all dailyAqi documents from past 30 days
  const dailySnapshot = await db
    .collection("dailyAqi")
    .where("date", ">=", thirtyDaysTimestamp)
    .get();

  logger.info(`Fetched ${dailySnapshot.docs.length} dailyAqi records from past 30 days.`);

  // Group by stationId
  const stationAveragesMap = new Map<
    string,
    {
      pm25: number[];
      pm10: number[];
      no2: number[];
      so2: number[];
      o3: number[];
      co: number[];
    }
  >();

  for (const doc of dailySnapshot.docs) {
    const data = doc.data();
    const stId = data.stationId;
    if (!stId) continue;

    if (!stationAveragesMap.has(stId)) {
      stationAveragesMap.set(stId, {
        pm25: [],
        pm10: [],
        no2: [],
        so2: [],
        o3: [],
        co: [],
      });
    }

    const entry = stationAveragesMap.get(stId)!;
    if (data.pm25Aqi !== null && data.pm25Aqi !== undefined) entry.pm25.push(data.pm25Aqi);
    if (data.pm10Aqi !== null && data.pm10Aqi !== undefined) entry.pm10.push(data.pm10Aqi);
    if (data.no2Aqi !== null && data.no2Aqi !== undefined) entry.no2.push(data.no2Aqi);
    if (data.so2Aqi !== null && data.so2Aqi !== undefined) entry.so2.push(data.so2Aqi);
    if (data.o3Aqi !== null && data.o3Aqi !== undefined) entry.o3.push(data.o3Aqi);
    if (data.coAqi !== null && data.coAqi !== undefined) entry.co.push(data.coAqi);
  }

  // Calculate averages
  const calcAvg = (arr: number[]): number | null =>
    arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;

  const stationFeatures: StationMLFeature[] = [];

  for (const [stId, vals] of stationAveragesMap.entries()) {
    stationFeatures.push({
      stationId: stId,
      pm25: calcAvg(vals.pm25),
      pm10: calcAvg(vals.pm10),
      no2: calcAvg(vals.no2),
      so2: calcAvg(vals.so2),
      o3: calcAvg(vals.o3),
      co: calcAvg(vals.co),
    });
  }

  // If dailyAqi was empty or limited, fall back to recent measurements to ensure features exist
  if (stationFeatures.length === 0) {
    logger.warn("No 30-day daily records found, pulling from active stations...");
    const stationsSnapshot = await db.collection("stations").get();
    for (const doc of stationsSnapshot.docs) {
      const data = doc.data();
      stationFeatures.push({
        stationId: doc.id,
        pm25: data.latestPm25 ?? 65,
        pm10: data.latestPm10 ?? 120,
        no2: data.latestNo2 ?? 45,
        so2: data.latestSo2 ?? 15,
        o3: data.latestO3 ?? 30,
        co: data.latestCo ?? 1.2,
      });
    }
  }

  if (stationFeatures.length === 0) {
    logger.warn("No stations found to cluster.");
    return { stationsClustered: 0, clustersSaved: 0 };
  }

  // 2. Call ML microservice
  const mlResponse = await mlService.clusterStations({
    stations: stationFeatures,
  });

  if (!mlResponse) {
    logger.error("Failed to receive response from ML clustering service.");
    return { stationsClustered: 0, clustersSaved: 0 };
  }

  let stationsClustered = 0;
  let clustersSaved = 0;

  // 3. Update station documents with clusterId
  for (const [stationId, clusterId] of Object.entries(mlResponse.assignments)) {
    const stationRef = db.collection("stations").doc(stationId);
    await batcher.update(stationRef, { clusterId });
    stationsClustered++;
  }

  // 4. Upsert clusters collection
  for (const [clusterKey, summary] of Object.entries(mlResponse.clusters)) {
    const clusterDoc: Cluster = {
      id: clusterKey,
      label: summary.label,
      centroid: summary.centroid,
      memberStations: summary.memberStations,
    };

    const clusterRef = db.collection("clusters").doc(clusterKey);
    await batcher.set<Cluster>(clusterRef, clusterDoc, { merge: true });
    clustersSaved++;
  }

  await batcher.commit();
  logger.info("Weekly clustering sync completed successfully.", {
    stationsClustered,
    clustersSaved,
  });

  return { stationsClustered, clustersSaved };
}

/**
 * Scheduled Cloud Function v2: Weekly on Sunday at 03:00 IST
 */
export const syncClusters = onSchedule(
  {
    schedule: "0 3 * * 0",
    timeZone: "Asia/Kolkata",
    memory: "1GiB",
    timeoutSeconds: 540,
  },
  async () => {
    await processClusterSync();
  }
);
