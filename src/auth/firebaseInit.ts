import { signInWithGoogle, signInWithFacebook, signInWithApple, signInWithEmail, signUpWithEmail, signInWithPhone, createRecaptchaVerifier, signOut, handleRedirectResult } from '../config/firebase';

export { signInWithGoogle, signInWithFacebook, signInWithApple, signInWithEmail, signUpWithEmail, signInWithPhone, createRecaptchaVerifier, signOut, handleRedirectResult };

import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { createLogger } from '../utils/logger';

import { loadSecrets } from '../utils/loadSecrets';
loadSecrets();

const log = createLogger('FirebaseInit');

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: 'AIzaSyAxILHSxAHQ0x3HqDkRIOGNePNQ0vv193I',
  authDomain: 'white-caves-fb.firebaseapp.com',
  projectId: 'white-caves-fb',
  storageBucket: 'white-caves-fb.firebasestorage.app',
  messagingSenderId: '536150736818',
  appId: '1:536150736818:web:4754b355390403d9696eab',
};

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
};

const requiredKeys: Record<string, string | undefined> = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
};

const missingKeys = Object.entries(requiredKeys)
  .filter(([, v]) => !v)
  .map(([k]) => k);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

if (missingKeys.length === 0) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  } catch (e) {
    log.error('Failed to init Firebase', e);
  }
} else {
  log.warn(`Firebase auth disabled – missing: ${missingKeys.join(', ')}`);
}

export const firebaseApp = app;
export const firebaseAuth = authInstance;
export const isFirebaseConfigured = Boolean(authInstance);
export const firebaseMissingReason = missingKeys.length
  ? `Missing environment variables: ${missingKeys.join(', ')}`
  : '';

// Compatibility aliases for legacy imports
export const isFirebaseAuthConfigured = isFirebaseConfigured;
export const firebaseAuthUnavailableReason = firebaseMissingReason;

