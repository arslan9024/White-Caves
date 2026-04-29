/**
 * useCRMHubData Hook
 * ==================
 * Extracted from CRMHubPage — owns all Redux data fetching,
 * selectors, and computed CRM statistics.
 */

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import {
  selectAllLeads,
  selectHotLeads,
  selectAllClients,
  selectAllAgents,
  selectAllCommissions,
  selectRecentActivities,
  selectOverviewData,
  fetchLeadsFromAPI,
  fetchAgentsFromAPI,
  fetchDashboardOverview,
} from '../../store/crmDataSlice';

export function useCRMHubData() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.currentUser);

  // CRM data from Redux
  const allLeads = useSelector(selectAllLeads);
  const hotLeads = useSelector(selectHotLeads);
  const allClients = useSelector(selectAllClients);
  const allAgents = useSelector(selectAllAgents);
  const commissions = useSelector(selectAllCommissions);
  const recentActivities = useSelector((state: RootState) => selectRecentActivities(state, 8));
  const overview = useSelector(selectOverviewData);

  // Fetch API data on mount (silently falls back to dummy data)
  useEffect(() => {
    const leadsPromise = dispatch(fetchLeadsFromAPI({}));
    const agentsPromise = dispatch(fetchAgentsFromAPI());
    const overviewPromise = dispatch(fetchDashboardOverview());

    return () => {
      leadsPromise.abort?.();
      agentsPromise.abort?.();
      overviewPromise.abort?.();
    };
  }, [dispatch]);

  // Computed stats
  const totalLeads = allLeads.length;
  const totalClients = allClients.length;
  const totalAgents = allAgents.length;
  const totalCommissions = commissions.length;
  const hotLeadCount = hotLeads.length;
  const overviewMetrics = (overview as Record<string, Record<string, unknown>> | null)?.metrics;
  const rawPipelineValue = overviewMetrics?.pipelineValue;
  const pipelineValue = rawPipelineValue !== undefined && rawPipelineValue !== null
    ? Number(rawPipelineValue)
    : allLeads.reduce((sum: number, l) => sum + (Number(l.value) || Number(l.budget) || 0), 0);

  return {
    user,
    allLeads,
    hotLeads,
    allClients,
    allAgents,
    commissions,
    recentActivities,
    overview,
    totalLeads,
    totalClients,
    totalAgents,
    totalCommissions,
    hotLeadCount,
    pipelineValue,
  };
}
