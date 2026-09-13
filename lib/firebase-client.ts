'use client';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  deleteUser as fbDeleteUser,
  reauthenticateWithPopup,
  updateProfile,
  sendPasswordResetEmail,
  type Auth,
  type User as FirebaseUser,
} from 'firebase/auth';

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

export function getFirebaseAuth(): Auth | null {
  const a = getClientApp();
  return a ? getAuth(a) : null;
}

/** True when Firebase Auth is configured (env vars present). */
export function isAuthConfigured(): boolean {
  return !!config.apiKey;
}

// --- Auth actions (all return a friendly result, never throw to the caller) ---

export type AuthResult = { ok: true; user: FirebaseUser } | { ok: false; error: string };

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/invalid-email': 'That email address looks invalid.',
    'auth/user-not-found': 'No account found with that email.',
    'auth/wrong-password': 'Incorrect password. Try again.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/email-already-in-use': 'An account with this email already exists — try signing in.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/popup-blocked': 'Your browser blocked the sign-in popup. Please allow popups and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/operation-not-allowed': 'This sign-in method isn’t enabled yet.',
    'auth/requires-recent-login': 'Please sign in again to complete this action.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) return { ok: false, error: 'Sign-in is not available right now.' };
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const cred = await signInWithPopup(auth, provider);
    return { ok: true, user: cred.user };
  } catch (e) {
    return { ok: false, error: friendlyError((e as { code?: string }).code || '') };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) return { ok: false, error: 'Sign-in is not available right now.' };
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { ok: true, user: cred.user };
  } catch (e) {
    return { ok: false, error: friendlyError((e as { code?: string }).code || '') };
  }
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<AuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) return { ok: false, error: 'Sign-up is not available right now.' };
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(cred.user, { displayName: name });
    return { ok: true, user: cred.user };
  } catch (e) {
    return { ok: false, error: friendlyError((e as { code?: string }).code || '') };
  }
}

export async function sendReset(email: string): Promise<{ ok: boolean; error?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) return { ok: false, error: 'Not available right now.' };
  try {
    await sendPasswordResetEmail(auth, email);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyError((e as { code?: string }).code || '') };
  }
}

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  if (auth) await fbSignOut(auth);
}

/** Delete the current account. Re-authenticates with Google first (Firebase
 *  requires a recent login to delete). */
export async function deleteAccount(): Promise<{ ok: boolean; error?: string }> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!auth || !user) return { ok: false, error: 'You are not signed in.' };
  try {
    // Re-auth with Google (covers Google users; email users may already be recent).
    try {
      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);
    } catch {
      // If re-auth popup fails/cancels, still attempt delete; Firebase will
      // surface requires-recent-login if needed.
    }
    await fbDeleteUser(user);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: friendlyError((e as { code?: string }).code || '') };
  }
}

export function watchAuth(cb: (user: FirebaseUser | null) => void): () => void {
  const auth = getFirebaseAuth();
  if (!auth) { cb(null); return () => {}; }
  return onAuthStateChanged(auth, cb);
}
