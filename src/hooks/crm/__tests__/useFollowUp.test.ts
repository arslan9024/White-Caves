/**
 * useFollowUp — Unit tests
 * Pattern: Mock dispatch → verify thunk dispatch + state management
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFollowUp } from '../useFollowUp';

// ─── Mock dispatch ──────────────────────────────────────────────────────
const mockDispatch = vi.fn();
const mockUnwrap = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../../store/crmDataSlice', async () => {
  const actual = await vi.importActual('../../../store/crmDataSlice');
  return {
    ...actual,
    startFollowUpAPI: vi.fn((data) => ({ type: 'mock/startFollowUp', payload: data })),
    fetchLeadFollowUpsAPI: vi.fn((leadId) => ({ type: 'mock/fetchLeadFollowUps', payload: leadId })),
    pauseFollowUpAPI: vi.fn((id) => ({ type: 'mock/pauseFollowUp', payload: id })),
    resumeFollowUpAPI: vi.fn((id) => ({ type: 'mock/resumeFollowUp', payload: id })),
    cancelFollowUpAPI: vi.fn((data) => ({ type: 'mock/cancelFollowUp', payload: data })),
    fetchFollowUpStatsAPI: vi.fn(() => ({ type: 'mock/fetchFollowUpStats' })),
  };
});

// ─── Tests ──────────────────────────────────────────────────────────────
describe('useFollowUp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUnwrap.mockResolvedValue([]);
    mockDispatch.mockReturnValue({ unwrap: mockUnwrap });
  });

  // ────── Initial state ──────
  describe('initial state', () => {
    it('starts with empty sequences', () => {
      const { result } = renderHook(() => useFollowUp());
      expect(result.current.sequences).toEqual([]);
      expect(result.current.activeSequences).toEqual([]);
      expect(result.current.pausedSequences).toEqual([]);
      expect(result.current.completedSequences).toEqual([]);
    });

    it('starts with no loading or error', () => {
      const { result } = renderHook(() => useFollowUp());
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('starts with null stats', () => {
      const { result } = renderHook(() => useFollowUp());
      expect(result.current.stats).toBeNull();
    });
  });

  // ────── Actions ──────
  describe('startSequence', () => {
    it('dispatches startFollowUpAPI with leadId', async () => {
      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.startSequence('lead-1', 'hot');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/startFollowUp',
          payload: { leadId: 'lead-1', cadenceType: 'hot' },
        }),
      );
    });

    it('fetches sequences after starting', async () => {
      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.startSequence('lead-1');
      });

      // Should dispatch twice: startFollowUp + fetchLeadFollowUps
      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    it('sets error on failure', async () => {
      mockUnwrap.mockRejectedValueOnce('Start failed');
      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.startSequence('lead-1');
      });

      expect(result.current.error).toBe('Start failed');
    });
  });

  describe('fetchSequences', () => {
    it('dispatches fetchLeadFollowUpsAPI', async () => {
      const mockSeqs = [
        { id: 's1', cadenceType: 'hot', status: 'active', currentStep: 1, totalSteps: 4, startedAt: '2026-01-01', nextStepAt: null, completedAt: null, steps: [] },
        { id: 's2', cadenceType: 'warm', status: 'completed', currentStep: 4, totalSteps: 4, startedAt: '2025-12-01', nextStepAt: null, completedAt: '2025-12-15', steps: [] },
      ];
      mockUnwrap.mockResolvedValueOnce(mockSeqs);

      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.fetchSequences('lead-1');
      });

      expect(result.current.sequences).toHaveLength(2);
      expect(result.current.activeSequences).toHaveLength(1);
      expect(result.current.completedSequences).toHaveLength(1);
    });
  });

  describe('pauseSequence', () => {
    it('dispatches pauseFollowUpAPI', async () => {
      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.pauseSequence('seq-1');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/pauseFollowUp',
          payload: 'seq-1',
        }),
      );
    });
  });

  describe('resumeSequence', () => {
    it('dispatches resumeFollowUpAPI', async () => {
      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.resumeSequence('seq-1');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/resumeFollowUp',
          payload: 'seq-1',
        }),
      );
    });
  });

  describe('cancelSequence', () => {
    it('dispatches cancelFollowUpAPI with reason', async () => {
      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.cancelSequence('seq-1', 'Lead replied directly');
      });

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'mock/cancelFollowUp',
          payload: { sequenceId: 'seq-1', reason: 'Lead replied directly' },
        }),
      );
    });
  });

  describe('fetchStats', () => {
    it('sets stats data', async () => {
      const mockStats = {
        active: 5,
        paused: 2,
        completed: 10,
        cancelled: 1,
        totalStepsSent: 45,
        totalStepsFailed: 3,
      };
      mockUnwrap.mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => useFollowUp());

      await act(async () => {
        await result.current.fetchStats();
      });

      expect(result.current.stats).toEqual(mockStats);
    });
  });

  // ────── Handler exposure ──────
  describe('handler exposure', () => {
    it('exposes all expected functions', () => {
      const { result } = renderHook(() => useFollowUp());
      expect(typeof result.current.startSequence).toBe('function');
      expect(typeof result.current.fetchSequences).toBe('function');
      expect(typeof result.current.pauseSequence).toBe('function');
      expect(typeof result.current.resumeSequence).toBe('function');
      expect(typeof result.current.cancelSequence).toBe('function');
      expect(typeof result.current.fetchStats).toBe('function');
    });

    it('exposes all expected data properties', () => {
      const { result } = renderHook(() => useFollowUp());
      expect(result.current).toHaveProperty('sequences');
      expect(result.current).toHaveProperty('activeSequences');
      expect(result.current).toHaveProperty('pausedSequences');
      expect(result.current).toHaveProperty('completedSequences');
      expect(result.current).toHaveProperty('stats');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
    });
  });
});
