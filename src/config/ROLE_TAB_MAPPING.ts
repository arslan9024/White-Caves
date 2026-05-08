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
  badge?: number;
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
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'agents', label: 'Agents', icon: '👥' },
      { id: 'leads', label: 'Leads', icon: '📱' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'admin', label: 'Admin', icon: '🛡️' },
      { id: 'users', label: 'Users', icon: '🫂' },
      { id: 'ai-hub', label: 'AI Hub', icon: '✨' },
      { id: 'ai-command', label: 'AI Command', icon: '⚡' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    description: 'Full platform access',
  },
  owner: {
    label: 'Owner',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'agents', label: 'Agents', icon: '👥' },
      { id: 'leads', label: 'Leads', icon: '📱' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'users', label: 'Users', icon: '🫂' },
      { id: 'ai-hub', label: 'AI Hub', icon: '✨' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    description: 'Full platform access',
  },

  // ─── Executive & Admin Roles ──────────────────────────────────────────
  managing_director: {
    label: 'Managing Director',
    tabs: [
      { id: 'overview',    label: 'Overview',    icon: '📊'  },
      { id: 'properties',  label: 'Properties',  icon: '🏙️', badge: 6 },
      { id: 'agents',      label: 'Agents',      icon: '👥', badge: 5 },
      { id: 'leads',       label: 'Leads',       icon: '📱', badge: 6 },
      { id: 'contracts',   label: 'Contracts',   icon: '📋', badge: 8 },
       { id: 'analytics',   label: 'Analytics',   icon: '📈' }, 
       { id: 'commissions', label: 'Commissions', icon: '💎', badge: 3 },
      { id: 'users',       label: 'Users',       icon: '🫂' },
      { id: 'ai-hub',      label: 'AI Hub',      icon: '✨'   },
      { id: 'ai-command',  label: 'AI Command',  icon: '🤖'        },
      { id: 'settings',    label: 'Settings',    icon: '⚙️'   },
    ],
    description: 'Full executive access with AI modules',
  },
  real_estate_company: {
    label: 'Company Admin',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'agents', label: 'Agents', icon: '👥' },
      { id: 'leads', label: 'Leads', icon: '📱' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    description: 'Company-wide oversight',
  },
  property_mgmt_company: {
    label: 'Property Management Co.',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    description: 'Property portfolio management',
  },
  super_admin: {
    label: 'Super Admin',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'admin', label: 'Admin', icon: '🛡️' },
      { id: 'users', label: 'Users', icon: '🫂' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
    ],
    description: 'System administration',
  },

  // ─── Management Roles ─────────────────────────────────────────────────
  branch_manager: {
    label: 'Branch Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'agents', label: 'Agents', icon: '👥' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'leads', label: 'Leads', icon: '📱' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ],
    description: 'Branch operations & team management',
  },
  sales_manager: {
    label: 'Sales Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'agents', label: 'Sales Team', icon: '👥' },
      { id: 'leads', label: 'Leads', icon: '📱' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ],
    description: 'Sales team & target management',
  },
  leasing_manager: {
    label: 'Leasing Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'properties', label: 'Rental Units', icon: '🏙️' },
      { id: 'contracts', label: 'Tenancy Contracts', icon: '📋' },
      { id: 'leads', label: 'Inquiries', icon: '📱' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ],
    description: 'Rental portfolio & tenancy management',
  },
  marketing_manager: {
    label: 'Marketing Manager',
    tabs: [
      { id: 'overview', label: 'Overview', icon: '📊' },
      { id: 'properties', label: 'Listings', icon: '🏙️' },
      { id: 'analytics', label: 'Campaign Analytics', icon: '📈' },
    ],
    description: 'Marketing campaigns & listing visibility',
  },

  // ─── Agent Roles ──────────────────────────────────────────────────────
  sales_agent: {
    label: 'Sales Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'leads', label: 'My Leads', icon: '📱' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
    ],
    description: 'Sales pipeline & client management',
  },
  leasing_agent: {
    label: 'Leasing Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Available Units', icon: '🏙️' },
      { id: 'leads', label: 'Inquiries', icon: '📱' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
    ],
    description: 'Rental listings & tenant placement',
  },
  property_manager: {
    label: 'Property Manager',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
    ],
    description: 'Day-to-day property operations',
  },
  affiliated_agent: {
    label: 'Affiliated Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'leads', label: 'My Leads', icon: '📱' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
    ],
    description: 'Independent agent portal',
  },

  // ─── Specialist Roles ─────────────────────────────────────────────────
  property_consultant: {
    label: 'Real Estate Consultant',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'analytics', label: 'Market Data', icon: '📈' },
    ],
    description: 'Market advisory & investment consulting',
  },
  mortgage_consultant: {
    label: 'Mortgage Consultant',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'leads', label: 'Clients', icon: '📱' },
      { id: 'analytics', label: 'Rates & Data', icon: '📈' },
    ],
    description: 'Mortgage advisory & financing',
  },
  valuation_expert: {
    label: 'Real Estate Valuer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'analytics', label: 'Valuation Data', icon: '📈' },
    ],
    description: 'Property valuations & appraisals',
  },
  trustee_officer: {
    label: 'Trustee Officer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'contracts', label: 'Transfers', icon: '📋' },
    ],
    description: 'Official transfers & verifications',
  },

  // ─── Support Roles ────────────────────────────────────────────────────
  legal_officer: {
    label: 'Legal Officer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'contracts', label: 'Contracts & Legal', icon: '📋' },
    ],
    description: 'Contracts, compliance & legal matters',
  },
  finance_officer: {
    label: 'Finance Officer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'analytics', label: 'Financial Reports', icon: '📈' },
      { id: 'contracts', label: 'Invoices', icon: '📋' },
    ],
    description: 'Payments, invoices & financial reports',
  },
  document_controller: {
    label: 'Document Controller',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'contracts', label: 'Documents', icon: '📋' },
    ],
    description: 'Document management & verification',
  },

  // ─── Client Roles ─────────────────────────────────────────────────────
  developer: {
    label: 'Real Estate Developer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Projects', icon: '🏙️' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ],
    description: 'Off-plan project management',
  },
  investor: {
    label: 'Investor',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Portfolio', icon: '🏙️' },
      { id: 'analytics', label: 'ROI & Analytics', icon: '📈' },
    ],
    description: 'Investment analytics & opportunities',
  },
  buyer: {
    label: 'Buyer',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
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
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'listings', label: 'Listings', icon: '🏙️' },
      { id: 'pricing', label: 'Pricing Tools', icon: 'credit' },
      { id: 'offers', label: 'Offers', icon: 'chat' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ],
    description: 'Property selling tools',
  },
  landlord: {
    label: 'Landlord',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'properties', label: 'Properties', icon: '🏙️' },
      { id: 'tenants', label: 'Tenants', icon: 'user' },
      { id: 'maintenance', label: 'Maintenance', icon: 'wrench' },
      { id: 'rent-tracking', label: 'Rent Tracking', icon: 'credit' },
    ],
    description: 'Property rental management',
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'available-units', label: 'Available Units', icon: '🏙️' },
      { id: 'applications', label: 'Applications', icon: 'clipboard' },
      { id: 'screenings', label: 'Screenings', icon: 'search' },
      { id: 'contracts', label: 'Contracts', icon: '📋' },
    ],
    description: 'Rental property management',
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'pipeline', label: 'Sales Pipeline', icon: '📈' },
      { id: 'leads', label: 'Leads', icon: '📱' },
      { id: 'activity', label: 'Activity', icon: '📊' },
    ],
    description: 'Sales property management',
  },
  tenant: {
    label: 'Tenant',
    tabs: [
      { id: 'overview', label: 'Dashboard', icon: '📊' },
      { id: 'lease-info', label: 'Lease Info', icon: '📋' },
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
  return tabs.some((tab) => tab.id === featureId);
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
