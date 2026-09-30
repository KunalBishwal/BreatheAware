import axios, { AxiosInstance } from "axios";
import { Timestamp } from "firebase-admin/firestore";
import { config } from "../config/env";
import { Measurement, Sensor, Station } from "../types";
import { logger } from "../utils/logger";
import { normalizeParameterName } from "./aqi.service";

export interface CPCBRecord {
  country?: string;
  state?: string;
  city?: string;
  station?: string;
  last_update?: string;
  latitude?: string | number;
  longitude?: string | number;
  pollutant_id?: string;
  pollutant_min?: string | number;
  pollutant_max?: string | number;
  pollutant_avg?: string | number;
}

export interface CPCBResponse {
  records?: CPCBRecord[];
  total?: number;
  count?: number;
}

export interface ParsedCPCBStation {
  station: Station;
  sensors: Sensor[];
  measurements: Measurement[];
  overallAqi: number;
  dominantPollutant: string;
}

export const CPCB_PARAM_ID_MAP: Record<string, number> = {
  pm25: 2,
  pm10: 3,
  o3: 4,
  co: 1,
  no2: 7,
  so2: 8,
  nh3: 17,
};

export class CPCBService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.cpcb.baseUrl,
      timeout: 25000,
    });
  }

  /**
   * Helper to slugify station name into clean doc ID
   */
  createStationSlug(stationName: string): string {
    return (
      "cpcb-" +
      stationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );
  }

  /**
   * Fetch raw CPCB real-time AQI records from data.gov.in
   */
  async fetchRecords(limit = 1000): Promise<CPCBRecord[]> {
    if (!config.cpcb.apiKey) {
      logger.warn(
        "CPCB_API_KEY is not set. Data.gov.in requests will require a valid API key."
      );
      return [];
    }

    try {
      const response = await this.client.get<CPCBResponse>("", {
        params: {
          "api-key": config.cpcb.apiKey,
          format: "json",
          "filters[country]": "India",
          limit,
        },
      });

      return response.data?.records || [];
    } catch (error) {
      logger.error("Failed to fetch CPCB data from data.gov.in", error);
      throw error;
    }
  }

  /**
   * Parse date string from CPCB (format like "30-09-2024 18:00:00" or ISO)
   */
  private parseTimestamp(dateStr?: string): Timestamp {
    if (!dateStr) return Timestamp.now();

    // Check DD-MM-YYYY HH:mm:ss format
    const ddmmyyyyMatch = dateStr.match(
      /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
    );
    if (ddmmyyyyMatch) {
      const [, day, month, year, hour, min, sec] = ddmmyyyyMatch;
      const parsed = new Date(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(min),
          Number(sec)
        )
      );
      if (!isNaN(parsed.getTime())) {
        return Timestamp.fromDate(parsed);
      }
    }

    const standardDate = new Date(dateStr);
    if (!isNaN(standardDate.getTime())) {
      return Timestamp.fromDate(standardDate);
    }

    return Timestamp.now();
  }

  /**
   * Parse flat CPCB records into grouped Stations, Sensors, and Measurements
   * CRITICAL PARSING LOGIC:
   * - pollutant_avg is ALREADY an AQI sub-index
   * - Overall Station AQI = MAX(pollutant_avg) across all pollutants
   * - Dominant Pollutant = Pollutant with the highest pollutant_avg
   */
  groupAndParseRecords(records: CPCBRecord[]): ParsedCPCBStation[] {
    const stationMap = new Map<string, {
      rawStation: string;
      city: string;
      state: string;
      lat: number;
      lng: number;
      timestamp: Timestamp;
      pollutants: Array<{
        name: string;
        paramId: number;
        avg: number;
        min: number;
        max: number;
      }>;
    }>();

    for (const rec of records) {
      const stationName = rec.station?.trim();
      if (!stationName) continue;

      const stationSlug = this.createStationSlug(stationName);
      const lat = typeof rec.latitude === "number" ? rec.latitude : parseFloat(rec.latitude || "0");
      const lng = typeof rec.longitude === "number" ? rec.longitude : parseFloat(rec.longitude || "0");
      const city = rec.city?.trim() || "Unknown";
      const state = rec.state?.trim() || "India";
      const ts = this.parseTimestamp(rec.last_update);

      if (!stationMap.has(stationSlug)) {
        stationMap.set(stationSlug, {
          rawStation: stationName,
          city,
          state,
          lat,
          lng,
          timestamp: ts,
          pollutants: [],
        });
      }

      const entry = stationMap.get(stationSlug)!;

      if (rec.pollutant_id && rec.pollutant_avg !== undefined && rec.pollutant_avg !== null && rec.pollutant_avg !== "NA") {
        const rawAvg = typeof rec.pollutant_avg === "number" ? rec.pollutant_avg : parseFloat(rec.pollutant_avg);
        if (!isNaN(rawAvg)) {
          const paramName = normalizeParameterName(rec.pollutant_id);
          const paramId = CPCB_PARAM_ID_MAP[paramName] || 0;
          const rawMin = parseFloat(String(rec.pollutant_min || rawAvg)) || rawAvg;
          const rawMax = parseFloat(String(rec.pollutant_max || rawAvg)) || rawAvg;

          entry.pollutants.push({
            name: paramName,
            paramId,
            avg: Math.round(rawAvg),
            min: Math.round(rawMin),
            max: Math.round(rawMax),
          });
        }
      }
    }

    const parsedResults: ParsedCPCBStation[] = [];

    for (const [stationId, data] of stationMap.entries()) {
      const stationDoc: Station = {
        id: stationId,
        name: data.rawStation,
        city: data.city,
        state: data.state,
        country: "India",
        countryCode: "IN",
        coordinates: { lat: data.lat, lng: data.lng },
        timezone: "Asia/Kolkata",
        provider: "cpcb",
        isMonitor: true,
        lastUpdated: data.timestamp,
        clusterId: null,
      };

      let maxAqi = 0;
      let dominant = "pm25";

      const sensors: Sensor[] = [];
      const measurements: Measurement[] = [];

      for (const p of data.pollutants) {
        if (p.avg > maxAqi) {
          maxAqi = p.avg;
          dominant = p.name;
        }

        const sensorId = `${stationId}_${p.name}`;
        sensors.push({
          id: sensorId,
          stationId,
          parameterId: p.paramId,
          parameterName: p.name,
          units: p.name === "co" ? "mg/m³" : "µg/m³",
          latestValue: p.avg,
          latestTimestamp: data.timestamp,
        });

        // Since CPCB returns AQI sub-indices directly, value is the subindex and aqiValue is identical
        measurements.push({
          sensorId,
          stationId,
          parameterName: p.name,
          value: p.avg,
          aqiValue: p.avg,
          timestamp: data.timestamp,
          period: "hourly",
        });
      }

      parsedResults.push({
        station: stationDoc,
        sensors,
        measurements,
        overallAqi: maxAqi,
        dominantPollutant: dominant,
      });
    }

    return parsedResults;
  }
}

export const cpcbService = new CPCBService();
