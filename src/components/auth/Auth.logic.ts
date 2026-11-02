/**
 * Auth.logic.ts
 * Single-purpose: All auth business logic — social, email, phone handlers.
 * Used by Auth.tsx via the useAuthLogic hook.
 */

import { createRecaptchaVerifier, signOut as firebaseSignOut } from '../../auth/firebaseInit';
import {
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
  signInWithEmail,
  signUpWithEmail,
  signInWithPhone,
} from '../../auth/firebaseInit';
import type { AuthUser } from './Auth.types';
import {
  setAuthToken,
  setStoredUser,
  removeAuthToken,
  removeStoredUser,
} from './Auth.data';

// ─── Error messages ─────────────────────────────────────────────────────────

export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/popup-closed-by-user': 'Sign-in cancelled. Please try again.',
  'auth/popup-blocked': 'Popup blocked. Please allow popups for this site.',
  'auth/unauthorized-domain': 'This domain is not authorized. Please add it in Firebase Console.',
  'auth/account-exists-with-different-credential':
    'An account already exists with this email using a different sign-in method.',
  'auth/email-already-in-use': 'This email is already registered. Switch to "Sign In" mode.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found. Switch to "Sign Up" to create one.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/operation-not-allowed': 'Email sign-in is not enabled in Firebase Console.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/invalid-phone-number': 'Invalid phone number. Please include country code.',
  'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
};

export function resolveFirebaseError(code: string | undefined, fallback: string): string {
  return (code && FIREBASE_ERROR_MESSAGES[code]) ?? fallback;
}

// ─── Social sign-in ──────────────────────────────────────────────────────────

type SocialProvider = 'google' | 'facebook' | 'apple';

const SOCIAL_SIGN_IN_FNS = {
  google: signInWithGoogle,
  facebook: signInWithFacebook,
  apple: signInWithApple,
} as const;

export async function handleSocialSignIn(provider: SocialProvider): Promise<AuthUser> {
  const fn = SOCIAL_SIGN_IN_FNS[provider];
  const result = await fn();
  const firebaseUser = result.user;
  const token = await firebaseUser.getIdToken();

  const user: AuthUser = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split('@')[0] ||
      `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
    photoUrl: firebaseUser.photoURL,
    provider,
  };

  setAuthToken(token);
  setStoredUser(user);
  return user;
}

// ─── Email sign-in / sign-up ─────────────────────────────────────────────────

export async function handleEmailAuth(
  email: string,
  password: string,
  name: string,
  isSignUp: boolean,
): Promise<AuthUser> {
  const credential = isSignUp
    ? await signUpWithEmail(email, password)
    : await signInWithEmail(email, password);

  const firebaseUser = credential.user;
  const token = await firebaseUser.getIdToken();

  const user: AuthUser = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: name || firebaseUser.displayName || (firebaseUser.email?.split('@')[0] ?? 'User'),
    photoUrl: firebaseUser.photoURL,
    provider: 'email',
  };

  setAuthToken(token);
  setStoredUser(user);
  return user;
}

// ─── Phone OTP ───────────────────────────────────────────────────────────────

export function setupRecaptcha(containerId: string): void {
  if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
    window.recaptchaVerifier = createRecaptchaVerifier(containerId);
  }
}

export async function sendPhoneOTP(
  phone: string,
): Promise<import('firebase/auth').ConfirmationResult> {
  setupRecaptcha('recaptcha-container');
  const verifier = window.recaptchaVerifier;
  if (!verifier) throw new Error('reCAPTCHA verifier not initialized');
  return signInWithPhone(phone, verifier);
}

export async function verifyPhoneOTP(
  confirmationResult: import('firebase/auth').ConfirmationResult,
  otp: string,
  phone: string,
): Promise<AuthUser> {
  const credential = await confirmationResult.confirm(otp);
  const firebaseUser = credential.user;
  const token = await firebaseUser.getIdToken();

  const user: AuthUser = {
    id: firebaseUser.uid,
    email: firebaseUser.email,
    phone: firebaseUser.phoneNumber,
    name: firebaseUser.displayName || 'User',
    photoUrl: firebaseUser.photoURL,
    provider: 'phone',
  };

  setAuthToken(token);
  setStoredUser(user);
  return user;
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function handleLogout(): Promise<void> {
  await firebaseSignOut();
  removeAuthToken();
  removeStoredUser();
}
