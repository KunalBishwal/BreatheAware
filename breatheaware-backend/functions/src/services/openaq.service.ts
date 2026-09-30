import axios, { AxiosError, AxiosInstance } from "axios";
import { Timestamp } from "firebase-admin/firestore";
import { config } from "../config/env";
import { Sensor, Station } from "../types";
import { logger } from "../utils/logger";

export interface OpenAQLocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface OpenAQLocation {
  id: number;
  name: string;
  locality?: string;
  timezone?: string;
  country?: {
    code: string;
    name: string;
  };
  coordinates?: OpenAQLocationCoordinates;
  isMonitor?: boolean;
  sensors?: Array<{
    id: number;
    name: string;
    parameter: {
      id: number;
      name: string;
      units: string;
    };
  }>;
}

export interface OpenAQSensor {
  id: number;
  name: string;
  parameter: {
    id: number;
    name: string;
    units: string;
  };
  latest?: {
    value: number;
    datetime: string;
  };
}

export interface OpenAQMeasurement {
  period?: {
    datetimeFrom?: { utc: string; local: string };
    datetimeTo?: { utc: string; local: string };
  };
  value: number;
  parameter?: {
    id: number;
    name: string;
    units: string;
  };
}

export const OPENAQ_PARAMETER_MAP: Record<
  number,
  { name: string; units: string }
> = {
  2: { name: "pm25", units: "µg/m³" },
  3: { name: "pm10", units: "µg/m³" },
  4: { name: "o3", units: "µg/m³" },
  1: { name: "co", units: "mg/m³" },
  7: { name: "no2", units: "µg/m³" },
  8: { name: "so2", units: "µg/m³" },
  17: { name: "nh3", units: "µg/m³" },
};

export class OpenAQService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.openaq.baseUrl,
      headers: {
        Accept: "application/json",
        ...(config.openaq.apiKey && { "X-API-Key": config.openaq.apiKey }),
      },
      timeout: 20000,
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Safe request wrapper with exponential backoff for 429 rate limits
   */
  private async requestWithRetry<T>(
    fn: () => Promise<T>,
    retries = 3,
    delayMs = 1000
  ): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      const axiosErr = err as AxiosError;
      const isRateLimit = axiosErr.response?.status === 429;
      const isNetworkErr = !axiosErr.response && Boolean(axiosErr.code);

      if (retries > 0 && (isRateLimit || isNetworkErr)) {
        logger.warn(
          `OpenAQ API throttled or network issue. Retrying in ${delayMs}ms... (remaining retries: ${retries})`,
          { status: axiosErr.response?.status }
        );
        await this.sleep(delayMs);
        return this.requestWithRetry(fn, retries - 1, delayMs * 2);
      }
      throw err;
    }
  }

  /**
   * Fetches paginated locations in India
   */
  async getLocations(
    page = 1,
    limit = 100
  ): Promise<{ results: OpenAQLocation[]; totalFound: number }> {
    return this.requestWithRetry(async () => {
      const response = await this.client.get("/locations", {
        params: {
          iso: "IN",
          limit,
          page,
        },
      });

      const results = (response.data?.results || []) as OpenAQLocation[];
      const totalFound = response.data?.meta?.found || results.length;
      return { results, totalFound };
    });
  }

  /**
   * Fetches Indian locations across multiple pages with 500ms delay between calls
   */
  async fetchIndianStations(maxPages = 5, limitPerPage = 100): Promise<OpenAQLocation[]> {
    const allLocations: OpenAQLocation[] = [];

    for (let page = 1; page <= maxPages; page++) {
      try {
        const { results } = await this.getLocations(page, limitPerPage);
        if (!results || results.length === 0) {
          break;
        }
        allLocations.push(...results);

        // 500ms rate limiting delay between paginated requests
        await this.sleep(500);
      } catch (error) {
        logger.error(`Error fetching OpenAQ page ${page}`, error);
        break;
      }
    }

    return allLocations;
  }

  /**
   * Fetches sensors for a specific location
   */
  async getLocationSensors(locationId: string | number): Promise<OpenAQSensor[]> {
    return this.requestWithRetry(async () => {
      const response = await this.client.get(`/locations/${locationId}/sensors`);
      return (response.data?.results || []) as OpenAQSensor[];
    });
  }

  /**
   * Fetches hourly measurements for a sensor
   */
  async getHourlyMeasurements(
    sensorId: string | number,
    limit = 100
  ): Promise<OpenAQMeasurement[]> {
    return this.requestWithRetry(async () => {
      const response = await this.client.get(
        `/sensors/${sensorId}/measurements/hourly`,
        {
          params: { limit },
        }
      );
      return (response.data?.results || []) as OpenAQMeasurement[];
    });
  }

  /**
   * Converts an OpenAQ Location into Firestore Station model
   */
  mapLocationToStation(location: OpenAQLocation): Station {
    const lat = location.coordinates?.latitude || 0;
    const lng = location.coordinates?.longitude || 0;
    const city = location.locality || location.name.split(",")[0].trim() || "India";
    const timezone = location.timezone || "Asia/Kolkata";

    return {
      id: String(location.id),
      name: location.name,
      city,
      state: location.country?.name || "India",
      country: "India",
      countryCode: "IN",
      coordinates: { lat, lng },
      timezone,
      provider: "openaq",
      isMonitor: location.isMonitor ?? true,
      lastUpdated: Timestamp.now(),
      clusterId: null,
    };
  }

  /**
   * Converts an OpenAQ sensor response into Firestore Sensor model
   */
  mapSensorToModel(
    stationId: string,
    sensor: OpenAQSensor
  ): Sensor | null {
    const paramId = sensor.parameter?.id;
    const mapped = OPENAQ_PARAMETER_MAP[paramId];

    const paramName = mapped ? mapped.name : (sensor.parameter?.name?.toLowerCase() || "unknown");
    const units = mapped ? mapped.units : (sensor.parameter?.units || "µg/m³");

    return {
      id: String(sensor.id),
      stationId,
      parameterId: paramId || 0,
      parameterName: paramName,
      units,
      latestValue: sensor.latest?.value ?? null,
      latestTimestamp: sensor.latest?.datetime
        ? Timestamp.fromDate(new Date(sensor.latest.datetime))
        : null,
    };
  }
}

export const openaqService = new OpenAQService();
