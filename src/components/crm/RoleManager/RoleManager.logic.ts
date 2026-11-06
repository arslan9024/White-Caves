// FILE: src/components/crm/RoleManager/RoleManager.logic.ts
/**
 * White Caves Real Estate LLC - Role Manager State Orchestration Hook (Tier 2)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useContext, useEffect } from 'react';
import { UserRoleContext, UserRole } from '../../../context/UserRoleContext';
import { CANONICAL_SOVEREIGN_ROLES } from './RoleManager.data';
import type { SovereignRoleDefinition, RoleFilterState } from './RoleManager.types';
import { RoleTelemetry } from './RoleManager.telemetry';
import { indexRolesInMemory, loadRoleCache } from './RoleManager.cache';

export function useRoleManager(selectedRoleIdProp?: string) {
  const context = useContext(UserRoleContext);
  const currentRole = context?.role || 'managing_director';
  const currentAccessLevel = context?.accessLevel || 5;
  const switchRole = context?.switchRole || (() => {});

  const [roles, setRoles] = useState<SovereignRoleDefinition[]>(() => {
    return loadRoleCache() || CANONICAL_SOVEREIGN_ROLES;
  });

  const [filterState, setFilterState] = useState<RoleFilterState>({
    searchQuery: '',
    selectedTier: 'ALL',
    selectedAccessLevel: 'ALL',
  });

  const [selectedRoleId, setSelectedRoleId] = useState<UserRole | null>(
    (selectedRoleIdProp as UserRole) || null
  );

  useEffect(() => {
    indexRolesInMemory(roles);
    RoleTelemetry.track('MOUNT', { initialCount: roles.length });
  }, [roles]);

  useEffect(() => {
    if (selectedRoleIdProp) {
      setSelectedRoleId(selectedRoleIdProp as UserRole);
    }
  }, [selectedRoleIdProp]);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      if (filterState.selectedTier === 'TIER_1' && role.tier !== 'Tier 1: Internal Corporate') {
        return false;
      }
      if (filterState.selectedTier === 'TIER_2' && role.tier !== 'Tier 2: Client Portals') {
        return false;
      }
      if (filterState.selectedTier === 'TIER_3' && role.tier !== 'Tier 3: Strategic Partners') {
        return false;
      }

      if (
        filterState.selectedAccessLevel !== 'ALL' &&
        role.accessLevel.toString() !== filterState.selectedAccessLevel
      ) {
        return false;
      }

      if (filterState.searchQuery.trim()) {
        const q = filterState.searchQuery.toLowerCase().trim();
        const matchesName = role.name.toLowerCase().includes(q);
        const matchesCode = role.code.toLowerCase().includes(q);
        const matchesDept = role.department.toLowerCase().includes(q);
        const matchesId = role.id.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesDept && !matchesId) return false;
      }

      return true;
    });
  }, [roles, filterState]);

  const metrics = useMemo(() => {
    const totalAssigned = roles.reduce((sum, r) => sum + r.assignedCount, 0);
    const tier1Count = roles.filter(r => r.tier === 'Tier 1: Internal Corporate').length;
    const clientCount = roles.filter(r => r.tier === 'Tier 2: Client Portals').length;
    return {
      totalRoles: roles.length,
      totalAssigned,
      tier1Count,
      clientCount,
      activeClearanceLevel: currentAccessLevel,
    };
  }, [roles, currentAccessLevel]);

  const handleSimulateRole = (targetRole: UserRole) => {
    switchRole(targetRole);
    RoleTelemetry.track('ROLE_SWITCH', {
      targetRole,
      actorRole: currentRole,
      meta: { timestamp: Date.now() },
    });
  };

  return {
    roles: filteredRoles,
    totalCount: roles.length,
    currentRole,
    currentAccessLevel,
    filterState,
    setFilterState,
    selectedRoleId,
    setSelectedRoleId,
    metrics,
    handleSimulateRole,
  };
}
