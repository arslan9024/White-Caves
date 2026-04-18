import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../database.js', () => {
  const mockQueue = {
    create: vi.fn().mockResolvedValue({ id: 'q1', conversationId: 'c1', status: 'queued', priority: 3, queuedAt: new Date() }),
    findMany: vi.fn().mockResolvedValue([]),
    findFirst: vi.fn().mockResolvedValue(null),
    findUnique: vi.fn().mockResolvedValue(null),
    update: vi.fn().mockResolvedValue({ id: 'q1', status: 'assigned' }),
    updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    count: vi.fn().mockResolvedValue(0),
    aggregate: vi.fn().mockResolvedValue({ _avg: { priority: 5 } }),
  };
  const mockConversation = {
    findUnique: vi.fn().mockResolvedValue({ id: 'c1', leadScore: 50, intent: 'property_search', status: 'active' }),
    update: vi.fn().mockResolvedValue({ id: 'c1' }),
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  };
  return {
    prisma: {
      nadiaConversationQueue: mockQueue,
      nadiaConversation: mockConversation,
      $transaction: vi.fn().mockImplementation((cb) => cb({ nadiaConversationQueue: mockQueue, nadiaConversation: mockConversation })),
    },
  };
});

import { calculateQueuePriority, removeFromQueue, getQueueStats } from './queueManager';
import { prisma } from '../../database.js';

const queueMock = prisma.nadiaConversationQueue as any;

describe('QueueManager', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe('calculateQueuePriority', () => {
    it('returns number', () => { expect(typeof calculateQueuePriority(50, 'property_search', 5)).toBe('number'); });
    it('base priority around 5', () => { const p = calculateQueuePriority(50, 'general_inquiry', 0); expect(p).toBeGreaterThanOrEqual(1); expect(p).toBeLessThanOrEqual(10); });
    it('high lead score lowers priority (hotter)', () => {
      const hot = calculateQueuePriority(90, 'make_offer', 15);
      const cold = calculateQueuePriority(20, 'general_inquiry', 1);
      expect(hot).toBeLessThan(cold);
    });
    it('make_offer is highest priority', () => {
      const p = calculateQueuePriority(90, 'make_offer', 15);
      expect(p).toBeLessThanOrEqual(3);
    });
    it('complaint is low priority', () => {
      const p = calculateQueuePriority(30, 'complaint', 1);
      expect(p).toBeGreaterThanOrEqual(5);
    });
    it('clamped to 1-10', () => {
      expect(calculateQueuePriority(100, 'make_offer', 100)).toBeGreaterThanOrEqual(1);
      expect(calculateQueuePriority(0, 'complaint', 0)).toBeLessThanOrEqual(10);
    });
    it('more messages = higher priority', () => {
      const many = calculateQueuePriority(50, 'property_search', 15);
      const few = calculateQueuePriority(50, 'property_search', 1);
      expect(many).toBeLessThanOrEqual(few);
    });
    it('schedule_tour is warm', () => {
      const p = calculateQueuePriority(60, 'schedule_tour', 5);
      expect(p).toBeLessThanOrEqual(5);
    });
    it('financing reduces priority number', () => {
      const fin = calculateQueuePriority(50, 'financing', 5);
      const gen = calculateQueuePriority(50, 'general_inquiry', 5);
      expect(fin).toBeLessThanOrEqual(gen);
    });
  });

  describe('removeFromQueue', () => {
    it('calls deleteMany', async () => {
      await removeFromQueue('c1');
      expect(queueMock.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ conversationId: 'c1' }) }),
      );
    });
    it('returns result', async () => {
      const r = await removeFromQueue('c1');
      expect(r).toBeDefined();
      expect(r.count).toBe(1);
    });
  });

  describe('getQueueStats', () => {
    it('returns object', async () => {
      const s = await getQueueStats();
      expect(s).toBeDefined();
      expect(typeof s).toBe('object');
    });
  });
});
