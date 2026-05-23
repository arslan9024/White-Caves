/**
 * usePermission — Frontend RBAC hook
 * ────────────────────────────────────
 * Mirrors the backend ROLE_PERMISSIONS map so that React components can
 * gate content/actions without a server round-trip.
 *
 * Usage:
 *   const canExport = usePermission('export_leads');
 *   const isOwner   = useRole('owner');
 *   const level     = useRoleLevel();  // numeric 0–100
 */

import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

// ─── Inline role alias map (mirrors server/middleware/rbac.ts) ────────────────
const ROLE_ALIAS: Record<string, string> = {
  lion: 'owner',
  managing_director: 'owner',
  real_estate_company: 'owner',
  property_mgmt_company: 'manager',
  super_admin: 'admin',
  branch_manager: 'manager',
  sales_manager: 'manager',
  leasing_manager: 'manager',
  marketing_manager: 'manager',
  sales_agent: 'agent',
  leasing_agent: 'leasing-agent',
  property_manager: 'agent',
  affiliated_agent: 'secondary-sales-agent',
  property_consultant: 'viewer',
  mortgage_consultant: 'viewer',
  valuation_expert: 'viewer',
  trustee_officer: 'admin',
  legal_officer: 'admin',
  finance_officer: 'finance',
  document_controller: 'admin',
  developer: 'seller',
  investor: 'buyer',
  // canonical identities
  owner: 'owner',
  manager: 'manager',
  admin: 'admin',
  finance: 'finance',
  agent: 'agent',
  'secondary-sales-agent': 'secondary-sales-agent',
  'leasing-agent': 'leasing-agent',
  landlord: 'landlord',
  seller: 'seller',
  viewer: 'viewer',
  tenant: 'tenant',
  buyer: 'buyer',
};

// ─── Permission map (mirrors server/middleware/rbac.ts) ───────────────────────
const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  buyer: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_contracts',
    'sign_contracts',
    'view_payments',
  ],
  seller: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'view_leads',
    'view_contracts',
    'view_analytics',
  ],
  landlord: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'view_leads',
    'view_contracts',
    'create_contracts',
    'view_payments',
    'view_analytics',
  ],
  tenant: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_contracts',
    'sign_contracts',
    'view_payments',
  ],
  'leasing-agent': [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'view_leads',
    'manage_leads',
    'view_contracts',
    'create_contracts',
    'view_payments',
    'view_analytics',
  ],
  'secondary-sales-agent': [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'view_leads',
    'manage_leads',
    'view_contracts',
    'create_contracts',
    'view_payments',
    'process_payments',
    'view_analytics',
  ],
  agent: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'view_leads',
    'manage_leads',
    'view_contracts',
    'create_contracts',
    'view_payments',
    'view_analytics',
    'view_commissions',
  ],
  finance: [
    'view_dashboard',
    'edit_profile',
    'view_payments',
    'process_payments',
    'view_analytics',
    'view_all_reports',
    'view_commissions',
    'approve_commissions',
    'export_financial_reports',
  ],
  viewer: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_leads',
    'view_contracts',
    'view_payments',
    'view_analytics',
  ],
  admin: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'delete_property',
    'view_leads',
    'manage_leads',
    'view_contracts',
    'create_contracts',
    'view_payments',
    'view_analytics',
    'view_system_health',
    'manage_users',
    'manage_agents',
    'view_all_reports',
    'view_commissions',
    'approve_commissions',
    'export_leads',
  ],
  manager: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'delete_property',
    'view_leads',
    'manage_leads',
    'view_contracts',
    'create_contracts',
    'view_payments',
    'process_payments',
    'view_analytics',
    'view_system_health',
    'manage_agents',
    'view_all_reports',
    'modify_settings',
    'view_commissions',
    'approve_commissions',
    'export_leads',
    'export_financial_reports',
  ],
  owner: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'delete_property',
    'view_leads',
    'manage_leads',
    'view_contracts',
    'create_contracts',
    'sign_contracts',
    'view_payments',
    'process_payments',
    'view_analytics',
    'view_system_health',
    'manage_users',
    'manage_agents',
    'access_whatsapp_business',
    'configure_chatbot',
    'view_all_reports',
    'modify_settings',
    'view_commissions',
    'approve_commissions',
    'export_leads',
    'export_financial_reports',
  ],
};

// ─── Role hierarchy ───────────────────────────────────────────────────────────
const ROLE_LEVEL: Record<string, number> = {
  owner: 100,
  manager: 90,
  admin: 80,
  finance: 70,
  agent: 50,
  'secondary-sales-agent': 50,
  'leasing-agent': 50,
  landlord: 30,
  seller: 20,
  viewer: 10,
  tenant: 10,
  buyer: 10,
};

/** Resolve a raw role string to its canonical backend key. */
function resolveRole(raw: string): string {
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_ALIAS[raw] ?? raw;
}

// ─── Selectors ────────────────────────────────────────────────────────────────
function selectUserRole(state: RootState): string {
  return state.user?.currentUser?.role ?? '';
}

// ─── Exported hooks ───────────────────────────────────────────────────────────

/**
 * Returns `true` when the current user has the specified permission.
 *
 * @example
 *   const canApprove = usePermission('approve_commissions');
 */
export function usePermission(permission: string): boolean {
  const raw = useSelector(selectUserRole);
  const canonical = resolveRole(raw);
  // eslint-disable-next-line security/detect-object-injection
  const perms = ROLE_PERMISSIONS[canonical];
  return perms?.includes(permission) ?? false;
}

/**
 * Returns `true` when the current user's canonical role matches any of
 * the supplied roles.
 *
 * @example
 *   const isStaff = useRole('owner', 'manager', 'admin');
 */
export function useRole(...roles: string[]): boolean {
  const raw = useSelector(selectUserRole);
  const canonical = resolveRole(raw);
  return roles.some(r => resolveRole(r) === canonical);
}

/**
 * Returns the current user's canonical role level (0–100).
 * Useful for "at least manager level" comparisons.
 *
 * @example
 *   const level = useRoleLevel();
 *   if (level >= 90) { // manager or above }
 */
export function useRoleLevel(): number {
  const raw = useSelector(selectUserRole);
  const canonical = resolveRole(raw);
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_LEVEL[canonical] ?? 0;
}

/**
 * Returns the resolved canonical role string for the current user.
 */
export function useCanonicalRole(): string {
  const raw = useSelector(selectUserRole);
  return resolveRole(raw);
}
