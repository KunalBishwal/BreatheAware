import { AQICategory } from "../types";

export interface Breakpoint {
  cpLow: number;
  cpHigh: number;
  bpLow: number;
  bpHigh: number;
  category: AQICategory;
}

export const PM25_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 30, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 31, cpHigh: 60, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 61, cpHigh: 90, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 91, cpHigh: 120, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 121, cpHigh: 250, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 251, cpHigh: 500, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const PM10_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 50, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 51, cpHigh: 100, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 101, cpHigh: 250, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 251, cpHigh: 350, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 351, cpHigh: 430, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 431, cpHigh: 500, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const NO2_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 40, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 41, cpHigh: 80, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 81, cpHigh: 180, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 181, cpHigh: 280, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 281, cpHigh: 400, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 401, cpHigh: 1000, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const SO2_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 40, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 41, cpHigh: 80, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 81, cpHigh: 380, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 381, cpHigh: 800, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 801, cpHigh: 1600, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 1601, cpHigh: 2000, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const CO_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 1.0, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 1.1, cpHigh: 2.0, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 2.1, cpHigh: 10.0, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 10.1, cpHigh: 17.0, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 17.1, cpHigh: 34.0, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 34.1, cpHigh: 50.0, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const O3_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 50, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 51, cpHigh: 100, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 101, cpHigh: 168, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 169, cpHigh: 208, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 209, cpHigh: 748, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 749, cpHigh: 1000, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const NH3_BREAKPOINTS: Breakpoint[] = [
  { cpLow: 0, cpHigh: 200, bpLow: 0, bpHigh: 50, category: "Good" },
  { cpLow: 201, cpHigh: 400, bpLow: 51, bpHigh: 100, category: "Satisfactory" },
  { cpLow: 401, cpHigh: 800, bpLow: 101, bpHigh: 200, category: "Moderate" },
  { cpLow: 801, cpHigh: 1200, bpLow: 201, bpHigh: 300, category: "Poor" },
  { cpLow: 1201, cpHigh: 1800, bpLow: 301, bpHigh: 400, category: "Very Poor" },
  { cpLow: 1801, cpHigh: 2400, bpLow: 401, bpHigh: 500, category: "Severe" },
];

export const BREAKPOINT_REGISTRY: Record<string, Breakpoint[]> = {
  pm25: PM25_BREAKPOINTS,
  pm10: PM10_BREAKPOINTS,
  no2: NO2_BREAKPOINTS,
  so2: SO2_BREAKPOINTS,
  co: CO_BREAKPOINTS,
  o3: O3_BREAKPOINTS,
  nh3: NH3_BREAKPOINTS,
};

export const HEALTH_ADVISORIES: Record<AQICategory, string> = {
  Good: "Minimal impact. Enjoy outdoor activities.",
  Satisfactory: "Minor breathing discomfort to sensitive people.",
  Moderate: "Breathing discomfort to people with lungs, asthma, heart diseases.",
  Poor: "Breathing discomfort to most people on prolonged exposure.",
  "Very Poor": "Respiratory illness on prolonged exposure. Avoid outdoor activity.",
  Severe: "Affects healthy people. Serious health impacts for vulnerable groups. Stay indoors.",
};

export function normalizeParameterName(rawName: string): string {
  const clean = rawName.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean === "pm25" || clean === "pm2point5") return "pm25";
  if (clean === "pm10") return "pm10";
  if (clean === "no2") return "no2";
  if (clean === "so2") return "so2";
  if (clean === "co") return "co";
  if (clean === "o3" || clean === "ozone") return "o3";
  if (clean === "nh3" || clean === "ammonia") return "nh3";
  return clean;
}

export function getCategoryFromAqi(aqi: number): AQICategory {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

/**
 * Calculates CPCB AQI Sub-index for a given pollutant concentration using
 * piecewise linear interpolation formula:
 * SubIndex = ((BP_high - BP_low) / (CP_high - CP_low)) * (Concentration - CP_low) + BP_low
 */
export function calculateAqi(
  parameterName: string,
  concentration: number
): { aqiValue: number; category: AQICategory } {
  if (concentration < 0 || isNaN(concentration)) {
    return { aqiValue: 0, category: "Good" };
  }

  const key = normalizeParameterName(parameterName);
  const breakpoints = BREAKPOINT_REGISTRY[key];

  if (!breakpoints || breakpoints.length === 0) {
    // Unsupported parameter fallback
    const rawVal = Math.round(concentration);
    return { aqiValue: rawVal, category: getCategoryFromAqi(rawVal) };
  }

  // Find corresponding breakpoint bracket
  for (let i = 0; i < breakpoints.length; i++) {
    const bp = breakpoints[i];
    if (concentration >= bp.cpLow && concentration <= bp.cpHigh) {
      const subIndex =
        ((bp.bpHigh - bp.bpLow) / (bp.cpHigh - bp.cpLow)) *
          (concentration - bp.cpLow) +
        bp.bpLow;
      const rounded = Math.round(subIndex);
      return { aqiValue: rounded, category: bp.category };
    }
  }

  // If concentration is above maximum breakpoint
  const highest = breakpoints[breakpoints.length - 1];
  if (concentration > highest.cpHigh) {
    return { aqiValue: 500, category: "Severe" };
  }

  // If below lowest (should be handled by index 0, but as safety guard)
  const lowest = breakpoints[0];
  return { aqiValue: lowest.bpLow, category: lowest.category };
}

/**
 * Given a map of pollutant sub-indices, computes overall AQI (the maximum)
 * and dominant pollutant.
 */
export function computeOverallAqi(
  subIndices: Record<string, number | null | undefined>
): {
  overallAqi: number;
  dominantPollutant: string;
  category: AQICategory;
} {
  let maxAqi = 0;
  let dominant = "pm25";

  for (const [pollutant, val] of Object.entries(subIndices)) {
    if (val !== null && val !== undefined && !isNaN(val)) {
      if (val > maxAqi) {
        maxAqi = val;
        dominant = pollutant;
      }
    }
  }

  const category = getCategoryFromAqi(maxAqi);
  return {
    overallAqi: maxAqi,
    dominantPollutant: dominant,
    category,
  };
}
