/**
 * Role helper utilities — thin wrappers for common role checks.
 * Import these in components instead of writing inline role comparisons.
 */

import { getRank, resolveBackendRole, ROLE_HIERARCHY } from './permissions';

export { getRank } from './permissions';

export function isOwnerRole(role: string | null): boolean {
  return resolveBackendRole(role ?? '') === 'owner';
}

export function isAdminOrAbove(role: string | null): boolean {
  const resolved = resolveBackendRole(role ?? '');
  // eslint-disable-next-line security/detect-object-injection
  const level = ROLE_HIERARCHY[resolved] ?? 0;
  return level >= 80;
}

export function isStaff(role: string | null): boolean {
  return getRank(role) === 2;
}

export function isCustomer(role: string | null): boolean {
  return getRank(role) === 3;
}

export function isGeneralUser(role: string | null): boolean {
  return getRank(role) === 1;
}

export function isAgentRole(role: string | null): boolean {
  const resolved = resolveBackendRole(role ?? '');
  return [
    'agent',
    'leasing_agent',
    'leasing-agent',
    'sales_agent',
    'secondary-sales-agent',
  ].includes(resolved);
}

export function isHROrAccounts(role: string | null): boolean {
  const resolved = resolveBackendRole(role ?? '');
  return ['hr_staff', 'accounts_staff', 'finance'].includes(resolved);
}

/** Returns a human-readable display name for the given role. */
export function getRoleDisplayName(role: string | null): string {
  const resolved = resolveBackendRole(role ?? '');
  const displayMap: Record<string, string> = {
    owner: 'Managing Director',
    manager: 'Manager',
    admin: 'Admin',
    hr_staff: 'HR',
    accounts_staff: 'Accounts',
    agent: 'Agent',
    leasing_agent: 'Leasing Agent',
    'leasing-agent': 'Leasing Agent',
    sales_agent: 'Sales Agent',
    'secondary-sales-agent': 'Sales Agent',
    finance: 'Finance',
    viewer: 'Viewer',
    landlord: 'Landlord',
    tenant: 'Tenant',
    buyer: 'Buyer',
    seller: 'Seller',
    property_owner: 'Property Owner',
    user: 'User',
  };
  // eslint-disable-next-line security/detect-object-injection
  return displayMap[resolved] ?? role ?? 'Unknown';
}

export function getRoleRank(role: string | null): number {
  return getRank(role);
}

/**
 * Returns a brand color token for the given role.
 * Used in badges, avatars, and role indicators across the UI.
 */
export function getRoleBadgeColor(role: string | null): string {
  const resolved = resolveBackendRole(role ?? '');
  if (resolved === 'owner') return '#EF4444'; // White Caves Red — Managing Director
  if (['admin', 'manager'].includes(resolved)) return '#EF4444'; // indigo
  if (['hr_staff', 'accounts_staff', 'finance'].includes(resolved)) return '#0ea5e9'; // sky blue
  if (
    ['agent', 'leasing_agent', 'leasing-agent', 'sales_agent', 'secondary-sales-agent'].includes(
      resolved
    )
  )
    return '#10b981'; // emerald
  if (resolved === 'landlord') return '#f59e0b'; // amber
  if (resolved === 'tenant') return '#8b5cf6'; // violet
  if (['buyer', 'seller'].includes(resolved)) return '#EF4444'; // blue
  if (resolved === 'property_owner') return '#f97316'; // orange
  return '#6b7280'; // gray — default
}
