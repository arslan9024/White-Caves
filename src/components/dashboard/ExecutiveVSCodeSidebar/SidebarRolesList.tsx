// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/SidebarRolesList.tsx
/**
 * White Caves Real Estate LLC - Sidebar Roles & RBAC Drawer Component
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { Shield, ShieldAlert, Key, Users, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  UserRoleContext,
  UserRole,
  ROLE_LABELS,
  ROLE_DEFAULT_LEVELS,
} from '../../../context/UserRoleContext';
import {
  ListContainer,
  ActiveSimulatorCard,
  SimulatorHeader,
  SimulatorInfo,
  QuickSwitcherGrid,
  SwitchButton,
  TierSection,
  TierTitle,
  RoleCard,
} from './SidebarRolesList.styles';

export interface SidebarRolesListProps {
  filterQuery?: string;
  onSelectRole?: (roleId: string, roleName: string) => void;
  onNavigateToView?: (route: string) => void;
}

export const SidebarRolesList: FC<SidebarRolesListProps> = ({
  filterQuery = '',
  onSelectRole,
  onNavigateToView,
}) => {
  const context = React.useContext(UserRoleContext);
  const currentRole = context?.role || 'managing_director';
  const currentLevel = context?.accessLevel || 5;
  const switchRole = context?.switchRole || (() => {});

  const handleRoleClick = (roleId: UserRole) => {
    const label = ROLE_LABELS[roleId] || roleId;
    if (onSelectRole) onSelectRole(roleId, label);
    if (onNavigateToView) onNavigateToView(`/dashboard/roles/${roleId}`);
  };

  const handleQuickSwitch = (e: React.MouseEvent, targetRole: UserRole) => {
    e.stopPropagation();
    switchRole(targetRole);
    if (onSelectRole) onSelectRole(targetRole, ROLE_LABELS[targetRole]);
    if (onNavigateToView) {
      if (targetRole === 'landlord') {
        onNavigateToView('/dashboard/landlord');
      } else if (targetRole === 'tenant') {
        onNavigateToView('/dashboard/tenant');
      } else if (targetRole === 'agent') {
        onNavigateToView('/dashboard/broker');
      } else {
        onNavigateToView('/dashboard/roles');
      }
    }
  };

  const q = filterQuery.toLowerCase().trim();

  const tier1Roles: UserRole[] = ['managing_director', 'manager', 'supervisor', 'agent', 'intern'];
  const tier2Roles: UserRole[] = [
    'landlord',
    'tenant',
    'buyer',
    'seller',
    'offplan_buyer',
    'developer',
  ];
  const tier3Roles: UserRole[] = ['conveyancer', 'contractor', 'guest'];

  const filterMatches = (roleId: UserRole) => {
    if (!q) return true;
    const name = ROLE_LABELS[roleId]?.toLowerCase() || '';
    const level = `l${ROLE_DEFAULT_LEVELS[roleId]}`;
    return roleId.toLowerCase().includes(q) || name.includes(q) || level.includes(q);
  };

  return (
    <ListContainer data-testid="sidebar-roles-list">
      {/* ── Active Role Simulator Deck ────────────────────────── */}
      <ActiveSimulatorCard>
        <SimulatorHeader>
          <div className="title">
            <RefreshCw size={12} />
            <span>Role Simulator</span>
          </div>
          <span className="badge">Active: L{currentLevel}</span>
        </SimulatorHeader>
        <SimulatorInfo>
          <span>Clearance:</span>
          <strong>{ROLE_LABELS[currentRole]}</strong>
        </SimulatorInfo>
        <QuickSwitcherGrid>
          <SwitchButton
            $isActive={currentRole === 'managing_director'}
            onClick={e => handleQuickSwitch(e, 'managing_director')}
            title="Simulate as Managing Director (Level 5)"
          >
            <Shield size={12} /> MD (L5)
          </SwitchButton>
          <SwitchButton
            $isActive={currentRole === 'landlord'}
            onClick={e => handleQuickSwitch(e, 'landlord')}
            title="Simulate as Landlord Client (Level 2)"
          >
            <Users size={12} /> Landlord (L2)
          </SwitchButton>
          <SwitchButton
            $isActive={currentRole === 'agent'}
            onClick={e => handleQuickSwitch(e, 'agent')}
            title="Simulate as Licensed Broker (Level 2)"
          >
            <Key size={12} /> Broker (L2)
          </SwitchButton>
          <SwitchButton
            $isActive={currentRole === 'tenant'}
            onClick={e => handleQuickSwitch(e, 'tenant')}
            title="Simulate as Tenant Client (Level 1)"
          >
            <Users size={12} /> Tenant (L1)
          </SwitchButton>
        </QuickSwitcherGrid>
      </ActiveSimulatorCard>

      {/* ── Tier 1: Internal Corporate Machinery ──────────────── */}
      <TierSection>
        <TierTitle>
          <span>Tier 1: Internal Corporate</span>
          <span>5 Roles</span>
        </TierTitle>
        {tier1Roles.filter(filterMatches).map(roleId => (
          <RoleCard
            key={roleId}
            $isActive={currentRole === roleId}
            onClick={() => handleRoleClick(roleId)}
            data-testid={`role-card-${roleId}`}
          >
            <div className="role-left">
              <div className="icon-box">
                {currentRole === roleId ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
              </div>
              <span className="role-name">{ROLE_LABELS[roleId]}</span>
            </div>
            <span className="level-badge">L{ROLE_DEFAULT_LEVELS[roleId]}</span>
          </RoleCard>
        ))}
      </TierSection>

      {/* ── Tier 2: Client Portals ────────────────────────────── */}
      <TierSection>
        <TierTitle>
          <span>Tier 2: Client Portals</span>
          <span>6 Roles</span>
        </TierTitle>
        {tier2Roles.filter(filterMatches).map(roleId => (
          <RoleCard
            key={roleId}
            $isActive={currentRole === roleId}
            onClick={() => handleRoleClick(roleId)}
            data-testid={`role-card-${roleId}`}
          >
            <div className="role-left">
              <div className="icon-box">
                {currentRole === roleId ? <CheckCircle2 size={14} /> : <Users size={14} />}
              </div>
              <span className="role-name">{ROLE_LABELS[roleId]}</span>
            </div>
            <span className="level-badge">L{ROLE_DEFAULT_LEVELS[roleId]}</span>
          </RoleCard>
        ))}
      </TierSection>

      {/* ── Tier 3: Strategic Partners & Public ────────────────── */}
      <TierSection>
        <TierTitle>
          <span>Tier 3: Strategic Partners & Public</span>
          <span>3 Roles</span>
        </TierTitle>
        {tier3Roles.filter(filterMatches).map(roleId => (
          <RoleCard
            key={roleId}
            $isActive={currentRole === roleId}
            onClick={() => handleRoleClick(roleId)}
            data-testid={`role-card-${roleId}`}
          >
            <div className="role-left">
              <div className="icon-box">
                {currentRole === roleId ? <CheckCircle2 size={14} /> : <Key size={14} />}
              </div>
              <span className="role-name">{ROLE_LABELS[roleId]}</span>
            </div>
            <span className="level-badge">L{ROLE_DEFAULT_LEVELS[roleId]}</span>
          </RoleCard>
        ))}
      </TierSection>
    </ListContainer>
  );
};

export default SidebarRolesList;
