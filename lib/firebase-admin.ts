import "server-only";
import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// NOTE: this used to run at module load time, which meant importing this
// file (even indirectly, e.g. via lib/analytics.ts) crashed Next.js's
// "Collecting page data" build step whenever the FIREBASE_* env vars
// weren't present in the build environment — taking down the entire
// `next build`, not just the one API route. Everything below is now
// lazy: the Admin SDK is only initialized the first time it's actually
// used at request time, so a missing env var can only ever break the
// one feature that needs it (and does so with a clear error), never
// the build itself.

function getFirebaseAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Vercel/most hosts store multi-line env vars with literal "\n" — convert
  // back to real newlines or the private key won't parse.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin env vars. Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY in your Vercel project settings (or .env.local for local dev)."
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let _adminApp: App | null = null;
export function getAdminApp(): App {
  if (!_adminApp) _adminApp = getFirebaseAdminApp();
  return _adminApp;
}

let _db: Firestore | null = null;
function getDb(): Firestore {
  if (!_db) _db = getFirestore(getAdminApp());
  return _db;
}

// Proxy so every existing call site (`db.collection(...)`, `db.batch()`,
// `db.runTransaction(...)`, etc.) keeps working unchanged, while the real
// Firestore instance — and the env var check above — is only created the
// first time a property is actually accessed, at request time.
export const db: Firestore = new Proxy({} as Firestore, {
  get(_target, prop, receiver) {
    const real = getDb();
    const value = Reflect.get(real as object, prop, receiver);
    return typeof value === "function" ? value.bind(real) : value;
  },
});