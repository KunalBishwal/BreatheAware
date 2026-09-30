import axios, { AxiosInstance } from "axios";
import { config } from "../config/env";
import { ClusterRequest, ClusterResponse } from "../types";
import { logger } from "../utils/logger";

export class MLService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.mlService.baseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * Health check for ML microservice
   */
  async checkHealth(): Promise<boolean> {
    try {
      const res = await this.client.get("/health");
      return res.status === 200 && res.data?.status === "ok";
    } catch {
      return false;
    }
  }

  /**
   * Send 30-day pollutant averages to FastAPI ML service for KMeans clustering
   */
  async clusterStations(payload: ClusterRequest): Promise<ClusterResponse | null> {
    try {
      logger.info(`Sending ${payload.stations.length} stations to ML microservice for clustering...`);
      const response = await this.client.post<ClusterResponse>("/cluster", payload);
      logger.info(
        `Clustering successful. Received assignments for ${Object.keys(response.data?.assignments || {}).length} stations.`
      );
      return response.data;
    } catch (error) {
      logger.error("Failed to execute ML clustering request", error, {
        url: `${config.mlService.baseUrl}/cluster`,
      });
      return null;
    }
  }
}

export const mlService = new MLService();
