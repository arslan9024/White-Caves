import { CRM_MODULE_REGISTRY } from '../../../config/crmModuleRegistry';

const EXECUTIVE_ROLES = new Set(['owner', 'managing_director', 'manager', 'admin', 'finance']);
const FOCUSED_ROLES = new Set(['agent', 'supervisor']);
const FOCUSED_MODULES = new Set(['leads', 'valuation', 'henry-tenancy-journey', 'agent-task-cockpit']);

const ROLE_ALIASES: Record<string, string> = {
  lion: 'owner',
  leasing_agent: 'agent',
  'leasing-agent': 'agent',
  sales_agent: 'agent',
  'secondary-sales-agent': 'agent',
  viewer: 'agent',
  hr_staff: 'agent',
  accounts_staff: 'agent',
  buyer: 'agent',
  seller: 'agent',
  landlord: 'agent',
  tenant: 'agent',
  property_owner: 'agent',
  user: 'agent',
};

export const normalizeDashboardAccessRole = (role: string | undefined): string => {
  const normalizedRole = role?.toLowerCase().trim() ?? '';
  return ROLE_ALIASES[normalizedRole] ?? normalizedRole;
};

export const canAccessCRMModule = (role: string | undefined, moduleId: string): boolean => {
  const normalizedRole = normalizeDashboardAccessRole(role);
  if (!normalizedRole || !CRM_MODULE_REGISTRY[moduleId]) return false;
  if (EXECUTIVE_ROLES.has(normalizedRole)) return true;
  return FOCUSED_ROLES.has(normalizedRole) && FOCUSED_MODULES.has(moduleId);
};