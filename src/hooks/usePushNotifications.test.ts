import { vi } from 'vitest';
// Set the environment variable BEFORE importing the hook to avoid ES module caching issue
vi.stubEnv('VITE_FIREBASE_VAPID_KEY', 'QkVsMzhPR0NFNkpEaDhWMHVHMDM2NlY2b05uSnRYX3Rlc3RfdmFwaWRfa2V5');
import.meta.env.VITE_FIREBASE_VAPID_KEY = 'QkVsMzhPR0NFNkpEaDhWMHVHMDM2NlY2b05uSnRYX3Rlc3RfdmFwaWRfa2V5';

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePushNotifications } from './usePushNotifications';

// Mock window, navigator, Notification, and fetch
const mockPushManager = {
  getSubscription: vi.fn().mockResolvedValue(null),
  subscribe: vi.fn(),
};

const mockServiceWorkerRegistration = {
  pushManager: mockPushManager,
};

const mockServiceWorker = {
  ready: Promise.resolve(mockServiceWorkerRegistration),
  getRegistrations: vi.fn().mockResolvedValue([]),
};

const mockFetch = vi.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ success: true }),
});

describe('usePushNotifications hook', () => {
  beforeEach(() => {
    vi.stubGlobal('PushManager', {});
    vi.stubGlobal('Notification', {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    });
    vi.stubGlobal('navigator', {
      serviceWorker: mockServiceWorker,
    });
    vi.stubGlobal('fetch', mockFetch);
    
    // Explicitly attach to window
    (window as any).PushManager = {};
    (window as any).Notification = {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    };
    
    vi.clearAllMocks();
  });

  it('should initialize with correct support and permission defaults', () => {
    const { result } = renderHook(() => usePushNotifications());
    
    expect(result.current.isSupported).toBe(true);
    expect(result.current.permission).toBe('default');
    expect(result.current.isSubscribed).toBe(false);
  });

  it('should call subscribe endpoints successfully when subscribing', async () => {
    const mockSubscriptionObj = { endpoint: 'https://fcm.googleapis.com/...', keys: { auth: '123' } };
    mockPushManager.getSubscription.mockResolvedValue(null);
    mockPushManager.subscribe.mockResolvedValue(mockSubscriptionObj);

    const { result } = renderHook(() => usePushNotifications());

    let success;
    await act(async () => {
      success = await result.current.subscribe();
    });

    if (result.current.error) {
      console.log('Hook subscription error:', result.current.error);
    }

    expect(success).toBe(true);
    expect(mockPushManager.subscribe).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith('/api/v1/push/subscribe', expect.any(Object));
    expect(result.current.isSubscribed).toBe(true);
  });

  it('should not subscribe if permission is denied', async () => {
    (window as any).Notification.permission = 'denied';
    (window as any).Notification.requestPermission.mockResolvedValue('denied');

    const { result } = renderHook(() => usePushNotifications());

    let success;
    await act(async () => {
      success = await result.current.subscribe();
    });

    expect(success).toBe(false);
    expect(mockPushManager.subscribe).not.toHaveBeenCalled();
    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.error).toBe('Notification permission was denied');
  });
});
