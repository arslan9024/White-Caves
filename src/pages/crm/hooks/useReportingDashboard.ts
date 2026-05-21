/**
 * useReportingDashboard — Custom hook for Reporting Dashboard
 * Fetches KPIs, executive report, and dashboard summary from crmService.
 * Provides date range filtering and CSV/JSON export.
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency as formatCurrencyUtil } from '../../../utils';
import { createLogger } from '../../../utils/logger';
import * as crmService from '../../../services/crmService';

const log = createLogger('useReportingDashboard');

// ─── Types ──────────────────────────────────────────────────────────────

export interface KPIData {
  newLeads?: number;
  wonDeals?: number;
  revenue?: number;
  avgDealSize?: number;
  conversionRate?: number;
  [key: string]: unknown;
}

export interface ReportData {
  leadsBySource?: Record<string, number>;
  propertyByStatus?: Record<string, number>;
  commissionSummary?: {
    total?: number;
    pending?: number;
    paid?: number;
  };
  recentTransactions?: unknown[];
  [key: string]: unknown;
}

export interface DashboardSummary {
  totalProperties?: number;
  totalClients?: number;
  totalAgents?: number;
  totalRevenue?: number;
  [key: string]: unknown;
}

// ─── Hook ───────────────────────────────────────────────────────────────

export function useReportingDashboard() {
  const navigate = useNavigate();

  // ─── Local state ────────────────────────────────────────────────

  const [kpis, setKpis] = useState<KPIData>({});
  const [report, setReport] = useState<ReportData>({});
  const [summary, setSummary] = useState<DashboardSummary>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  // ─── Fetch data on mount ───────────────────────────────────────

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [kpiResult, reportResult, summaryResult] = await Promise.allSettled([
        crmService.fetchKPIs(),
        crmService.fetchExecutiveReport(),
        crmService.fetchDashboardSummary(),
      ]);

      if (kpiResult.status === 'fulfilled') {
        setKpis(kpiResult.value as KPIData);
      }
      if (reportResult.status === 'fulfilled') {
        setReport(reportResult.value as ReportData);
      }
      if (summaryResult.status === 'fulfilled') {
        setSummary(summaryResult.value as DashboardSummary);
      }

      const allRejected = [kpiResult, reportResult, summaryResult].every(
        r => r.status === 'rejected'
      );
      if (allRejected) {
        setError('Failed to load reporting data. Please try again.');
      }
    } catch (err: unknown) {
      log.error(
        'Failed to fetch reporting data:',
        err instanceof Error ? err.message : String(err)
      );
      setError('An unexpected error occurred while loading reports.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ─── Derived data ───────────────────────────────────────────────

  const leadSourceBreakdown = useMemo(() => {
    const sources = report.leadsBySource || {};
    const entries = Object.entries(sources);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    return entries.map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / max) * 100),
    }));
  }, [report.leadsBySource]);

  const propertyStatusBreakdown = useMemo(() => {
    const statuses = report.propertyByStatus || {};
    const entries = Object.entries(statuses);
    const total = entries.reduce((sum, [, v]) => sum + v, 0) || 1;
    return entries.map(([status, count]) => ({
      status,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }, [report.propertyByStatus]);

  const commissionSummary = useMemo(
    () => ({
      total: report.commissionSummary?.total || 0,
      pending: report.commissionSummary?.pending || 0,
      paid: report.commissionSummary?.paid || 0,
    }),
    [report.commissionSummary]
  );

  // ─── Actions ────────────────────────────────────────────────────

  const handleExport = useCallback(async () => {
    try {
      const params: Record<string, string> = { format: exportFormat };
      if (dateRange.start) params.start = dateRange.start;
      if (dateRange.end) params.end = dateRange.end;

      const data = await crmService.exportCrmData(params);

      if (exportFormat === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crm-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const rows = Array.isArray(data) ? data : [data];
        if (rows.length === 0) return;
        const headers = Object.keys(rows[0] as Record<string, unknown>);
        const escapeCSV = (val: unknown): string => {
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        };
        const csvContent = [
          headers.join(','),
          ...rows.map(row =>
            headers
              .map(h => {
                const val = (row as Record<string, unknown>)[h];
                return escapeCSV(val);
              })
              .join(',')
          ),
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crm-report-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err: unknown) {
      log.error('Export failed:', err instanceof Error ? err.message : String(err));
      setError('Export failed. Please try again.');
    }
  }, [exportFormat, dateRange]);

  const formatCurrency = useCallback(
    (amount: number | undefined) => formatCurrencyUtil(amount),
    []
  );

  const retryFetch = useCallback(() => {
    fetchAllData();
  }, [fetchAllData]);

  const goBack = useCallback(() => {
    navigate('/owner/crm');
  }, [navigate]);

  return {
    // Data
    kpis,
    report,
    summary,
    leadSourceBreakdown,
    propertyStatusBreakdown,
    commissionSummary,
    loading,
    error,
    // State
    dateRange,
    setDateRange,
    exportFormat,
    setExportFormat,
    // Actions
    handleExport,
    retryFetch,
    goBack,
    // Formatters
    formatCurrency,
  };
}
