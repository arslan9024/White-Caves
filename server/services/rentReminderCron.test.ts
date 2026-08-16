import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    rentPayment: {
      findMany: vi.fn(),
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

import { processRentReminders } from './rentReminderCron.js';

describe('rentReminderCron Service — Wave 35 (W35-008)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends rent payment reminders for upcoming payments', async () => {
    const upcomingDueDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 days ahead
    mockPrisma.rentPayment.findMany.mockResolvedValueOnce([
      {
        id: 'pay-501',
        installment: 2,
        amountAED: 10000,
        dueDate: upcomingDueDate,
        leaseId: 'lease-101',
        lease: {
          id: 'lease-101',
          leaseNumber: 'L-101',
          tenantId: 'tenant-1',
          landlordId: 'landlord-1',
          property: { title: 'Marina Villa' },
          tenant: { name: 'Ali Mohamed', phone: '+971501234567', email: 'ali@test.ae' },
        },
      },
    ]);

    const result = await processRentReminders();

    expect(result.remindersSentCount).toBe(1);
    expect(result.notifiedPaymentIds).toEqual(['pay-501']);
    expect(mockPrisma.activity.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          type: 'lease',
          action: 'rent_due_reminder_sent',
        }),
      })
    );
  });

  it('handles empty results cleanly', async () => {
    mockPrisma.rentPayment.findMany.mockResolvedValueOnce([]);

    const result = await processRentReminders();

    expect(result.remindersSentCount).toBe(0);
    expect(result.notifiedPaymentIds).toEqual([]);
    expect(mockPrisma.activity.create).not.toHaveBeenCalled();
  });
});
