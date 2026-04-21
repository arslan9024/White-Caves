/**
 * useFollowUp — Data hook for automated follow-up sequences
 *
 * Provides:
 *   - Actions: start, pause, resume, cancel sequences
 *   - Data: lead sequences, stats
 *   - State: loading, error
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  startFollowUpAPI,
  fetchLeadFollowUpsAPI,
  pauseFollowUpAPI,
  resumeFollowUpAPI,
  cancelFollowUpAPI,
  fetchFollowUpStatsAPI,
} from '../../store/crmDataSlice';

interface FollowUpSequence {
  id: string;
  cadenceType: string;
  status: string;
  currentStep: number;
  totalSteps: number;
  startedAt: string;
  nextStepAt: string | null;
  completedAt: string | null;
  steps: Array<{
    stepNumber: number;
    channel: string;
    status: string;
    scheduledAt: string | null;
    executedAt: string | null;
    result: string | null;
  }>;
}

interface FollowUpStats {
  active: number;
  paused: number;
  completed: number;
  cancelled: number;
  totalStepsSent: number;
  totalStepsFailed: number;
}

export function useFollowUp() {
  const dispatch = useDispatch<AppDispatch>();
  const [sequences, setSequences] = useState<FollowUpSequence[]>([]);
  const [stats, setStats] = useState<FollowUpStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Start a follow-up sequence for a lead */
  const startSequence = useCallback(
    async (leadId: string, cadenceType?: string) => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(startFollowUpAPI({ leadId, cadenceType })).unwrap();
        // Refresh sequences for this lead
        const result = await dispatch(fetchLeadFollowUpsAPI(leadId)).unwrap();
        setSequences(result as unknown as FollowUpSequence[]);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to start sequence');
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /** Fetch all sequences for a lead */
  const fetchSequences = useCallback(
    async (leadId: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(fetchLeadFollowUpsAPI(leadId)).unwrap();
        setSequences(result as unknown as FollowUpSequence[]);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch sequences');
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /** Pause a sequence */
  const pauseSequence = useCallback(
    async (sequenceId: string) => {
      setError(null);
      try {
        await dispatch(pauseFollowUpAPI(sequenceId)).unwrap();
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to pause sequence');
      }
    },
    [dispatch],
  );

  /** Resume a sequence */
  const resumeSequence = useCallback(
    async (sequenceId: string) => {
      setError(null);
      try {
        await dispatch(resumeFollowUpAPI(sequenceId)).unwrap();
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to resume sequence');
      }
    },
    [dispatch],
  );

  /** Cancel a sequence */
  const cancelSequence = useCallback(
    async (sequenceId: string, reason?: string) => {
      setError(null);
      try {
        await dispatch(cancelFollowUpAPI({ sequenceId, reason })).unwrap();
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to cancel sequence');
      }
    },
    [dispatch],
  );

  /** Fetch dashboard stats */
  const fetchStats = useCallback(async () => {
    setError(null);
    try {
      const result = await dispatch(fetchFollowUpStatsAPI()).unwrap();
      setStats(result as unknown as FollowUpStats);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch stats');
    }
  }, [dispatch]);

  // Derived data
  const activeSequences = sequences.filter((s) => s.status === 'active');
  const pausedSequences = sequences.filter((s) => s.status === 'paused');
  const completedSequences = sequences.filter((s) => s.status === 'completed');

  return {
    // Data
    sequences,
    activeSequences,
    pausedSequences,
    completedSequences,
    stats,

    // State
    loading,
    error,

    // Actions
    startSequence,
    fetchSequences,
    pauseSequence,
    resumeSequence,
    cancelSequence,
    fetchStats,
  };
}
