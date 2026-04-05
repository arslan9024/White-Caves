/**
 * useAgentPerformance Hook
 * ========================
 * Derived analytics, ranking, and pagination for the agent performance dashboard.
 * Extracted from AgentPerformancePage.tsx to keep the page focused on rendering.
 */

import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllAgents,
  selectAgentsLoading,
  fetchAgentsFromAPI,
} from '../../store/crmDataSlice';
import type { AppDispatch } from '../../store/store';

interface Agent {
  id: string | number;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  department?: string;
  status?: string;
  performance?: number;
  avatar?: string;
  deals_closed?: number;
  revenue_generated?: number;
  leads_assigned?: number;
  conversion_rate?: number;
  [key: string]: unknown;
}

export interface TeamStats {
  totalDeals: number;
  totalRevenue: number;
  avgPerformance: number;
  avgConversion: number;
  onlineCount: number;
  total: number;
}

const AGENTS_PER_PAGE = 12;

/**
 * Fetches agents, computes team stats, ranks by performance, and paginates.
 */
export function useAgentPerformance() {
  const dispatch = useDispatch<AppDispatch>();
  const agents = useSelector(selectAllAgents) as Agent[];
  const loading = useSelector(selectAgentsLoading);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch agents from API on mount
  useEffect(() => {
    const promise = dispatch(fetchAgentsFromAPI());
    return () => {
      promise.abort?.();
    };
  }, [dispatch]);

  // Sort by performance score (desc)
  const rankedAgents = useMemo(
    () => [...agents].sort((a, b) => (b.performance || 0) - (a.performance || 0)),
    [agents],
  );

  // Team-level summary stats
  const teamStats = useMemo<TeamStats>(() => {
    const totalDeals = agents.reduce((sum, a) => sum + (a.deals_closed || 0), 0);
    const totalRevenue = agents.reduce((sum, a) => sum + (a.revenue_generated || 0), 0);
    const avgPerformance = agents.length
      ? Math.round(agents.reduce((sum, a) => sum + (a.performance || 0), 0) / agents.length)
      : 0;
    const avgConversion = agents.length
      ? Math.round(agents.reduce((sum, a) => sum + (a.conversion_rate || 0), 0) / agents.length)
      : 0;
    const onlineCount = agents.filter((a) => a.status === 'online').length;

    return { totalDeals, totalRevenue, avgPerformance, avgConversion, onlineCount, total: agents.length };
  }, [agents]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(rankedAgents.length / AGENTS_PER_PAGE));
  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * AGENTS_PER_PAGE;
    return rankedAgents.slice(start, start + AGENTS_PER_PAGE);
  }, [rankedAgents, currentPage]);

  // Reset to page 1 when agents change
  useEffect(() => {
    setCurrentPage(1);
  }, [agents.length]);

  return {
    agents,
    loading,
    rankedAgents,
    teamStats,
    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedAgents,
    agentsPerPage: AGENTS_PER_PAGE,
  };
}
