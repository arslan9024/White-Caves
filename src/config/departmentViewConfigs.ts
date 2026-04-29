/**
 * departmentViewConfigs.ts
 * Configuration for all 10 department views
 * Used by BaseDepartmentView to reduce code duplication
 */

export interface DepartmentConfig {
  departmentCode: string;
  departmentName: string;
  apiBasePath: string;
  defaultService: string;
  icon?: string;
  color?: string;
}

/**
 * Central configuration for all departments
 * Each department view component uses one of these configs
 */
export const departmentConfigs: Record<string, DepartmentConfig> = {
  EXECUTIVE: {
    departmentCode: 'EXECUTIVE',
    departmentName: 'Executive',
    apiBasePath: '/api/executive',
    defaultService: 'strategic-overview',
    icon: '👔',
    color: '#10B981',
  },
  SALES: {
    departmentCode: 'SALES',
    departmentName: 'Sales & Leasing',
    apiBasePath: '/api/sales',
    defaultService: 'lead-pipeline',
    icon: '💼',
    color: '#3B82F6',
  },
  OPERATIONS: {
    departmentCode: 'OPERATIONS',
    departmentName: 'Operations & Management',
    apiBasePath: '/api/operations',
    defaultService: 'department-overview',
    icon: '⚙️',
    color: '#EC4899',
  },
  PROPERTIES: {
    departmentCode: 'PROPERTIES',
    departmentName: 'Properties & Inventory',
    apiBasePath: '/api/properties',
    defaultService: 'inventory-management',
    icon: '🏠',
    color: '#8B5CF6',
  },
  FINANCE: {
    departmentCode: 'FINANCE',
    departmentName: 'Finance & Accounting',
    apiBasePath: '/api/finance',
    defaultService: 'financial-reports',
    icon: '💰',
    color: '#F59E0B',
  },
  COMPLIANCE: {
    departmentCode: 'COMPLIANCE',
    departmentName: 'Compliance & Legal',
    apiBasePath: '/api/compliance',
    defaultService: 'compliance-dashboard',
    icon: '⚖️',
    color: '#EF4444',
  },
  ANALYTICS: {
    departmentCode: 'ANALYTICS',
    departmentName: 'Analytics & Reporting',
    apiBasePath: '/api/analytics',
    defaultService: 'analytics-dashboard',
    icon: '📊',
    color: '#8B5CF6',
  },
  TECHNOLOGY: {
    departmentCode: 'TECHNOLOGY',
    departmentName: 'Technology & Infrastructure',
    apiBasePath: '/api/technology',
    defaultService: 'system-status',
    icon: '💻',
    color: '#6366F1',
  },
  MARKETING: {
    departmentCode: 'MARKETING',
    departmentName: 'Marketing & Communications',
    apiBasePath: '/api/marketing',
    defaultService: 'marketing-dashboard',
    icon: '📢',
    color: '#EC4899',
  },
  HR: {
    departmentCode: 'HR',
    departmentName: 'Human Resources',
    apiBasePath: '/api/hr',
    defaultService: 'employee-management',
    icon: '👥',
    color: '#3B82F6',
  },
};

/**
 * Get configuration for a specific department
 * @param departmentCode - e.g., 'SALES', 'FINANCE'
 * @returns Department configuration or null if not found
 */
export const getDepartmentConfig = (
  departmentCode: string
): DepartmentConfig | null => {
  return departmentConfigs[departmentCode] || null;
};

/**
 * Get all department configurations
 */
export const getAllDepartmentConfigs = (): DepartmentConfig[] => {
  return Object.values(departmentConfigs);
};

/**
 * Get list of department codes
 */
export const getDepartmentCodes = (): string[] => {
  return Object.keys(departmentConfigs);
};
