/**
 * White Caves Company Departments Registry
 * Defines all 10+ company departments with structure, services, and AI assistants
 */

export interface Department {
  id: string;
  name: string;
  fullName: string;
  icon: string;
  color: string;
  head: string;
  headTitle: string;
  email: string;
  phone: string;
  description: string;
  purpose: string;
  aiAssistants: string[]; // IDs of AI assistants supporting this dept
  services: string[]; // Service IDs handled by this dept
  teams: string[]; // Team IDs in this dept
  hierarchy: number; // 1=C-Suite, 2=Director, 3=Manager
}

export const DEPARTMENTS: Record<string, Department> = {
  EXEC: {
    id: 'EXEC',
    name: 'Executive',
    fullName: 'Executive Office',
    icon: '👔',
    color: '#10B981',
    head: 'Arslan Malik',
    headTitle: 'Managing Director',
    email: 'executive@whitecaves.ae',
    phone: 'Ext. 100',
    description: 'Strategic direction and high-level decision making',
    purpose: 'Set company vision, oversee all operations, manage stakeholder relations',
    aiAssistants: ['zoe', 'aurora'],
    services: ['strategic-planning', 'board-reporting', 'stakeholder-relations'],
    teams: ['executive-office'],
    hierarchy: 1,
  },
  SALES: {
    id: 'SALES',
    name: 'Sales & Leasing',
    fullName: 'Sales & Leasing Division',
    icon: '💼',
    color: '#3B82F6',
    head: 'Tariq Al-Farsi',
    headTitle: 'Director of Sales',
    email: 'sales@whitecaves.ae',
    phone: 'Ext. 201',
    description: 'Property sales and leasing management',
    purpose: 'Drive revenue through property sales and lease agreements',
    aiAssistants: ['clara', 'linda', 'nina', 'nancy'],
    services: ['residential-sales', 'commercial-sales', 'leasing', 'off-plan-sales'],
    teams: ['residential-sales-team', 'commercial-sales-team', 'leasing-team'],
    hierarchy: 2,
  },
  PROPMGMT: {
    id: 'PROPMGMT',
    name: 'Property Management',
    fullName: 'Property Management Division',
    icon: '🏠',
    color: '#8B5CF6',
    head: 'Layla Hassan',
    headTitle: 'Head of Property Management',
    email: 'management@whitecaves.ae',
    phone: 'Ext. 301',
    description: 'Ongoing property maintenance and client relations',
    purpose: 'Ensure seamless property management and client satisfaction',
    aiAssistants: ['mary', 'daisy', 'sentinel'],
    services: ['maintenance-scheduling', 'rent-collection', 'vendor-management', 'owner-reporting'],
    teams: ['maintenance-team', 'collection-team', 'property-support-team'],
    hierarchy: 2,
  },
  MARKETING: {
    id: 'MARKETING',
    name: 'Marketing & Business Dev',
    fullName: 'Marketing & Business Development',
    icon: '📢',
    color: '#F59E0B',
    head: 'Omar Khalid',
    headTitle: 'Marketing Director',
    email: 'marketing@whitecaves.ae',
    phone: 'Ext. 401',
    description: 'Brand promotion and business development',
    purpose: 'Drive market awareness and business growth initiatives',
    aiAssistants: ['nina', 'clara'],
    services: ['campaign-management', 'content-marketing', 'market-analysis', 'brand-management'],
    teams: ['digital-marketing-team', 'content-team', 'business-dev-team'],
    hierarchy: 2,
  },
  OPERATIONS: {
    id: 'OPERATIONS',
    name: 'Operations & Finance',
    fullName: 'Operations & Finance',
    icon: '💰',
    color: '#EC4899',
    head: 'Fatima Al-Zahra',
    headTitle: 'Chief Financial Officer',
    email: 'operations@whitecaves.ae',
    phone: 'Ext. 501',
    description: 'Financial management and operational efficiency',
    purpose: 'Ensure financial stability and operational excellence',
    aiAssistants: ['theodora', 'willow'],
    services: ['invoice-processing', 'payment-management', 'financial-reporting', 'budget-planning'],
    teams: ['finance-team', 'accounts-team', 'operations-team'],
    hierarchy: 2,
  },
  LEGAL: {
    id: 'LEGAL',
    name: 'Legal & Compliance',
    fullName: 'Legal & Compliance',
    icon: '⚖️',
    color: '#6366F1',
    head: 'Amira Al-Mansouri',
    headTitle: 'Head of Legal & Compliance',
    email: 'legal@whitecaves.ae',
    phone: 'Ext. 601',
    description: 'Legal contracts and regulatory compliance',
    purpose: 'Ensure all operations comply with UAE regulations and best practices',
    aiAssistants: [],
    services: ['contract-management', 'kyc-verification', 'compliance-checking', 'audit-trail'],
    teams: ['legal-team', 'compliance-team'],
    hierarchy: 2,
  },
  TECH: {
    id: 'TECH',
    name: 'Technology',
    fullName: 'Technology & Innovation',
    icon: '🔧',
    color: '#14B8A6',
    head: 'Tariq Al Qasimi',
    headTitle: 'Director of Technology',
    email: 'tech@whitecaves.ae',
    phone: 'Ext. 701',
    description: 'Platform development and infrastructure',
    purpose: 'Build and maintain world-class technology platform',
    aiAssistants: ['willow', 'morgan'],
    services: ['api-management', 'database-admin', 'performance-monitoring', 'security-management'],
    teams: ['backend-team', 'frontend-team', 'devops-team'],
    hierarchy: 2,
  },
  HR: {
    id: 'HR',
    name: 'Human Resources',
    fullName: 'Human Resources',
    icon: '👥',
    color: '#06B6D4',
    head: 'Sarah Johnson',
    headTitle: 'HR Manager',
    email: 'hr@whitecaves.ae',
    phone: 'Ext. 801',
    description: 'Recruitment and employee management',
    purpose: 'Build and maintain high-performance team culture',
    aiAssistants: ['nancy'],
    services: ['recruitment', 'onboarding', 'performance-management', 'payroll-processing'],
    teams: ['recruitment-team', 'employee-relations-team'],
    hierarchy: 3,
  },
  ANALYTICS: {
    id: 'ANALYTICS',
    name: 'Business Intelligence',
    fullName: 'Business Intelligence & Analytics',
    icon: '📊',
    color: '#F97316',
    head: 'Zoe',
    headTitle: 'Chief Analytics Officer',
    email: 'analytics@whitecaves.ae',
    phone: 'Ext. 901',
    description: 'Data analytics and business insights',
    purpose: 'Provide data-driven insights for strategic decision making',
    aiAssistants: ['zoe', 'aurora', 'theodora'],
    services: ['kpi-tracking', 'analytics-dashboard', 'report-generation', 'market-analysis'],
    teams: ['analytics-team', 'reporting-team'],
    hierarchy: 2,
  },
  SECURITY: {
    id: 'SECURITY',
    name: 'Security & Audit',
    fullName: 'Security & Audit',
    icon: '🔐',
    color: '#EF4444',
    head: 'Hassan Al-Mansouri',
    headTitle: 'Security Officer',
    email: 'security@whitecaves.ae',
    phone: 'Ext. 1001',
    description: 'System security and audit compliance',
    purpose: 'Protect company assets and ensure audit compliance',
    aiAssistants: [],
    services: ['access-control', 'activity-logging', 'compliance-reporting', 'threat-detection'],
    teams: ['security-team', 'audit-team'],
    hierarchy: 3,
  },
};

/**
 * Get all departments
 */
export const getAllDepartments = (): Department[] => {
  return Object.values(DEPARTMENTS);
};

/**
 * Get department by ID
 */
export const getDepartment = (id: string): Department | undefined => {
  return DEPARTMENTS[id];
};

/**
 * Get departments by hierarchy level
 */
export const getDepartmentsByHierarchy = (level: number): Department[] => {
  return Object.values(DEPARTMENTS).filter(d => d.hierarchy === level);
};

/**
 * Get departments by AI assistant
 */
export const getDepartmentsByAssistant = (assistantId: string): Department[] => {
  return Object.values(DEPARTMENTS).filter(d =>
    d.aiAssistants.includes(assistantId)
  );
};

/**
 * Get AI assistants for a department
 */
export const getDepartmentAssistants = (departmentId: string): string[] => {
  return DEPARTMENTS[departmentId]?.aiAssistants || [];
};

export default DEPARTMENTS;
