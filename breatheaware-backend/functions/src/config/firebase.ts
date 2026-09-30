import { initializeApp, getApps, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { config } from "./env";

let app: App;
if (getApps().length === 0) {
  app = initializeApp({
    projectId: config.firebase.projectId,
  });
} else {
  app = getApps()[0]!;
}

export const db: Firestore = getFirestore(app);
try {
  db.settings({ ignoreUndefinedProperties: true });
} catch {
  // If already configured or running in emulator, ignore
}

export const auth: Auth = getAuth(app);
export { app };
