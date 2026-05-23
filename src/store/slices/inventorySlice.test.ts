import { describe, it, expect, vi, beforeEach } from 'vitest';
import reducer, {
  loadInventoryData,
  setFilter,
  clearFilters,
  selectProperty,
  selectOwner,
  toggleMultiOwnerFilter,
  toggleMultiPhoneFilter,
  toggleMultiPropertyFilter,
  selectOwners,
  selectFilters,
  selectAllProperties,
  selectAllOwners,
  selectMultiOwnerProperties,
  selectOwnersWithMultipleProperties,
  selectOwnersWithMultiplePhones,
  selectUniqueClusters,
  selectUniqueAreas,
  selectUniqueStatuses,
  selectFilterOptions,
  selectActiveFiltersCount,
  selectFilteredProperties,
  selectFilteredOwners,
  selectPropertyById,
  selectOwnerById,
  selectOwnersByPropertyId,
  selectPropertiesByOwnerId,
  selectInventoryStats,
  selectSheetsMeta,
} from './inventorySlice';
import { logout } from '../authSlice';
import type { InventoryProperty, InventoryOwner } from './inventorySlice';

// ─── Helpers ───────────────────────────────────────────────────────
const initialState = () => reducer(undefined, { type: '@@INIT' });
type InvState = ReturnType<typeof initialState>;

const makeProperty = (id: string, overrides: Partial<InventoryProperty> = {}): InventoryProperty => ({
  pNumber: id,
  area: 'DAMAC Hills 2',
  status: 'Completed',
  cluster: 'Amazonia',
  layout: '3BR Townhouse',
  view: 'Park View',
  floor: '0',
  rooms: '3',
  masterProject: 'DAMAC Hills 2',
  project: 'Amazonia',
  plotNumber: `P-${id}`,
  owners: [],
  ...overrides,
});

const makeOwner = (id: string, overrides: Partial<InventoryOwner> = {}): InventoryOwner => ({
  id,
  name: `Owner ${id}`,
  properties: [],
  contacts: [],
  ...overrides,
});

const stateWithData = (props: InventoryProperty[] = [], owners: InventoryOwner[] = [], extra: Partial<InvState> = {}): InvState => {
  const byId: Record<string, InventoryProperty> = {};
  const allIds: string[] = [];
  props.forEach((p) => { byId[p.pNumber] = p; allIds.push(p.pNumber); });

  const ownersById: Record<string, InventoryOwner> = {};
  const ownerIds: string[] = [];
  owners.forEach((o) => { ownersById[o.id] = o; ownerIds.push(o.id); });

  return {
    ...initialState(),
    properties: { byId, allIds },
    owners: { byId: ownersById, allIds: ownerIds },
    ...extra,
  };
};

const rootWith = (state: InvState) => ({ inventory: state });

// ─── Initial state ────────────────────────────────────────────────
describe('inventorySlice', () => {
  describe('initial state', () => {
    it('starts with empty properties/owners', () => {
      const state = initialState();
      expect(state.properties.allIds).toEqual([]);
      expect(state.owners.allIds).toEqual([]);
    });

    it('starts not loading, no error', () => {
      const state = initialState();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('starts with all filters reset', () => {
      const state = initialState();
      expect(state.filters.cluster).toBeNull();
      expect(state.filters.searchQuery).toBe('');
      expect(state.filters.showMultiOwner).toBe(false);
    });

    it('starts with no selections', () => {
      const state = initialState();
      expect(state.selectedPropertyId).toBeNull();
      expect(state.selectedOwnerId).toBeNull();
    });
  });

  // ─── Sync actions ───────────────────────────────────────────────
  describe('setFilter', () => {
    it('sets a string filter', () => {
      const state = reducer(initialState(), setFilter({ key: 'cluster', value: 'Amazonia' }));
      expect(state.filters.cluster).toBe('Amazonia');
    });

    it('sets a boolean filter', () => {
      const state = reducer(initialState(), setFilter({ key: 'showMultiOwner', value: true }));
      expect(state.filters.showMultiOwner).toBe(true);
    });

    it('sets searchQuery', () => {
      const state = reducer(initialState(), setFilter({ key: 'searchQuery', value: 'villa' }));
      expect(state.filters.searchQuery).toBe('villa');
    });

    it('can set filter to null', () => {
      let state = reducer(initialState(), setFilter({ key: 'cluster', value: 'Amazonia' }));
      state = reducer(state, setFilter({ key: 'cluster', value: null }));
      expect(state.filters.cluster).toBeNull();
    });
  });

  describe('clearFilters', () => {
    it('resets all filters to defaults', () => {
      let state = initialState();
      state = reducer(state, setFilter({ key: 'cluster', value: 'Amazonia' }));
      state = reducer(state, setFilter({ key: 'searchQuery', value: 'test' }));
      state = reducer(state, setFilter({ key: 'showMultiOwner', value: true }));

      state = reducer(state, clearFilters());
      expect(state.filters.cluster).toBeNull();
      expect(state.filters.searchQuery).toBe('');
      expect(state.filters.showMultiOwner).toBe(false);
    });
  });

  describe('selectProperty / selectOwner', () => {
    it('selectProperty sets selectedPropertyId', () => {
      const state = reducer(initialState(), selectProperty('P-001'));
      expect(state.selectedPropertyId).toBe('P-001');
    });

    it('selectOwner sets selectedOwnerId', () => {
      const state = reducer(initialState(), selectOwner('O-001'));
      expect(state.selectedOwnerId).toBe('O-001');
    });
  });

  describe('toggle filters', () => {
    it('toggleMultiOwnerFilter flips the flag', () => {
      let state = initialState();
      state = reducer(state, toggleMultiOwnerFilter());
      expect(state.filters.showMultiOwner).toBe(true);
      state = reducer(state, toggleMultiOwnerFilter());
      expect(state.filters.showMultiOwner).toBe(false);
    });

    it('toggleMultiPhoneFilter flips the flag', () => {
      let state = initialState();
      state = reducer(state, toggleMultiPhoneFilter());
      expect(state.filters.showMultiPhone).toBe(true);
    });

    it('toggleMultiPropertyFilter flips the flag', () => {
      let state = initialState();
      state = reducer(state, toggleMultiPropertyFilter());
      expect(state.filters.showMultiProperty).toBe(true);
    });
  });

  // ─── loadInventoryData async thunk ──────────────────────────────
  describe('loadInventoryData', () => {
    it('sets loading=true on pending', () => {
      const state = reducer(initialState(), loadInventoryData.pending('req-1'));
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('sets data on fulfilled', () => {
      const payload = {
        properties: {
          byId: { 'P-001': makeProperty('P-001') },
          allIds: ['P-001'],
        },
        owners: {
          byId: { 'O-001': makeOwner('O-001') },
          allIds: ['O-001'],
        },
        ownerships: { byPropertyId: { 'P-001': ['O-001'] }, byOwnerId: { 'O-001': ['P-001'] } },
        manifest: { sheets: ['Sheet1'], clusters: ['Amazonia'], stats: { total: 1 }, filterOptions: {} },
      };

      const state = reducer(
        initialState(),
        loadInventoryData.fulfilled(payload, 'req-1')
      );

      expect(state.loading).toBe(false);
      expect(state.properties.allIds).toEqual(['P-001']);
      expect(state.owners.allIds).toEqual(['O-001']);
      expect(state.manifest.clusters).toEqual(['Amazonia']);
    });

    it('sets error on rejected', () => {
      const state = reducer(
        initialState(),
        loadInventoryData.rejected(null, 'req-1', undefined, 'Network error')
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('uses "Unknown error" when no payload on rejection', () => {
      const state = reducer(
        initialState(),
        loadInventoryData.rejected(null, 'req-1', undefined, undefined)
      );
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Unknown error');
    });
  });

  // ─── logout (extraReducer) ─────────────────────────────────────
  describe('logout', () => {
    it('resets to initial state', () => {
      const loaded = stateWithData(
        [makeProperty('P-001')],
        [makeOwner('O-001')]
      );
      const state = reducer(loaded, logout());
      expect(state.properties.allIds).toEqual([]);
      expect(state.owners.allIds).toEqual([]);
    });
  });

  // ─── Selectors ─────────────────────────────────────────────────
  describe('selectors', () => {
    const p1 = makeProperty('P-001', { cluster: 'Amazonia', area: 'Zone A', status: 'Completed', owners: ['O-001', 'O-002'] });
    const p2 = makeProperty('P-002', { cluster: 'Pelham', area: 'Zone B', status: 'Under Construction', owners: ['O-001'] });
    const p3 = makeProperty('P-003', { cluster: 'Amazonia', area: 'Zone A', status: 'Completed', owners: [] });

    const o1 = makeOwner('O-001', {
      name: 'John Smith',
      properties: ['P-001', 'P-002'],
      contacts: [
        { type: 'mobile', value: '+971501111111' },
        { type: 'phone', value: '+971041111111' },
      ],
    });
    const o2 = makeOwner('O-002', {
      name: 'Jane Doe',
      properties: ['P-001'],
      contacts: [{ type: 'mobile', value: '+971502222222' }],
    });

    const baseState = stateWithData([p1, p2, p3], [o1, o2], {
      ownerships: {
        byPropertyId: { 'P-001': ['O-001', 'O-002'], 'P-002': ['O-001'] },
        byOwnerId: { 'O-001': ['P-001', 'P-002'], 'O-002': ['P-001'] },
      },
      manifest: {
        sheets: ['Sheet1'],
        clusters: ['Amazonia', 'Pelham'],
        stats: { totalProperties: 3 },
        filterOptions: { layouts: ['3BR'] },
      },
    });

    const root = rootWith(baseState);

    describe('basic selectors', () => {
      it('selectAllProperties returns all property objects', () => {
        const result = selectAllProperties(root);
        expect(result).toHaveLength(3);
        expect(result[0].pNumber).toBe('P-001');
      });

      it('selectAllOwners returns all owner objects', () => {
        const result = selectAllOwners(root);
        expect(result).toHaveLength(2);
      });

      it('selectFilters returns filters object', () => {
        const filters = selectFilters(root);
        expect(filters.searchQuery).toBe('');
        expect(filters.showMultiOwner).toBe(false);
      });

      it('selectOwners returns owners map', () => {
        const owners = selectOwners(root);
        expect(owners.allIds).toHaveLength(2);
      });
    });

    describe('derived selectors', () => {
      it('selectMultiOwnerProperties returns properties with 2+ owners', () => {
        const result = selectMultiOwnerProperties(root);
        expect(result).toHaveLength(1);
        expect(result[0].pNumber).toBe('P-001');
      });

      it('selectOwnersWithMultipleProperties returns owners with 2+ props', () => {
        const result = selectOwnersWithMultipleProperties(root);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('O-001');
      });

      it('selectOwnersWithMultiplePhones returns owners with 2+ phones', () => {
        const result = selectOwnersWithMultiplePhones(root);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('O-001');
      });

      it('selectUniqueClusters returns cluster list from manifest', () => {
        const result = selectUniqueClusters(root);
        expect(result).toEqual(['Amazonia', 'Pelham']);
      });

      it('selectUniqueAreas returns sorted unique areas', () => {
        const result = selectUniqueAreas(root);
        expect(result).toEqual(['Zone A', 'Zone B']);
      });

      it('selectUniqueStatuses returns sorted unique statuses', () => {
        const result = selectUniqueStatuses(root);
        expect(result).toEqual(['Completed', 'Under Construction']);
      });

      it('selectFilterOptions merges manifest filterOptions with clusters', () => {
        const result = selectFilterOptions(root);
        expect(result.clusters).toEqual(['Amazonia', 'Pelham']);
        expect((result as any).layouts).toEqual(['3BR']);
      });

      it('selectInventoryStats returns stats from manifest', () => {
        const result = selectInventoryStats(root);
        expect(result).toEqual({ totalProperties: 3 });
      });

      it('selectSheetsMeta returns sheets from manifest', () => {
        const result = selectSheetsMeta(root);
        expect(result).toEqual(['Sheet1']);
      });
    });

    describe('selectActiveFiltersCount', () => {
      it('returns 0 when no filters active', () => {
        expect(selectActiveFiltersCount(root)).toBe(0);
      });

      it('counts active string filters', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, cluster: 'Amazonia', status: 'Completed' },
        });
        expect(selectActiveFiltersCount(filtered)).toBe(2);
      });

      it('does not count searchQuery or boolean flags', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, searchQuery: 'test', showMultiOwner: true },
        });
        expect(selectActiveFiltersCount(filtered)).toBe(0);
      });
    });

    describe('selectFilteredProperties', () => {
      it('returns all properties when no filters active', () => {
        const result = selectFilteredProperties(root);
        expect(result).toHaveLength(3);
      });

      it('filters by cluster', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, cluster: 'Amazonia' },
        });
        const result = selectFilteredProperties(filtered);
        expect(result).toHaveLength(2);
        expect(result.every((p) => p.cluster === 'Amazonia')).toBe(true);
      });

      it('filters by status', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, status: 'Completed' },
        });
        const result = selectFilteredProperties(filtered);
        expect(result).toHaveLength(2);
      });

      it('filters by search query (pNumber)', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, searchQuery: 'P-001' },
        });
        const result = selectFilteredProperties(filtered);
        expect(result).toHaveLength(1);
        expect(result[0].pNumber).toBe('P-001');
      });

      it('filters by search query (owner name)', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, searchQuery: 'john' },
        });
        const result = selectFilteredProperties(filtered);
        // P-001 and P-002 both have O-001 (John Smith) as owner
        expect(result).toHaveLength(2);
      });

      it('filters by showMultiOwner', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, showMultiOwner: true },
        });
        const result = selectFilteredProperties(filtered);
        expect(result).toHaveLength(1);
        expect(result[0].pNumber).toBe('P-001');
      });

      it('filters by showMultiPhone', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, showMultiPhone: true },
        });
        const result = selectFilteredProperties(filtered);
        // Only P-001 and P-002 have owners with multiple phones (O-001)
        expect(result.length).toBeGreaterThan(0);
        result.forEach((p) => {
          expect(p.owners?.some((oid) => oid === 'O-001')).toBe(true);
        });
      });

      it('filters by showMultiProperty', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, showMultiProperty: true },
        });
        const result = selectFilteredProperties(filtered);
        // Only P-001 and P-002 have owners with multiple properties (O-001)
        expect(result.length).toBeGreaterThan(0);
      });

      it('combines multiple filters (AND logic)', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, cluster: 'Amazonia', status: 'Completed' },
        });
        const result = selectFilteredProperties(filtered);
        expect(result).toHaveLength(2);
        result.forEach((p) => {
          expect(p.cluster).toBe('Amazonia');
          expect(p.status).toBe('Completed');
        });
      });

      it('returns empty when no match', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, searchQuery: 'zzzznonexistent' },
        });
        expect(selectFilteredProperties(filtered)).toEqual([]);
      });
    });

    describe('selectFilteredOwners', () => {
      it('returns all owners when no filters', () => {
        expect(selectFilteredOwners(root)).toHaveLength(2);
      });

      it('filters by search query', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, searchQuery: 'jane' },
        });
        const result = selectFilteredOwners(filtered);
        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('O-002');
      });

      it('filters by showMultiPhone', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, showMultiPhone: true },
        });
        expect(selectFilteredOwners(filtered)).toHaveLength(1);
      });

      it('filters by showMultiProperty', () => {
        const filtered = rootWith({
          ...baseState,
          filters: { ...baseState.filters, showMultiProperty: true },
        });
        expect(selectFilteredOwners(filtered)).toHaveLength(1);
      });
    });

    describe('factory selectors', () => {
      it('selectPropertyById returns property', () => {
        const result = selectPropertyById('P-001')(root);
        expect(result?.pNumber).toBe('P-001');
      });

      it('selectPropertyById returns undefined for missing id', () => {
        const result = selectPropertyById('MISSING')(root);
        expect(result).toBeUndefined();
      });

      it('selectOwnerById returns owner', () => {
        const result = selectOwnerById('O-001')(root);
        expect(result?.name).toBe('John Smith');
      });

      it('selectOwnersByPropertyId returns owners for property', () => {
        const result = selectOwnersByPropertyId('P-001')(root);
        expect(result).toHaveLength(2);
      });

      it('selectOwnersByPropertyId returns empty for unowned property', () => {
        const result = selectOwnersByPropertyId('P-003')(root);
        expect(result).toHaveLength(0);
      });

      it('selectPropertiesByOwnerId returns properties for owner', () => {
        const result = selectPropertiesByOwnerId('O-001')(root);
        expect(result).toHaveLength(2);
      });

      it('selectPropertiesByOwnerId returns empty for owner with no mappings', () => {
        const result = selectPropertiesByOwnerId('MISSING')(root);
        expect(result).toHaveLength(0);
      });
    });
  });
});
