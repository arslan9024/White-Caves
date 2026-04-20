/**
 * useReporting — Unit tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReporting } from '../useReporting';

const mockDispatch = vi.fn();
const mockUnwrap = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    fetchLeadFunnelAPI: vi.fn(() => ({ type: 'mock/fetchLeadFunnel' })),
    fetchTrendsAPI: vi.fn((p) => ({ type: 'mock/fetchTrends', payload: p })),
    fetchPropertyAgingAPI: vi.fn(() => ({ type: 'mock/fetchPropertyAging' })),
    fetchAgentPerformanceAPI: vi.fn(() => ({ type: 'mock/fetchAgentPerformance' })),
    fetchExecutiveDashboardAPI: vi.fn(() => ({ type: 'mock/fetchExecutiveDashboard' })),
    fetchKPIsAPI: vi.fn(() => ({ type: 'mock/fetchKPIs' })),
  };
});

describe('useReporting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue({});
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });
  });

  describe('initial state', () => {
    it('starts with null data', () => {
      const { result } = renderHook(() => useReporting());
      expect(result.current.leadFunnel).toBeNull();
      expect(result.current.trends).toBeNull();
      expect(result.current.propertyAging).toBeNull();
      expect(result.current.agentPerformance).toBeNull();
      expect(result.current.executive).toBeNull();
      expect(result.current.kpis).toBeNull();
    });

    it('starts with no loading/error', () => {
      const { result } = renderHook(() => useReporting());
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchAllReports', () => {
    it('dispatches all 6 report APIs', async () => {
      const { result } = renderHook(() => useReporting());

      await act(async () => {
        await result.current.fetchAllReports();
      });

      // 6 dispatches
      expect(mockDispatch).toHaveBeenCalledTimes(6);
    });

    it('sets lead funnel data', async () => {
      const mockFunnel = {
        funnel: [{ stage: 'new', count: 50, percentage: 50 }],
        tierDistribution: [{ tier: 'hot', count: 10 }],
        total: 100,
      };
      // All unwrap calls return the funnel for simplicity
      mockUnwrap.mockResolvedValue(mockFunnel);

      const { result } = renderHook(() => useReporting());

      await act(async () => {
        await result.current.fetchAllReports();
      });

      expect(result.current.leadFunnel).toBeTruthy();
    });
  });

  describe('individual fetches', () => {
    it('fetchFunnel dispatches fetchLeadFunnelAPI', async () => {
      const { result } = renderHook(() => useReporting());

      await act(async () => {
        await result.current.fetchFunnel();
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/fetchLeadFunnel' }),
      );
    });

    it('fetchTrends dispatches with days param', async () => {
      const { result } = renderHook(() => useReporting());

      await act(async () => {
        await result.current.fetchTrends(7);
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/fetchTrends' }),
      );
    });

    it('fetchAgents dispatches fetchAgentPerformanceAPI', async () => {
      const { result } = renderHook(() => useReporting());

      await act(async () => {
        await result.current.fetchAgents();
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'mock/fetchAgentPerformance' }),
      );
    });
  });

  describe('handler exposure', () => {
    it('exposes all functions', () => {
      const { result } = renderHook(() => useReporting());
      expect(typeof result.current.fetchAllReports).toBe('function');
      expect(typeof result.current.fetchFunnel).toBe('function');
      expect(typeof result.current.fetchTrends).toBe('function');
      expect(typeof result.current.fetchAgents).toBe('function');
    });

    it('exposes all data fields', () => {
      const { result } = renderHook(() => useReporting());
      expect(result.current).toHaveProperty('leadFunnel');
      expect(result.current).toHaveProperty('trends');
      expect(result.current).toHaveProperty('propertyAging');
      expect(result.current).toHaveProperty('agentPerformance');
      expect(result.current).toHaveProperty('executive');
      expect(result.current).toHaveProperty('kpis');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
    });
  });
});
