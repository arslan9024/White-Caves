/**
 * useScheduling Hook — Phase 3C
 * ──────────────────────────────
 * Frontend hook for calendar/scheduling features:
 * - Fetch available time slots for an agent
 * - Get/set agent availability schedules
 * - Download .ics calendar files
 *
 * @module useScheduling
 */

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  fetchAvailableSlotsAPI,
  fetchAgentAvailabilityAPI,
  setAgentAvailabilityAPI,
  downloadViewingICSAPI,
} from '../../store/crmDataSlice';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  reason?: string;
}

interface AgentSchedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  slotDuration: number;
  breakStart?: string;
  breakEnd?: string;
}

interface SlotsData {
  agentId: string;
  agentName: string;
  date: string;
  totalSlots: number;
  availableSlots: number;
  slots: TimeSlot[];
}

interface AvailabilityData {
  agentId: string;
  agentName: string;
  schedule: AgentSchedule[];
}

export function useScheduling() {
  const dispatch = useDispatch<AppDispatch>();
  const [slots, setSlots] = useState<SlotsData | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch available time slots for an agent on a specific date.
   */
  const fetchSlots = useCallback(
    async (agentId: string, date: string, duration?: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(
          fetchAvailableSlotsAPI({ agentId, date, duration }),
        ).unwrap();
        setSlots(result);
        return result;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to fetch slots';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Fetch an agent's weekly availability schedule.
   */
  const fetchAvailability = useCallback(
    async (agentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(
          fetchAgentAvailabilityAPI(agentId),
        ).unwrap();
        setAvailability(result);
        return result;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to fetch availability';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Set the current user's availability for a specific day of the week.
   */
  const setDayAvailability = useCallback(
    async (data: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isActive?: boolean;
      slotDuration?: number;
      breakStart?: string;
      breakEnd?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(setAgentAvailabilityAPI(data)).unwrap();
        return result;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to update availability';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Download .ics calendar file for a viewing.
   */
  const downloadICS = useCallback(
    async (viewingId: string, token?: string) => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(
          downloadViewingICSAPI({ viewingId, token }),
        ).unwrap();
        return true;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to download calendar file';
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Get only available slots from the current slots data.
   */
  const availableSlots = slots?.slots.filter((s) => s.available) || [];

  return {
    // State
    slots,
    availability,
    availableSlots,
    loading,
    error,

    // Actions
    fetchSlots,
    fetchAvailability,
    setDayAvailability,
    downloadICS,
  };
}
