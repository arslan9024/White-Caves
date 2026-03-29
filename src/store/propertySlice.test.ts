/**
 * propertySlice.test.ts — Comprehensive tests for the Property Redux slice
 * ────────────────────────────────────────────────────────────────────────
 * Tests: Property filtering engine, sorting, search, filter merging,
 *        filter clearing, and security-critical logout reset.
 *
 * Coverage targets:
 *   ✓ Initial state shape
 *   ✓ setProperties (stores + copies to filteredProperties)
 *   ✓ setFilters (partial merge)
 *   ✓ clearFilters (resets filters + restores full property list)
 *   ✓ applyFilters — search (title, location, type)
 *   ✓ applyFilters — price range (min/max)
 *   ✓ applyFilters — beds/baths minimum
 *   ✓ applyFilters — property type filter
 *   ✓ applyFilters — location filter
 *   ✓ applyFilters — amenities filter (ALL must match)
 *   ✓ applyFilters — sqft range
 *   ✓ applyFilters — combined filters
 *   ✓ Sorting: price_asc, price_desc, sqft_desc, newest, featured
 *   ✓ SECURITY: logout resets state
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import propertyReducer, {
  setProperties,
  setFilters,
  clearFilters,
  applyFilters,
} from './propertySlice';
import type { Property } from './propertySlice';
import { logout } from './authSlice';

// ─── Helpers ─────────────────────────────────────────────────────────────
const getInitialState = () => propertyReducer(undefined, { type: 'unknown' });

function makeProperty(overrides: Partial<Property> = {}): Property {
  return {
    id: 'prop-1',
    title: 'Luxury Villa',
    location: 'Business Bay',
    type: 'Villa',
    price: 2500000,
    beds: 4,
    baths: 3,
    sqft: 3500,
    amenities: ['pool', 'gym', 'parking'],
    ...overrides,
  };
}

const SAMPLE_PROPERTIES: Property[] = [
  makeProperty({ id: '1', title: 'Business Bay Villa', location: 'Business Bay', type: 'Villa', price: 3000000, beds: 5, baths: 4, sqft: 5000, amenities: ['pool', 'gym', 'parking', 'garden'] }),
  makeProperty({ id: '2', title: 'Marina Apartment', location: 'Dubai Marina', type: 'Apartment', price: 1200000, beds: 2, baths: 2, sqft: 1200, amenities: ['gym', 'parking'] }),
  makeProperty({ id: '3', title: 'Downtown Penthouse', location: 'Downtown Dubai', type: 'Penthouse', price: 8000000, beds: 6, baths: 5, sqft: 8000, amenities: ['pool', 'gym', 'parking', 'concierge'] }),
  makeProperty({ id: '4', title: 'JLT Studio', location: 'JLT', type: 'Apartment', price: 500000, beds: 0, baths: 1, sqft: 450, amenities: ['gym'] }),
  makeProperty({ id: '5', title: 'Palm Jumeirah Villa', location: 'Palm Jumeirah', type: 'Villa', price: 15000000, beds: 7, baths: 8, sqft: 12000, amenities: ['pool', 'gym', 'parking', 'private beach', 'garden'] }),
];

// ==========================================================================
// TESTS
// ==========================================================================

describe('propertySlice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ========================================================================
  // 1. INITIAL STATE
  // ========================================================================
  describe('initial state', () => {
    it('should return a valid initial state', () => {
      const state = getInitialState();
      expect(state.properties).toEqual([]);
      expect(state.filteredProperties).toEqual([]);
      expect(state.filters).toEqual({
        search: '',
        minPrice: 0,
        maxPrice: 100000000,
        beds: 0,
        baths: 0,
        propertyTypes: [],
        locations: [],
        amenities: [],
        minSqft: 0,
        maxSqft: 20000,
        sortBy: 'featured',
      });
    });
  });

  // ========================================================================
  // 2. setProperties
  // ========================================================================
  describe('setProperties', () => {
    it('should set properties and filteredProperties', () => {
      const state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      expect(state.properties).toHaveLength(5);
      expect(state.filteredProperties).toHaveLength(5);
    });

    it('should replace existing properties', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      const newProps = [makeProperty({ id: 'new-1' })];
      state = propertyReducer(state, setProperties(newProps));
      expect(state.properties).toHaveLength(1);
      expect(state.filteredProperties).toHaveLength(1);
    });
  });

  // ========================================================================
  // 3. setFilters
  // ========================================================================
  describe('setFilters', () => {
    it('should merge partial filter updates', () => {
      let state = propertyReducer(getInitialState(), setFilters({ search: 'villa' }));
      expect(state.filters.search).toBe('villa');
      expect(state.filters.minPrice).toBe(0); // other filters unchanged

      state = propertyReducer(state, setFilters({ minPrice: 1000000 }));
      expect(state.filters.search).toBe('villa');
      expect(state.filters.minPrice).toBe(1000000);
    });

    it('should update multiple filter fields at once', () => {
      const state = propertyReducer(getInitialState(), setFilters({
        beds: 3,
        baths: 2,
        sortBy: 'price_asc',
      }));
      expect(state.filters.beds).toBe(3);
      expect(state.filters.baths).toBe(2);
      expect(state.filters.sortBy).toBe('price_asc');
    });

    it('should replace array filters', () => {
      const state = propertyReducer(getInitialState(), setFilters({
        propertyTypes: ['Villa', 'Penthouse'],
        locations: ['Business Bay'],
      }));
      expect(state.filters.propertyTypes).toEqual(['Villa', 'Penthouse']);
      expect(state.filters.locations).toEqual(['Business Bay']);
    });
  });

  // ========================================================================
  // 4. clearFilters
  // ========================================================================
  describe('clearFilters', () => {
    it('should reset all filters to defaults', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'villa', beds: 3, minPrice: 2000000 }));
      state = propertyReducer(state, clearFilters());

      expect(state.filters.search).toBe('');
      expect(state.filters.beds).toBe(0);
      expect(state.filters.minPrice).toBe(0);
      expect(state.filters.sortBy).toBe('featured');
    });

    it('should restore filteredProperties to full property list', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'nonexistent' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.length).toBeLessThan(5);

      state = propertyReducer(state, clearFilters());
      expect(state.filteredProperties).toHaveLength(5);
    });
  });

  // ========================================================================
  // 5. applyFilters — SEARCH
  // ========================================================================
  describe('applyFilters — search', () => {
    it('should filter by title (case-insensitive)', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'villa' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.title.toLowerCase().includes('villa'))).toBe(true);
      expect(state.filteredProperties.length).toBeGreaterThanOrEqual(2);
    });

    it('should filter by location', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'marina' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(1);
      expect(state.filteredProperties[0].location).toBe('Dubai Marina');
    });

    it('should filter by type', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'penthouse' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(1);
    });

    it('should return all when search is empty', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: '' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(5);
    });

    it('should return empty for no matches', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'unicorn castle' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(0);
    });
  });

  // ========================================================================
  // 6. applyFilters — PRICE RANGE
  // ========================================================================
  describe('applyFilters — price range', () => {
    it('should filter by minPrice', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ minPrice: 5000000 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.price >= 5000000)).toBe(true);
    });

    it('should filter by maxPrice', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ maxPrice: 2000000 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.price <= 2000000)).toBe(true);
    });

    it('should filter by price range (min + max)', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ minPrice: 1000000, maxPrice: 5000000 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.price >= 1000000 && p.price <= 5000000)).toBe(true);
    });
  });

  // ========================================================================
  // 7. applyFilters — BEDS & BATHS
  // ========================================================================
  describe('applyFilters — beds and baths', () => {
    it('should filter by minimum beds', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ beds: 5 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.beds >= 5)).toBe(true);
    });

    it('should filter by minimum baths', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ baths: 4 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.baths >= 4)).toBe(true);
    });

    it('beds=0 should return all (no filter)', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ beds: 0 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(5);
    });
  });

  // ========================================================================
  // 8. applyFilters — PROPERTY TYPES
  // ========================================================================
  describe('applyFilters — property types', () => {
    it('should filter by single property type', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ propertyTypes: ['Villa'] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.type === 'Villa')).toBe(true);
      expect(state.filteredProperties.length).toBe(2); // Business Bay + Palm
    });

    it('should filter by multiple property types', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ propertyTypes: ['Villa', 'Penthouse'] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => ['Villa', 'Penthouse'].includes(p.type))).toBe(true);
      expect(state.filteredProperties.length).toBe(3);
    });

    it('empty propertyTypes should return all', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ propertyTypes: [] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(5);
    });
  });

  // ========================================================================
  // 9. applyFilters — LOCATIONS
  // ========================================================================
  describe('applyFilters — locations', () => {
    it('should filter by location', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ locations: ['Business Bay'] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.location === 'Business Bay')).toBe(true);
    });

    it('should filter by multiple locations', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ locations: ['Business Bay', 'Dubai Marina'] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(2);
    });
  });

  // ========================================================================
  // 10. applyFilters — AMENITIES (ALL must match)
  // ========================================================================
  describe('applyFilters — amenities', () => {
    it('should filter by single amenity', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ amenities: ['pool'] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.amenities.includes('pool'))).toBe(true);
    });

    it('should require ALL amenities to match', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ amenities: ['pool', 'garden'] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p =>
        p.amenities.includes('pool') && p.amenities.includes('garden')
      )).toBe(true);
      expect(state.filteredProperties.length).toBe(2); // Business Bay + Palm
    });

    it('empty amenities should return all', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ amenities: [] }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(5);
    });
  });

  // ========================================================================
  // 11. applyFilters — SQFT RANGE
  // ========================================================================
  describe('applyFilters — sqft range', () => {
    it('should filter by minSqft', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ minSqft: 3000 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.sqft >= 3000)).toBe(true);
    });

    it('should filter by maxSqft', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ maxSqft: 2000 }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.every(p => p.sqft <= 2000)).toBe(true);
    });
  });

  // ========================================================================
  // 12. applyFilters — COMBINED FILTERS
  // ========================================================================
  describe('applyFilters — combined filters', () => {
    it('should apply search + price + beds together', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({
        search: 'villa',
        minPrice: 2000000,
        beds: 4,
      }));
      state = propertyReducer(state, applyFilters());
      // Should match: Business Bay Villa (3M, 5bed) and Palm Villa (15M, 7bed)
      expect(state.filteredProperties.length).toBe(2);
      expect(state.filteredProperties.every(p =>
        p.title.toLowerCase().includes('villa') && p.price >= 2000000 && p.beds >= 4
      )).toBe(true);
    });

    it('should apply type + location + amenities together', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({
        propertyTypes: ['Villa'],
        amenities: ['pool', 'garden'],
      }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toHaveLength(2);
    });
  });

  // ========================================================================
  // 13. SORTING
  // ========================================================================
  describe('sorting', () => {
    it('should sort by price ascending', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ sortBy: 'price_asc' }));
      state = propertyReducer(state, applyFilters());
      for (let i = 1; i < state.filteredProperties.length; i++) {
        expect(state.filteredProperties[i].price).toBeGreaterThanOrEqual(state.filteredProperties[i - 1].price);
      }
    });

    it('should sort by price descending', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ sortBy: 'price_desc' }));
      state = propertyReducer(state, applyFilters());
      for (let i = 1; i < state.filteredProperties.length; i++) {
        expect(state.filteredProperties[i].price).toBeLessThanOrEqual(state.filteredProperties[i - 1].price);
      }
    });

    it('should sort by sqft descending', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ sortBy: 'sqft_desc' }));
      state = propertyReducer(state, applyFilters());
      for (let i = 1; i < state.filteredProperties.length; i++) {
        expect(state.filteredProperties[i].sqft).toBeLessThanOrEqual(state.filteredProperties[i - 1].sqft);
      }
    });

    it('should sort by newest (numeric id descending)', () => {
      const numericProps = SAMPLE_PROPERTIES.map((p, i) => ({ ...p, id: i + 1 }));
      let state = propertyReducer(getInitialState(), setProperties(numericProps));
      state = propertyReducer(state, setFilters({ sortBy: 'newest' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties[0].id).toBe(5);
    });

    it('featured sort should maintain original order', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ sortBy: 'featured' }));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties.map(p => p.id)).toEqual(SAMPLE_PROPERTIES.map(p => p.id));
    });
  });

  // ========================================================================
  // 14. SECURITY: LOGOUT RESETS STATE
  // ========================================================================
  describe('security: logout resets state', () => {
    it('should completely reset property state on logout', () => {
      let state = propertyReducer(getInitialState(), setProperties(SAMPLE_PROPERTIES));
      state = propertyReducer(state, setFilters({ search: 'villa', beds: 3 }));
      state = propertyReducer(state, applyFilters());

      expect(state.properties).toHaveLength(5);
      expect(state.filters.search).toBe('villa');

      state = propertyReducer(state, logout());
      expect(state.properties).toEqual([]);
      expect(state.filteredProperties).toEqual([]);
      expect(state.filters.search).toBe('');
      expect(state.filters.beds).toBe(0);
    });
  });

  // ========================================================================
  // 15. EDGE CASES
  // ========================================================================
  describe('edge cases', () => {
    it('should handle empty properties array', () => {
      let state = propertyReducer(getInitialState(), setProperties([]));
      state = propertyReducer(state, applyFilters());
      expect(state.filteredProperties).toEqual([]);
    });

    it('should handle applyFilters with no data', () => {
      const state = propertyReducer(getInitialState(), applyFilters());
      expect(state.filteredProperties).toEqual([]);
    });
  });
});
