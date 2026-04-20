/**
 * useCompliance Hook — Phase 3D
 * ─────────────────────────────
 * Frontend hook for RERA/Ejari/VAT compliance features:
 * - BRN expiry report
 * - VAT summary
 * - Compliance overview
 * - Ejari CSV export
 * - Ejari status updates
 *
 * @module useCompliance
 */

import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import {
  fetchBRNExpiryAPI,
  fetchVATSummaryAPI,
  fetchComplianceOverviewAPI,
  downloadEjariExportAPI,
  updateEjariStatusAPI,
} from '../../store/crmDataSlice';

interface BRNAgent {
  id: string;
  name: string | null;
  email: string;
  brnNumber: string | null;
  brnExpiry: string | null;
  daysUntilExpiry: number | null;
  status: string;
}

interface BRNReport {
  agents: BRNAgent[];
  summary: Record<string, number>;
}

interface VATSummary {
  period: string;
  residential: Record<string, number>;
  commercial: Record<string, number>;
  unclassified: Record<string, number>;
  totals: Record<string, number>;
}

interface ComplianceOverview {
  brnCompliance: Record<string, number>;
  ejariCompliance: Record<string, number>;
  documentCompliance: Record<string, number>;
  overallScore: number;
}

export function useCompliance() {
  const dispatch = useDispatch<AppDispatch>();
  const [brnReport, setBrnReport] = useState<BRNReport | null>(null);
  const [vatSummary, setVatSummary] = useState<VATSummary | null>(null);
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch BRN expiry report for all agents.
   */
  const fetchBRNExpiry = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchBRNExpiryAPI()).unwrap();
      setBrnReport(result);
      return result;
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Failed to fetch BRN report';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Fetch VAT summary by property type.
   */
  const fetchVAT = useCallback(
    async (from?: string, to?: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(fetchVATSummaryAPI({ from, to })).unwrap();
        setVatSummary(result);
        return result;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to fetch VAT summary';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Fetch compliance overview dashboard data.
   */
  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await dispatch(fetchComplianceOverviewAPI()).unwrap();
      setOverview(result);
      return result;
    } catch (err) {
      const msg = typeof err === 'string' ? err : 'Failed to fetch compliance overview';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Download Ejari CSV export.
   */
  const downloadEjariExport = useCallback(
    async (filters?: { status?: string; from?: string; to?: string }) => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(downloadEjariExportAPI(filters)).unwrap();
        return true;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to download Ejari export';
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  /**
   * Update Ejari registration status for a lease.
   */
  const updateEjari = useCallback(
    async (data: {
      leaseId: string;
      ejariNumber?: string;
      ejariStatus?: string;
      ejariRegistrationDate?: string;
      ejariExpiryDate?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await dispatch(updateEjariStatusAPI(data)).unwrap();
        return result;
      } catch (err) {
        const msg = typeof err === 'string' ? err : 'Failed to update Ejari status';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [dispatch],
  );

  return {
    // State
    brnReport,
    vatSummary,
    overview,
    loading,
    error,

    // Actions
    fetchBRNExpiry,
    fetchVAT,
    fetchOverview,
    downloadEjariExport,
    updateEjari,
  };
}
