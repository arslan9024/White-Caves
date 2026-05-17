/**
 * useScheduling Hook Tests — Phase 3C
 * ────────────────────────────────────
 * Tests for scheduling hook: slots, availability, ICS download.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScheduling } from '../useScheduling';

// Mock redux dispatch
const mockUnwrap = vi.fn();
const mockDispatch = vi.fn(() => ({ unwrap: mockUnwrap }));
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

// Mock thunks
vi.mock('../../../store/crmDataSlice', () => ({
  fetchAvailableSlotsAPI: vi.fn((args: unknown) => ({ type: 'fetchSlots', payload: args })),
  fetchAgentAvailabilityAPI: vi.fn((args: unknown) => ({ type: 'fetchAvailability', payload: args })),
  setAgentAvailabilityAPI: vi.fn((args: unknown) => ({ type: 'setAvailability', payload: args })),
  downloadViewingICSAPI: vi.fn((args: unknown) => ({ type: 'downloadICS', payload: args })),
}));

describe('useScheduling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null state', () => {
    const { result } = renderHook(() => useScheduling());
    expect(result.current.slots).toBeNull();
    expect(result.current.availability).toBeNull();
    expect(result.current.availableSlots).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should expose all action handlers', () => {
    const { result } = renderHook(() => useScheduling());
    expect(typeof result.current.fetchSlots).toBe('function');
    expect(typeof result.current.fetchAvailability).toBe('function');
    expect(typeof result.current.setDayAvailability).toBe('function');
    expect(typeof result.current.downloadICS).toBe('function');
  });

  describe('fetchSlots', () => {
    it('should fetch slots and update state', async () => {
      const mockSlots = {
        agentId: 'agent-1',
        agentName: 'Agent Smith',
        date: '2026-05-03',
        totalSlots: 16,
        availableSlots: 12,
        slots: [
          { start: '2026-05-03T09:00', end: '2026-05-03T09:30', available: true },
          { start: '2026-05-03T09:30', end: '2026-05-03T10:00', available: false, reason: 'booked' },
        ],
      };
      mockUnwrap.mockResolvedValue(mockSlots);

      const { result } = renderHook(() => useScheduling());

      await act(async () => {
        await result.current.fetchSlots('agent-1', '2026-05-03');
      });

      expect(result.current.slots).toEqual(mockSlots);
      expect(result.current.availableSlots).toHaveLength(1);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch slots error', async () => {
      mockUnwrap.mockRejectedValue('No slots available');

      const { result } = renderHook(() => useScheduling());

      await act(async () => {
        await result.current.fetchSlots('agent-1', '2026-05-03');
      });

      expect(result.current.slots).toBeNull();
      expect(result.current.error).toBe('No slots available');
    });
  });

  describe('fetchAvailability', () => {
    it('should fetch agent availability', async () => {
      const mockAvailability = {
        agentId: 'agent-1',
        agentName: 'Agent Smith',
        schedule: [
          { dayOfWeek: 0, startTime: '09:00', endTime: '18:00', isActive: true, slotDuration: 30 },
        ],
      };
      mockUnwrap.mockResolvedValue(mockAvailability);

      const { result } = renderHook(() => useScheduling());

      await act(async () => {
        await result.current.fetchAvailability('agent-1');
      });

      expect(result.current.availability).toEqual(mockAvailability);
    });
  });

  describe('setDayAvailability', () => {
    it('should set availability for a day', async () => {
      const mockResult = { dayOfWeek: 1, startTime: '10:00', endTime: '16:00', isActive: true };
      mockUnwrap.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useScheduling());

      let outcome;
      await act(async () => {
        outcome = await result.current.setDayAvailability({
          dayOfWeek: 1,
          startTime: '10:00',
          endTime: '16:00',
        });
      });

      expect(outcome).toEqual(mockResult);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  describe('downloadICS', () => {
    it('should download ICS file successfully', async () => {
      mockUnwrap.mockResolvedValue('BEGIN:VCALENDAR...');

      const { result } = renderHook(() => useScheduling());

      let success;
      await act(async () => {
        success = await result.current.downloadICS('viewing-123');
      });

      expect(success).toBe(true);
    });

    it('should handle download error', async () => {
      mockUnwrap.mockRejectedValue('Download failed');

      const { result } = renderHook(() => useScheduling());

      let success;
      await act(async () => {
        success = await result.current.downloadICS('viewing-123');
      });

      expect(success).toBe(false);
      expect(result.current.error).toBe('Download failed');
    });
  });
});
