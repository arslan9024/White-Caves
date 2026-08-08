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

import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../store/store';
import { authFetch, extractApiError } from '../../utils/authFetch';
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

export interface CorporateDocumentRecord {
  id: string;
  registryDocumentId?: string | null;
  title: string;
  authority: string;
  referenceNumber?: string | null;
  licenseNumber?: string | null;
  establishmentNumber?: string | null;
  issueDate?: string | null;
  expiryDate?: string | null;
  registrationDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  status: 'active' | 'expiring_soon' | 'expired' | 'reference_stored' | 'archived' | string;
  parsedTextFile?: string | null;
  pdfFile?: string | null;
  sourcePath?: string | null;
  lastImportedAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CorporateDocumentAlertRecord {
  id: string;
  documentId: string;
  alertType: string;
  status: 'open' | 'acknowledged' | 'resolved' | string;
  message: string;
  dueDate?: string | null;
  acknowledgedById?: string | null;
  acknowledgedAt?: string | null;
  resolvedById?: string | null;
  resolvedAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  document?: {
    id: string;
    title: string;
    authority: string;
    expiryDate?: string | null;
    status: string;
    referenceNumber?: string | null;
  };
}

interface CorporateDocumentsImportResult {
  filePath: string;
  total: number;
  created: number;
  updated: number;
}

interface CorporateDocumentsSummary {
  total: number;
  active: number;
  expiringSoon: number;
  expired: number;
  archived: number;
  referenceStored: number;
  openAlerts: number;
  acknowledgedAlerts: number;
  authorityBreakdown: Array<{ authority: string; count: number }>;
}

export function useCompliance() {
  const dispatch = useDispatch<AppDispatch>();
  const [brnReport, setBrnReport] = useState<BRNReport | null>(null);
  const [vatSummary, setVatSummary] = useState<VATSummary | null>(null);
  const [overview, setOverview] = useState<ComplianceOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [corporateDocuments, setCorporateDocuments] = useState<CorporateDocumentRecord[]>([]);
  const [corporateAlerts, setCorporateAlerts] = useState<CorporateDocumentAlertRecord[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  const corporateSummary = useMemo<CorporateDocumentsSummary>(() => {
    const authorityMap = new Map<string, number>();
    for (const document of corporateDocuments) {
      authorityMap.set(document.authority, (authorityMap.get(document.authority) || 0) + 1);
    }

    return {
      total: corporateDocuments.length,
      active: corporateDocuments.filter(document => document.status === 'active').length,
      expiringSoon: corporateDocuments.filter(document => document.status === 'expiring_soon').length,
      expired: corporateDocuments.filter(document => document.status === 'expired').length,
      archived: corporateDocuments.filter(document => document.status === 'archived').length,
      referenceStored: corporateDocuments.filter(document => document.status === 'reference_stored').length,
      openAlerts: corporateAlerts.filter(alert => alert.status === 'open').length,
      acknowledgedAlerts: corporateAlerts.filter(alert => alert.status === 'acknowledged').length,
      authorityBreakdown: Array.from(authorityMap.entries())
        .map(([authority, count]) => ({ authority, count }))
        .sort((left, right) => right.count - left.count),
    };
  }, [corporateAlerts, corporateDocuments]);

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

  const fetchCorporateDocuments = useCallback(
    async (filters?: { status?: string; authority?: string; search?: string; limit?: number }) => {
      setDocumentsLoading(true);
      setDocumentsError(null);

      try {
        const query = new URLSearchParams();
        if (filters?.status) query.set('status', filters.status);
        if (filters?.authority) query.set('authority', filters.authority);
        if (filters?.search) query.set('search', filters.search);
        if (typeof filters?.limit === 'number') query.set('limit', String(filters.limit));

        const suffix = query.toString() ? `?${query.toString()}` : '';
        const response = await authFetch(`/api/compliance/corporate-documents${suffix}`);
        if (!response.ok) {
          throw new Error(await extractApiError(response, 'Failed to fetch corporate documents'));
        }

        const payload = (await response.json()) as { data?: CorporateDocumentRecord[] };
        const nextDocuments = Array.isArray(payload.data) ? payload.data : [];
        setCorporateDocuments(nextDocuments);
        return nextDocuments;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch corporate documents';
        setDocumentsError(msg);
        return null;
      } finally {
        setDocumentsLoading(false);
      }
    },
    [],
  );

  const fetchCorporateAlerts = useCallback(async (limit = 100) => {
    setDocumentsLoading(true);
    setDocumentsError(null);

    try {
      const response = await authFetch(`/api/compliance/corporate-documents/alerts/list?limit=${limit}`);
      if (!response.ok) {
        throw new Error(await extractApiError(response, 'Failed to fetch corporate document alerts'));
      }

      const payload = (await response.json()) as { data?: CorporateDocumentAlertRecord[] };
      const nextAlerts = Array.isArray(payload.data) ? payload.data : [];
      setCorporateAlerts(nextAlerts);
      return nextAlerts;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch corporate document alerts';
      setDocumentsError(msg);
      return null;
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  const acknowledgeCorporateAlert = useCallback(async (alertId: string) => {
    setDocumentsLoading(true);
    setDocumentsError(null);

    try {
      const response = await authFetch(`/api/compliance/corporate-documents/alerts/${alertId}/acknowledge`, {
        method: 'PATCH',
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(await extractApiError(response, 'Failed to acknowledge corporate document alert'));
      }

      const payload = (await response.json()) as { data?: CorporateDocumentAlertRecord };
      const updated = payload.data;
      if (updated) {
        setCorporateAlerts(current =>
          current.map(alert => (alert.id === updated.id ? { ...alert, ...updated } : alert)),
        );
      }
      return updated ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to acknowledge corporate document alert';
      setDocumentsError(msg);
      return null;
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  const importCorporateRegistry = useCallback(async (filePath?: string) => {
    setDocumentsLoading(true);
    setDocumentsError(null);

    try {
      const response = await authFetch('/api/compliance/corporate-documents/import-registry', {
        method: 'POST',
        body: JSON.stringify(filePath ? { filePath } : {}),
      });
      if (!response.ok) {
        throw new Error(await extractApiError(response, 'Failed to import corporate registry'));
      }

      const payload = (await response.json()) as { data?: CorporateDocumentsImportResult };
      return payload.data ?? null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to import corporate registry';
      setDocumentsError(msg);
      return null;
    } finally {
      setDocumentsLoading(false);
    }
  }, []);

  return {
    // State
    brnReport,
    vatSummary,
    overview,
    loading,
    error,
    corporateDocuments,
    corporateAlerts,
    corporateSummary,
    documentsLoading,
    documentsError,

    // Actions
    fetchBRNExpiry,
    fetchVAT,
    fetchOverview,
    downloadEjariExport,
    updateEjari,
    fetchCorporateDocuments,
    fetchCorporateAlerts,
    acknowledgeCorporateAlert,
    importCorporateRegistry,
  };
}
