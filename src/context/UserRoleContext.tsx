// FILE: src/context/UserRoleContext.tsx
/**
 * White Caves Real Estate LLC - UserRoleContext Sovereign RBAC Authority
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
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
export * from './UserRoleContext.types';
import type {
  UserRole,
  AccessLevel,
  RoleTier,
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
        const isFounder = SOVEREIGN_FOUNDER_EMAILS.some(
          e => e.toLowerCase() === stored.email.toLowerCase()
        );
        const effectiveRole = isFounder ? 'managing_director' : stored.role || 'guest';
        const isConfirmed = isFounder
          ? true
          : (stored.isRoleConfirmed ?? effectiveRole !== 'guest');

        return {
          ...stored,
          role: effectiveRole,
          accessLevel: isFounder
            ? 5
            : stored.accessLevel || ROLE_DEFAULT_LEVELS[effectiveRole] || 1,
          isManagingDirector:
            isFounder || effectiveRole === 'managing_director' || effectiveRole === 'admin',
          isFounder,
          isRoleConfirmed: isConfirmed,
          permissions: isFounder
            ? ['*']
            : stored.permissions || ROLE_DEFAULT_PERMISSIONS[effectiveRole] || [],
        };
      }
    }
    return DEFAULT_GUEST_USER;
  });

  // Cross-storage persistence sync (Turing Protocol Unified SOT)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        safeStorage.setJSON('whitecaves_user', user);
        safeStorage.set('whitecaves_role', user.role);
        safeStorage.set('whitecaves_access_level', String(user.accessLevel));
        safeStorage.setJSON('userRole', {
          category: ROLE_TIERS[user.role],
          role: user.role,
          status: 'active',
          locked: true,
        });
        try {
          localStorage.setItem('white-caves-user', JSON.stringify(user));
          localStorage.setItem('whitecaves_user', JSON.stringify(user));
        } catch {
          // ignore storage quota errors in safari private mode
        }
      } else {
        safeStorage.remove('whitecaves_user');
        safeStorage.remove('whitecaves_role');
        safeStorage.remove('whitecaves_access_level');
        safeStorage.remove('userRole');
        try {
          localStorage.removeItem('white-caves-user');
          localStorage.removeItem('whitecaves_user');
        } catch {
          // ignore
        }
      }
    }
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
      const isFounderUser = SOVEREIGN_FOUNDER_EMAILS.some(
        e => e.toLowerCase() === userData.email.toLowerCase()
      );
      const defaultRole = isFounderUser ? 'managing_director' : userData.role || 'guest';
      const defaultLevel = isFounderUser
        ? 5
        : userData.accessLevel || ROLE_DEFAULT_LEVELS[defaultRole] || 1;
      const isConfirmed = isFounderUser
        ? true
        : (userData.isRoleConfirmed ?? defaultRole !== 'guest');

      const newUser: UserProfile = {
        id: userData.id || `user_${Date.now()}`,
        name: userData.name || (isFounderUser ? 'Arslan Malik Bashir Ahmad' : 'White Caves User'),
        email: userData.email,
        photoURL:
          userData.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            userData.name || 'User'
          )}&background=EF4444&color=fff`,
        phone: userData.phone || '+971505110636',
        role: defaultRole,
        accessLevel: defaultLevel,
        assignedDepartment: userData.assignedDepartment || ROLE_DEFAULT_DEPARTMENTS[defaultRole],
        isManagingDirector:
          isFounderUser || defaultRole === 'managing_director' || defaultRole === 'admin',
        isFounder: isFounderUser,
        isRoleConfirmed: isConfirmed,
        permissions: isFounderUser
          ? ['*']
          : userData.permissions ||
            ROLE_DEFAULT_PERMISSIONS[defaultRole] || ['can_view_properties'],
      };

      setUser(newUser);
      if (token) {
        safeStorage.set('whitecaves_token', token);
        safeStorage.set('token', token);
      }
    },
    []
  );

  /** Explicitly confirms user role and unblocks sovereign portal navigation */
  const confirmRole = useCallback((confirmedRole: UserRole, customName?: string) => {
    setUser(prev => {
      const base = prev || DEFAULT_GUEST_USER;
      const isFounderUser = SOVEREIGN_FOUNDER_EMAILS.some(
        e => e.toLowerCase() === base.email.toLowerCase()
      );
      const effectiveRole = isFounderUser ? 'managing_director' : confirmedRole;
      const effectiveLevel = isFounderUser ? 5 : ROLE_DEFAULT_LEVELS[effectiveRole] || 1;

      const confirmedProfile: UserProfile = {
        ...base,
        name: customName || base.name || 'White Caves User',
        role: effectiveRole,
        accessLevel: effectiveLevel,
        assignedDepartment: ROLE_DEFAULT_DEPARTMENTS[effectiveRole],
        isManagingDirector:
          isFounderUser || effectiveRole === 'managing_director' || effectiveRole === 'admin',
        isFounder: isFounderUser,
        isRoleConfirmed: true,
        permissions: isFounderUser ? ['*'] : ROLE_DEFAULT_PERMISSIONS[effectiveRole],
      };

      return confirmedProfile;
    });
  }, []);

  /** Fast 1-click login as any of the 14 Sovereign roles */
  const loginAsRole = useCallback((targetRole: UserRole) => {
    const demoProfile = DEMO_ROLE_PROFILES[targetRole] || DEMO_ROLE_PROFILES.guest;
    setUser(demoProfile);
    safeStorage.setJSON('whitecaves_user', demoProfile);
    safeStorage.set('whitecaves_role', demoProfile.role);
    safeStorage.set('whitecaves_access_level', String(demoProfile.accessLevel));
  }, []);

  const logout = useCallback(() => {
    setUser(DEFAULT_GUEST_USER);
    safeStorage.remove('whitecaves_token');
    safeStorage.remove('token');
    safeStorage.remove('whitecaves_user');
    safeStorage.set('whitecaves_role', 'guest');
    safeStorage.set('whitecaves_access_level', '1');
    try {
      localStorage.removeItem('white-caves-user');
      localStorage.removeItem('whitecaves_user');
      localStorage.removeItem('userRole');
    } catch {
      // ignore
    }
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser(prev => {
      if (!prev) return DEMO_ROLE_PROFILES[newRole];
      const isFounderUser = SOVEREIGN_FOUNDER_EMAILS.some(
        e => e.toLowerCase() === prev.email.toLowerCase()
      );
      const newLevel = isFounderUser ? 5 : ROLE_DEFAULT_LEVELS[newRole] || 1;
      return {
        ...prev,
        role: newRole,
        accessLevel: newLevel,
        assignedDepartment: ROLE_DEFAULT_DEPARTMENTS[newRole],
        isManagingDirector: isFounderUser || newRole === 'managing_director' || newRole === 'admin',
        isFounder: isFounderUser,
        isRoleConfirmed: true,
        permissions: isFounderUser
          ? ['*']
          : ROLE_DEFAULT_PERMISSIONS[newRole] || ['can_view_properties'],
      };
    });
  }, []);

  const setAccessLevel = useCallback((level: AccessLevel) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        accessLevel: level,
      };
    });
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        ...updates,
      };
    });
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

export default UserRoleContext;
