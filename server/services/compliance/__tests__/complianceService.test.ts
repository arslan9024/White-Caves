/**
 * Compliance Service Tests — Phase 3D
 * ────────────────────────────────────
 * Tests for: Ejari CSV export, VAT summary, compliance overview,
 * Ejari status management, BRN expiry report.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock prisma
vi.mock('../../../database.js', () => ({
  prisma: {
    user: { findMany: vi.fn(), findUnique: vi.fn(), count: vi.fn() },
    lease: { findMany: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    commission: { findMany: vi.fn() },
    property: { count: vi.fn() },
    activity: { create: vi.fn() },
  },
}));

vi.mock('../../../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import {
  generateEjariExport,
  calculateVATSummary,
  getComplianceOverview,
  updateEjariStatus,
} from '../complianceService';

import { prisma } from '../../../database.js';

const mockPrisma = prisma as unknown as {
  user: { findMany: ReturnType<typeof vi.fn>; count: ReturnType<typeof vi.fn> };
  lease: { findMany: ReturnType<typeof vi.fn>; findUnique: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };
  commission: { findMany: ReturnType<typeof vi.fn> };
  property: { count: ReturnType<typeof vi.fn> };
};

describe('complianceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── generateEjariExport ──────────────────────────────────────────

  describe('generateEjariExport', () => {
    it('should generate CSV with correct headers', async () => {
      mockPrisma.lease.findMany.mockResolvedValue([]);
      const result = await generateEjariExport();
      expect(result.csv).toContain('Lease Number');
      expect(result.csv).toContain('Tenant Name');
      expect(result.csv).toContain('Ejari Number');
      expect(result.csv).toContain('Ejari Status');
      expect(result.count).toBe(0);
    });

    it('should export lease data as CSV rows', async () => {
      mockPrisma.lease.findMany.mockResolvedValue([
        {
          leaseNumber: 'L-001',
          startDate: new Date('2026-01-01'),
          endDate: new Date('2027-01-01'),
          monthlyRent: 5000,
          currency: 'AED',
          ejariNumber: 'EJ-123',
          ejariStatus: 'registered',
          ejariRegistrationDate: new Date('2026-01-15'),
          ejariExpiryDate: new Date('2027-01-15'),
          tenant: { name: 'John Doe', email: 'john@test.com', phone: '+971501234567' },
          landlord: { name: 'Property Corp', email: 'corp@test.com' },
          property: { title: 'Apt 2301', location: 'Dubai Marina', type: 'apartment' },
        },
      ]);

      const result = await generateEjariExport();
      expect(result.count).toBe(1);
      expect(result.rows[0].leaseNumber).toBe('L-001');
      expect(result.rows[0].ejariNumber).toBe('EJ-123');
      expect(result.rows[0].tenantName).toBe('John Doe');
      expect(result.csv).toContain('L-001');
      expect(result.csv).toContain('EJ-123');
    });

    it('should handle leases without Ejari data', async () => {
      mockPrisma.lease.findMany.mockResolvedValue([
        {
          leaseNumber: 'L-002',
          startDate: new Date('2026-01-01'),
          endDate: new Date('2027-01-01'),
          monthlyRent: 8000,
          currency: 'AED',
          ejariNumber: null,
          ejariStatus: null,
          ejariRegistrationDate: null,
          ejariExpiryDate: null,
          tenant: { name: 'Jane Doe', email: 'jane@test.com', phone: '' },
          landlord: { name: 'Owner', email: 'owner@test.com' },
          property: { title: 'Villa 5', location: 'Palm Jumeirah', type: 'villa' },
        },
      ]);

      const result = await generateEjariExport();
      expect(result.rows[0].ejariNumber).toBe('');
      expect(result.rows[0].ejariStatus).toBe('pending');
    });

    it('should filter by status', async () => {
      mockPrisma.lease.findMany.mockResolvedValue([]);
      await generateEjariExport({ status: 'pending' });
      expect(mockPrisma.lease.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ ejariStatus: 'pending' }),
        }),
      );
    });
  });

  // ─── calculateVATSummary ──────────────────────────────────────────

  describe('calculateVATSummary', () => {
    it('should return zero when no commissions exist', async () => {
      mockPrisma.commission.findMany.mockResolvedValue([]);
      const result = await calculateVATSummary();
      expect(result.totals.commissions).toBe(0);
      expect(result.totals.totalVAT).toBe(0);
      expect(result.totals.grandTotal).toBe(0);
    });

    it('should apply 0% VAT for residential commissions', async () => {
      mockPrisma.commission.findMany.mockResolvedValue([
        { amount: 10000, property: { type: 'apartment' } },
        { amount: 20000, property: { type: 'villa' } },
      ]);

      const result = await calculateVATSummary();
      expect(result.residential.commissions).toBe(2);
      expect(result.residential.totalAmount).toBe(30000);
      expect(result.residential.vatRate).toBe(0);
      expect(result.residential.vatAmount).toBe(0);
    });

    it('should apply 5% VAT for commercial commissions', async () => {
      mockPrisma.commission.findMany.mockResolvedValue([
        { amount: 50000, property: { type: 'commercial' } },
      ]);

      const result = await calculateVATSummary();
      expect(result.commercial.commissions).toBe(1);
      expect(result.commercial.totalAmount).toBe(50000);
      expect(result.commercial.vatRate).toBe(5);
      expect(result.commercial.vatAmount).toBe(2500);
    });

    it('should apply default 5% VAT for unclassified commissions', async () => {
      mockPrisma.commission.findMany.mockResolvedValue([
        { amount: 10000, property: { type: 'land' } },
      ]);

      const result = await calculateVATSummary();
      expect(result.unclassified.commissions).toBe(1);
      expect(result.unclassified.vatAmount).toBe(500);
    });

    it('should calculate correct grand total', async () => {
      mockPrisma.commission.findMany.mockResolvedValue([
        { amount: 10000, property: { type: 'apartment' } },   // 0% = 0
        { amount: 50000, property: { type: 'commercial' } },   // 5% = 2500
        { amount: 20000, property: { type: null } },            // 5% = 1000
      ]);

      const result = await calculateVATSummary();
      expect(result.totals.commissions).toBe(3);
      expect(result.totals.totalAmount).toBe(80000);
      expect(result.totals.totalVAT).toBe(3500);
      expect(result.totals.grandTotal).toBe(83500);
    });
  });

  // ─── getComplianceOverview ────────────────────────────────────────

  describe('getComplianceOverview', () => {
    it('should calculate compliance percentages', async () => {
      mockPrisma.user.findMany.mockResolvedValue([
        { brnNumber: 'BRN-001', brnExpiry: new Date('2027-01-01') },  // valid
        { brnNumber: 'BRN-002', brnExpiry: new Date('2025-01-01') },  // expired
        { brnNumber: null, brnExpiry: null },                          // not set
      ]);

      mockPrisma.lease.findMany.mockResolvedValue([
        { ejariStatus: 'registered' },
        { ejariStatus: 'pending' },
      ]);

      mockPrisma.property.count
        .mockResolvedValueOnce(10)  // total
        .mockResolvedValueOnce(8);   // with docs

      const result = await getComplianceOverview();

      expect(result.brnCompliance.total).toBe(3);
      expect(result.brnCompliance.valid).toBe(1);
      expect(result.brnCompliance.expired).toBe(1);
      expect(result.brnCompliance.notSet).toBe(1);
      expect(result.ejariCompliance.totalLeases).toBe(2);
      expect(result.ejariCompliance.registered).toBe(1);
      expect(result.documentCompliance.totalProperties).toBe(10);
      expect(result.documentCompliance.withDocuments).toBe(8);
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });
  });

  // ─── updateEjariStatus ────────────────────────────────────────────

  describe('updateEjariStatus', () => {
    it('should update Ejari fields on a lease', async () => {
      mockPrisma.lease.findUnique.mockResolvedValue({
        id: 'lease-1',
        ejariNumber: null,
        ejariStatus: 'pending',
      });
      mockPrisma.lease.update.mockResolvedValue({
        id: 'lease-1',
        ejariNumber: 'EJ-456',
        ejariStatus: 'registered',
      });

      const result = await updateEjariStatus('lease-1', {
        ejariNumber: 'EJ-456',
        ejariStatus: 'registered',
        ejariRegistrationDate: new Date('2026-05-01'),
      });

      expect(mockPrisma.lease.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'lease-1' },
          data: expect.objectContaining({ ejariNumber: 'EJ-456', ejariStatus: 'registered' }),
        }),
      );
      expect(result).toBeDefined();
    });

    it('should throw for non-existent lease', async () => {
      mockPrisma.lease.findUnique.mockResolvedValue(null);
      await expect(
        updateEjariStatus('nonexistent', { ejariNumber: 'EJ-789' }),
      ).rejects.toThrow('Lease not found');
    });
  });
});
