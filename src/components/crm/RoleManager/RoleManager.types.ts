// FILE: src/components/crm/RoleManager/RoleManager.types.ts
/**
 * White Caves Real Estate LLC - Role Manager & RBAC Architecture Contracts (Tier 5)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import type { UserRole, AccessLevel, RoleTier } from '../../../context/UserRoleContext';

export interface SovereignRoleDefinition {
  id: UserRole;
  code: string;
  name: string;
  tier: RoleTier;
  accessLevel: AccessLevel;
  department: string;
  description: string;
  permissions: string[];
  assignedCount: number;
  isExecutive: boolean;
  canImpersonate: boolean;
}

export interface RoleFilterState {
  searchQuery: string;
  selectedTier: 'ALL' | 'TIER_1' | 'TIER_2' | 'TIER_3';
  selectedAccessLevel: 'ALL' | '1' | '2' | '3' | '4' | '5';
}

export interface RoleAuditVerificationResult {
  roleId: UserRole;
  passed: boolean;
  clearanceVerified: boolean;
  privilegeEscalationRisk: boolean;
  auditAttestationToken: string;
  verificationTimestamp: number;
}
