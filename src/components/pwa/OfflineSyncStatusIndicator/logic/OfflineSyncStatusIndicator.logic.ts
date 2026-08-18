/**
 * OfflineSyncStatusIndicator.logic.ts — Hook Layer
 */

import { useState, useEffect } from 'react';
import pwaOfflineCacheService, { CacheStats } from '../../../../services/PwaOfflineCacheService';

export type SyncPhase = 'synced' | 'syncing' | 'offline' | 'error';

export interface UseOfflineSyncReturn {
  phase: SyncPhase;
  stats: CacheStats;
  label: string;
}

function derivePhase(stats: CacheStats): SyncPhase {
  if (!stats.isOnline) return 'offline';
  if (stats.failedItems > 0) return 'error';
  if (stats.pendingSync > 0) return 'syncing';
  return 'synced';
}

function deriveLabel(phase: SyncPhase, stats: CacheStats): string {
  switch (phase) {
    case 'offline':
      return 'Offline — changes will sync when reconnected';
    case 'error':
      return `${stats.failedItems} item(s) failed to sync — tap to retry`;
    case 'syncing':
      return `Syncing ${stats.pendingSync} item(s)…`;
    default:
      return 'All changes synced';
  }
}

export function useOfflineSyncStatusLogic(): UseOfflineSyncReturn {
  const [stats, setStats] = useState<CacheStats>(pwaOfflineCacheService.getStats());

  useEffect(() => {
    return pwaOfflineCacheService.subscribe(setStats);
  }, []);

  const phase = derivePhase(stats);
  return { phase, stats, label: deriveLabel(phase, stats) };
}
