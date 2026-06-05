export type RoleCategory = 'visitor' | 'client' | 'staff' | 'admin';

export type UserRole = string;

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  description?: string;
  children?: NavItem[];
}

export interface QuickAction {
  label: string;
  path: string;
  icon: string;
  primary?: boolean;
}

interface RoleNavLink {
  label: string;
  path: string;
  icon: string;
  description?: string;
}

export interface RoleNavConfig {
  label: string;
  icon: string;
  dashboard: string;
  links: RoleNavLink[];
  browseAs?: {
    clients: RoleNavLink[];
    employees: RoleNavLink[];
  };
}

export const DASHBOARD_TABS = [
  { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'ai-command', label: 'AI Command', icon: 'Command' },
  { id: 'ai-hub', label: 'AI Hub', icon: 'Layers' }
];

export const SIDEBAR_CONFIG = {
  defaultWidthPercent: 40,
  minWidthPercent: 25,
  maxWidthPercent: 50
};

export const PUBLIC_NAV = {
  main: [
    { label: 'Home', path: '/', icon: '🏠' },
    { label: 'Properties', path: '/properties', icon: '🏢' },
    { label: 'Services', path: '/services', icon: '⚙️' },
    { label: 'About', path: '/about', icon: 'ℹ️' },
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

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  description?: string;
}

export interface RoleNavConfig {
  label: string;
  icon: string;
  dashboard: string;
  links: NavItem[];
  browseAs?: {
    clients: NavItem[];
    employees: NavItem[];
  };
}

export interface QuickAction extends NavItem {
  primary?: boolean;
}

export type RoleCategory = 'visitor' | 'client' | 'staff' | 'admin';

// ---------------------------------------------------------------------------
// Role-Based Navigation
// ---------------------------------------------------------------------------

export const ROLE_NAV: Record<string, RoleNavConfig> = {
  buyer: {
    label: 'Buyer',
    icon: '🏠',
    dashboard: '/crm',
    links: [
      { label: 'Dashboard', path: '/crm', icon: '📊' },
      { label: 'Browse Properties', path: '/properties?type=buy', icon: '🔍' },
      { label: 'Mortgage Calculator', path: '/buyer/mortgage-calculator', icon: '💰' },
      { label: 'DLD Fees', path: '/buyer/dld-fees', icon: '📋' },
      { label: 'Title Deed', path: '/buyer/title-deed-registration', icon: '📜' },
      { label: 'Saved Properties', path: '/crm?tab=saved', icon: '❤️' },
      { label: 'My Appointments', path: '/crm?tab=appointments', icon: '📅' }
    ]
  },
  seller: {
    label: 'Seller',
    icon: '💰',
    dashboard: '/crm',
    links: [
      { label: 'Dashboard', path: '/crm', icon: '📊' },
      { label: 'My Listings', path: '/crm?tab=listings', icon: '🏠' },
      { label: 'Pricing Tools', path: '/seller/pricing-tools', icon: '💎' },
      { label: 'Inquiries', path: '/crm?tab=inquiries', icon: '💬' },
      { label: 'Viewings', path: '/crm?tab=viewings', icon: '👁️' },
      { label: 'Market Insights', path: '/crm?tab=insights', icon: '📈' }
    ]
  },
  landlord: {
    label: 'Landlord',
    icon: '🏢',
    dashboard: '/landlord-portal',
    links: [
      { label: 'Dashboard', path: '/landlord-portal', icon: '📊' },
      { label: 'My Properties', path: '/landlord-portal', icon: '🏠' },
      { label: 'Rental Management', path: '/landlord/rental-management', icon: '📋' },
      { label: 'Tenancy Agreements', path: '/landlord-portal', icon: '📜' },
      { label: 'Rent Collection', path: '/landlord-portal', icon: '💵' },
      { label: 'Maintenance', path: '/landlord-portal', icon: '🔧' }
    ]
  },
  tenant: {
    label: 'Tenant',
    icon: '🔑',
    dashboard: '/tenant-portal',
    links: [
      { label: 'Dashboard', path: '/tenant-portal', icon: '📊' },
      { label: 'My Lease', path: '/tenant-portal', icon: '📜' },
      { label: 'Rent Payments', path: '/tenant-portal', icon: '💳' },
      { label: 'Maintenance Requests', path: '/tenant-portal', icon: '🔧' },
      { label: 'Documents', path: '/tenant-portal', icon: '📁' }
    ]
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    icon: '🔑',
    dashboard: '/crm',
    links: [
      { label: 'Dashboard', path: '/crm', icon: '📊' },
      { label: 'Lead Pipeline', path: '/crm?tab=leads', icon: '📈' },
      { label: 'Tenant Screening', path: '/leasing-agent/tenant-screening', icon: '🔍' },
      { label: 'Appointments', path: '/crm?tab=appointments', icon: '📅' },
      { label: 'Contracts', path: '/crm?tab=contracts', icon: '📜' },
      { label: 'Performance', path: '/crm?tab=performance', icon: '🎯' }
    ]
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    icon: '💼',
    dashboard: '/crm',
    links: [
      { label: 'Dashboard', path: '/crm', icon: '📊' },
      { label: 'Sales Pipeline', path: '/secondary-sales-agent/sales-pipeline', icon: '📈' },
      { label: 'My Listings', path: '/crm?tab=listings', icon: '🏠' },
      { label: 'Client Leads', path: '/crm?tab=leads', icon: '👥' },
      { label: 'Appointments', path: '/crm?tab=appointments', icon: '📅' }
    ]
  },
  'team-leader': {
    label: 'Team Leader',
    icon: '👔',
    dashboard: '/crm',
    links: [
      { label: 'Dashboard', path: '/crm', icon: '📊' },
      { label: 'Team Overview', path: '/crm?tab=team', icon: '👥' },
      { label: 'Performance', path: '/crm?tab=performance', icon: '🎯' },
      { label: 'Targets', path: '/crm?tab=targets', icon: '📈' },
      { label: 'Reports', path: '/crm?tab=reports', icon: '📋' }
    ]
  },
  owner: {
    label: 'Owner/Admin',
    icon: '👑',
    dashboard: '/crm',
    links: [
      { label: 'Dashboard', path: '/crm', icon: '📊' },
      { label: 'Business Model', path: '/owner/business-model', icon: '💼' },
      { label: 'Client Services', path: '/owner/client-services', icon: '🤝' },
      { label: 'System Health', path: '/owner/system-health', icon: '🔧' },
      { label: 'Login Security', path: '/owner/login-security', icon: '🛡️' },
      { label: 'All Properties', path: '/crm?tab=properties', icon: '🏢' },
      { label: 'User Management', path: '/crm?tab=users', icon: '👥' },
      { label: 'Analytics', path: '/crm?tab=analytics', icon: '📈' },
      { label: 'Settings', path: '/crm?tab=settings', icon: '⚙️' }
    ],
    browseAs: {
      clients: [
        { label: 'Buyer Portal', path: '/crm', icon: '🏠', description: 'View as property buyer' },
        { label: 'Seller Portal', path: '/crm', icon: '💰', description: 'View as property seller' },
        { label: 'Landlord Portal', path: '/landlord-portal', icon: '🏢', description: 'View as landlord' },
        { label: 'Tenant Portal', path: '/tenant-portal', icon: '🔑', description: 'View as tenant' }
      ],
      employees: [
        { label: 'Leasing Agent', path: '/crm', icon: '📋', description: 'Leasing agent dashboard' },
        { label: 'Sales Agent', path: '/crm', icon: '💼', description: 'Sales agent dashboard' },
        { label: 'Team Leader', path: '/crm', icon: '👔', description: 'Team leader dashboard' }
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
    { label: 'Admin Panel', path: '/crm', icon: '👑', primary: true },
    { label: 'Analytics', path: '/crm?tab=analytics', icon: '📊' },
    { label: 'Users', path: '/crm?tab=users', icon: '👥' }
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
  '/crm': 'Dashboard',
  '/landlord-portal': 'Landlord Portal',
  '/tenant-portal': 'Tenant Portal',
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

function getCanonicalDashboardPath(role: string): string {
  if (role === 'landlord') return '/landlord-portal';
  if (role === 'tenant') return '/tenant-portal';
  return '/crm';
}

function normalizeDashboardHash(path: string, role: string): string {
  const hashIndex = path.indexOf('#');
  if (hashIndex === -1) return path;

  const hashValue = path.slice(hashIndex + 1).trim();
  const canonicalDashboard = getCanonicalDashboardPath(role);

  if (!hashValue) return canonicalDashboard;
  if (canonicalDashboard === '/crm') return `${canonicalDashboard}?tab=${encodeURIComponent(hashValue)}`;
  return canonicalDashboard;
}

function normalizeRolePath(path: string, role: string): string {
  if (!path) return path;

  if (path === 'dashboard') return getCanonicalDashboardPath(role);
  if (path.startsWith('dashboard#')) return normalizeDashboardHash(path, role);

  const legacyDashboardPrefixes = [
    '/buyer/dashboard',
    '/seller/dashboard',
    '/landlord/dashboard',
    '/tenant/dashboard',
    '/leasing-agent/dashboard',
    '/secondary-sales-agent/dashboard',
    '/team-leader/dashboard',
    '/owner/dashboard',
    '/md/dashboard',
    '/company/dashboard',
    '/management/dashboard',
    '/admin/dashboard',
    '/branch/dashboard',
    '/sales/dashboard',
    '/leasing/dashboard',
    '/agent/dashboard',
  ];

  const hasLegacyPrefix = legacyDashboardPrefixes.some(prefix => path.startsWith(prefix));
  if (!hasLegacyPrefix) return path;

  if (!path.includes('#')) {
    return getCanonicalDashboardPath(role);
  }

  return normalizeDashboardHash(path, role);
}

export function getNavForRole(role: string): RoleNavConfig | null {
  const roleNav = ROLE_NAV[role];
  if (!roleNav) return null;

  return {
    ...roleNav,
    dashboard: normalizeRolePath(roleNav.dashboard, role),
    links: roleNav.links.map(link => ({
      ...link,
      path: normalizeRolePath(link.path, role),
    })),
    ...(roleNav.browseAs
      ? {
          browseAs: {
            clients: roleNav.browseAs.clients.map(link => ({
              ...link,
              path: normalizeRolePath(link.path, role),
            })),
            employees: roleNav.browseAs.employees.map(link => ({
              ...link,
              path: normalizeRolePath(link.path, role),
            })),
          },
        }
      : {}),
  };
}

export function getQuickActionsForRole(role: string): readonly QuickAction[] {
  const category = getRoleCategory(role);
  const quickActions = QUICK_ACTIONS[category] || QUICK_ACTIONS.visitor;

  return quickActions.map(action => ({
    ...action,
    path: normalizeRolePath(action.path, role),
  }));
}
