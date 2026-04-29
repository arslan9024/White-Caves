/**
 * Department Content Map
 * Maps (department + service + subitem) to components, data sources, and configurations
 * Used for dynamic content routing and sidebar rendering
 */

export const departmentContentMap = {
  EXECUTIVE: {
    label: 'Executive',
    icon: 'crown',
    color: '#10B981',
    defaultService: 'strategic-overview',
    permissions: ['executive', 'md', 'cao'],
    services: {
      'strategic-overview': {
        label: 'Strategic Overview',
        description: 'Executive dashboard with KPIs',
        component: 'ExecutiveView',
        dataSource: '/api/executive/strategic-overview',
        permissions: ['executive', 'md'],
        subitems: [
          {
            id: 'kpi-dashboard',
            label: 'KPI Dashboard',
            description: 'Real-time KPI metrics',
            dataSource: '/api/executive/kpis',
            columns: ['metric', 'value', 'change', 'trend'],
            permissions: ['executive', 'md'],
          },
          {
            id: 'announcements',
            label: 'Announcements',
            description: 'Company-wide announcements',
            dataSource: '/api/executive/announcements',
            columns: ['title', 'date', 'department', 'status'],
            permissions: ['executive', 'md'],
          },
          {
            id: 'board-reports',
            label: 'Board Reports',
            description: 'Board meeting reports',
            dataSource: '/api/executive/board-reports',
            columns: ['title', 'date', 'status', 'actions'],
            permissions: ['executive'],
          },
        ],
      },
    },
  },

  SALES: {
    label: 'Sales & Leasing',
    icon: 'trending-up',
    color: '#3B82F6',
    defaultService: 'lead-pipeline',
    permissions: ['sales', 'agent', 'manager', 'md'],
    services: {
      'lead-pipeline': {
        label: 'Lead Pipeline',
        description: 'Manage sales leads and deals',
        component: 'SalesView',
        dataSource: '/api/sales/pipeline',
        permissions: ['sales', 'agent', 'manager'],
        subitems: [
          {
            id: 'pipeline-board',
            label: 'Pipeline Board',
            description: 'Kanban view of sales pipeline',
            dataSource: '/api/sales/pipeline/board',
            columns: ['stage', 'lead_name', 'value', 'probability', 'assigned_to'],
            permissions: ['sales', 'agent', 'manager'],
          },
          {
            id: 'active-deals',
            label: 'Active Deals',
            description: 'All active deals in progress',
            dataSource: '/api/sales/deals',
            columns: ['deal_name', 'value', 'client', 'stage', 'probability', 'close_date'],
            permissions: ['sales', 'agent', 'manager'],
          },
          {
            id: 'client-journey',
            label: 'Client Journey',
            description: 'Track client through sales funnel',
            dataSource: '/api/sales/client-journey',
            columns: ['client_id', 'stage', 'entry_date', 'duration', 'next_action'],
            permissions: ['sales', 'agent', 'manager'],
          },
          {
            id: 'routing-rules',
            label: 'Routing Rules',
            description: 'Lead assignment and routing rules',
            dataSource: '/api/sales/routing-rules',
            columns: ['rule_name', 'source', 'criteria', 'assigned_to', 'success_rate'],
            permissions: ['manager'],
          },
          {
            id: 'sales-contracts',
            label: 'Contracts',
            description: 'Sales contracts and agreements',
            dataSource: '/api/sales/contracts',
            columns: ['contract_id', 'client', 'value', 'status', 'signed_date'],
            permissions: ['sales', 'agent', 'manager'],
          },
        ],
      },
    },
  },

  OPERATIONS: {
    label: 'Operations & Management',
    icon: 'settings',
    color: '#EC4899',
    defaultService: 'department-overview',
    permissions: ['operations', 'manager', 'md'],
    services: {
      'department-overview': {
        label: 'Department Overview',
        description: 'Manage departments and teams',
        component: 'OperationsView',
        dataSource: '/api/operations/departments',
        permissions: ['operations', 'manager', 'md'],
        subitems: [
          {
            id: 'departments-grid',
            label: 'Departments',
            description: 'All departments and structure',
            dataSource: '/api/operations/departments',
            columns: ['dept_name', 'head', 'staff_count', 'budget', 'status'],
            permissions: ['operations', 'manager', 'md'],
          },
          {
            id: 'staff-directory',
            label: 'Staff Directory',
            description: 'Employee directory and contacts',
            dataSource: '/api/operations/staff',
            columns: ['name', 'role', 'department', 'email', 'phone', 'status'],
            permissions: ['operations', 'manager', 'md'],
          },
          {
            id: 'team-assignments',
            label: 'Team Assignments',
            description: 'Team structure and assignments',
            dataSource: '/api/operations/teams',
            columns: ['team_name', 'lead', 'members', 'project', 'status'],
            permissions: ['operations', 'manager'],
          },
          {
            id: 'scheduling',
            label: 'Scheduling',
            description: 'Team scheduling and calendars',
            dataSource: '/api/operations/scheduling',
            columns: ['date', 'team', 'shift', 'assigned', 'coverage'],
            permissions: ['operations', 'manager'],
          },
        ],
      },
    },
  },

  PROPERTIES: {
    label: 'Property Management',
    icon: 'building',
    color: '#8B5CF6',
    defaultService: 'inventory-management',
    permissions: ['operations', 'property-manager', 'md'],
    services: {
      'inventory-management': {
        label: 'Inventory Management',
        description: 'Manage property inventory',
        component: 'PropertyManagementView',
        dataSource: '/api/properties/inventory',
        permissions: ['operations', 'property-manager'],
        subitems: [
          {
            id: 'property-dashboard',
            label: 'Dashboard',
            description: 'Property metrics and overview',
            dataSource: '/api/properties/dashboard',
            columns: ['metric', 'value', 'change', 'target'],
            permissions: ['operations', 'property-manager'],
          },
          {
            id: 'property-list',
            label: 'Properties',
            description: 'Full property list and details',
            dataSource: '/api/properties/list',
            columns: ['ref_no', 'type', 'location', 'owner', 'status', 'occupancy'],
            permissions: ['operations', 'property-manager'],
          },
          {
            id: 'maintenance-requests',
            label: 'Maintenance',
            description: 'Maintenance requests and schedules',
            dataSource: '/api/properties/maintenance',
            columns: ['property', 'request_type', 'status', 'priority', 'assigned_to', 'date'],
            permissions: ['operations', 'property-manager'],
          },
          {
            id: 'vendor-management',
            label: 'Vendors',
            description: 'Vendor management and contracts',
            dataSource: '/api/properties/vendors',
            columns: ['vendor_name', 'service_type', 'rating', 'contact', 'status'],
            permissions: ['operations', 'property-manager'],
          },
          {
            id: 'rent-collection',
            label: 'Rent Collection',
            description: 'Rent and payment tracking',
            dataSource: '/api/properties/rent-collection',
            columns: ['property', 'tenant', 'due_date', 'amount', 'status', 'days_due'],
            permissions: ['operations', 'property-manager'],
          },
        ],
      },
    },
  },

  FINANCE: {
    label: 'Finance & Reporting',
    icon: 'dollar-sign',
    color: '#EC4899',
    defaultService: 'financial-overview',
    permissions: ['finance', 'cfo', 'md'],
    services: {
      'financial-overview': {
        label: 'Financial Overview',
        description: 'Financial reports and analytics',
        component: 'FinanceView',
        dataSource: '/api/finance/overview',
        permissions: ['finance', 'cfo', 'md'],
        subitems: [
          {
            id: 'revenue-dashboard',
            label: 'Revenue Dashboard',
            description: 'Revenue tracking and KPIs',
            dataSource: '/api/finance/revenue',
            columns: ['source', 'amount', 'date', 'status', 'forecast'],
            permissions: ['finance', 'cfo', 'md'],
          },
          {
            id: 'invoicing',
            label: 'Invoicing',
            description: 'Invoice management and tracking',
            dataSource: '/api/finance/invoices',
            columns: ['invoice_no', 'client', 'amount', 'date', 'due_date', 'status'],
            permissions: ['finance', 'cfo'],
          },
          {
            id: 'payments',
            label: 'Payments',
            description: 'Payment tracking and reconciliation',
            dataSource: '/api/finance/payments',
            columns: ['payment_id', 'invoice', 'amount', 'date', 'method', 'status'],
            permissions: ['finance', 'cfo'],
          },
          {
            id: 'expense-tracking',
            label: 'Expenses',
            description: 'Expense tracking and approval',
            dataSource: '/api/finance/expenses',
            columns: ['expense_id', 'category', 'amount', 'date', 'approved_by', 'status'],
            permissions: ['finance'],
          },
          {
            id: 'budget-planning',
            label: 'Budget',
            description: 'Budget planning and forecasting',
            dataSource: '/api/finance/budget',
            columns: ['dept', 'category', 'budget', 'spent', 'variance', 'forecast'],
            permissions: ['finance', 'cfo', 'md'],
          },
        ],
      },
    },
  },

  COMPLIANCE: {
    label: 'Legal & Compliance',
    icon: 'shield-check',
    color: '#6366F1',
    defaultService: 'kyc-aml',
    permissions: ['compliance', 'legal', 'md'],
    services: {
      'kyc-aml': {
        label: 'KYC/AML Management',
        description: 'Know Your Customer & Anti-Money Laundering',
        component: 'ComplianceView',
        dataSource: '/api/compliance/kyc-aml',
        permissions: ['compliance', 'legal'],
        subitems: [
          {
            id: 'kyc-profiles',
            label: 'KYC Profiles',
            description: 'Customer KYC verification status',
            dataSource: '/api/compliance/kyc-profiles',
            columns: ['profile_id', 'client_name', 'status', 'verified_date', 'risk_level'],
            permissions: ['compliance', 'legal'],
          },
          {
            id: 'aml-alerts',
            label: 'AML Alerts',
            description: 'Anti-Money Laundering alerts',
            dataSource: '/api/compliance/aml-alerts',
            columns: ['alert_id', 'client', 'alert_type', 'date', 'severity', 'status'],
            permissions: ['compliance', 'legal'],
          },
          {
            id: 'document-verification',
            label: 'Documents',
            description: 'Document verification and management',
            dataSource: '/api/compliance/documents',
            columns: ['doc_id', 'type', 'client', 'status', 'verified_date'],
            permissions: ['compliance', 'legal'],
          },
          {
            id: 'audit-trail',
            label: 'Audit Trail',
            description: 'Compliance audit and activity logs',
            dataSource: '/api/compliance/audit-trail',
            columns: ['timestamp', 'user', 'action', 'resource', 'result'],
            permissions: ['compliance'],
          },
          {
            id: 'compliance-score',
            label: 'Compliance Score',
            description: 'Overall compliance metrics',
            dataSource: '/api/compliance/score',
            columns: ['metric', 'score', 'target', 'trend', 'status'],
            permissions: ['compliance', 'legal', 'md'],
          },
        ],
      },
    },
  },

  ANALYTICS: {
    label: 'Analytics & Insights',
    icon: 'bar-chart-2',
    color: '#F97316',
    defaultService: 'market-analytics',
    permissions: ['analytics', 'bi', 'md'],
    services: {
      'market-analytics': {
        label: 'Market Analytics',
        description: 'Market data and insights',
        component: 'AnalyticsView',
        dataSource: '/api/analytics/market',
        permissions: ['analytics', 'bi', 'md'],
        subitems: [
          {
            id: 'market-reports',
            label: 'Market Reports',
            description: 'Market analysis and reports',
            dataSource: '/api/analytics/market-reports',
            columns: ['report_name', 'date', 'region', 'segment', 'insights'],
            permissions: ['analytics', 'bi', 'md'],
          },
          {
            id: 'off-plan-projects',
            label: 'Off-Plan Projects',
            description: 'Off-plan project analytics',
            dataSource: '/api/analytics/off-plan',
            columns: ['project', 'developer', 'units', 'price_range', 'launch_date'],
            permissions: ['analytics', 'bi', 'md'],
          },
          {
            id: 'price-trends',
            label: 'Price Trends',
            description: 'Property price trends and forecasts',
            dataSource: '/api/analytics/trends',
            columns: ['location', 'property_type', 'current_price', 'trend', 'forecast'],
            permissions: ['analytics', 'bi', 'md'],
          },
          {
            id: 'demand-analysis',
            label: 'Demand Analysis',
            description: 'Market demand and forecasting',
            dataSource: '/api/analytics/demand',
            columns: ['segment', 'demand_level', 'trend', 'forecast', 'confidence'],
            permissions: ['analytics', 'bi'],
          },
          {
            id: 'custom-reports',
            label: 'Custom Reports',
            description: 'Create custom analytics reports',
            dataSource: '/api/analytics/custom',
            columns: ['report_name', 'created_by', 'date', 'status', 'actions'],
            permissions: ['analytics', 'bi', 'md'],
          },
        ],
      },
    },
  },

  TECHNOLOGY: {
    label: 'Technology & Systems',
    icon: 'cpu',
    color: '#14B8A6',
    defaultService: 'system-health',
    permissions: ['tech', 'cto', 'md'],
    services: {
      'system-health': {
        label: 'System Health',
        description: 'System monitoring and performance',
        component: 'TechnologyView',
        dataSource: '/api/technology/health',
        permissions: ['tech', 'cto'],
        subitems: [
          {
            id: 'uptime-monitoring',
            label: 'Uptime & Performance',
            description: 'System uptime and performance metrics',
            dataSource: '/api/technology/uptime',
            columns: ['service', 'uptime', 'response_time', 'error_rate', 'status'],
            permissions: ['tech', 'cto'],
          },
          {
            id: 'api-management',
            label: 'API Management',
            description: 'API usage and performance',
            dataSource: '/api/technology/api-usage',
            columns: ['endpoint', 'calls', 'avg_response', 'errors', 'status'],
            permissions: ['tech', 'cto'],
          },
          {
            id: 'database-admin',
            label: 'Database',
            description: 'Database performance and management',
            dataSource: '/api/technology/database',
            columns: ['db_name', 'size', 'connections', 'queries_per_sec', 'health'],
            permissions: ['tech'],
          },
          {
            id: 'security-monitoring',
            label: 'Security',
            description: 'Security events and monitoring',
            dataSource: '/api/technology/security',
            columns: ['event_type', 'timestamp', 'source', 'severity', 'action'],
            permissions: ['tech', 'cto'],
          },
          {
            id: 'deployment-logs',
            label: 'Deployments',
            description: 'Deployment history and logs',
            dataSource: '/api/technology/deployments',
            columns: ['version', 'date', 'deployed_by', 'services', 'status'],
            permissions: ['tech', 'cto'],
          },
        ],
      },
    },
  },

  MARKETING: {
    label: 'Marketing & Campaigns',
    icon: 'megaphone',
    color: '#F59E0B',
    defaultService: 'campaign-management',
    permissions: ['marketing', 'manager', 'md'],
    services: {
      'campaign-management': {
        label: 'Campaign Management',
        description: 'Marketing campaigns and content',
        component: 'MarketingView',
        dataSource: '/api/marketing/campaigns',
        permissions: ['marketing', 'manager'],
        subitems: [
          {
            id: 'active-campaigns',
            label: 'Active Campaigns',
            description: 'Currently running campaigns',
            dataSource: '/api/marketing/campaigns/active',
            columns: ['campaign_name', 'start_date', 'budget', 'reach', 'engagement', 'roi'],
            permissions: ['marketing', 'manager'],
          },
          {
            id: 'featured-listings',
            label: 'Featured Listings',
            description: 'Featured property listings',
            dataSource: '/api/marketing/featured-listings',
            columns: ['property', 'listing_date', 'impressions', 'clicks', 'calls', 'views'],
            permissions: ['marketing', 'manager'],
          },
          {
            id: 'content-marketing',
            label: 'Content',
            description: 'Content marketing assets',
            dataSource: '/api/marketing/content',
            columns: ['title', 'type', 'publish_date', 'views', 'engagement', 'status'],
            permissions: ['marketing', 'manager'],
          },
          {
            id: 'email-marketing',
            label: 'Email Campaigns',
            description: 'Email marketing campaigns',
            dataSource: '/api/marketing/email',
            columns: ['campaign', 'sent_to', 'open_rate', 'click_rate', 'conversion', 'date'],
            permissions: ['marketing'],
          },
          {
            id: 'social-media',
            label: 'Social Media',
            description: 'Social media metrics and posts',
            dataSource: '/api/marketing/social',
            columns: ['platform', 'posts', 'followers', 'engagement', 'reach', 'date'],
            permissions: ['marketing'],
          },
        ],
      },
    },
  },

  HUMAN_RESOURCES: {
    label: 'Human Resources',
    icon: 'users',
    color: '#06B6D4',
    defaultService: 'recruitment',
    permissions: ['hr', 'manager', 'md'],
    services: {
      recruitment: {
        label: 'Recruitment',
        description: 'Recruitment and hiring',
        component: 'HRView',
        dataSource: '/api/hr/recruitment',
        permissions: ['hr', 'manager'],
        subitems: [
          {
            id: 'job-openings',
            label: 'Job Openings',
            description: 'Open positions and applications',
            dataSource: '/api/hr/jobs',
            columns: ['position', 'department', 'posted_date', 'applications', 'status'],
            permissions: ['hr', 'manager'],
          },
          {
            id: 'candidates',
            label: 'Candidates',
            description: 'Candidate tracking and management',
            dataSource: '/api/hr/candidates',
            columns: ['name', 'position', 'status', 'rating', 'applied_date', 'actions'],
            permissions: ['hr', 'manager'],
          },
          {
            id: 'onboarding',
            label: 'Onboarding',
            description: 'Employee onboarding workflows',
            dataSource: '/api/hr/onboarding',
            columns: ['employee', 'hire_date', 'checklist_progress', 'status', 'mentor'],
            permissions: ['hr', 'manager'],
          },
          {
            id: 'performance',
            label: 'Performance',
            description: 'Performance reviews and ratings',
            dataSource: '/api/hr/performance',
            columns: ['employee', 'review_period', 'rating', 'status', 'reviewer', 'date'],
            permissions: ['hr', 'manager'],
          },
          {
            id: 'payroll',
            label: 'Payroll',
            description: 'Payroll and compensation',
            dataSource: '/api/hr/payroll',
            columns: ['employee', 'salary', 'deductions', 'net_pay', 'period', 'status'],
            permissions: ['hr'],
          },
        ],
      },
    },
  },
};

/**
 * Helper function to get all departments
 */
export const getAllDepartments = () => {
  return Object.entries(departmentContentMap).map(([key, dept]) => ({
    id: key,
    ...dept,
  }));
};

/**
 * Helper function to get department by ID
 */
export const getDepartmentById = (deptId) => {
  return departmentContentMap[deptId] || null;
};

/**
 * Helper function to get all services for a department
 */
export const getServicesByDepartment = (deptId) => {
  const dept = departmentContentMap[deptId];
  if (!dept) return [];
  return Object.entries(dept.services).map(([key, service]) => ({
    id: key,
    ...service,
  }));
};

/**
 * Helper function to get service by ID within department
 */
export const getServiceById = (deptId, serviceId) => {
  const dept = departmentContentMap[deptId];
  if (!dept || !dept.services[serviceId]) return null;
  return {
    id: serviceId,
    ...dept.services[serviceId],
  };
};

/**
 * Helper function to get subitems for a service
 */
export const getSubitemsByService = (deptId, serviceId) => {
  const service = getServiceById(deptId, serviceId);
  return service?.subitems || [];
};

/**
 * Helper function to get default department for user role
 * Maps user role to default department
 */
export const getDefaultDepartmentForRole = (userRole) => {
  const roleToDefaultDept = {
    'sales': 'SALES',
    'agent': 'SALES',
    'operations': 'OPERATIONS',
    'property-manager': 'PROPERTIES',
    'finance': 'FINANCE',
    'cfo': 'FINANCE',
    'compliance': 'COMPLIANCE',
    'legal': 'COMPLIANCE',
    'analytics': 'ANALYTICS',
    'bi': 'ANALYTICS',
    'marketing': 'MARKETING',
    'hr': 'HUMAN_RESOURCES',
    'tech': 'TECHNOLOGY',
    'cto': 'TECHNOLOGY',
    'md': 'EXECUTIVE',
    'executive': 'EXECUTIVE',
  };

  return roleToDefaultDept[userRole] || 'OPERATIONS';
};

/**
 * Helper function to filter departments by user permissions
 */
export const filterDepartmentsByPermissions = (permissions) => {
  return getAllDepartments().filter((dept) => {
    return dept.permissions.some((perm) => permissions.includes(perm));
  });
};

/**
 * Helper function to filter services by user permissions
 */
export const filterServicesByPermissions = (deptId, permissions) => {
  return getServicesByDepartment(deptId).filter((service) => {
    return service.permissions.some((perm) => permissions.includes(perm));
  });
};

/**
 * Helper function to filter subitems by user permissions
 */
export const filterSubitemsByPermissions = (deptId, serviceId, permissions) => {
  return getSubitemsByService(deptId, serviceId).filter((subitem) => {
    return subitem.permissions.some((perm) => permissions.includes(perm));
  });
};
