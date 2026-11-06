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
  CheckSquare,
  Trophy,
  Home,
  Handshake,
  FileText,
  Network,
  Contact,
  ShieldAlert,
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
  profile: {
    icon: React.createElement(UserCircle, { size: 14, color: '#A855F7' }),
    label: 'Sovereign Executive Profile',
  },
};

export const SEARCH_PLACEHOLDER_MAP: Record<string, string> = {
  departments: 'Filter 12 slots & depts...',
  employees: 'Filter employees & roles...',
  tasks: 'Filter 200 tasks & SLAs...',
  leaderboard: 'Filter leaderboard & tiers...',
  REproperties: 'Filter properties & units...',
  deals: 'Filter deals & pipelines...',
  documents: 'Filter vault documents...',
  relationships: 'Filter entities & relational matrix...',
  erms: 'Filter entities & relational matrix...',
  customers: 'Filter clients & leads...',
  roles: 'Filter 14 sovereign roles & tiers...',
  profile: 'Filter profile preferences...',
};
