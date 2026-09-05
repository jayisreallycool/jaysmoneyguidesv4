'use client';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'jaysmoneyguides.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'jaysmoneyguides',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'jaysmoneyguides.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
function getClientApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!config.apiKey) return null; // not configured yet
  if (getApps().length) return getApps()[0];
  app = initializeApp(config);
  return app;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const a = getClientApp();
  return a ? getStorage(a) : null;
}
