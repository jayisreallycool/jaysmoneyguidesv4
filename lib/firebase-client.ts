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

/*
|--------------------------------------------------------------------------
| Firebase client configuration
|--------------------------------------------------------------------------
*/

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,

  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    'jaysmoneyguides.firebaseapp.com',

  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'jaysmoneyguides',

  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    'jaysmoneyguides.firebasestorage.app',

  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,

  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

/*
|--------------------------------------------------------------------------
| Firebase app
|--------------------------------------------------------------------------
*/

function getClientApp(): FirebaseApp | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!config.apiKey) {
    console.error(
      'Firebase client is not configured: NEXT_PUBLIC_FIREBASE_API_KEY is missing.'
    );

    return null;
  }

  try {
    if (getApps().length > 0) {
      return getApps()[0];
    }

    app = initializeApp(config);

    return app;
  } catch (error) {
    console.error('Firebase initialization failed:', error);

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Firebase Storage
|--------------------------------------------------------------------------
*/

export function getFirebaseStorage(): FirebaseStorage | null {
  const firebaseApp = getClientApp();

  if (!firebaseApp) {
    return null;
  }

  try {
    return getStorage(firebaseApp);
  } catch (error) {
    console.error('Firebase Storage initialization failed:', error);

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Firebase Auth
|--------------------------------------------------------------------------
*/

export function getFirebaseAuth(): Auth | null {
  const firebaseApp = getClientApp();

  if (!firebaseApp) {
    return null;
  }

  try {
    return getAuth(firebaseApp);
  } catch (error) {
    console.error('Firebase Auth initialization failed:', error);

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Auth configuration check
|--------------------------------------------------------------------------
*/

export function isAuthConfigured(): boolean {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId
  );
}

/*
|--------------------------------------------------------------------------
| Auth result type
|--------------------------------------------------------------------------
*/

export type AuthResult =
  | {
      ok: true;
      user: FirebaseUser;
    }
  | {
      ok: false;
      error: string;
    };

/*
|--------------------------------------------------------------------------
| Firebase error helper
|--------------------------------------------------------------------------
*/

function getFirebaseError(error: unknown): {
  code: string;
  message: string;
} {
  const firebaseError = error as {
    code?: string;
    message?: string;
  };

  return {
    code:
      typeof firebaseError?.code === 'string'
        ? firebaseError.code
        : 'unknown',

    message:
      typeof firebaseError?.message === 'string'
        ? firebaseError.message
        : 'Unknown Firebase authentication error.',
  };
}

/*
|--------------------------------------------------------------------------
| Friendly error messages
|--------------------------------------------------------------------------
*/

function friendlyError(error: unknown): string {
  const { code, message } = getFirebaseError(error);

  const map: Record<string, string> = {
    'auth/invalid-email':
      'That email address looks invalid.',

    'auth/user-not-found':
      'No account found with that email.',

    'auth/wrong-password':
      'Incorrect password. Try again.',

    'auth/invalid-credential':
      'Incorrect email or password.',

    'auth/email-already-in-use':
      'An account with this email already exists — try signing in.',

    'auth/weak-password':
      'Password should be at least 6 characters.',

    'auth/popup-closed-by-user':
      'Sign-in was cancelled.',

    'auth/popup-blocked':
      'Your browser blocked the sign-in popup. Please allow popups and try again.',

    'auth/popup-operation-cancelled':
      'The Google sign-in window was closed. Please try again.',

    'auth/cancelled-popup-request':
      'A Google sign-in request is already running. Please try again.',

    'auth/too-many-requests':
      'Too many attempts. Please wait a moment and try again.',

    'auth/operation-not-allowed':
      'This sign-in method is not enabled in Firebase Authentication.',

    'auth/unauthorized-domain':
      'This website domain is not authorized for Firebase Google sign-in.',

    'auth/invalid-api-key':
      'The Firebase API key is invalid or missing.',

    'auth/app-not-authorized':
      'This Firebase application is not authorized for Google sign-in.',

    'auth/configuration-not-found':
      'Firebase Authentication configuration was not found.',

    'auth/internal-error':
      'Firebase returned an internal authentication error.',

    'auth/network-request-failed':
      'A network error occurred. Check your internet connection and try again.',

    'auth/account-exists-with-different-credential':
      'An account already exists with this email using a different sign-in method.',

    'auth/requires-recent-login':
      'Please sign in again to complete this action.',
  };

  /*
   * IMPORTANT:
   * During debugging, include the Firebase code.
   * This prevents every Firebase problem from becoming
   * the useless "Something went wrong" message.
   */

  const friendly = map[code];

  if (friendly) {
    return `${friendly} [${code}]`;
  }

  return `${message} [${code}]`;

  
}

/*
|--------------------------------------------------------------------------
| Google Sign-In
|--------------------------------------------------------------------------
*/

export async function signInWithGoogle(): Promise<AuthResult> {
  const auth = getFirebaseAuth();

  if (!auth) {
    return {
      ok: false,
      error:
        'Firebase Authentication is not available. Check your Firebase environment variables.',
    };
  }

  try {
    /*
     * Create a fresh Google provider for every login attempt.
     */
    const provider = new GoogleAuthProvider();

    /*
     * Start Firebase's standard Google popup authentication.
     *
     * No custom prompt or additional scopes are necessary
     * for normal Google authentication.
     */
    const credential = await signInWithPopup(
      auth,
      provider
    );

    if (!credential.user) {
      return {
        ok: false,
        error:
          'Google sign-in completed, but Firebase did not return a user.',
      };
    }

    console.log('Google sign-in successful:', {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
    });

    return {
      ok: true,
      user: credential.user,
    };
  } catch (error) {
    const firebaseError = getFirebaseError(error);

    /*
     * Keep the complete error in the browser console.
     * This is extremely useful if Firebase rejects the request.
     */
    console.error('GOOGLE SIGN-IN ERROR:', {
      code: firebaseError.code,
      message: firebaseError.message,
      error,
    });

    return {
      ok: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| Email / Password Sign-In
|--------------------------------------------------------------------------
*/

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const auth = getFirebaseAuth();

  if (!auth) {
    return {
      ok: false,
      error:
        'Firebase Authentication is not available.',
    };
  }

  try {
    const credential =
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    return {
      ok: true,
      user: credential.user,
    };
  } catch (error) {
    console.error('EMAIL SIGN-IN ERROR:', error);

    return {
      ok: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const auth = getFirebaseAuth();

  if (!auth) {
    return {
      ok: false,
      error:
        'Firebase Authentication is not available.',
    };
  }

  try {
    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

    if (name.trim()) {
      await updateProfile(credential.user, {
        displayName: name.trim(),
      });
    }

    return {
      ok: true,
      user: credential.user,
    };
  } catch (error) {
    console.error('REGISTER ERROR:', error);

    return {
      ok: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| Password Reset
|--------------------------------------------------------------------------
*/

export async function sendReset(
  email: string
): Promise<{
  ok: boolean;
  error?: string;
}> {
  const auth = getFirebaseAuth();

  if (!auth) {
    return {
      ok: false,
      error:
        'Firebase Authentication is not available.',
    };
  }

  try {
    await sendPasswordResetEmail(
      auth,
      email.trim()
    );

    return {
      ok: true,
    };
  } catch (error) {
    console.error('PASSWORD RESET ERROR:', error);

    return {
      ok: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| Sign Out
|--------------------------------------------------------------------------
*/

export async function signOutUser(): Promise<void> {
  const auth = getFirebaseAuth();

  if (!auth) {
    return;
  }

  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('SIGN OUT ERROR:', error);
  }
}

/*
|--------------------------------------------------------------------------
| Delete Account
|--------------------------------------------------------------------------
*/

export async function deleteAccount(): Promise<{
  ok: boolean;
  error?: string;
}> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;

  if (!auth || !user) {
    return {
      ok: false,
      error: 'You are not signed in.',
    };
  }

  try {
    /*
     * Google users need recent authentication before
     * Firebase allows sensitive account operations.
     */
    if (
      user.providerData.some(
        (provider) =>
          provider.providerId === 'google.com'
      )
    ) {
      const provider =
        new GoogleAuthProvider();

      await reauthenticateWithPopup(
        user,
        provider
      );
    }

    await fbDeleteUser(user);

    return {
      ok: true,
    };
  } catch (error) {
    console.error('DELETE ACCOUNT ERROR:', error);

    return {
      ok: false,
      error: friendlyError(error),
    };
  }
}

/*
|--------------------------------------------------------------------------
| Auth State Listener
|--------------------------------------------------------------------------
*/

export function watchAuth(
  cb: (user: FirebaseUser | null) => void
): () => void {
  const auth = getFirebaseAuth();

  if (!auth) {
    cb(null);
    return () => {};
  }

  return onAuthStateChanged(
    auth,
    cb
  );
}
