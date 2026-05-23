import { describe, expect, it, vi } from 'vitest';

const { mockLoggerInfo } = vi.hoisted(() => ({
  mockLoggerInfo: vi.fn(),
}));

vi.mock('../../../../utils/logger.js', () => ({
  logger: {
    info: mockLoggerInfo,
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import {
  buildLindaParitySnapshot,
  emitLindaParitySnapshot,
  emitLindaParityDelta,
} from './shadowParityReporter';

function createClient(overrides?: Partial<any>) {
  const baseStats = {
    queuedMessages: 2,
    messagesSent: 10,
    messagesReceived: 7,
    reconnectAttempts: 1,
    status: 'READY',
    isConnected: true,
  };

  return {
    getStatus: () => 'READY',
    isConnected: () => true,
    getStats: () => baseStats,
    getQRCode: () => null,
    ...overrides,
  };
}

describe('shadowParityReporter', () => {
  it('builds a snapshot from client state', () => {
    const snapshot = buildLindaParitySnapshot('baseline', createClient(), 'shadow');

    expect(snapshot).toEqual(
      expect.objectContaining({
        label: 'baseline',
        mode: 'shadow',
        status: 'READY',
        isConnected: true,
        queuedMessages: 2,
        messagesSent: 10,
        messagesReceived: 7,
        reconnectAttempts: 1,
        qrCodeAvailable: false,
      })
    );
  });

  it('emits snapshot to logger', () => {
    const snapshot = buildLindaParitySnapshot('snapshot', createClient(), 'legacy');
    emitLindaParitySnapshot(snapshot);

    expect(mockLoggerInfo).toHaveBeenCalledWith('[LindaShadowParity] snapshot', snapshot);
  });

  it('emits delta with changed flags', () => {
    const baseline = buildLindaParitySnapshot('before', createClient(), 'legacy');
    const comparison = buildLindaParitySnapshot(
      'after',
      createClient({
        getStatus: () => 'RECONNECTING',
        isConnected: () => false,
        getStats: () => ({
          status: 'RECONNECTING',
          isConnected: false,
          queuedMessages: 5,
          messagesSent: 11,
          messagesReceived: 9,
          reconnectAttempts: 3,
        }),
        getQRCode: () => 'QR',
      }),
      'shadow'
    );

    emitLindaParityDelta('compare', baseline, comparison);

    expect(mockLoggerInfo).toHaveBeenCalledWith(
      '[LindaShadowParity] delta',
      expect.objectContaining({
        label: 'compare',
        baselineMode: 'legacy',
        comparisonMode: 'shadow',
        changed: expect.objectContaining({
          status: true,
          isConnected: true,
          queuedMessages: true,
          messagesSent: true,
          messagesReceived: true,
          reconnectAttempts: true,
          qrCodeAvailable: true,
        }),
      })
    );
  });
});
