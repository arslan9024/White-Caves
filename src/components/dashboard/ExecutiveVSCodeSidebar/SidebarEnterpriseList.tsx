// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/SidebarEnterpriseList.tsx
/**
 * White Caves Real Estate LLC - Sidebar Enterprise Modules & Sub-navigation Drawer
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import {
  ShieldCheck,
  Coins,
  Activity,
  Eye,
  BarChart3,
  Layers,
  FileCheck,
  Building,
  TrendingUp,
} from 'lucide-react';
import { TreeScrollArea, TreeLeafItem, FolderHeaderBtn, FolderNode } from './ExecutiveVSCodeSidebar.styles';
import type { ActivityTab } from './ExecutiveVSCodeSidebar.logic';

export interface SidebarEnterpriseListProps {
  activeTab: ActivityTab;
  filterQuery?: string;
  onNavigateToView?: (route: string) => void;
}

interface EnterpriseNavEntry {
  id: string;
  label: string;
  route: string;
  badge?: string;
  icon: React.ReactNode;
}

export const SidebarEnterpriseList: FC<SidebarEnterpriseListProps> = ({
  activeTab,
  filterQuery = '',
  onNavigateToView,
}) => {
  const getNavEntries = (): EnterpriseNavEntry[] => {
    switch (activeTab) {
      case 'audit':
        return [
          { id: 'audit-logs', label: 'Activity & Audit Log', route: '/dashboard/audit', badge: 'Live', icon: <ShieldCheck size={13} color="#10B981" /> },
          { id: 'audit-rera', label: 'RERA Compliance Ledger', route: '/dashboard/audit?type=rera', badge: 'DLD', icon: <FileCheck size={13} color="#3B82F6" /> },
          { id: 'audit-escrow', label: 'Escrow Trust Audits', route: '/dashboard/audit?type=escrow', badge: '100%', icon: <Building size={13} color="#F59E0B" /> },
        ];
      case 'governance':
        return [
          { id: 'gov-pipeline', label: 'License & Legal Pipeline', route: '/dashboard/governance', badge: 'L5', icon: <ShieldCheck size={13} color="#6366F1" /> },
          { id: 'gov-rera', label: 'RERA Brokerage Licenses', route: '/dashboard/governance?tab=rera', badge: 'Active', icon: <Building size={13} color="#10B981" /> },
          { id: 'gov-corporate', label: 'Trade Licenses & MoA', route: '/dashboard/governance?tab=corporate', badge: 'FTA', icon: <Layers size={13} color="#EF4444" /> },
        ];
      case 'commissions':
        return [
          { id: 'comm-ledger', label: 'Commission Ledger', route: '/dashboard/commissions', badge: 'Payouts', icon: <Coins size={13} color="#F59E0B" /> },
          { id: 'comm-splits', label: 'Broker Split Rules (60-70%)', route: '/dashboard/commissions?view=splits', badge: 'Rules', icon: <TrendingUp size={13} color="#10B981" /> },
          { id: 'comm-vat', label: '5% UAE VAT & Corporate Reserves', route: '/dashboard/commissions?view=vat', badge: 'FTA', icon: <Building size={13} color="#EF4444" /> },
        ];
      case 'performance':
        return [
          { id: 'perf-rankings', label: 'Agent Leaderboard & Rankings', route: '/dashboard/performance', badge: 'L0-L5', icon: <Activity size={13} color="#EC4899" /> },
          { id: 'perf-deals', label: 'Deals Closed & Conversion', route: '/dashboard/performance?sort=deals', badge: 'KPI', icon: <TrendingUp size={13} color="#10B981" /> },
          { id: 'perf-revenue', label: 'Revenue Generated Index', route: '/dashboard/performance?sort=revenue', badge: 'AED', icon: <Coins size={13} color="#3B82F6" /> },
        ];
      case 'viewings':
        return [
          { id: 'viewings-all', label: 'Property Viewings Schedule', route: '/dashboard/viewings', badge: 'Calendar', icon: <Eye size={13} color="#06B6D4" /> },
          { id: 'viewings-confirmed', label: 'Confirmed Viewings', route: '/dashboard/viewings?status=confirmed', badge: 'Active', icon: <ShieldCheck size={13} color="#10B981" /> },
          { id: 'viewings-upcoming', label: 'VIP Accompanied Tours', route: '/dashboard/viewings?status=vip', badge: 'Luxury', icon: <Building size={13} color="#F59E0B" /> },
        ];
      case 'analytics':
        return [
          { id: 'analytics-market', label: 'Dubai Real Estate Market Index', route: '/dashboard/analytics', badge: 'Unified', icon: <BarChart3 size={13} color="#8B5CF6" /> },
          { id: 'analytics-sales', label: 'Sales Pipeline & Kanban', route: '/dashboard/analytics?view=sales', badge: 'Live', icon: <TrendingUp size={13} color="#10B981" /> },
          { id: 'analytics-properties', label: 'Inventory Distribution & Yields', route: '/dashboard/analytics?view=properties', badge: 'Yields', icon: <Building size={13} color="#3B82F6" /> },
        ];
      default:
        return [
          { id: 'ent-overview', label: `${activeTab.toUpperCase()} Overview`, route: `/dashboard/${activeTab}`, icon: <Layers size={13} color="#EF4444" /> },
        ];
    }
  };

  const q = filterQuery.toLowerCase();
  const entries = getNavEntries().filter(e => !q || e.label.toLowerCase().includes(q) || (e.badge && e.badge.toLowerCase().includes(q)));

  return (
    <TreeScrollArea>
      <FolderNode>
        <FolderHeaderBtn $isExpanded={true} onClick={() => {}}>
          <span className="label" style={{ fontWeight: 800 }}>
            {activeTab.toUpperCase()} NAVIGATION
          </span>
          <span className="badge">{entries.length}</span>
        </FolderHeaderBtn>
        <div style={{ padding: '4px 0' }}>
          {entries.map(entry => (
            <TreeLeafItem
              key={entry.id}
              $isActive={false}
              onClick={() => onNavigateToView?.(entry.route)}
            >
              {entry.icon}
              <span style={{ flex: 1 }}>{entry.label}</span>
              {entry.badge && <span className="sla-pill">{entry.badge}</span>}
            </TreeLeafItem>
          ))}
        </div>
      </FolderNode>
    </TreeScrollArea>
  );
};

export default SidebarEnterpriseList;
