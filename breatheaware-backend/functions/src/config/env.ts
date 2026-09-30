import * as dotenv from "dotenv";
import * as path from "path";

// Load .env searching multiple hierarchical locations
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export const config = {
  openaq: {
    apiKey: process.env.OPENAQ_API_KEY || "",
    baseUrl: process.env.OPENAQ_BASE_URL || "https://api.openaq.org/v3",
  },
  cpcb: {
    apiKey: process.env.CPCB_API_KEY || "",
    baseUrl:
      process.env.CPCB_BASE_URL ||
      "https://api.data.gov.in/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69",
    resourceId:
      process.env.CPCB_RESOURCE_ID || "3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69",
  },
  mlService: {
    baseUrl: process.env.ML_SERVICE_URL || "http://127.0.0.1:8000",
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || "aqi-project-7e3bd",
  },
};
