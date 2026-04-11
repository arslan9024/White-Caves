// ============================================================================
// Navigation Configuration - TypeScript
// Converted from navigation.js with full type safety
// ============================================================================

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: string;
}

export interface NavItemWithDescription extends NavItem {
  readonly description: string;
}

export interface QuickAction extends NavItem {
  readonly primary?: boolean;
}

export interface BrowseAsConfig {
  readonly clients: readonly NavItemWithDescription[];
  readonly employees: readonly NavItemWithDescription[];
}

export interface RoleNavConfig {
  readonly label: string;
  readonly icon: string;
  readonly dashboard: string;
  readonly links: readonly NavItem[];
  readonly browseAs?: BrowseAsConfig;
}

export type RoleCategory = 'visitor' | 'client' | 'staff' | 'admin';

export type ClientRole = 'buyer' | 'seller' | 'landlord' | 'tenant';
export type StaffRole = 'leasing-agent' | 'secondary-sales-agent' | 'team-leader';
export type AdminRole = 'owner' | 'admin';
export type UserRole = ClientRole | StaffRole | AdminRole;

// ---------------------------------------------------------------------------
// Public Navigation
// ---------------------------------------------------------------------------

export const PUBLIC_NAV: Record<string, readonly NavItem[]> = {
  main: [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Properties', path: '/properties', icon: '🏢' },
    { label: 'Services', path: '/services', icon: '⚙️' },
    { label: 'Careers', path: '/careers', icon: '💼' },
    { label: 'Contact', path: '/contact', icon: '📞' }
  ],
  buy: [
    { label: 'Browse Properties', path: '/properties?type=buy', icon: '🏠' },
    { label: 'Mortgage Calculator', path: '/buyer/mortgage-calculator', icon: '💰' },
    { label: 'DLD Fees Calculator', path: '/buyer/dld-fees', icon: '📊' },
    { label: 'Title Deed Registration', path: '/buyer/title-deed-registration', icon: '📜' }
  ],
  rent: [
    { label: 'Browse Rentals', path: '/properties?type=rent', icon: '🔑' },
    { label: 'Tenant Guide', path: '/services#tenant', icon: '📖' },
    { label: 'Move-in Ready', path: '/properties?moveIn=ready', icon: '✨' }
  ],
  sell: [
    { label: 'List Your Property', path: '/services#sell', icon: '📋' },
    { label: 'Property Valuation', path: '/services#valuation', icon: '💎' },
    { label: 'Market Insights', path: '/services#market', icon: '📈' }
  ],
  company: [
    { label: 'About Us', path: '/about', icon: 'ℹ️' },
    { label: 'Our Team', path: '/about#team', icon: '👥' },
    { label: 'Careers', path: '/careers', icon: '💼' },
    { label: 'Contact Us', path: '/contact', icon: '📞' }
  ]
} as const;

// ---------------------------------------------------------------------------
// Role-Based Navigation
// ---------------------------------------------------------------------------

export const ROLE_NAV: Record<string, RoleNavConfig> = {
  buyer: {
    label: 'Buyer',
    icon: '🏠',
    dashboard: '/buyer/dashboard',
    links: [
      { label: 'Dashboard', path: '/buyer/dashboard', icon: '📊' },
      { label: 'Browse Properties', path: '/properties?type=buy', icon: '🔍' },
      { label: 'Mortgage Calculator', path: '/buyer/mortgage-calculator', icon: '💰' },
      { label: 'DLD Fees', path: '/buyer/dld-fees', icon: '📋' },
      { label: 'Title Deed', path: '/buyer/title-deed-registration', icon: '📜' },
      { label: 'Saved Properties', path: '/buyer/dashboard#saved', icon: '❤️' },
      { label: 'My Appointments', path: '/buyer/dashboard#appointments', icon: '📅' }
    ]
  },
  seller: {
    label: 'Seller',
    icon: '💰',
    dashboard: '/seller/dashboard',
    links: [
      { label: 'Dashboard', path: '/seller/dashboard', icon: '📊' },
      { label: 'My Listings', path: '/seller/dashboard#listings', icon: '🏠' },
      { label: 'Pricing Tools', path: '/seller/pricing-tools', icon: '💎' },
      { label: 'Inquiries', path: '/seller/dashboard#inquiries', icon: '💬' },
      { label: 'Viewings', path: '/seller/dashboard#viewings', icon: '👁️' },
      { label: 'Market Insights', path: '/seller/dashboard#insights', icon: '📈' }
    ]
  },
  landlord: {
    label: 'Landlord',
    icon: '🏢',
    dashboard: '/landlord/dashboard',
    links: [
      { label: 'Dashboard', path: '/landlord/dashboard', icon: '📊' },
      { label: 'My Properties', path: '/landlord/dashboard#properties', icon: '🏠' },
      { label: 'Rental Management', path: '/landlord/rental-management', icon: '📋' },
      { label: 'Tenancy Agreements', path: '/landlord/dashboard#agreements', icon: '📜' },
      { label: 'Rent Collection', path: '/landlord/dashboard#rent', icon: '💵' },
      { label: 'Maintenance', path: '/landlord/dashboard#maintenance', icon: '🔧' }
    ]
  },
  tenant: {
    label: 'Tenant',
    icon: '🔑',
    dashboard: '/tenant/dashboard',
    links: [
      { label: 'Dashboard', path: '/tenant/dashboard', icon: '📊' },
      { label: 'My Lease', path: '/tenant/dashboard#lease', icon: '📜' },
      { label: 'Rent Payments', path: '/tenant/dashboard#payments', icon: '💳' },
      { label: 'Maintenance Requests', path: '/tenant/dashboard#maintenance', icon: '🔧' },
      { label: 'Documents', path: '/tenant/dashboard#documents', icon: '📁' }
    ]
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    icon: '🔑',
    dashboard: '/leasing-agent/dashboard',
    links: [
      { label: 'Dashboard', path: '/leasing-agent/dashboard', icon: '📊' },
      { label: 'Lead Pipeline', path: '/leasing-agent/dashboard#leads', icon: '📈' },
      { label: 'Tenant Screening', path: '/leasing-agent/tenant-screening', icon: '🔍' },
      { label: 'Appointments', path: '/leasing-agent/dashboard#appointments', icon: '📅' },
      { label: 'Contracts', path: '/leasing-agent/dashboard#contracts', icon: '📜' },
      { label: 'Performance', path: '/leasing-agent/dashboard#performance', icon: '🎯' }
    ]
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    icon: '💼',
    dashboard: '/secondary-sales-agent/dashboard',
    links: [
      { label: 'Dashboard', path: '/secondary-sales-agent/dashboard', icon: '📊' },
      { label: 'Sales Pipeline', path: '/secondary-sales-agent/sales-pipeline', icon: '📈' },
      { label: 'My Listings', path: '/secondary-sales-agent/dashboard#listings', icon: '🏠' },
      { label: 'Client Leads', path: '/secondary-sales-agent/dashboard#leads', icon: '👥' },
      { label: 'Appointments', path: '/secondary-sales-agent/dashboard#appointments', icon: '📅' }
    ]
  },
  'team-leader': {
    label: 'Team Leader',
    icon: '👔',
    dashboard: '/team-leader/dashboard',
    links: [
      { label: 'Dashboard', path: '/team-leader/dashboard', icon: '📊' },
      { label: 'Team Overview', path: '/team-leader/dashboard#team', icon: '👥' },
      { label: 'Performance', path: '/team-leader/dashboard#performance', icon: '🎯' },
      { label: 'Targets', path: '/team-leader/dashboard#targets', icon: '📈' },
      { label: 'Reports', path: '/team-leader/dashboard#reports', icon: '📋' }
    ]
  },
  owner: {
    label: 'Owner/Admin',
    icon: '👑',
    dashboard: '/owner/dashboard',
    links: [
      { label: 'Dashboard', path: '/owner/dashboard', icon: '📊' },
      { label: 'Business Model', path: '/owner/business-model', icon: '💼' },
      { label: 'Client Services', path: '/owner/client-services', icon: '🤝' },
      { label: 'System Health', path: '/owner/system-health', icon: '🔧' },
      { label: 'All Properties', path: '/owner/dashboard#properties', icon: '🏢' },
      { label: 'User Management', path: '/owner/dashboard#users', icon: '👥' },
      { label: 'Analytics', path: '/owner/dashboard#analytics', icon: '📈' },
      { label: 'Settings', path: '/owner/dashboard#settings', icon: '⚙️' }
    ],
    browseAs: {
      clients: [
        { label: 'Buyer Portal', path: '/buyer/dashboard', icon: '🏠', description: 'View as property buyer' },
        { label: 'Seller Portal', path: '/seller/dashboard', icon: '💰', description: 'View as property seller' },
        { label: 'Landlord Portal', path: '/landlord/dashboard', icon: '🏢', description: 'View as landlord' },
        { label: 'Tenant Portal', path: '/tenant/dashboard', icon: '🔑', description: 'View as tenant' }
      ],
      employees: [
        { label: 'Leasing Agent', path: '/leasing-agent/dashboard', icon: '📋', description: 'Leasing agent dashboard' },
        { label: 'Sales Agent', path: '/secondary-sales-agent/dashboard', icon: '💼', description: 'Sales agent dashboard' },
        { label: 'Team Leader', path: '/team-leader/dashboard', icon: '👔', description: 'Team leader dashboard' }
      ]
    }
  }
};

// ---------------------------------------------------------------------------
// Quick Actions
// ---------------------------------------------------------------------------

export const QUICK_ACTIONS: Record<RoleCategory, readonly QuickAction[]> = {
  visitor: [
    { label: 'Sign In', path: '/signin', icon: '🔐', primary: true },
    { label: 'Browse Properties', path: '/properties', icon: '🔍' },
    { label: 'Contact Us', path: '/contact', icon: '📞' }
  ],
  client: [
    { label: 'My Dashboard', path: 'dashboard', icon: '📊', primary: true },
    { label: 'Properties', path: '/properties', icon: '🏠' },
    { label: 'Support', path: '/contact', icon: '💬' }
  ],
  staff: [
    { label: 'My Dashboard', path: 'dashboard', icon: '📊', primary: true },
    { label: 'Leads', path: 'dashboard#leads', icon: '📈' },
    { label: 'Calendar', path: 'dashboard#calendar', icon: '📅' }
  ],
  admin: [
    { label: 'Admin Panel', path: '/owner/dashboard', icon: '👑', primary: true },
    { label: 'Analytics', path: '/owner/dashboard#analytics', icon: '📊' },
    { label: 'Users', path: '/owner/dashboard#users', icon: '👥' }
  ]
};

// ---------------------------------------------------------------------------
// Breadcrumb Labels
// ---------------------------------------------------------------------------

export const BREADCRUMB_LABELS: Record<string, string> = {
  '/': 'Home',
  '/properties': 'Properties',
  '/services': 'Services',
  '/careers': 'Careers',
  '/contact': 'Contact',
  '/signin': 'Sign In',
  '/profile': 'Profile',
  '/select-role': 'Select Role',
  '/buyer/dashboard': 'Buyer Dashboard',
  '/buyer/mortgage-calculator': 'Mortgage Calculator',
  '/buyer/dld-fees': 'DLD Fees',
  '/buyer/title-deed-registration': 'Title Deed',
  '/seller/dashboard': 'Seller Dashboard',
  '/seller/pricing-tools': 'Pricing Tools',
  '/landlord/dashboard': 'Landlord Dashboard',
  '/landlord/rental-management': 'Rental Management',
  '/tenant/dashboard': 'Tenant Dashboard',
  '/leasing-agent/dashboard': 'Leasing Agent Dashboard',
  '/leasing-agent/tenant-screening': 'Tenant Screening',
  '/secondary-sales-agent/dashboard': 'Sales Agent Dashboard',
  '/secondary-sales-agent/sales-pipeline': 'Sales Pipeline',
  '/owner/dashboard': 'Owner Dashboard',
  '/owner/business-model': 'Business Model',
  '/owner/client-services': 'Client Services'
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getRoleCategory(role: string): RoleCategory {
  const clientRoles: readonly string[] = ['buyer', 'seller', 'landlord', 'tenant'];
  const staffRoles: readonly string[] = ['leasing-agent', 'secondary-sales-agent', 'team-leader'];
  const adminRoles: readonly string[] = ['owner', 'admin'];

  if (clientRoles.includes(role)) return 'client';
  if (staffRoles.includes(role)) return 'staff';
  if (adminRoles.includes(role)) return 'admin';
  return 'visitor';
}

export function getNavForRole(role: string): RoleNavConfig | null {
  return ROLE_NAV[role] || null;
}

export function getQuickActionsForRole(role: string): readonly QuickAction[] {
  const category = getRoleCategory(role);
  return QUICK_ACTIONS[category] || QUICK_ACTIONS.visitor;
}
