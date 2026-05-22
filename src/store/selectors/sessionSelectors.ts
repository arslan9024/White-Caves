import type { RootState } from '../store';
import type { AppUser } from '../userSlice';

/**
 * Canonical session user selector during auth/user slice convergence.
 * Prefers user slice (route guard source), falls back to auth slice.
 */
export const selectSessionUser = (state: RootState): AppUser | null => {
  if (!state) {
    return null;
  }

  const userFromUserSlice = state.user?.currentUser ?? null;
  if (userFromUserSlice) {
    return userFromUserSlice;
  }

  return state.auth?.user ?? null;
};

/** Canonical in-memory access token selector. */
export const selectSessionToken = (state: RootState): string | null => {
  if (!state) {
    return null;
  }

  return state.auth?.token ?? null;
};

/**
 * Canonical authenticated state selector.
 * Uses session user because app route guards rely on user availability.
 */
export const selectIsSessionAuthenticated = (state: RootState): boolean =>
  Boolean(selectSessionUser(state));
