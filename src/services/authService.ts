/**
 * Authentication Service — Backend JWT Integration
 *
 * Handles login, registration, and token management via the backend API.
 * Firebase social/phone auth results are synced to the backend for JWT issuance.
 */

import { apiClient } from '../utils/apiClient';
import { safeStorage } from '../utils/safeStorage';

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
  const firebaseToken =
    typeof firebaseUser.getIdToken === 'function' ? await firebaseUser.getIdToken() : null;

  const response = (await apiClient.post('/auth/firebase-sync', {
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    photoUrl: firebaseUser.photoURL,
    firebaseToken,
  })) as LoginResponse;

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
 * Logout — clears JWT and user state.
 */
export function logout(): void {
  clearToken();
  safeStorage.remove('userRole');
}
