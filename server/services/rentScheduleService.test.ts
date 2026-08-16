import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    rentPayment: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 12 }),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    pDCSchedule: {
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      createMany: vi.fn().mockResolvedValue({ count: 12 }),
    },
    $transaction: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { generateRentSchedule, processOverdueLateFees } from './rentScheduleService.js';

describe('rentScheduleService — Wave 35 (W35-006, W35-009)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateRentSchedule', () => {
    it('generates 12 rent payments and PDC cheques for annual lease', async () => {
      const startDate = new Date('2026-03-01');
      const endDate = new Date('2027-03-01');

      const result = await generateRentSchedule({
        leaseId: 'lease-301',
        startDate,
        endDate,
        monthlyRent: 10000,
        numberOfCheques: 4,
        tenantId: 'tenant-1',
      });

      expect(result.leaseId).toBe('lease-301');
      expect(result.rentPaymentsCount).toBe(4);
      expect(result.pdcChequesCount).toBe(4);
      expect(result.totalAnnualRentAED).toBe(120000);
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('processOverdueLateFees', () => {
    it('applies RERA Day 15 late fee to overdue rent payments', async () => {
      const pastDueDate = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000); // 20 days ago
      mockPrisma.rentPayment.findMany.mockResolvedValueOnce([
        {
          id: 'pay-1',
          leaseId: 'lease-301',
          amountAED: 30000,
          dueDate: pastDueDate,
          status: 'pending',
        },
      ]);
      mockPrisma.rentPayment.update.mockResolvedValueOnce({
        id: 'pay-1',
        status: 'overdue',
        lateFeeAED: 600,
      });

      const result = await processOverdueLateFees();

      expect(result.overdueCount).toBe(1);
      expect(result.updatedIds).toEqual(['pay-1']);
      expect(mockPrisma.rentPayment.update).toHaveBeenCalledWith({
        where: { id: 'pay-1' },
        data: {
          status: 'overdue',
          lateFeeAED: 600, // 2% of 30,000 = 600
        },
      });
    });
  });
});
