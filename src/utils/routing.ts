/**
 * Post-login route resolver — single source of truth for all login redirects.
 * Use this function in both OAuth callbacks and email login handlers.
 *
 * Eliminates double-hop redirects and fragmented role-routing logic.
 */

import { getRank, resolveBackendRole } from './permissions';
import { createLogger } from './logger';
import { isCreatorSuperUserEmail, isSuperUserAliasRole } from './superUserAccess';

const authRoutingLogger = createLogger('AuthRouting');

interface PostLoginRouteOptions {
  status?: string | null;
  profileCompleted?: boolean;
}

/**
 * Returns the correct landing path after a successful login based on the user's role.
 *
 * Rank 1 (general users)  → /profile (or /crm when profile is complete)
 * Rank 2 (staff/CRM)      → /crm (or /profile when profile is incomplete)
 * Rank 3 (customers)      → role-specific portal or /crm fallback
 * No role / unknown       → /select-role
 */
export function getPostLoginRoute(
  role: string | null | undefined,
  email?: string | null,
  options?: PostLoginRouteOptions
): string {
  const normalizedStatus = options?.status?.toLowerCase().trim();

  if (normalizedStatus === 'pending') {
    return '/pending-approval';
  }

  if (isSuperUserAliasRole(role) || isCreatorSuperUserEmail(email)) {
    return '/crm';
  }

  if (!role) return '/select-role';

  const resolved = resolveBackendRole(role);
  const rank = getRank(resolved);
  const profileCompleted = options?.profileCompleted;

  if (rank === 0) {
    authRoutingLogger.warn('Unauthorized role mapping hard-failed to safe fallback route', {
      role,
      resolvedRole: resolved,
      status: normalizedStatus ?? 'active',
      auditEvent: 'AUTH_UNAUTHORIZED_ROLE_MAPPING',
    });
    return '/pending-approval';
  }

  if (rank === 1) {
    return profileCompleted === true ? '/crm' : '/profile';
  }

  if (rank === 2) {
    return profileCompleted === false ? '/profile' : '/crm';
  }

  if (rank === 3) {
    if (resolved === 'landlord') return '/landlord-portal';
    if (resolved === 'tenant') return '/tenant-portal';
    if (profileCompleted === false) return '/profile';
    return '/crm';
  }

  return '/pending-approval';
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
