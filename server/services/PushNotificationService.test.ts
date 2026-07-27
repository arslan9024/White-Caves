import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma, mockFirebaseAdmin } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      userPushToken: {
        findMany: fn().mockResolvedValue([]),
        deleteMany: fn().mockResolvedValue({ count: 0 }),
      },
    },
    mockFirebaseAdmin: {
      messaging: fn().mockReturnValue({
        sendEach: fn().mockResolvedValue({
          responses: [{ success: true }],
        }),
      }),
    },
  };
});

vi.mock('../database.js', () => ({ prisma: mockPrisma }));
vi.mock('firebase-admin', () => ({ default: mockFirebaseAdmin }));

import { PushNotificationService } from './PushNotificationService.js';

describe('PushNotificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendToUser', () => {
    it('should send notification to registered tokens', async () => {
      mockPrisma.userPushToken.findMany.mockResolvedValue([
        { token: 'token-123' },
        { token: 'token-456' },
      ]);

      await PushNotificationService.sendToUser('user-123', {
        title: 'Test Notification',
        body: 'This is a test',
        url: '/crm/leads',
      });

      expect(mockPrisma.userPushToken.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-123' },
      });
      expect(mockFirebaseAdmin.messaging().sendEach).toHaveBeenCalledWith([
        {
          token: 'token-123',
          notification: { title: 'Test Notification', body: 'This is a test' },
          data: { url: '/crm/leads' },
        },
        {
          token: 'token-456',
          notification: { title: 'Test Notification', body: 'This is a test' },
          data: { url: '/crm/leads' },
        },
      ]);
    });

    it('should clean up stale tokens if FCM returns token-not-registered error', async () => {
      mockPrisma.userPushToken.findMany.mockResolvedValue([
        { token: 'stale-token' },
        { token: 'active-token' },
      ]);

      mockFirebaseAdmin.messaging().sendEach.mockResolvedValue({
        responses: [
          {
            success: false,
            error: { code: 'messaging/registration-token-not-registered' },
          },
          { success: true },
        ],
      });

      await PushNotificationService.sendToUser('user-123', {
        title: 'Test Clean',
        body: 'Stale token test',
      });

      expect(mockPrisma.userPushToken.deleteMany).toHaveBeenCalledWith({
        where: { token: { in: ['stale-token'] } },
      });
    });

    it('should gracefully skip if FCM has no tokens registered', async () => {
      mockPrisma.userPushToken.findMany.mockResolvedValue([]);

      await PushNotificationService.sendToUser('user-123', {
        title: 'No tokens',
        body: 'Hello',
      });

      expect(mockFirebaseAdmin.messaging).not.toHaveBeenCalled();
    });
  });

  describe('sendLeadAssignedNotification', () => {
    it('should construct correct payload and send', async () => {
      mockPrisma.userPushToken.findMany.mockResolvedValue([{ token: 'token-123' }]);

      await PushNotificationService.sendLeadAssignedNotification('user-123', {
        id: 'lead-1',
        name: 'Sarah Smith',
        area: 'Palm Jumeirah',
        budget: '500k AED',
        phone: '+971555555555',
      });

      expect(mockFirebaseAdmin.messaging().sendEach).toHaveBeenCalledWith([
        {
          token: 'token-123',
          notification: {
            title: '🆕 New Lead Assigned',
            body: 'Sarah Smith — Palm Jumeirah | Budget: 500k AED',
            icon: '/generated-icon.png',
          },
          data: {
            type: 'lead_assigned',
            entityId: 'lead-1',
            url: '/crm/leads/lead-1',
            phone: '+971555555555',
            lat: '',
            lng: '',
            tag: 'lead-lead-1',
          },
        },
      ]);
    });
  });
});
