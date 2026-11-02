import type { Notification } from '../types';
import { getNotificationsPart1 } from './notificationsPart1.data';
import { getNotificationsPart2 } from './notificationsPart2.data';

export const generateNotifications = (): Record<string, Notification[]> => {
  const now = Date.now();
  return {
    ...getNotificationsPart1(now),
    ...getNotificationsPart2(now),
  };
};
