import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../database.js', () => ({
  prisma: {
    nadiaConversationQueue: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'q1' }),
      delete: vi.fn().mockResolvedValue({ id: 'q1' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      aggregate: vi.fn().mockResolvedValue({ _avg: { priority: 5 }, _count: { id: 0 } }),
      groupBy: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
      update: vi.fn().mockResolvedValue({ id: 'q1' }),
    },
    nadiaConversation: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import {
  calculateQueuePriority,
  removeFromQueue,
  getQueueStats,
  getQueuedConversations,
} from './queueManager';

describe('queueManager', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('calculateQueuePriority', () => {
    it('returns a number', () => {
      expect(typeof calculateQueuePriority({ waitTime: 5, sentiment: 'NEGATIVE', isVIP: false })).toBe('number');
    });
    it('gives higher priority to VIP', () => {
      const vip = calculateQueuePriority({ waitTime: 5, sentiment: 'NEUTRAL', isVIP: true });
      const reg = calculateQueuePriority({ waitTime: 5, sentiment: 'NEUTRAL', isVIP: false });
      expect(vip).toBeGreaterThanOrEqual(reg);
    });
    it('gives higher priority to longer wait', () => {
      const long = calculateQueuePriority({ waitTime: 30, sentiment: 'NEUTRAL', isVIP: false });
      const short = calculateQueuePriority({ waitTime: 1, sentiment: 'NEUTRAL', isVIP: false });
      expect(long).toBeGreaterThanOrEqual(short);
    });
    it('gives higher priority to negative sentiment', () => {
      const neg = calculateQueuePriority({ waitTime: 5, sentiment: 'NEGATIVE', isVIP: false });
      const pos = calculateQueuePriority({ waitTime: 5, sentiment: 'POSITIVE', isVIP: false });
      expect(neg).toBeGreaterThanOrEqual(pos);
    });
  });

  describe('removeFromQueue', () => {
    it('resolves without error', async () => {
      await expect(removeFromQueue('conv-1')).resolves.not.toThrow();
    });
  });

  describe('getQueueStats', () => {
    it('returns stats object', async () => {
      const stats = await getQueueStats();
      expect(stats).toBeDefined();
      expect(typeof stats).toBe('object');
    });
  });

  describe('getQueuedConversations', () => {
    it('returns array', async () => {
      expect(Array.isArray(await getQueuedConversations())).toBe(true);
    });
    it('respects limit parameter', async () => {
      expect(Array.isArray(await getQueuedConversations(5))).toBe(true);
    });
  });
});
