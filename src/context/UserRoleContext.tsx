/**
 * UserRoleContext — Global User & Role Authority Context
 * Part of the White Caves Global Context Quartet:
 * (ThemeContext + LanguageContext + CurrencyContext + UserRoleContext)
 *
 * White Caves Real Estate LLC — Executive Security & RBAC Suite
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
  FC,
} from 'react';
import { safeStorage } from '../utils/safeStorage';

export type UserRole =
  | 'guest'
  | 'buyer'
  | 'seller'
  | 'landlord'
  | 'tenant'
  | 'agent'
  | 'supervisor'
  | 'manager'
  | 'managing_director'
  | 'admin';

export type AccessLevel = 1 | 2 | 3 | 4 | 5;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  role: UserRole;
  accessLevel: AccessLevel;
  assignedDepartment?: string;
  isManagingDirector: boolean;
  isFounder: boolean;
  permissions: string[];
}

export const ROLE_DEFAULT_LEVELS: Record<UserRole, AccessLevel> = {
  guest: 1,
  buyer: 1,
  seller: 1,
  tenant: 1,
  landlord: 2,
  agent: 2,
  supervisor: 3,
  manager: 4,
  managing_director: 5,
  admin: 5,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  guest: 'Executive Guest',
  buyer: 'Verified Buyer',
  seller: 'Property Seller',
  landlord: 'Asset Owner / Landlord',
  tenant: 'Leasing Tenant',
  agent: 'Licensed Broker (L2)',
  supervisor: 'Team Supervisor (L3)',
  manager: 'Department Manager (L4)',
  managing_director: 'Managing Director (L5 Sovereign)',
  admin: 'System Administrator',
};

export interface UserRoleContextType {
  user: UserProfile | null;
  role: UserRole;
  accessLevel: AccessLevel;
  isAuthenticated: boolean;
  isManagingDirector: boolean;
  isFounder: boolean;
  assignedDepartment: string;
  hasPermission: (permission: string) => boolean;
  hasMinAccessLevel: (minLevel: AccessLevel) => boolean;
  login: (userData: Partial<UserProfile> & { email: string }, token?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  setAccessLevel: (level: AccessLevel) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

const SOVEREIGN_FOUNDER_EMAIL = 'arslanmalikgoraha@gmail.com';

const DEFAULT_GUEST_USER: UserProfile = {
  id: 'guest_user',
  name: 'Executive Guest',
  email: 'guest@whitecaves.com',
  photoURL: 'https://ui-avatars.com/api/?name=Executive+Guest&background=EF4444&color=fff',
  role: 'guest',
  accessLevel: 1,
  assignedDepartment: 'general',
  isManagingDirector: false,
  isFounder: false,
  permissions: ['can_view_properties', 'can_use_calculators'],
};

interface UserRoleProviderProps {
  children: ReactNode;
  initialUser?: UserProfile | null;
}

export const UserRoleProvider: FC<UserRoleProviderProps> = ({ children, initialUser }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (initialUser !== undefined) return initialUser;

    if (typeof window !== 'undefined') {
      const stored = safeStorage.getJSON<UserProfile>('whitecaves_user');
      if (stored && stored.email) {
        const isFounder = stored.email.toLowerCase() === SOVEREIGN_FOUNDER_EMAIL.toLowerCase();
        return {
          ...stored,
          accessLevel: isFounder ? 5 : stored.accessLevel || ROLE_DEFAULT_LEVELS[stored.role] || 1,
          isManagingDirector: isFounder || stored.role === 'managing_director' || stored.role === 'admin',
          isFounder,
          permissions: isFounder ? ['*'] : stored.permissions || [],
        };
      }
    }
    return DEFAULT_GUEST_USER;
  });

  // Sync state to safe storage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (user) {
        safeStorage.setJSON('whitecaves_user', user);
        safeStorage.set('whitecaves_role', user.role);
        safeStorage.set('whitecaves_access_level', String(user.accessLevel));
      } else {
        safeStorage.remove('whitecaves_user');
        safeStorage.remove('whitecaves_role');
        safeStorage.remove('whitecaves_access_level');
      }
    }
  }, [user]);

  const isAuthenticated = useMemo(() => {
    return Boolean(user && user.role !== 'guest' && user.id !== 'guest_user');
  }, [user]);

  const isManagingDirector = useMemo(() => {
    if (!user) return false;
    return (
      user.isManagingDirector ||
      user.isFounder ||
      user.accessLevel === 5 ||
      user.email.toLowerCase() === SOVEREIGN_FOUNDER_EMAIL.toLowerCase()
    );
  }, [user]);

  const isFounder = useMemo(() => {
    if (!user) return false;
    return user.isFounder || user.email.toLowerCase() === SOVEREIGN_FOUNDER_EMAIL.toLowerCase();
  }, [user]);

  const role = user?.role || 'guest';
  const accessLevel = user?.accessLevel || 1;
  const assignedDepartment = user?.assignedDepartment || 'general';

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
      const isFounderUser = userData.email.toLowerCase() === SOVEREIGN_FOUNDER_EMAIL.toLowerCase();
      const defaultRole = isFounderUser ? 'managing_director' : userData.role || 'buyer';
      const defaultLevel = isFounderUser ? 5 : userData.accessLevel || ROLE_DEFAULT_LEVELS[defaultRole] || 2;

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
        assignedDepartment: userData.assignedDepartment || (isFounderUser ? 'executive' : 'sales'),
        isManagingDirector: isFounderUser || defaultRole === 'managing_director' || defaultRole === 'admin',
        isFounder: isFounderUser,
        permissions: isFounderUser
          ? ['*']
          : userData.permissions || ['can_view_properties', 'can_manage_leads', 'can_use_calculators'],
      };

      setUser(newUser);
      if (token) {
        safeStorage.set('whitecaves_token', token);
      }
    },
    []
  );

  const logout = useCallback(() => {
    setUser(DEFAULT_GUEST_USER);
    safeStorage.remove('whitecaves_token');
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser(prev => {
      if (!prev) return null;
      const isFounderUser = prev.email.toLowerCase() === SOVEREIGN_FOUNDER_EMAIL.toLowerCase();
      const newLevel = isFounderUser ? 5 : ROLE_DEFAULT_LEVELS[newRole] || 1;
      return {
        ...prev,
        role: newRole,
        accessLevel: newLevel,
        isManagingDirector: isFounderUser || newRole === 'managing_director' || newRole === 'admin',
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
      assignedDepartment,
      hasPermission,
      hasMinAccessLevel,
      login,
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
      assignedDepartment,
      hasPermission,
      hasMinAccessLevel,
      login,
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
