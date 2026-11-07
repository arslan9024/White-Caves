// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/ExecutiveVSCodeSidebar.data.ts
/**
 * White Caves Real Estate LLC - Executive VSCode Sidebar Static Dictionaries
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React from 'react';
import {
  Building2,
  Users,
  Bot,
  CheckSquare,
  Trophy,
  Home,
  Handshake,
  FileText,
  Network,
  Contact,
  ShieldAlert,
  ShieldCheck,
  BarChart3,
  Coins,
  Eye,
  Activity,
  UserCircle,
} from 'lucide-react';

export const TAB_HEADER_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  departments: {
    icon: React.createElement(Building2, { size: 14, color: '#EF4444' }),
    label: 'Departments Hub (12 Slots)',
  },
  employees: {
    icon: React.createElement(Users, { size: 14, color: '#3B82F6' }),
    label: 'Employees Hub (Roster)',
  },
  aiams: {
    icon: React.createElement(Bot, { size: 14, color: '#EF4444' }),
    label: 'AI Assistants Hub (AIAMS)',
  },
  'ai-command': {
    icon: React.createElement(Bot, { size: 14, color: '#EF4444' }),
    label: 'AI Assistants Hub (AIAMS)',
  },
  tasks: {
    icon: React.createElement(CheckSquare, { size: 14, color: '#10B981' }),
    label: '200+ Tasks Catalog',
  },
  leaderboard: {
    icon: React.createElement(Trophy, { size: 14, color: '#F59E0B' }),
    label: 'Merit Leaderboard & Tiers',
  },
  REproperties: {
    icon: React.createElement(Home, { size: 14, color: '#8B5CF6' }),
    label: 'RE Properties Inventory',
  },
  deals: {
    icon: React.createElement(Handshake, { size: 14, color: '#C084FC' }),
    label: 'Deals & Pipeline',
  },
  documents: {
    icon: React.createElement(FileText, { size: 14, color: '#38BDF8' }),
    label: 'Document Vault',
  },
  relationships: {
    icon: React.createElement(Network, { size: 14, color: '#10B981' }),
    label: 'ERMS (Entities & Relationships)',
  },
  erms: {
    icon: React.createElement(Network, { size: 14, color: '#10B981' }),
    label: 'ERMS (Entities & Relationships)',
  },
  customers: {
    icon: React.createElement(Contact, { size: 14, color: '#34D399' }),
    label: 'Customers Hub (CRM)',
  },
  roles: {
    icon: React.createElement(ShieldAlert, { size: 14, color: '#F43F5E' }),
    label: 'User Roles & RBAC Hub (14 Roles)',
  },
  landlord: {
    icon: React.createElement(Building2, { size: 14, color: '#EF4444' }),
    label: 'Sovereign Landlord Asset Hub',
  },
  tenant: {
    icon: React.createElement(Building2, { size: 14, color: '#10B981' }),
    label: 'Sovereign Tenant Portal',
  },
  broker: {
    icon: React.createElement(Building2, { size: 14, color: '#3B82F6' }),
    label: 'Sovereign Licensed Broker Hub',
  },
  profile: {
    icon: React.createElement(UserCircle, { size: 14, color: '#A855F7' }),
    label: 'Sovereign Executive Profile',
  },
  audit: {
    icon: React.createElement(ShieldCheck, { size: 14, color: '#10B981' }),
    label: 'RERA Compliance & Audit Vault',
  },
  governance: {
    icon: React.createElement(ShieldCheck, { size: 14, color: '#6366F1' }),
    label: 'Governance & Credentials Pipeline',
  },
  commissions: {
    icon: React.createElement(Coins, { size: 14, color: '#F59E0B' }),
    label: 'Commission Tracking & Splits',
  },
  performance: {
    icon: React.createElement(Activity, { size: 14, color: '#EC4899' }),
    label: 'Agent Performance & Rankings',
  },
  viewings: {
    icon: React.createElement(Eye, { size: 14, color: '#06B6D4' }),
    label: 'Property Viewings & Appointments',
  },
  analytics: {
    icon: React.createElement(BarChart3, { size: 14, color: '#8B5CF6' }),
    label: 'Unified Market Analytics Dashboard',
  },
  module: {
    icon: React.createElement(Activity, { size: 14, color: '#EF4444' }),
    label: 'Enterprise CRM Module Viewport',
  },
};

export const SEARCH_PLACEHOLDER_MAP: Record<string, string> = {
  departments: 'Filter 12 slots & depts...',
  employees: 'Filter employees & roles...',
  aiams: 'Filter 121+ AI agents, models & roles...',
  'ai-command': 'Filter 121+ AI agents, models & roles...',
  tasks: 'Filter 200 tasks & SLAs...',
  leaderboard: 'Filter leaderboard & tiers...',
  REproperties: 'Filter properties & units...',
  deals: 'Filter deals & pipelines...',
  documents: 'Filter vault documents...',
  relationships: 'Filter entities & relational matrix...',
  erms: 'Filter entities & relational matrix...',
  customers: 'Filter clients & leads...',
  roles: 'Filter 14 sovereign roles & tiers...',
  landlord: 'Filter properties & tenancies...',
  tenant: 'Filter lease & inspections...',
  broker: 'Filter commission splits & leads...',
  profile: 'Filter profile preferences...',
  audit: 'Filter compliance & audit logs...',
  governance: 'Filter licenses & credentials...',
  commissions: 'Filter commission ledger & payouts...',
  performance: 'Filter agent KPIs & rankings...',
  viewings: 'Filter viewing appointments...',
  analytics: 'Filter analytics metrics & reports...',
  module: 'Filter module parameters...',
};
