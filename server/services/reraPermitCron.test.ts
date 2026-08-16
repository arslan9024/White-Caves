import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    property: {
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

import { processExpiredReraPermits } from './reraPermitCron.js';

describe('reraPermitCron Service — Wave 34 (W34-002)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('unpublishes properties with expired RERA permits', async () => {
    const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // yesterday
    mockPrisma.property.findMany.mockResolvedValueOnce([
      {
        id: 'prop-202',
        title: 'Penthouse Marina',
        reraPermitNumber: 'RERA-71234-2023',
        reraPermitExpiryDate: expiredDate,
        userId: 'agent-1',
      },
    ]);
    mockPrisma.property.update.mockResolvedValueOnce({
      id: 'prop-202',
      status: 'off_market',
      inventoryStage: 'draft_collected',
    });

    const result = await processExpiredReraPermits();

    expect(result.unpublishedCount).toBe(1);
    expect(result.unpublishedPropertyIds).toEqual(['prop-202']);
    expect(mockPrisma.property.update).toHaveBeenCalledWith({
      where: { id: 'prop-202' },
      data: {
        status: 'off_market',
        inventoryStage: 'draft_collected',
      },
    });
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'property',
          action: 'rera_permit_expired_unpublish',
        }),
      })
    );
  });

  it('handles zero expired permits cleanly', async () => {
    mockPrisma.property.findMany.mockResolvedValueOnce([]);

    const result = await processExpiredReraPermits();

    expect(result.unpublishedCount).toBe(0);
    expect(result.unpublishedPropertyIds).toEqual([]);
    expect(mockPrisma.property.update).not.toHaveBeenCalled();
  });
});
