import { onRequest } from "firebase-functions/v2/https";
import { syncOpenAQ, processOpenAQSync } from "./triggers/sync.openaq";
import { syncCPCB, processCPCBSync } from "./triggers/sync.cpcb";
import { computeDailyAqi, processDailyAggregation } from "./triggers/compute.daily";
import { syncClusters, processClusterSync } from "./triggers/sync.clusters";

// Export Cloud Functions v2 Scheduled Triggers
export { syncOpenAQ, syncCPCB, computeDailyAqi, syncClusters };

// On-demand HTTP triggers for testing, manual synchronization, and CI/CD validation
export const triggerOpenAQSyncHttp = onRequest(
  { memory: "1GiB", timeoutSeconds: 540 },
  async (req, res) => {
    try {
      const result = await processOpenAQSync();
      res.status(200).json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  }
);

export const triggerCPCBSyncHttp = onRequest(
  { memory: "1GiB", timeoutSeconds: 540 },
  async (req, res) => {
    try {
      const result = await processCPCBSync();
      res.status(200).json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  }
);

export const triggerDailyAggregationHttp = onRequest(
  { memory: "1GiB", timeoutSeconds: 540 },
  async (req, res) => {
    try {
      const targetDate = req.query.date ? new Date(String(req.query.date)) : undefined;
      const count = await processDailyAggregation(targetDate);
      res.status(200).json({ status: "success", recordsAggregated: count });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  }
);

export const triggerClusterSyncHttp = onRequest(
  { memory: "1GiB", timeoutSeconds: 540 },
  async (req, res) => {
    try {
      const result = await processClusterSync();
      res.status(200).json({ status: "success", result });
    } catch (error) {
      res.status(500).json({ status: "error", message: (error as Error).message });
    }
  }
);

// Health check endpoint
export const healthCheck = onRequest((req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "BreatheAware-Firebase-Cloud-Functions-v2",
    timestamp: new Date().toISOString(),
  });
});

// Re-export services and utilities
export * from "./types";
export * from "./services/aqi.service";
export * from "./services/openaq.service";
export * from "./services/cpcb.service";
export * from "./services/ml.service";
export * from "./utils/batcher";
export * from "./utils/logger";
