import { describe, it, expect } from 'vitest';
import {
  ROLE_TAB_MAPPING,
  getTabsForRole,
  getRoleInfo,
  canAccessFeature,
  isValidRole,
  isSuperUserRole,
  isAdminRole,
  getAllRoles,
  type RoleKey,
} from './ROLE_TAB_MAPPING';

// ═══════════════════════════════════════════════════════════════════════
describe('ROLE_TAB_MAPPING', () => {
  // ── ROLE_TAB_MAPPING constant ─────────────────────────────────────
  describe('ROLE_TAB_MAPPING constant', () => {
    it('has 29 role keys', () => {
      expect(Object.keys(ROLE_TAB_MAPPING).length).toBe(29);
    });

    it('every config has label, tabs array, and description', () => {
      for (const [role, config] of Object.entries(ROLE_TAB_MAPPING)) {
        expect(typeof config.label).toBe('string');
        expect(Array.isArray(config.tabs)).toBe(true);
        expect(config.tabs.length).toBeGreaterThan(0);
        expect(typeof config.description).toBe('string');
      }
    });

    it('every tab has id, label, and icon', () => {
      for (const config of Object.values(ROLE_TAB_MAPPING)) {
        for (const tab of config.tabs) {
          expect(typeof tab.id).toBe('string');
          expect(typeof tab.label).toBe('string');
          expect(typeof tab.icon).toBe('string');
        }
      }
    });

    it.each(['lion', 'owner', 'buyer', 'seller', 'landlord', 'tenant'])(
      'contains role "%s"',
      (role) => {
        expect(ROLE_TAB_MAPPING[role as RoleKey]).toBeDefined();
      },
    );

    it('lion has the most tabs (full access)', () => {
      const lionTabs = ROLE_TAB_MAPPING.lion.tabs.length;
      for (const config of Object.values(ROLE_TAB_MAPPING)) {
        expect(lionTabs).toBeGreaterThanOrEqual(config.tabs.length);
      }
    });
  });

  // ── getTabsForRole ────────────────────────────────────────────────
  describe('getTabsForRole', () => {
    it('returns tabs for valid role', () => {
      const tabs = getTabsForRole('buyer');
      expect(tabs.length).toBeGreaterThan(0);
      expect(tabs[0]).toHaveProperty('id');
    });

    it('returns empty array for unknown role', () => {
      expect(getTabsForRole('nonexistent')).toEqual([]);
    });

    it('returns empty array for empty string', () => {
      expect(getTabsForRole('')).toEqual([]);
    });

    it('lion has overview, properties, agents, leads, contracts, analytics, admin tabs', () => {
      const tabIds = getTabsForRole('lion').map((t) => t.id);
      expect(tabIds).toContain('overview');
      expect(tabIds).toContain('properties');
      expect(tabIds).toContain('agents');
      expect(tabIds).toContain('leads');
      expect(tabIds).toContain('contracts');
      expect(tabIds).toContain('analytics');
      expect(tabIds).toContain('admin');
    });

    it('tenant has overview, lease-info, maintenance, documents', () => {
      const tabIds = getTabsForRole('tenant').map((t) => t.id);
      expect(tabIds).toEqual(['overview', 'lease-info', 'maintenance', 'documents']);
    });
  });

  // ── getRoleInfo ───────────────────────────────────────────────────
  describe('getRoleInfo', () => {
    it('returns correct label for known role', () => {
      expect(getRoleInfo('buyer').label).toBe('Buyer');
    });

    it('returns correct description for known role', () => {
      expect(getRoleInfo('tenant').description).toBe('Tenant portal access');
    });

    it('isSuperUser is true for lion', () => {
      expect(getRoleInfo('lion').isSuperUser).toBe(true);
    });

    it('isSuperUser is true for owner', () => {
      expect(getRoleInfo('owner').isSuperUser).toBe(true);
    });

    it('isSuperUser is false for buyer', () => {
      expect(getRoleInfo('buyer').isSuperUser).toBe(false);
    });

    it('generates formatted label for unknown role', () => {
      const info = getRoleInfo('unknown_test_role');
      expect(info.label).toBe('Unknown Test Role');
    });

    it('returns default description for unknown role', () => {
      expect(getRoleInfo('xyz').description).toBe('Dashboard access');
    });
  });

  // ── canAccessFeature ──────────────────────────────────────────────
  describe('canAccessFeature', () => {
    it('returns true for accessible feature', () => {
      expect(canAccessFeature('lion', 'admin')).toBe(true);
    });

    it('returns false for inaccessible feature', () => {
      expect(canAccessFeature('tenant', 'admin')).toBe(false);
    });

    it('returns false for unknown role', () => {
      expect(canAccessFeature('unknown', 'overview')).toBe(false);
    });

    it('returns false for unknown feature', () => {
      expect(canAccessFeature('lion', 'nonexistent-tab')).toBe(false);
    });

    it('buyer can access saved-properties', () => {
      expect(canAccessFeature('buyer', 'saved-properties')).toBe(true);
    });

    it('buyer cannot access agents', () => {
      expect(canAccessFeature('buyer', 'agents')).toBe(false);
    });
  });

  // ── isValidRole ───────────────────────────────────────────────────
  describe('isValidRole', () => {
    it.each(['lion', 'owner', 'buyer', 'seller', 'tenant', 'managing_director'])(
      'returns true for "%s"',
      (role) => {
        expect(isValidRole(role)).toBe(true);
      },
    );

    it('returns false for unknown role', () => {
      expect(isValidRole('fake_role')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidRole('')).toBe(false);
    });
  });

  // ── isSuperUserRole ───────────────────────────────────────────────
  describe('isSuperUserRole', () => {
    it('returns true for lion', () => {
      expect(isSuperUserRole('lion')).toBe(true);
    });

    it('returns true for owner', () => {
      expect(isSuperUserRole('owner')).toBe(true);
    });

    it('returns false for buyer', () => {
      expect(isSuperUserRole('buyer')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isSuperUserRole(undefined)).toBe(false);
    });
  });

  // ── isAdminRole ───────────────────────────────────────────────────
  describe('isAdminRole', () => {
    it('returns true for admin', () => {
      expect(isAdminRole('admin')).toBe(true);
    });

    it('returns true for super_user', () => {
      expect(isAdminRole('super_user')).toBe(true);
    });

    it('returns true for lion (via isSuperUserRole)', () => {
      expect(isAdminRole('lion')).toBe(true);
    });

    it('returns true for owner (via isSuperUserRole)', () => {
      expect(isAdminRole('owner')).toBe(true);
    });

    it('returns false for buyer', () => {
      expect(isAdminRole('buyer')).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isAdminRole(undefined)).toBe(false);
    });
  });

  // ── getAllRoles ───────────────────────────────────────────────────
  describe('getAllRoles', () => {
    it('returns 29 roles', () => {
      expect(getAllRoles()).toHaveLength(29);
    });

    it('includes lion and owner', () => {
      const roles = getAllRoles();
      expect(roles).toContain('lion');
      expect(roles).toContain('owner');
    });

    it('returns strings only', () => {
      for (const role of getAllRoles()) {
        expect(typeof role).toBe('string');
      }
    });
  });
});
