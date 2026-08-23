/**
 * CavesFloatingSearch.data.test.ts
 * AEGIS Turn 66 — Test Coverage Gap remediation (Target 9)
 * Verifies that QUICK_SEARCH_CATEGORIES and SEARCH_MODAL_TEXT exports
 * are correctly shaped and contain expected White Caves content.
 */

import { describe, it, expect } from 'vitest';
import { QUICK_SEARCH_CATEGORIES, SEARCH_MODAL_TEXT } from './CavesFloatingSearch.data';

describe('CavesFloatingSearch.data', () => {
  describe('QUICK_SEARCH_CATEGORIES', () => {
    it('is a non-empty array', () => {
      expect(Array.isArray(QUICK_SEARCH_CATEGORIES)).toBe(true);
      expect(QUICK_SEARCH_CATEGORIES.length).toBeGreaterThan(0);
    });

    it('every category has an id and label string', () => {
      QUICK_SEARCH_CATEGORIES.forEach((cat) => {
        expect(typeof cat.id).toBe('string');
        expect(cat.id.length).toBeGreaterThan(0);
        expect(typeof cat.label).toBe('string');
        expect(cat.label.length).toBeGreaterThan(0);
      });
    });

    it('contains the "all" category with correct id', () => {
      const allCategory = QUICK_SEARCH_CATEGORIES.find((cat) => cat.id === 'all');
      expect(allCategory).toBeDefined();
    });

    it('contains DAMAC Hills 2 category', () => {
      const dh2 = QUICK_SEARCH_CATEGORIES.find((cat) => cat.id === 'dh2');
      expect(dh2).toBeDefined();
      expect(dh2?.label).toContain('DAMAC');
    });

    it('contains the AI Assistants category', () => {
      const ai = QUICK_SEARCH_CATEGORIES.find((cat) => cat.id === 'assistants');
      expect(ai).toBeDefined();
    });

    it('all category ids are unique', () => {
      const ids = QUICK_SEARCH_CATEGORIES.map((cat) => cat.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('SEARCH_MODAL_TEXT', () => {
    it('exports a SEARCH_MODAL_TEXT object', () => {
      expect(SEARCH_MODAL_TEXT).toBeDefined();
      expect(typeof SEARCH_MODAL_TEXT).toBe('object');
    });

    it('has a non-empty pillLabel', () => {
      expect(typeof SEARCH_MODAL_TEXT.pillLabel).toBe('string');
      expect(SEARCH_MODAL_TEXT.pillLabel.length).toBeGreaterThan(0);
    });

    it('has pillShortcut referencing Cmd+K', () => {
      expect(SEARCH_MODAL_TEXT.pillShortcut).toBeDefined();
    });

    it('has a non-empty inputPlaceholder mentioning properties', () => {
      expect(SEARCH_MODAL_TEXT.inputPlaceholder).toContain('properties');
    });

    it('has a trendingLabel', () => {
      expect(typeof SEARCH_MODAL_TEXT.trendingLabel).toBe('string');
      expect(SEARCH_MODAL_TEXT.trendingLabel.length).toBeGreaterThan(0);
    });

    it('has an emptyMessage', () => {
      expect(typeof SEARCH_MODAL_TEXT.emptyMessage).toBe('string');
      expect(SEARCH_MODAL_TEXT.emptyMessage.length).toBeGreaterThan(0);
    });

    it('has a closeLabel', () => {
      expect(typeof SEARCH_MODAL_TEXT.closeLabel).toBe('string');
      expect(SEARCH_MODAL_TEXT.closeLabel.length).toBeGreaterThan(0);
    });
  });
});
