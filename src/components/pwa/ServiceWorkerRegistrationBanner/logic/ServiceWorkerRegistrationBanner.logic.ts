/**
 * ServiceWorkerRegistrationBanner.logic.ts — Hook Layer
 */

import { useState, useEffect, useCallback } from 'react';
import pwaOfflineCacheService, { CacheStats } from '../../../../services/PwaOfflineCacheService';

export interface UseSWBannerReturn {
  isOnline: boolean;
  stats: CacheStats;
  swRegistered: boolean;
  pendingCount: number;
  handleRetryFailed: () => void;
  handlePurgeCompleted: () => void;
}

export function useServiceWorkerRegistrationBannerLogic(): UseSWBannerReturn {
  const [stats, setStats] = useState<CacheStats>(pwaOfflineCacheService.getStats());
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // Attempt Service Worker registration
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => setSwRegistered(true))
        .catch(() => setSwRegistered(false));
    }

    const unsub = pwaOfflineCacheService.subscribe(setStats);
    return unsub;
  }, []);

  const handleRetryFailed = useCallback(() => {
    pwaOfflineCacheService.retryFailed();
  }, []);

  const handlePurgeCompleted = useCallback(() => {
    pwaOfflineCacheService.purgeCompleted();
  }, []);

  return {
    isOnline: stats.isOnline,
    stats,
    swRegistered,
    pendingCount: stats.pendingSync,
    handleRetryFailed,
    handlePurgeCompleted,
  };
}
