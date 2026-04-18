/**
 * queueManager — Test Suite
 * ===========================
 * 22 tests: calculateQueuePriority (pure), getQueuedConversations, removeFromQueue
 *
 * Priority scoring:
 *   base = 5
 *   make_offer → -2 (higher priority = lower number)
 *   complaint  → +2 (needs attention, higher number)
 *   general    → 0
 *   leadScore ≥ 80 → -3
 *   leadScore ≥ 60 → -1
 *   leadScore ≤ 30 → +4
 *   clamped to [1, 10]
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../database.js', () => ({
  prisma: {
    nadiaConversationQueue: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: '1' }),
      update: vi.fn().mockResolvedValue({ id: '1' }),
      delete: vi.fn().mockResolvedValue({ id: '1' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      count: vi.fn().mockResolvedValue(0),
    },
    conversation: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: '1' }),
      update: vi.fn().mockResolvedValue({ id: '1' }),
      delete: vi.fn().mockResolvedValue({ id: '1' }),
    },
  },
}));

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import {
  calculateQueuePriority,
  getQueuedConversations,
  removeFromQueue,
} from './queueManager';
import { prisma } from '../../database.js';

// Get a typed reference to the mocked queue
const queueMock = prisma.nadiaConversationQueue as any;

describe('queueManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ── calculateQueuePriority (pure function) ── */

  describe('calculateQueuePriority', () => {
    it('returns base priority 5 for (50, general_inquiry, 0)', () => {
      expect(calculateQueuePriority(50, 'general_inquiry', 0)).toBe(5);
    });

    it('make_offer gets lower (better) priority than general', () => {
      const general = calculateQueuePriority(50, 'general_inquiry', 0);
      const offer = calculateQueuePriority(50, 'make_offer', 0);
      expect(offer).toBeLessThan(general);
    });

    it('complaint gets higher priority number than general', () => {
      const general = calculateQueuePriority(50, 'general_inquiry', 0);
      const complaint = calculateQueuePriority(50, 'complaint', 0);
      expect(complaint).toBeGreaterThan(general);
    });

    it('high lead score (≥80) gives -3 adjustment', () => {
      const normal = calculateQueuePriority(50, 'general_inquiry', 0);
      const high = calculateQueuePriority(80, 'general_inquiry', 0);
      expect(high).toBe(normal - 3);
    });

    it('moderate lead score (≥60) gives -1 adjustment', () => {
      const normal = calculateQueuePriority(50, 'general_inquiry', 0);
      const moderate = calculateQueuePriority(60, 'general_inquiry', 0);
      expect(moderate).toBe(normal - 1);
    });

    it('low lead score (≤30) gives +4 adjustment', () => {
      const normal = calculateQueuePriority(50, 'general_inquiry', 0);
      const low = calculateQueuePriority(30, 'general_inquiry', 0);
      expect(low).toBe(normal + 4);
    });

    it('result is always clamped between 1 and 10', () => {
      // Very high priority scenario
      const veryHigh = calculateQueuePriority(100, 'make_offer', 20);
      expect(veryHigh).toBeGreaterThanOrEqual(1);
      expect(veryHigh).toBeLessThanOrEqual(10);

      // Very low priority scenario
      const veryLow = calculateQueuePriority(0, 'complaint', 0);
      expect(veryLow).toBeGreaterThanOrEqual(1);
      expect(veryLow).toBeLessThanOrEqual(10);
    });

    it('handles edge case: leadScore = 0', () => {
      const result = calculateQueuePriority(0, 'general_inquiry', 0);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('handles edge case: leadScore = 100', () => {
      const result = calculateQueuePriority(100, 'general_inquiry', 0);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it('higher message count adjusts priority', () => {
      const noMsgs = calculateQueuePriority(50, 'general_inquiry', 0);
      const manyMsgs = calculateQueuePriority(50, 'general_inquiry', 15);
      expect(manyMsgs).not.toBe(noMsgs);
    });

    it('returns a number type', () => {
      expect(typeof calculateQueuePriority(50, 'general_inquiry', 0)).toBe('number');
    });

    it('is deterministic', () => {
      const a = calculateQueuePriority(75, 'make_offer', 5);
      const b = calculateQueuePriority(75, 'make_offer', 5);
      expect(a).toBe(b);
    });

    it('schedule_tour gets better priority than general', () => {
      const general = calculateQueuePriority(50, 'general_inquiry', 0);
      const tour = calculateQueuePriority(50, 'schedule_tour', 0);
      expect(tour).toBeLessThanOrEqual(general);
    });
  });

  /* ── getQueuedConversations ── */

  describe('getQueuedConversations', () => {
    it('calls findMany on the queue table', async () => {
      await getQueuedConversations();
      expect(queueMock.findMany).toHaveBeenCalled();
    });

    it('returns empty array when no queued conversations', async () => {
      queueMock.findMany.mockResolvedValue([]);
      const result = await getQueuedConversations();
      expect(result).toEqual([]);
    });

    it('returns queued conversations from database', async () => {
      const mockData = [
        {
          id: '1',
          priority: 3,
          queuedAt: new Date(),
          conversation: {
            id: 'c1',
            customerPhone: '+971501234567',
            status: 'active',
            intent: 'PROPERTY_INQUIRY',
            leadScore: 70,
            messages: [{ body: 'Hello' }],
          },
        },
      ];
      queueMock.findMany.mockResolvedValue(mockData);
      const result = await getQueuedConversations();
      expect(result).toHaveLength(1);
      expect(result[0].conversationId).toBe('c1');
    });

    it('handles database errors gracefully', async () => {
      queueMock.findMany.mockRejectedValue(new Error('DB error'));
      await expect(getQueuedConversations()).rejects.toThrow();
    });
  });

  /* ── removeFromQueue ── */

  describe('removeFromQueue', () => {
    it('calls deleteMany on the queue table', async () => {
      await removeFromQueue('c1');
      expect(queueMock.deleteMany).toHaveBeenCalledWith({
        where: { conversationId: 'c1' },
      });
    });

    it('removes by conversationId', async () => {
      await removeFromQueue('test-conv');
      expect(queueMock.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { conversationId: 'test-conv' } }),
      );
    });

    it('handles database errors', async () => {
      queueMock.deleteMany.mockRejectedValueOnce(new Error('DB error'));
      await expect(removeFromQueue('any')).rejects.toThrow();
    });
  });
});
