import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  OAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile,
  updateEmail,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let auth = null;

if (firebaseConfig.apiKey) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error.message);
  }
} else {
  console.warn('⚠️ Firebase configuration missing. Please set up environment variables.');
}

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

export const signInWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email, password) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithPhone = async (phoneNumber, appVerifier) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

export const createRecaptchaVerifier = (elementId) => {
  if (!auth) throw new Error('Firebase not initialized');
  return new RecaptchaVerifier(auth, elementId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA verified');
    }
  });
};

export const signOut = async () => {
  if (!auth) throw new Error('Firebase not initialized');
  return await firebaseSignOut(auth);
};

export const updateUserProfile = async (user, updates) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await updateProfile(user, updates);
};

export const updateUserEmail = async (user, newEmail) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await updateEmail(user, newEmail);
};

export const updateUserPassword = async (user, newPassword) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await updatePassword(user, newPassword);
};

export const resetPassword = async (email) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await sendPasswordResetEmail(auth, email);
};

export const verifyEmail = async (user) => {
  if (!auth) throw new Error('Firebase not initialized');
  return await sendEmailVerification(user);
};

export { auth };
export default app;
