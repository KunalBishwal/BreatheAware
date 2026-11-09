import type { AQIBand, AQICategory, PollutantInfo } from '../types';

export const AQI_BANDS: AQIBand[] = [
  { category: 'good', label: 'Good', min: 0, max: 50, color: '#00B050', healthAdvisory: 'Air quality is satisfactory, and air pollution poses little or no risk.' },
  { category: 'satisfactory', label: 'Satisfactory', min: 51, max: 100, color: '#92D050', healthAdvisory: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' },
  { category: 'moderate', label: 'Moderate', min: 101, max: 200, color: '#FFFF00', healthAdvisory: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' },
  { category: 'poor', label: 'Poor', min: 201, max: 300, color: '#FF9900', healthAdvisory: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' },
  { category: 'verypoor', label: 'Very Poor', min: 301, max: 400, color: '#FF0000', healthAdvisory: 'Health alert: The risk of health effects is increased for everyone.' },
  { category: 'severe', label: 'Severe', min: 401, max: 500, color: '#800000', healthAdvisory: 'Health warning of emergency conditions: everyone is more likely to be affected.' },
];

export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'satisfactory';
  if (aqi <= 200) return 'moderate';
  if (aqi <= 300) return 'poor';
  if (aqi <= 400) return 'verypoor';
  return 'severe';
}

export function getAQIColor(aqi: number): string {
  const band = AQI_BANDS.find(b => aqi >= b.min && aqi <= b.max);
  return band?.color || '#800000';
}

export function getAQIBand(aqi: number): AQIBand {
  return AQI_BANDS.find(b => aqi >= b.min && aqi <= b.max) || AQI_BANDS[5];
}

export function getAQILabel(aqi: number): string {
  return getAQIBand(aqi).label;
}

export const POLLUTANTS: PollutantInfo[] = [
  { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', standard24h: 60 },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', standard24h: 100 },
  { key: 'no2', label: 'NO₂', unit: 'μg/m³', standard24h: 80 },
  { key: 'so2', label: 'SO₂', unit: 'μg/m³', standard24h: 80 },
  { key: 'co', label: 'CO', unit: 'mg/m³', standard8h: 2.0 },
  { key: 'o3', label: 'O₃', unit: 'μg/m³', standard8h: 100 },
  { key: 'nh3', label: 'NH₃', unit: 'μg/m³', standard24h: 400 },
];

// Sub-index calculations for Indian AQI
export function calculatePM25SubIndex(concentration: number): number {
  if (concentration <= 30) return (concentration / 30) * 50;
  if (concentration <= 60) return 50 + ((concentration - 30) / 30) * 50;
  if (concentration <= 90) return 100 + ((concentration - 60) / 30) * 100;
  if (concentration <= 120) return 200 + ((concentration - 90) / 30) * 100;
  if (concentration <= 250) return 300 + ((concentration - 120) / 130) * 100;
  return 400 + ((Math.min(concentration, 500) - 250) / 250) * 100;
}

export function calculatePM10SubIndex(concentration: number): number {
  if (concentration <= 50) return (concentration / 50) * 50;
  if (concentration <= 100) return 50 + ((concentration - 50) / 50) * 50;
  if (concentration <= 250) return 100 + ((concentration - 100) / 150) * 100;
  if (concentration <= 340) return 200 + ((concentration - 250) / 90) * 100;
  if (concentration <= 430) return 300 + ((concentration - 340) / 90) * 100;
  return 400 + ((Math.min(concentration, 600) - 430) / 170) * 100;
}

export function calculateNO2SubIndex(concentration: number): number {
  if (concentration <= 40) return (concentration / 40) * 50;
  if (concentration <= 80) return 50 + ((concentration - 40) / 40) * 50;
  if (concentration <= 180) return 100 + ((concentration - 80) / 100) * 100;
  if (concentration <= 280) return 200 + ((concentration - 180) / 100) * 100;
  if (concentration <= 400) return 300 + ((concentration - 280) / 120) * 100;
  return 400 + ((Math.min(concentration, 1000) - 400) / 600) * 100;
}
