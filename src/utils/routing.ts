/**
 * Post-login route resolver — single source of truth for all login redirects.
 * Use this function in both OAuth callbacks and email login handlers.
 *
 * Eliminates double-hop redirects and fragmented role-routing logic.
 */

import { getRank, resolveBackendRole } from './permissions';
import { createLogger } from './logger';
import { isCreatorSuperUserEmail, normalizeRoleToken } from './superUserAccess';

const authRoutingLogger = createLogger('AuthRouting');

interface PostLoginRouteOptions {
  status?: string | null;
  profileCompleted?: boolean;
}

export interface SessionRouteUser extends PostLoginRouteOptions {
  role?: string | null;
  email?: string | null;
}

/** Only server-issued roles may be supplied here; storage preferences are not identity. */
export function getSessionRole(role?: string | null): string | null {
  const normalized = normalizeRoleToken(role);
  if (!normalized) return null;
  if (normalized === 'md') return 'managing_director';
  if (normalized === 'property-owner') return 'property_owner';
  return resolveBackendRole(normalized);
}

/** Mandatory gates apply on both login and direct protected-route navigation. */
export function getSessionGate(user: SessionRouteUser): string | null {
  const status = user.status?.trim().toLowerCase();
  if (status && status !== 'active') return '/pending-approval';
  const role = getSessionRole(user.role);
  if (!role) return '/select-role';
  if (getRank(role) === 0) return '/pending-approval';
  if (user.profileCompleted === false || (role === 'user' && user.profileCompleted !== true)) {
    return '/profile';
  }
  return null;
}

const AUTH_PATHS = [
  '/signin',
  '/signup',
  '/login',
  '/auth',
  '/forgot-password',
  '/reset-password',
  '/select-role',
  '/pending-approval',
];
const ROUTING_ORIGIN = 'https://internal.whitecaves.invalid';

export function sanitizeReturnToPath(value?: string | null): string | null {
  if (typeof value !== 'string') return null;
  const candidate = value.trim();
  if (
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    /[\\\u0000-\u0020\u007f]/.test(candidate)
  )
    return null;
  try {
    const parsed = new URL(candidate, ROUTING_ORIGIN);
    const decodedPath = decodeURIComponent(parsed.pathname).toLowerCase();
    if (
      parsed.origin !== ROUTING_ORIGIN ||
      /[\\\u0000-\u0020\u007f%]/.test(decodedPath) ||
      decodedPath.startsWith('//') ||
      [...AUTH_PATHS, '/api'].some(
        prefix => decodedPath === prefix || decodedPath.startsWith(`${prefix}/`)
      )
    )
      return null;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return null;
  }
}

/** Match known route families; the actual protected route and API still enforce access. */
export function canAccessReturnPath(user: SessionRouteUser, path: string): boolean {
  const pathname = new URL(path, ROUTING_ORIGIN).pathname.toLowerCase();
  const role = getSessionRole(user.role);
  const within = (prefix: string): boolean =>
    pathname === prefix || pathname.startsWith(`${prefix}/`);
  if (within('/owner') || within('/lion') || within('/md') || pathname === '/status') {
    return role === 'owner' || role === 'managing_director' || role === 'admin';
  }
  if (within('/tenant-portal') || within('/tenant')) return role === 'tenant';
  if (within('/landlord-portal') || within('/landlord'))
    return role === 'landlord' || role === 'property_owner';
  if (within('/buyer')) return role === 'buyer';
  if (within('/seller')) return role === 'seller';
  if (within('/leasing-agent')) return role === 'leasing-agent' || role === 'leasing_agent';
  if (within('/secondary-sales-agent'))
    return role === 'secondary-sales-agent' || role === 'sales_agent';
  if (
    within('/crm') ||
    pathname === '/dashboard' ||
    pathname === '/modern-dashboard' ||
    pathname === '/nadia'
  ) {
    return role !== 'tenant' && role !== 'landlord' && role !== 'property_owner';
  }
  return (
    pathname === '/' ||
    [
      '/profile',
      '/properties',
      '/property',
      '/about',
      '/services',
      '/contact',
      '/tools',
      '/market',
      '/valuation',
    ].some(within)
  );
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
  const gate = getSessionGate({ role, email, ...options });
  if (gate) {
    if (getRank(getSessionRole(role)) === 0 && role) {
      authRoutingLogger.warn('Unauthorized role mapping hard-failed to safe fallback route', {
        role,
        resolvedRole: getSessionRole(role),
        status: options?.status ?? 'active',
        auditEvent: 'AUTH_UNAUTHORIZED_ROLE_MAPPING',
      });
    }
    return gate;
  }
  if (isCreatorSuperUserEmail(email, role)) {
    return '/profile';
  }
  const resolved = getSessionRole(role);
  if (resolved === 'landlord' || resolved === 'property_owner') return '/landlord-portal';
  if (resolved === 'tenant') return '/tenant-portal';
  return '/crm';
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
