/**
 * ServiceWorkerRegistrationBanner.test.tsx — Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ServiceWorkerRegistrationBanner } from './ServiceWorkerRegistrationBanner';

vi.mock('../../../services/PwaOfflineCacheService', () => ({
  default: {
    getStats: () => ({
      totalItems: 2,
      pendingSync: 1,
      failedItems: 1,
      lastSyncAt: null,
      isOnline: true,
      cacheVersion: '1.0.0',
    }),
    subscribe: vi.fn(() => () => {}),
    retryFailed: vi.fn(),
    purgeCompleted: vi.fn(),
  },
}));

Object.defineProperty(window, 'navigator', {
  value: { onLine: true, serviceWorker: { register: vi.fn().mockResolvedValue({}) } },
  writable: true,
});

describe('ServiceWorkerRegistrationBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders online status with PWA badge', () => {
    render(<ServiceWorkerRegistrationBanner />);
    expect(screen.getByTestId('sw-registration-banner')).toBeDefined();
    expect(screen.getByText(/Online — White Caves CRM/i)).toBeDefined();
  });

  it('shows pending sync count badge', () => {
    render(<ServiceWorkerRegistrationBanner />);
    expect(screen.getByText(/1 pending sync/i)).toBeDefined();
  });

  it('shows failed count and retry button', () => {
    render(<ServiceWorkerRegistrationBanner />);
    expect(screen.getByText(/1 failed/i)).toBeDefined();
    const retryBtn = screen.getByText(/Retry/i);
    expect(retryBtn).toBeDefined();
    fireEvent.click(retryBtn);
  });
});
