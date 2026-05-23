import { describe, it, expect } from 'vitest';
import {
  PUBLIC_NAV,
  ROLE_NAV,
  QUICK_ACTIONS,
  BREADCRUMB_LABELS,
  getRoleCategory,
  getNavForRole,
  getQuickActionsForRole,
  type RoleCategory,
  type UserRole,
} from './navigation';

// ═══════════════════════════════════════════════════════════════════════
describe('navigation config', () => {
  // ── PUBLIC_NAV ────────────────────────────────────────────────────
  describe('PUBLIC_NAV', () => {
    it('has main, buy, rent, sell, and company sections', () => {
      expect(PUBLIC_NAV).toHaveProperty('main');
      expect(PUBLIC_NAV).toHaveProperty('buy');
      expect(PUBLIC_NAV).toHaveProperty('rent');
      expect(PUBLIC_NAV).toHaveProperty('sell');
      expect(PUBLIC_NAV).toHaveProperty('company');
    });

    it.each(['main', 'buy', 'rent', 'sell', 'company'])(
      '%s section contains at least 1 nav item',
      (section) => {
        expect(PUBLIC_NAV[section].length).toBeGreaterThanOrEqual(1);
      },
    );

    it('each nav item has label, path, and icon', () => {
      for (const section of Object.values(PUBLIC_NAV)) {
        for (const item of section) {
          expect(item).toHaveProperty('label');
          expect(item).toHaveProperty('path');
          expect(item).toHaveProperty('icon');
          expect(typeof item.label).toBe('string');
          expect(typeof item.path).toBe('string');
          expect(typeof item.icon).toBe('string');
        }
      }
    });

    it('main section has at least 5 items', () => {
      expect(PUBLIC_NAV.main.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ── ROLE_NAV ──────────────────────────────────────────────────────
  describe('ROLE_NAV', () => {
    const expectedRoles = [
      'buyer',
      'seller',
      'landlord',
      'tenant',
      'leasing-agent',
      'secondary-sales-agent',
      'team-leader',
      'owner',
    ];

    it.each(expectedRoles)('has config for "%s"', (role) => {
      expect(ROLE_NAV[role]).toBeDefined();
    });

    it('each config has label, icon, dashboard, and links', () => {
      for (const config of Object.values(ROLE_NAV)) {
        expect(typeof config.label).toBe('string');
        expect(typeof config.icon).toBe('string');
        expect(typeof config.dashboard).toBe('string');
        expect(Array.isArray(config.links)).toBe(true);
        expect(config.links.length).toBeGreaterThan(0);
      }
    });

    it('owner has browseAs config', () => {
      expect(ROLE_NAV.owner.browseAs).toBeDefined();
      expect(ROLE_NAV.owner.browseAs!.clients.length).toBeGreaterThan(0);
      expect(ROLE_NAV.owner.browseAs!.employees.length).toBeGreaterThan(0);
    });

    it('non-owner roles do NOT have browseAs', () => {
      for (const [role, config] of Object.entries(ROLE_NAV)) {
        if (role !== 'owner') {
          expect(config.browseAs).toBeUndefined();
        }
      }
    });

    it('all links have label, path, and icon', () => {
      for (const config of Object.values(ROLE_NAV)) {
        for (const link of config.links) {
          expect(link.label).toBeTruthy();
          expect(link.path).toBeTruthy();
          expect(link.icon).toBeTruthy();
        }
      }
    });
  });

  // ── QUICK_ACTIONS ─────────────────────────────────────────────────
  describe('QUICK_ACTIONS', () => {
    const categories: RoleCategory[] = ['visitor', 'client', 'staff', 'admin'];

    it.each(categories)('has quick actions for "%s"', (cat) => {
      expect(QUICK_ACTIONS[cat]).toBeDefined();
      expect(QUICK_ACTIONS[cat].length).toBeGreaterThan(0);
    });

    it('each quick action has label, path, icon', () => {
      for (const actions of Object.values(QUICK_ACTIONS)) {
        for (const action of actions) {
          expect(typeof action.label).toBe('string');
          expect(typeof action.path).toBe('string');
          expect(typeof action.icon).toBe('string');
        }
      }
    });

    it('at least one action per category is marked primary', () => {
      for (const actions of Object.values(QUICK_ACTIONS)) {
        const primaries = actions.filter((a) => a.primary);
        expect(primaries.length).toBeGreaterThanOrEqual(1);
      }
    });
  });

  // ── BREADCRUMB_LABELS ─────────────────────────────────────────────
  describe('BREADCRUMB_LABELS', () => {
    it('has at least 20 path labels', () => {
      expect(Object.keys(BREADCRUMB_LABELS).length).toBeGreaterThanOrEqual(20);
    });

    it('all labels are non-empty strings', () => {
      for (const [path, label] of Object.entries(BREADCRUMB_LABELS)) {
        expect(typeof path).toBe('string');
        expect(typeof label).toBe('string');
        expect(label.trim().length).toBeGreaterThan(0);
      }
    });

    it('contains common paths', () => {
      // BREADCRUMB_LABELS uses path segments as keys
      const keys = Object.keys(BREADCRUMB_LABELS);
      expect(keys.length).toBeGreaterThanOrEqual(20);
      // At least one key should contain "Home" label for root
      expect(BREADCRUMB_LABELS['/']).toBe('Home');
    });
  });

  // ── getRoleCategory ───────────────────────────────────────────────
  describe('getRoleCategory', () => {
    it.each([
      ['buyer', 'client'],
      ['seller', 'client'],
      ['landlord', 'client'],
      ['tenant', 'client'],
    ] as const)('maps %s → %s', (role, expected) => {
      expect(getRoleCategory(role)).toBe(expected);
    });

    it.each([
      ['leasing-agent', 'staff'],
      ['secondary-sales-agent', 'staff'],
      ['team-leader', 'staff'],
    ] as const)('maps %s → %s', (role, expected) => {
      expect(getRoleCategory(role)).toBe(expected);
    });

    it.each([
      ['owner', 'admin'],
      ['admin', 'admin'],
    ] as const)('maps %s → %s', (role, expected) => {
      expect(getRoleCategory(role)).toBe(expected);
    });

    it('returns "visitor" for unknown roles', () => {
      expect(getRoleCategory('unknown')).toBe('visitor');
      expect(getRoleCategory('')).toBe('visitor');
      expect(getRoleCategory('BUYER')).toBe('visitor'); // case-sensitive
    });
  });

  // ── getNavForRole ─────────────────────────────────────────────────
  describe('getNavForRole', () => {
    it('returns config for valid role', () => {
      const config = getNavForRole('buyer');
      expect(config).not.toBeNull();
      expect(config!.label).toBeTruthy();
      expect(config!.dashboard).toBeTruthy();
    });

    it('returns null for unknown role', () => {
      expect(getNavForRole('nonexistent')).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(getNavForRole('')).toBeNull();
    });

    it.each(['buyer', 'seller', 'landlord', 'tenant', 'owner'])(
      'returns config for %s',
      (role) => {
        expect(getNavForRole(role)).not.toBeNull();
      },
    );
  });

  // ── getQuickActionsForRole ────────────────────────────────────────
  describe('getQuickActionsForRole', () => {
    it('returns client actions for buyer', () => {
      const actions = getQuickActionsForRole('buyer');
      expect(actions).toEqual(QUICK_ACTIONS.client);
    });

    it('returns staff actions for leasing-agent', () => {
      const actions = getQuickActionsForRole('leasing-agent');
      expect(actions).toEqual(QUICK_ACTIONS.staff);
    });

    it('returns admin actions for owner', () => {
      const actions = getQuickActionsForRole('owner');
      expect(actions).toEqual(QUICK_ACTIONS.admin);
    });

    it('returns visitor actions for unknown role', () => {
      const actions = getQuickActionsForRole('random');
      expect(actions).toEqual(QUICK_ACTIONS.visitor);
    });

    it('always returns an array', () => {
      expect(Array.isArray(getQuickActionsForRole(''))).toBe(true);
      expect(Array.isArray(getQuickActionsForRole('xyz'))).toBe(true);
    });
  });
});
