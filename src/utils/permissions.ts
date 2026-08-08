export const ROLES = {
  // Backend CRM roles (primary — these match the database)
  OWNER: 'owner',
  MANAGING_DIRECTOR: 'managing_director',
  DIRECTOR: 'director',
  MANAGER: 'manager',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
  AGENT: 'agent',
  FINANCE: 'finance',
  VIEWER: 'viewer',
  // Customer-facing real-estate roles
  BUYER: 'buyer',
  SELLER: 'seller',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  // Legacy hyphen aliases (kept for backward compat — do not use in new code)
  LEASING_AGENT: 'leasing-agent',
  SALES_AGENT: 'secondary-sales-agent',
  // New canonical underscore roles (v2.0 RBAC redesign)
  HR_STAFF: 'hr_staff',
  ACCOUNTS_STAFF: 'accounts_staff',
  PROPERTY_OWNER: 'property_owner',
  USER: 'user',
  LEASING_AGENT_CANONICAL: 'leasing_agent',
  SALES_AGENT_CANONICAL: 'sales_agent',
};

export const ROLE_HIERARCHY: Record<string, number> = {
  [ROLES.OWNER]: 100,
  [ROLES.MANAGING_DIRECTOR]: 95,
  [ROLES.DIRECTOR]: 85,
  [ROLES.MANAGER]: 90,
  [ROLES.SUPERVISOR]: 70,
  [ROLES.ADMIN]: 80,
  [ROLES.FINANCE]: 70,
  [ROLES.HR_STAFF]: 65,
  [ROLES.ACCOUNTS_STAFF]: 65,
  [ROLES.LEASING_AGENT_CANONICAL]: 55,
  [ROLES.SALES_AGENT_CANONICAL]: 55,
  [ROLES.LEASING_AGENT]: 55,
  [ROLES.SALES_AGENT]: 55,
  [ROLES.AGENT]: 50,
  [ROLES.LANDLORD]: 30,
  [ROLES.PROPERTY_OWNER]: 25,
  [ROLES.SELLER]: 20,
  [ROLES.VIEWER]: 10,
  [ROLES.TENANT]: 10,
  [ROLES.BUYER]: 10,
  [ROLES.USER]: 5,
};

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  EDIT_PROFILE: 'edit_profile',
  VIEW_PROPERTIES: 'view_properties',
  CREATE_PROPERTY: 'create_property',
  EDIT_PROPERTY: 'edit_property',
  DELETE_PROPERTY: 'delete_property',
  VIEW_LEADS: 'view_leads',
  MANAGE_LEADS: 'manage_leads',
  VIEW_CONTRACTS: 'view_contracts',
  CREATE_CONTRACTS: 'create_contracts',
  SIGN_CONTRACTS: 'sign_contracts',
  VIEW_PAYMENTS: 'view_payments',
  PROCESS_PAYMENTS: 'process_payments',
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_SYSTEM_HEALTH: 'view_system_health',
  MANAGE_USERS: 'manage_users',
  MANAGE_AGENTS: 'manage_agents',
  ACCESS_WHATSAPP_BUSINESS: 'access_whatsapp_business',
  CONFIGURE_CHATBOT: 'configure_chatbot',
  VIEW_ALL_REPORTS: 'view_all_reports',
  MODIFY_SETTINGS: 'modify_settings',
  // New permissions — v2.0 RBAC redesign
  SUBMIT_MAINTENANCE: 'submit_maintenance',
  PAY_RENT_ONLINE: 'pay_rent_online',
  VIEW_OWN_LEASE: 'view_own_lease',
  MANAGE_MAINTENANCE: 'manage_maintenance',
  TRACK_OFFERS: 'track_offers',
  SCHEDULE_VIEWINGS: 'schedule_viewings',
  UPLOAD_DOCUMENTS: 'upload_documents',
  MANAGE_HR: 'manage_hr',
  MANAGE_PAYROLL: 'manage_payroll',
  VIEW_COMMISSION: 'view_commission',
  APPROVE_COMMISSION: 'approve_commission',
  MANAGE_RERA_COMPLIANCE: 'manage_rera_compliance',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
  APPROVE_ROLE_REQUEST: 'approve_role_request',
  MANAGE_LISTINGS: 'manage_listings',
  MANAGE_ALL_LISTINGS: 'manage_all_listings',
  EXPORT_REPORTS: 'export_reports',
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.BUYER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.TRACK_OFFERS,
    PERMISSIONS.SCHEDULE_VIEWINGS,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.SELLER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.TRACK_OFFERS,
    PERMISSIONS.SCHEDULE_VIEWINGS,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.LANDLORD]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_OWN_LEASE,
  ],
  [ROLES.TENANT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.SUBMIT_MAINTENANCE,
    PERMISSIONS.PAY_RENT_ONLINE,
    PERMISSIONS.VIEW_OWN_LEASE,
  ],
  [ROLES.LEASING_AGENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_LISTINGS,
    PERMISSIONS.VIEW_COMMISSION,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.LEASING_AGENT_CANONICAL]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_LISTINGS,
    PERMISSIONS.VIEW_COMMISSION,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.SALES_AGENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_LISTINGS,
    PERMISSIONS.VIEW_COMMISSION,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.SALES_AGENT_CANONICAL]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_LISTINGS,
    PERMISSIONS.VIEW_COMMISSION,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.HR_STAFF]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.MANAGE_HR,
    PERMISSIONS.MANAGE_PAYROLL,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  [ROLES.ACCOUNTS_STAFF]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.MANAGE_PAYROLL,
    PERMISSIONS.APPROVE_COMMISSION,
  ],
  [ROLES.PROPERTY_OWNER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_OWN_LEASE,
    PERMISSIONS.MANAGE_MAINTENANCE,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.UPLOAD_DOCUMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  [ROLES.USER]: [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.EDIT_PROFILE, PERMISSIONS.VIEW_PROPERTIES],
  [ROLES.MANAGING_DIRECTOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.DELETE_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SYSTEM_HEALTH,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_AGENTS,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.MANAGE_RERA_COMPLIANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.APPROVE_ROLE_REQUEST,
    PERMISSIONS.MANAGE_ALL_LISTINGS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.APPROVE_COMMISSION,
  ],
  [ROLES.DIRECTOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_AGENTS,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.MANAGE_RERA_COMPLIANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.APPROVE_ROLE_REQUEST,
    PERMISSIONS.MANAGE_ALL_LISTINGS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.APPROVE_COMMISSION,
  ],
  [ROLES.OWNER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.DELETE_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SYSTEM_HEALTH,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_AGENTS,
    PERMISSIONS.ACCESS_WHATSAPP_BUSINESS,
    PERMISSIONS.CONFIGURE_CHATBOT,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.MODIFY_SETTINGS,
    PERMISSIONS.MANAGE_RERA_COMPLIANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.APPROVE_ROLE_REQUEST,
    PERMISSIONS.MANAGE_ALL_LISTINGS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.APPROVE_COMMISSION,
  ],
  [ROLES.SUPERVISOR]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.MANAGE_ALL_LISTINGS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
  // ── Backend CRM roles ──────────────────────────────────────
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.DELETE_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SYSTEM_HEALTH,
    PERMISSIONS.MANAGE_AGENTS,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.MANAGE_RERA_COMPLIANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.APPROVE_ROLE_REQUEST,
    PERMISSIONS.MANAGE_ALL_LISTINGS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.APPROVE_COMMISSION,
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.DELETE_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_SYSTEM_HEALTH,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_AGENTS,
    PERMISSIONS.VIEW_ALL_REPORTS,
    PERMISSIONS.MANAGE_RERA_COMPLIANCE,
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.APPROVE_ROLE_REQUEST,
    PERMISSIONS.MANAGE_ALL_LISTINGS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.APPROVE_COMMISSION,
  ],
  [ROLES.AGENT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.MANAGE_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.CREATE_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.MANAGE_LISTINGS,
    PERMISSIONS.VIEW_COMMISSION,
    PERMISSIONS.UPLOAD_DOCUMENTS,
  ],
  [ROLES.FINANCE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_ALL_REPORTS,
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

export const OWNER_EXCLUSIVE_FEATURES = [
  'whatsapp_business',
  'chatbot_management',
  'system_health',
  'user_management',
  'agent_management',
  'global_settings',
  'all_reports',
];

export const PUBLIC_ROLES = [
  ROLES.BUYER,
  ROLES.SELLER,
  ROLES.LANDLORD,
  ROLES.TENANT,
  ROLES.LEASING_AGENT,
  ROLES.SALES_AGENT,
  ROLES.PROPERTY_OWNER,
  ROLES.USER,
];

// ─── Role alias map ─────────────────────────────────────────────────────────
// Maps frontend / UI role IDs to canonical backend roles.
// Kept in sync with server/middleware/rbac.ts ROLE_ALIAS_MAP.
export const ROLE_ALIAS_MAP: Record<string, string> = {
  lion: 'owner',
  managing_director: 'managing_director',
  director: 'director',
  department_director: 'director',
  supervisor: 'supervisor',
  department_supervisor: 'supervisor',
  real_estate_company: 'owner',
  property_mgmt_company: 'manager',
  super_admin: 'admin',
  branch_manager: 'manager',
  sales_manager: 'manager',
  leasing_manager: 'manager',
  marketing_manager: 'manager',
  // Agent layer — underscore forms are now canonical (self-referential)
  sales_agent: 'sales_agent',
  leasing_agent: 'leasing_agent',
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
  // Canonical identity mappings
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
  // New canonical role identity mappings (v2.0)
  hr_staff: 'hr_staff',
  accounts_staff: 'accounts_staff',
  property_owner: 'property_owner',
  user: 'user',
};

/** Resolve any role string (frontend UI or canonical) to the canonical backend key. */
export function resolveBackendRole(role: string): string {
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_ALIAS_MAP[role] ?? role;
}

// ─── Rank groupings (1=general, 2=staff/CRM, 3=customers/portal) ─────────────
export const RANK_1_ROLES = [ROLES.USER];

export const RANK_2_ROLES = [
  ROLES.OWNER,
  ROLES.MANAGING_DIRECTOR,
  ROLES.DIRECTOR,
  ROLES.MANAGER,
  ROLES.SUPERVISOR,
  ROLES.ADMIN,
  ROLES.HR_STAFF,
  ROLES.ACCOUNTS_STAFF,
  ROLES.AGENT,
  ROLES.LEASING_AGENT,
  ROLES.SALES_AGENT,
  ROLES.LEASING_AGENT_CANONICAL,
  ROLES.SALES_AGENT_CANONICAL,
  ROLES.FINANCE,
  ROLES.VIEWER,
];

export const RANK_3_ROLES = [
  ROLES.LANDLORD,
  ROLES.TENANT,
  ROLES.BUYER,
  ROLES.SELLER,
  ROLES.PROPERTY_OWNER,
];

// ─── Rank helpers ─────────────────────────────────────────────────────────────
export function getRank(role: string | null): number {
  if (!role) return 0;
  const resolved = resolveBackendRole(role);
  if ((RANK_2_ROLES as string[]).includes(resolved)) return 2;
  if ((RANK_3_ROLES as string[]).includes(resolved)) return 3;
  if ((RANK_1_ROLES as string[]).includes(resolved)) return 1;
  return 0;
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

// ─── Permission helpers ──────────────────────────────────────────────────────
export function hasPermission(userRole: string | null, permission: string): boolean {
  if (!userRole || !permission) return false;
  const resolved = resolveBackendRole(userRole);
  // eslint-disable-next-line security/detect-object-injection
  const rolePermissions = ROLE_PERMISSIONS[resolved] || [];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(userRole: string | null, permissions: string[]): boolean {
  if (!userRole || !permissions || permissions.length === 0) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: string | null, permissions: string[]): boolean {
  if (!userRole || !permissions || permissions.length === 0) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function isOwner(userRole: string | null): boolean {
  if (!userRole) return false;
  return resolveBackendRole(userRole) === ROLES.OWNER;
}

export function isAgent(userRole: string | null): boolean {
  if (!userRole) return false;
  const resolved = resolveBackendRole(userRole);
  return (
    resolved === ROLES.AGENT ||
    resolved === ROLES.LEASING_AGENT ||
    resolved === ROLES.SALES_AGENT ||
    resolved === ROLES.LEASING_AGENT_CANONICAL ||
    resolved === ROLES.SALES_AGENT_CANONICAL
  );
}

export function isManager(userRole: string | null): boolean {
  if (!userRole) return false;
  const resolved = resolveBackendRole(userRole);
  return (
    resolved === ROLES.OWNER ||
    resolved === ROLES.MANAGING_DIRECTOR ||
    resolved === ROLES.DIRECTOR ||
    resolved === ROLES.MANAGER
  );
}

export function isAdmin(userRole: string | null): boolean {
  if (!userRole) return false;
  const resolved = resolveBackendRole(userRole);
  return (
    resolved === ROLES.OWNER ||
    resolved === ROLES.MANAGING_DIRECTOR ||
    resolved === ROLES.DIRECTOR ||
    resolved === ROLES.MANAGER ||
    resolved === ROLES.ADMIN
  );
}

export function canAccessFeature(userRole: string | null, featureId: string): boolean {
  if (OWNER_EXCLUSIVE_FEATURES.includes(featureId)) {
    return isOwner(userRole);
  }
  return true;
}

export function getRoleLevel(userRole: string): number {
  const resolved = resolveBackendRole(userRole);
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_HIERARCHY[resolved] || 0;
}

const EMPTY_PERMISSIONS: string[] = [];

export function getPermissionsForRole(role: string): string[] {
  const resolved = resolveBackendRole(role);
  // eslint-disable-next-line security/detect-object-injection
  return ROLE_PERMISSIONS[resolved] || EMPTY_PERMISSIONS;
}
