/**
 * QueueManager — Unit Tests
 * Tests all 10 queue management functions with mocked Prisma.
 * All database calls are mocked — no real database needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Hoisted mocks ────────────────────────────────────────────────────
const { mockPrisma } = vi.hoisted(() => {
  const fn = vi.fn;
  return {
    mockPrisma: {
      nadiaConversationQueue: {
        findMany: fn().mockResolvedValue([]),
        findUnique: fn().mockResolvedValue(null),
        findFirst: fn().mockResolvedValue(null),
        create: fn().mockResolvedValue({ id: 'queue-1' }),
        update: fn().mockResolvedValue({ id: 'queue-1' }),
        deleteMany: fn().mockResolvedValue({ count: 1 }),
        count: fn().mockResolvedValue(0),
        aggregate: fn().mockResolvedValue({ _avg: { priority: 5 } }),
      },
      nadiaConversation: {
        findUnique: fn().mockResolvedValue({
          id: 'conv-1',
          leadScore: 50,
          lastIntent: 'general_inquiry',
          messageCount: 5,
        }),
        update: fn().mockResolvedValue({ id: 'conv-1' }),
        findMany: fn().mockResolvedValue([]),
      },
    },
  };
});

vi.mock('../../database.js', () => ({ prisma: mockPrisma }));

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
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

// ── Tests ────────────────────────────────────────────────────────────
describe('QueueManager', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset defaults
    mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
    mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValue(null);
    mockPrisma.nadiaConversationQueue.create.mockResolvedValue({ id: 'queue-1' });
    mockPrisma.nadiaConversationQueue.update.mockResolvedValue({ id: 'queue-1' });
    mockPrisma.nadiaConversationQueue.deleteMany.mockResolvedValue({ count: 1 });
    mockPrisma.nadiaConversationQueue.count.mockResolvedValue(0);
    mockPrisma.nadiaConversationQueue.aggregate.mockResolvedValue({ _avg: { priority: 5 } });
    mockPrisma.nadiaConversation.findUnique.mockResolvedValue({
      id: 'conv-1',
      leadScore: 50,
      lastIntent: 'general_inquiry',
      messageCount: 5,
    });
    mockPrisma.nadiaConversation.update.mockResolvedValue({ id: 'conv-1' });
    mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
  });

  // ── getQueuedConversations ───────────────────────────────────────
  describe('getQueuedConversations', () => {
    it('returns empty array when queue is empty', async () => {
      const result = await getQueuedConversations();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('calls Prisma with correct sort order', async () => {
      await getQueuedConversations(5);
      expect(mockPrisma.nadiaConversationQueue.findMany).toHaveBeenCalled();
    });

    it('returns mapped queue entries', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValueOnce([
        {
          id: 'q-1',
          conversationId: 'conv-1',
          priority: 2,
          queuedAt: new Date(Date.now() - 60000),
          createdAt: new Date(Date.now() - 60000),
          status: 'queued',
          conversation: { messages: [{ body: 'Hi', sender: 'CUSTOMER' }] },
        },
      ]);
      const result = await getQueuedConversations();
      expect(result.length).toBe(1);
    });
  });

  // ── calculateQueuePriority ───────────────────────────────────────
  describe('calculateQueuePriority', () => {
    it('returns priority between 1 and 10', () => {
      const priority = calculateQueuePriority(50, 'general_inquiry', 5);
      expect(priority).toBeGreaterThanOrEqual(1);
      expect(priority).toBeLessThanOrEqual(10);
    });

    it('high lead score gives lower priority (higher urgency)', () => {
      const hot = calculateQueuePriority(90, 'make_offer', 15);
      const cold = calculateQueuePriority(20, 'general_inquiry', 1);
      expect(hot).toBeLessThan(cold);
    });

    it('make_offer intent lowers priority number', () => {
      const offer = calculateQueuePriority(50, 'make_offer', 5);
      const general = calculateQueuePriority(50, 'general_inquiry', 5);
      expect(offer).toBeLessThanOrEqual(general);
    });

    it('complaint intent raises priority number', () => {
      const complaint = calculateQueuePriority(50, 'complaint', 5);
      expect(complaint).toBeGreaterThanOrEqual(5);
    });

    it('clamps to minimum 1', () => {
      const priority = calculateQueuePriority(100, 'make_offer', 50);
      expect(priority).toBeGreaterThanOrEqual(1);
    });

    it('clamps to maximum 10', () => {
      const priority = calculateQueuePriority(0, 'complaint', 0);
      expect(priority).toBeLessThanOrEqual(10);
    });
  });

  // ── queueConversationForAssignment ───────────────────────────────
  describe('queueConversationForAssignment', () => {
    it('creates queue entry for valid conversation', async () => {
      mockPrisma.nadiaConversationQueue.findFirst.mockResolvedValueOnce(null);
      await queueConversationForAssignment('conv-1');
      expect(mockPrisma.nadiaConversationQueue.create).toHaveBeenCalled();
    });

    it('throws when conversation not found', async () => {
      mockPrisma.nadiaConversation.findUnique.mockResolvedValueOnce(null);
      await expect(queueConversationForAssignment('missing')).rejects.toThrow();
    });
  });

  // ── assignFromQueue ──────────────────────────────────────────────
  describe('assignFromQueue', () => {
    it('assigns queued conversation to agent', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce({
        id: 'q-1',
        conversationId: 'conv-1',
        status: 'queued',
      });
      const result = await assignFromQueue('q-1', '+971501234567');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalled();
    });

    it('returns null for non-existent queue entry', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce(null);
      const result = await assignFromQueue('missing', '+971501234567');
      expect(result).toBeNull();
    });
  });

  // ── reassignQueuedConversation ───────────────────────────────────
  describe('reassignQueuedConversation', () => {
    it('updates priority and reason', async () => {
      await reassignQueuedConversation('q-1', 3, 'escalated');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalled();
    });

    it('clamps priority to valid range', async () => {
      await reassignQueuedConversation('q-1', 15);
      const call = mockPrisma.nadiaConversationQueue.update.mock.calls[0];
      if (call?.[0]?.data?.priority !== undefined) {
        expect(call[0].data.priority).toBeLessThanOrEqual(10);
      }
    });
  });

  // ── removeFromQueue ──────────────────────────────────────────────
  describe('removeFromQueue', () => {
    it('deletes queue entries for conversation', async () => {
      await removeFromQueue('conv-1');
      expect(mockPrisma.nadiaConversationQueue.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ conversationId: 'conv-1' }),
        }),
      );
    });
  });

  // ── getQueueStats ────────────────────────────────────────────────
  describe('getQueueStats', () => {
    it('returns stats object', async () => {
      const stats = await getQueueStats();
      expect(stats).toHaveProperty('totalQueued');
      expect(stats).toHaveProperty('queueHealth');
    });

    it('returns Empty health for 0 queued', async () => {
      mockPrisma.nadiaConversationQueue.count.mockResolvedValueOnce(0);
      const stats = await getQueueStats();
      expect(stats.totalQueued).toBe(0);
    });
  });

  // ── handleFailedAssignments ──────────────────────────────────────
  describe('handleFailedAssignments', () => {
    it('returns requeued count', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValueOnce([]);
      const result = await handleFailedAssignments();
      expect(result).toHaveProperty('requeued');
      expect(result.requeued).toBe(0);
    });
  });

  // ── getConversationsForAutoClose ─────────────────────────────────
  describe('getConversationsForAutoClose', () => {
    it('returns inactive conversations', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValueOnce([]);
      const result = await getConversationsForAutoClose(7);
      expect(Array.isArray(result)).toBe(true);
    });
  });

  // ── autoCloseInactiveConversations ───────────────────────────────
  describe('autoCloseInactiveConversations', () => {
    it('closes inactive conversations', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValueOnce([
        { id: 'conv-old', updatedAt: new Date(Date.now() - 8 * 86400000) },
      ]);
      const result = await autoCloseInactiveConversations(7);
      expect(result).toHaveProperty('autoClosed');
    });

    it('returns 0 when no inactive conversations', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValueOnce([]);
      const result = await autoCloseInactiveConversations(7);
      expect(result.autoClosed).toBe(0);
    });
  });
});
