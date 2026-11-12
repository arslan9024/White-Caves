export const LEGACY_DASHBOARD_REDIRECT_ROUTES: Array<{ path: string; to: string }> = [
  { path: '/lion/dashboard', to: '/dashboard' },
  { path: '/owner/dashboard', to: '/dashboard' },
  { path: '/md/dashboard', to: '/dashboard' },
  { path: '/buyer/dashboard', to: '/buyer-portal' },
  { path: '/seller/dashboard', to: '/seller-portal' },
  { path: '/leasing-agent/dashboard', to: '/dashboard' },
  { path: '/secondary-sales-agent/dashboard', to: '/dashboard' },
  { path: '/landlord/dashboard', to: '/landlord-portal' },
  { path: '/tenant/dashboard', to: '/tenant-portal' },
];
export const LEGACY_OWNER_REDIRECT_ROUTES: Array<{ path: string; to: string }> = [
  { path: '/owner/business-model', to: '/dashboard' },
  { path: '/owner/client-services', to: '/dashboard' },
  { path: '/modern-dashboard', to: '/dashboard' },
  { path: '/crm', to: '/dashboard' },
  { path: '/owner/crm', to: '/dashboard' },
];
