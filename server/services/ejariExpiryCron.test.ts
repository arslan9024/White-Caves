import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    lease: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    activity: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { processEjariExpiries } from './ejariExpiryCron.js';

describe('ejariExpiryCron Service — Wave 33 (W33-006)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates ejariStatus to expiring for leases within 30-day window', async () => {
    const expiringDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000); // 15 days ahead
    mockPrisma.lease.findMany.mockResolvedValueOnce([
      {
        id: 'lease-101',
        leaseNumber: 'L-101',
        ejariNumber: 'EJ-998877',
        ejariExpiryDate: expiringDate,
        landlordId: 'landlord-1',
        tenantId: 'tenant-1',
      },
    ]);
    mockPrisma.lease.update.mockResolvedValueOnce({ id: 'lease-101', ejariStatus: 'expiring' });

    const result = await processEjariExpiries();

    expect(result.processedCount).toBe(1);
    expect(result.updatedLeaseIds).toEqual(['lease-101']);
    expect(mockPrisma.lease.update).toHaveBeenCalledWith({
      where: { id: 'lease-101' },
      data: { ejariStatus: 'expiring' },
    });
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'lease',
          action: 'ejari_expiring_warning',
        }),
      })
    );
  });

  it('handles empty results gracefully', async () => {
    mockPrisma.lease.findMany.mockResolvedValueOnce([]);

    const result = await processEjariExpiries();

    expect(result.processedCount).toBe(0);
    expect(result.updatedLeaseIds).toEqual([]);
    expect(mockPrisma.lease.update).not.toHaveBeenCalled();
  });
});
