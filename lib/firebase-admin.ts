import 'server-only';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const REAL_BUCKET = 'jaysmoneyguides.firebasestorage.app';

function resolveBucket(): string {
  const v = process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET;
  if (v && !v.includes('YOUR_PROJECT')) return v;
  return REAL_BUCKET;
}

/** Parse the service account from env. Returns null if unset/malformed — never
 *  throws, so a missing credential degrades gracefully instead of crashing. */
function parseServiceAccount(): { projectId: string; clientEmail: string; privateKey: string } | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (!raw) return null;
  try {
    // Support either a full JSON service-account blob or a bare private key.
    if (raw.trim().startsWith('{')) {
      const json = JSON.parse(raw);
      return {
        projectId: json.project_id,
        clientEmail: json.client_email,
        privateKey: (json.private_key as string).replace(/\\n/g, '\n'),
      };
    }
    if (!clientEmail) return null;
    return {
      projectId: process.env.FIREBASE_PROJECT_ID || 'jaysmoneyguides',
      clientEmail,
      privateKey: raw.replace(/\\n/g, '\n'),
    };
  } catch {
    return null;
  }
}

let cachedApp: App | null = null;

function getAdminApp(): App | null {
  if (cachedApp) return cachedApp;
  if (getApps().length) { cachedApp = getApps()[0]; return cachedApp; }
  const sa = parseServiceAccount();
  if (!sa) return null;
  cachedApp = initializeApp({
    credential: cert({ projectId: sa.projectId, clientEmail: sa.clientEmail, privateKey: sa.privateKey }),
    storageBucket: resolveBucket(),
  });
  return cachedApp;
}

export function adminDb(): Firestore | null {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export function adminBucket() {
  const app = getAdminApp();
  if (!app) return null;
  return getStorage(app).bucket(resolveBucket());
}

/** Admin emails allowed to access any ebook (for previewing in the dashboard). */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const admins = ['jayisreallycool@gmail.com', 'buddhacmd02@gmail.com'];
  return admins.includes(email.toLowerCase());
}
