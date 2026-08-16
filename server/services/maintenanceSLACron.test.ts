import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    maintenance: {
      findMany: vi.fn(),
      update: vi.fn(),
    },
    activity: {
      create: vi.fn().mockResolvedValue({ id: 'act-1' }),
    },
  },
}));

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

import { processMaintenanceSLAChecks } from './maintenanceSLACron.js';

describe('maintenanceSLACron Service — Wave 36 (W36-004)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('flags maintenance requests past SLA deadline as breached', async () => {
    const expiredDeadline = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    mockPrisma.maintenance.findMany.mockResolvedValueOnce([
      {
        id: 'maint-801',
        title: 'AC Leak',
        priority: 'emergency',
        slaDeadline: expiredDeadline,
        requesterId: 'tenant-1',
        contractorName: 'Cooling Experts',
      },
    ]);
    mockPrisma.maintenance.update.mockResolvedValueOnce({
      id: 'maint-801',
      slaBreached: true,
    });

    const result = await processMaintenanceSLAChecks();

    expect(result.breachedCount).toBe(1);
    expect(result.breachedIds).toEqual(['maint-801']);
    expect(mockPrisma.maintenance.update).toHaveBeenCalledWith({
      where: { id: 'maint-801' },
      data: { slaBreached: true },
    });
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'maintenance',
          action: 'sla_breached_alert',
        }),
      })
    );
  });

  it('handles zero SLA breaches cleanly', async () => {
    mockPrisma.maintenance.findMany.mockResolvedValueOnce([]);

    const result = await processMaintenanceSLAChecks();

    expect(result.breachedCount).toBe(0);
    expect(result.breachedIds).toEqual([]);
    expect(mockPrisma.maintenance.update).not.toHaveBeenCalled();
  });
});
