import type { NavigateFunction } from 'react-router-dom';
import { loginSuccess, logout as logoutAuthState } from '../store/authSlice';
import { setActiveRole } from '../store/navigationSlice';
import { setUser, type AppUser } from '../store/userSlice';
import type { AppDispatch } from '../store/store';
import { safeStorage } from './safeStorage';
import {
  CANONICAL_SUPERUSER_ROLE,
  isCreatorSuperUserEmail,
  normalizeRoleForUserContext,
} from './superUserAccess';
import {
  canAccessReturnPath,
  getPostLoginRoute,
  getSessionGate,
  sanitizeReturnToPath,
} from './routing';
import { createLogger } from './logger';

export { sanitizeReturnToPath } from './routing';
const log = createLogger('AuthSession');

export const getCurrentPathWithQuery = (pathname: string, search = '', hash = ''): string => {
  return `${pathname}${search}${hash}`;
};

export const resolvePostLoginDestination = (options: {
  user: Pick<AppUser, 'role' | 'status' | 'profileCompleted'> & { email?: string | null };
  returnTo?: string | null;
}): string => {
  const gate = getSessionGate(options.user);
  if (gate) return gate;
  if (isCreatorSuperUserEmail(options.user.email, options.user.role)) {
    return '/profile';
  }

  const normalizedReturnTo = sanitizeReturnToPath(options.returnTo);
  if (normalizedReturnTo && canAccessReturnPath(options.user, normalizedReturnTo)) {
    return normalizedReturnTo;
  }

  const normalizedRole = normalizeRoleForUserContext(options.user.role, options.user.email);

  return getPostLoginRoute(normalizedRole ?? options.user.role, options.user.email, {
    status: options.user.status,
    profileCompleted: options.user.profileCompleted,
  });
};

const persistRolePreference = (
  user: Pick<AppUser, 'role' | 'status'> & { email?: string | null }
): string | null => {
  const normalizedRole = normalizeRoleForUserContext(user.role, user.email);

  if (!normalizedRole) {
    safeStorage.remove('userRole');
    return null;
  }

  safeStorage.setJSON('userRole', {
    role: normalizedRole,
    selectedAt: new Date().toISOString(),
    locked: true,
    status: user.status ?? 'active',
  });

  return normalizedRole;
};

const persistAuthenticatedSessionArtifacts = (options: {
  user: AppUser;
  token?: string | null;
  provider?: string;
  rememberMe?: boolean;
}): void => {
  if (options.token) {
    safeStorage.set('token', options.token);
  }

  safeStorage.setJSON('user', options.user);
  if (options.provider) {
    safeStorage.set('loginProvider', options.provider);
  }
  safeStorage.setJSON('rememberMe', Boolean(options.rememberMe));
};

export const finalizeAuthenticatedSession = (options: {
  dispatch: AppDispatch;
  user: AppUser;
  token?: string | null;
  provider?: string;
  rememberMe?: boolean;
  returnTo?: string | null;
}): string => {
  const resolvedToken = options.token ?? safeStorage.get('token') ?? undefined;
  if (!options.user.id || !options.user.email || !resolvedToken?.trim()) {
    log.warn('Refused incomplete authenticated session');
    throw new Error('Unable to establish your session. Please sign in again.');
  }
  const isManagingDirectorMaster = isCreatorSuperUserEmail(options.user.email, options.user.role);

  const resolvedRole = isManagingDirectorMaster
    ? CANONICAL_SUPERUSER_ROLE
    : normalizeRoleForUserContext(options.user.role, options.user.email);

  const resolvedUser: AppUser = {
    ...options.user,
    role: resolvedRole ?? options.user.role,
    accessLevel: isManagingDirectorMaster ? 5 : (options.user.accessLevel ?? 1),
  };

  persistAuthenticatedSessionArtifacts({
    user: resolvedUser,
    token: resolvedToken,
    provider: options.provider ?? 'backend',
    rememberMe: options.rememberMe ?? false,
  });

  options.dispatch(setUser(resolvedUser));
  options.dispatch(
    loginSuccess({
      user: resolvedUser,
      token: resolvedToken,
      provider: options.provider ?? 'backend',
      rememberMe: options.rememberMe ?? false,
    })
  );

  const persistedRole = persistRolePreference(resolvedUser);
  if (persistedRole) {
    options.dispatch(setActiveRole(persistedRole));
  }

  return resolvePostLoginDestination({
    user: resolvedUser,
    returnTo: options.returnTo,
  });
};

export const completeClientLogout = (dispatch: AppDispatch): void => {
  safeStorage.remove('token');
  safeStorage.remove('userRole');
  safeStorage.remove('user');
  safeStorage.remove('loginProvider');
  safeStorage.remove('rememberMe');
  dispatch(setUser(null));
  dispatch(logoutAuthState(undefined));
};

export const navigateToPostLoginDestination = (
  navigate: NavigateFunction,
  destination: string,
  replace = true
): void => {
  navigate(destination, { replace });
};

export const getReturnToFromLocationState = (state: unknown): string | null => {
  if (!state || typeof state !== 'object') return null;
  const maybeFrom = (state as { from?: unknown }).from;
  return typeof maybeFrom === 'string' ? sanitizeReturnToPath(maybeFrom) : null;
};

export const getPrivilegedRoleFromUser = (user: {
  email?: string | null;
  role?: string | null;
}): string | null => {
  if (isCreatorSuperUserEmail(user.email, user.role)) {
    return CANONICAL_SUPERUSER_ROLE;
  }

  const normalizedRole = normalizeRoleForUserContext(user.role, user.email);
  if (normalizedRole === 'admin') {
    return normalizedRole;
  }

  return null;
};
