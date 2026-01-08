export const ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
  LEASING_AGENT: 'leasing-agent',
  SALES_AGENT: 'secondary-sales-agent',
  OWNER: 'owner'
};

export const ROLE_HIERARCHY = {
  [ROLES.OWNER]: 100,
  [ROLES.SALES_AGENT]: 50,
  [ROLES.LEASING_AGENT]: 50,
  [ROLES.LANDLORD]: 30,
  [ROLES.SELLER]: 20,
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

export function hasPermission(userRole, permission) {
  if (!userRole || !permission) return false;
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
}

export function hasAnyPermission(userRole, permissions) {
  if (!userRole || !permissions || permissions.length === 0) return false;
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole, permissions) {
  if (!userRole || !permissions || permissions.length === 0) return false;
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function isOwner(userRole) {
  return userRole === ROLES.OWNER;
}

export function isAgent(userRole) {
  return userRole === ROLES.LEASING_AGENT || userRole === ROLES.SALES_AGENT;
}

export function canAccessFeature(userRole, featureId) {
  if (OWNER_EXCLUSIVE_FEATURES.includes(featureId)) {
    return isOwner(userRole);
  }
  return true;
}

export function getRoleLevel(userRole) {
  return ROLE_HIERARCHY[userRole] || 0;
}

export function canManageRole(managerRole, targetRole) {
  return getRoleLevel(managerRole) > getRoleLevel(targetRole);
}

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

export function getRolesWithPermission(permission) {
  return Object.entries(ROLE_PERMISSIONS)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role]) => role);
}

export function getVisibleRolesForNav(currentRole) {
  if (isOwner(currentRole)) {
    return Object.values(ROLES);
  }
  return PUBLIC_ROLES;
}

export function getNavRolesExcludingOwner() {
  return PUBLIC_ROLES;
}
