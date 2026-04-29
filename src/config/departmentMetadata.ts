/**
 * Department Icons and Metadata
 * Central mapping for department visual elements
 */

export interface DepartmentMetadata {
  code: string;
  name: string;
  icon: string;
  emoji: string;
  color: string;
  description: string;
  services: string[];
}

export const DEPARTMENT_METADATA: Record<string, DepartmentMetadata> = {
  SALES: {
    code: 'SALES',
    name: 'Sales & Leasing',
    icon: 'sales',
    emoji: '📈',
    color: '#3498db',
    description: 'Manage sales pipeline, leads, and leasing deals',
    services: ['lead-pipeline', 'active-deals', 'client-journey', 'contracts'],
  },
  FINANCE: {
    code: 'FINANCE',
    name: 'Finance & Accounting',
    icon: 'finance',
    emoji: '💰',
    color: '#27ae60',
    description: 'Financial management, budgets, and accounting',
    services: ['revenue-tracking', 'budgets', 'expenses', 'reports'],
  },
  EXECUTIVE: {
    code: 'EXECUTIVE',
    name: 'Executive & Strategy',
    icon: 'executive',
    emoji: '👔',
    color: '#8e44ad',
    description: 'Strategic planning and executive decisions',
    services: ['strategic-goals', 'board-reports', 'announcements', 'metrics'],
  },
  OPERATIONS: {
    code: 'OPERATIONS',
    name: 'Operations & Logistics',
    icon: 'operations',
    emoji: '⚙️',
    color: '#e74c3c',
    description: 'Operations management and logistics',
    services: ['tasks', 'delivery-tracking', 'efficiency', 'productivity'],
  },
  PROPERTY_MANAGEMENT: {
    code: 'PROPERTY_MANAGEMENT',
    name: 'Property Management',
    icon: 'property',
    emoji: '🏢',
    color: '#f39c12',
    description: 'Property portfolio and tenant management',
    services: ['properties', 'maintenance', 'tenants', 'occupancy'],
  },
  COMPLIANCE: {
    code: 'COMPLIANCE',
    name: 'Compliance & Legal',
    icon: 'compliance',
    emoji: '✅',
    color: '#16a085',
    description: 'Compliance, legal, and audit management',
    services: ['audit-trails', 'kyc-records', 'policies', 'regulations'],
  },
  ANALYTICS: {
    code: 'ANALYTICS',
    name: 'Analytics & BI',
    icon: 'analytics',
    emoji: '📊',
    color: '#2980b9',
    description: 'Data analytics and business intelligence',
    services: ['reports', 'dashboards', 'data-models', 'insights'],
  },
  TECHNOLOGY: {
    code: 'TECHNOLOGY',
    name: 'Technology & Infrastructure',
    icon: 'technology',
    emoji: '💻',
    color: '#34495e',
    description: 'IT infrastructure and system management',
    services: ['systems', 'infrastructure', 'security', 'support'],
  },
  MARKETING: {
    code: 'MARKETING',
    name: 'Marketing & Communications',
    icon: 'marketing',
    emoji: '📢',
    color: '#e67e22',
    description: 'Marketing campaigns and communications',
    services: ['campaigns', 'leads', 'engagement', 'analytics'],
  },
  HR: {
    code: 'HR',
    name: 'Human Resources',
    icon: 'hr',
    emoji: '👥',
    color: '#d35400',
    description: 'Human resources and employee management',
    services: ['employees', 'payroll', 'recruitment', 'training'],
  },
};

/**
 * Get department metadata by code
 */
export const getDepartmentMetadata = (code: string): DepartmentMetadata | null => {
  return DEPARTMENT_METADATA[code] || null;
};

/**
 * Get all departments sorted by name
 */
export const getAllDepartments = (): DepartmentMetadata[] => {
  return Object.values(DEPARTMENT_METADATA).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
};

/**
 * Get department by code with fallback
 */
export const getDepartmentWithFallback = (
  code: string,
  fallbackName: string = 'Unknown Department'
): DepartmentMetadata => {
  return (
    DEPARTMENT_METADATA[code] || {
      code,
      name: fallbackName,
      icon: 'default',
      emoji: '📁',
      color: '#95a5a6',
      description: 'Department',
      services: [],
    }
  );
};

/**
 * Get color for department
 */
export const getDepartmentColor = (code: string): string => {
  return DEPARTMENT_METADATA[code]?.color || '#95a5a6';
};

/**
 * Get emoji for department
 */
export const getDepartmentEmoji = (code: string): string => {
  return DEPARTMENT_METADATA[code]?.emoji || '📁';
};

/**
 * Get name for department
 */
export const getDepartmentName = (code: string): string => {
  return DEPARTMENT_METADATA[code]?.name || 'Unknown Department';
};

/**
 * Filter departments by search query
 */
export const searchDepartments = (query: string): DepartmentMetadata[] => {
  if (!query) return getAllDepartments();

  const lowercaseQuery = query.toLowerCase();
  return Object.values(DEPARTMENT_METADATA).filter(
    (dept) =>
      dept.name.toLowerCase().includes(lowercaseQuery) ||
      dept.description.toLowerCase().includes(lowercaseQuery) ||
      dept.services.some((service) => service.includes(lowercaseQuery))
  );
};

/**
 * Get departments by service
 */
export const getDepartmentsByService = (service: string): DepartmentMetadata[] => {
  return Object.values(DEPARTMENT_METADATA).filter((dept) =>
    dept.services.includes(service)
  );
};
