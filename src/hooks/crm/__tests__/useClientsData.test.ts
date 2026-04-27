/**
 * @file useClientsData.test.ts
 * @description Tests for useClientsData hook — Phase 1C Client/Owner Management
 * Tests: data loading, category filtering, CRUD dispatch, stats computation
 */

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// ── Mock Data ──
const MOCK_CLIENTS = [
  { id: 'c1', name: 'Ahmed Al Rashid', email: 'ahmed@test.com', category: 'buyer', status: 'active', type: 'individual', totalValue: 500000, dealsCount: 3 },
  { id: 'c2', name: 'Sara Hassan', email: 'sara@test.com', category: 'seller', status: 'active', type: 'individual', totalValue: 1200000, dealsCount: 5 },
  { id: 'c3', name: 'Gulf Investments', email: 'info@gulf.ae', category: 'investor', status: 'active', type: 'corporate', totalValue: 8000000, dealsCount: 12 },
  { id: 'c4', name: 'Omar Khalid', email: 'omar@test.com', category: 'landlord', status: 'active', type: 'individual', totalValue: 3000000, dealsCount: 8 },
  { id: 'c5', name: 'Fatima Ali', email: 'fatima@test.com', category: 'tenant', status: 'inactive', type: 'individual', totalValue: 0, dealsCount: 1 },
  { id: 'c6', name: 'Reem Properties', email: 'reem@prop.ae', category: 'buyer', status: 'active', type: 'corporate', totalValue: 2500000, dealsCount: 4 },
];

// Mock Redux state that real selectors will execute against
const mockState = {
  crmData: {
    leads: { items: [], loading: false, error: null, selected: null },
    clients: { items: MOCK_CLIENTS, loading: false, error: null, selected: null },
    agents: { items: [], loading: false, error: null, selected: null },
    properties: { items: [], loading: false, error: null, selected: null },
    commissions: { items: [], loading: false, error: null },
    invoices: { items: [], loading: false, error: null },
    expenses: { items: [], loading: false, error: null },
    activities: { items: [] },
    overview: {},
    lastUpdated: null,
  },
};

const mockDispatch = vi.fn((action) => {
  if (action && typeof action.then === 'function') return action;
  return Promise.resolve({ meta: { requestStatus: 'rejected' }, payload: null });
});

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => {
    try {
      return selector(mockState);
    } catch {
      return undefined;
    }
  },
}));

// Mock thunks
vi.mock('../../../store/crmDataSlice', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../../store/crmDataSlice')>();
  return {
    ...original,
    fetchClientsFromAPI: vi.fn((params: any) => ({ type: 'mock/fetchClients', payload: params })),
    createClientAPI: vi.fn((data: any) => ({ type: 'mock/createClient', payload: data })),
    updateClientAPI: vi.fn((data: any) => ({ type: 'mock/updateClient', payload: data })),
    deleteClientAPI: vi.fn((id: any) => ({ type: 'mock/deleteClient', payload: id })),
    linkClientPropertyAPI: vi.fn((data: any) => ({ type: 'mock/linkProperty', payload: data })),
    unlinkClientPropertyAPI: vi.fn((data: any) => ({ type: 'mock/unlinkProperty', payload: data })),
    fetchClientCommunicationsAPI: vi.fn((data: any) => ({ type: 'mock/fetchComms', payload: data })),
    createClientCommunicationAPI: vi.fn((data: any) => ({ type: 'mock/createComm', payload: data })),
    convertLeadToClientAPI: vi.fn((data: any) => ({ type: 'mock/convertLead', payload: data })),
  };
});

vi.mock('../../../store/store', () => ({
  AppDispatch: undefined,
}));

import { useClientsData } from '../useClientsData';

describe('useClientsData', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Data Loading ──
  describe('Data Loading', () => {
    it('returns all clients from Redux', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.clients).toHaveLength(6);
    });

    it('dispatches fetchClientsFromAPI on mount', () => {
      renderHook(() => useClientsData());
      const fetchCalls = mockDispatch.mock.calls.filter(
        ([a]: any[]) => a?.type === 'mock/fetchClients'
      );
      expect(fetchCalls.length).toBeGreaterThanOrEqual(1);
    });

    it('does not auto-fetch when autoFetch is false', () => {
      renderHook(() => useClientsData({ autoFetch: false }));
      const fetchCalls = mockDispatch.mock.calls.filter(
        ([a]: any[]) => a?.type === 'mock/fetchClients'
      );
      expect(fetchCalls).toHaveLength(0);
    });

    it('returns loading state', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.loading).toBe(false);
    });

    it('returns error state', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.error).toBeNull();
    });
  });

  // ── Category Filtering ──
  describe('Category Filtering', () => {
    it('filters buyers', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.buyers).toHaveLength(2);
      expect(result.current.buyers.every((c: any) => c.category === 'buyer')).toBe(true);
    });

    it('filters sellers', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.sellers).toHaveLength(1);
    });

    it('filters landlords', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.landlords).toHaveLength(1);
    });

    it('filters tenants', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.tenants).toHaveLength(1);
    });

    it('filters investors', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.investors).toHaveLength(1);
    });

    it('filters active clients', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.activeClients).toHaveLength(5); // Fatima is inactive
    });
  });

  // ── Client Stats ──
  describe('clientStats', () => {
    it('computes totalClients', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.clientStats.totalClients).toBe(6);
    });

    it('computes activeCount', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.clientStats.activeCount).toBe(5);
    });

    it('computes category counts', () => {
      const { result } = renderHook(() => useClientsData());
      expect(result.current.clientStats.buyerCount).toBe(2);
      expect(result.current.clientStats.sellerCount).toBe(1);
      expect(result.current.clientStats.landlordCount).toBe(1);
      expect(result.current.clientStats.tenantCount).toBe(1);
      expect(result.current.clientStats.investorCount).toBe(1);
    });

    it('computes totalValue', () => {
      const { result } = renderHook(() => useClientsData());
      // 500000 + 1200000 + 8000000 + 3000000 + 0 + 2500000 = 15200000
      expect(result.current.clientStats.totalValue).toBe(15200000);
    });

    it('computes totalDeals', () => {
      const { result } = renderHook(() => useClientsData());
      // 3 + 5 + 12 + 8 + 1 + 4 = 33
      expect(result.current.clientStats.totalDeals).toBe(33);
    });
  });

  // ── CRUD Operations ──
  describe('CRUD Operations', () => {
    it('dispatches createClient', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleCreateClient({ name: 'New Client', category: 'buyer' });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/createClient');
      expect(calls).toHaveLength(1);
      expect(calls[0][0].payload).toEqual({ name: 'New Client', category: 'buyer' });
    });

    it('dispatches updateClient', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleUpdateClient({ id: 'c1', name: 'Updated Name' });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/updateClient');
      expect(calls).toHaveLength(1);
      expect(calls[0][0].payload).toEqual({ id: 'c1', name: 'Updated Name' });
    });

    it('dispatches deleteClient', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleDeleteClient('c1');
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/deleteClient');
      expect(calls).toHaveLength(1);
      expect(calls[0][0].payload).toBe('c1');
    });
  });

  // ── Property Linking ──
  describe('Property Linking', () => {
    it('dispatches linkProperty', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleLinkProperty({ clientId: 'c1', propertyId: 'p1', relationship: 'buyer' });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/linkProperty');
      expect(calls).toHaveLength(1);
      expect(calls[0][0].payload).toEqual({ clientId: 'c1', propertyId: 'p1', relationship: 'buyer' });
    });

    it('dispatches unlinkProperty', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleUnlinkProperty({ clientId: 'c1', propertyId: 'p1' });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/unlinkProperty');
      expect(calls).toHaveLength(1);
    });
  });

  // ── Communication Logs ──
  describe('Communication Logs', () => {
    it('dispatches fetchCommunications', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleFetchCommunications({ clientId: 'c1' });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/fetchComms');
      expect(calls).toHaveLength(1);
    });

    it('dispatches logCommunication', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleLogCommunication({
          clientId: 'c1',
          type: 'call',
          direction: 'outbound',
          subject: 'Follow up on Villa 348',
          outcome: 'interested',
          duration: 180,
        });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/createComm');
      expect(calls).toHaveLength(1);
      expect(calls[0][0].payload.type).toBe('call');
      expect(calls[0][0].payload.duration).toBe(180);
    });
  });

  // ── Lead Conversion ──
  describe('Lead Conversion', () => {
    it('dispatches convertLead', () => {
      const { result } = renderHook(() => useClientsData());
      act(() => {
        result.current.handleConvertLead({ leadId: 'lead-1', category: 'buyer' });
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/convertLead');
      expect(calls).toHaveLength(1);
      expect(calls[0][0].payload).toEqual({ leadId: 'lead-1', category: 'buyer' });
    });
  });

  // ── Refresh ──
  describe('handleRefresh', () => {
    it('dispatches fetchClients on refresh', () => {
      const { result } = renderHook(() => useClientsData());
      mockDispatch.mockClear();
      act(() => {
        result.current.handleRefresh();
      });
      const calls = mockDispatch.mock.calls.filter(([a]: any[]) => a?.type === 'mock/fetchClients');
      expect(calls).toHaveLength(1);
    });
  });

  // ── Handler types ──
  describe('Exposed handlers', () => {
    it('exposes all required functions', () => {
      const { result } = renderHook(() => useClientsData());
      expect(typeof result.current.handleCreateClient).toBe('function');
      expect(typeof result.current.handleUpdateClient).toBe('function');
      expect(typeof result.current.handleDeleteClient).toBe('function');
      expect(typeof result.current.handleLinkProperty).toBe('function');
      expect(typeof result.current.handleUnlinkProperty).toBe('function');
      expect(typeof result.current.handleFetchCommunications).toBe('function');
      expect(typeof result.current.handleLogCommunication).toBe('function');
      expect(typeof result.current.handleConvertLead).toBe('function');
      expect(typeof result.current.handleRefresh).toBe('function');
    });
  });
});
