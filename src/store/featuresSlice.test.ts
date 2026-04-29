import { describe, it, expect } from 'vitest';
import reducer, {
  selectFeature,
  selectCategory,
  setSearchQuery,
  setViewMode,
  clearSelection,
  selectFilteredFeatures,
  selectSelectedFeature,
} from './featuresSlice';
import type { RootState } from './store';

// ─── Helpers ───────────────────────────────────────────────────────
const initialState = () => reducer(undefined, { type: '@@INIT' });

/** Wraps features state as fake RootState for selectors */
const rootWith = (overrides: Partial<ReturnType<typeof initialState>> = {}) =>
  ({ features: { ...initialState(), ...overrides } }) as unknown as RootState;

// ─── Initial state ────────────────────────────────────────────────
describe('featuresSlice', () => {
  describe('initial state', () => {
    it('loads features from platformFeatures config', () => {
      const state = initialState();
      expect(state.features.length).toBeGreaterThan(0);
      expect(Array.isArray(state.features)).toBe(true);
    });

    it('loads categories from config', () => {
      const state = initialState();
      expect(state.categories.length).toBeGreaterThan(0);
      expect(Array.isArray(state.categories)).toBe(true);
    });

    it('starts with no selection', () => {
      const state = initialState();
      expect(state.selectedFeatureId).toBeNull();
      expect(state.selectedCategory).toBeNull();
      expect(state.searchQuery).toBe('');
    });

    it('defaults to grid view mode', () => {
      const state = initialState();
      expect(state.viewMode).toBe('grid');
    });

    it('has valid stats', () => {
      const state = initialState();
      expect(state.stats.total).toBeGreaterThan(0);
      expect(typeof state.stats.byCategory).toBe('object');
      expect(typeof state.stats.byStatus).toBe('object');
    });

    it('feature objects have required shape', () => {
      const state = initialState();
      const feature = state.features[0];
      expect(feature).toHaveProperty('id');
      expect(feature).toHaveProperty('name');
      expect(feature).toHaveProperty('description');
      expect(feature).toHaveProperty('category');
      expect(feature).toHaveProperty('details');
      expect(Array.isArray(feature.details)).toBe(true);
    });
  });

  // ─── selectFeature ───────────────────────────────────────────────
  describe('selectFeature', () => {
    it('sets selectedFeatureId', () => {
      const state = reducer(initialState(), selectFeature('feat-1'));
      expect(state.selectedFeatureId).toBe('feat-1');
    });

    it('replaces previously selected feature', () => {
      let state = reducer(initialState(), selectFeature('feat-1'));
      state = reducer(state, selectFeature('feat-2'));
      expect(state.selectedFeatureId).toBe('feat-2');
    });

    it('does not modify other state', () => {
      const prev = initialState();
      const state = reducer(prev, selectFeature('feat-1'));
      expect(state.selectedCategory).toBe(prev.selectedCategory);
      expect(state.searchQuery).toBe(prev.searchQuery);
      expect(state.viewMode).toBe(prev.viewMode);
    });
  });

  // ─── selectCategory ──────────────────────────────────────────────
  describe('selectCategory', () => {
    it('sets selectedCategory', () => {
      const state = reducer(initialState(), selectCategory('Authentication'));
      expect(state.selectedCategory).toBe('Authentication');
    });

    it('clears selectedFeatureId when category changes', () => {
      let state = reducer(initialState(), selectFeature('feat-1'));
      expect(state.selectedFeatureId).toBe('feat-1');

      state = reducer(state, selectCategory('Authentication'));
      expect(state.selectedFeatureId).toBeNull();
      expect(state.selectedCategory).toBe('Authentication');
    });

    it('can set category to null', () => {
      let state = reducer(initialState(), selectCategory('Authentication'));
      state = reducer(state, selectCategory(null));
      expect(state.selectedCategory).toBeNull();
    });
  });

  // ─── setSearchQuery ──────────────────────────────────────────────
  describe('setSearchQuery', () => {
    it('sets search query', () => {
      const state = reducer(initialState(), setSearchQuery('property'));
      expect(state.searchQuery).toBe('property');
    });

    it('can be cleared', () => {
      let state = reducer(initialState(), setSearchQuery('test'));
      state = reducer(state, setSearchQuery(''));
      expect(state.searchQuery).toBe('');
    });

    it('does not modify feature selection', () => {
      let state = reducer(initialState(), selectFeature('feat-1'));
      state = reducer(state, setSearchQuery('test'));
      expect(state.selectedFeatureId).toBe('feat-1');
    });
  });

  // ─── setViewMode ─────────────────────────────────────────────────
  describe('setViewMode', () => {
    it('changes view mode', () => {
      const state = reducer(initialState(), setViewMode('list'));
      expect(state.viewMode).toBe('list');
    });

    it('can switch back to grid', () => {
      let state = reducer(initialState(), setViewMode('list'));
      state = reducer(state, setViewMode('grid'));
      expect(state.viewMode).toBe('grid');
    });
  });

  // ─── clearSelection ──────────────────────────────────────────────
  describe('clearSelection', () => {
    it('clears feature, category, and search', () => {
      let state = reducer(initialState(), selectFeature('feat-1'));
      state = reducer(state, selectCategory('Auth'));
      state = reducer(state, setSearchQuery('test'));

      state = reducer(state, clearSelection());
      expect(state.selectedFeatureId).toBeNull();
      expect(state.selectedCategory).toBeNull();
      expect(state.searchQuery).toBe('');
    });

    it('does not modify features array or viewMode', () => {
      const prev = initialState();
      const state = reducer(prev, clearSelection());
      expect(state.features).toEqual(prev.features);
      expect(state.viewMode).toBe(prev.viewMode);
    });

    it('is idempotent', () => {
      const state1 = reducer(initialState(), clearSelection());
      const state2 = reducer(state1, clearSelection());
      expect(state2.selectedFeatureId).toBeNull();
      expect(state2.selectedCategory).toBeNull();
      expect(state2.searchQuery).toBe('');
    });
  });

  // ─── selectFilteredFeatures (memoized selector) ──────────────────
  describe('selectFilteredFeatures', () => {
    it('returns all features when no filter applied', () => {
      const root = rootWith();
      const result = selectFilteredFeatures(root);
      const state = initialState();
      expect(result.length).toBe(state.features.length);
    });

    it('filters by category', () => {
      const state = initialState();
      // Pick the category of the first feature
      const firstCategory = state.features[0].category;
      const root = rootWith({ selectedCategory: firstCategory });
      const result = selectFilteredFeatures(root);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((f) => f.category === firstCategory)).toBe(true);
    });

    it('filters by search query (name match)', () => {
      const state = initialState();
      // Use first few characters of first feature's name as query
      const partialName = state.features[0].name.substring(0, 4).toLowerCase();
      const root = rootWith({ searchQuery: partialName });
      const result = selectFilteredFeatures(root);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((f) => {
        const matchesName = f.name.toLowerCase().includes(partialName);
        const matchesDesc = f.description.toLowerCase().includes(partialName);
        const matchesDetails = f.details.some((d) => d.toLowerCase().includes(partialName));
        expect(matchesName || matchesDesc || matchesDetails).toBe(true);
      });
    });

    it('filters by both category and search query', () => {
      const state = initialState();
      const cat = state.features[0].category;
      const query = state.features[0].name.substring(0, 3).toLowerCase();
      const root = rootWith({ selectedCategory: cat, searchQuery: query });
      const result = selectFilteredFeatures(root);

      result.forEach((f) => {
        expect(f.category).toBe(cat);
      });
    });

    it('returns empty array when search matches nothing', () => {
      const root = rootWith({ searchQuery: 'zzzznonexistent99999' });
      const result = selectFilteredFeatures(root);
      expect(result).toEqual([]);
    });

    it('search is case-insensitive', () => {
      const state = initialState();
      const name = state.features[0].name;
      const upper = rootWith({ searchQuery: name.toUpperCase() });
      const lower = rootWith({ searchQuery: name.toLowerCase() });

      expect(selectFilteredFeatures(upper).length).toBeGreaterThan(0);
      expect(selectFilteredFeatures(lower).length).toBeGreaterThan(0);
    });

    it('searches in details array', () => {
      const state = initialState();
      // Find a feature with at least one detail
      const featureWithDetails = state.features.find((f) => f.details.length > 0);
      if (!featureWithDetails) return; // skip if no feature has details

      const query = featureWithDetails.details[0].substring(0, 5).toLowerCase();
      const root = rootWith({ searchQuery: query });
      const result = selectFilteredFeatures(root);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  // ─── selectSelectedFeature ───────────────────────────────────────
  describe('selectSelectedFeature', () => {
    it('returns null when no feature selected', () => {
      const result = selectSelectedFeature(rootWith());
      expect(result).toBeNull();
    });

    it('returns the feature matching selectedFeatureId', () => {
      const state = initialState();
      const target = state.features[0];
      const result = selectSelectedFeature(
        rootWith({ selectedFeatureId: target.id })
      );
      expect(result).not.toBeNull();
      expect(result!.id).toBe(target.id);
      expect(result!.name).toBe(target.name);
    });

    it('returns null for non-existent feature id', () => {
      const result = selectSelectedFeature(
        rootWith({ selectedFeatureId: 'nonexistent-id' })
      );
      expect(result).toBeNull();
    });
  });

  // ─── Action sequences ────────────────────────────────────────────
  describe('action sequences', () => {
    it('browse flow: select category → select feature → clear', () => {
      let state = initialState();
      state = reducer(state, selectCategory('Authentication'));
      expect(state.selectedCategory).toBe('Authentication');

      const featureId = state.features[0].id;
      state = reducer(state, selectFeature(featureId));
      expect(state.selectedFeatureId).toBe(featureId);

      state = reducer(state, clearSelection());
      expect(state.selectedFeatureId).toBeNull();
      expect(state.selectedCategory).toBeNull();
    });

    it('search flow: type query → refine → clear', () => {
      let state = initialState();
      state = reducer(state, setSearchQuery('prop'));
      expect(state.searchQuery).toBe('prop');

      state = reducer(state, setSearchQuery('property listing'));
      expect(state.searchQuery).toBe('property listing');

      state = reducer(state, clearSelection());
      expect(state.searchQuery).toBe('');
    });

    it('view toggle: grid → list → grid', () => {
      let state = initialState();
      expect(state.viewMode).toBe('grid');
      state = reducer(state, setViewMode('list'));
      expect(state.viewMode).toBe('list');
      state = reducer(state, setViewMode('grid'));
      expect(state.viewMode).toBe('grid');
    });
  });
});
