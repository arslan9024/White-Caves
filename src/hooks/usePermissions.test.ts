/**
 * usePermissions.test.ts — Comprehensive tests for the permissions React hook
 * ────────────────────────────────────────────────────────────────────────────
 * Tests: usePermissions, useCanAccess, useIsOwner, useIsAgent hooks
 *        with mocked Redux store providing different active roles.
 *
 * Coverage targets:
 *   ✓ usePermissions returns correct shape for each role
 *   ✓ Owner gets all boolean permissions true
 *   ✓ Viewer gets restricted permissions
 *   ✓ Null/undefined role defaults to no permissions
 *   ✓ can(), canAny(), canAll(), canAccess() function dispatchers
 *   ✓ useCanAccess returns boolean for specific permission
 *   ✓ useIsOwner returns true only for owner role
 *   ✓ useIsAgent returns true for all agent types
 *   ✓ Re-exports PERMISSIONS and ROLES
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

// ─── Mock logger and firebase (required by store setup) ──────────────────
vi.mock('../utils/logger', () => ({
  createLogger: () => ({
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }),
}));

// Import after mocks
import {
  usePermissions,
  useCanAccess,
  useIsOwner,
  useIsAgent,
  PERMISSIONS,
  ROLES,
} from './usePermissions';

// ─── Minimal store wrapper ───────────────────────────────────────────────
function createMockStore(activeRole: string | null = null) {
  return configureStore({
    reducer: {
      navigation: () => ({
        activeRole,
        currentView: 'dashboard',
        selectedDepartment: null,
        selectedService: null,
        selectedAssistant: null,
        breadcrumbs: [],
      }),
    },
  });
}

function createWrapper(activeRole: string | null = null) {
  const store = createMockStore(activeRole);
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(Provider, { store } as any, children);
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  usePermissions
// ═══════════════════════════════════════════════════════════════════════════

describe('usePermissions', () => {
  // ── Owner role (full access) ─────────────────────────────────────────
  describe('owner role', () => {
    it('returns isOwner = true', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(result.current.isOwner).toBe(true);
    });

    it('returns isAgent = false', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(result.current.isAgent).toBe(false);
    });

    it('returns role = "owner"', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(result.current.role).toBe('owner');
    });

    it('has all 21 permissions', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(result.current.permissions).toHaveLength(21);
    });

    it('all boolean permission flags are true', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(result.current.canViewDashboard).toBe(true);
      expect(result.current.canEditProfile).toBe(true);
      expect(result.current.canViewProperties).toBe(true);
      expect(result.current.canCreateProperty).toBe(true);
      expect(result.current.canEditProperty).toBe(true);
      expect(result.current.canDeleteProperty).toBe(true);
      expect(result.current.canViewLeads).toBe(true);
      expect(result.current.canManageLeads).toBe(true);
      expect(result.current.canViewContracts).toBe(true);
      expect(result.current.canCreateContracts).toBe(true);
      expect(result.current.canSignContracts).toBe(true);
      expect(result.current.canViewPayments).toBe(true);
      expect(result.current.canProcessPayments).toBe(true);
      expect(result.current.canViewAnalytics).toBe(true);
      expect(result.current.canViewSystemHealth).toBe(true);
      expect(result.current.canManageUsers).toBe(true);
      expect(result.current.canManageAgents).toBe(true);
      expect(result.current.canAccessWhatsApp).toBe(true);
      expect(result.current.canConfigureChatbot).toBe(true);
      expect(result.current.canViewAllReports).toBe(true);
      expect(result.current.canModifySettings).toBe(true);
    });
  });

  // ── Viewer role (minimal access) ────────────────────────────────────
  describe('viewer role', () => {
    it('returns isOwner = false', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('viewer'),
      });
      expect(result.current.isOwner).toBe(false);
    });

    it('can view dashboard and properties', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('viewer'),
      });
      expect(result.current.canViewDashboard).toBe(true);
      expect(result.current.canViewProperties).toBe(true);
    });

    it('cannot manage users or delete properties', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('viewer'),
      });
      expect(result.current.canManageUsers).toBe(false);
      expect(result.current.canDeleteProperty).toBe(false);
      expect(result.current.canModifySettings).toBe(false);
      expect(result.current.canAccessWhatsApp).toBe(false);
    });
  });

  // ── Agent role ──────────────────────────────────────────────────────
  describe('agent role', () => {
    it('returns isAgent = true for regular agent', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('agent'),
      });
      expect(result.current.isAgent).toBe(true);
    });

    it('returns isAgent = true for leasing-agent', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('leasing-agent'),
      });
      expect(result.current.isAgent).toBe(true);
    });

    it('returns isAgent = true for secondary-sales-agent', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('secondary-sales-agent'),
      });
      expect(result.current.isAgent).toBe(true);
    });
  });

  // ── Finance role ────────────────────────────────────────────────────
  describe('finance role', () => {
    it('can process payments', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('finance'),
      });
      expect(result.current.canViewPayments).toBe(true);
      expect(result.current.canProcessPayments).toBe(true);
    });

    it('cannot manage properties', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('finance'),
      });
      expect(result.current.canCreateProperty).toBe(false);
      expect(result.current.canEditProperty).toBe(false);
    });
  });

  // ── Null role (not logged in) ───────────────────────────────────────
  describe('null role', () => {
    it('returns null role', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(null),
      });
      expect(result.current.role).toBeNull();
    });

    it('returns no permissions', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(null),
      });
      expect(result.current.isOwner).toBe(false);
      expect(result.current.isAgent).toBe(false);
      expect(result.current.canViewDashboard).toBe(false);
      expect(result.current.canManageUsers).toBe(false);
    });

    it('returns empty permissions array', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper(null),
      });
      expect(result.current.permissions).toEqual([]);
    });
  });

  // ── Dynamic permission functions ────────────────────────────────────
  describe('dynamic permission functions', () => {
    it('can() checks single permission', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(result.current.can(PERMISSIONS.MANAGE_USERS)).toBe(true);
      expect(result.current.can('nonexistent_permission')).toBe(false);
    });

    it('canAny() checks if any permission matches', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('viewer'),
      });
      expect(
        result.current.canAny([PERMISSIONS.MANAGE_USERS, PERMISSIONS.VIEW_DASHBOARD])
      ).toBe(true);
      expect(
        result.current.canAny([PERMISSIONS.MANAGE_USERS, PERMISSIONS.MODIFY_SETTINGS])
      ).toBe(false);
    });

    it('canAll() checks if all permissions match', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(
        result.current.canAll([PERMISSIONS.MANAGE_USERS, PERMISSIONS.VIEW_DASHBOARD])
      ).toBe(true);
    });

    it('canAll() returns false when any permission is missing', () => {
      const { result } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('viewer'),
      });
      expect(
        result.current.canAll([PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_USERS])
      ).toBe(false);
    });

    it('canAccess() checks owner-exclusive features', () => {
      const { result: ownerResult } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('owner'),
      });
      expect(ownerResult.current.canAccess('whatsapp_business')).toBe(true);

      const { result: viewerResult } = renderHook(() => usePermissions(), {
        wrapper: createWrapper('viewer'),
      });
      expect(viewerResult.current.canAccess('whatsapp_business')).toBe(false);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  useCanAccess
// ═══════════════════════════════════════════════════════════════════════════

describe('useCanAccess', () => {
  it('returns true when role has the permission', () => {
    const { result } = renderHook(
      () => useCanAccess(PERMISSIONS.VIEW_DASHBOARD),
      { wrapper: createWrapper('owner') },
    );
    expect(result.current).toBe(true);
  });

  it('returns false when role does not have the permission', () => {
    const { result } = renderHook(
      () => useCanAccess(PERMISSIONS.MANAGE_USERS),
      { wrapper: createWrapper('viewer') },
    );
    expect(result.current).toBe(false);
  });

  it('returns false for null role', () => {
    const { result } = renderHook(
      () => useCanAccess(PERMISSIONS.VIEW_DASHBOARD),
      { wrapper: createWrapper(null) },
    );
    expect(result.current).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  useIsOwner
// ═══════════════════════════════════════════════════════════════════════════

describe('useIsOwner', () => {
  it('returns true for owner role', () => {
    const { result } = renderHook(() => useIsOwner(), {
      wrapper: createWrapper('owner'),
    });
    expect(result.current).toBe(true);
  });

  it('returns false for manager role', () => {
    const { result } = renderHook(() => useIsOwner(), {
      wrapper: createWrapper('manager'),
    });
    expect(result.current).toBe(false);
  });

  it('returns false for null role', () => {
    const { result } = renderHook(() => useIsOwner(), {
      wrapper: createWrapper(null),
    });
    expect(result.current).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  useIsAgent
// ═══════════════════════════════════════════════════════════════════════════

describe('useIsAgent', () => {
  it('returns true for regular agent', () => {
    const { result } = renderHook(() => useIsAgent(), {
      wrapper: createWrapper('agent'),
    });
    expect(result.current).toBe(true);
  });

  it('returns true for leasing-agent', () => {
    const { result } = renderHook(() => useIsAgent(), {
      wrapper: createWrapper('leasing-agent'),
    });
    expect(result.current).toBe(true);
  });

  it('returns true for secondary-sales-agent', () => {
    const { result } = renderHook(() => useIsAgent(), {
      wrapper: createWrapper('secondary-sales-agent'),
    });
    expect(result.current).toBe(true);
  });

  it('returns false for owner', () => {
    const { result } = renderHook(() => useIsAgent(), {
      wrapper: createWrapper('owner'),
    });
    expect(result.current).toBe(false);
  });

  it('returns false for null role', () => {
    const { result } = renderHook(() => useIsAgent(), {
      wrapper: createWrapper(null),
    });
    expect(result.current).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  Re-exports
// ═══════════════════════════════════════════════════════════════════════════

describe('Re-exports', () => {
  it('re-exports PERMISSIONS from permissions.ts', () => {
    expect(PERMISSIONS).toBeDefined();
    expect(PERMISSIONS.VIEW_DASHBOARD).toBe('view_dashboard');
  });

  it('re-exports ROLES from permissions.ts', () => {
    expect(ROLES).toBeDefined();
    expect(ROLES.OWNER).toBe('owner');
  });
});
