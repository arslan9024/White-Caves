// FILE: src/context/UserRoleContext.types.ts
/**
 * White Caves Real Estate LLC - Global User Role & RBAC TypeScript Contracts
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import { ReactNode } from 'react';

export type UserRole =
  | 'managing_director'
  | 'manager'
  | 'supervisor'
  | 'agent'
  | 'intern'
  | 'tenant'
  | 'landlord'
  | 'buyer'
  | 'seller'
  | 'offplan_buyer'
  | 'developer'
  | 'conveyancer'
  | 'contractor'
  | 'guest'
  | 'admin';

export type AccessLevel = 1 | 2 | 3 | 4 | 5;

export type RoleTier =
  | 'Tier 1: Internal Corporate'
  | 'Tier 2: Client Portals'
  | 'Tier 3: Strategic Partners';

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
  isRoleConfirmed: boolean;
  permissions: string[];
}

export interface UserRoleContextType {
  user: UserProfile | null;
  role: UserRole;
  accessLevel: AccessLevel;
  isAuthenticated: boolean;
  isManagingDirector: boolean;
  isFounder: boolean;
  isRoleConfirmed: boolean;
  assignedDepartment: string;
  allRoles: UserRole[];
  hasPermission: (permission: string) => boolean;
  hasMinAccessLevel: (minLevel: AccessLevel) => boolean;
  login: (userData: Partial<UserProfile> & { email: string }, token?: string) => void;
  loginAsRole: (role: UserRole) => void;
  confirmRole: (confirmedRole: UserRole, customName?: string) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  setAccessLevel: (level: AccessLevel) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

export interface UserRoleProviderProps {
  children: ReactNode;
  initialUser?: UserProfile | null;
}
