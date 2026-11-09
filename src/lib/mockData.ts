import type { CityData, Station, Measurement, CalendarDay, DiurnalPoint, ExceedanceData, ClusterPoint } from '../types';

export const CITIES: CityData[] = [
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090, aqi: 367, category: 'verypoor', stationCount: 40, dominantPollutant: 'PM2.5' },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777, aqi: 148, category: 'moderate', stationCount: 22, dominantPollutant: 'PM2.5' },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707, aqi: 72, category: 'satisfactory', stationCount: 14, dominantPollutant: 'PM10' },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639, aqi: 212, category: 'poor', stationCount: 18, dominantPollutant: 'PM2.5' },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946, aqi: 94, category: 'satisfactory', stationCount: 12, dominantPollutant: 'PM10' },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867, aqi: 125, category: 'moderate', stationCount: 10, dominantPollutant: 'PM2.5' },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, aqi: 305, category: 'verypoor', stationCount: 11, dominantPollutant: 'PM2.5' },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714, aqi: 168, category: 'moderate', stationCount: 9, dominantPollutant: 'PM10' },
  { city: 'Patna', state: 'Bihar', lat: 25.6093, lng: 85.1376, aqi: 289, category: 'poor', stationCount: 6, dominantPollutant: 'PM2.5' },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873, aqi: 178, category: 'moderate', stationCount: 7, dominantPollutant: 'PM10' },
];

export const STATIONS: Station[] = [
  // Delhi
  { id: 's1', name: 'Anand Vihar, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.6468, lng: 77.3164, source: 'cpcb', network: 'DPCC - Delhi CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's2', name: 'RK Puram, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.5651, lng: 77.1744, source: 'cpcb', network: 'DPCC - Delhi CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's3', name: 'Punjabi Bagh, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.6729, lng: 77.1189, source: 'cpcb', network: 'DPCC - Delhi CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's14', name: 'IGI Airport T3, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000, source: 'cpcb', network: 'IMD / SAFAR CAAQMS', stationType: 'Traffic', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's15', name: 'Dwarka Sec 8, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.5842, lng: 77.0511, source: 'cpcb', network: 'DPCC - Delhi CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's21', name: 'Shadipur, Delhi', city: 'Delhi', state: 'Delhi', lat: 28.6517, lng: 77.1581, source: 'cpcb', network: 'CPCB - National CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Mumbai
  { id: 's4', name: 'Bandra Kurla Complex (BKC), Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.0596, lng: 72.8295, source: 'cpcb', network: 'MPCB - Maharashtra CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's5', name: 'Colaba, Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 18.9067, lng: 72.8147, source: 'cpcb', network: 'IITM SAFAR CAAQMS', stationType: 'Background', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's16', name: 'Worli, Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.0178, lng: 72.8150, source: 'cpcb', network: 'MPCB - Maharashtra CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's22', name: 'Sion, Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.0434, lng: 72.8633, source: 'cpcb', network: 'MPCB - Maharashtra CAAQMS', stationType: 'Traffic', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's23', name: 'Borivali East, Mumbai', city: 'Mumbai', state: 'Maharashtra', lat: 19.2288, lng: 72.8541, source: 'cpcb', network: 'IITM SAFAR CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Chennai
  { id: 's6', name: 'Alandur Bus Depot, Chennai', city: 'Chennai', state: 'Tamil Nadu', lat: 13.0067, lng: 80.2206, source: 'cpcb', network: 'CPCB / TNPCB CAAQMS', stationType: 'Traffic', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's7', name: 'Manali Industrial Area, Chennai', city: 'Chennai', state: 'Tamil Nadu', lat: 13.1667, lng: 80.2833, source: 'cpcb', network: 'TNPCB - Tamil Nadu CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's24', name: 'Velachery, Chennai', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9815, lng: 80.2180, source: 'cpcb', network: 'TNPCB - Tamil Nadu CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's25', name: 'Royapuram, Chennai', city: 'Chennai', state: 'Tamil Nadu', lat: 13.1147, lng: 80.2977, source: 'cpcb', network: 'TNPCB - Tamil Nadu CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Kolkata
  { id: 's8', name: 'Padmapukur (Howrah), Kolkata', city: 'Kolkata', state: 'West Bengal', lat: 22.5958, lng: 88.2636, source: 'cpcb', network: 'WBPCB / CPCB CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's9', name: 'Victoria Memorial, Kolkata', city: 'Kolkata', state: 'West Bengal', lat: 22.5449, lng: 88.3553, source: 'cpcb', network: 'WBPCB - West Bengal CAAQMS', stationType: 'Background', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's26', name: 'Jadavpur, Kolkata', city: 'Kolkata', state: 'West Bengal', lat: 22.4988, lng: 88.3716, source: 'cpcb', network: 'WBPCB - West Bengal CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's27', name: 'Rabindra Bharati University, Kolkata', city: 'Kolkata', state: 'West Bengal', lat: 22.6280, lng: 88.3792, source: 'cpcb', network: 'WBPCB - West Bengal CAAQMS', stationType: 'Traffic', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Bangalore
  { id: 's10', name: 'Central Silk Board, Bangalore', city: 'Bangalore', state: 'Karnataka', lat: 12.9216, lng: 77.6291, source: 'cpcb', network: 'KSPCB - Karnataka CAAQMS', stationType: 'Traffic', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's11', name: 'BTM Layout, Bangalore', city: 'Bangalore', state: 'Karnataka', lat: 12.9166, lng: 77.6101, source: 'cpcb', network: 'KSPCB - Karnataka CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's28', name: 'Peenya Industrial Area, Bangalore', city: 'Bangalore', state: 'Karnataka', lat: 13.0285, lng: 77.5195, source: 'cpcb', network: 'KSPCB - Karnataka CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's29', name: 'City Railway Station, Bangalore', city: 'Bangalore', state: 'Karnataka', lat: 12.9781, lng: 77.5696, source: 'cpcb', network: 'KSPCB - Karnataka CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Hyderabad
  { id: 's18', name: 'Jubilee Hills, Hyderabad', city: 'Hyderabad', state: 'Telangana', lat: 17.4326, lng: 78.4071, source: 'cpcb', network: 'TSPCB - Telangana CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's30', name: 'Sanathnagar, Hyderabad', city: 'Hyderabad', state: 'Telangana', lat: 17.4565, lng: 78.4439, source: 'cpcb', network: 'CPCB / TSPCB CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's31', name: 'Zoo Park (Bahadurpura), Hyderabad', city: 'Hyderabad', state: 'Telangana', lat: 17.3489, lng: 78.4513, source: 'cpcb', network: 'TSPCB - Telangana CAAQMS', stationType: 'Background', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's32', name: 'Univ of Hyderabad (Gachibowli), Hyderabad', city: 'Hyderabad', state: 'Telangana', lat: 17.4600, lng: 78.3378, source: 'cpcb', network: 'TSPCB - Telangana CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Lucknow
  { id: 's12', name: 'Lalbagh, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8500, lng: 80.9500, source: 'cpcb', network: 'UPPCB - Uttar Pradesh CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's17', name: 'Talkatora DIC, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8525, lng: 80.9238, source: 'cpcb', network: 'UPPCB - Uttar Pradesh CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's33', name: 'Gomti Nagar, Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8530, lng: 81.0020, source: 'cpcb', network: 'UPPCB - Uttar Pradesh CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's34', name: 'Kendriya Vidyalaya (Aliganj), Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8872, lng: 80.9398, source: 'cpcb', network: 'CPCB - National CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Ahmedabad
  { id: 's35', name: 'Maninagar, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lat: 22.9978, lng: 72.6033, source: 'cpcb', network: 'GPCB - Gujarat CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's36', name: 'Chandkheda, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lat: 23.1090, lng: 72.5850, source: 'cpcb', network: 'IITM SAFAR CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's37', name: 'Vatva Industrial Estate, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lat: 22.9575, lng: 72.6289, source: 'cpcb', network: 'GPCB - Gujarat CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's38', name: 'Pirana, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', lat: 22.9806, lng: 72.5694, source: 'cpcb', network: 'CPCB - National CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Patna
  { id: 's19', name: 'IGSC Planetarium, Patna', city: 'Patna', state: 'Bihar', lat: 25.6145, lng: 85.1558, source: 'cpcb', network: 'BSPCB - Bihar CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's39', name: 'Danapur DRDA, Patna', city: 'Patna', state: 'Bihar', lat: 25.6297, lng: 85.0442, source: 'cpcb', network: 'BSPCB - Bihar CAAQMS', stationType: 'Traffic', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's40', name: 'Samanpura (Raja Bazar), Patna', city: 'Patna', state: 'Bihar', lat: 25.6111, lng: 85.0888, source: 'cpcb', network: 'BSPCB - Bihar CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's41', name: 'Shikarpur (Patna City), Patna', city: 'Patna', state: 'Bihar', lat: 25.5972, lng: 85.2267, source: 'cpcb', network: 'BSPCB - Bihar CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  // Jaipur
  { id: 's20', name: 'Adarsh Nagar, Jaipur', city: 'Jaipur', state: 'Rajasthan', lat: 26.9340, lng: 75.7863, source: 'cpcb', network: 'RSPCB - Rajasthan CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's42', name: 'Police Commissionerate, Jaipur', city: 'Jaipur', state: 'Rajasthan', lat: 26.9189, lng: 75.8012, source: 'cpcb', network: 'RSPCB - Rajasthan CAAQMS', stationType: 'Commercial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's43', name: 'Shastri Nagar, Jaipur', city: 'Jaipur', state: 'Rajasthan', lat: 26.9461, lng: 75.7922, source: 'cpcb', network: 'RSPCB - Rajasthan CAAQMS', stationType: 'Residential', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
  { id: 's44', name: 'RIICO Sitapura, Jaipur', city: 'Jaipur', state: 'Rajasthan', lat: 26.7758, lng: 75.8450, source: 'cpcb', network: 'RSPCB - Rajasthan CAAQMS', stationType: 'Industrial', status: 'active', lastUpdated: '2026-10-16T10:00:00Z' },
];

// Deterministic seeded random for consistent data across renders
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// City-specific baseline pollutant profiles based on 2025-2026 CPCB data
export const CITY_PROFILES: Record<string, { baseAQI: number; pm25Factor: number; pm10Factor: number; no2Factor: number; so2Factor: number; coFactor: number; o3Factor: number; nh3Factor: number }> = {
  'Delhi':     { baseAQI: 340, pm25Factor: 1.8, pm10Factor: 2.4, no2Factor: 1.5, so2Factor: 0.6, coFactor: 1.4, o3Factor: 0.8, nh3Factor: 1.2 },
  'Mumbai':    { baseAQI: 140, pm25Factor: 1.2, pm10Factor: 1.8, no2Factor: 1.3, so2Factor: 0.5, coFactor: 1.0, o3Factor: 1.1, nh3Factor: 0.7 },
  'Chennai':   { baseAQI: 70,  pm25Factor: 0.8, pm10Factor: 1.4, no2Factor: 0.9, so2Factor: 1.2, coFactor: 0.6, o3Factor: 1.0, nh3Factor: 0.5 },
  'Kolkata':   { baseAQI: 200, pm25Factor: 1.5, pm10Factor: 2.0, no2Factor: 1.2, so2Factor: 0.8, coFactor: 1.1, o3Factor: 0.9, nh3Factor: 1.0 },
  'Bangalore': { baseAQI: 85,  pm25Factor: 0.9, pm10Factor: 1.3, no2Factor: 1.4, so2Factor: 0.4, coFactor: 0.8, o3Factor: 1.2, nh3Factor: 0.6 },
  'Hyderabad': { baseAQI: 120, pm25Factor: 1.1, pm10Factor: 1.5, no2Factor: 1.0, so2Factor: 0.7, coFactor: 0.9, o3Factor: 1.0, nh3Factor: 0.8 },
  'Lucknow':   { baseAQI: 290, pm25Factor: 1.7, pm10Factor: 2.2, no2Factor: 1.1, so2Factor: 0.9, coFactor: 1.3, o3Factor: 0.7, nh3Factor: 1.5 },
  'Ahmedabad': { baseAQI: 160, pm25Factor: 1.3, pm10Factor: 1.9, no2Factor: 1.0, so2Factor: 1.1, coFactor: 1.0, o3Factor: 0.9, nh3Factor: 0.9 },
  'Patna':     { baseAQI: 270, pm25Factor: 1.6, pm10Factor: 2.1, no2Factor: 0.9, so2Factor: 0.7, coFactor: 1.2, o3Factor: 0.6, nh3Factor: 1.4 },
  'Jaipur':    { baseAQI: 170, pm25Factor: 1.2, pm10Factor: 2.3, no2Factor: 0.8, so2Factor: 0.6, coFactor: 0.7, o3Factor: 1.1, nh3Factor: 0.7 },
};

// Generate mock measurements with city-specific profiles
export function generateMockMeasurements(stationId: string): Measurement {
  const station = STATIONS.find(s => s.id === stationId);
  const city = station?.city || 'Delhi';
  const profile = CITY_PROFILES[city] || CITY_PROFILES['Delhi'];
  const seed = stationId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);

  const variation = 0.85 + seededRandom(seed) * 0.3; // ±15% variation
  const aqi = Math.round(profile.baseAQI * variation);

  return {
    stationId,
    timestamp: '2026-10-16T10:00:00+05:30',
    pm25: Math.round(aqi * profile.pm25Factor * (0.9 + seededRandom(seed + 1) * 0.2)),
    pm10: Math.round(aqi * profile.pm10Factor * (0.9 + seededRandom(seed + 2) * 0.2)),
    no2: Math.round((30 + aqi * 0.15) * profile.no2Factor * (0.85 + seededRandom(seed + 3) * 0.3)),
    so2: Math.round((8 + aqi * 0.05) * profile.so2Factor * (0.8 + seededRandom(seed + 4) * 0.4)),
    co: +((0.4 + aqi * 0.005) * profile.coFactor * (0.85 + seededRandom(seed + 5) * 0.3)).toFixed(1),
    o3: Math.round((15 + aqi * 0.08) * profile.o3Factor * (0.8 + seededRandom(seed + 6) * 0.4)),
    nh3: Math.round((8 + aqi * 0.06) * profile.nh3Factor * (0.8 + seededRandom(seed + 7) * 0.4)),
    aqi: Math.round(aqi),
  };
}

// Generate calendar heatmap data for 2026 (Jan 1 – Oct 16)
export function generateCalendarData(): CalendarDay[] {
  const data: CalendarDay[] = [];
  const cutoff = new Date(2026, 9, 16); // Oct 16, 2026
  const jan1 = new Date(2026, 0, 1);
  const startWeekday = jan1.getDay(); // Thursday = 4

  for (let m = 0; m < 12; m++) {
    const daysInMonth = new Date(2026, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(2026, m, d);
      if (date > cutoff) continue;

      const dayOfYear = Math.floor((date.getTime() - jan1.getTime()) / 86400000);
      const weekIndex = Math.floor((dayOfYear + startWeekday) / 7);
      const seed = dayOfYear * 7 + m * 31 + d;

      // Seasonal variation: Winter (Nov–Feb) severe, monsoon (Jun–Sep) low, transition months moderate
      let seasonalFactor: number;
      if (m === 0 || m === 1) seasonalFactor = 1.6 + seededRandom(seed) * 0.4;       // Jan-Feb: severe winter
      else if (m === 2) seasonalFactor = 1.2 + seededRandom(seed) * 0.3;              // Mar: transition
      else if (m === 3 || m === 4) seasonalFactor = 0.9 + seededRandom(seed) * 0.2;   // Apr-May: pre-monsoon heat
      else if (m >= 5 && m <= 8) seasonalFactor = 0.4 + seededRandom(seed) * 0.3;     // Jun-Sep: monsoon washout
      else seasonalFactor = 1.3 + seededRandom(seed) * 0.5;                            // Oct+: post-monsoon buildup

      const baseAQI = (60 + seededRandom(seed + 100) * 180) * seasonalFactor;
      const aqi = Math.min(500, Math.max(15, Math.round(baseAQI)));

      data.push({
        date: date.toISOString().split('T')[0],
        month: m,
        day: d,
        weekday: date.getDay(),
        weekIndex,
        aqi,
        category: aqi <= 50 ? 'good' : aqi <= 100 ? 'satisfactory' : aqi <= 200 ? 'moderate' : aqi <= 300 ? 'poor' : aqi <= 400 ? 'verypoor' : 'severe',
      });
    }
  }
  return data;
}

// Generate diurnal data with realistic traffic, photochemistry, and inversion patterns for all 7 pollutants
export function generateDiurnalData(): DiurnalPoint[] {
  const data: DiurnalPoint[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let weekday = 0; weekday < 7; weekday++) {
      const seed = hour * 7 + weekday;
      const isWeekend = weekday >= 5;
      const weekendFactor = isWeekend ? 0.75 : 1.0;

      // PM2.5 & PM10: Thermal inversion + traffic peaks + midday dispersion
      let pmFactor: number;
      if (hour >= 0 && hour <= 6) pmFactor = 1.35 + seededRandom(seed) * 0.2;
      else if (hour >= 7 && hour <= 9) pmFactor = 1.65 + seededRandom(seed) * 0.3;
      else if (hour >= 11 && hour <= 15) pmFactor = 0.68 + seededRandom(seed) * 0.2;
      else if (hour >= 17 && hour <= 20) pmFactor = 1.55 + seededRandom(seed) * 0.3;
      else pmFactor = 1.2 + seededRandom(seed) * 0.2;

      // NO2: Morning & evening traffic rush, photolysis dip around noon
      let no2Factor: number;
      if (hour >= 7 && hour <= 10) no2Factor = 1.75 + seededRandom(seed) * 0.25;
      else if (hour >= 11 && hour <= 16) no2Factor = 0.65 + seededRandom(seed) * 0.2;
      else if (hour >= 17 && hour <= 21) no2Factor = 1.65 + seededRandom(seed) * 0.25;
      else no2Factor = 0.9 + seededRandom(seed) * 0.2;

      // O3: Sunlight driven! Near zero at night, peak during max solar irradiance (12:00 - 15:00)
      let o3Factor: number;
      if (hour >= 0 && hour <= 7) o3Factor = 0.25 + seededRandom(seed + 1) * 0.15;
      else if (hour >= 8 && hour <= 10) o3Factor = 0.75 + seededRandom(seed + 1) * 0.2;
      else if (hour >= 11 && hour <= 15) o3Factor = 1.85 + seededRandom(seed + 1) * 0.3;
      else if (hour >= 16 && hour <= 18) o3Factor = 1.15 + seededRandom(seed + 1) * 0.2;
      else o3Factor = 0.4 + seededRandom(seed + 1) * 0.15;
      // Weekend Ozone Effect: slightly higher ozone due to lower NO titration
      const o3WeekendFactor = isWeekend ? 1.15 : 1.0;

      // CO: Strong morning and evening rush signatures (mg/m³)
      let coFactor: number;
      if (hour >= 7 && hour <= 10) coFactor = 1.65 + seededRandom(seed + 2) * 0.2;
      else if (hour >= 11 && hour <= 16) coFactor = 0.75 + seededRandom(seed + 2) * 0.2;
      else if (hour >= 17 && hour <= 21) coFactor = 1.55 + seededRandom(seed + 2) * 0.2;
      else coFactor = 1.05 + seededRandom(seed + 2) * 0.2;

      // SO2: Industrial operating hours (09:00 - 17:00)
      let so2Factor: number;
      if (hour >= 9 && hour <= 17) so2Factor = 1.45 + seededRandom(seed + 3) * 0.25;
      else so2Factor = 0.8 + seededRandom(seed + 3) * 0.2;

      // NH3: Waste and agricultural releases, rising with midday warmth and evening cooling
      let nh3Factor: number;
      if (hour >= 9 && hour <= 14) nh3Factor = 1.35 + seededRandom(seed + 4) * 0.2;
      else if (hour >= 19 && hour <= 23) nh3Factor = 1.3 + seededRandom(seed + 4) * 0.2;
      else nh3Factor = 0.85 + seededRandom(seed + 4) * 0.2;

      data.push({
        hour,
        weekday,
        pm25: Math.round((55 + seededRandom(seed + 10) * 25) * pmFactor * weekendFactor),
        pm10: Math.round((95 + seededRandom(seed + 20) * 40) * pmFactor * weekendFactor),
        no2: Math.round((32 + seededRandom(seed + 30) * 18) * no2Factor * weekendFactor),
        so2: Math.round((14 + seededRandom(seed + 40) * 10) * so2Factor * weekendFactor),
        co: +((0.7 + seededRandom(seed + 50) * 0.4) * coFactor * weekendFactor).toFixed(1),
        o3: Math.round((28 + seededRandom(seed + 60) * 20) * o3Factor * o3WeekendFactor),
        nh3: Math.round((18 + seededRandom(seed + 70) * 14) * nh3Factor * weekendFactor),
      });
    }
  }
  return data;
}

// Generate exceedance data — 2026 YTD (Jan–Oct 15 = 288 days) for all 10 cities
export function generateExceedanceData(): ExceedanceData[] {
  const totalDays = 288; // Jan 1 – Oct 15, 2026
  return [
    // Delhi — worst offender
    { city: 'Delhi', pollutant: 'PM2.5', standard: 60, exceedanceDays: 241, totalDays, percentage: 83.7 },
    { city: 'Delhi', pollutant: 'PM10', standard: 100, exceedanceDays: 218, totalDays, percentage: 75.7 },
    { city: 'Delhi', pollutant: 'NO₂', standard: 80, exceedanceDays: 132, totalDays, percentage: 45.8 },
    { city: 'Delhi', pollutant: 'SO₂', standard: 80, exceedanceDays: 24, totalDays, percentage: 8.3 },
    // Mumbai
    { city: 'Mumbai', pollutant: 'PM2.5', standard: 60, exceedanceDays: 156, totalDays, percentage: 54.2 },
    { city: 'Mumbai', pollutant: 'PM10', standard: 100, exceedanceDays: 112, totalDays, percentage: 38.9 },
    { city: 'Mumbai', pollutant: 'NO₂', standard: 80, exceedanceDays: 67, totalDays, percentage: 23.3 },
    // Chennai
    { city: 'Chennai', pollutant: 'PM2.5', standard: 60, exceedanceDays: 38, totalDays, percentage: 13.2 },
    { city: 'Chennai', pollutant: 'PM10', standard: 100, exceedanceDays: 52, totalDays, percentage: 18.1 },
    // Kolkata
    { city: 'Kolkata', pollutant: 'PM2.5', standard: 60, exceedanceDays: 148, totalDays, percentage: 51.4 },
    { city: 'Kolkata', pollutant: 'NO₂', standard: 80, exceedanceDays: 89, totalDays, percentage: 30.9 },
    { city: 'Kolkata', pollutant: 'PM10', standard: 100, exceedanceDays: 121, totalDays, percentage: 42.0 },
    // Bangalore
    { city: 'Bangalore', pollutant: 'PM2.5', standard: 60, exceedanceDays: 72, totalDays, percentage: 25.0 },
    { city: 'Bangalore', pollutant: 'NO₂', standard: 80, exceedanceDays: 45, totalDays, percentage: 15.6 },
    // Hyderabad
    { city: 'Hyderabad', pollutant: 'PM10', standard: 100, exceedanceDays: 129, totalDays, percentage: 44.8 },
    { city: 'Hyderabad', pollutant: 'PM2.5', standard: 60, exceedanceDays: 93, totalDays, percentage: 32.3 },
    { city: 'Hyderabad', pollutant: 'NO₂', standard: 80, exceedanceDays: 62, totalDays, percentage: 21.5 },
    // Lucknow
    { city: 'Lucknow', pollutant: 'PM2.5', standard: 60, exceedanceDays: 204, totalDays, percentage: 70.8 },
    { city: 'Lucknow', pollutant: 'PM10', standard: 100, exceedanceDays: 175, totalDays, percentage: 60.8 },
    // Ahmedabad
    { city: 'Ahmedabad', pollutant: 'PM10', standard: 100, exceedanceDays: 168, totalDays, percentage: 58.3 },
    { city: 'Ahmedabad', pollutant: 'PM2.5', standard: 60, exceedanceDays: 140, totalDays, percentage: 48.6 },
    { city: 'Ahmedabad', pollutant: 'SO₂', standard: 80, exceedanceDays: 41, totalDays, percentage: 14.2 },
    // Patna
    { city: 'Patna', pollutant: 'PM2.5', standard: 60, exceedanceDays: 192, totalDays, percentage: 66.7 },
    { city: 'Patna', pollutant: 'PM10', standard: 100, exceedanceDays: 163, totalDays, percentage: 56.6 },
    // Jaipur
    { city: 'Jaipur', pollutant: 'PM10', standard: 100, exceedanceDays: 145, totalDays, percentage: 50.3 },
    { city: 'Jaipur', pollutant: 'PM2.5', standard: 60, exceedanceDays: 108, totalDays, percentage: 37.5 },
  ];
}

// Generate cluster data aligned with ML service's 4 archetypes
export function generateClusterData(): ClusterPoint[] {
  const clusterMap: Record<string, { cluster: string; pm25Range: [number, number]; no2Range: [number, number] }> = {
    // Biomass/Crop Burning: High PM, low NO2
    's1':  { cluster: 'Biomass/Crop Burning', pm25Range: [160, 220], no2Range: [20, 35] },
    's12': { cluster: 'Biomass/Crop Burning', pm25Range: [150, 210], no2Range: [18, 32] },
    's17': { cluster: 'Biomass/Crop Burning', pm25Range: [140, 200], no2Range: [22, 38] },
    's19': { cluster: 'Biomass/Crop Burning', pm25Range: [145, 205], no2Range: [16, 30] },
    // Traffic/Industrial: High NO2 + moderate-high PM
    's10': { cluster: 'Traffic/Industrial', pm25Range: [80, 130], no2Range: [65, 95] },
    's4':  { cluster: 'Traffic/Industrial', pm25Range: [75, 125], no2Range: [60, 88] },
    's3':  { cluster: 'Traffic/Industrial', pm25Range: [90, 140], no2Range: [70, 100] },
    's2':  { cluster: 'Traffic/Industrial', pm25Range: [85, 135], no2Range: [62, 92] },
    // Industrial/Power: High SO2 signature (shown as moderate PM + high NO2 on scatter)
    's7':  { cluster: 'Industrial/Power', pm25Range: [70, 110], no2Range: [40, 60] },
    's8':  { cluster: 'Industrial/Power', pm25Range: [80, 120], no2Range: [45, 65] },
    's16': { cluster: 'Industrial/Power', pm25Range: [65, 105], no2Range: [42, 58] },
    // Clean/Background: Low across all
    's6':  { cluster: 'Clean/Background', pm25Range: [15, 35], no2Range: [8, 20] },
    's11': { cluster: 'Clean/Background', pm25Range: [20, 40], no2Range: [12, 25] },
    's5':  { cluster: 'Clean/Background', pm25Range: [18, 38], no2Range: [10, 22] },
    's18': { cluster: 'Clean/Background', pm25Range: [22, 42], no2Range: [14, 28] },
    's36': { cluster: 'Clean/Background', pm25Range: [24, 45], no2Range: [12, 26] },
    // Additional Industrial/Power & Traffic stations
    's37': { cluster: 'Industrial/Power', pm25Range: [85, 130], no2Range: [50, 75] },
    's35': { cluster: 'Traffic/Industrial', pm25Range: [70, 115], no2Range: [55, 80] },
    's38': { cluster: 'Biomass/Crop Burning', pm25Range: [130, 185], no2Range: [25, 42] },
  };

  return STATIONS.map(station => {
    const config = clusterMap[station.id];
    const seed = station.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    
    if (config) {
      return {
        stationId: station.id,
        stationName: station.name,
        pm25: config.pm25Range[0] + seededRandom(seed) * (config.pm25Range[1] - config.pm25Range[0]),
        no2: config.no2Range[0] + seededRandom(seed + 1) * (config.no2Range[1] - config.no2Range[0]),
        cluster: config.cluster,
        city: station.city,
      };
    }

    // Default: assign based on city profile
    const profile = CITY_PROFILES[station.city] || CITY_PROFILES['Delhi'];
    const basePM = 30 + profile.baseAQI * 0.3 * (0.8 + seededRandom(seed) * 0.4);
    const baseNO2 = 15 + profile.baseAQI * 0.1 * (0.7 + seededRandom(seed + 1) * 0.6);
    const cluster = basePM > 120 ? 'Biomass/Crop Burning' : baseNO2 > 50 ? 'Traffic/Industrial' : basePM < 40 ? 'Clean/Background' : 'Industrial/Power';

    return {
      stationId: station.id,
      stationName: station.name,
      pm25: basePM,
      no2: baseNO2,
      cluster,
      city: station.city,
    };
  });
}
