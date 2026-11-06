// FILE: src/components/dashboard/ExecutiveVSCodeSidebar/SidebarRolesList.tsx
/**
 * White Caves Real Estate LLC - Sidebar Roles & RBAC Drawer Component
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Shield, ShieldAlert, Key, Users, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  UserRoleContext,
  UserRole,
  ALL_SOVEREIGN_ROLES,
  ROLE_LABELS,
  ROLE_DEFAULT_LEVELS,
} from '../../../context/UserRoleContext';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 8px 12px;
  gap: 12px;
`;

const ActiveSimulatorCard = styled.div`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SimulatorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: #ef4444;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .badge {
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const SimulatorInfo = styled.div`
  font-size: 12px;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 6px;

  strong {
    color: #fff;
  }
`;

const QuickSwitcherGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  margin-top: 4px;
`;

const SwitchButton = styled.button<{ $isActive: boolean }>`
  background: ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.06)')};
  color: ${props => (props.$isActive ? '#ffffff' : '#cbd5e1')};
  border: 1px solid ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.12)')};
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.$isActive ? '#dc2626' : 'rgba(255, 255, 255, 0.12)')};
    color: #ffffff;
  }
`;

const TierSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TierTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.04em;
  padding: 4px 6px 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RoleCard = styled.div<{ $isActive: boolean }>`
  background: ${props =>
    props.$isActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)'};
  border: 1px solid ${props => (props.$isActive ? '#ef4444' : 'rgba(255, 255, 255, 0.08)')};
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.4);
    transform: translateX(2px);
  }

  .role-left {
    display: flex;
    align-items: center;
    gap: 8px;

    .icon-box {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${props => (props.$isActive ? '#ef4444' : '#94a3b8')};
    }

    .role-name {
      font-size: 12px;
      font-weight: 600;
      color: ${props => (props.$isActive ? '#ffffff' : '#e2e8f0')};
    }
  }

  .level-badge {
    font-size: 10px;
    font-weight: 700;
    color: ${props => (props.$isActive ? '#ef4444' : '#94a3b8')};
    background: rgba(255, 255, 255, 0.06);
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

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
          <span>Tier 1: Internal Corporate (1-12-108)</span>
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

      {/* ── Tier 2: Client Portal Channels ────────────────────── */}
      <TierSection>
        <TierTitle>
          <span>Tier 2: Client Portal Channels</span>
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
