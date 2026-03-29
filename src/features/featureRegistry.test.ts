/**
 * featureRegistry — Comprehensive Tests
 * Tests for DASHBOARD_MODULES configuration and utility functions
 */
import { describe, it, expect } from 'vitest';
import {
  DASHBOARD_MODULES,
  getModulesByRole,
  getSubNavItems,
  getDefaultModule,
  getModuleById,
} from './featureRegistry';

// ─── Tests ──────────────────────────────────────────────────────────────

describe('featureRegistry', () => {

  // ═══ DASHBOARD_MODULES STRUCTURE ═════════════════════════════════════

  describe('DASHBOARD_MODULES', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(DASHBOARD_MODULES)).toBe(true);
      expect(DASHBOARD_MODULES.length).toBeGreaterThan(0);
    });

    it('each module has required fields', () => {
      DASHBOARD_MODULES.forEach(module => {
        expect(module.id).toBeTruthy();
        expect(module.name).toBeTruthy();
        expect(module.description).toBeTruthy();
        expect(module.icon).toBeTruthy();
        expect(Array.isArray(module.roles)).toBe(true);
        expect(module.roles.length).toBeGreaterThan(0);
        expect(module.defaultSubModule).toBeTruthy();
        expect(Array.isArray(module.subNavItems)).toBe(true);
        expect(module.subNavItems.length).toBeGreaterThan(0);
      });
    });

    it('each sub-nav item has required fields', () => {
      DASHBOARD_MODULES.forEach(module => {
        module.subNavItems.forEach(item => {
          expect(item.id).toBeTruthy();
          expect(item.label).toBeTruthy();
          expect(item.icon).toBeTruthy();
          expect(item.component).toBeTruthy();
          expect(Array.isArray(item.roles)).toBe(true);
        });
      });
    });

    it('each module has unique id', () => {
      const ids = DASHBOARD_MODULES.map(m => m.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('sub-nav items have unique ids within each module', () => {
      DASHBOARD_MODULES.forEach(module => {
        const ids = module.subNavItems.map(item => item.id);
        expect(new Set(ids).size).toBe(ids.length);
      });
    });

    it('defaultSubModule exists within subNavItems', () => {
      DASHBOARD_MODULES.forEach(module => {
        const subIds = module.subNavItems.map(item => item.id);
        expect(subIds).toContain(module.defaultSubModule);
      });
    });

    it('badgeCount is a number when present', () => {
      DASHBOARD_MODULES.forEach(module => {
        module.subNavItems.forEach(item => {
          if (item.badgeCount !== undefined) {
            expect(typeof item.badgeCount).toBe('number');
            expect(item.badgeCount).toBeGreaterThanOrEqual(0);
          }
        });
      });
    });
  });

  // ═══ SPECIFIC MODULES ════════════════════════════════════════════════

  describe('specific module validation', () => {
    it('includes buyer module', () => {
      const buyer = DASHBOARD_MODULES.find(m => m.id === 'buyer');
      expect(buyer).toBeDefined();
      expect(buyer!.roles).toContain('buyer');
      expect(buyer!.subNavItems.length).toBeGreaterThanOrEqual(3);
    });

    it('includes seller module', () => {
      const seller = DASHBOARD_MODULES.find(m => m.id === 'seller');
      expect(seller).toBeDefined();
      expect(seller!.roles).toContain('seller');
    });

    it('includes landlord module', () => {
      const landlord = DASHBOARD_MODULES.find(m => m.id === 'landlord');
      expect(landlord).toBeDefined();
      expect(landlord!.roles).toContain('landlord');
    });

    it('includes tenant module', () => {
      const tenant = DASHBOARD_MODULES.find(m => m.id === 'tenant');
      expect(tenant).toBeDefined();
      expect(tenant!.roles).toContain('tenant');
    });

    it('includes owner module', () => {
      const owner = DASHBOARD_MODULES.find(m => m.id === 'owner');
      expect(owner).toBeDefined();
      expect(owner!.roles).toContain('owner');
    });

    it('includes leasing-agent module', () => {
      const leasingAgent = DASHBOARD_MODULES.find(m => m.id === 'leasing-agent');
      expect(leasingAgent).toBeDefined();
      expect(leasingAgent!.roles).toContain('leasing-agent');
    });
  });

  // ═══ getModulesByRole ════════════════════════════════════════════════

  describe('getModulesByRole', () => {
    it('returns modules for buyer role', () => {
      const modules = getModulesByRole('buyer');
      expect(modules.length).toBeGreaterThanOrEqual(1);
      modules.forEach(m => expect(m.roles).toContain('buyer'));
    });

    it('returns modules for seller role', () => {
      const modules = getModulesByRole('seller');
      expect(modules.length).toBeGreaterThanOrEqual(1);
      modules.forEach(m => expect(m.roles).toContain('seller'));
    });

    it('returns modules for owner role', () => {
      const modules = getModulesByRole('owner');
      expect(modules.length).toBeGreaterThanOrEqual(1);
    });

    it('returns modules for landlord role', () => {
      const modules = getModulesByRole('landlord');
      expect(modules.length).toBeGreaterThanOrEqual(1);
    });

    it('returns empty array for unknown role', () => {
      const modules = getModulesByRole('nonexistent_role');
      expect(modules).toEqual([]);
    });

    it('returns empty array for empty string role', () => {
      const modules = getModulesByRole('');
      expect(modules).toEqual([]);
    });
  });

  // ═══ getSubNavItems ══════════════════════════════════════════════════

  describe('getSubNavItems', () => {
    it('returns all sub-nav items for a role (no module filter)', () => {
      const items = getSubNavItems('buyer');
      expect(items.length).toBeGreaterThanOrEqual(1);
    });

    it('returns sub-nav items for a specific module', () => {
      const items = getSubNavItems('buyer', 'buyer');
      expect(items.length).toBeGreaterThanOrEqual(1);
      items.forEach(item => expect(item.roles).toContain('buyer'));
    });

    it('returns empty array for unknown role', () => {
      const items = getSubNavItems('nonexistent');
      expect(items).toEqual([]);
    });

    it('returns empty array for valid role but unknown module', () => {
      const items = getSubNavItems('buyer', 'nonexistent_module');
      expect(items).toEqual([]);
    });

    it('returns owner sub-nav items', () => {
      const items = getSubNavItems('owner', 'owner');
      expect(items.length).toBeGreaterThanOrEqual(3);
    });

    it('flattens items from multiple modules when no module specified', () => {
      // For roles that might have access to multiple modules
      const items = getSubNavItems('owner');
      expect(items.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ═══ getDefaultModule ════════════════════════════════════════════════

  describe('getDefaultModule', () => {
    it('returns first module for buyer', () => {
      const module = getDefaultModule('buyer');
      expect(module).not.toBeNull();
      expect(module!.roles).toContain('buyer');
    });

    it('returns first module for owner', () => {
      const module = getDefaultModule('owner');
      expect(module).not.toBeNull();
      expect(module!.roles).toContain('owner');
    });

    it('returns null for unknown role', () => {
      const module = getDefaultModule('nonexistent');
      expect(module).toBeNull();
    });

    it('returns null for empty role', () => {
      const module = getDefaultModule('');
      expect(module).toBeNull();
    });

    it('returns the FIRST module (not random)', () => {
      const m1 = getDefaultModule('buyer');
      const m2 = getDefaultModule('buyer');
      expect(m1).toEqual(m2);
    });
  });

  // ═══ getModuleById ═══════════════════════════════════════════════════

  describe('getModuleById', () => {
    it('returns module by id', () => {
      const module = getModuleById('buyer');
      expect(module).not.toBeNull();
      expect(module!.id).toBe('buyer');
      expect(module!.name).toBeTruthy();
    });

    it('returns owner module', () => {
      const module = getModuleById('owner');
      expect(module).not.toBeNull();
      expect(module!.id).toBe('owner');
    });

    it('returns null for nonexistent id', () => {
      const module = getModuleById('does_not_exist');
      expect(module).toBeNull();
    });

    it('returns null for empty string', () => {
      const module = getModuleById('');
      expect(module).toBeNull();
    });

    it('each known module can be retrieved by id', () => {
      DASHBOARD_MODULES.forEach(mod => {
        const found = getModuleById(mod.id);
        expect(found).not.toBeNull();
        expect(found!.id).toBe(mod.id);
      });
    });
  });

  // ═══ ROLE COVERAGE ═══════════════════════════════════════════════════

  describe('role coverage', () => {
    const EXPECTED_ROLES = ['buyer', 'seller', 'landlord', 'tenant', 'leasing-agent', 'owner'];

    it('every expected role has at least one module', () => {
      EXPECTED_ROLES.forEach(role => {
        const modules = getModulesByRole(role);
        expect(modules.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('every expected role has a default module', () => {
      EXPECTED_ROLES.forEach(role => {
        const defaultMod = getDefaultModule(role);
        expect(defaultMod).not.toBeNull();
      });
    });
  });
});
