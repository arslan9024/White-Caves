/**
 * @file useComplianceData.test.ts
 * @description Comprehensive tests for useComplianceData hook — KYC/AML compliance management
 * Tests: approve/reject KYC, approve contracts, resolve AML alerts, derived stats
 */

import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock data modules
vi.mock('../../data/compliance', () => ({
  KYC_VERIFICATIONS: [
    { id: 1, name: 'Ahmed Al Rashid', type: 'buyer', status: 'verified', date: '2024-01-08', documents: ['passport'], riskLevel: 'low' },
    { id: 2, name: 'Sara Hassan', type: 'seller', status: 'pending', date: '2024-01-09', documents: ['id_card'], riskLevel: 'medium' },
    { id: 3, name: 'Omar Khalid', type: 'buyer', status: 'pending', date: '2024-01-10', documents: ['passport', 'visa'], riskLevel: 'high' },
  ],
  CONTRACTS: [
    { id: 1, title: 'Sales Agreement - Villa 348', parties: 'White Caves ↔ Al Rashid', status: 'pending_review', type: 'sale', value: 2500000, date: '2024-01-08' },
    { id: 2, title: 'Lease - Unit B205', parties: 'White Caves ↔ Hassan', status: 'approved', type: 'lease', value: 180000, date: '2024-01-09' },
  ],
  AML_ALERTS: [
    { id: 1, client: 'Unknown Source', type: 'large_transaction', amount: 5000000, status: 'investigating', date: '2024-01-08' },
    { id: 2, client: 'ABC Corp', type: 'suspicious_pattern', amount: 1200000, status: 'cleared', date: '2024-01-07' },
  ],
  KYCVerification: undefined,
  Contract: undefined,
  AMLAlert: undefined,
}));

vi.mock('../../data/features', () => ({
  COMPLIANCE_FEATURES: ['KYC/AML verification', 'Risk assessment', 'Contract review'],
}));

import { useComplianceData } from '../useComplianceData';

describe('useComplianceData', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Initial State ──────────────────────────────────────
  describe('Initial State', () => {
    it('returns KYC verifications from data', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.kycVerifications).toHaveLength(3);
    });

    it('returns contracts from data', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.contracts).toHaveLength(2);
    });

    it('returns AML alerts from data', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.amlAlerts).toHaveLength(2);
    });

    it('returns features array', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.features).toHaveLength(3);
      expect(result.current.features[0]).toBe('KYC/AML verification');
    });
  });

  // ── Compliance Stats ───────────────────────────────────
  describe('complianceStats', () => {
    it('counts verified KYCs', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.complianceStats.verified).toBe(1); // only id:1 is verified
    });

    it('counts pending KYCs', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.complianceStats.pending).toBe(2); // id:2 and id:3
    });

    it('counts active AML alerts (non-cleared)', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.complianceStats.amlAlerts).toBe(1); // only id:1 is investigating
    });

    it('counts total contracts', () => {
      const { result } = renderHook(() => useComplianceData());
      expect(result.current.complianceStats.contracts).toBe(2);
    });
  });

  // ── Approve Verification ───────────────────────────────
  describe('handleApproveVerification', () => {
    it('changes pending verification to verified', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveVerification(2));
      const v = result.current.kycVerifications.find(v => v.id === 2);
      expect(v?.status).toBe('verified');
    });

    it('updates complianceStats after approval', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveVerification(2));
      expect(result.current.complianceStats.verified).toBe(2);
      expect(result.current.complianceStats.pending).toBe(1);
    });

    it('does not affect other verifications', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveVerification(2));
      expect(result.current.kycVerifications[0].status).toBe('verified');
      expect(result.current.kycVerifications[2].status).toBe('pending');
    });

    it('is idempotent for already verified', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveVerification(1)); // already verified
      expect(result.current.complianceStats.verified).toBe(1);
    });
  });

  // ── Reject Verification ────────────────────────────────
  describe('handleRejectVerification', () => {
    it('changes verification to rejected', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleRejectVerification(2));
      const v = result.current.kycVerifications.find(v => v.id === 2);
      expect(v?.status).toBe('rejected');
    });

    it('updates complianceStats after rejection', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleRejectVerification(2));
      expect(result.current.complianceStats.pending).toBe(1);
      expect(result.current.complianceStats.verified).toBe(1); // unchanged
    });
  });

  // ── Approve Contract ───────────────────────────────────
  describe('handleApproveContract', () => {
    it('changes contract status to approved', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveContract(1));
      const c = result.current.contracts.find(c => c.id === 1);
      expect(c?.status).toBe('approved');
    });

    it('does not affect other contracts', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveContract(1));
      expect(result.current.contracts[1].status).toBe('approved'); // id:2 was already approved
    });

    it('total contracts count remains same', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleApproveContract(1));
      expect(result.current.complianceStats.contracts).toBe(2);
    });
  });

  // ── Resolve AML Alert ──────────────────────────────────
  describe('handleAlertResolution', () => {
    it('changes alert status to cleared', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleAlertResolution(1));
      const a = result.current.amlAlerts.find(a => a.id === 1);
      expect(a?.status).toBe('cleared');
    });

    it('updates active alerts count', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleAlertResolution(1));
      expect(result.current.complianceStats.amlAlerts).toBe(0);
    });

    it('is idempotent for already cleared', () => {
      const { result } = renderHook(() => useComplianceData());
      act(() => result.current.handleAlertResolution(2)); // already cleared
      expect(result.current.complianceStats.amlAlerts).toBe(1); // id:1 still investigating
    });
  });
});
