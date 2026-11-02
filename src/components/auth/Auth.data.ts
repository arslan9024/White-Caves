/**
 * Auth.data.ts
 * Single-purpose: Static data, constants and local-storage helpers for Auth.
 */

export const AUTH_TOKEN_KEY = 'whitecaves_auth_token';
export const AUTH_USER_KEY = 'whitecaves_user';

export const getAuthToken = (): string | null =>
  localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string): void =>
  void localStorage.setItem(AUTH_TOKEN_KEY, token);

export const removeAuthToken = (): void =>
  void localStorage.removeItem(AUTH_TOKEN_KEY);

export const getStoredUser = <T = unknown>(): T | null => {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: unknown): void =>
  void localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

export const removeStoredUser = (): void =>
  void localStorage.removeItem(AUTH_USER_KEY);

