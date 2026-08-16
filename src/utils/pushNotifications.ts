/**
 * PWA Push Notification Service — Wave 45 (NFR-USAB-003)
 *
 * Handles Web Push API registration & local notifications.
 */

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: Record<string, unknown>;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'denied';
  }
  return Notification.requestPermission();
}

export async function sendLocalPushNotification(payload: NotificationPayload): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || '/icon-192.png',
      tag: payload.tag || 'white-caves-alert',
      data: payload.data,
    });
    return true;
  }

  return false;
}
