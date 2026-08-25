import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useServiceWorkerRegistrationBannerLogic } from './ServiceWorkerRegistrationBanner.logic';

describe('ServiceWorkerRegistrationBanner.logic', () => {
  it('initializes service worker logic with offline cache stats', () => {
    const { result } = renderHook(() => useServiceWorkerRegistrationBannerLogic());

    expect(typeof result.current.isOnline).toBe('boolean');
    expect(result.current.stats).toBeDefined();
    expect(typeof result.current.handleRetryFailed).toBe('function');
    expect(typeof result.current.handlePurgeCompleted).toBe('function');
  });
});
