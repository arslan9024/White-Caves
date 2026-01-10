import {
  LayoutDashboard, Users, Building2, UserCog, DollarSign, 
  Bot, BarChart3, Settings, Home, Search, Heart, FileText,
  MessageSquare, Calendar, Shield, Briefcase, TrendingUp,
  Inbox, Bell, Database, Workflow, Zap
} from 'lucide-react';

export const DEPARTMENTS = {
  operations: {
    id: 'operations',
    name: 'Operations',
    color: '#3B82F6',
    icon: Workflow,
    description: 'Inventory, availability, and daily operations'
  },
  sales: {
    id: 'sales',
    name: 'Sales',
    color: '#EC4899',
    icon: TrendingUp,
    description: 'Lead management and sales pipeline'
  },
  communications: {
    id: 'communications',
    name: 'Communications',
    color: '#25D366',
    icon: MessageSquare,
    description: 'WhatsApp, email, and customer contact'
  },
  finance: {
    id: 'finance',
    name: 'Finance',
    color: '#F59E0B',
    icon: DollarSign,
    description: 'Payments, commissions, and accounting'
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    color: '#8B5CF6',
    icon: Zap,
    description: 'Campaigns, content, and brand management'
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    color: '#DC2626',
    icon: Briefcase,
    description: 'Strategic decisions and company oversight'
  },
  compliance: {
    id: 'compliance',
    name: 'Compliance',
    color: '#059669',
    icon: Shield,
    description: 'KYC, AML, and regulatory compliance'
  },
  technology: {
    id: 'technology',
    name: 'Technology',
    color: '#6366F1',
    icon: Database,
    description: 'System health, APIs, and infrastructure'
  },
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence',
    color: '#0EA5E9',
    icon: BarChart3,
    description: 'Market research and competitive analysis'
  },
  legal: {
    id: 'legal',
    name: 'Legal',
    color: '#64748B',
    icon: FileText,
    description: 'Contracts, Ejari, and legal documentation'
  }
};

export const AI_ASSISTANTS = {
  zoe: { id: 'zoe', name: 'Zoe', department: 'executive', role: 'CEO Intelligence', color: '#DC2626', status: 'active' },
  mary: { id: 'mary', name: 'Mary', department: 'operations', role: 'Inventory Manager', color: '#3B82F6', status: 'active' },
  daisy: { id: 'daisy', name: 'Daisy', department: 'operations', role: 'Property Coordinator', color: '#10B981', status: 'active' },
  sentinel: { id: 'sentinel', name: 'Sentinel', department: 'operations', role: 'Quality Control', color: '#F97316', status: 'active' },
  clara: { id: 'clara', name: 'Clara', department: 'sales', role: 'Lead Manager', color: '#EC4899', status: 'active' },
  nancy: { id: 'nancy', name: 'Nancy', department: 'sales', role: 'HR & Performance', color: '#A855F7', status: 'active' },
  hunter: { id: 'hunter', name: 'Hunter', department: 'sales', role: 'Lead Hunter', color: '#EF4444', status: 'active' },
  linda: { id: 'linda', name: 'Linda', department: 'communications', role: 'WhatsApp Manager', color: '#25D366', status: 'active' },
  nina: { id: 'nina', name: 'Nina', department: 'communications', role: 'Client Relations', color: '#06B6D4', status: 'active' },
  theodora: { id: 'theodora', name: 'Theodora', department: 'finance', role: 'CFO Intelligence', color: '#F59E0B', status: 'active' },
  penny: { id: 'penny', name: 'Penny', department: 'finance', role: 'Commission Tracker', color: '#84CC16', status: 'active' },
  quinn: { id: 'quinn', name: 'Quinn', department: 'finance', role: 'Payment Processor', color: '#14B8A6', status: 'active' },
  marcus: { id: 'marcus', name: 'Marcus', department: 'marketing', role: 'Campaign Manager', color: '#8B5CF6', status: 'active' },
  stella: { id: 'stella', name: 'Stella', department: 'marketing', role: 'Content Creator', color: '#F472B6', status: 'active' },
  laila: { id: 'laila', name: 'Laila', department: 'marketing', role: 'Brand Manager', color: '#C084FC', status: 'active' },
  henry: { id: 'henry', name: 'Henry', department: 'compliance', role: 'Compliance Officer', color: '#059669', status: 'active' },
  vera: { id: 'vera', name: 'Vera', department: 'compliance', role: 'KYC Specialist', color: '#22C55E', status: 'active' },
  aurora: { id: 'aurora', name: 'Aurora', department: 'technology', role: 'CTO Intelligence', color: '#6366F1', status: 'active' },
  atlas: { id: 'atlas', name: 'Atlas', department: 'technology', role: 'API Monitor', color: '#818CF8', status: 'active' },
  sage: { id: 'sage', name: 'Sage', department: 'intelligence', role: 'Market Analyst', color: '#0EA5E9', status: 'active' },
  olivia: { id: 'olivia', name: 'Olivia', department: 'intelligence', role: 'Research Lead', color: '#4FACFE', status: 'active' },
  sophia: { id: 'sophia', name: 'Sophia', department: 'legal', role: 'Contract Manager', color: '#64748B', status: 'active' },
  ivy: { id: 'ivy', name: 'Ivy', department: 'legal', role: 'Ejari Specialist', color: '#94A3B8', status: 'active' },
  max: { id: 'max', name: 'Max', department: 'legal', role: 'Document Processor', color: '#475569', status: 'active' }
};

export const MAIN_NAVIGATION = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    workspace: 'executive',
    roles: ['owner', 'agent'],
    children: []
  },
  {
    id: 'leads',
    label: 'Leads',
    icon: Users,
    path: '/dashboard/leads',
    workspace: 'leads',
    roles: ['owner', 'agent'],
    assistants: ['clara', 'hunter'],
    children: [
      { id: 'all-leads', label: 'All Leads', path: '/dashboard/leads' },
      { id: 'pipeline', label: 'Pipeline', path: '/dashboard/leads/pipeline' },
      { id: 'sources', label: 'Sources', path: '/dashboard/leads/sources' }
    ]
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    path: '/dashboard/properties',
    workspace: 'properties',
    roles: ['owner', 'agent', 'seller'],
    assistants: ['mary', 'daisy', 'olivia'],
    children: [
      { id: 'inventory', label: 'Inventory', path: '/dashboard/properties/inventory' },
      { id: 'featured', label: 'Featured', path: '/dashboard/properties/featured' },
      { id: 'areas', label: 'Areas', path: '/dashboard/properties/areas' }
    ]
  },
  {
    id: 'agents',
    label: 'Agents',
    icon: UserCog,
    path: '/dashboard/agents',
    workspace: 'agents',
    roles: ['owner'],
    assistants: ['nancy'],
    children: [
      { id: 'team', label: 'Team', path: '/dashboard/agents/team' },
      { id: 'performance', label: 'Performance', path: '/dashboard/agents/performance' },
      { id: 'assignments', label: 'Assignments', path: '/dashboard/agents/assignments' }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    path: '/dashboard/finance',
    workspace: 'finance',
    roles: ['owner'],
    assistants: ['theodora', 'penny', 'quinn'],
    children: [
      { id: 'overview', label: 'Overview', path: '/dashboard/finance' },
      { id: 'commissions', label: 'Commissions', path: '/dashboard/finance/commissions' },
      { id: 'payments', label: 'Payments', path: '/dashboard/finance/payments' }
    ]
  },
  {
    id: 'ai-command',
    label: 'AI Command',
    icon: Bot,
    path: '/dashboard/ai',
    workspace: 'ai-command',
    roles: ['owner'],
    children: []
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/dashboard/analytics',
    workspace: 'analytics',
    roles: ['owner'],
    assistants: ['sage'],
    children: []
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/dashboard/settings',
    workspace: 'settings',
    roles: ['owner'],
    children: []
  }
];

export const PUBLIC_NAVIGATION = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'properties', label: 'Properties', icon: Building2, path: '/properties' },
  { id: 'search', label: 'Search', icon: Search, path: '/search' },
  { id: 'favorites', label: 'Favorites', icon: Heart, path: '/favorites' }
];

export const getNavigationByRole = (role) => {
  return MAIN_NAVIGATION.filter(item => item.roles.includes(role));
};

export const getAssistantsByDepartment = (departmentId) => {
  return Object.values(AI_ASSISTANTS).filter(a => a.department === departmentId);
};

export const getDepartmentById = (departmentId) => {
  return DEPARTMENTS[departmentId] || null;
};

export const getAssistantById = (assistantId) => {
  return AI_ASSISTANTS[assistantId] || null;
};

export default {
  DEPARTMENTS,
  AI_ASSISTANTS,
  MAIN_NAVIGATION,
  PUBLIC_NAVIGATION,
  getNavigationByRole,
  getAssistantsByDepartment,
  getDepartmentById,
  getAssistantById
};
