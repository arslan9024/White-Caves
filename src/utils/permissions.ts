export const ROLES = {
  // Backend CRM roles (primary — these match the database)
  OWNER: 'owner',
  MANAGER: 'manager',
  ADMIN: 'admin',
  AGENT: 'agent',
  FINANCE: 'finance',
  VIEWER: 'viewer',
  // Customer-facing real-estate roles
  BUYER: 'buyer',
  SELLER: 'seller',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  LEASING_AGENT: 'leasing-agent',
  SALES_AGENT: 'secondary-sales-agent',
};

export const ROLE_HIERARCHY = {
  [ROLES.OWNER]: 100,
  [ROLES.MANAGER]: 90,
  [ROLES.ADMIN]: 80,
  [ROLES.FINANCE]: 70,
  [ROLES.AGENT]: 50,
  [ROLES.SALES_AGENT]: 50,
  [ROLES.LEASING_AGENT]: 50,
  [ROLES.LANDLORD]: 30,
  [ROLES.SELLER]: 20,
  [ROLES.VIEWER]: 10,
  [ROLES.TENANT]: 10,
  [ROLES.BUYER]: 10
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
  MODIFY_SETTINGS: 'modify_settings'
};

export const ROLE_PERMISSIONS = {
  [ROLES.BUYER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS
  ],
  [ROLES.SELLER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.CREATE_PROPERTY,
    PERMISSIONS.EDIT_PROPERTY,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_ANALYTICS
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
    PERMISSIONS.VIEW_ANALYTICS
  ],
  [ROLES.TENANT]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.SIGN_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS
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
    PERMISSIONS.VIEW_ANALYTICS
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
    PERMISSIONS.VIEW_ANALYTICS
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
    PERMISSIONS.MODIFY_SETTINGS
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
    PERMISSIONS.MODIFY_SETTINGS
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
    PERMISSIONS.VIEW_ALL_REPORTS
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
    PERMISSIONS.VIEW_ANALYTICS
  ],
  [ROLES.FINANCE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.PROCESS_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_ALL_REPORTS
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.EDIT_PROFILE,
    PERMISSIONS.VIEW_PROPERTIES,
    PERMISSIONS.VIEW_LEADS,
    PERMISSIONS.VIEW_CONTRACTS,
    PERMISSIONS.VIEW_PAYMENTS,
    PERMISSIONS.VIEW_ANALYTICS
  ]
};

export const OWNER_EXCLUSIVE_FEATURES = [
  'whatsapp_business',
  'chatbot_management',
  'system_health',
  'user_management',
  'agent_management',
  'global_settings',
  'all_reports'
];

export const PUBLIC_ROLES = [
  ROLES.BUYER,
  ROLES.SELLER,
  ROLES.LANDLORD,
  ROLES.TENANT,
  ROLES.LEASING_AGENT,
  ROLES.SALES_AGENT
];

// ─── Role alias map ─────────────────────────────────────────────────────────
// Maps frontend / UI role IDs to the 12 canonical backend roles.
// Kept in sync with server/middleware/rbac.ts ROLE_ALIAS_MAP.
export const ROLE_ALIAS_MAP: Record<string, string> = {
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
};

/** Resolve any role string (frontend UI or canonical) to the 12-role backend key. */
export function resolveBackendRole(role: string): string {
  return ROLE_ALIAS_MAP[role] ?? role;
}

export function hasPermission(userRole: string | null, permission: string): boolean {
  if (!userRole || !permission) return false;
  const resolved = resolveBackendRole(userRole);
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
  return resolved === ROLES.AGENT || resolved === ROLES.LEASING_AGENT || resolved === ROLES.SALES_AGENT;
}

export function isManager(userRole: string | null): boolean {
  if (!userRole) return false;
  const resolved = resolveBackendRole(userRole);
  return resolved === ROLES.OWNER || resolved === ROLES.MANAGER;
}

export function isAdmin(userRole: string | null): boolean {
  if (!userRole) return false;
  const resolved = resolveBackendRole(userRole);
  return resolved === ROLES.OWNER || resolved === ROLES.MANAGER || resolved === ROLES.ADMIN;
}

export function canAccessFeature(userRole: string | null, featureId: string): boolean {
  if (OWNER_EXCLUSIVE_FEATURES.includes(featureId)) {
    return isOwner(userRole);
  }
  return true;
}

export function getRoleLevel(userRole: string): number {
  const resolved = resolveBackendRole(userRole);
  return ROLE_HIERARCHY[resolved] || 0;
}

const EMPTY_PERMISSIONS: string[] = [];

export function getPermissionsForRole(role: string): string[] {
  return ROLE_PERMISSIONS[role] || EMPTY_PERMISSIONS;
}
