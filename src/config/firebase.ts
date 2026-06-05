// @ts-nocheck
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  EmailAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateEmail,
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  type Auth,
  type User,
  type ApplicationVerifier
} from 'firebase/auth';
import { safeStorage } from '../utils/safeStorage';
import { createLogger } from '../utils/logger';

const log = createLogger('Firebase');

interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
  } catch (error) {
    log.error('Failed to initialize Firebase app', error);
  }
} else {
  log.warn('Firebase API key is missing; auth features are disabled.');
}

export const auth: Auth | null = authInstance;
export const isFirebaseAuthConfigured = Boolean(authInstance);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export const signInWithGoogle = async () => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithPopup(auth, googleProvider);
};

export const signInWithFacebook = async () => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithPopup(auth, facebookProvider);
};

export const signInWithApple = async () => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithPopup(auth, appleProvider);
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithPhone = async (phoneNumber: string, appVerifier: ApplicationVerifier) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const createRecaptchaVerifier = (elementId: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      
    }
  });
};

export const signOut = async () => {
  if (!auth) throw new Error('Firebase not initialized');
  return await firebaseSignOut(auth);
};

export const updateUserProfile = async (user: User, updates: { displayName?: string | null; photoURL?: string | null }) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await updateProfile(user, updates);
};

export const updateUserEmail = async (user: User, newEmail: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await updateEmail(user, newEmail);
};

export const updateUserPassword = async (user: User, newPassword: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await updatePassword(user, newPassword);
};

export const resetPassword = async (email: string) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await sendPasswordResetEmail(auth, email);
};

export const verifyEmail = async (user: User) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await sendEmailVerification(user);
};

export const setAuthPersistence = async (rememberMe = true) => {
  if (!auth) throw new Error('Firebase not initialized');
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  return await setPersistence(auth, persistence);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export const saveBiometricSession = (user: User, token: string) => {
  const sessionData = {
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    },
    token,
    savedAt: new Date().toISOString(),
  };
  safeStorage.setJSON('biometric_session', sessionData);
};

export const clearBiometricSession = (): void => {
  safeStorage.remove('biometric_session');
};

export { EmailAuthProvider, reauthenticateWithCredential };
export default app;
