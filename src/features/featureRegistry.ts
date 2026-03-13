interface SubNavItem {
  id: string;
  label: string;
  icon: string;
  component: string;
  roles: string[];
  badgeCount?: number;
}

interface DashboardModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: string[];
  defaultSubModule: string;
  subNavItems: SubNavItem[];
}

export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: 'buyer',
    name: 'Buyer Dashboard',
    description: 'Property search, saved properties, and viewing management',
    icon: '🏠',
    roles: ['buyer'],
    defaultSubModule: 'overview',
    subNavItems: [
      { id: 'overview', label: 'Overview', icon: '📊', component: 'BuyerOverview', roles: ['buyer'] },
      { id: 'saved', label: 'Saved Properties', icon: '💾', component: 'SavedProperties', roles: ['buyer'] },
      { id: 'viewings', label: 'Viewings', icon: '👁️', component: 'ViewingSchedule', roles: ['buyer'], badgeCount: 3 },
      { id: 'alerts', label: 'Price Alerts', icon: '🔔', component: 'PriceAlerts', roles: ['buyer'] },
      { id: 'offers', label: 'My Offers', icon: '💰', component: 'BuyerOffers', roles: ['buyer'] },
      { id: 'favorites', label: 'Favorites', icon: '⭐', component: 'FavoriteListings', roles: ['buyer'] }
    ]
  },
  {
    id: 'seller',
    name: 'Seller Dashboard',
    description: 'Manage listings, inquiries, and market insights',
    icon: '🏢',
    roles: ['seller'],
    defaultSubModule: 'listings',
    subNavItems: [
      { id: 'listings', label: 'My Listings', icon: '📋', component: 'SellerListings', roles: ['seller'] },
      { id: 'inquiries', label: 'Inquiries', icon: '📞', component: 'SellerInquiries', roles: ['seller'], badgeCount: 12 },
      { id: 'market', label: 'Market Insights', icon: '📈', component: 'MarketInsights', roles: ['seller'] },
      { id: 'offers', label: 'Received Offers', icon: '🤝', component: 'ReceivedOffers', roles: ['seller'] },
      { id: 'analytics', label: 'Analytics', icon: '📊', component: 'SellerAnalytics', roles: ['seller'] }
    ]
  },
  {
    id: 'landlord',
    name: 'Landlord Dashboard',
    description: 'Property management, tenants, and financial tracking',
    icon: '👑',
    roles: ['landlord'],
    defaultSubModule: 'properties',
    subNavItems: [
      { id: 'properties', label: 'Properties', icon: '🏘️', component: 'LandlordProperties', roles: ['landlord'] },
      { id: 'tenants', label: 'Tenants', icon: '👥', component: 'TenantManagement', roles: ['landlord'] },
      { id: 'maintenance', label: 'Maintenance', icon: '🔧', component: 'MaintenanceRequests', roles: ['landlord'], badgeCount: 5 },
      { id: 'financial', label: 'Financial', icon: '💰', component: 'FinancialSummary', roles: ['landlord'] },
      { id: 'leases', label: 'Leases', icon: '📝', component: 'LeaseManagement', roles: ['landlord'] }
    ]
  },
  {
    id: 'tenant',
    name: 'Tenant Dashboard',
    description: 'Lease management, payments, and maintenance requests',
    icon: '🔑',
    roles: ['tenant'],
    defaultSubModule: 'overview',
    subNavItems: [
      { id: 'overview', label: 'Overview', icon: '📊', component: 'TenantOverview', roles: ['tenant'] },
      { id: 'lease', label: 'My Lease', icon: '📄', component: 'TenantLease', roles: ['tenant'] },
      { id: 'payments', label: 'Payments', icon: '💳', component: 'TenantPayments', roles: ['tenant'] },
      { id: 'maintenance', label: 'Maintenance', icon: '🔧', component: 'TenantMaintenance', roles: ['tenant'] },
      { id: 'documents', label: 'Documents', icon: '📁', component: 'TenantDocuments', roles: ['tenant'] }
    ]
  },
  {
    id: 'leasing-agent',
    name: 'Leasing Agent Dashboard',
    description: 'Property leasing, contracts, and tenant management',
    icon: '🔑',
    roles: ['leasing-agent'],
    defaultSubModule: 'pipeline',
    subNavItems: [
      { id: 'pipeline', label: 'Pipeline', icon: '📊', component: 'LeasingPipeline', roles: ['leasing-agent'] },
      { id: 'properties', label: 'Properties', icon: '🏠', component: 'LeasingProperties', roles: ['leasing-agent'] },
      { id: 'contracts', label: 'Contracts', icon: '📄', component: 'LeaseContracts', roles: ['leasing-agent'] },
      { id: 'viewings', label: 'Viewings', icon: '👁️', component: 'LeasingViewings', roles: ['leasing-agent'], badgeCount: 7 },
      { id: 'applications', label: 'Applications', icon: '📋', component: 'TenantApplications', roles: ['leasing-agent'] },
      { id: 'renewals', label: 'Renewals', icon: '🔄', component: 'LeaseRenewals', roles: ['leasing-agent'] }
    ]
  },
  {
    id: 'secondary-sales-agent',
    name: 'Sales Agent Dashboard',
    description: 'Sales pipeline, leads, and commission tracking',
    icon: '👔',
    roles: ['secondary-sales-agent'],
    defaultSubModule: 'pipeline',
    subNavItems: [
      { id: 'pipeline', label: 'Sales Pipeline', icon: '📊', component: 'SalesPipeline', roles: ['secondary-sales-agent'] },
      { id: 'leads', label: 'Leads', icon: '🎯', component: 'SalesLeads', roles: ['secondary-sales-agent'], badgeCount: 8 },
      { id: 'deals', label: 'Active Deals', icon: '🤝', component: 'ActiveDeals', roles: ['secondary-sales-agent'] },
      { id: 'commission', label: 'Commission', icon: '💵', component: 'CommissionTracker', roles: ['secondary-sales-agent'] },
      { id: 'performance', label: 'Performance', icon: '📈', component: 'AgentPerformance', roles: ['secondary-sales-agent'] }
    ]
  },
  {
    id: 'owner',
    name: 'Owner Dashboard',
    description: 'System management, analytics, and business oversight',
    icon: '⚙️',
    roles: ['owner'],
    defaultSubModule: 'overview',
    subNavItems: [
      { id: 'overview', label: 'Overview', icon: '📊', component: 'OwnerOverview', roles: ['owner'] },
      { id: 'analytics', label: 'Analytics', icon: '📈', component: 'BusinessAnalytics', roles: ['owner'] },
      { id: 'whatsapp', label: 'WhatsApp', icon: '💬', component: 'WhatsAppDashboard', roles: ['owner'] },
      { id: 'system', label: 'System Health', icon: '🖥️', component: 'SystemHealth', roles: ['owner'] },
      { id: 'settings', label: 'Settings', icon: '⚙️', component: 'SystemSettings', roles: ['owner'] }
    ]
  }
];

export function getModulesByRole(role: string): DashboardModule[] {
  return DASHBOARD_MODULES.filter(module => module.roles.includes(role));
}

export function getSubNavItems(role: string, moduleId?: string): SubNavItem[] {
  const modules = getModulesByRole(role);
  if (moduleId) {
    const module = modules.find(m => m.id === moduleId);
    return module?.subNavItems || [];
  }
  return modules.flatMap(m => m.subNavItems);
}

export function getDefaultModule(role: string): DashboardModule | null {
  const modules = getModulesByRole(role);
  return modules[0] || null;
}

export function getModuleById(moduleId: string): DashboardModule | null {
  return DASHBOARD_MODULES.find(m => m.id === moduleId) || null;
}
