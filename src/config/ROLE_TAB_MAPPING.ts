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
  | 'tenant'
  | 'managing_director'
  | 'super_admin'
  | 'branch_manager'
  | 'sales_manager'
  | 'leasing_manager'
  | 'sales_agent'
  | 'leasing_agent'
  | 'property_manager'
  | 'property_consultant'
  | 'mortgage_consultant'
  | 'valuation_expert'
  | 'trustee_officer'
  | 'legal_officer'
  | 'finance_officer'
  | 'marketing_manager'
  | 'document_controller'
  | 'developer'
  | 'investor'
  | 'affiliated_agent'
  | 'real_estate_company'
  | 'property_mgmt_company';

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
      { id: 'users', label: 'Users', icon: 'user-group' },
      { id: 'ai-hub', label: 'AI Hub', icon: 'sparkles' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'Full platform access',
  },

  // ─── Executive & Admin Roles ──────────────────────────────────────────
  managing_director: {
    label: 'Managing Director',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'agents', label: 'Agents', icon: 'users' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
      { id: 'users', label: 'Users', icon: 'user-group' },
      { id: 'ai-hub', label: 'AI Hub', icon: 'sparkles' },
      { id: 'ai-command', label: 'AI Command', icon: 'cpu' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'Full executive access with AI modules',
  },
  real_estate_company: {
    label: 'Company Admin',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'agents', label: 'Agents', icon: 'users' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'Company-wide oversight',
  },
  property_mgmt_company: {
    label: 'Property Management Co.',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'Property portfolio management',
  },
  super_admin: {
    label: 'Super Admin',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'admin', label: 'Admin', icon: 'settings' },
      { id: 'users', label: 'Users', icon: 'user-group' },
      { id: 'settings', label: 'Settings', icon: 'settings' },
    ],
    description: 'System administration',
  },

  // ─── Management Roles ─────────────────────────────────────────────────
  branch_manager: {
    label: 'Branch Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'agents', label: 'Agents', icon: 'users' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
    ],
    description: 'Branch operations & team management',
  },
  sales_manager: {
    label: 'Sales Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'agents', label: 'Sales Team', icon: 'users' },
      { id: 'leads', label: 'Leads', icon: 'phone' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
    ],
    description: 'Sales team & target management',
  },
  leasing_manager: {
    label: 'Leasing Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Rental Units', icon: 'home' },
      { id: 'contracts', label: 'Tenancy Contracts', icon: 'file' },
      { id: 'leads', label: 'Inquiries', icon: 'phone' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
    ],
    description: 'Rental portfolio & tenancy management',
  },
  marketing_manager: {
    label: 'Marketing Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'chart-bar' },
      { id: 'properties', label: 'Listings', icon: 'home' },
      { id: 'analytics', label: 'Campaign Analytics', icon: 'line-chart' },
    ],
    description: 'Marketing campaigns & listing visibility',
  },

  // ─── Agent Roles ──────────────────────────────────────────────────────
  sales_agent: {
    label: 'Sales Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'leads', label: 'My Leads', icon: 'phone' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
    ],
    description: 'Sales pipeline & client management',
  },
  leasing_agent: {
    label: 'Leasing Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Available Units', icon: 'home' },
      { id: 'leads', label: 'Inquiries', icon: 'phone' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
    ],
    description: 'Rental listings & tenant placement',
  },
  property_manager: {
    label: 'Property Manager',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'contracts', label: 'Contracts', icon: 'file' },
    ],
    description: 'Day-to-day property operations',
  },
  affiliated_agent: {
    label: 'Affiliated Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'leads', label: 'My Leads', icon: 'phone' },
      { id: 'properties', label: 'Properties', icon: 'home' },
    ],
    description: 'Independent agent portal',
  },

  // ─── Specialist Roles ─────────────────────────────────────────────────
  property_consultant: {
    label: 'Real Estate Consultant',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'analytics', label: 'Market Data', icon: 'line-chart' },
    ],
    description: 'Market advisory & investment consulting',
  },
  mortgage_consultant: {
    label: 'Mortgage Consultant',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'leads', label: 'Clients', icon: 'phone' },
      { id: 'analytics', label: 'Rates & Data', icon: 'line-chart' },
    ],
    description: 'Mortgage advisory & financing',
  },
  valuation_expert: {
    label: 'Real Estate Valuer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Properties', icon: 'home' },
      { id: 'analytics', label: 'Valuation Data', icon: 'line-chart' },
    ],
    description: 'Property valuations & appraisals',
  },
  trustee_officer: {
    label: 'Trustee Officer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'contracts', label: 'Transfers', icon: 'file' },
    ],
    description: 'Official transfers & verifications',
  },

  // ─── Support Roles ────────────────────────────────────────────────────
  legal_officer: {
    label: 'Legal Officer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'contracts', label: 'Contracts & Legal', icon: 'file' },
    ],
    description: 'Contracts, compliance & legal matters',
  },
  finance_officer: {
    label: 'Finance Officer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'analytics', label: 'Financial Reports', icon: 'line-chart' },
      { id: 'contracts', label: 'Invoices', icon: 'file' },
    ],
    description: 'Payments, invoices & financial reports',
  },
  document_controller: {
    label: 'Document Controller',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'contracts', label: 'Documents', icon: 'file' },
    ],
    description: 'Document management & verification',
  },

  // ─── Client Roles ─────────────────────────────────────────────────────
  developer: {
    label: 'Real Estate Developer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Projects', icon: 'home' },
      { id: 'analytics', label: 'Analytics', icon: 'line-chart' },
    ],
    description: 'Off-plan project management',
  },
  investor: {
    label: 'Investor',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: 'chart-bar' },
      { id: 'properties', label: 'Portfolio', icon: 'home' },
      { id: 'analytics', label: 'ROI & Analytics', icon: 'line-chart' },
    ],
    description: 'Investment analytics & opportunities',
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
    label: roleData?.label || role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    description: roleData?.description || 'Dashboard access',
    isSuperUser: role === 'lion' || role === 'owner',
  };
};

/** Check if role can access specific feature */
export const canAccessFeature = (role: string, featureId: string): boolean => {
  const tabs = getTabsForRole(role);
  return tabs.some(tab => tab.id === featureId);
};

/** Type guard to check if a string is a valid role key */
export const isValidRole = (role: string): role is RoleKey => {
  return role in ROLE_TAB_MAPPING;
};

/** Check if a role has super user / admin privileges */
export const isSuperUserRole = (role?: string): boolean => {
  return role === 'lion' || role === 'owner';
};

/** Check if a role has admin-level access (includes backend admin roles) */
export const isAdminRole = (role?: string): boolean => {
  return role === 'admin' || role === 'super_user' || isSuperUserRole(role);
};

/** Get all available role keys */
export const getAllRoles = (): RoleKey[] => {
  return Object.keys(ROLE_TAB_MAPPING) as RoleKey[];
};
