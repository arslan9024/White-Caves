import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      notificationPreference: {
        findUnique: fn(),
      },
      notification: {
        create: fn().mockResolvedValue({
          id: 'notif-123',
          userId: 'user-1',
          title: 'Test',
          message: 'Hello',
          channel: 'in_app',
          type: 'info',
        }),
      },
    },
  };
});

vi.mock('../../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../socketServer.js', () => ({
  getSocketServer: () => ({
    emitNotification: vi.fn(),
  }),
}));
vi.mock('../PushNotificationService.js', () => ({
  PushNotificationService: {
    sendToUser: vi.fn().mockResolvedValue({}),
  },
}));

import { notificationService } from '../NotificationService.js';

describe('W24-015 Notification Preferences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends in-app notification when preferences allow in-app', async () => {
    mockPrisma.notificationPreference.findUnique.mockResolvedValueOnce({
      inApp: true,
      email: true,
      whatsapp: true,
      push: true,
    });

    await notificationService.pushToUser({
      userId: 'user-1',
      title: 'New Lead Assigned',
      message: 'You have been assigned a new lead.',
      channel: 'in_app',
    });

    expect(mockPrisma.notification.create).toHaveBeenCalled();
  });

  it('skips in-app notification when preferences disable in-app', async () => {
    mockPrisma.notificationPreference.findUnique.mockResolvedValueOnce({
      inApp: false,
      email: true,
      whatsapp: true,
      push: true,
    });

    await notificationService.pushToUser({
      userId: 'user-1',
      title: 'New Lead Assigned',
      message: 'You have been assigned a new lead.',
      channel: 'in_app',
    });

    expect(mockPrisma.notification.create).not.toHaveBeenCalled();
  });

  it('skips whatsapp notification when preferences disable whatsapp', async () => {
    mockPrisma.notificationPreference.findUnique.mockResolvedValueOnce({
      inApp: true,
      email: true,
      whatsapp: false,
      push: true,
    });

    await notificationService.pushToUser({
      userId: 'user-1',
      title: 'New Lead Assigned',
      message: 'You have been assigned a new lead.',
      channel: 'whatsapp',
    });

    expect(mockPrisma.notification.create).not.toHaveBeenCalled();
  });
});
