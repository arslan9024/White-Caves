/**
 * Queue Manager — Tests
 * Tests: calculateQueuePriority, getQueuedConversations, queueConversationForAssignment,
 * assignFromQueue, reassignQueuedConversation, removeFromQueue, getQueueStats,
 * handleFailedAssignments, getConversationsForAutoClose, autoCloseInactiveConversations
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Mock Prisma (using vi.hoisted for factory hoisting) ────────────
const { mockPrisma } = vi.hoisted(() => {
  const mockPrisma = {
    nadiaConversationQueue: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: 'q-1', conversationId: 'conv-1', priority: 5 }),
      update: vi.fn().mockResolvedValue({ id: 'q-1' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
      count: vi.fn().mockResolvedValue(0),
      aggregate: vi.fn().mockResolvedValue({ _avg: { priority: 5 } }),
    },
    nadiaConversation: {
      findUnique: vi.fn().mockResolvedValue({
        id: 'conv-1',
        leadScore: 70,
        intent: 'property_search',
        status: 'active',
      }),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({ id: 'conv-1' }),
    },
  };
  return { mockPrisma };
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
  calculateQueuePriority,
  getQueuedConversations,
  queueConversationForAssignment,
  assignFromQueue,
  reassignQueuedConversation,
  removeFromQueue,
  getQueueStats,
  handleFailedAssignments,
  autoCloseInactiveConversations,
} from './queueManager';

describe('QueueManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── calculateQueuePriority ─────────────────────────────────────
  describe('calculateQueuePriority', () => {
    it('should return base priority 5 for neutral values', () => {
      const priority = calculateQueuePriority(50, 'general_inquiry', 0);
      expect(priority).toBe(5);
    });

    it('should return priority 1-3 for hot leads', () => {
      const priority = calculateQueuePriority(90, 'make_offer', 15);
      expect(priority).toBeGreaterThanOrEqual(1);
      expect(priority).toBeLessThanOrEqual(3);
    });

    it('should return higher priority for make_offer intent', () => {
      const neutral = calculateQueuePriority(50, 'general_inquiry', 0);
      const offer = calculateQueuePriority(50, 'make_offer', 0);
      expect(offer).toBeLessThan(neutral); // Lower number = higher priority
    });

    it('should return higher priority for schedule_tour intent', () => {
      const neutral = calculateQueuePriority(50, 'general_inquiry', 0);
      const tour = calculateQueuePriority(50, 'schedule_tour', 0);
      expect(tour).toBeLessThan(neutral);
    });

    it('should lower priority for complaints', () => {
      const neutral = calculateQueuePriority(50, 'general_inquiry', 0);
      const complaint = calculateQueuePriority(50, 'complaint', 0);
      expect(complaint).toBeGreaterThan(neutral); // Higher number = lower priority
    });

    it('should boost priority for high lead scores', () => {
      const low = calculateQueuePriority(20, 'general_inquiry', 0);
      const high = calculateQueuePriority(90, 'general_inquiry', 0);
      expect(high).toBeLessThan(low); // Higher score = lower priority number
    });

    it('should boost priority for high engagement', () => {
      const low = calculateQueuePriority(50, 'general_inquiry', 1);
      const high = calculateQueuePriority(50, 'general_inquiry', 15);
      expect(high).toBeLessThan(low);
    });

    it('should clamp to minimum 1', () => {
      const priority = calculateQueuePriority(100, 'make_offer', 20);
      expect(priority).toBeGreaterThanOrEqual(1);
    });

    it('should clamp to maximum 10', () => {
      const priority = calculateQueuePriority(0, 'complaint', 0);
      expect(priority).toBeLessThanOrEqual(10);
    });

    it('should return integer', () => {
      const priority = calculateQueuePriority(55, 'financing', 7);
      expect(Number.isInteger(priority)).toBe(true);
    });
  });

  // ─── getQueuedConversations ─────────────────────────────────────
  describe('getQueuedConversations', () => {
    it('should return empty array when queue is empty', async () => {
      const result = await getQueuedConversations();
      expect(result).toEqual([]);
    });

    it('should call prisma with correct parameters', async () => {
      await getQueuedConversations(5);
      expect(mockPrisma.nadiaConversationQueue.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });

    it('should default to limit of 10', async () => {
      await getQueuedConversations();
      expect(mockPrisma.nadiaConversationQueue.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
    });
  });

  // ─── queueConversationForAssignment ────────────────────────────
  describe('queueConversationForAssignment', () => {
    it('should create queue entry for new conversation', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce(null);
      await queueConversationForAssignment('conv-1');
      expect(mockPrisma.nadiaConversationQueue.create).toHaveBeenCalled();
    });

    it('should update existing queue entry', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce({
        id: 'q-1',
        conversationId: 'conv-1',
      });
      await queueConversationForAssignment('conv-1');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalled();
    });

    it('should throw for non-existent conversation', async () => {
      mockPrisma.nadiaConversation.findUnique.mockResolvedValueOnce(null);
      await expect(queueConversationForAssignment('unknown')).rejects.toThrow();
    });
  });

  // ─── assignFromQueue ───────────────────────────────────────────
  describe('assignFromQueue', () => {
    it('should return null for non-existent queue entry', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce(null);
      const result = await assignFromQueue('unknown', '+971501234567');
      expect(result).toBeNull();
    });

    it('should update queue status to assigned', async () => {
      mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce({
        id: 'q-1',
        conversationId: 'conv-1',
        conversation: { id: 'conv-1' },
      });
      mockPrisma.nadiaConversationQueue.update.mockResolvedValueOnce({
        id: 'q-1',
        status: 'assigned',
      });

      await assignFromQueue('q-1', '+971501234567');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ status: 'assigned' }),
        }),
      );
    });
  });

  // ─── reassignQueuedConversation ────────────────────────────────
  describe('reassignQueuedConversation', () => {
    it('should update priority', async () => {
      await reassignQueuedConversation('q-1', 3);
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ priority: 3 }),
        }),
      );
    });

    it('should clamp priority to 1-10 range', async () => {
      await reassignQueuedConversation('q-1', 15);
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ priority: 10 }),
        }),
      );
    });
  });

  // ─── removeFromQueue ───────────────────────────────────────────
  describe('removeFromQueue', () => {
    it('should delete queue entries for conversation', async () => {
      await removeFromQueue('conv-1');
      expect(mockPrisma.nadiaConversationQueue.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { conversationId: 'conv-1' },
        }),
      );
    });
  });

  // ─── getQueueStats ─────────────────────────────────────────────
  describe('getQueueStats', () => {
    it('should return stats object with expected fields', async () => {
      const stats = await getQueueStats();
      expect(stats).toHaveProperty('totalQueued');
      expect(stats).toHaveProperty('hotCount');
      expect(stats).toHaveProperty('warmCount');
      expect(stats).toHaveProperty('coldCount');
      expect(stats).toHaveProperty('averagePriority');
      expect(stats).toHaveProperty('oldestWaitMinutes');
      expect(stats).toHaveProperty('queueHealth');
    });

    it('should return "Empty" health when no items queued', async () => {
      const stats = await getQueueStats();
      expect(stats.queueHealth).toBe('Empty');
    });
  });

  // ─── handleFailedAssignments ───────────────────────────────────
  describe('handleFailedAssignments', () => {
    it('should return requeued count', async () => {
      const result = await handleFailedAssignments();
      expect(result).toHaveProperty('requeued');
      expect(result).toHaveProperty('timestamp');
    });
  });

  // ─── autoCloseInactiveConversations ────────────────────────────
  describe('autoCloseInactiveConversations', () => {
    it('should return autoClosed count', async () => {
      const result = await autoCloseInactiveConversations(7);
      expect(result).toHaveProperty('autoClosed');
      expect(result).toHaveProperty('timestamp');
    });

    it('should close conversations older than specified days', async () => {
      await autoCloseInactiveConversations(14);
      expect(mockPrisma.nadiaConversation.findMany).toHaveBeenCalled();
    });
  });
});
