import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import NotificationService from './notification.service.js';

const mockSubscription = {
  endpoint: 'https://push.example/subscription',
  keys: {
    auth: 'test-auth',
    p256dh: 'test-p256dh',
  },
};

describe('NotificationService webhook transport', () => {
  const originalWebhookUrl = process.env.PUSH_NOTIFICATION_WEBHOOK_URL;
  const originalEndpoint = process.env.PUSH_NOTIFICATION_ENDPOINT;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.PUSH_NOTIFICATION_WEBHOOK_URL = '';
    process.env.PUSH_NOTIFICATION_ENDPOINT = '';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.PUSH_NOTIFICATION_WEBHOOK_URL = originalWebhookUrl;
    process.env.PUSH_NOTIFICATION_ENDPOINT = originalEndpoint;
  });

  it('posts notifications to a configured webhook endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      statusText: 'No Content',
    });
    vi.stubGlobal('fetch', fetchMock);
    process.env.PUSH_NOTIFICATION_WEBHOOK_URL = 'https://push.example/webhook';

    const service = new NotificationService();
    service.subscribeDevice('user-1', mockSubscription as any);

    const success = await service.sendMessageNotification(
      'user-1',
      'John Doe',
      'Hello from the team',
      'conv-1'
    );

    expect(success).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://push.example/webhook',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body));
    expect(body.userId).toBe('user-1');
    expect(body.type).toBe('message_received');
    expect(body.payload.title).toBe('New message from John Doe');
    expect(body.subscription.endpoint).toBe(mockSubscription.endpoint);
  });

  it('falls back to local delivery when no webhook is configured', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const service = new NotificationService();
    service.subscribeDevice('user-1', mockSubscription as any);

    const success = await service.sendSystemAlert(
      'user-1',
      'Maintenance Alert',
      'System maintenance scheduled',
      'high'
    );

    expect(success).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
    const logs = service.getNotificationLog('user-1');
    expect(logs).toHaveLength(1);
    expect(logs[0]?.status).toBe('sent');
  });

  it('returns false when the webhook rejects delivery', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 502,
      statusText: 'Bad Gateway',
    });
    vi.stubGlobal('fetch', fetchMock);
    process.env.PUSH_NOTIFICATION_WEBHOOK_URL = 'https://push.example/webhook';

    const service = new NotificationService();
    service.subscribeDevice('user-1', mockSubscription as any);

    const success = await service.sendConversationInviteNotification(
      'user-1',
      'Jane Smith',
      'conv-2'
    );

    expect(success).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const logs = service.getNotificationLog('user-1');
    expect(logs[0]?.status).toBe('failed');
  });
});
