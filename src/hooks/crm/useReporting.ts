/**
 * useReporting — Data hook for reporting & analytics dashboard
 *
 * Aggregates data from multiple analytics endpoints:
 *   - Executive summary (leads/properties/commissions by status)
 *   - 30-day KPIs (new leads, won deals, revenue)
 *   - Lead funnel (conversion stages)
 *   - Time-series trends (leads/transactions/commissions over time)
 *   - Property aging (days on market distribution)
 *   - Agent performance comparison
 */

import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  fetchLeadFunnelAPI,
  fetchTrendsAPI,
  fetchPropertyAgingAPI,
  fetchAgentPerformanceAPI,
  fetchExecutiveDashboardAPI,
  fetchKPIsAPI,
} from '../../store/crmDataSlice';

interface LeadFunnel {
  funnel: Array<{ stage: string; count: number; percentage: number }>;
  tierDistribution: Array<{ tier: string; count: number }>;
  total: number;
}

interface TrendSeries {
  period: string;
  startDate: string;
  series: Array<{
    date: string;
    leads: number;
    transactions: number;
    transactionValue: number;
    commissions: number;
    commissionValue: number;
  }>;
}

interface PropertyAging {
  totalAvailable: number;
  avgDaysOnMarket: number;
  buckets: Array<{ label: string; count: number }>;
  staleProperties: Array<{ id: string; title: string; daysOnMarket: number }>;
}

interface AgentPerformance {
  agents: Array<{
    id: string;
    name: string;
    department: string;
    totalLeads: number;
    wonLeads: number;
    conversionRate: number;
    totalCommission: number;
    dealsClosed: number;
    activeDeals: number;
  }>;
  total: number;
}

interface KPIs {
  newLeads: number;
  wonDeals: number;
  newListings: number;
  totalRevenue: number;
  avgDealSize: number;
}

export function useReporting() {
  const dispatch = useDispatch<AppDispatch>();
  const [leadFunnel, setLeadFunnel] = useState<LeadFunnel | null>(null);
  const [trends, setTrends] = useState<TrendSeries | null>(null);
  const [propertyAging, setPropertyAging] = useState<PropertyAging | null>(null);
  const [agentPerformance, setAgentPerformance] = useState<AgentPerformance | null>(null);
  const [executive, setExecutive] = useState<Record<string, unknown> | null>(null);
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch all reporting data in parallel */
  const fetchAllReports = useCallback(
    async (trendDays?: number) => {
      setLoading(true);
      setError(null);
      try {
        const [funnelRes, trendsRes, agingRes, agentsRes, execRes, kpisRes] = await Promise.allSettled([
          dispatch(fetchLeadFunnelAPI()).unwrap(),
          dispatch(fetchTrendsAPI(trendDays ? { days: trendDays } : undefined)).unwrap(),
          dispatch(fetchPropertyAgingAPI()).unwrap(),
          dispatch(fetchAgentPerformanceAPI()).unwrap(),
          dispatch(fetchExecutiveDashboardAPI()).unwrap(),
          dispatch(fetchKPIsAPI()).unwrap(),
        ]);

        if (funnelRes.status === 'fulfilled') setLeadFunnel(funnelRes.value as unknown as LeadFunnel);
        if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value as unknown as TrendSeries);
        if (agingRes.status === 'fulfilled') setPropertyAging(agingRes.value as unknown as PropertyAging);
        if (agentsRes.status === 'fulfilled') setAgentPerformance(agentsRes.value as unknown as AgentPerformance);
        if (execRes.status === 'fulfilled') setExecutive(execRes.value as Record<string, unknown>);
        if (kpisRes.status === 'fulfilled') setKpis(kpisRes.value as unknown as KPIs);

        // Check for any failures
        const failures = [funnelRes, trendsRes, agingRes, agentsRes, execRes, kpisRes]
          .filter((r) => r.status === 'rejected');
        if (failures.length > 0) {
          setError(`${failures.length} of 6 reports failed to load`);
        }
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /** Fetch lead funnel only */
  const fetchFunnel = useCallback(async () => {
    try {
      const result = await dispatch(fetchLeadFunnelAPI()).unwrap();
      setLeadFunnel(result as unknown as LeadFunnel);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch funnel');
    }
  }, [dispatch]);

  /** Fetch trends only */
  const fetchTrends = useCallback(
    async (days?: number) => {
      try {
        const result = await dispatch(fetchTrendsAPI(days ? { days } : undefined)).unwrap();
        setTrends(result as unknown as TrendSeries);
      } catch (err) {
        setError(typeof err === 'string' ? err : 'Failed to fetch trends');
      }
    },
    [dispatch],
  );

  /** Fetch agent performance only */
  const fetchAgents = useCallback(async () => {
    try {
      const result = await dispatch(fetchAgentPerformanceAPI()).unwrap();
      setAgentPerformance(result as unknown as AgentPerformance);
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Failed to fetch agent performance');
    }
  }, [dispatch]);

  return {
    // Data
    leadFunnel,
    trends,
    propertyAging,
    agentPerformance,
    executive,
    kpis,

    // State
    loading,
    error,

    // Actions
    fetchAllReports,
    fetchFunnel,
    fetchTrends,
    fetchAgents,
  };
}
