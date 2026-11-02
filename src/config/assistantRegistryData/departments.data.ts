import type { Department, DepartmentId } from './types';

export const DEPARTMENTS: Record<DepartmentId, Department> = {
  communications: {
    id: 'communications',
    label: 'Communications',
    color: '#25D366',
    gradient: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
    icon: 'MessageSquare',
  },
  operations: {
    id: 'operations',
    label: 'Operations',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'Building2',
  },
  sales: {
    id: 'sales',
    label: 'Sales',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
    icon: 'TrendingUp',
  },
  finance: {
    id: 'finance',
    label: 'Finance',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: 'Wallet',
  },
  marketing: {
    id: 'marketing',
    label: 'Marketing',
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'Megaphone',
  },
  executive: {
    id: 'executive',
    label: 'Executive',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: 'Briefcase',
  },
  compliance: {
    id: 'compliance',
    label: 'Compliance',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #8b5cf6 100%)',
    icon: 'Shield',
  },
  technology: {
    id: 'technology',
    label: 'Technology',
    color: '#0EA5E9',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
    icon: 'Server',
  },
  legal: {
    id: 'legal',
    label: 'Legal',
    color: '#C9A84C',
    gradient: 'linear-gradient(135deg, #C9A84C 0%, #a8883a 100%)',
    icon: 'Scale',
  },
  intelligence: {
    id: 'intelligence',
    label: 'Intelligence',
    color: '#0D9488',
    gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    icon: 'Brain',
  },
  customer_experience: {
    id: 'customer_experience',
    label: 'Customer Experience',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    icon: 'Heart',
  },
  data_and_ai: {
    id: 'data_and_ai',
    label: 'Data & AI',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    icon: 'Cpu',
  },
};

// ---------------------------------------------------------------------------
// AI Assistants Registry
// ---------------------------------------------------------------------------
