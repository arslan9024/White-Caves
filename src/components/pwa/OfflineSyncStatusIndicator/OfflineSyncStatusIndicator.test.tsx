/**
 * OfflineSyncStatusIndicator.test.tsx — Unit Tests
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { OfflineSyncStatusIndicator } from './OfflineSyncStatusIndicator';

vi.mock('../../../services/PwaOfflineCacheService', () => ({
  default: {
    getStats: () => ({
      totalItems: 0,
      pendingSync: 0,
      failedItems: 0,
      lastSyncAt: null,
      isOnline: true,
      cacheVersion: '1.0.0',
    }),
    subscribe: vi.fn(() => () => {}),
  },
}));

describe('OfflineSyncStatusIndicator', () => {
  it('renders synced state when online with no pending items', () => {
    render(<OfflineSyncStatusIndicator />);
    const el = screen.getByTestId('offline-sync-indicator');
    expect(el).toBeDefined();
    expect(el.textContent).toContain('All changes synced');
  });
});
