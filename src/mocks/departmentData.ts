/**
 * Mock Department Data
 * Provides realistic test data for all department views
 * Used for development and testing before API integration
 */

export interface DepartmentData {
  departmentCode: string;
  departmentName: string;
  summary: {
    totalItems: number;
    activeItems: number;
    pendingItems: number;
    completedItems: number;
  };
  kpis: Array<{
    label: string;
    value: number | string;
    change?: number;
    unit?: string;
  }>;
  pipelineBoard?: Record<string, unknown>[];
  activeDeals?: Record<string, unknown>[];
  clientJourney?: Record<string, unknown>[];
  salesContracts?: Record<string, unknown>[];
  financialSummary?: Record<string, unknown>[];
  budgets?: Record<string, unknown>[];
  announcements?: Record<string, unknown>[];
  strategicMetrics?: Record<string, unknown>[];
  auditTrails?: Record<string, unknown>[];
  kycRecords?: Record<string, unknown>[];
  maintenanceTasks?: Record<string, unknown>[];
  propertyPortfolio?: Record<string, unknown>[];
  tenantInfo?: Record<string, unknown>[];
  analytics?: Record<string, unknown>[];
  dataReports?: Record<string, unknown>[];
  infrastructure?: Record<string, unknown>[];
  systemMetrics?: Record<string, unknown>[];
  campaigns?: Record<string, unknown>[];
  marketingMetrics?: Record<string, unknown>[];
  employees?: Record<string, unknown>[];
  payrollData?: Record<string, unknown>[];
  operations?: Record<string, unknown>[];
  operationsMetrics?: Record<string, unknown>[];
}

export const MOCK_DEPARTMENT_DATA: Record<string, DepartmentData> = {
  SALES: {
    departmentCode: 'SALES',
    departmentName: 'Sales & Leasing',
    summary: {
      totalItems: 142,
      activeItems: 98,
      pendingItems: 32,
      completedItems: 12,
    },
    kpis: [
      { label: 'Total Leads', value: 342, change: 12, unit: '+12% vs last week' },
      { label: 'Conversion Rate', value: '28%', change: 5, unit: '+5% vs last week' },
      { label: 'Active Deals', value: 98, change: 8, unit: '+8 new deals' },
      { label: 'Revenue Forecast', value: '$2.4M', change: 15, unit: '+15% vs forecast' },
    ],
    pipelineBoard: [
      { id: 1, title: 'Lead A', stage: 'Prospecting', value: '$50,000' },
      { id: 2, title: 'Deal B', stage: 'Negotiation', value: '$150,000' },
      { id: 3, title: 'Client C', stage: 'Closing', value: '$200,000' },
    ],
    activeDeals: [
      { id: 1, client: 'ABC Corp', amount: '$150,000', status: 'In Progress' },
      { id: 2, client: 'XYZ Ltd', amount: '$250,000', status: 'In Progress' },
    ],
    clientJourney: [
      { id: 1, name: 'Client A', stage: 'Qualification' },
      { id: 2, name: 'Client B', stage: 'Negotiation' },
    ],
    salesContracts: [
      { id: 1, contract: 'CNT-001', client: 'ABC Corp', amount: '$50,000', status: 'Active' },
    ],
  },

  FINANCE: {
    departmentCode: 'FINANCE',
    departmentName: 'Finance & Accounting',
    summary: {
      totalItems: 87,
      activeItems: 45,
      pendingItems: 28,
      completedItems: 14,
    },
    kpis: [
      { label: 'Monthly Revenue', value: '$2.8M', change: 8, unit: '+8% vs last month' },
      { label: 'Operating Expenses', value: '$1.2M', change: -3, unit: '-3% vs budget' },
      { label: 'Cash Flow', value: '$1.6M', change: 12, unit: '+12% growth' },
      { label: 'Budget Utilization', value: '78%', change: 5, unit: '+5% vs forecast' },
    ],
    financialSummary: [
      { period: 'Jan 2026', revenue: '$2.8M', expenses: '$1.2M', profit: '$1.6M' },
    ],
    budgets: [
      { department: 'Sales', budget: '$500K', actual: '$420K', variance: 16 },
      { department: 'Operations', budget: '$300K', actual: '$290K', variance: 3 },
    ],
  },

  EXECUTIVE: {
    departmentCode: 'EXECUTIVE',
    departmentName: 'Executive & Strategy',
    summary: {
      totalItems: 24,
      activeItems: 18,
      pendingItems: 4,
      completedItems: 2,
    },
    kpis: [
      { label: 'Strategic Goals', value: '12/15', change: 30, unit: '80% completion' },
      { label: 'Board Reports', value: '4/4', change: 100, unit: 'All submitted' },
      { label: 'Executive Decisions', value: '28', change: 10, unit: '+10 this quarter' },
      { label: 'Annual Growth Target', value: '24%', change: 8, unit: '+8% on track' },
    ],
    announcements: [
      { id: 1, title: 'Q1 Results Announcement', date: '2026-01-15' },
      { id: 2, title: 'New Strategic Partnership', date: '2026-01-18' },
    ],
    strategicMetrics: [
      { metric: 'Market Share', value: '12.5%', trend: 'up' },
      { metric: 'Customer Satisfaction', value: '4.5/5', trend: 'up' },
    ],
  },

  OPERATIONS: {
    departmentCode: 'OPERATIONS',
    departmentName: 'Operations & Logistics',
    summary: {
      totalItems: 156,
      activeItems: 112,
      pendingItems: 32,
      completedItems: 12,
    },
    kpis: [
      { label: 'Tasks Completed', value: '342/450', change: 76, unit: '76% complete' },
      { label: 'On-Time Delivery', value: '98%', change: 2, unit: '+2% vs last month' },
      { label: 'Cost Efficiency', value: '$15/unit', change: -8, unit: '-8% vs target' },
      { label: 'Team Productivity', value: '95%', change: 5, unit: '+5% improvement' },
    ],
    operations: [
      { id: 1, task: 'Supply Chain Review', status: 'In Progress' },
      { id: 2, task: 'Inventory Check', status: 'Pending' },
    ],
    operationsMetrics: [
      { metric: 'Capacity Utilization', value: '85%' },
      { metric: 'Equipment Downtime', value: '0.5%' },
    ],
  },

  COMPLIANCE: {
    departmentCode: 'COMPLIANCE',
    departmentName: 'Compliance & Legal',
    summary: {
      totalItems: 76,
      activeItems: 54,
      pendingItems: 18,
      completedItems: 4,
    },
    kpis: [
      { label: 'Compliance Rate', value: '99.2%', change: 0.8, unit: 'All areas compliant' },
      { label: 'Audit Trail Items', value: '1,245', change: 12, unit: '+12 new entries' },
      { label: 'KYC Records', value: '987/1000', change: 99, unit: '98.7% complete' },
      { label: 'Risk Assessment', value: 'Low', change: 0, unit: 'No violations' },
    ],
    auditTrails: [
      { id: 1, action: 'Data Access', user: 'john@company.com', timestamp: '2026-01-20 10:30' },
    ],
    kycRecords: [
      { id: 1, name: 'Client A', status: 'Verified', date: '2025-12-15' },
    ],
  },

  ANALYTICS: {
    departmentCode: 'ANALYTICS',
    departmentName: 'Analytics & BI',
    summary: {
      totalItems: 52,
      activeItems: 38,
      pendingItems: 10,
      completedItems: 4,
    },
    kpis: [
      { label: 'Reports Generated', value: '124', change: 15, unit: '+15% vs last month' },
      { label: 'Data Accuracy', value: '99.8%', change: 0.2, unit: 'Excellent' },
      { label: 'Query Response Time', value: '1.2s', change: -20, unit: '-20% faster' },
      { label: 'Data Models', value: '18', change: 3, unit: '+3 new models' },
    ],
    dataReports: [
      { id: 1, name: 'Sales Performance', date: '2026-01-20', rows: 1250 },
      { id: 2, name: 'Customer Analytics', date: '2026-01-19', rows: 3420 },
    ],
    analytics: [
      { metric: 'Active Dashboards', value: 24 },
      { metric: 'Monthly Queries', value: '12,500' },
    ],
  },

  TECHNOLOGY: {
    departmentCode: 'TECHNOLOGY',
    departmentName: 'Technology & Infrastructure',
    summary: {
      totalItems: 98,
      activeItems: 65,
      pendingItems: 24,
      completedItems: 9,
    },
    kpis: [
      { label: 'System Uptime', value: '99.95%', change: 0.05, unit: 'Excellent' },
      { label: 'Tickets Resolved', value: '245/280', change: 87, unit: '87% resolved' },
      { label: 'Infrastructure Cost', value: '$125K/mo', change: -5, unit: '-5% vs budget' },
      { label: 'Security Score', value: '94/100', change: 2, unit: '+2 points' },
    ],
    infrastructure: [
      { id: 1, service: 'Database Cluster', status: 'Healthy' },
      { id: 2, service: 'Load Balancer', status: 'Healthy' },
    ],
    systemMetrics: [
      { metric: 'CPU Utilization', value: '42%' },
      { metric: 'Memory Usage', value: '67%' },
    ],
  },

  MARKETING: {
    departmentCode: 'MARKETING',
    departmentName: 'Marketing & Communications',
    summary: {
      totalItems: 64,
      activeItems: 48,
      pendingItems: 12,
      completedItems: 4,
    },
    kpis: [
      { label: 'Active Campaigns', value: '12', change: 3, unit: '+3 new campaigns' },
      { label: 'Lead Generation', value: '2,450', change: 18, unit: '+18% vs last month' },
      { label: 'Email Open Rate', value: '34%', change: 5, unit: '+5% improvement' },
      { label: 'Social Engagement', value: '45K', change: 25, unit: '+25% interactions' },
    ],
    campaigns: [
      { id: 1, name: 'Spring Campaign', status: 'Active', leads: 450 },
      { id: 2, name: 'Summer Promo', status: 'Planning', leads: 0 },
    ],
    marketingMetrics: [
      { metric: 'Website Traffic', value: '125K/month' },
      { metric: 'Conversion Rate', value: '3.2%' },
    ],
  },

  PROPERTY_MANAGEMENT: {
    departmentCode: 'PROPERTY_MANAGEMENT',
    departmentName: 'Property Management',
    summary: {
      totalItems: 234,
      activeItems: 156,
      pendingItems: 56,
      completedItems: 22,
    },
    kpis: [
      { label: 'Properties Managed', value: '156', change: 5, unit: '+5 new properties' },
      { label: 'Occupancy Rate', value: '92%', change: 3, unit: '+3% improvement' },
      { label: 'Maintenance Issues', value: '12/156', change: 8, unit: '92% resolved' },
      { label: 'Tenant Satisfaction', value: '4.6/5', change: 0.2, unit: '+0.2 rating' },
    ],
    propertyPortfolio: [
      { id: 1, property: 'Downtown Tower', units: 120, occupied: 112 },
      { id: 2, property: 'Suburban Complex', units: 80, occupied: 74 },
    ],
    maintenanceTasks: [
      { id: 1, task: 'HVAC Service', property: 'Downtown Tower', status: 'Scheduled' },
      { id: 2, task: 'Roof Inspection', property: 'Suburban Complex', status: 'Pending' },
    ],
  },

  HR: {
    departmentCode: 'HR',
    departmentName: 'Human Resources',
    summary: {
      totalItems: 285,
      activeItems: 180,
      pendingItems: 85,
      completedItems: 20,
    },
    kpis: [
      { label: 'Total Employees', value: '487', change: 12, unit: '+12 hired this quarter' },
      { label: 'Turnover Rate', value: '3.2%', change: -0.5, unit: '-0.5% improvement' },
      { label: 'Training Programs', value: '24', change: 4, unit: '+4 new programs' },
      { label: 'Employee Satisfaction', value: '4.3/5', change: 0.3, unit: '+0.3 rating' },
    ],
    employees: [
      { id: 1, name: 'John Doe', department: 'Sales', role: 'Manager' },
      { id: 2, name: 'Jane Smith', department: 'Finance', role: 'Analyst' },
    ],
    payrollData: [
      { month: 'Jan 2026', total: '$485K', processed: true },
      { month: 'Dec 2025', total: '$480K', processed: true },
    ],
  },
};

/**
 * Get mock data for a specific department
 */
export const getMockDepartmentData = (departmentCode: string): DepartmentData | null => {
  return MOCK_DEPARTMENT_DATA[departmentCode] || null;
};

/**
 * Get all available departments
 */
export const getAvailableDepartments = (): string[] => {
  return Object.keys(MOCK_DEPARTMENT_DATA);
};
