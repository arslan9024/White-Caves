import { describe, it, expect, vi, beforeEach } from 'vitest';

const {
  mockFindUnique,
  mockUpdate,
  mockFindMany,
  mockBroadcastMessage,
  mockCanSend,
  mockGetStatus,
  mockInitialize,
} = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockUpdate: vi.fn(),
  mockFindMany: vi.fn(),
  mockBroadcastMessage: vi.fn(),
  mockCanSend: vi.fn(),
  mockGetStatus: vi.fn(),
  mockInitialize: vi.fn(),
}));

vi.mock('../../database.js', () => ({
  prisma: {
    lindaBroadcastCampaign: {
      findUnique: mockFindUnique,
      update: mockUpdate,
      findMany: mockFindMany,
    },
  },
}));

vi.mock('./lindaClient.js', () => ({
  LindaStatus: {
    DISCONNECTED: 'DISCONNECTED',
    AUTHENTICATING: 'AUTHENTICATING',
    READY: 'READY',
    RECONNECTING: 'RECONNECTING',
    ERROR: 'ERROR',
  },
  getLindaClient: () => ({
    getStatus: mockGetStatus,
    initialize: mockInitialize,
    broadcastMessage: mockBroadcastMessage,
  }),
}));

vi.mock('./whatsappUtils.js', () => ({
  rateLimiter: {
    canSend: mockCanSend,
  },
}));

vi.mock('../../config/env.js', () => ({
  LINDA_ENABLED: true,
}));

vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

import {
  dispatchLindaCampaign,
  dispatchDueLindaCampaigns,
  runLindaCampaignSchedulerTick,
} from './lindaCampaignService.js';

describe('lindaCampaignService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetStatus.mockReturnValue('READY');
    mockInitialize.mockResolvedValue(undefined);
    mockBroadcastMessage.mockResolvedValue([{ phone: '971500000001', messageId: 'msg-1' }]);
    mockCanSend.mockReturnValue({ allowed: true, retryAfterMs: 0 });

    mockFindUnique.mockResolvedValue({
      id: 'camp-1',
      status: 'scheduled',
      targetList: ['+971 50 000 0001'],
      messageTemplate: 'Hello {{name}}',
      templateVars: { name: 'Sara' },
    });

    mockUpdate
      .mockResolvedValueOnce({ id: 'camp-1', status: 'running' })
      .mockResolvedValueOnce({ id: 'camp-1', status: 'completed', sentCount: 1, failedCount: 0 });

    mockFindMany.mockResolvedValue([{ id: 'camp-1' }]);
  });

  it('dispatches a campaign and updates completion counters', async () => {
    const result = await dispatchLindaCampaign('camp-1');

    expect(result.status).toBe('completed');
    expect(mockBroadcastMessage).toHaveBeenCalledTimes(1);
    expect(mockUpdate).toHaveBeenCalledTimes(2);
    expect(mockUpdate).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { id: 'camp-1' },
        data: expect.objectContaining({ sentCount: 1, failedCount: 0 }),
      })
    );
  });

  it('rejects dispatch from non-dispatchable status', async () => {
    mockFindUnique.mockResolvedValueOnce({
      id: 'camp-2',
      status: 'completed',
      targetList: ['971500000001'],
      messageTemplate: 'Hello',
      templateVars: null,
    });

    await expect(dispatchLindaCampaign('camp-2')).rejects.toThrow(
      'Campaign cannot be dispatched from status: completed'
    );
    expect(mockBroadcastMessage).not.toHaveBeenCalled();
  });

  it('dispatches due campaigns and returns summary', async () => {
    const summary = await dispatchDueLindaCampaigns();

    expect(summary).toEqual(
      expect.objectContaining({
        due: 1,
        dispatched: 1,
        failed: 0,
      })
    );
  });

  it('scheduler tick runs once and returns ran', async () => {
    const status = await runLindaCampaignSchedulerTick();
    expect(status).toBe('ran');
  });
});
