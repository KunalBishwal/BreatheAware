import type { Timestamp } from "firebase-admin/firestore";

export type AQICategory =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";

// Collection: stations
// Doc ID: OpenAQ locationId (string) OR CPCB station slug
export interface Station {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  countryCode: string; // e.g., "IN"
  coordinates: { lat: number; lng: number };
  timezone: string;
  provider: "openaq" | "cpcb";
  isMonitor: boolean;
  lastUpdated: Timestamp;
  clusterId: string | null; // Assigned by ML service
}

// Collection: sensors
// Doc ID: OpenAQ sensorId (string) OR generated CPCB ID
export interface Sensor {
  id: string;
  stationId: string;
  parameterId: number; // PM2.5=2, PM10=3, O3=4, NO2=7, SO2=8, CO=1, NH3=17
  parameterName: string; // "pm25", "pm10", "no2", "so2", "co", "o3", "nh3"
  units: string; // "µg/m³" or "mg/m³"
  latestValue: number | null;
  latestTimestamp: Timestamp | null;
}

// Collection: measurements (High write volume - use batched writes)
// Doc ID: {sensorId}_{YYYY-MM-DD-HH}
export interface Measurement {
  sensorId: string;
  stationId: string;
  parameterName: string;
  value: number; // Raw concentration
  aqiValue: number | null; // Computed sub-index AQI
  timestamp: Timestamp;
  period: "hourly" | "daily";
}

// Collection: dailyAqi
// Doc ID: {stationId}_{YYYY-MM-DD}
export interface DailyAqi {
  stationId: string;
  city: string;
  date: Timestamp;
  overallAqi: number;
  dominantPollutant: string;
  pm25Aqi: number | null;
  pm10Aqi: number | null;
  no2Aqi: number | null;
  so2Aqi: number | null;
  coAqi: number | null;
  o3Aqi: number | null;
  category: AQICategory;
}

// Collection: alerts
// Doc ID: Auto-generated
export interface Alert {
  stationId: string;
  stationName: string;
  city: string;
  aqiValue: number;
  category: "Severe"; // Only severe triggers alerts
  message: string; // Health advisory text
  triggeredAt: Timestamp;
  isActive: boolean;
}

// Collection: clusters
// Doc ID: cluster-0, cluster-1, etc.
export interface Cluster {
  id: string;
  label: string; // Auto-assigned or mapped (e.g., "Industrial")
  centroid: Record<string, number>; // e.g., { pm25: 120, pm10: 180 }
  memberStations: string[]; // Array of stationIds
}

// ML Microservice Request / Response types
export interface StationMLFeature {
  stationId: string;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  so2: number | null;
  o3: number | null;
  co: number | null;
}

export interface ClusterRequest {
  stations: StationMLFeature[];
}

export interface ClusterCentroidSummary {
  label: string;
  centroid: Record<string, number>;
  memberCount: number;
  memberStations: string[];
}

export interface ClusterResponse {
  assignments: Record<string, string>; // stationId -> clusterId (e.g. "cluster-0")
  clusters: Record<string, ClusterCentroidSummary>;
}
