// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/SidebarActivityBar.tsx
/**
 * White Caves Real Estate LLC - Executive VSCode Sidebar Activity Bar
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC } from 'react';
import {
  FileText,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Users,
  Bot,
  CheckSquare,
  Trophy,
  Home,
  Handshake,
  Network,
  Contact,
  UserCircle,
  Settings,
} from 'lucide-react';
import { ActivityBar, ActivityGroup, ActivityIconBtn } from './ExecutiveVSCodeSidebar.styles';
import type { ActivityTab } from './ExecutiveVSCodeSidebar.logic';
import type { UserRole } from '../../../context/UserRoleContext';

export interface SidebarActivityBarProps {
  activeTab: ActivityTab;
  onSelectTab: (tab: ActivityTab) => void;
  role: UserRole;
  isDirectorate: boolean;
}

export const SidebarActivityBar: FC<SidebarActivityBarProps> = ({
  activeTab,
  onSelectTab,
  role,
  isDirectorate,
}) => {
  return (
    <ActivityBar>
      <ActivityGroup>
        {isDirectorate ? (
          <>
            <ActivityIconBtn
              $isActive={activeTab === 'departments'}
              onClick={() => onSelectTab('departments')}
              title="Corporate Departments Hub (12 Slots / 7 Pillars)"
              data-testid="activity-btn-departments"
            >
              <Building2 size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'employees'}
              onClick={() => onSelectTab('employees')}
              title="Employees Directory & Personnel Management"
              data-testid="activity-btn-employees"
            >
              <Users size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'aiams' || activeTab === 'ai-command'}
              onClick={() => onSelectTab('aiams')}
              title="AI Assistants Management System (AIAMS — 121+ Agents CRUD)"
              data-testid="activity-btn-aiams"
            >
              <Bot size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'tasks'}
              onClick={() => onSelectTab('tasks')}
              title="200+ Core Operational & Statutory Tasks Catalog"
              data-testid="activity-btn-tasks"
            >
              <CheckSquare size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'REproperties'}
              onClick={() => onSelectTab('REproperties')}
              title="Real Estate Inventory & Portfolio (REproperties)"
              data-testid="activity-btn-reproperties"
            >
              <Home size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'deals'}
              onClick={() => onSelectTab('deals')}
              title="Deals & Revenue Pipeline (deals)"
              data-testid="activity-btn-deals"
            >
              <Handshake size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'customers'}
              onClick={() => onSelectTab('customers')}
              title="Customers & CRM Nervous Hub (customers)"
              data-testid="activity-btn-customers"
            >
              <Contact size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'documents'}
              onClick={() => onSelectTab('documents')}
              title="Sovereign Document Vault (documents)"
              data-testid="activity-btn-documents"
            >
              <FileText size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'leaderboard'}
              onClick={() => onSelectTab('leaderboard')}
              title="Corporate Merit Leaderboard & Tier Progression (L0–L5)"
              data-testid="activity-btn-leaderboard"
            >
              <Trophy size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'relationships' || activeTab === 'erms'}
              onClick={() => onSelectTab('relationships')}
              title="ERMS: Entities & Relational Matrix Hub"
              data-testid="activity-btn-relationships"
            >
              <Network size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'roles'}
              onClick={() => onSelectTab('roles')}
              title="User Role Management System & RBAC (roles)"
              data-testid="activity-btn-roles"
            >
              <ShieldAlert size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'audit'}
              onClick={() => onSelectTab('audit')}
              title="RERA Compliance & Master Audit"
            >
              <ShieldCheck size={18} />
            </ActivityIconBtn>
          </>
        ) : role === 'landlord' ? (
          <>
            <ActivityIconBtn
              $isActive={activeTab === 'departments' || activeTab === 'landlord'}
              onClick={() => onSelectTab('landlord')}
              title="Sovereign Landlord Asset Hub"
              data-testid="activity-btn-landlord"
            >
              <Building2 size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'documents'}
              onClick={() => onSelectTab('documents')}
              title="Lease Contracts & Vault"
              data-testid="activity-btn-documents"
            >
              <FileText size={18} />
            </ActivityIconBtn>
          </>
        ) : role === 'tenant' ? (
          <>
            <ActivityIconBtn
              $isActive={activeTab === 'departments' || activeTab === 'tenant'}
              onClick={() => onSelectTab('tenant')}
              title="Sovereign Tenant Portal"
              data-testid="activity-btn-tenant"
            >
              <Home size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'documents'}
              onClick={() => onSelectTab('documents')}
              title="My Leases & Ejari"
              data-testid="activity-btn-documents"
            >
              <FileText size={18} />
            </ActivityIconBtn>
          </>
        ) : role === 'agent' ? (
          <>
            <ActivityIconBtn
              $isActive={activeTab === 'departments' || activeTab === 'broker'}
              onClick={() => onSelectTab('broker')}
              title="Sovereign Licensed Broker Hub"
              data-testid="activity-btn-broker"
            >
              <Building2 size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'REproperties'}
              onClick={() => onSelectTab('REproperties')}
              title="Real Estate Inventory"
              data-testid="activity-btn-reproperties"
            >
              <Home size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'deals'}
              onClick={() => onSelectTab('deals')}
              title="Deals Pipeline"
              data-testid="activity-btn-deals"
            >
              <Handshake size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'customers'}
              onClick={() => onSelectTab('customers')}
              title="CRM Leads"
              data-testid="activity-btn-customers"
            >
              <Contact size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'documents'}
              onClick={() => onSelectTab('documents')}
              title="Document Vault"
              data-testid="activity-btn-documents"
            >
              <FileText size={18} />
            </ActivityIconBtn>
          </>
        ) : (
          <>
            <ActivityIconBtn
              $isActive={activeTab === 'departments'}
              onClick={() => onSelectTab('departments')}
              title="Sovereign Identity Gateway"
              data-testid="activity-btn-departments"
            >
              <ShieldCheck size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'landlord'}
              onClick={() => onSelectTab('landlord')}
              title="Landlord Asset Hub"
              data-testid="activity-btn-landlord"
            >
              <Building2 size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'tenant'}
              onClick={() => onSelectTab('tenant')}
              title="Tenant Self-Service"
              data-testid="activity-btn-tenant"
            >
              <Home size={18} />
            </ActivityIconBtn>

            <ActivityIconBtn
              $isActive={activeTab === 'broker'}
              onClick={() => onSelectTab('broker')}
              title="Licensed Broker Hub"
              data-testid="activity-btn-broker"
            >
              <Handshake size={18} />
            </ActivityIconBtn>
          </>
        )}
      </ActivityGroup>

      <ActivityGroup>
        <ActivityIconBtn
          $isActive={activeTab === 'profile'}
          onClick={() => onSelectTab('profile')}
          title="Sovereign Executive Profile & Preferences"
          data-testid="activity-btn-profile"
        >
          <UserCircle size={18} />
        </ActivityIconBtn>

        <ActivityIconBtn
          $isActive={activeTab === 'settings'}
          onClick={() => onSelectTab('settings')}
          title="Sovereign Settings"
        >
          <Settings size={18} />
        </ActivityIconBtn>
      </ActivityGroup>
    </ActivityBar>
  );
};
