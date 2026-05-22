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

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  department?: string | null;
  photoUrl?: string | null;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
  requiresTwoFactor?: boolean;
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

  if (response.success) {
    if (!response.data?.token) {
      throw new Error('Login succeeded but no authentication token was returned');
    }
    persistToken(response.data.token);
  }

  return response;
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
  getIdToken?: () => Promise<string>;
}): Promise<LoginResponse> {
  let firebaseToken: string | null = null;

  if (typeof firebaseUser.getIdToken === 'function') {
    firebaseToken = await firebaseUser.getIdToken();
  }

  if (!firebaseToken && firebaseAuth?.currentUser?.uid === firebaseUser.uid) {
    firebaseToken = await firebaseAuth.currentUser.getIdToken();
  }

  if (!firebaseToken) {
    throw new Error(
      'Firebase authentication token is missing. Please retry Google sign-in to establish a secure backend session.'
    );
  }

  let response: LoginResponse;
  try {
    response = (await apiClient.post('/auth/firebase-sync', {
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      photoUrl: firebaseUser.photoURL,
      firebaseToken,
    })) as LoginResponse;
  } catch (error: unknown) {
    throw new Error(resolveFirebaseSyncErrorMessage(error));
  }

  if (response.success) {
    if (!response.data?.token) {
      throw new Error('Firebase sync succeeded but no authentication token was returned');
    }
    persistToken(response.data.token);
  }

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
  return (await apiClient.post('/auth/change-password', {
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
export function logout(): void {
  clearToken();
  safeStorage.remove('userRole');
}
