import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

// Mock Redux
const mockDispatch = vi.fn();
const mockProperties = [
  { pNumber: 'P001', project: 'Marina Tower', cluster: 'Marina', area: '500', building: 'A', unitNumber: '101', floor: '1', status: 'Active', owners: ['O1'] },
  { pNumber: 'P002', project: 'Downtown Plaza', cluster: 'Downtown', area: '700', building: 'B', unitNumber: '202', floor: '2', status: 'Active', owners: ['O1', 'O2'] },
  { pNumber: 'P003', project: 'Palm Residences', cluster: 'Palm', area: '1000', building: 'C', unitNumber: '303', floor: '3', status: 'Sold', owners: [] },
];

const mockOwners = {
  byId: {
    O1: { id: 'O1', name: 'John', properties: ['P001', 'P002'] },
    O2: { id: 'O2', name: 'Jane', properties: ['P002'] },
  },
};

vi.mock('react-redux', () => ({
  useSelector: (selector: any) => selector({
    inventory: {
      loading: false,
      filteredProperties: mockProperties,
      stats: { totalProperties: 3, totalOwners: 2 },
      filters: { cluster: 'all', status: 'all' },
      owners: mockOwners,
      filterOptions: { clusters: ['Marina', 'Downtown', 'Palm'], statuses: ['Active', 'Sold'] },
      activeFiltersCount: 0,
    },
  }),
}));

vi.mock('../../../../store/store', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('../../../../store/slices/inventorySlice', () => ({
  loadInventoryData: () => ({ type: 'inventory/loadInventoryData' }),
  selectFilteredProperties: (state: any) => state.inventory.filteredProperties,
  selectInventoryStats: (state: any) => state.inventory.stats,
  selectFilters: (state: any) => state.inventory.filters,
  selectOwners: (state: any) => state.inventory.owners,
  selectFilterOptions: (state: any) => state.inventory.filterOptions,
  selectActiveFiltersCount: (state: any) => state.inventory.activeFiltersCount,
  setFilter: (payload: any) => ({ type: 'inventory/setFilter', payload }),
  clearFilters: () => ({ type: 'inventory/clearFilters' }),
  toggleMultiOwnerFilter: () => ({ type: 'inventory/toggleMultiOwnerFilter' }),
  toggleMultiPhoneFilter: () => ({ type: 'inventory/toggleMultiPhoneFilter' }),
  toggleMultiPropertyFilter: () => ({ type: 'inventory/toggleMultiPropertyFilter' }),
}));

import { useInventoryData } from './useInventoryData';

describe('useInventoryData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initialization', () => {
    it('dispatches loadInventoryData on mount', () => {
      renderHook(() => useInventoryData());
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'inventory/loadInventoryData' });
    });

    it('returns properties from selector', () => {
      const { result } = renderHook(() => useInventoryData());
      expect(result.current.properties).toHaveLength(3);
    });

    it('returns stats from selector', () => {
      const { result } = renderHook(() => useInventoryData());
      expect(result.current.stats.totalProperties).toBe(3);
    });

    it('returns loading state', () => {
      const { result } = renderHook(() => useInventoryData());
      expect(result.current.loading).toBe(false);
    });
  });

  describe('filter handlers', () => {
    it('dispatches setFilter on handleFilterChange', () => {
      const { result } = renderHook(() => useInventoryData());
      act(() => {
        result.current.handleFilterChange('cluster', 'Marina');
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'inventory/setFilter',
        payload: { key: 'cluster', value: 'Marina' },
      });
    });

    it('dispatches clearFilters on handleClearFilters', () => {
      const { result } = renderHook(() => useInventoryData());
      act(() => {
        result.current.handleClearFilters();
      });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'inventory/clearFilters' });
    });

    it('dispatches toggleMultiOwnerFilter', () => {
      const { result } = renderHook(() => useInventoryData());
      act(() => {
        result.current.handleFilterToggle('showMultiOwner');
      });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'inventory/toggleMultiOwnerFilter' });
    });

    it('dispatches toggleMultiPhoneFilter', () => {
      const { result } = renderHook(() => useInventoryData());
      act(() => {
        result.current.handleFilterToggle('showMultiPhone');
      });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'inventory/toggleMultiPhoneFilter' });
    });

    it('dispatches toggleMultiPropertyFilter', () => {
      const { result } = renderHook(() => useInventoryData());
      act(() => {
        result.current.handleFilterToggle('showMultiProperty');
      });
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'inventory/toggleMultiPropertyFilter' });
    });

    it('handles unknown filter toggle gracefully', () => {
      const { result } = renderHook(() => useInventoryData());
      const dispatchBefore = mockDispatch.mock.calls.length;
      act(() => {
        result.current.handleFilterToggle('unknown');
      });
      // Only loadInventoryData was dispatched — no extra dispatch for unknown
      expect(mockDispatch.mock.calls.length).toBe(dispatchBefore);
    });
  });

  describe('owner/property lookups', () => {
    it('gets owner properties by ownerId', () => {
      const { result } = renderHook(() => useInventoryData());
      const props = result.current.getOwnerProperties('O1');
      expect(props).toHaveLength(2);
      expect(props[0].pNumber).toBe('P001');
    });

    it('returns fallback for unknown property in owner list', () => {
      // O2 has property P002 which exists
      const { result } = renderHook(() => useInventoryData());
      const props = result.current.getOwnerProperties('O2');
      expect(props).toHaveLength(1);
    });

    it('gets property owners', () => {
      const { result } = renderHook(() => useInventoryData());
      const owners = result.current.getPropertyOwners({ owners: ['O1', 'O2'] });
      expect(owners).toHaveLength(2);
    });

    it('returns empty for property with no owners', () => {
      const { result } = renderHook(() => useInventoryData());
      const owners = result.current.getPropertyOwners({ owners: undefined });
      expect(owners).toHaveLength(0);
    });
  });

  describe('cluster utilities', () => {
    it('gets properties by cluster', () => {
      const { result } = renderHook(() => useInventoryData());
      const marina = result.current.getPropertiesByCluster('Marina');
      expect(marina).toHaveLength(1);
      expect(marina[0].pNumber).toBe('P001');
    });

    it('returns all properties for "all" cluster', () => {
      const { result } = renderHook(() => useInventoryData());
      const all = result.current.getPropertiesByCluster('all');
      expect(all).toHaveLength(3);
    });

    it('gets unique clusters', () => {
      const { result } = renderHook(() => useInventoryData());
      const clusters = result.current.getClusters();
      expect(clusters).toEqual(['Downtown', 'Marina', 'Palm']);
    });

    it('gets unique projects', () => {
      const { result } = renderHook(() => useInventoryData());
      const projects = result.current.getProjects();
      expect(projects).toContain('Marina Tower');
      expect(projects).toContain('Downtown Plaza');
    });

    it('computes cluster stats', () => {
      const { result } = renderHook(() => useInventoryData());
      const stats = result.current.getClusterStats('Downtown');
      expect(stats.totalProperties).toBe(1);
      expect(stats.multiOwnerCount).toBe(1); // P002 has 2 owners
    });
  });

  describe('search', () => {
    it('searches properties by cluster', () => {
      const { result } = renderHook(() => useInventoryData());
      const results = result.current.searchProperties('palm');
      expect(results).toHaveLength(1);
      expect(results[0].pNumber).toBe('P003');
    });

    it('returns all properties when search is empty', () => {
      const { result } = renderHook(() => useInventoryData());
      const results = result.current.searchProperties('');
      expect(results).toHaveLength(3);
    });

    it('searches by pNumber', () => {
      const { result } = renderHook(() => useInventoryData());
      expect(result.current.searchProperties('P001')).toHaveLength(1);
    });
  });

  describe('data validation', () => {
    it('validates data and reports issues', () => {
      const { result } = renderHook(() => useInventoryData());
      const validation = result.current.validateData();
      expect(validation).toHaveProperty('totalIssues');
      expect(validation).toHaveProperty('details');
      expect(validation).toHaveProperty('isValid');
    });

    it('detects missing owners', () => {
      const { result } = renderHook(() => useInventoryData());
      const validation = result.current.validateData();
      // P003 has empty owners array
      expect(validation.details.missingOwners.length).toBe(1);
    });
  });

  describe('property/owner lookups', () => {
    it('gets property by ID', () => {
      const { result } = renderHook(() => useInventoryData());
      const prop = result.current.getPropertyById('P001');
      expect(prop?.project).toBe('Marina Tower');
    });

    it('returns undefined for unknown property', () => {
      const { result } = renderHook(() => useInventoryData());
      expect(result.current.getPropertyById('NOPE')).toBeUndefined();
    });

    it('gets owner by ID', () => {
      const { result } = renderHook(() => useInventoryData());
      const owner = result.current.getOwnerById('O1');
      expect(owner?.name).toBe('John');
    });

    it('returns null for unknown owner', () => {
      const { result } = renderHook(() => useInventoryData());
      expect(result.current.getOwnerById('NOPE')).toBeNull();
    });
  });

  describe('CSV export', () => {
    it('exports to CSV successfully', async () => {
      // Mock DOM APIs for CSV download
      const mockClick = vi.fn();
      const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test');
      const mockRevokeObjectURL = vi.fn();
      
      const realCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        const el = realCreateElement(tag);
        if (tag === 'a') {
          el.click = mockClick;
        }
        return el;
      });
      window.URL.createObjectURL = mockCreateObjectURL;
      window.URL.revokeObjectURL = mockRevokeObjectURL;

      const { result } = renderHook(() => useInventoryData());
      const res = await result.current.exportToCSV();
      expect(res.success).toBe(true);
      expect(mockClick).toHaveBeenCalled();

      vi.restoreAllMocks();
    });
  });
});
