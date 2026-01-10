import { useState, useEffect, useCallback } from 'react';
import crmDataService from '../services/CRMDataService';

export const useDashboardData = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  const refresh = useCallback(() => {
    crmDataService.clearCache();
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
};

export const useDashboardSummary = () => {
  return useDashboardData(() => crmDataService.getDashboardSummary());
};

export const useOwnerDashboard = () => {
  return useDashboardData(() => crmDataService.getOwnerDashboard());
};

export const useProperties = (filters = {}) => {
  return useDashboardData(
    () => crmDataService.getProperties(filters),
    [JSON.stringify(filters)]
  );
};

export const usePropertyStats = () => {
  return useDashboardData(() => crmDataService.getPropertyStats());
};

export const useLeads = () => {
  return useDashboardData(() => crmDataService.getRecentLeads());
};

export const useLeadMetrics = () => {
  return useDashboardData(() => crmDataService.getLeadMetrics());
};

export const useAnalytics = () => {
  return useDashboardData(() => crmDataService.getAnalytics());
};

export const useActivities = () => {
  return useDashboardData(() => crmDataService.getRecentActivities());
};

export const useFeaturedProperties = () => {
  return useDashboardData(() => crmDataService.getFeaturedProperties());
};

export const useSchedulerStatus = () => {
  return useDashboardData(() => crmDataService.getSchedulerStatus());
};

export const useZoeBriefing = () => {
  return useDashboardData(() => crmDataService.getZoeBriefing());
};

export const useZoeDepartments = () => {
  return useDashboardData(() => crmDataService.getZoeDepartments());
};

export const useZoeServices = () => {
  return useDashboardData(() => crmDataService.getZoeServices());
};

export const useOliviaProperties = () => {
  return useDashboardData(() => crmDataService.getOliviaFeaturedProperties());
};

export default useDashboardData;
