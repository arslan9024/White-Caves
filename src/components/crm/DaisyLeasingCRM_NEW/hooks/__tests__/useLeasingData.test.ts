import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock the data imports
vi.mock('../../data/leasing', () => ({
  ACTIVE_LEASES: [
    { id: 1, unit: 'Villa 101', tenant: 'John Smith', rent: 5000, status: 'active' },
    { id: 2, unit: 'Apt 202', tenant: 'Jane Doe', rent: 3000, status: 'active' },
    { id: 3, unit: 'Villa 303', tenant: 'Bob Wilson', rent: 7000, status: 'expired' },
    { id: 4, unit: 'Apt 404', tenant: 'Alice Brown', rent: 4000, status: 'pending' },
  ],
  MAINTENANCE_REQUESTS: [
    { id: 'm1', unit: 'Villa 101', type: 'plumbing', status: 'open' },
  ],
  RENTAL_INQUIRIES: [
    { id: 'r1', property: 'Villa 101', name: 'Prospect A' },
  ],
}));

vi.mock('../../data/features', () => ({
  DAISY_LEASING_FEATURES: ['Lease Management', 'Tenant Portal'],
}));

import { useLeasingData } from '../useLeasingData';

describe('useLeasingData', () => {
  describe('initial state', () => {
    it('should return default tab as leases', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.activeTab).toBe('leases');
    });

    it('should return null selectedProperty', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.selectedProperty).toBeNull();
    });

    it('should return empty search query and all filter status', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.searchQuery).toBe('');
      expect(result.current.filterStatus).toBe('all');
    });

    it('should expose 4 leases', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.leases).toHaveLength(4);
    });
  });

  describe('state setters', () => {
    it('should update active tab', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => result.current.setActiveTab('maintenance'));
      expect(result.current.activeTab).toBe('maintenance');
    });

    it('should update selected property', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => result.current.handleSelectProperty(42));
      expect(result.current.selectedProperty).toBe(42);
    });
  });

  describe('getLeasesByStatus', () => {
    it('should filter active leases', () => {
      const { result } = renderHook(() => useLeasingData());
      const active = result.current.getLeasesByStatus('active');
      expect(active).toHaveLength(2);
    });

    it('should filter expired leases', () => {
      const { result } = renderHook(() => useLeasingData());
      const expired = result.current.getLeasesByStatus('expired');
      expect(expired).toHaveLength(1);
    });

    it('should return empty for non-existent status', () => {
      const { result } = renderHook(() => useLeasingData());
      const none = result.current.getLeasesByStatus('cancelled');
      expect(none).toHaveLength(0);
    });
  });

  describe('getTotalAnnualRent', () => {
    it('should compute total annual rent (rent * 12) for all leases', () => {
      const { result } = renderHook(() => useLeasingData());
      // (5000 + 3000 + 7000 + 4000) * 12 = 228000
      expect(result.current.getTotalAnnualRent()).toBe(228000);
    });
  });

  describe('getOccupancyRate', () => {
    it('should compute occupancy rate as percentage string', () => {
      const { result } = renderHook(() => useLeasingData());
      // 2 active / 4 total = 50.0%
      expect(result.current.getOccupancyRate()).toBe('50.0');
    });
  });

  describe('getActiveTenants', () => {
    it('should count active tenants', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.getActiveTenants()).toBe(2);
    });
  });

  describe('filteredLeases', () => {
    it('should return all leases with no filters', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.filteredLeases).toHaveLength(4);
    });

    it('should filter by search query (unit)', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => result.current.setSearchQuery('Villa'));
      expect(result.current.filteredLeases).toHaveLength(2);
    });

    it('should filter by search query (tenant name)', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => result.current.setSearchQuery('John'));
      expect(result.current.filteredLeases).toHaveLength(1);
      expect(result.current.filteredLeases[0].tenant).toBe('John Smith');
    });

    it('should filter by status', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => result.current.setFilterStatus('active'));
      expect(result.current.filteredLeases).toHaveLength(2);
    });

    it('should combine search and status filters', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => {
        result.current.setSearchQuery('Villa');
        result.current.setFilterStatus('active');
      });
      // Only Villa 101 is active
      expect(result.current.filteredLeases).toHaveLength(1);
      expect(result.current.filteredLeases[0].unit).toBe('Villa 101');
    });

    it('should be case-insensitive search', () => {
      const { result } = renderHook(() => useLeasingData());
      act(() => result.current.setSearchQuery('villa'));
      expect(result.current.filteredLeases).toHaveLength(2);
    });
  });

  describe('exposed data', () => {
    it('should expose features', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.features).toEqual(['Lease Management', 'Tenant Portal']);
    });

    it('should expose inquiries', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.inquiries).toHaveLength(1);
    });

    it('should expose maintenance', () => {
      const { result } = renderHook(() => useLeasingData());
      expect(result.current.maintenance).toHaveLength(1);
    });
  });
});
