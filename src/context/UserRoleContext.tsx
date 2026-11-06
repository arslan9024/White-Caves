// FILE: src/context/UserRoleContext.tsx
/**
 * White Caves Real Estate LLC - UserRoleContext Sovereign RBAC Authority
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 & T20 (Server-Enforced RBAC & Role Confirmation)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  FC,
} from 'react';
import { safeStorage } from '../utils/safeStorage';
import { fetchProfile } from '../services/authService';
export * from './UserRoleContext.types';
import type {
  UserRole,
  AccessLevel,
  UserProfile,
  UserRoleContextType,
  UserRoleProviderProps,
} from './UserRoleContext.types';
import {
  ROLE_DEFAULT_LEVELS,
  ROLE_TIERS,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_DEFAULT_DEPARTMENTS,
  ROLE_DEFAULT_PERMISSIONS,
  DEMO_ROLE_PROFILES,
  SOVEREIGN_FOUNDER_EMAILS,
  ALL_SOVEREIGN_ROLES,
  DEFAULT_GUEST_USER,
  buildSovereignProfile,
  syncUserToSafeStorage,
} from './UserRoleContext.data';

export {
  ROLE_DEFAULT_LEVELS,
  ROLE_TIERS,
  ROLE_LABELS,
  ROLE_DESCRIPTIONS,
  ROLE_DEFAULT_DEPARTMENTS,
  ROLE_DEFAULT_PERMISSIONS,
  DEMO_ROLE_PROFILES,
  SOVEREIGN_FOUNDER_EMAILS,
  ALL_SOVEREIGN_ROLES,
  DEFAULT_GUEST_USER,
};

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: FC<UserRoleProviderProps> = ({ children, initialUser }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (initialUser !== undefined) return initialUser;

    if (typeof window !== 'undefined') {
      const stored = safeStorage.getJSON<UserProfile>('whitecaves_user');
      if (stored && stored.email) {
        return buildSovereignProfile(stored);
      }
    }
    return DEFAULT_GUEST_USER;
  });

  // Law T20: Hydrate role & confirmation status from server (/api/auth/profile) when a JWT exists.
  // Any tampered localStorage role is overwritten by the server's authoritative user record.
  useEffect(() => {
    if (initialUser !== undefined || typeof window === 'undefined') return;
    const token = safeStorage.get('token');
    if (!token) return;

    let cancelled = false;
    fetchProfile()
      .then(res => {
        if (cancelled || !res?.success || !res.data?.email) return;
        const serverUser = res.data;
        const serverRole = (serverUser.role || 'guest') as UserRole;
        const serverConfirmed =
          serverUser.isRoleConfirmed ?? (serverRole !== 'guest' && serverUser.status !== 'pending');

        setUser(prev =>
          buildSovereignProfile({
            ...prev,
            id: serverUser.id || prev?.id,
            email: serverUser.email,
            name: serverUser.name || prev?.name,
            photoURL: serverUser.photoUrl || prev?.photoURL,
            phone: serverUser.phone || prev?.phone,
            role: serverRole,
            accessLevel: ROLE_DEFAULT_LEVELS[serverRole],
            assignedDepartment: serverUser.department || ROLE_DEFAULT_DEPARTMENTS[serverRole],
            permissions: ROLE_DEFAULT_PERMISSIONS[serverRole],
            isRoleConfirmed: serverConfirmed,
          })
        );
      })
      .catch(() => {
        // Offline or unit-test environment without backend — retain cached profile
      });

    return () => {
      cancelled = true;
    };
  }, [initialUser]);

  // Cross-storage persistence sync (cache only; server remains authoritative)
  useEffect(() => {
    syncUserToSafeStorage(user);
  }, [user]);

  const isAuthenticated = useMemo(() => {
    return Boolean(user && user.role !== 'guest' && user.id !== 'guest_user');
  }, [user]);

  const isRoleConfirmed = useMemo(() => {
    if (!user) return false;
    if (user.isFounder || user.role === 'managing_director') return true;
    return Boolean(user.isRoleConfirmed && user.role !== 'guest');
  }, [user]);

  const isManagingDirector = useMemo(() => {
    if (!user) return false;
    return (
      user.isManagingDirector ||
      user.isFounder ||
      user.accessLevel === 5 ||
      SOVEREIGN_FOUNDER_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase())
    );
  }, [user]);

  const isFounder = useMemo(() => {
    if (!user) return false;
    return (
      user.isFounder ||
      SOVEREIGN_FOUNDER_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase())
    );
  }, [user]);

  const role = user?.role || 'guest';
  const accessLevel = user?.accessLevel || 1;
  const assignedDepartment = user?.assignedDepartment || 'General';

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user) return false;
      if (isManagingDirector || isFounder || user.permissions.includes('*')) return true;
      return user.permissions.includes(permission);
    },
    [user, isManagingDirector, isFounder]
  );

  const hasMinAccessLevel = useCallback(
    (minLevel: AccessLevel): boolean => {
      if (!user) return false;
      if (isManagingDirector || isFounder) return true;
      return user.accessLevel >= minLevel;
    },
    [user, isManagingDirector, isFounder]
  );

  const login = useCallback(
    (userData: Partial<UserProfile> & { email: string }, token?: string) => {
      setUser(buildSovereignProfile(userData));
      if (token) {
        safeStorage.set('whitecaves_token', token);
        safeStorage.set('token', token);
      }
    },
    []
  );

  const confirmRole = useCallback((confirmedRole: UserRole, customName?: string) => {
    setUser(prev => {
      const base = prev || DEFAULT_GUEST_USER;
      return buildSovereignProfile({
        ...base,
        name: customName || base.name || 'White Caves User',
        role: confirmedRole,
        accessLevel: ROLE_DEFAULT_LEVELS[confirmedRole],
        assignedDepartment: ROLE_DEFAULT_DEPARTMENTS[confirmedRole],
        permissions: ROLE_DEFAULT_PERMISSIONS[confirmedRole],
        isRoleConfirmed: confirmedRole !== 'guest',
      });
    });
  }, []);

  const loginAsRole = useCallback((targetRole: UserRole) => {
    const demoProfile = DEMO_ROLE_PROFILES[targetRole] || DEMO_ROLE_PROFILES.guest;
    setUser(demoProfile);
    syncUserToSafeStorage(demoProfile);
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_GUEST_USER);
    safeStorage.remove('whitecaves_token');
    safeStorage.remove('token');
    syncUserToSafeStorage(null);
    safeStorage.set('whitecaves_role', 'guest');
    safeStorage.set('whitecaves_access_level', '1');
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser(prev => {
      if (!prev) return DEMO_ROLE_PROFILES[newRole];
      return buildSovereignProfile({
        ...prev,
        role: newRole,
        accessLevel: ROLE_DEFAULT_LEVELS[newRole],
        assignedDepartment: ROLE_DEFAULT_DEPARTMENTS[newRole],
        permissions: ROLE_DEFAULT_PERMISSIONS[newRole],
        isRoleConfirmed: newRole !== 'guest',
      });
    });
  }, []);

  const setAccessLevel = useCallback((level: AccessLevel) => {
    setUser(prev => (prev ? { ...prev, accessLevel: level } : null));
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value = useMemo<UserRoleContextType>(
    () => ({
      user,
      role,
      accessLevel,
      isAuthenticated,
      isManagingDirector,
      isFounder,
      isRoleConfirmed,
      assignedDepartment,
      allRoles: ALL_SOVEREIGN_ROLES,
      hasPermission,
      hasMinAccessLevel,
      login,
      loginAsRole,
      confirmRole,
      logout,
      switchRole,
      setAccessLevel,
      updateProfile,
    }),
    [
      user,
      role,
      accessLevel,
      isAuthenticated,
      isManagingDirector,
      isFounder,
      isRoleConfirmed,
      assignedDepartment,
      hasPermission,
      hasMinAccessLevel,
      login,
      loginAsRole,
      confirmRole,
      logout,
      switchRole,
      setAccessLevel,
      updateProfile,
    ]
  );

  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>;
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
