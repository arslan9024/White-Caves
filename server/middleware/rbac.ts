/**
 * RBAC (Role-Based Access Control) Middleware
 * ────────────────────────────────────────────
 * Provides three composable middleware functions:
 *
 *   requireRole('owner', 'manager')        – allow only listed roles
 *   requirePermission('manage_leads')       – allow roles with the permission
 *   scopeToOwn()                            – attach ownership filter for row-level security
 *
 * Usage:
 *   router.get('/api/leads', requirePermission('view_leads'), handler);
 *   router.delete('/api/leads/:id', requireRole('owner', 'manager'), handler);
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { AppError } from './errorHandler';

// ─── Role alias map ─────────────────────────────────────────────────────────
// Maps frontend / UI role IDs (stored in JWT) to the 12 canonical backend roles.
// If a role is already canonical it maps to itself (or is absent and passes through).
export const ROLE_ALIAS_MAP: Record<string, string> = {
  // Executive → owner
  managing_director: 'owner',
  real_estate_company: 'owner',
  // Executive → manager
  property_mgmt_company: 'manager',
  // Admin
  super_admin: 'admin',
  // Management → manager
  branch_manager: 'manager',
  sales_manager: 'manager',
  leasing_manager: 'manager',
  marketing_manager: 'manager',
  // Agent layer
  sales_agent: 'agent',
  leasing_agent: 'leasing-agent',
  property_manager: 'agent',
  affiliated_agent: 'secondary-sales-agent',
  // Specialist → viewer (read-heavy advisory roles)
  property_consultant: 'viewer',
  mortgage_consultant: 'viewer',
  valuation_expert: 'viewer',
  // Support
  trustee_officer: 'admin',
  legal_officer: 'admin',
  finance_officer: 'finance',
  document_controller: 'admin',
  // Client
  developer: 'seller',
  investor: 'buyer',
  // Identity mappings (canonical roles resolve to themselves)
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

/**
 * Resolve any incoming role string (frontend UI role or legacy alias) to
 * the canonical 12-role backend key used by ROLE_HIERARCHY / ROLE_PERMISSIONS.
 */
export function resolveBackendRole(role: string): string {
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_ALIAS_MAP[role] ?? role;
}

// ─── Role hierarchy (mirrored from src/utils/permissions.ts) ─────────────────
export const ROLE_HIERARCHY: Record<string, number> = {
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

// ─── Permission map (mirrored from src/utils/permissions.ts) ─────────────────
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  buyer: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_contracts',
    'sign_contracts',
    'view_payments',
    'view_appointments',
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
    'view_appointments',
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
    'view_appointments',
  ],
  tenant: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_contracts',
    'sign_contracts',
    'view_payments',
    'view_appointments',
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
    'view_appointments',
    'manage_appointments',
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
    'view_appointments',
    'manage_appointments',
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
    'view_appointments',
    'manage_appointments',
  ],
  finance: [
    'view_dashboard',
    'edit_profile',
    'view_payments',
    'process_payments',
    'view_analytics',
    'view_all_reports',
    'view_appointments',
  ],
  viewer: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_leads',
    'view_contracts',
    'view_payments',
    'view_analytics',
    'view_appointments',
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
    'view_appointments',
    'manage_appointments',
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
    'view_appointments',
    'manage_appointments',
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
    'view_appointments',
    'manage_appointments',
  ],
};

// ─── Helper: check permission for a role ─────────────────────────────────────
export function roleHasPermission(role: string, permission: string): boolean {
  const resolved = resolveBackendRole(role);
  // eslint-disable-next-line security/detect-object-injection
  const perms = ROLE_PERMISSIONS[resolved];
  if (!perms) return false;
  return perms.includes(permission);
}

// ─── requireRole(...roles) ───────────────────────────────────────────────────
/**
 * Express middleware factory. Rejects requests whose `req.user.role`
 * is NOT in the given allow-list.
 *
 * @example
 *   router.delete('/api/leads/:id', requireRole('owner', 'manager', 'admin'), handler);
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return next(new AppError('Authentication required', 401));
    }
    const resolved = resolveBackendRole(userRole);
    if (!allowedRoles.includes(resolved)) {
      return next(new AppError(`Access denied — requires role: ${allowedRoles.join(' | ')}`, 403));
    }
    next();
  };
}

// ─── requirePermission(...permissions) ───────────────────────────────────────
/**
 * Express middleware factory. Rejects requests whose user role
 * does NOT have ANY of the specified permissions.
 *
 * @example
 *   router.get('/api/leads', requirePermission('view_leads'), handler);
 *   router.post('/api/leads', requirePermission('manage_leads'), handler);
 */
export function requirePermission(...requiredPermissions: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return next(new AppError('Authentication required', 401));
    }
    const resolved = resolveBackendRole(userRole);
    const hasAny = requiredPermissions.some(p => roleHasPermission(resolved, p));
    if (!hasAny) {
      return next(
        new AppError(`Access denied — requires permission: ${requiredPermissions.join(' | ')}`, 403)
      );
    }
    next();
  };
}

// ─── requireAllPermissions(...permissions) ───────────────────────────────────
/**
 * Stricter version: require ALL listed permissions (not just one).
 *
 * @example
 *   router.delete('/api/properties/:id', requireAllPermissions('delete_property', 'view_properties'), handler);
 */
export function requireAllPermissions(...requiredPermissions: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return next(new AppError('Authentication required', 401));
    }
    const resolved = resolveBackendRole(userRole);
    const hasAll = requiredPermissions.every(p => roleHasPermission(resolved, p));
    if (!hasAll) {
      return next(
        new AppError(
          `Access denied — requires all permissions: ${requiredPermissions.join(', ')}`,
          403
        )
      );
    }
    next();
  };
}

// ─── requireMinRole(minRole) ─────────────────────────────────────────────────
/**
 * Allow any role at or above the given hierarchy level.
 *
 * @example
 *   router.get('/api/dashboard/analytics', requireMinRole('agent'), handler);
 *   // agent(50), finance(70), admin(80), manager(90), owner(100) all pass
 */
export function requireMinRole(minRole: string) {
  // eslint-disable-next-line security/detect-object-injection
  const minLevel = ROLE_HIERARCHY[minRole] || 0;
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return next(new AppError('Authentication required', 401));
    }
    const resolved = resolveBackendRole(userRole);
    // eslint-disable-next-line security/detect-object-injection
    const userLevel = ROLE_HIERARCHY[resolved] || 0;
    if (userLevel < minLevel) {
      return next(new AppError(`Access denied — minimum role required: ${minRole}`, 403));
    }
    next();
  };
}

// ─── scopeToOwn() ────────────────────────────────────────────────────────────
/**
 * Middleware that attaches an ownership filter to `req.ownershipFilter`.
 * High-privilege users (owner/manager/admin) see all data.
 * Lower roles get `{ userId: req.user.id }` filter applied.
 *
 * Route handlers use it like:
 *   const where = { ...req.ownershipFilter, ...otherFilters };
 *   const leads = await prisma.lead.findMany({ where });
 *
 * @example
 *   router.get('/api/leads', scopeToOwn(), handler);
 */
export function scopeToOwn(ownerField = 'userId') {
  const SUPERVISOR_ROLES = ['owner', 'manager', 'admin'];
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!userRole || !userId) {
      return next(new AppError('Authentication required', 401));
    }

    const resolved = resolveBackendRole(userRole);

    // Supervisors see everything
    if (SUPERVISOR_ROLES.includes(resolved)) {
      (req as AuthRequest & { ownershipFilter: Record<string, unknown> }).ownershipFilter = {};
    } else {
      // Agents/others see only their own data
      (req as AuthRequest & { ownershipFilter: Record<string, unknown> }).ownershipFilter = {
        [ownerField]: userId,
      };
    }
    next();
  };
}
