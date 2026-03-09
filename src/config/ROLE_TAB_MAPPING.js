/**
 * ROLE TAB MAPPING CONFIGURATION
 * Defines which tabs are available for each role in the UnifiedDashboard
 * 
 * This is the source of truth for role-based UI rendering
 */

export const ROLE_TAB_MAPPING = {
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

/**
 * Get tabs for a specific role
 * @param {string} role - The user's role
 * @returns {Array} Array of tab objects for this role
 */
export const getTabsForRole = (role) => {
  return ROLE_TAB_MAPPING[role]?.tabs || [];
};

/**
 * Get role info including label and description
 * @param {string} role - The user's role
 * @returns {Object} Role information object
 */
export const getRoleInfo = (role) => {
  const roleData = ROLE_TAB_MAPPING[role];
  return {
    label: roleData?.label || 'Unknown Role',
    description: roleData?.description || 'Access denied',
    isSuperUser: role === 'lion' || role === 'owner',
  };
};

/**
 * Check if role can access specific feature
 * @param {string} role - The user's role
 * @param {string} featureId - Feature identifier
 * @returns {boolean} Whether role can access feature
 */
export const canAccessFeature = (role, featureId) => {
  const tabs = getTabsForRole(role);
  return tabs.some(tab => tab.id === featureId);
};
