/**
 * QueueManager — Unit Tests
 * Tests queue CRUD, priority calculation, stats, and auto-close logic.
 * Prisma is fully mocked — no database connection needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const prisma = {
    nadiaConversationQueue: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      findFirst: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'queue-1' }),
      update: vi.fn().mockResolvedValue({ id: 'queue-1' }),
      delete: vi.fn().mockResolvedValue({ id: 'queue-1' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      count: vi.fn().mockResolvedValue(0),
      aggregate: vi.fn().mockResolvedValue({ _avg: { priority: null }, _min: { queuedAt: null } }),
    },
    nadiaConversation: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({ id: 'conv-1' }),
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
    },
  };
  return { mockPrisma: prisma };
});

vi.mock('../../database.js', () => ({
  prisma: mockPrisma,
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
  getQueuedConversations,
  calculateQueuePriority,
  queueConversationForAssignment,
  assignFromQueue,
  reassignQueuedConversation,
  removeFromQueue,
  getQueueStats,
  handleFailedAssignments,
  getConversationsForAutoClose,
  autoCloseInactiveConversations,
} from './queueManager';

describe('QueueManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ----------------------------------------------------------------
  // calculateQueuePriority (pure function — no DB)
  // ----------------------------------------------------------------
  describe('calculateQueuePriority', () => {
    it('returns 1-10 range', () => {
      const p = calculateQueuePriority(50, 'property_search', 5);
      expect(p).toBeGreaterThanOrEqual(1);
      expect(p).toBeLessThanOrEqual(10);
    });

    it('gives HOT priority for high lead score + make_offer', () => {
      const p = calculateQueuePriority(90, 'make_offer', 15);
      expect(p).toBeLessThanOrEqual(3); // 🔥 HOT
    });

    it('gives COLD priority for low lead score + few messages', () => {
      const p = calculateQueuePriority(10, 'unknown', 1);
      expect(p).toBeGreaterThanOrEqual(7); // ❄️ COLD
    });

    it('gives WARM priority for mid-range', () => {
      const p = calculateQueuePriority(60, 'schedule_tour', 5);
      expect(p).toBeGreaterThanOrEqual(1);
      expect(p).toBeLessThanOrEqual(6);
    });

    it('complaint intent lowers priority', () => {
      const normal = calculateQueuePriority(50, 'property_search', 5);
      const complaint = calculateQueuePriority(50, 'complaint', 5);
      expect(complaint).toBeGreaterThan(normal);
    });
  });

  // ----------------------------------------------------------------
  // getQueuedConversations
  // ----------------------------------------------------------------
  describe('getQueuedConversations', () => {
    it('returns empty array when queue is empty', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
      const result = await getQueuedConversations();
      expect(result).toEqual([]);
      expect(mockPrisma.nadiaConversationQueue.findMany).toHaveBeenCalled();
    });

    it('returns queued items with priority labels', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([
        {
          id: 'q-1',
          conversationId: 'conv-1',
          priority: 2,
          customerPhone: '+971501234567',
          status: 'QUEUED',
          intent: 'make_offer',
          leadScore: 85,
          queuedAt: new Date(Date.now() - 600000),
          conversation: { messages: [{ body: 'I want to buy' }] },
        },
      ]);
      const result = await getQueuedConversations(5);
      expect(result).toHaveLength(1);
      expect(result[0].queueId).toBe('q-1');
    });

    it('respects limit parameter', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
      await getQueuedConversations(3);
      const call = mockPrisma.nadiaConversationQueue.findMany.mock.calls[0][0];
      expect(call.take).toBe(3);
    });
  });

  // ----------------------------------------------------------------
  // queueConversationForAssignment
  // ----------------------------------------------------------------
  describe('queueConversationForAssignment', () => {
    it('creates a queue entry', async () => {
      mockPrisma.nadiaConversation.findUnique.mockResolvedValue({
        id: 'conv-1',
        customerPhone: '+971501234567',
        intent: 'property_search',
        leadScore: 50,
        _count: { messages: 5 },
      });
      mockPrisma.nadiaConversationQueue.create.mockResolvedValue({ id: 'q-new' });
      await queueConversationForAssignment('conv-1');
      expect(mockPrisma.nadiaConversationQueue.create).toHaveBeenCalled();
    });

    it('uses provided reason', async () => {
      mockPrisma.nadiaConversation.findUnique.mockResolvedValue({
        id: 'conv-1',
        customerPhone: '+971501234567',
        intent: 'complaint',
        leadScore: 30,
        _count: { messages: 2 },
      });
      mockPrisma.nadiaConversationQueue.create.mockResolvedValue({ id: 'q-2' });
      await queueConversationForAssignment('conv-1', 'escalation');
      expect(mockPrisma.nadiaConversationQueue.create).toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // assignFromQueue
  // ----------------------------------------------------------------
  describe('assignFromQueue', () => {
    it('assigns queue item to agent', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValue({
        id: 'q-1',
        conversationId: 'conv-1',
        status: 'QUEUED',
      });
      mockPrisma.nadiaConversationQueue.update.mockResolvedValue({ id: 'q-1', status: 'ASSIGNED' });
      await assignFromQueue('q-1', '+971509876543');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // reassignQueuedConversation
  // ----------------------------------------------------------------
  describe('reassignQueuedConversation', () => {
    it('updates priority and reason', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValue({
        id: 'q-1',
        priority: 5,
        status: 'QUEUED',
      });
      mockPrisma.nadiaConversationQueue.update.mockResolvedValue({ id: 'q-1', priority: 2 });
      await reassignQueuedConversation('q-1', 2, 'urgent');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // removeFromQueue
  // ----------------------------------------------------------------
  describe('removeFromQueue', () => {
    it('deletes the queue entry', async () => {
      mockPrisma.nadiaConversationQueue.deleteMany.mockResolvedValue({ count: 1 });
      await removeFromQueue('conv-1');
      expect(mockPrisma.nadiaConversationQueue.deleteMany).toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // getQueueStats
  // ----------------------------------------------------------------
  describe('getQueueStats', () => {
    it('returns empty stats for empty queue', async () => {
      mockPrisma.nadiaConversationQueue.count.mockResolvedValue(0);
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
      mockPrisma.nadiaConversationQueue.aggregate.mockResolvedValue({
        _avg: { priority: null },
        _min: { queuedAt: null },
      });
      const stats = await getQueueStats();
      expect(stats.totalQueued).toBe(0);
      expect(stats.queueHealth).toBe('Empty');
    });

    it('returns Good health for small queue', async () => {
      mockPrisma.nadiaConversationQueue.count
        .mockResolvedValueOnce(3)  // total
        .mockResolvedValueOnce(1)  // hot
        .mockResolvedValueOnce(1)  // warm
        .mockResolvedValueOnce(1); // cold
      mockPrisma.nadiaConversationQueue.aggregate.mockResolvedValue({
        _avg: { priority: 4 },
        _min: { queuedAt: new Date() },
      });
      const stats = await getQueueStats();
      expect(stats.totalQueued).toBe(3);
      expect(['Good', 'Busy']).toContain(stats.queueHealth);
    });
  });

  // ----------------------------------------------------------------
  // handleFailedAssignments
  // ----------------------------------------------------------------
  describe('handleFailedAssignments', () => {
    it('returns requeued count', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
      const result = await handleFailedAssignments();
      expect(result).toHaveProperty('requeued');
      expect(result).toHaveProperty('timestamp');
      expect(result.requeued).toBe(0);
    });
  });

  // ----------------------------------------------------------------
  // getConversationsForAutoClose
  // ----------------------------------------------------------------
  describe('getConversationsForAutoClose', () => {
    it('returns empty array when no stale conversations', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
      const result = await getConversationsForAutoClose();
      expect(result).toEqual([]);
    });

    it('respects inactiveDays parameter', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
      await getConversationsForAutoClose(14);
      expect(mockPrisma.nadiaConversation.findMany).toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------
  // autoCloseInactiveConversations
  // ----------------------------------------------------------------
  describe('autoCloseInactiveConversations', () => {
    it('returns zero closed when no stale conversations', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
      const result = await autoCloseInactiveConversations();
      expect(result.autoClosed).toBe(0);
      expect(result.timestamp).toBeDefined();
    });

    it('closes stale conversations', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValue([
        { id: 'conv-old-1' },
        { id: 'conv-old-2' },
      ]);
      mockPrisma.nadiaConversation.updateMany.mockResolvedValue({ count: 2 });
      const result = await autoCloseInactiveConversations(7);
      expect(result.autoClosed).toBe(2);
    });
  });
});
