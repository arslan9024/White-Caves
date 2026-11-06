// FILE: src/components/crm/RoleManager/RoleManagerView.tsx
/**
 * White Caves Real Estate LLC - Role Manager Pure Presentational View (Tier 1)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Key,
  Search,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useRoleManager } from './RoleManager.logic';
import { RoleManagerFallback } from './RoleManager.fallback';
import {
  RoleManagerContainer,
  RoleHeader,
  RoleMetricsDeck,
  RoleMetricCard,
  RoleFilterBar,
  FilterPill,
  RolesGrid,
  RoleCard,
} from './RoleManager.styles';
import { ROLE_MANAGER_I18N } from './RoleManager.i18n';
import type { UserRole } from '../../../context/UserRoleContext';

export interface RoleManagerViewProps {
  selectedRoleId?: string;
  onNavigateBack?: () => void;
  onSelectRole?: (roleId: string) => void;
  language?: 'en' | 'ar' | 'es' | 'ru';
}

export const RoleManagerView: FC<RoleManagerViewProps> = ({
  selectedRoleId,
  onNavigateBack,
  onSelectRole,
  language = 'en',
}) => {
  const [error, setError] = useState<Error | null>(null);

  const {
    roles,
    totalCount,
    currentRole,
    currentAccessLevel,
    filterState,
    setFilterState,
    metrics,
    handleSimulateRole,
  } = useRoleManager(selectedRoleId);

  const t = ROLE_MANAGER_I18N[language] || ROLE_MANAGER_I18N.en;

  if (error) {
    return (
      <RoleManagerFallback
        error={error}
        onRetry={() => setError(null)}
        onNavigateBack={onNavigateBack}
      />
    );
  }

  const getLevelColor = (level: number) => {
    switch (level) {
      case 5:
        return '#ef4444'; // Red (MD / Admin)
      case 4:
        return '#f97316'; // Orange (Managers)
      case 3:
        return '#eab308'; // Amber (Supervisors)
      case 2:
        return '#3b82f6'; // Blue (Brokers / Landlords / Devs)
      default:
        return '#10b981'; // Green (Clients / Interns / Guests)
    }
  };

  const handleCardClick = (roleId: UserRole) => {
    if (onSelectRole) onSelectRole(roleId);
  };

  return (
    <RoleManagerContainer dir={t.dir} data-testid="role-manager-view">
      {/* ── 1. Sovereign Header ─────────────────────────────────── */}
      <RoleHeader>
        <div className="header-left">
          <h1>
            <ShieldAlert size={26} color="#ef4444" />
            <span>{t.workspaceTitle}</span>
          </h1>
          <p>{t.subtitle}</p>
        </div>
        <div className="header-actions">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              color: '#f87171',
              fontWeight: 700,
            }}
          >
            <RefreshCw size={14} />
            <span>
              Simulating: {currentRole.toUpperCase()} (L{currentAccessLevel})
            </span>
          </div>
        </div>
      </RoleHeader>

      {/* ── 2. Metric Deck ──────────────────────────────────────── */}
      <RoleMetricsDeck>
        <RoleMetricCard $accentColor="#ef4444">
          <div className="metric-info">
            <span className="label">{t.totalRoles}</span>
            <span className="value">{metrics.totalRoles}</span>
            <span className="subtext">14 Canonical Sovereign Roles</span>
          </div>
          <div className="metric-icon">
            <ShieldCheck size={24} />
          </div>
        </RoleMetricCard>

        <RoleMetricCard $accentColor="#3b82f6">
          <div className="metric-info">
            <span className="label">Tier 1: Internal</span>
            <span className="value">{metrics.tier1Count}</span>
            <span className="subtext">Corporate 1-12-108 Machinery</span>
          </div>
          <div className="metric-icon">
            <Key size={24} />
          </div>
        </RoleMetricCard>

        <RoleMetricCard $accentColor="#10b981">
          <div className="metric-info">
            <span className="label">Tier 2: Client Portals</span>
            <span className="value">{metrics.clientCount}</span>
            <span className="subtext">Landlords, Tenants, Buyers</span>
          </div>
          <div className="metric-icon">
            <Users size={24} />
          </div>
        </RoleMetricCard>

        <RoleMetricCard $accentColor="#f59e0b">
          <div className="metric-info">
            <span className="label">{t.totalAssigned}</span>
            <span className="value">{metrics.totalAssigned.toLocaleString()}</span>
            <span className="subtext">Active Users Across UAE</span>
          </div>
          <div className="metric-icon">
            <ShieldAlert size={24} />
          </div>
        </RoleMetricCard>
      </RoleMetricsDeck>

      {/* ── 3. Filter Bar ───────────────────────────────────────── */}
      <RoleFilterBar>
        <div className="search-input-wrap">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={filterState.searchQuery}
            onChange={e => setFilterState(prev => ({ ...prev, searchQuery: e.target.value }))}
            data-testid="role-search-input"
          />
        </div>

        <div className="filter-pills">
          <FilterPill
            $isActive={filterState.selectedTier === 'ALL'}
            onClick={() => setFilterState(prev => ({ ...prev, selectedTier: 'ALL' }))}
          >
            {t.allTiers}
          </FilterPill>
          <FilterPill
            $isActive={filterState.selectedTier === 'TIER_1'}
            onClick={() => setFilterState(prev => ({ ...prev, selectedTier: 'TIER_1' }))}
          >
            Tier 1: Corporate
          </FilterPill>
          <FilterPill
            $isActive={filterState.selectedTier === 'TIER_2'}
            onClick={() => setFilterState(prev => ({ ...prev, selectedTier: 'TIER_2' }))}
            data-testid="tier-filter-tier2"
          >
            Tier 2: Client Portals
          </FilterPill>
          <FilterPill
            $isActive={filterState.selectedTier === 'TIER_3'}
            onClick={() => setFilterState(prev => ({ ...prev, selectedTier: 'TIER_3' }))}
          >
            Tier 3: Strategic
          </FilterPill>
        </div>
      </RoleFilterBar>

      {/* ── 4. 14 Sovereign Roles Matrix Grid ──────────────────── */}
      <RolesGrid>
        {roles.map(role => {
          const isSimulated = currentRole === role.id;
          const levelColor = getLevelColor(role.accessLevel);

          return (
            <RoleCard
              key={role.id}
              $isSimulated={isSimulated}
              $levelColor={levelColor}
              onClick={() => handleCardClick(role.id)}
              data-testid={`role-card-${role.id}`}
            >
              <div className="card-top">
                <div className="role-title-box">
                  <span className="code-badge">{role.code}</span>
                  <span className="role-name">{role.name}</span>
                  <span className="tier-label">{role.tier}</span>
                </div>
                <span className="level-badge">L{role.accessLevel}</span>
              </div>

              <div className="role-desc">{role.description}</div>

              <div className="role-permissions-wrap">
                {role.permissions.map((perm, idx) => (
                  <span key={idx} className="perm-badge">
                    {perm}
                  </span>
                ))}
              </div>

              <div className="card-bottom">
                <span className="assigned-count">
                  {role.assignedCount.toLocaleString()} Users Assigned
                </span>

                <button
                  type="button"
                  className="simulate-btn"
                  onClick={e => {
                    e.stopPropagation();
                    handleSimulateRole(role.id);
                  }}
                  data-testid={`simulate-btn-${role.id}`}
                >
                  {isSimulated ? (
                    <>
                      <CheckCircle2 size={12} />
                      <span>{t.currentSimulated}</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw size={12} />
                      <span>{t.simulate}</span>
                    </>
                  )}
                </button>
              </div>
            </RoleCard>
          );
        })}
      </RolesGrid>
    </RoleManagerContainer>
  );
};

export default RoleManagerView;
