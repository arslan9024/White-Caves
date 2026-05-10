import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock authFetch to return fake API data matching test expectations
const MOCK_LEASES = [
  {
    id: '1',
    monthlyRent: 5000,
    status: 'active',
    tenant: { name: 'John Smith' },
    property: { title: 'Villa 101' },
  },
  {
    id: '2',
    monthlyRent: 3000,
    status: 'active',
    tenant: { name: 'Jane Doe' },
    property: { title: 'Apt 202' },
  },
  {
    id: '3',
    monthlyRent: 7000,
    status: 'expired',
    tenant: { name: 'Bob Wilson' },
    property: { title: 'Villa 303' },
  },
  {
    id: '4',
    monthlyRent: 4000,
    status: 'renewed',
    tenant: { name: 'Alice Brown' },
    property: { title: 'Apt 404' },
  },
];

const MOCK_MAINTENANCE = [
  {
    id: 'm1',
    title: 'Plumbing issue',
    category: 'plumbing',
    status: 'open',
    property: { title: 'Villa 101' },
    requester: { name: 'John Smith' },
  },
];

vi.mock('../../../../../utils/authFetch', () => ({
  authFetch: vi.fn().mockImplementation((url: string) => {
    if (url.startsWith('/api/leases')) {
      return Promise.resolve({ json: () => Promise.resolve({ data: MOCK_LEASES }) });
    }
    if (url.startsWith('/api/maintenance')) {
      return Promise.resolve({ json: () => Promise.resolve({ data: MOCK_MAINTENANCE }) });
    }
    return Promise.resolve({ json: () => Promise.resolve({ data: [] }) });
  }),
}));

// Mock the data imports (still needed for RENTAL_INQUIRIES and types)
vi.mock('../../data/leasing', () => ({
  RENTAL_INQUIRIES: [{ id: 'r1', property: 'Villa 101', name: 'Prospect A' }],
  ActiveLease: {},
  MaintenanceRequest: {},
  PDCCheque: {},
  PDCStatus: {},
  LeaseStatus: {},
  MaintenanceStatus: {},
  LeasingStage: {},
  LEASING_STAGE_LABELS: {},
}));

vi.mock('../../data/leasingExtended', () => ({
  RENEWAL_RECORDS: [],
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

    it('should expose 4 leases after loading', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
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
    it('should filter active leases', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      const active = result.current.getLeasesByStatus('active');
      expect(active).toHaveLength(2);
    });

    it('should filter expired leases', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      const expired = result.current.getLeasesByStatus('expired');
      expect(expired).toHaveLength(1);
    });

    it('should return empty for non-existent status', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      const none = result.current.getLeasesByStatus('cancelled');
      expect(none).toHaveLength(0);
    });
  });

  describe('getTotalAnnualRent', () => {
    it('should compute total annual rent (rent * 12) for all leases', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      // (5000 + 3000 + 7000 + 4000) * 12 = 228000
      expect(result.current.getTotalAnnualRent()).toBe(228000);
    });
  });

  describe('getOccupancyRate', () => {
    it('should compute occupancy rate as percentage string', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      // 2 active / 4 total = 50.0%
      expect(result.current.getOccupancyRate()).toBe('50.0');
    });
  });

  describe('getActiveTenants', () => {
    it('should count active tenants', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      expect(result.current.getActiveTenants()).toBe(2);
    });
  });

  describe('filteredLeases', () => {
    it('should return all leases with no filters', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.filteredLeases).toHaveLength(4));
    });

    it('should filter by search query (unit)', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      act(() => result.current.setSearchQuery('Villa'));
      expect(result.current.filteredLeases).toHaveLength(2);
    });

    it('should filter by search query (tenant name)', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      act(() => result.current.setSearchQuery('John'));
      expect(result.current.filteredLeases).toHaveLength(1);
      expect(result.current.filteredLeases[0].tenant).toBe('John Smith');
    });

    it('should filter by status', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      act(() => result.current.setFilterStatus('active'));
      expect(result.current.filteredLeases).toHaveLength(2);
    });

    it('should combine search and status filters', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
      act(() => {
        result.current.setSearchQuery('Villa');
        result.current.setFilterStatus('active');
      });
      // Only Villa 101 is active
      expect(result.current.filteredLeases).toHaveLength(1);
      expect(result.current.filteredLeases[0].unit).toBe('Villa 101');
    });

    it('should be case-insensitive search', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.leases).toHaveLength(4));
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

    it('should expose maintenance after loading', async () => {
      const { result } = renderHook(() => useLeasingData());
      await waitFor(() => expect(result.current.maintenance).toHaveLength(1));
    });
  });
});
