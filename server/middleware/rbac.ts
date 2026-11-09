/**
 * RBAC (Role-Based Access Control) Middleware
 * ────────────────────────────────────────────
 * Provides composable middleware functions:
 *
 *   requireRole('owner', 'manager')        – allow only listed roles
 *   requirePermission('manage_leads')       – allow roles with the permission
 *   requireMinRole('agent')                 – allow roles at or above hierarchy level
 *   requireMinRank(2)                       – allow roles at or above rank tier (1/2/3)
 *   scopeToOwn()                            – attach ownership filter for row-level security
 *
 * Usage:
 *   router.get('/api/leads', requirePermission('view_leads'), handler);
 *   router.delete('/api/leads/:id', requireRole('owner', 'manager'), handler);
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { AppError } from './errorHandler.js';

// ─── Role alias map ─────────────────────────────────────────────────────────
// Maps frontend / UI role IDs (stored in JWT) to canonical backend roles.
// If a role is already canonical it maps to itself (or is absent and passes through).
export const ROLE_ALIAS_MAP: Record<string, string> = {
  // Level 6: Managing Director / Owner
  managing_director: 'owner',
  lion: 'owner',
  real_estate_company: 'owner',
  super_admin: 'admin',

  // Level 5: Director
  director: 'director',

  // Level 4: Manager
  manager: 'manager',
  branch_manager: 'manager',
  sales_manager: 'manager',
  leasing_manager: 'manager',
  marketing_manager: 'manager',
  property_mgmt_company: 'manager',

  // Level 3: Supervisor
  supervisor: 'supervisor',

  // Level 2: Team Leader
  team_leader: 'team_leader',
  lead: 'team_leader',
  squad_leader: 'team_leader',

  // Level 1: Employee / Agent
  employee: 'employee',
  agent: 'agent',
  sales_agent: 'sales_agent',
  leasing_agent: 'leasing_agent',
  property_manager: 'agent',
  intern: 'employee',
  staff: 'employee',
  affiliated_agent: 'secondary-sales-agent',

  // Client Portals (Track B: Categories 1 - 6)
  landlord: 'landlord',
  tenant: 'tenant',
  buyer: 'buyer',
  seller: 'seller',
  external_agent: 'external_agent',
  external_company: 'external_company',
  developer: 'external_company',
  investor: 'buyer',
  offplan_buyer: 'buyer',
  conveyancer: 'external_company',
  contractor: 'external_company',

  // Specialist → viewer
  property_consultant: 'viewer',
  mortgage_consultant: 'viewer',
  valuation_expert: 'viewer',
  // Support
  trustee_officer: 'admin',
  legal_officer: 'admin',
  finance_officer: 'finance',
  document_controller: 'admin',
  // Identity mappings — canonical roles resolve to themselves
  owner: 'owner',
  admin: 'admin',
  finance: 'finance',
  'secondary-sales-agent': 'secondary-sales-agent',
  'leasing-agent': 'leasing-agent',
  viewer: 'viewer',
  hr_staff: 'hr_staff',
  accounts_staff: 'accounts_staff',
  property_owner: 'property_owner',
  user: 'user',
};

/**
 * Resolve any incoming role string (frontend UI role or legacy alias) to
 * the canonical backend key used by ROLE_HIERARCHY / ROLE_PERMISSIONS.
 */
export function resolveBackendRole(role: string): string {
  if (!role || typeof role !== 'string') return 'user';
  const normalized = role.toLowerCase().trim();
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_ALIAS_MAP[normalized] ?? normalized;
}

// ─── Role hierarchy (Level 1..6 internal staff, plus client portal tiers) ──
export const ROLE_HIERARCHY: Record<string, number> = {
  // Track A: Internal Staff (6 Levels)
  owner: 100, // Level 6: Managing Director & Owner
  managing_director: 100,
  director: 95, // Level 5: Department Pillar Director
  manager: 90, // Level 4: Division Manager
  admin: 80,
  supervisor: 75, // Level 3: Task Supervisor
  finance: 70,
  hr_staff: 65,
  accounts_staff: 65,
  team_leader: 60, // Level 2: Squad Team Leader
  leasing_agent: 55,
  sales_agent: 55,
  'leasing-agent': 55,
  'secondary-sales-agent': 55,
  agent: 50,
  employee: 50, // Level 1: Corporate Employee / Agent

  // Track B: External Clients & Partners
  external_company: 35, // Category 6: External Company / Developer / Bank
  external_agent: 32, // Category 5: External RERA Broker
  landlord: 30, // Category 1: Landlord
  property_owner: 25,
  seller: 20, // Category 4: Seller
  tenant: 10, // Category 2: Tenant
  buyer: 10, // Category 3: Buyer
  viewer: 10,
  user: 5,
};

// ─── Role rank (1 = general user, 2 = staff/CRM, 3 = customer/portal) ────────
export const ROLE_RANK: Record<string, number> = {
  user: 1,
  owner: 2,
  managing_director: 2,
  director: 2,
  manager: 2,
  supervisor: 2,
  team_leader: 2,
  employee: 2,
  admin: 2,
  hr_staff: 2,
  accounts_staff: 2,
  agent: 2,
  leasing_agent: 2,
  sales_agent: 2,
  'leasing-agent': 2,
  'secondary-sales-agent': 2,
  finance: 2,
  viewer: 2,
  landlord: 3,
  tenant: 3,
  buyer: 3,
  seller: 3,
  external_agent: 3,
  external_company: 3,
  property_owner: 3,
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
    'track_offers',
    'schedule_viewings',
    'upload_documents',
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
    'track_offers',
    'schedule_viewings',
    'upload_documents',
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
    'manage_maintenance',
    'view_own_lease',
  ],
  tenant: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'view_contracts',
    'sign_contracts',
    'view_payments',
    'submit_maintenance',
    'pay_rent_online',
    'view_own_lease',
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
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'manage_listings',
    'view_commission',
    'upload_documents',
  ],
  leasing_agent: [
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
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'manage_listings',
    'view_commission',
    'upload_documents',
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
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'manage_listings',
    'view_commission',
    'upload_documents',
  ],
  sales_agent: [
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
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'manage_listings',
    'view_commission',
    'upload_documents',
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
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'manage_listings',
    'view_commission',
    'upload_documents',
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
  hr_staff: [
    'view_dashboard',
    'edit_profile',
    'manage_hr',
    'manage_payroll',
    'view_all_reports',
    'export_reports',
  ],
  accounts_staff: [
    'view_dashboard',
    'edit_profile',
    'view_payments',
    'process_payments',
    'view_commissions',
    'approve_commissions',
    'view_all_reports',
    'export_reports',
    'manage_payroll',
    'approve_commission',
  ],
  property_owner: [
    'view_dashboard',
    'edit_profile',
    'view_properties',
    'create_property',
    'edit_property',
    'view_own_lease',
    'manage_maintenance',
    'view_payments',
    'view_contracts',
    'sign_contracts',
    'upload_documents',
    'view_analytics',
  ],
  user: ['view_dashboard', 'edit_profile', 'view_properties'],
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
    'access_whatsapp_business',
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'assign_whatsapp_conversations',
    'close_whatsapp_conversations',
    'manage_rera_compliance',
    'view_audit_logs',
    'approve_role_request',
    'manage_all_listings',
    'export_reports',
    'approve_commission',
    'manage_marketing',
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
    'access_whatsapp_business',
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'assign_whatsapp_conversations',
    'close_whatsapp_conversations',
    'manage_rera_compliance',
    'view_audit_logs',
    'approve_role_request',
    'manage_all_listings',
    'export_reports',
    'approve_commission',
    'manage_marketing',
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
    'view_whatsapp_conversations',
    'reply_whatsapp_conversations',
    'assign_whatsapp_conversations',
    'close_whatsapp_conversations',
    'configure_chatbot',
    'view_all_reports',
    'modify_settings',
    'view_commissions',
    'approve_commissions',
    'export_leads',
    'export_financial_reports',
    'manage_rera_compliance',
    'view_audit_logs',
    'approve_role_request',
    'manage_all_listings',
    'manage_marketing',
    'export_reports',
    'approve_commission',
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

// ─── getRoleRank ─────────────────────────────────────────────────────────────
export function getRoleRank(role: string): number {
  const resolved = resolveBackendRole(role);
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_RANK[resolved] ?? 1;
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
  const normalizedAllowed = allowedRoles.map(r => resolveBackendRole(r));
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return next(new AppError('Authentication required', 401));
    }
    const resolved = resolveBackendRole(userRole);
    if (!normalizedAllowed.includes(resolved)) {
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
  const resolvedMinRole = resolveBackendRole(minRole);
  // eslint-disable-next-line security/detect-object-injection
  const minLevel = ROLE_HIERARCHY[resolvedMinRole] ?? ROLE_HIERARCHY[minRole] ?? 0;
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

// ─── requireMinRank(minRank) ─────────────────────────────────────────────────
/**
 * Allow users whose rank tier is >= minRank.
 * Rank 1 = general users, Rank 2 = staff/CRM, Rank 3 = customers/portal
 *
 * @example
 *   router.get('/crm/dashboard', requireMinRank(2), handler); // staff only
 */
export function requireMinRank(minRank: number) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole) return next(new AppError('Authentication required', 401));
    const rank = getRoleRank(userRole);
    if (rank < minRank)
      return next(new AppError(`Access denied — minimum rank ${minRank} required`, 403));
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
  // Sanitize field identifier to prevent prototype pollution or invalid key injection
  const safeField = /^[a-zA-Z0-9_]+$/.test(ownerField) ? ownerField : 'userId';
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (!userRole || !userId) {
      return next(new AppError('Authentication required', 401));
    }

    const resolved = resolveBackendRole(userRole);
    const isSupervisor = SUPERVISOR_ROLES.includes(resolved) || ((req.user?.accessLevel ?? 0) >= 5);

    // Supervisors see everything
    if (isSupervisor) {
      req.ownershipFilter = {};
    } else {
      // Agents/others see only their own data
      req.ownershipFilter = { [safeField]: userId };
    }
    next();
  };
}
