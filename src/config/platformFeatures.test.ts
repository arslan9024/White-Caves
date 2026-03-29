import { describe, it, expect } from 'vitest';
import {
  FEATURE_CATEGORIES,
  FEATURE_STATUS,
  PLATFORM_FEATURES,
  CATEGORY_INFO,
  getFeaturesByCategory,
  getFeatureById,
  getActiveFeatures,
  getFeatureStats,
} from './platformFeatures';

// ═══════════════════════════════════════════════════════════════════════
describe('config/platformFeatures', () => {
  // ── FEATURE_CATEGORIES ────────────────────────────────────────────
  describe('FEATURE_CATEGORIES', () => {
    it('has 10 categories', () => {
      expect(Object.keys(FEATURE_CATEGORIES)).toHaveLength(10);
    });

    it.each([
      'AUTHENTICATION',
      'USER_MANAGEMENT',
      'PROPERTY',
      'TRANSACTIONS',
      'COMMUNICATION',
      'ANALYTICS',
      'INTEGRATIONS',
      'UI_COMPONENTS',
      'TOOLS',
      'SYSTEM',
    ])('has category %s', (cat) => {
      expect(FEATURE_CATEGORIES[cat as keyof typeof FEATURE_CATEGORIES]).toBeDefined();
    });
  });

  // ── FEATURE_STATUS ────────────────────────────────────────────────
  describe('FEATURE_STATUS', () => {
    it('has 5 statuses', () => {
      expect(Object.keys(FEATURE_STATUS)).toHaveLength(5);
    });

    it.each(['ACTIVE', 'BETA', 'DEVELOPMENT', 'PLANNED', 'DEPRECATED'])(
      'has status %s',
      (status) => {
        expect(FEATURE_STATUS[status as keyof typeof FEATURE_STATUS]).toBeDefined();
      },
    );
  });

  // ── PLATFORM_FEATURES ─────────────────────────────────────────────
  describe('PLATFORM_FEATURES', () => {
    it('has at least 15 features', () => {
      expect(PLATFORM_FEATURES.length).toBeGreaterThanOrEqual(15);
    });

    it('every feature has required fields', () => {
      for (const feature of PLATFORM_FEATURES) {
        expect(typeof feature.id).toBe('string');
        expect(typeof feature.name).toBe('string');
        expect(typeof feature.category).toBe('string');
        expect(typeof feature.status).toBe('string');
        expect(typeof feature.icon).toBe('string');
        expect(typeof feature.description).toBe('string');
        expect(Array.isArray(feature.details)).toBe(true);
        expect(typeof feature.implementedDate).toBe('string');
        expect(Array.isArray(feature.files)).toBe(true);
      }
    });

    it('every feature category is valid', () => {
      const validCategories = Object.values(FEATURE_CATEGORIES);
      for (const feature of PLATFORM_FEATURES) {
        expect(validCategories).toContain(feature.category);
      }
    });

    it('every feature status is valid', () => {
      const validStatuses = Object.values(FEATURE_STATUS);
      for (const feature of PLATFORM_FEATURES) {
        expect(validStatuses).toContain(feature.status);
      }
    });

    it('all feature IDs are unique', () => {
      const ids = PLATFORM_FEATURES.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // ── CATEGORY_INFO ─────────────────────────────────────────────────
  describe('CATEGORY_INFO', () => {
    it('has entry for every category', () => {
      for (const cat of Object.values(FEATURE_CATEGORIES)) {
        expect(CATEGORY_INFO[cat]).toBeDefined();
        expect(typeof CATEGORY_INFO[cat].name).toBe('string');
        expect(typeof CATEGORY_INFO[cat].icon).toBe('string');
        expect(typeof CATEGORY_INFO[cat].color).toBe('string');
      }
    });
  });

  // ── getFeaturesByCategory ─────────────────────────────────────────
  describe('getFeaturesByCategory', () => {
    it('returns features for authentication category', () => {
      const auth = getFeaturesByCategory(FEATURE_CATEGORIES.AUTHENTICATION);
      expect(auth.length).toBeGreaterThan(0);
      for (const f of auth) {
        expect(f.category).toBe(FEATURE_CATEGORIES.AUTHENTICATION);
      }
    });

    it('returns empty array for unused category value', () => {
      const result = getFeaturesByCategory('nonexistent' as never);
      expect(result).toEqual([]);
    });
  });

  // ── getFeatureById ────────────────────────────────────────────────
  describe('getFeatureById', () => {
    it('returns feature for valid ID', () => {
      const feature = getFeatureById('multi_provider_auth');
      expect(feature).toBeDefined();
      expect(feature!.name).toContain('Authentication');
    });

    it('returns undefined for unknown ID', () => {
      expect(getFeatureById('nonexistent')).toBeUndefined();
    });
  });

  // ── getActiveFeatures ─────────────────────────────────────────────
  describe('getActiveFeatures', () => {
    it('returns only active features', () => {
      const active = getActiveFeatures();
      expect(active.length).toBeGreaterThan(0);
      for (const f of active) {
        expect(f.status).toBe(FEATURE_STATUS.ACTIVE);
      }
    });

    it('active count is less or equal to total', () => {
      expect(getActiveFeatures().length).toBeLessThanOrEqual(PLATFORM_FEATURES.length);
    });
  });

  // ── getFeatureStats ───────────────────────────────────────────────
  describe('getFeatureStats', () => {
    it('returns total matching PLATFORM_FEATURES length', () => {
      expect(getFeatureStats().total).toBe(PLATFORM_FEATURES.length);
    });

    it('byCategory counts sum to total', () => {
      const { byCategory, total } = getFeatureStats();
      const sum = Object.values(byCategory).reduce((a, b) => a + b, 0);
      expect(sum).toBe(total);
    });

    it('byStatus counts sum to total', () => {
      const { byStatus, total } = getFeatureStats();
      const sum = Object.values(byStatus).reduce((a, b) => a + b, 0);
      expect(sum).toBe(total);
    });

    it('has correct shape', () => {
      const stats = getFeatureStats();
      expect(typeof stats.total).toBe('number');
      expect(typeof stats.byCategory).toBe('object');
      expect(typeof stats.byStatus).toBe('object');
    });
  });
});
