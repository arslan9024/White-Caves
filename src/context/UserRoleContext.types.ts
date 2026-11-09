// FILE: src/context/UserRoleContext.types.ts
/**
 * White Caves Real Estate LLC - Global User Role & RBAC TypeScript Contracts
 * Standard: AEGIS Dual-Track 6x6 RBAC Matrix (6-Level Staff + 6-Category Clients)
 * Single Purpose File Law: < 350 lines
 */

import { ReactNode } from 'react';

// Track A: 6-Level Internal Staff (Hierarchical Operational Clearance)
export type InternalStaffRole =
  | 'employee'           // Level 1: Frontline Agent / Trainee / Operations Staff
  | 'team_leader'        // Level 2: Squad Leader & Direct Field Lead
  | 'supervisor'         // Level 3: Task Domain Supervisor
  | 'manager'            // Level 4: Division Tactical Manager
  | 'director'           // Level 5: Department Pillar Director
  | 'managing_director'; // Level 6: Sovereign Managing Director & Founder

// Track B: 6-Category External Clients & Partners (Domain-Scoped External Portals)
export type ExternalClientRole =
  | 'landlord'           // Category 1: Freehold Property Owner & Asset Custodian
  | 'tenant'             // Category 2: Active / Prospective Leasing Tenant
  | 'buyer'              // Category 3: Registered Luxury Purchaser / Investor
  | 'seller'             // Category 4: Mandated Property Seller / Vendor
  | 'external_agent'     // Category 5: External RERA Broker / Co-Brokerage Partner
  | 'external_company';  // Category 6: Master Developer / Escrow Bank / Conveyancing Partner

// Legacy / Compatibility Aliases
export type LegacyRoleAlias =
  | 'admin'
  | 'agent'
  | 'intern'
  | 'offplan_buyer'
  | 'developer'
  | 'conveyancer'
  | 'contractor'
  | 'guest';

export type UserRole = InternalStaffRole | ExternalClientRole | LegacyRoleAlias;

export type AccessLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type RoleTier =
  | 'Tier 1: Internal Corporate Staff'
  | 'Tier 2: External Client Portals'
  | 'Tier 3: Strategic Partners & Unconfirmed';

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
  isManagingDirector: boolean;
  isFounder: boolean;
  isAuthenticated: boolean;
  isRoleConfirmed: boolean;
  permissions: string[];
  allRoles: UserRole[];
  hasPermission: (permission: string) => boolean;
  hasAccessLevel: (minimumLevel: AccessLevel) => boolean;
  loginAsRole: (role: UserRole) => void;
  confirmRole: (confirmedRole: UserRole, customName?: string) => void;
  clearRole: () => void;
  switchRole: (newRole: UserRole) => void;
}

export interface UserRoleProviderProps {
  children: ReactNode;
  initialUser?: Partial<UserProfile> | null;
}
