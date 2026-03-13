/**
 * Company Features Tree - Left Sidebar Navigation Structure
 * Organized by department/function with nested items
 */

import {
  Target,
  Users,
  TrendingUp,
  Building2,
  Wallet,
  BarChart3,
  Phone,
  Clock,
  Settings,
  Star,
  DollarSign,
  Briefcase,
  AlertCircle
} from 'lucide-react';

export const COMPANY_FEATURES = [
  {
    id: 'crm',
    label: '🎯 CRM',
    icon: Target,
    color: '#FF6B6B',
    description: 'Lead & Client Management',
    items: [
      {
        id: 'overview',
        label: 'Dashboard',
        icon: BarChart3,
        description: 'Key metrics & overview'
      },
      {
        id: 'leads',
        label: 'Hot Leads',
        icon: TrendingUp,
        description: 'Active leads ready for contact',
        badge: 'NEW'
      },
      {
        id: 'clients',
        label: 'Active Clients',
        icon: Users,
        description: 'Existing clients & accounts'
      },
      {
        id: 'agents',
        label: 'Sales Team',
        icon: Users,
        description: 'Agent performance & assignments'
      }
    ]
  },
  {
    id: 'operations',
    label: '🏢 Operations',
    icon: Building2,
    color: '#4ECDC4',
    description: 'Property & Inventory Management',
    items: [
      {
        id: 'properties',
        label: 'Properties',
        icon: Building2,
        description: 'Real estate listings & details'
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: BarChart3,
        description: 'Stock & asset management'
      },
      {
        id: 'schedule',
        label: 'Schedule',
        icon: Clock,
        description: 'Viewings & appointments'
      }
    ]
  },
  {
    id: 'finance',
    label: '💰 Finance',
    icon: Wallet,
    color: '#FFD93D',
    description: 'Commission & Financial Tracking',
    items: [
      {
        id: 'commissions',
        label: 'Commissions',
        icon: Wallet,
        description: 'Agent commission tracking'
      },
      {
        id: 'payments',
        label: 'Payments',
        icon: DollarSign,
        description: 'Payment processing & history'
      },
      {
        id: 'revenue',
        label: 'Revenue',
        icon: TrendingUp,
        description: 'Income & financial reports'
      }
    ]
  },
  {
    id: 'analytics',
    label: '📊 Analytics',
    icon: BarChart3,
    color: '#6BCB77',
    description: 'Performance & Business Intelligence',
    items: [
      {
        id: 'performance',
        label: 'Performance',
        icon: TrendingUp,
        description: 'KPIs & metrics dashboard'
      },
      {
        id: 'insights',
        label: 'Insights',
        icon: Star,
        description: 'AI-powered business insights'
      },
      {
        id: 'trends',
        label: 'Trends',
        icon: BarChart3,
        description: 'Market & sales trends'
      }
    ]
  }
];

/**
 * Get feature by ID for quick lookup
 */
export const getFeatureById = (id: string) => {
  for (const category of COMPANY_FEATURES) {
    if (category.id === id) return category;
    for (const item of category.items) {
      if (item.id === id) return item;
    }
  }
  return null;
};

/**
 * Get all feature IDs (flattened)
 */
export const getAllFeatureIds = (): string[] => {
  const ids = [];
  for (const category of COMPANY_FEATURES) {
    ids.push(category.id);
    for (const item of category.items) {
      ids.push(item.id);
    }
  }
  return ids;
};
