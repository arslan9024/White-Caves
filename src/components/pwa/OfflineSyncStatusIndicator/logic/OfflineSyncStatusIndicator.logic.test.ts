import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOfflineSyncStatusLogic } from './OfflineSyncStatusIndicator.logic';

describe('OfflineSyncStatusIndicator.logic', () => {
  it('returns valid sync phase and status label', () => {
    const { result } = renderHook(() => useOfflineSyncStatusLogic());

    expect(['synced', 'syncing', 'offline', 'error']).toContain(result.current.phase);
    expect(typeof result.current.label).toBe('string');
    expect(result.current.stats).toBeDefined();
  });
});
