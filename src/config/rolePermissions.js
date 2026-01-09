export const ROLE_ASSISTANT_PERMISSIONS = {
  owner: {
    label: 'Owner/Admin',
    accessLevel: 'full',
    assistants: [
      'zoe', 'mary', 'linda', 'nina', 'clara', 'sophia', 'daisy', 'theodora',
      'olivia', 'laila', 'nancy', 'aurora', 'hazel', 'willow', 'evangeline',
      'sentinel', 'hunter', 'henry', 'cipher', 'atlas', 'vesta', 'juno', 'kairos', 'maven'
    ],
    departments: ['all']
  },
  'team-leader': {
    label: 'Team Leader',
    accessLevel: 'manager',
    assistants: [
      'clara', 'sophia', 'daisy', 'linda', 'nina', 'hunter', 'zoe'
    ],
    departments: ['sales', 'communications', 'operations']
  },
  'secondary-sales-agent': {
    label: 'Sales Agent',
    accessLevel: 'agent',
    assistants: [
      'clara', 'sophia', 'linda', 'hunter', 'cipher'
    ],
    departments: ['sales', 'communications', 'intelligence']
  },
  'leasing-agent': {
    label: 'Leasing Agent',
    accessLevel: 'agent',
    assistants: [
      'daisy', 'clara', 'linda', 'nina', 'sentinel'
    ],
    departments: ['operations', 'communications']
  },
  'finance-manager': {
    label: 'Finance Manager',
    accessLevel: 'manager',
    assistants: [
      'theodora', 'maven', 'laila', 'zoe'
    ],
    departments: ['finance', 'compliance', 'executive']
  },
  'marketing-manager': {
    label: 'Marketing Manager',
    accessLevel: 'manager',
    assistants: [
      'olivia', 'cipher', 'linda', 'nina', 'hazel'
    ],
    departments: ['marketing', 'communications', 'intelligence', 'technology']
  },
  'property-manager': {
    label: 'Property Manager',
    accessLevel: 'manager',
    assistants: [
      'mary', 'sentinel', 'juno', 'daisy', 'vesta', 'nina'
    ],
    departments: ['operations']
  },
  'compliance-officer': {
    label: 'Compliance Officer',
    accessLevel: 'manager',
    assistants: [
      'laila', 'evangeline', 'henry', 'theodora'
    ],
    departments: ['compliance', 'legal', 'finance']
  },
  buyer: {
    label: 'Buyer',
    accessLevel: 'client',
    assistants: [],
    departments: []
  },
  seller: {
    label: 'Seller',
    accessLevel: 'client',
    assistants: [],
    departments: []
  },
  landlord: {
    label: 'Landlord',
    accessLevel: 'client',
    assistants: [],
    departments: []
  },
  tenant: {
    label: 'Tenant',
    accessLevel: 'client',
    assistants: [],
    departments: []
  }
};

export const DEPARTMENT_NAV_ITEMS = {
  executive: [
    { label: 'Executive Overview', path: '/dashboard/executive', icon: 'Briefcase' },
    { label: 'Strategic Reports', path: '/dashboard/reports', icon: 'FileText' },
    { label: 'Decision Center', path: '/dashboard/decisions', icon: 'Target' }
  ],
  operations: [
    { label: 'Inventory', path: '/dashboard/inventory', icon: 'Building2' },
    { label: 'Maintenance', path: '/dashboard/maintenance', icon: 'Wrench' },
    { label: 'Handovers', path: '/dashboard/handovers', icon: 'Key' }
  ],
  sales: [
    { label: 'Lead Pipeline', path: '/dashboard/leads', icon: 'Target' },
    { label: 'Deals', path: '/dashboard/deals', icon: 'Handshake' },
    { label: 'Commission', path: '/dashboard/commission', icon: 'DollarSign' }
  ],
  communications: [
    { label: 'WhatsApp CRM', path: '/dashboard/whatsapp', icon: 'MessageSquare' },
    { label: 'Support Queue', path: '/dashboard/support', icon: 'Headphones' },
    { label: 'Broadcasts', path: '/dashboard/broadcasts', icon: 'Radio' }
  ],
  finance: [
    { label: 'Invoices', path: '/dashboard/invoices', icon: 'FileText' },
    { label: 'Payments', path: '/dashboard/payments', icon: 'CreditCard' },
    { label: 'Reports', path: '/dashboard/finance-reports', icon: 'BarChart3' }
  ],
  marketing: [
    { label: 'Campaigns', path: '/dashboard/campaigns', icon: 'Megaphone' },
    { label: 'Listings', path: '/dashboard/listings', icon: 'Grid' },
    { label: 'Analytics', path: '/dashboard/marketing-analytics', icon: 'TrendingUp' }
  ],
  compliance: [
    { label: 'KYC Verification', path: '/dashboard/kyc', icon: 'UserCheck' },
    { label: 'AML Monitoring', path: '/dashboard/aml', icon: 'Shield' },
    { label: 'Audit Trail', path: '/dashboard/audit', icon: 'History' }
  ],
  technology: [
    { label: 'System Health', path: '/dashboard/system', icon: 'Server' },
    { label: 'Deployments', path: '/dashboard/deployments', icon: 'Rocket' },
    { label: 'API Status', path: '/dashboard/api', icon: 'Code' }
  ],
  intelligence: [
    { label: 'Market Trends', path: '/dashboard/market', icon: 'TrendingUp' },
    { label: 'Competitor Analysis', path: '/dashboard/competitors', icon: 'Users' },
    { label: 'Predictions', path: '/dashboard/predictions', icon: 'LineChart' }
  ],
  legal: [
    { label: 'Contract Review', path: '/dashboard/contracts', icon: 'FileCheck' },
    { label: 'Risk Analysis', path: '/dashboard/risk', icon: 'AlertTriangle' },
    { label: 'Regulations', path: '/dashboard/regulations', icon: 'Scale' }
  ]
};

export const getAssistantsForRole = (role) => {
  const permissions = ROLE_ASSISTANT_PERMISSIONS[role];
  if (!permissions) return [];
  return permissions.assistants;
};

export const getDepartmentsForRole = (role) => {
  const permissions = ROLE_ASSISTANT_PERMISSIONS[role];
  if (!permissions) return [];
  if (permissions.departments.includes('all')) {
    return Object.keys(DEPARTMENT_NAV_ITEMS);
  }
  return permissions.departments;
};

export const canAccessAssistant = (role, assistantId) => {
  const permissions = ROLE_ASSISTANT_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.accessLevel === 'full') return true;
  return permissions.assistants.includes(assistantId);
};

export const getNavItemsForDepartment = (department) => {
  return DEPARTMENT_NAV_ITEMS[department] || [];
};

export const getAccessLevel = (role) => {
  const permissions = ROLE_ASSISTANT_PERMISSIONS[role];
  return permissions?.accessLevel || 'visitor';
};

export default {
  ROLE_ASSISTANT_PERMISSIONS,
  DEPARTMENT_NAV_ITEMS,
  getAssistantsForRole,
  getDepartmentsForRole,
  canAccessAssistant,
  getNavItemsForDepartment,
  getAccessLevel
};
