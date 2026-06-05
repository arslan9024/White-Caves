/**
 * Post-login route resolver — single source of truth for all login redirects.
 * Use this function in both OAuth callbacks and email login handlers.
 *
 * Eliminates double-hop redirects and fragmented role-routing logic.
 */

import { getRank, resolveBackendRole } from './permissions';
import { isCreatorSuperUserEmail, isSuperUserAliasRole } from './superUserAccess';

/**
 * Returns the correct landing path after a successful login based on the user's role.
 *
 * Rank 1 (general users)  → /profile
 * Rank 2 (staff/CRM)      → /profile
 * Rank 3 (customers)      → /profile
 * No role / unknown       → /select-role
 */
export function getPostLoginRoute(
  role: string | null | undefined,
  email?: string | null
): string {
  if (isSuperUserAliasRole(role) || isCreatorSuperUserEmail(email)) {
    return '/profile';
  }

  if (!role) return '/select-role';

  const resolved = resolveBackendRole(role);
  const rank = getRank(resolved);

  if (rank === 1) return '/profile';

  if (rank === 2) {
    return '/profile';
  }

  if (rank === 3) {
    return '/profile';
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
  if (rank === 2) return '/crm';
  if (rank === 3) {
    if (resolved === 'landlord') return '/landlord-portal';
    if (resolved === 'tenant') return '/tenant-portal';
    return '/crm';
  }
  return '/crm';
}
