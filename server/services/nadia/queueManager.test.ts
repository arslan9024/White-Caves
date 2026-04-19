import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../database.js', () => ({
  prisma: {
    nadiaConversationQueue: { findMany: vi.fn().mockResolvedValue([]), findFirst: vi.fn().mockResolvedValue(null), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({ id: 'q1' }), delete: vi.fn().mockResolvedValue({ id: 'q1' }), deleteMany: vi.fn().mockResolvedValue({ count: 1 }), aggregate: vi.fn().mockResolvedValue({ _avg: { priority: 5 }, _count: { id: 0 } }), groupBy: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0), update: vi.fn().mockResolvedValue({ id: 'q1' }) },
    nadiaConversation: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), update: vi.fn().mockResolvedValue({}) },
  },
}));

vi.mock('../../utils/logger.js', () => ({ createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }) }));

import { calculateQueuePriority, removeFromQueue, getQueueStats, getQueuedConversations } from './queueManager';

describe('queueManager', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('calculateQueuePriority', () => {
    it('returns a number', () => { expect(typeof calculateQueuePriority({ waitTime: 5, sentiment: 'NEGATIVE', isVIP: false })).toBe('number'); });
    it('gives higher priority to VIP', () => { expect(calculateQueuePriority({ waitTime: 5, sentiment: 'NEUTRAL', isVIP: true })).toBeGreaterThanOrEqual(calculateQueuePriority({ waitTime: 5, sentiment: 'NEUTRAL', isVIP: false })); });
    it('gives higher priority to longer wait', () => { expect(calculateQueuePriority({ waitTime: 30, sentiment: 'NEUTRAL', isVIP: false })).toBeGreaterThanOrEqual(calculateQueuePriority({ waitTime: 1, sentiment: 'NEUTRAL', isVIP: false })); });
    it('gives higher priority to negative sentiment', () => { expect(calculateQueuePriority({ waitTime: 5, sentiment: 'NEGATIVE', isVIP: false })).toBeGreaterThanOrEqual(calculateQueuePriority({ waitTime: 5, sentiment: 'POSITIVE', isVIP: false })); });
  });

  describe('removeFromQueue', () => { it('resolves without error', async () => { await expect(removeFromQueue('conv-1')).resolves.not.toThrow(); }); });
  describe('getQueueStats', () => { it('returns stats object', async () => { const s = await getQueueStats(); expect(s).toBeDefined(); expect(typeof s).toBe('object'); }); });
  describe('getQueuedConversations', () => {
    it('returns array', async () => { expect(Array.isArray(await getQueuedConversations())).toBe(true); });
    it('respects limit', async () => { expect(Array.isArray(await getQueuedConversations(5))).toBe(true); });
  });
});
