/**
 * Authentication Service — Backend JWT Integration
 *
 * Handles login, registration, and token management via the backend API.
 * Firebase social/phone auth results are synced to the backend for JWT issuance.
 */

import { apiClient } from '../utils/apiClient';
import { safeStorage } from '../utils/safeStorage';
import { auth as firebaseAuth } from '../config/firebase';
import { HttpError } from '../utils/HttpError';
import { authFetch } from '../utils/authFetch';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  department?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  profileCompleted?: boolean;
  profileCompletion?: {
    roleCategory: 'general' | 'client' | 'agent' | 'leadership';
    requiredFields: Array<'name' | 'phone' | 'department'>;
    optionalFields: Array<'name' | 'phone' | 'department'>;
    missingFields: Array<'name' | 'phone' | 'department'>;
  };
}

/** Shape of `data` when login succeeds normally */
export interface LoginSuccessData {
  token: string;
  user: AuthUser;
}

/** Shape of `data` when the account has 2FA enabled — a challenge token is issued instead */
export interface TwoFactorChallengeData {
  twoFactorToken: string;
}

export interface LoginResponse {
  success: boolean;
  data: LoginSuccessData | TwoFactorChallengeData;
  requiresTwoFactor?: boolean;
}

/**
 * Dedicated response type for Firebase-sync and social-auth endpoints.
 * These flows never trigger a 2FA challenge, so the data always contains
 * a full session token and user object.
 */
export interface FirebaseSyncResponse {
  success: boolean;
  data: LoginSuccessData;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: AuthUser;
}

export interface ForgotPasswordRequestResponse {
  success: boolean;
  data: {
    requested: boolean;
    expiresInMinutes: number;
    message: string;
  };
}

export interface ForgotPasswordVerifyResponse {
  success: boolean;
  data: {
    verified: boolean;
    resetSessionToken: string;
  };
}

export interface ForgotPasswordResetResponse {
  success: boolean;
  data: {
    reset: boolean;
    message: string;
  };
}

// ─── Token helpers ──────────────────────────────────────────────────────────

const TOKEN_KEY = 'token'; // Must match authFetch.ts key

/** Persist the JWT and configure apiClient for subsequent requests */
function persistToken(token: string): void {
  safeStorage.set(TOKEN_KEY, token);
  apiClient.setAuthToken(token);
}

/** Clear token from storage and apiClient */
function clearToken(): void {
  safeStorage.remove(TOKEN_KEY);
  apiClient.setAuthToken(null);
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(valueParts.join('='));
    }
  }
  return null;
}

function resolveFirebaseSyncErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    const data = error.data;

    if (typeof data === 'object' && data !== null) {
      const asRecord = data as Record<string, unknown>;
      const payloadMessage =
        (typeof asRecord.message === 'string' && asRecord.message.trim()) ||
        (typeof asRecord.error === 'string' && asRecord.error.trim()) ||
        (typeof asRecord.details === 'string' && asRecord.details.trim()) ||
        '';

      if (payloadMessage) {
        if (/too many login attempts from this ip/i.test(payloadMessage)) {
          return 'Backend session activation is temporarily rate-limited. Please retry Google sign-in in a few seconds.';
        }
        if (/too many firebase session sync attempts/i.test(payloadMessage)) {
          return 'Backend session activation is temporarily rate-limited. Please retry Google sign-in in a few seconds.';
        }
        return payloadMessage;
      }
    }

    if (error.message?.trim()) {
      return error.message.trim();
    }

    if (error.status === 401) {
      return 'Firebase token verification failed. Please sign in with Google again.';
    }

    if (error.status === 503) {
      return 'Authentication service is temporarily unavailable on the server. Please try again shortly.';
    }

    if (error.status === 429) {
      return 'Backend session activation is temporarily rate-limited. Please retry Google sign-in in a few seconds.';
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string' &&
    (error as { message: string }).message.trim()
  ) {
    return (error as { message: string }).message.trim();
  }

  return 'Unable to complete authentication sync';
}

function isTransientFirebaseSyncError(error: unknown): boolean {
  if (error instanceof HttpError) {
    if (error.status === 429 || error.status === 503 || error.status === 504) {
      return true;
    }

    const data = error.data;
    if (typeof data === 'object' && data !== null) {
      const payload = data as Record<string, unknown>;
      const payloadMessage =
        (typeof payload.message === 'string' && payload.message) ||
        (typeof payload.error === 'string' && payload.error) ||
        '';

      if (/temporarily|timeout|rate[- ]?limit|too many|try again/i.test(payloadMessage)) {
        return true;
      }
    }

    if (/temporarily|timeout|rate[- ]?limit|too many|try again/i.test(error.message || '')) {
      return true;
    }
  }

  if (error instanceof Error) {
    return /network|timeout|fetch failed|econnreset|temporarily/i.test(error.message || '');
  }

  return false;
}

const wait = (ms: number): Promise<void> =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

/** Restore token from storage on app init */
export function restoreAuthToken(): string | null {
  const token = safeStorage.get(TOKEN_KEY);
  if (token) {
    apiClient.setAuthToken(token);
  }
  return token;
}

// ─── Auth API ───────────────────────────────────────────────────────────────

/**
 * Login with email and password via the backend.
 * Returns user data and stores the JWT.
 */
export async function loginWithEmail(email: string, password: string): Promise<LoginResponse> {
  const response = (await apiClient.post('/auth/login', { email, password })) as LoginResponse;

  // When 2FA is required the backend returns a challenge token, not a session token.
  // Do not try to persist a JWT in that case — the caller must complete 2FA first.
  if (response.success && !response.requiresTwoFactor) {
    const successData = response.data as LoginSuccessData;
    if (!successData?.token) {
      throw new Error('Login succeeded but no authentication token was returned');
    }
    persistToken(successData.token);
  }

  return response;
}

/**
 * Complete a 2FA-gated login by verifying the TOTP code (or backup recovery code).
 * Persists the returned JWT and fetches the current user profile.
 */
export async function verifyTwoFactor(email: string, code: string): Promise<AuthUser> {
  const response = (await apiClient.post('/auth/verify-2fa', { email, code })) as {
    success: boolean;
    data: { token: string; verified: boolean };
  };

  if (!response.success || !response.data?.token) {
    throw new Error('Two-factor verification failed');
  }

  persistToken(response.data.token);

  const profile = await fetchProfile();
  return profile.data;
}

/**
 * Request a password reset challenge for the given email.
 */
export async function requestPasswordReset(email: string): Promise<ForgotPasswordRequestResponse> {
  return (await apiClient.post('/auth/forgot-password/request', {
    email,
  })) as ForgotPasswordRequestResponse;
}

/**
 * Verify the reset token sent for the user.
 */
export async function verifyPasswordResetToken(
  email: string,
  token: string
): Promise<ForgotPasswordVerifyResponse> {
  return (await apiClient.post('/auth/forgot-password/verify', {
    email,
    token,
  })) as ForgotPasswordVerifyResponse;
}

/**
 * Complete password reset after token verification.
 */
export async function resetPasswordWithToken(
  resetSessionToken: string,
  newPassword: string
): Promise<ForgotPasswordResetResponse> {
  return (await apiClient.post('/auth/forgot-password/reset', {
    resetSessionToken,
    newPassword,
  })) as ForgotPasswordResetResponse;
}

/**
 * Register a new user via the backend.
 * Returns user data and stores the JWT.
 */
export async function registerWithEmail(
  email: string,
  password: string,
  name?: string,
  phone?: string,
  department?: string,
  category?: string,
  role?: string
): Promise<RegisterResponse> {
  const response = (await apiClient.post('/auth/register', {
    email,
    password,
    name,
    phone,
    department,
    category,
    role,
  })) as RegisterResponse;

  if (response.success) {
    if (!response.data?.token) {
      throw new Error('Registration succeeded but no authentication token was returned');
    }
    persistToken(response.data.token);
  }

  return response;
}

/**
 * Sync a Firebase-authenticated user with the backend.
 * If the user doesn't exist, creates them; if they do, issues a JWT.
 * This bridges Firebase social/phone auth with backend JWT auth.
 */
export async function syncFirebaseUser(firebaseUser: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  getIdToken?: (forceRefresh?: boolean) => Promise<string>;
}): Promise<FirebaseSyncResponse> {
  let response: FirebaseSyncResponse | null = null;
  const maxAttempts = 3;

  const resolveFirebaseToken = async (forceRefresh: boolean): Promise<string> => {
    let resolvedToken: string | null = null;

    if (typeof firebaseUser.getIdToken === 'function') {
      resolvedToken = await firebaseUser.getIdToken(forceRefresh);
    }

    if (!resolvedToken && firebaseAuth?.currentUser?.uid === firebaseUser.uid) {
      resolvedToken = await firebaseAuth.currentUser.getIdToken(forceRefresh);
    }

    if (!resolvedToken) {
      throw new Error(
        'Firebase authentication token is missing. Please retry Google sign-in to establish a secure backend session.'
      );
    }

    return resolvedToken;
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const forceRefresh = attempt > 1;

    try {
      const firebaseToken = await resolveFirebaseToken(forceRefresh);
      response = (await apiClient.post('/auth/firebase-sync', {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoUrl: firebaseUser.photoURL,
        firebaseToken,
      })) as FirebaseSyncResponse;
      break;
    } catch (error: unknown) {
      const canRetry = attempt < maxAttempts && isTransientFirebaseSyncError(error);
      if (canRetry) {
        await wait(400 * attempt);
        continue;
      }

      throw new Error(resolveFirebaseSyncErrorMessage(error));
    }
  }

  if (!response) {
    throw new Error('Unable to complete authentication sync');
  }

  if (!response.success) {
    throw new Error('Backend session setup was rejected. Please try Google sign-in again.');
  }

  if (!response.data?.token) {
    throw new Error('Firebase sync succeeded but no authentication token was returned');
  }

  persistToken(response.data.token);

  return response;
}

/**
 * Fetch the current user's profile using the stored JWT.
 */
export async function fetchProfile(): Promise<ProfileResponse> {
  return (await apiClient.get('/auth/profile')) as ProfileResponse;
}

/**
 * Change the current user's password.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean }> {
  return (await apiClient.put('/auth/password', {
    currentPassword,
    newPassword,
  })) as { success: boolean };
}

/**
 * Complete registration for a social-auth user who has just selected their role.
 * The user was already created by syncFirebaseUser; this call updates their role/category
 * using the JWT that syncFirebaseUser stored.
 */
export async function completeSocialRegistration(
  category: string,
  role: string
): Promise<RegisterResponse> {
  const response = (await apiClient.post('/auth/complete-social-registration', {
    category,
    role,
  })) as RegisterResponse;

  if (response.success) {
    if (!response.data?.token) {
      throw new Error('Backend returned success but missing authentication token');
    }
    persistToken(response.data.token);
  }

  return response;
}

/**
 * Logout — clears JWT and user state.
 */
export async function logout(): Promise<void> {
  const csrfToken = getCookieValue('csrf_token');
  try {
    await authFetch('/api/auth/logout', {
      method: 'POST',
      headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
      body: JSON.stringify({}),
    });
  } catch {
    // Best effort only — local client cleanup still proceeds.
  }
  clearToken();
  safeStorage.remove('userRole');
}
