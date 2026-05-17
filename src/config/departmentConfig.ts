/**
 * departmentConfig — Single source of truth for CRM sidebar departments.
 *
 * Previously duplicated across:
 *   - SidebarContainer/SidebarContainer.tsx
 *   - EnhancedLeftSidebar/EnhancedLeftSidebar.tsx
 *   - MobileMenuDrawer/MobileMenuDrawer.tsx
 *
 * Canonical values are taken from the majority (2-of-3) where they differed.
 */

import {
  Building2,
  DollarSign,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Globe,
  Lock,
  Code,
  Scale,
  KeySquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { colors } from '../styles/theme/colors';

export interface DepartmentDef {
  icon: LucideIcon;
  label: string;
  color: string;
  services: string[];
  /** Redux selector key for badge count — resolved at render time */
  badgeKey?: 'hotLeads' | 'properties' | 'messages';
}

/**
 * Canonical sidebar navigation departments for White Caves CRM.
 *
 * Import as:
 *   import { SIDEBAR_DEPARTMENTS as DEPARTMENTS } from '../../../config/departmentConfig';
 */
export const SIDEBAR_DEPARTMENTS: Record<string, DepartmentDef> = {
  operations: {
    icon: Building2,
    label: 'Operations',
    color: '#3B82F6',
    services: ['Inventory Management', 'Properties', 'Asset Tracking', 'Data Management'],
    badgeKey: 'properties',
  },
  finance: {
    icon: DollarSign,
    label: 'Finance',
    color: '#F59E0B',
    services: ['Invoicing', 'Payment Tracking', 'Financial Reports', 'Budget Analysis'],
  },
  sales: {
    icon: TrendingUp,
    label: 'Sales',
    color: '#10B981',
    services: ['Lead Management', 'Negotiations', 'Deal Tracking', 'Pipeline'],
    badgeKey: 'hotLeads',
  },
  marketing: {
    icon: Megaphone,
    label: 'Marketing',
    color: '#EC4899',
    services: ['Campaigns', 'Content', 'Analytics', 'Lead Generation'],
  },
  communications: {
    icon: MessageSquare,
    label: 'Communications',
    color: '#8B5CF6',
    services: ['Messages', 'Emails', 'Templates', 'Notifications'],
    badgeKey: 'messages',
  },
  executive: {
    icon: Globe,
    label: 'Executive',
    color: colors.primary,
    services: ['Strategic Overview', 'KPIs', 'Reports', 'Insights'],
  },
  compliance: {
    icon: Lock,
    label: 'Compliance',
    color: '#059669',
    services: ['Regulations', 'Audits', 'Policies', 'Documentation'],
  },
  technology: {
    icon: Code,
    label: 'Technology',
    color: '#06B6D4',
    services: ['Systems', 'Integration', 'Support', 'Development'],
  },
  legal: {
    icon: Scale,
    label: 'Legal',
    color: '#7C3AED',
    services: ['Contracts', 'Agreements', 'Compliance', 'Documentation'],
  },
  leasing: {
    icon: KeySquare,
    label: 'Leasing',
    color: '#E31E24',
    services: [
      'Leasing Pipeline',
      'Active Leases',
      'Viewing Calendar',
      'Offer Management',
      'Contract Center',
      'PDC Tracker',
      'Leasing P&L Report',
    ],
  },
};
