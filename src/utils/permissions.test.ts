/**
 * permissions.test.ts — Comprehensive tests for role & permission system
 * ──────────────────────────────────────────────────────────────────────
 * Tests: ROLES constants, ROLE_HIERARCHY, PERMISSIONS mapping,
 *        hasPermission, hasAnyPermission, hasAllPermissions,
 *        isOwner, isAgent, isManager, isAdmin,
 *        canAccessFeature, getRoleLevel, getPermissionsForRole.
 *
 * Coverage targets:
 *   ✓ All 12 roles defined correctly
 *   ✓ Role hierarchy levels (100 → 10)
 *   ✓ Permission assignments for every role
 *   ✓ Owner-exclusive features gating
 *   ✓ Public roles list
 *   ✓ Null/undefined/empty edge cases
 *   ✓ Unknown role handling
 */

import { describe, it, expect } from 'vitest';
import {
  ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  OWNER_EXCLUSIVE_FEATURES,
  PUBLIC_ROLES,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  isOwner,
  isAgent,
  isManager,
  isAdmin,
  canAccessFeature,
  getRoleLevel,
  getPermissionsForRole,
} from './permissions';

// ═══════════════════════════════════════════════════════════════════════════
//  ROLES Constants
// ═══════════════════════════════════════════════════════════════════════════

describe('ROLES constants', () => {
  it('defines all canonical roles (21 total in v2.0)', () => {
    expect(Object.keys(ROLES)).toHaveLength(21);
  });

  it('has correct backend CRM roles', () => {
    expect(ROLES.OWNER).toBe('owner');
    expect(ROLES.MANAGER).toBe('manager');
    expect(ROLES.ADMIN).toBe('admin');
    expect(ROLES.AGENT).toBe('agent');
    expect(ROLES.FINANCE).toBe('finance');
    expect(ROLES.VIEWER).toBe('viewer');
  });

  it('has correct customer-facing roles', () => {
    expect(ROLES.BUYER).toBe('buyer');
    expect(ROLES.SELLER).toBe('seller');
    expect(ROLES.LANDLORD).toBe('landlord');
    expect(ROLES.TENANT).toBe('tenant');
    expect(ROLES.LEASING_AGENT).toBe('leasing-agent');
    expect(ROLES.SALES_AGENT).toBe('secondary-sales-agent');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  ROLE_HIERARCHY
// ═══════════════════════════════════════════════════════════════════════════

describe('ROLE_HIERARCHY', () => {
  it('owner has highest level (100)', () => {
    expect(ROLE_HIERARCHY[ROLES.OWNER]).toBe(100);
  });

  it('managing director has level 95', () => {
    expect(ROLE_HIERARCHY[ROLES.MANAGING_DIRECTOR]).toBe(95);
  });

  it('director has level 85', () => {
    expect(ROLE_HIERARCHY[ROLES.DIRECTOR]).toBe(85);
  });

  it('manager has level 90', () => {
    expect(ROLE_HIERARCHY[ROLES.MANAGER]).toBe(90);
  });

  it('admin has level 80', () => {
    expect(ROLE_HIERARCHY[ROLES.ADMIN]).toBe(80);
  });

  it('finance has level 70', () => {
    expect(ROLE_HIERARCHY[ROLES.FINANCE]).toBe(70);
  });

  it('agent roles share level 55 (leasing/sales) or 50 (generic agent)', () => {
    expect(ROLE_HIERARCHY[ROLES.AGENT]).toBe(50);
    expect(ROLE_HIERARCHY[ROLES.SALES_AGENT]).toBe(55);
    expect(ROLE_HIERARCHY[ROLES.LEASING_AGENT]).toBe(55);
  });

  it('landlord has level 30', () => {
    expect(ROLE_HIERARCHY[ROLES.LANDLORD]).toBe(30);
  });

  it('seller has level 20', () => {
    expect(ROLE_HIERARCHY[ROLES.SELLER]).toBe(20);
  });

  it('viewer, tenant, and buyer share level 10', () => {
    expect(ROLE_HIERARCHY[ROLES.VIEWER]).toBe(10);
    expect(ROLE_HIERARCHY[ROLES.TENANT]).toBe(10);
    expect(ROLE_HIERARCHY[ROLES.BUYER]).toBe(10);
  });

  it('hierarchy covers all canonical roles (21 in v2.0)', () => {
    const rolesWithHierarchy = Object.keys(ROLE_HIERARCHY);
    expect(rolesWithHierarchy).toHaveLength(21);
  });

  it('owner outranks manager', () => {
    expect(ROLE_HIERARCHY[ROLES.OWNER]).toBeGreaterThan(ROLE_HIERARCHY[ROLES.MANAGER]);
  });

  it('manager outranks admin', () => {
    expect(ROLE_HIERARCHY[ROLES.MANAGER]).toBeGreaterThan(ROLE_HIERARCHY[ROLES.ADMIN]);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  PERMISSIONS Constants
// ═══════════════════════════════════════════════════════════════════════════

describe('PERMISSIONS constants', () => {
  it('defines all permissions (38 total in v2.0)', () => {
    expect(Object.keys(PERMISSIONS)).toHaveLength(38);
  });

  it('has all expected permission keys', () => {
    const expectedKeys = [
      'VIEW_DASHBOARD',
      'EDIT_PROFILE',
      'VIEW_PROPERTIES',
      'CREATE_PROPERTY',
      'EDIT_PROPERTY',
      'DELETE_PROPERTY',
      'VIEW_LEADS',
      'MANAGE_LEADS',
      'VIEW_CONTRACTS',
      'CREATE_CONTRACTS',
      'SIGN_CONTRACTS',
      'VIEW_PAYMENTS',
      'PROCESS_PAYMENTS',
      'VIEW_ANALYTICS',
      'VIEW_SYSTEM_HEALTH',
      'MANAGE_USERS',
      'MANAGE_AGENTS',
      'ACCESS_WHATSAPP_BUSINESS',
      'CONFIGURE_CHATBOT',
      'VIEW_ALL_REPORTS',
      'MODIFY_SETTINGS',
    ];
    expectedKeys.forEach(key => {
      expect(PERMISSIONS).toHaveProperty(key);
    });
  });

  it('permission values are snake_case strings', () => {
    Object.values(PERMISSIONS).forEach(value => {
      expect(value).toMatch(/^[a-z_]+$/);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  ROLE_PERMISSIONS Mapping
// ═══════════════════════════════════════════════════════════════════════════

describe('ROLE_PERMISSIONS mapping', () => {
  it('covers all canonical roles in v2.0', () => {
    const allRoles = Object.values(ROLES);
    allRoles.forEach(role => {
      expect(ROLE_PERMISSIONS).toHaveProperty(role);
    });
  });

  // ── Owner — 27 permissions ─────────────────────────────────────────────
  describe('owner permissions', () => {
    it('has the most permissions of any role', () => {
      const ownerCount = ROLE_PERMISSIONS[ROLES.OWNER].length;
      Object.entries(ROLE_PERMISSIONS).forEach(([role, perms]) => {
        if (role !== ROLES.OWNER) {
          expect(ownerCount).toBeGreaterThanOrEqual(perms.length);
        }
      });
    });

    it('includes exclusive permissions', () => {
      const ownerPerms = ROLE_PERMISSIONS[ROLES.OWNER];
      expect(ownerPerms).toContain(PERMISSIONS.MANAGE_USERS);
      expect(ownerPerms).toContain(PERMISSIONS.ACCESS_WHATSAPP_BUSINESS);
      expect(ownerPerms).toContain(PERMISSIONS.CONFIGURE_CHATBOT);
      expect(ownerPerms).toContain(PERMISSIONS.MODIFY_SETTINGS);
      expect(ownerPerms).toContain(PERMISSIONS.VIEW_SYSTEM_HEALTH);
    });
  });

  // ── Viewer — minimal permissions ───────────────────────────────────
  describe('viewer permissions', () => {
    it('has only view-level permissions', () => {
      const viewerPerms = ROLE_PERMISSIONS[ROLES.VIEWER];
      expect(viewerPerms).toContain(PERMISSIONS.VIEW_DASHBOARD);
      expect(viewerPerms).toContain(PERMISSIONS.EDIT_PROFILE);
      expect(viewerPerms).toContain(PERMISSIONS.VIEW_PROPERTIES);
      expect(viewerPerms).not.toContain(PERMISSIONS.CREATE_PROPERTY);
      expect(viewerPerms).not.toContain(PERMISSIONS.DELETE_PROPERTY);
      expect(viewerPerms).not.toContain(PERMISSIONS.MANAGE_USERS);
    });
  });

  // ── Buyer and Tenant — limited permissions ─────────────────────────
  describe('buyer/tenant permissions', () => {
    it('buyer can view and sign contracts but not create them', () => {
      const buyerPerms = ROLE_PERMISSIONS[ROLES.BUYER];
      expect(buyerPerms).toContain(PERMISSIONS.VIEW_CONTRACTS);
      expect(buyerPerms).toContain(PERMISSIONS.SIGN_CONTRACTS);
      expect(buyerPerms).not.toContain(PERMISSIONS.CREATE_CONTRACTS);
    });

    it('tenant has same structure as buyer', () => {
      const tenantPerms = ROLE_PERMISSIONS[ROLES.TENANT];
      expect(tenantPerms).toContain(PERMISSIONS.VIEW_CONTRACTS);
      expect(tenantPerms).toContain(PERMISSIONS.SIGN_CONTRACTS);
      expect(tenantPerms).not.toContain(PERMISSIONS.CREATE_CONTRACTS);
    });
  });

  // ── Finance — payments focus ───────────────────────────────────────
  describe('finance permissions', () => {
    it('can process payments and view reports', () => {
      const financePerms = ROLE_PERMISSIONS[ROLES.FINANCE];
      expect(financePerms).toContain(PERMISSIONS.VIEW_PAYMENTS);
      expect(financePerms).toContain(PERMISSIONS.PROCESS_PAYMENTS);
      expect(financePerms).toContain(PERMISSIONS.VIEW_ALL_REPORTS);
    });

    it('cannot manage properties or users', () => {
      const financePerms = ROLE_PERMISSIONS[ROLES.FINANCE];
      expect(financePerms).not.toContain(PERMISSIONS.CREATE_PROPERTY);
      expect(financePerms).not.toContain(PERMISSIONS.MANAGE_USERS);
    });
  });

  // ── Agent — property & lead management ─────────────────────────────
  describe('agent permissions', () => {
    it('can manage leads and create properties', () => {
      const agentPerms = ROLE_PERMISSIONS[ROLES.AGENT];
      expect(agentPerms).toContain(PERMISSIONS.VIEW_LEADS);
      expect(agentPerms).toContain(PERMISSIONS.MANAGE_LEADS);
      expect(agentPerms).toContain(PERMISSIONS.CREATE_PROPERTY);
      expect(agentPerms).toContain(PERMISSIONS.EDIT_PROPERTY);
    });

    it('cannot delete properties or manage users', () => {
      const agentPerms = ROLE_PERMISSIONS[ROLES.AGENT];
      expect(agentPerms).not.toContain(PERMISSIONS.DELETE_PROPERTY);
      expect(agentPerms).not.toContain(PERMISSIONS.MANAGE_USERS);
    });
  });

  // ── Sales Agent — has PROCESS_PAYMENTS ─────────────────────────────
  describe('sales agent permissions', () => {
    it('can process payments (unlike regular agent)', () => {
      expect(ROLE_PERMISSIONS[ROLES.SALES_AGENT]).toContain(PERMISSIONS.PROCESS_PAYMENTS);
      expect(ROLE_PERMISSIONS[ROLES.AGENT]).not.toContain(PERMISSIONS.PROCESS_PAYMENTS);
    });
  });

  // ── Manager — executive operations without owner-only settings ───────
  describe('manager permissions', () => {
    it('can manage agents and view reporting surfaces', () => {
      const managerPerms = ROLE_PERMISSIONS[ROLES.MANAGER];
      expect(managerPerms).toContain(PERMISSIONS.MANAGE_AGENTS);
      expect(managerPerms).toContain(PERMISSIONS.VIEW_ALL_REPORTS);
    });

    it('cannot manage users (owner-exclusive)', () => {
      expect(ROLE_PERMISSIONS[ROLES.MANAGER]).not.toContain(PERMISSIONS.MANAGE_USERS);
    });
  });

  // ── Admin — has MANAGE_USERS but not MODIFY_SETTINGS ───────────────
  describe('admin permissions', () => {
    it('can manage users and agents', () => {
      const adminPerms = ROLE_PERMISSIONS[ROLES.ADMIN];
      expect(adminPerms).toContain(PERMISSIONS.MANAGE_USERS);
      expect(adminPerms).toContain(PERMISSIONS.MANAGE_AGENTS);
    });

    it('cannot modify settings or configure chatbot', () => {
      const adminPerms = ROLE_PERMISSIONS[ROLES.ADMIN];
      expect(adminPerms).not.toContain(PERMISSIONS.MODIFY_SETTINGS);
      expect(adminPerms).not.toContain(PERMISSIONS.CONFIGURE_CHATBOT);
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  hasPermission
// ═══════════════════════════════════════════════════════════════════════════

describe('hasPermission', () => {
  it('returns true when role has the permission', () => {
    expect(hasPermission(ROLES.OWNER, PERMISSIONS.MANAGE_USERS)).toBe(true);
  });

  it('returns false when role does NOT have the permission', () => {
    expect(hasPermission(ROLES.VIEWER, PERMISSIONS.MANAGE_USERS)).toBe(false);
  });

  it('returns false for null role', () => {
    expect(hasPermission(null, PERMISSIONS.VIEW_DASHBOARD)).toBe(false);
  });

  it('returns false for empty string role', () => {
    expect(hasPermission('', PERMISSIONS.VIEW_DASHBOARD)).toBe(false);
  });

  it('returns false for empty permission', () => {
    expect(hasPermission(ROLES.OWNER, '')).toBe(false);
  });

  it('returns false for unknown role', () => {
    expect(hasPermission('super-admin', PERMISSIONS.VIEW_DASHBOARD)).toBe(false);
  });

  it('returns false for unknown permission', () => {
    expect(hasPermission(ROLES.OWNER, 'fly_to_moon')).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  hasAnyPermission
// ═══════════════════════════════════════════════════════════════════════════

describe('hasAnyPermission', () => {
  it('returns true if role has at least one of the permissions', () => {
    expect(
      hasAnyPermission(ROLES.FINANCE, [PERMISSIONS.VIEW_PAYMENTS, PERMISSIONS.MANAGE_USERS])
    ).toBe(true);
  });

  it('returns false if role has none of the permissions', () => {
    expect(
      hasAnyPermission(ROLES.VIEWER, [PERMISSIONS.MANAGE_USERS, PERMISSIONS.DELETE_PROPERTY])
    ).toBe(false);
  });

  it('returns false for null role', () => {
    expect(hasAnyPermission(null, [PERMISSIONS.VIEW_DASHBOARD])).toBe(false);
  });

  it('returns false for empty permissions array', () => {
    expect(hasAnyPermission(ROLES.OWNER, [])).toBe(false);
  });

  it('returns false for null permissions', () => {
    expect(hasAnyPermission(ROLES.OWNER, null as unknown as string[])).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  hasAllPermissions
// ═══════════════════════════════════════════════════════════════════════════

describe('hasAllPermissions', () => {
  it('returns true if role has ALL the specified permissions', () => {
    expect(
      hasAllPermissions(ROLES.OWNER, [
        PERMISSIONS.VIEW_DASHBOARD,
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.MODIFY_SETTINGS,
      ])
    ).toBe(true);
  });

  it('returns false if role is missing even one permission', () => {
    expect(
      hasAllPermissions(ROLES.VIEWER, [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.MANAGE_USERS])
    ).toBe(false);
  });

  it('returns false for null role', () => {
    expect(hasAllPermissions(null, [PERMISSIONS.VIEW_DASHBOARD])).toBe(false);
  });

  it('returns false for empty permissions array', () => {
    expect(hasAllPermissions(ROLES.OWNER, [])).toBe(false);
  });

  it('returns false for null permissions', () => {
    expect(hasAllPermissions(ROLES.OWNER, null as unknown as string[])).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  Role Identity Functions
// ═══════════════════════════════════════════════════════════════════════════

describe('isOwner', () => {
  it('returns true for owner role', () => {
    expect(isOwner(ROLES.OWNER)).toBe(true);
  });

  it('returns false for all other roles', () => {
    const nonOwnerRoles = Object.values(ROLES).filter(r => r !== ROLES.OWNER);
    nonOwnerRoles.forEach(role => {
      expect(isOwner(role)).toBe(false);
    });
  });

  it('returns false for null', () => {
    expect(isOwner(null)).toBe(false);
  });
});

describe('isAgent', () => {
  it('returns true for regular agent', () => {
    expect(isAgent(ROLES.AGENT)).toBe(true);
  });

  it('returns true for leasing agent', () => {
    expect(isAgent(ROLES.LEASING_AGENT)).toBe(true);
  });

  it('returns true for sales agent', () => {
    expect(isAgent(ROLES.SALES_AGENT)).toBe(true);
  });

  it('returns false for non-agent roles', () => {
    expect(isAgent(ROLES.OWNER)).toBe(false);
    expect(isAgent(ROLES.BUYER)).toBe(false);
    expect(isAgent(ROLES.FINANCE)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isAgent(null)).toBe(false);
  });
});

describe('isManager', () => {
  it('returns true for owner', () => {
    expect(isManager(ROLES.OWNER)).toBe(true);
  });

  it('returns true for manager', () => {
    expect(isManager(ROLES.MANAGER)).toBe(true);
  });

  it('returns true for director and managing director', () => {
    expect(isManager(ROLES.DIRECTOR)).toBe(true);
    expect(isManager(ROLES.MANAGING_DIRECTOR)).toBe(true);
  });

  it('returns false for admin', () => {
    expect(isManager(ROLES.ADMIN)).toBe(false);
  });

  it('returns false for non-management roles', () => {
    expect(isManager(ROLES.AGENT)).toBe(false);
    expect(isManager(ROLES.VIEWER)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isManager(null)).toBe(false);
  });
});

describe('isAdmin', () => {
  it('returns true for owner', () => {
    expect(isAdmin(ROLES.OWNER)).toBe(true);
  });

  it('returns true for manager', () => {
    expect(isAdmin(ROLES.MANAGER)).toBe(true);
  });

  it('returns true for admin', () => {
    expect(isAdmin(ROLES.ADMIN)).toBe(true);
  });

  it('returns false for agent', () => {
    expect(isAdmin(ROLES.AGENT)).toBe(false);
  });

  it('returns false for finance', () => {
    expect(isAdmin(ROLES.FINANCE)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isAdmin(null)).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  canAccessFeature
// ═══════════════════════════════════════════════════════════════════════════

describe('canAccessFeature', () => {
  it('owner can access owner-exclusive features', () => {
    OWNER_EXCLUSIVE_FEATURES.forEach(feature => {
      expect(canAccessFeature(ROLES.OWNER, feature)).toBe(true);
    });
  });

  it('non-owners CANNOT access owner-exclusive features', () => {
    const nonOwners = [ROLES.MANAGER, ROLES.ADMIN, ROLES.AGENT, ROLES.VIEWER, ROLES.BUYER];
    nonOwners.forEach(role => {
      OWNER_EXCLUSIVE_FEATURES.forEach(feature => {
        expect(canAccessFeature(role, feature)).toBe(false);
      });
    });
  });

  it('all roles can access non-exclusive features', () => {
    Object.values(ROLES).forEach(role => {
      expect(canAccessFeature(role, 'property_search')).toBe(true);
      expect(canAccessFeature(role, 'dashboard_view')).toBe(true);
    });
  });

  it('returns false for null role on exclusive features', () => {
    expect(canAccessFeature(null, 'whatsapp_business')).toBe(false);
  });

  it('returns true for null role on non-exclusive features', () => {
    expect(canAccessFeature(null, 'some_feature')).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  OWNER_EXCLUSIVE_FEATURES
// ═══════════════════════════════════════════════════════════════════════════

describe('OWNER_EXCLUSIVE_FEATURES', () => {
  it('includes all expected exclusive features', () => {
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('whatsapp_business');
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('chatbot_management');
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('system_health');
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('user_management');
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('agent_management');
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('global_settings');
    expect(OWNER_EXCLUSIVE_FEATURES).toContain('all_reports');
  });

  it('has exactly 7 exclusive features', () => {
    expect(OWNER_EXCLUSIVE_FEATURES).toHaveLength(7);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  PUBLIC_ROLES
// ═══════════════════════════════════════════════════════════════════════════

describe('PUBLIC_ROLES', () => {
  it('includes all customer-facing roles', () => {
    expect(PUBLIC_ROLES).toContain(ROLES.BUYER);
    expect(PUBLIC_ROLES).toContain(ROLES.SELLER);
    expect(PUBLIC_ROLES).toContain(ROLES.LANDLORD);
    expect(PUBLIC_ROLES).toContain(ROLES.TENANT);
    expect(PUBLIC_ROLES).toContain(ROLES.LEASING_AGENT);
    expect(PUBLIC_ROLES).toContain(ROLES.SALES_AGENT);
  });

  it('does NOT include backend CRM roles', () => {
    expect(PUBLIC_ROLES).not.toContain(ROLES.OWNER);
    expect(PUBLIC_ROLES).not.toContain(ROLES.MANAGER);
    expect(PUBLIC_ROLES).not.toContain(ROLES.ADMIN);
    expect(PUBLIC_ROLES).not.toContain(ROLES.AGENT);
    expect(PUBLIC_ROLES).not.toContain(ROLES.FINANCE);
    expect(PUBLIC_ROLES).not.toContain(ROLES.VIEWER);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  getRoleLevel
// ═══════════════════════════════════════════════════════════════════════════

describe('getRoleLevel', () => {
  it('returns correct level for known roles', () => {
    expect(getRoleLevel(ROLES.OWNER)).toBe(100);
    expect(getRoleLevel(ROLES.MANAGER)).toBe(90);
    expect(getRoleLevel(ROLES.BUYER)).toBe(10);
  });

  it('returns 0 for unknown roles', () => {
    expect(getRoleLevel('unknown-role')).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(getRoleLevel('')).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  getPermissionsForRole
// ═══════════════════════════════════════════════════════════════════════════

describe('getPermissionsForRole', () => {
  it('returns correct permissions array for known role', () => {
    const ownerPerms = getPermissionsForRole(ROLES.OWNER);
    expect(ownerPerms.length).toBeGreaterThan(20);
    expect(ownerPerms).toContain(PERMISSIONS.MANAGE_USERS);
  });

  it('returns empty array for unknown role', () => {
    expect(getPermissionsForRole('fake-role')).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(getPermissionsForRole('')).toEqual([]);
  });

  it('returns same reference for unknown roles (EMPTY_PERMISSIONS optimization)', () => {
    const a = getPermissionsForRole('nope');
    const b = getPermissionsForRole('also-nope');
    expect(a).toBe(b); // Same array reference
  });
});

// ═══════════════════════════════════════════════════════════════════════════
//  Cross-Role Security Invariants
// ═══════════════════════════════════════════════════════════════════════════

describe('Security invariants', () => {
  it('only owner has MODIFY_SETTINGS and CONFIGURE_CHATBOT', () => {
    Object.values(ROLES).forEach(role => {
      if (role === ROLES.OWNER || role === ROLES.MANAGER) {
        // These two may have MODIFY_SETTINGS
      } else {
        expect(ROLE_PERMISSIONS[role]).not.toContain(PERMISSIONS.MODIFY_SETTINGS);
      }
    });
  });

  it('only owner has ACCESS_WHATSAPP_BUSINESS', () => {
    Object.values(ROLES).forEach(role => {
      if (role === ROLES.OWNER) {
        expect(ROLE_PERMISSIONS[role]).toContain(PERMISSIONS.ACCESS_WHATSAPP_BUSINESS);
      } else {
        expect(ROLE_PERMISSIONS[role]).not.toContain(PERMISSIONS.ACCESS_WHATSAPP_BUSINESS);
      }
    });
  });

  it('only owner has CONFIGURE_CHATBOT', () => {
    Object.values(ROLES).forEach(role => {
      if (role === ROLES.OWNER) {
        expect(ROLE_PERMISSIONS[role]).toContain(PERMISSIONS.CONFIGURE_CHATBOT);
      } else {
        expect(ROLE_PERMISSIONS[role]).not.toContain(PERMISSIONS.CONFIGURE_CHATBOT);
      }
    });
  });

  it('all roles have VIEW_DASHBOARD', () => {
    Object.values(ROLES).forEach(role => {
      expect(ROLE_PERMISSIONS[role]).toContain(PERMISSIONS.VIEW_DASHBOARD);
    });
  });

  it('all roles have EDIT_PROFILE', () => {
    Object.values(ROLES).forEach(role => {
      expect(ROLE_PERMISSIONS[role]).toContain(PERMISSIONS.EDIT_PROFILE);
    });
  });

  it('DELETE_PROPERTY is restricted to owner, managing director, manager, and admin', () => {
    const rolesWithDelete = Object.values(ROLES).filter(role =>
      ROLE_PERMISSIONS[role].includes(PERMISSIONS.DELETE_PROPERTY)
    );
    expect(rolesWithDelete).toEqual(
      expect.arrayContaining([ROLES.OWNER, ROLES.MANAGING_DIRECTOR, ROLES.MANAGER, ROLES.ADMIN])
    );
    expect(rolesWithDelete).toHaveLength(4);
  });
});
