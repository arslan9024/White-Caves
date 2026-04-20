/**
 * useLeadScoring — Data hook for AI Lead Scoring
 * Provides: tier-filtered lead lists, scoring actions, tier stats
 *
 * Usage:
 *   const { hotLeads, warmLeads, coldLeads, scoreLead, overrideScore, stats } = useLeadScoring();
 */

import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  scoreLeadAPI,
  overrideLeadScoreAPI,
  batchRescoreLeadsAPI,
  selectAllLeads,
  selectHotTierLeads,
  selectWarmTierLeads,
  selectColdTierLeads,
  selectInactiveTierLeads,
  selectLeadsLoading,
  selectLeadsError,
} from '../../store/crmDataSlice';

// ─── Types ──────────────────────────────────────────────────────────────
interface LeadItem {
  id: string | number;
  [key: string]: unknown;
}

interface LeadScoringStats {
  total: number;
  hotCount: number;
  warmCount: number;
  coldCount: number;
  inactiveCount: number;
  averageScore: number;
  scoredCount: number;
  unscoredCount: number;
}

// ─── Hook ───────────────────────────────────────────────────────────────
export function useLeadScoring() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Selectors ──
  const allLeads = useSelector(selectAllLeads) as LeadItem[];
  const hotLeads = useSelector(selectHotTierLeads) as LeadItem[];
  const warmLeads = useSelector(selectWarmTierLeads) as LeadItem[];
  const coldLeads = useSelector(selectColdTierLeads) as LeadItem[];
  const inactiveLeads = useSelector(selectInactiveTierLeads) as LeadItem[];
  const loading = useSelector(selectLeadsLoading) ?? false;
  const error = useSelector(selectLeadsError) ?? null;

  // ── Stats ──
  const stats = useMemo<LeadScoringStats>(() => {
    const scored = allLeads.filter((l) => typeof l.score === 'number' && l.score > 0);
    const totalScore = scored.reduce((sum, l) => sum + (typeof l.score === 'number' ? l.score : 0), 0);

    return {
      total: allLeads.length,
      hotCount: hotLeads.length,
      warmCount: warmLeads.length,
      coldCount: coldLeads.length,
      inactiveCount: inactiveLeads.length,
      averageScore: scored.length > 0 ? Math.round(totalScore / scored.length) : 0,
      scoredCount: scored.length,
      unscoredCount: allLeads.length - scored.length,
    };
  }, [allLeads, hotLeads, warmLeads, coldLeads, inactiveLeads]);

  // ── Actions ──
  const scoreLead = useCallback(
    (leadId: string) => dispatch(scoreLeadAPI(leadId)),
    [dispatch],
  );

  const overrideScore = useCallback(
    (data: { leadId: string; score: number; reason: string }) =>
      dispatch(overrideLeadScoreAPI(data)),
    [dispatch],
  );

  const batchRescore = useCallback(
    () => dispatch(batchRescoreLeadsAPI()),
    [dispatch],
  );

  return {
    // Data
    allLeads,
    hotLeads,
    warmLeads,
    coldLeads,
    inactiveLeads,
    loading,
    error,

    // Stats
    stats,

    // Actions
    scoreLead,
    overrideScore,
    batchRescore,
  };
}

export default useLeadScoring;
