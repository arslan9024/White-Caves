import { describe, it, expect, vi } from 'vitest';
import { requestNotificationPermission, sendLocalPushNotification } from './pushNotifications.js';

describe('PWA Push Notification Service — Wave 45 (W45-006)', () => {
  it('returns denied when Notification API is unavailable in Node/SSR environment', async () => {
    const res = await requestNotificationPermission();
    expect(res).toBe('denied');
  });

  it('returns false when Notification API is unavailable in Node/SSR environment', async () => {
    const res = await sendLocalPushNotification({
      title: 'New Lead Assigned',
      body: 'Lead Fatima Al Mansoori registered via PropertyFinder',
    });
    expect(res).toBe(false);
  });
});
