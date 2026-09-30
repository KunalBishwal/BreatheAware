export interface Station {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  source: 'openaq' | 'cpcb';
  lastUpdated: string;
}

export interface Measurement {
  stationId: string;
  timestamp: string;
  pm25?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  co?: number;
  o3?: number;
  nh3?: number;
  aqi?: number;
  aqiCategory?: AQICategory;
}

export type AQICategory = 'good' | 'satisfactory' | 'moderate' | 'poor' | 'verypoor' | 'severe';

export interface AQIBand {
  category: AQICategory;
  label: string;
  min: number;
  max: number;
  color: string;
  healthAdvisory: string;
}

export interface CityData {
  city: string;
  state: string;
  lat: number;
  lng: number;
  aqi: number;
  category: AQICategory;
  stationCount: number;
  dominantPollutant: string;
}

export interface CalendarDay {
  date: string;
  month: number;
  day: number;
  weekday: number;
  aqi: number;
  category: AQICategory;
}

export interface DiurnalPoint {
  hour: number;
  weekday: number;
  pm25: number;
  pm10: number;
  no2: number;
}

export interface ExceedanceData {
  city: string;
  pollutant: string;
  standard: number;
  exceedanceDays: number;
  totalDays: number;
  percentage: number;
}

export interface ClusterPoint {
  stationId: string;
  stationName: string;
  pm25: number;
  no2: number;
  cluster: string;
  city: string;
}

export type PollutantKey = 'pm25' | 'pm10' | 'no2' | 'so2' | 'co' | 'o3' | 'nh3';

export interface PollutantInfo {
  key: PollutantKey;
  label: string;
  unit: string;
  standard24h?: number;
  standard8h?: number;
}
