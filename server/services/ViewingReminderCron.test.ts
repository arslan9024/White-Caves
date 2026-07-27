import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma, mockPushNotificationService } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      viewing: {
        findMany: fn().mockResolvedValue([]),
        update: fn().mockResolvedValue({ id: 'viewing-1' }),
      },
    },
    mockPushNotificationService: {
      sendViewingReminderNotification: fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('./PushNotificationService.js', () => ({
  PushNotificationService: mockPushNotificationService,
}));

import { processViewingReminders } from './ViewingReminderCron.js';

describe('ViewingReminderCron', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find viewings in Asian/Dubai timezone 30-35 mins window and trigger push notification', async () => {
    const scheduledTime = new Date(Date.now() + 32 * 60_000); // 32 minutes from now
    
    mockPrisma.viewing.findMany.mockResolvedValue([
      {
        id: 'viewing-1',
        scheduledAt: scheduledTime,
        status: 'confirmed',
        reminderSent: false,
        property: {
          title: 'Luxury Villa Palm Jumeirah',
          address: 'Palm Jumeirah Signature Villa',
          latitude: 25.123,
          longitude: 55.456,
        },
        agent: {
          id: 'agent-123',
          name: 'Victoria',
        },
        client: {
          name: 'Hamdan Al Maktoum',
        },
      },
    ]);

    await processViewingReminders();

    // Verify Prisma query structure
    expect(mockPrisma.viewing.findMany).toHaveBeenCalled();
    const queryArgs = mockPrisma.viewing.findMany.mock.calls[0][0];
    expect(queryArgs.where.status.in).toContain('confirmed');
    expect(queryArgs.where.reminderSent.not).toBe(true);

    // Verify push notification trigger
    expect(mockPushNotificationService.sendViewingReminderNotification).toHaveBeenCalledWith(
      'agent-123',
      {
        id: 'viewing-1',
        propertyTitle: 'Luxury Villa Palm Jumeirah',
        clientName: 'Hamdan Al Maktoum',
        scheduledAt: scheduledTime,
        lat: '25.123',
        lng: '55.456',
      }
    );

    // Verify database update to mark reminder as sent
    expect(mockPrisma.viewing.update).toHaveBeenCalledWith({
      where: { id: 'viewing-1' },
      data: { reminderSent: true },
    });
  });

  it('should not send notification if reminder has already been sent', async () => {
    mockPrisma.viewing.findMany.mockResolvedValue([]);

    await processViewingReminders();

    expect(mockPushNotificationService.sendViewingReminderNotification).not.toHaveBeenCalled();
    expect(mockPrisma.viewing.update).not.toHaveBeenCalled();
  });
});
