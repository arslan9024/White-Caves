// FILE: src/utils/authSession.ts
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
import { getPostLoginRoute } from './routing';
import { buildSovereignProfile, syncUserToSafeStorage } from '../context/UserRoleContext.data';

const BLOCKED_RETURN_TO_PREFIXES = ['/signin', '/signup', '/login', '/auth/signin'];

const isInternalPath = (path: string): boolean => {
  return path.startsWith('/') && !path.startsWith('//') && !/^\/https?:/i.test(path);
};

export const sanitizeReturnToPath = (value?: string | null): string | null => {
  if (!value || typeof value !== 'string') return null;
  const candidate = value.trim();
  if (!candidate) return null;
  if (!isInternalPath(candidate)) return null;
  if (
    BLOCKED_RETURN_TO_PREFIXES.some(
      prefix => candidate === prefix || candidate.startsWith(`${prefix}?`)
    )
  ) {
    return null;
  }
  return candidate;
};

export const getCurrentPathWithQuery = (pathname: string, search = '', hash = ''): string => {
  return `${pathname}${search}${hash}`;
};

export const resolvePostLoginDestination = (options: {
  user: Pick<AppUser, 'role' | 'status' | 'profileCompleted'> & { email?: string | null };
  returnTo?: string | null;
}): string => {
  const normalizedReturnTo = sanitizeReturnToPath(options.returnTo);
  if (normalizedReturnTo) {
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
  const isManagingDirectorMaster = isCreatorSuperUserEmail(options.user.email);

  const resolvedRole = isManagingDirectorMaster
    ? CANONICAL_SUPERUSER_ROLE
    : normalizeRoleForUserContext(options.user.role, options.user.email);

  const resolvedUser: AppUser = {
    ...options.user,
    role: resolvedRole ?? options.user.role,
    accessLevel: isManagingDirectorMaster ? 5 : (options.user.accessLevel ?? 1),
  };

  if (options.token) {
    safeStorage.set('token', options.token);
    safeStorage.set('whitecaves_token', options.token);
  }

  options.dispatch(setUser(resolvedUser));
  options.dispatch(
    loginSuccess({
      user: resolvedUser,
      token: options.token ?? safeStorage.get('token') ?? undefined,
      provider: options.provider ?? 'backend',
      rememberMe: options.rememberMe ?? false,
    })
  );

  // Synchronize UserRoleContext so ModernDashboardPage & DashboardContentRouter
  // immediately reflect the authenticated user (e.g. user-001 Managing Director vs Guest/Client).
  if (resolvedUser.email && typeof window !== 'undefined') {
    const rawUser = options.user as AppUser & {
      photoUrl?: string;
      photoURL?: string;
      isRoleConfirmed?: boolean;
      department?: string;
    };
    const sovereignProfile = buildSovereignProfile({
      id: isManagingDirectorMaster ? resolvedUser.id || 'user-001' : resolvedUser.id,
      email: resolvedUser.email,
      name: resolvedUser.name || resolvedUser.displayName,
      photoURL: rawUser.photoURL || rawUser.photoUrl,
      phone: resolvedUser.phone,
      role: (isManagingDirectorMaster ? 'managing_director' : options.user.role || 'guest') as any,
      assignedDepartment: rawUser.department,
      isRoleConfirmed: isManagingDirectorMaster
        ? true
        : (rawUser.isRoleConfirmed ??
          Boolean(
            options.user.role &&
              options.user.role.toLowerCase() !== 'guest' &&
              resolvedUser.status !== 'pending'
          )),
    });
    window.dispatchEvent(new CustomEvent('whitecaves-auth-sync', { detail: sovereignProfile }));
  }

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
  safeStorage.remove('whitecaves_token');
  safeStorage.remove('userRole');
  safeStorage.remove('user');
  syncUserToSafeStorage(null);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('whitecaves-auth-sync', { detail: null }));
  }
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

export const getReturnToFromLocationState = (state: unknown, search?: string): string | null => {
  if (state && typeof state === 'object') {
    const maybeFrom = (state as { from?: unknown }).from;
    if (typeof maybeFrom === 'string') {
      const sanitized = sanitizeReturnToPath(maybeFrom);
      if (sanitized) return sanitized;
    }
  }

  // Fallback: check URL search parameter (e.g. ?from=/crm/leads or ?from=%2Fcrm)
  if (typeof window !== 'undefined') {
    const query = search !== undefined ? search : window.location.search;
    if (query) {
      try {
        const params = new URLSearchParams(query);
        const fromParam = params.get('from');
        if (fromParam) {
          const sanitized = sanitizeReturnToPath(fromParam);
          if (sanitized) return sanitized;
        }
      } catch {
        // ignore parse error
      }
    }
  }

  return null;
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
