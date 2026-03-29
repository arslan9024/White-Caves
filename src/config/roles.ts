/**
 * REAL_ESTATE_ROLES - Centralized role definitions for the White Caves platform
 * 
 * Extracted from RoleSelectorDropdown to eliminate cross-system dependencies.
 * Used by: UsersTab, RoleSelectorDropdown, and any role-based UI.
 */

import {
  Crown, Building2, Users, UserCheck, Home, Key, Briefcase,
  Shield, Gavel, ClipboardList, Wallet,
  User, HeartHandshake, Scale, FileCheck, Landmark, HardHat,
  Calculator, BadgeCheck, TrendingUp, Handshake, Eye, Building, Truck,
  type LucideIcon
} from 'lucide-react';

export interface RoleDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  permissions: string[];
  dashboardPath: string;
  category: 'executive' | 'admin' | 'management' | 'agent' | 'specialist' | 'support' | 'client';
}

export const REAL_ESTATE_ROLES: RoleDefinition[] = [
  {
    id: 'managing_director',
    name: 'Managing Director',
    icon: Crown,
    color: '#FFD700',
    description: 'Full access to all features, analytics, and settings',
    permissions: ['*'],
    dashboardPath: '/md/dashboard',
    category: 'executive'
  },
  {
    id: 'real_estate_company',
    name: 'Real Estate Company Admin',
    icon: Building2,
    color: '#1E40AF',
    description: 'Oversee agents, listings, and company performance',
    permissions: ['company.*', 'agents.*', 'properties.*', 'analytics.*'],
    dashboardPath: '/company/dashboard',
    category: 'executive'
  },
  {
    id: 'property_mgmt_company',
    name: 'Property Management Co.',
    icon: Building,
    color: '#7C3AED',
    description: 'Manage multiple properties, tenants, and maintenance',
    permissions: ['properties.*', 'tenants.*', 'maintenance.*', 'finance.*'],
    dashboardPath: '/management/dashboard',
    category: 'executive'
  },
  {
    id: 'super_admin',
    name: 'Super Admin',
    icon: Shield,
    color: '#E31E24',
    description: 'System administration and user management',
    permissions: ['admin.*', 'users.*', 'settings.*'],
    dashboardPath: '/admin/dashboard',
    category: 'admin'
  },
  {
    id: 'branch_manager',
    name: 'Branch Manager',
    icon: Users,
    color: '#2563EB',
    description: 'Manage branch operations, agents, and listings',
    permissions: ['branch.*', 'agents.*', 'properties.approve'],
    dashboardPath: '/branch/dashboard',
    category: 'management'
  },
  {
    id: 'sales_manager',
    name: 'Sales Manager',
    icon: Briefcase,
    color: '#7C3AED',
    description: 'Oversee sales team, targets, and commissions',
    permissions: ['sales.*', 'agents.view', 'commissions.*'],
    dashboardPath: '/sales/dashboard',
    category: 'management'
  },
  {
    id: 'leasing_manager',
    name: 'Leasing Manager',
    icon: Key,
    color: '#059669',
    description: 'Manage rental properties and tenancy contracts',
    permissions: ['rentals.*', 'tenancy.*', 'ejari.*'],
    dashboardPath: '/leasing/dashboard',
    category: 'management'
  },
  {
    id: 'sales_agent',
    name: 'Sales Agent / Broker',
    icon: UserCheck,
    color: '#EA580C',
    description: 'Facilitate property sales, manage buyer/seller relations',
    permissions: ['properties.own', 'leads.own', 'clients.own', 'sales.*'],
    dashboardPath: '/agent/dashboard',
    category: 'agent'
  },
  {
    id: 'leasing_agent',
    name: 'Leasing Agent',
    icon: Handshake,
    color: '#10B981',
    description: 'Handle rental listings and tenant placements',
    permissions: ['rentals.own', 'leads.own', 'clients.own', 'tenancy.*'],
    dashboardPath: '/leasing-agent/dashboard',
    category: 'agent'
  },
  {
    id: 'property_manager',
    name: 'Property Manager',
    icon: ClipboardList,
    color: '#6366F1',
    description: 'Day-to-day property operations and tenant relations',
    permissions: ['properties.manage', 'tenants.*', 'maintenance.*'],
    dashboardPath: '/property-manager/dashboard',
    category: 'agent'
  },
  {
    id: 'property_consultant',
    name: 'Real Estate Consultant',
    icon: HeartHandshake,
    color: '#0891B2',
    description: 'Advise on market trends and investment opportunities',
    permissions: ['properties.view', 'clients.own', 'analytics.view'],
    dashboardPath: '/consultant/dashboard',
    category: 'specialist'
  },
  {
    id: 'mortgage_consultant',
    name: 'Mortgage Consultant',
    icon: Calculator,
    color: '#0D9488',
    description: 'Provide financing solutions and mortgage advice',
    permissions: ['mortgages.*', 'clients.own', 'documents.mortgage'],
    dashboardPath: '/mortgage/dashboard',
    category: 'specialist'
  },
  {
    id: 'valuation_expert',
    name: 'Real Estate Valuer',
    icon: Gavel,
    color: '#A855F7',
    description: 'Conduct property valuations and appraisals',
    permissions: ['valuations.*', 'properties.view', 'reports.valuation'],
    dashboardPath: '/valuation/dashboard',
    category: 'specialist'
  },
  {
    id: 'trustee_officer',
    name: 'Trustee Officer',
    icon: BadgeCheck,
    color: '#4338CA',
    description: 'Facilitate official transfers and verify documents',
    permissions: ['transfers.*', 'documents.verify', 'contracts.trustee'],
    dashboardPath: '/trustee/dashboard',
    category: 'specialist'
  },
  {
    id: 'legal_officer',
    name: 'Legal Officer',
    icon: Scale,
    color: '#4F46E5',
    description: 'Handle contracts, compliance, and legal matters',
    permissions: ['contracts.*', 'legal.*', 'compliance.*'],
    dashboardPath: '/legal/dashboard',
    category: 'support'
  },
  {
    id: 'finance_officer',
    name: 'Finance Officer',
    icon: Wallet,
    color: '#16A34A',
    description: 'Manage payments, invoices, and financial reports',
    permissions: ['finance.*', 'payments.*', 'reports.financial'],
    dashboardPath: '/finance/dashboard',
    category: 'support'
  },
  {
    id: 'marketing_manager',
    name: 'Marketing Manager',
    icon: Eye,
    color: '#DB2777',
    description: 'Manage campaigns, listings visibility, and branding',
    permissions: ['marketing.*', 'properties.promote', 'analytics.marketing'],
    dashboardPath: '/marketing/dashboard',
    category: 'support'
  },
  {
    id: 'document_controller',
    name: 'Document Controller',
    icon: FileCheck,
    color: '#6366F1',
    description: 'Manage property documents and verifications',
    permissions: ['documents.*', 'verification.*'],
    dashboardPath: '/documents/dashboard',
    category: 'support'
  },
  {
    id: 'developer',
    name: 'Real Estate Developer',
    icon: HardHat,
    color: '#78716C',
    description: 'Manage off-plan projects and developments',
    permissions: ['projects.*', 'offplan.*', 'sales.developer'],
    dashboardPath: '/developer/dashboard',
    category: 'client'
  },
  {
    id: 'investor',
    name: 'Investor',
    icon: TrendingUp,
    color: '#0369A1',
    description: 'Access market analytics and investment opportunities',
    permissions: ['analytics.investor', 'properties.view', 'roi.view'],
    dashboardPath: '/investor/dashboard',
    category: 'client'
  },
  {
    id: 'landlord',
    name: 'Landlord / Seller',
    icon: Landmark,
    color: '#8B5CF6',
    description: 'Manage owned properties and rental/sale listings',
    permissions: ['properties.own', 'tenants.view', 'income.own'],
    dashboardPath: '/landlord/dashboard',
    category: 'client'
  },
  {
    id: 'buyer',
    name: 'Property Buyer',
    icon: User,
    color: '#0EA5E9',
    description: 'Search properties, save favorites, make offers',
    permissions: ['properties.view', 'favorites.own', 'offers.own'],
    dashboardPath: '/buyer/dashboard',
    category: 'client'
  },
  {
    id: 'tenant',
    name: 'Tenant',
    icon: Home,
    color: '#14B8A6',
    description: 'View rented property, pay rent, raise requests',
    permissions: ['tenancy.own', 'payments.own', 'requests.own'],
    dashboardPath: '/tenant/dashboard',
    category: 'client'
  },
  {
    id: 'affiliated_agent',
    name: 'Affiliated Agent',
    icon: Truck,
    color: '#F97316',
    description: 'Independent contractor under company sponsorship',
    permissions: ['properties.own', 'leads.own', 'clients.limited'],
    dashboardPath: '/agent/dashboard',
    category: 'agent'
  }
];

/** Map legacy/alternate role keys to canonical role IDs */
export const ROLE_KEY_MAP: Record<string, string> = {
  'owner': 'managing_director',
  'md': 'managing_director',
  'managing_director': 'managing_director',
  'leasing-agent': 'leasing_agent',
  'secondary-sales-agent': 'sales_agent',
  'property-manager': 'property_manager',
  'sales-agent': 'sales_agent',
  'admin': 'super_admin',
  'seller': 'landlord',
};

/** Normalize a role key to a canonical role ID */
export const normalizeRoleKey = (roleKey: string | null | undefined): string => {
  if (!roleKey) return 'managing_director';
  if (ROLE_KEY_MAP[roleKey]) return ROLE_KEY_MAP[roleKey];
  return roleKey.replace(/-/g, '_');
};

/** Get role definition by ID or normalized key */
export const getRoleById = (roleId: string): RoleDefinition | undefined => {
  const normalized = normalizeRoleKey(roleId);
  return REAL_ESTATE_ROLES.find(r => r.id === normalized);
};

/** Get roles by category */
export const getRolesByCategory = (category: RoleDefinition['category']): RoleDefinition[] => {
  return REAL_ESTATE_ROLES.filter(r => r.category === category);
};

export default REAL_ESTATE_ROLES;
