/**
 * useLeadScoring — Data hook for AI Lead Scoring (Enhanced Phase 4A)
 * Provides: tier-filtered lead lists, scoring actions, tier stats,
 *           score history, trending, auto-routing, WhatsApp signals
 *
 * Usage:
 *   const { hotLeads, warmLeads, scoreLead, fetchHistory, autoRoute, stats } = useLeadScoring();
 */

import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  scoreLeadAPI,
  overrideLeadScoreAPI,
  batchRescoreLeadsAPI,
  fetchScoredLeadsAPI,
  fetchRoutingRulesAPI,
  fetchScoreHistoryAPI,
  fetchLeadTrendingAPI,
  applyWhatsAppScoreAPI,
  autoRouteLeadAPI,
  fetchLeadRoutingAgentsAPI,
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

  // ── Phase 4A Actions ──
  const fetchScoredLeads = useCallback(
    (params?: { tier?: string; page?: number; pageSize?: number }) =>
      dispatch(fetchScoredLeadsAPI(params)),
    [dispatch],
  );

  const fetchRoutingRules = useCallback(
    () => dispatch(fetchRoutingRulesAPI()),
    [dispatch],
  );

  const fetchHistory = useCallback(
    (leadId: string, options?: { limit?: number; days?: number }) =>
      dispatch(fetchScoreHistoryAPI({ leadId, ...options })),
    [dispatch],
  );

  const fetchTrending = useCallback(
    (options?: { days?: number; minChange?: number }) =>
      dispatch(fetchLeadTrendingAPI(options)),
    [dispatch],
  );

  const applyWhatsAppSignals = useCallback(
    (leadId: string, signals: Record<string, number>) =>
      dispatch(applyWhatsAppScoreAPI({ leadId, signals })),
    [dispatch],
  );

  const autoRoute = useCallback(
    (leadId: string) => dispatch(autoRouteLeadAPI(leadId)),
    [dispatch],
  );

  const fetchAgentPerformance = useCallback(
    () => dispatch(fetchLeadRoutingAgentsAPI()),
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

    // Core Actions
    scoreLead,
    overrideScore,
    batchRescore,

    // Phase 4A: Enhanced Actions
    fetchScoredLeads,
    fetchRoutingRules,
    fetchHistory,
    fetchTrending,
    applyWhatsAppSignals,
    autoRoute,
    fetchAgentPerformance,
  };
}

export default useLeadScoring;
