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

const BLOCKED_RETURN_TO_PREFIXES = ['/signin', '/signup', '/login', '/auth/signin'];

const isInternalPath = (path: string): boolean => {
  return path.startsWith('/') && !path.startsWith('//') && !/^\/https?:/i.test(path);
};

export const sanitizeReturnToPath = (value?: string | null): string | null => {
  if (!value || typeof value !== 'string') return null;
  const candidate = value.trim();
  if (!candidate) return null;
  if (!isInternalPath(candidate)) return null;
  if (BLOCKED_RETURN_TO_PREFIXES.some(prefix => candidate === prefix || candidate.startsWith(`${prefix}?`))) {
    return null;
  }
  return candidate;
};

export const getCurrentPathWithQuery = (pathname: string, search = '', hash = ''): string => {
  return `${pathname}${search}${hash}`;
};

export const resolvePostLoginDestination = (options: {
  user: Pick<AppUser, 'role' | 'status'> & { email?: string | null };
  returnTo?: string | null;
}): string => {
  const normalizedReturnTo = sanitizeReturnToPath(options.returnTo);
  if (normalizedReturnTo) {
    return normalizedReturnTo;
  }

  if (options.user.status === 'pending') {
    return '/pending-approval';
  }

  const normalizedRole = normalizeRoleForUserContext(options.user.role, options.user.email);

  if (!normalizedRole) {
    return '/select-role';
  }

  if (normalizedRole === 'tenant') {
    return '/tenant-portal';
  }

  if (normalizedRole === 'landlord' || normalizedRole === 'property-owner') {
    return '/landlord-portal';
  }

  if (isCreatorSuperUserEmail(options.user.email)) {
    return '/crm';
  }

  return '/crm';
};

const persistRolePreference = (
  user: Pick<AppUser, 'role' | 'status'> & { email?: string | null }
): string | null => {
  const normalizedRole = normalizeRoleForUserContext(user.role, user.email);

  if (!normalizedRole) {
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

export const finalizeAuthenticatedSession = (options: {
  dispatch: AppDispatch;
  user: AppUser;
  token?: string | null;
  provider?: string;
  rememberMe?: boolean;
  returnTo?: string | null;
}): string => {
  const resolvedRole = normalizeRoleForUserContext(options.user.role, options.user.email);
  const resolvedUser: AppUser = {
    ...options.user,
    role: resolvedRole ?? options.user.role,
  };

  options.dispatch(setUser(resolvedUser));
  options.dispatch(
    loginSuccess({
      user: resolvedUser,
      token: options.token ?? safeStorage.get('token') ?? undefined,
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

export const getReturnToFromLocationState = (
  state: unknown
): string | null => {
  if (!state || typeof state !== 'object') return null;
  const maybeFrom = (state as { from?: unknown }).from;
  return typeof maybeFrom === 'string' ? sanitizeReturnToPath(maybeFrom) : null;
};

export const getPrivilegedRoleFromUser = (user: {
  email?: string | null;
  role?: string | null;
}): string | null => {
  if (isCreatorSuperUserEmail(user.email)) {
    return CANONICAL_SUPERUSER_ROLE;
  }

  const normalizedRole = normalizeRoleForUserContext(user.role, user.email);
  if (normalizedRole === 'admin') {
    return normalizedRole;
  }

  return null;
};
