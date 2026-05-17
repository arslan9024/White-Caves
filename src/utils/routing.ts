/**
 * Post-login route resolver — single source of truth for all login redirects.
 * Use this function in both OAuth callbacks and email login handlers.
 *
 * Eliminates double-hop redirects and fragmented role-routing logic.
 */

import { getRank, resolveBackendRole } from './permissions';

/**
 * Returns the correct landing path after a successful login based on the user's role.
 *
 * Rank 1 (general users)  → /app/home
 * Rank 2 (staff/CRM)      → /crm/dashboard (or role-specific sub-path)
 * Rank 3 (customers)      → /portal/dashboard (or role-specific sub-path)
 * No role / unknown       → /select-role
 */
export function getPostLoginRoute(role: string | null | undefined): string {
  if (!role) return '/select-role';

  const resolved = resolveBackendRole(role);
  const rank = getRank(resolved);

  if (rank === 1) return '/app/home';

  if (rank === 2) {
    switch (resolved) {
      case 'owner':
      case 'admin':
      case 'manager':
        return '/crm/dashboard';
      case 'leasing_agent':
      case 'leasing-agent':
        return '/crm/leasing';
      case 'sales_agent':
      case 'secondary-sales-agent':
        return '/crm/sales';
      case 'hr_staff':
        return '/crm/hr';
      case 'accounts_staff':
      case 'finance':
        return '/crm/accounts';
      default:
        return '/crm/dashboard';
    }
  }

  if (rank === 3) {
    switch (resolved) {
      case 'landlord':
        return '/portal/landlord';
      case 'tenant':
        return '/portal/tenant';
      case 'buyer':
        return '/portal/buyer';
      case 'seller':
        return '/portal/seller';
      case 'property_owner':
        return '/portal/owner';
      default:
        return '/portal/dashboard';
    }
  }

  return '/select-role';
}

/**
 * Returns the legacy CRM path for backward compatibility with existing routes.
 * Use getPostLoginRoute() for all new code.
 */
export function getLegacyCrmRoute(role: string | null | undefined): string {
  if (!role) return '/signin';
  const resolved = resolveBackendRole(role);
  const rank = getRank(resolved);
  if (rank === 2) return '/dashboard';
  if (rank === 3) {
    if (resolved === 'landlord') return '/landlord-portal';
    if (resolved === 'tenant') return '/tenant-portal';
    return '/dashboard';
  }
  return '/';
}
