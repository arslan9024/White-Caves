/**
 * useCompliance Hook Tests — Phase 3D
 * ────────────────────────────────────
 * Tests for compliance hook: BRN report, VAT summary, overview,
 * Ejari export, Ejari status updates.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCompliance } from '../useCompliance';

// Mock redux dispatch
const mockUnwrap = vi.fn();
const mockDispatch = vi.fn(() => ({ unwrap: mockUnwrap }));
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

// Mock thunks
vi.mock('../../../store/crmDataSlice', () => ({
  fetchBRNExpiryAPI: vi.fn((args: unknown) => ({ type: 'fetchBRN', payload: args })),
  fetchVATSummaryAPI: vi.fn((args: unknown) => ({ type: 'fetchVAT', payload: args })),
  fetchComplianceOverviewAPI: vi.fn((args: unknown) => ({ type: 'fetchOverview', payload: args })),
  downloadEjariExportAPI: vi.fn((args: unknown) => ({ type: 'downloadEjari', payload: args })),
  updateEjariStatusAPI: vi.fn((args: unknown) => ({ type: 'updateEjari', payload: args })),
}));

describe('useCompliance', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null state', () => {
    const { result } = renderHook(() => useCompliance());
    expect(result.current.brnReport).toBeNull();
    expect(result.current.vatSummary).toBeNull();
    expect(result.current.overview).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should expose all action handlers', () => {
    const { result } = renderHook(() => useCompliance());
    expect(typeof result.current.fetchBRNExpiry).toBe('function');
    expect(typeof result.current.fetchVAT).toBe('function');
    expect(typeof result.current.fetchOverview).toBe('function');
    expect(typeof result.current.downloadEjariExport).toBe('function');
    expect(typeof result.current.updateEjari).toBe('function');
  });

  describe('fetchBRNExpiry', () => {
    it('should fetch BRN report and update state', async () => {
      const mockReport = {
        agents: [{ id: '1', name: 'Agent', brnNumber: 'BRN-001', status: 'valid' }],
        summary: { total: 1, valid: 1, expired: 0 },
      };
      mockUnwrap.mockResolvedValue(mockReport);

      const { result } = renderHook(() => useCompliance());
      await act(async () => {
        await result.current.fetchBRNExpiry();
      });

      expect(result.current.brnReport).toEqual(mockReport);
      expect(result.current.error).toBeNull();
    });

    it('should handle BRN fetch error', async () => {
      mockUnwrap.mockRejectedValue('BRN fetch failed');

      const { result } = renderHook(() => useCompliance());
      await act(async () => {
        await result.current.fetchBRNExpiry();
      });

      expect(result.current.brnReport).toBeNull();
      expect(result.current.error).toBe('BRN fetch failed');
    });
  });

  describe('fetchVAT', () => {
    it('should fetch VAT summary', async () => {
      const mockVAT = {
        period: '2026-01-01 to 2026-12-31',
        residential: { commissions: 5, totalAmount: 50000, vatRate: 0, vatAmount: 0 },
        commercial: { commissions: 3, totalAmount: 150000, vatRate: 5, vatAmount: 7500 },
        unclassified: { commissions: 0, totalAmount: 0, vatRate: 5, vatAmount: 0 },
        totals: { commissions: 8, totalAmount: 200000, totalVAT: 7500, grandTotal: 207500 },
      };
      mockUnwrap.mockResolvedValue(mockVAT);

      const { result } = renderHook(() => useCompliance());
      await act(async () => {
        await result.current.fetchVAT('2026-01-01', '2026-12-31');
      });

      expect(result.current.vatSummary).toEqual(mockVAT);
    });
  });

  describe('fetchOverview', () => {
    it('should fetch compliance overview', async () => {
      const mockOverview = {
        brnCompliance: { total: 10, valid: 8, percentage: 80 },
        ejariCompliance: { totalLeases: 20, registered: 15, percentage: 75 },
        documentCompliance: { totalProperties: 50, withDocuments: 45, percentage: 90 },
        overallScore: 82,
      };
      mockUnwrap.mockResolvedValue(mockOverview);

      const { result } = renderHook(() => useCompliance());
      await act(async () => {
        await result.current.fetchOverview();
      });

      expect(result.current.overview).toEqual(mockOverview);
      expect(result.current.overview?.overallScore).toBe(82);
    });
  });

  describe('downloadEjariExport', () => {
    it('should download Ejari CSV export', async () => {
      mockUnwrap.mockResolvedValue('csv data');

      const { result } = renderHook(() => useCompliance());
      let success;
      await act(async () => {
        success = await result.current.downloadEjariExport({ status: 'pending' });
      });

      expect(success).toBe(true);
    });
  });

  describe('updateEjari', () => {
    it('should update Ejari status', async () => {
      const mockResult = { id: 'lease-1', ejariNumber: 'EJ-123', ejariStatus: 'registered' };
      mockUnwrap.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useCompliance());
      let outcome;
      await act(async () => {
        outcome = await result.current.updateEjari({
          leaseId: 'lease-1',
          ejariNumber: 'EJ-123',
          ejariStatus: 'registered',
        });
      });

      expect(outcome).toEqual(mockResult);
    });
  });
});
