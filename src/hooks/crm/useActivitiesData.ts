/**
 * useActivitiesData — Data hook for Activity timeline & audit trail
 * Provides: type-filtered lists, CRUD handlers, stats, auto-fetch
 *
 * Usage:
 *   const { activities, stats, createActivity, ... } = useActivitiesData();
 *   const { activities: leadActs } = useActivitiesData({ type: 'lead' });
 */

import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  fetchActivitiesFromAPI,
  createActivityAPI,
  updateActivityAPI,
  deleteActivityAPI,
  selectAllActivities,
  selectLeadActivities,
  selectDealActivities,
  selectPropertyActivities,
  selectSystemActivities,
  selectActivitiesLoading,
  selectActivitiesError,
} from '../../store/crmDataSlice';

// ─── Options ────────────────────────────────────────────────────────────
interface UseActivitiesOptions {
  /** Auto-fetch on mount (default: true) */
  autoFetch?: boolean;
  /** Filter by activity type (lead, property, deal, commission, agent, client, system) */
  type?: string;
  /** Filter by action (created, updated, deleted, status_changed, ...) */
  action?: string;
  /** Filter by user ID */
  userId?: string;
  /** Filter by lead ID */
  leadId?: string;
}

// ─── Return types ───────────────────────────────────────────────────────
interface ActivityItem {
  id: string | number;
  [key: string]: unknown;
}

interface ActivityStats {
  total: number;
  leadCount: number;
  dealCount: number;
  propertyCount: number;
  systemCount: number;
  todayCount: number;
}

// ─── Hook ───────────────────────────────────────────────────────────────
export function useActivitiesData(options: UseActivitiesOptions = {}) {
  const { autoFetch = true, type, action, userId, leadId } = options;
  const dispatch = useDispatch<AppDispatch>();

  // ── Selectors ──
  const allActivities = useSelector(selectAllActivities) as ActivityItem[];
  const leadActivities = useSelector(selectLeadActivities) as ActivityItem[];
  const dealActivities = useSelector(selectDealActivities) as ActivityItem[];
  const propertyActivities = useSelector(selectPropertyActivities) as ActivityItem[];
  const systemActivities = useSelector(selectSystemActivities) as ActivityItem[];
  const loading = useSelector(selectActivitiesLoading) ?? false;
  const error = useSelector(selectActivitiesError) ?? null;

  // ── Auto-fetch ──
  useEffect(() => {
    if (autoFetch) {
      const params: Record<string, string | number> = {};
      if (type) params.type = type;
      if (action) params.action = action;
      if (userId) params.userId = userId;
      if (leadId) params.leadId = leadId;
      dispatch(fetchActivitiesFromAPI(params));
    }
  }, [dispatch, autoFetch, type, action, userId, leadId]);

  // ── Filtered list (applies option-level filters client-side) ──
  const activities = useMemo(() => {
    let result = allActivities;
    if (type) result = result.filter((a) => a.type === type);
    if (action) result = result.filter((a) => a.action === action);
    if (userId) result = result.filter((a) => a.userId === userId);
    if (leadId) result = result.filter((a) => a.leadId === leadId);
    return result;
  }, [allActivities, type, action, userId, leadId]);

  // ── Stats ──
  const stats = useMemo<ActivityStats>(() => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const todayCount = allActivities.filter((a) => {
      const ts = typeof a.createdAt === 'string' ? a.createdAt : '';
      return ts.startsWith(today);
    }).length;

    return {
      total: allActivities.length,
      leadCount: leadActivities.length,
      dealCount: dealActivities.length,
      propertyCount: propertyActivities.length,
      systemCount: systemActivities.length,
      todayCount,
    };
  }, [allActivities, leadActivities, dealActivities, propertyActivities, systemActivities]);

  // ── CRUD handlers ──
  const createActvity = useCallback(
    (data: { type: string; action: string; description: string; metadata?: Record<string, unknown>; leadId?: string }) =>
      dispatch(createActivityAPI(data)),
    [dispatch],
  );

  const updateActiviy = useCallback(
    (data: { id: string; description?: string; metadata?: Record<string, unknown> }) =>
      dispatch(updateActivityAPI(data)),
    [dispatch],
  );

  const deleteActvity = useCallback(
    (id: string) => dispatch(deleteActivityAPI(id)),
    [dispatch],
  );

  const refresh = useCallback(() => {
    const params: Record<string, string | number> = {};
    if (type) params.type = type;
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (leadId) params.leadId = leadId;
    return dispatch(fetchActivitiesFromAPI(params));
  }, [dispatch, type, action, userId, leadId]);

  return {
    // Data
    activities,
    allActivities,
    leadActivities,
    dealActivities,
    propertyActivities,
    systemActivities,
    loading,
    error,

    // Stats
    stats,

    // Actions
    createActivity: createActvity,
    updateActivity: updateActiviy,
    deleteActivity: deleteActvity,
    refresh,
  };
}

export default useActivitiesData;
