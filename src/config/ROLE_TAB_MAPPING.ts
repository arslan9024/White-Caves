/**
 * ROLE TAB MAPPING CONFIGURATION
 * Defines which tabs are available for each role in the UnifiedDashboard
 *
 * This is the source of truth for role-based UI rendering
 */

// ─── Types ──────────────────────────────────────────────────────────────

export type RoleKey =
  | 'lion'
  | 'owner'
  | 'buyer'
  | 'seller'
  | 'landlord'
  | 'leasing-agent'
  | 'secondary-sales-agent'
  | 'tenant';

export interface RoleTab {
  id: string;
  label: string;
  icon: string;
}

export interface RoleConfig {
  label: string;
  tabs: RoleTab[];
  description: string;
}

export interface RoleInfo {
  label: string;
  description: string;
  isSuperUser: boolean;
}

export type RoleTabMapping = Record<RoleKey, RoleConfig>;

// ─── Configuration ──────────────────────────────────────────────────────

export const ROLE_TAB_MAPPING: RoleTabMapping = {
  lion: {
    label: 'Super User (Owner)',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'agents', label: 'Agents', icon: 'users' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
      { id: 'commissions', label: 'Commissions', icon: 'credit' },
      { id: 'admin', label: 'Admin', icon: 'settings' },
      { id: 'users', label: 'Users', icon: 'user-group' },
      { id: 'ai-hub', label: 'AI Hub', icon: 'sparkles' },
      { id: 'ai-command', label: 'AI Command', icon: 'lightning' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'Full platform access',
  },
  owner: {
    label: 'Owner',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'agents', label: 'Agents', icon: 'users' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
      { id: 'commissions', label: 'Commissions', icon: 'credit' },
      { id: 'users', label: 'Users', icon: 'user-group' },
      { id: 'ai-hub', label: 'AI Hub', icon: 'sparkles' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'Full platform access',
  },
  buyer: {
    label: 'Buyer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'saved-properties', label: 'Saved Properties', icon: 'heart' },
      { id: 'offers', label: 'Offers', icon: 'chat' },
      { id: 'mortgage', label: 'Mortgage', icon: 'bank' },
      { id: 'timeline', label: 'Timeline', icon: 'calendar' },
    ],
    description: 'Property search & purchase tools',
  },
  seller: {
    label: 'Seller',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'listings', label: 'Listings', icon: 'home' },
      { id: 'pricing', label: 'Pricing Tools', icon: 'credit' },
      { id: 'offers', label: 'Offers', icon: 'chat' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
    ],
    description: 'Property selling tools',
  },
  landlord: {
    label: 'Landlord',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'tenants', label: 'Tenants', icon: 'user' },
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
      { id: 'rent-tracking', label: 'Rent Tracking', icon: 'credit' },
    ],
    description: 'Property rental management',
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'available-units', label: 'Available Units', icon: 'home' },
      { id: 'applications', label: 'Applications', icon: 'clipboard' },
      { id: 'screenings', label: 'Screenings', icon: 'search' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
    ],
    description: 'Rental property management',
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'pipeline', label: 'Sales Pipeline', icon: 'line-chart' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'commissions', label: 'Commissions', icon: 'credit' },
      { id: 'activity', label: 'Activity', icon: 'chart-bar' },
    ],
    description: 'Sales property management',
  },
  tenant: {
    label: 'Tenant',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'lease-info', label: 'Lease Info', icon: 'file' },
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
      { id: 'documents', label: 'Documents', icon: 'folder' },
    ],
    description: 'Tenant portal access',
  },
};

// ─── Helper Functions ───────────────────────────────────────────────────

/** Get tabs for a specific role */
export const getTabsForRole = (role: string): RoleTab[] => {
  return ROLE_TAB_MAPPING[role as RoleKey]?.tabs || [];
};

/** Get role info including label and description */
export const getRoleInfo = (role: string): RoleInfo => {
  const roleData = ROLE_TAB_MAPPING[role as RoleKey];
  return {
    label: roleData?.label || 'Unknown Role',
    description: roleData?.description || 'Access denied',
    isSuperUser: role === 'lion' || role === 'owner',
  };
};

/** Check if role can access specific feature */
export const canAccessFeature = (role: string, featureId: string): boolean => {
  const tabs = getTabsForRole(role);
  return tabs.some((tab) => tab.id === featureId);
};

/** Type guard to check if a string is a valid role key */
export const isValidRole = (role: string): role is RoleKey => {
  return role in ROLE_TAB_MAPPING;
};

/** Get all available role keys */
export const getAllRoles = (): RoleKey[] => {
  return Object.keys(ROLE_TAB_MAPPING) as RoleKey[];
};
