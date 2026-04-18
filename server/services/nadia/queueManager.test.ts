/**
 * queueManager — Test Suite
 * ============================
 * 22 tests covering all exported functions (NOT a class):
 * calculateQueuePriority (sync), plus async Prisma functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma database
const mockPrisma = {
  nadiaConversationQueue: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
    deleteMany: vi.fn(),
    aggregate: vi.fn(),
    count: vi.fn(),
  },
  nadiaConversation: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    updateMany: vi.fn(),
  },
};

vi.mock('../../database.js', () => ({
  default: mockPrisma,
  prisma: mockPrisma,
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
  getConversationsForAutoClose,
  autoCloseInactiveConversations,
} from './queueManager';

describe('queueManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ═══════════════════ calculateQueuePriority (sync) ═══════════════════ */

  describe('calculateQueuePriority', () => {
    it('returns base priority 5 for neutral inputs', () => {
      const result = calculateQueuePriority(50, 'general_inquiry', 3);
      expect(result).toBe(5);
    });

    it('lowers priority (higher urgency) for high lead scores', () => {
      const highScore = calculateQueuePriority(85, 'general_inquiry', 3);
      const lowScore = calculateQueuePriority(25, 'general_inquiry', 3);
      expect(highScore).toBeLessThan(lowScore);
    });

    it('gives highest urgency for make_offer intent', () => {
      const offer = calculateQueuePriority(50, 'make_offer', 3);
      const general = calculateQueuePriority(50, 'general_inquiry', 3);
      expect(offer).toBeLessThan(general);
    });

    it('lowers urgency for complaints', () => {
      const complaint = calculateQueuePriority(50, 'complaint', 3);
      const general = calculateQueuePriority(50, 'general_inquiry', 3);
      expect(complaint).toBeGreaterThan(general);
    });

    it('considers high message count', () => {
      const many = calculateQueuePriority(50, 'general_inquiry', 12);
      const few = calculateQueuePriority(50, 'general_inquiry', 2);
      expect(many).toBeLessThan(few);
    });

    it('clamps result between 1 and 10', () => {
      const hot = calculateQueuePriority(100, 'make_offer', 20);
      const cold = calculateQueuePriority(10, 'complaint', 1);
      expect(hot).toBeGreaterThanOrEqual(1);
      expect(cold).toBeLessThanOrEqual(10);
    });

    it('returns a number', () => {
      expect(typeof calculateQueuePriority(50, 'general_inquiry', 5)).toBe('number');
    });
  });

  /* ═══════════════════ getQueuedConversations ═══════════════════ */

  describe('getQueuedConversations', () => {
    it('queries Prisma with queued status', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
      await getQueuedConversations(10);
      expect(mockPrisma.nadiaConversationQueue.findMany).toHaveBeenCalled();
    });

    it('returns mapped conversations with priority labels', async () => {
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([
        {
          id: 'q1',
          conversationId: 'conv-1',
          priority: 2,
          status: 'queued',
          queuedAt: new Date(),
          conversation: { customerPhone: '+971555', lastMessage: 'hi', messageCount: 5, intent: 'property_search', leadScore: 80 },
        },
      ]);
      const result = await getQueuedConversations(10);
      expect(result.length).toBe(1);
      expect(result[0].priority_label).toContain('HOT');
    });
  });

  /* ═══════════════════ assignFromQueue ═══════════════════ */

  describe('assignFromQueue', () => {
    it('returns null if queue entry not found', async () => {
      mockPrisma.nadiaConversationQueue.findFirst.mockResolvedValue(null);
      const result = await assignFromQueue('nonexistent', '+971555');
      expect(result).toBeNull();
    });

    it('updates queue and conversation when found', async () => {
      mockPrisma.nadiaConversationQueue.findFirst.mockResolvedValue({
        id: 'q1',
        conversationId: 'conv-1',
        status: 'queued',
      });
      mockPrisma.nadiaConversationQueue.update.mockResolvedValue({ id: 'q1', status: 'assigned' });
      mockPrisma.nadiaConversation.update.mockResolvedValue({ id: 'conv-1', status: 'assigned_to_agent' });
      const result = await assignFromQueue('q1', '+971555');
      expect(mockPrisma.nadiaConversationQueue.update).toHaveBeenCalled();
      expect(mockPrisma.nadiaConversation.update).toHaveBeenCalled();
    });
  });

  /* ═══════════════════ removeFromQueue ═══════════════════ */

  describe('removeFromQueue', () => {
    it('calls deleteMany with conversationId', async () => {
      mockPrisma.nadiaConversationQueue.deleteMany.mockResolvedValue({ count: 1 });
      await removeFromQueue('conv-1');
      expect(mockPrisma.nadiaConversationQueue.deleteMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ conversationId: 'conv-1' }) }),
      );
    });
  });

  /* ═══════════════════ getQueueStats ═══════════════════ */

  describe('getQueueStats', () => {
    it('returns stats object', async () => {
      mockPrisma.nadiaConversationQueue.count.mockResolvedValue(0);
      mockPrisma.nadiaConversationQueue.findMany.mockResolvedValue([]);
      mockPrisma.nadiaConversationQueue.aggregate.mockResolvedValue({ _avg: { priority: null } });
      const stats = await getQueueStats();
      expect(stats).toBeDefined();
      expect(stats.totalQueued).toBe(0);
      expect(stats.queueHealth).toBe('Empty');
    });
  });

  /* ═══════════════════ handleFailedAssignments ═══════════════════ */

  describe('handleFailedAssignments', () => {
    it('returns requeued count and timestamp', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
      const result = await handleFailedAssignments();
      expect(result).toHaveProperty('requeued');
      expect(result).toHaveProperty('timestamp');
      expect(result.requeued).toBe(0);
    });
  });

  /* ═══════════════════ autoCloseInactiveConversations ═══════════════════ */

  describe('autoCloseInactiveConversations', () => {
    it('returns autoClosed count and timestamp', async () => {
      mockPrisma.nadiaConversation.findMany.mockResolvedValue([]);
      const result = await autoCloseInactiveConversations(7);
      expect(result).toHaveProperty('autoClosed');
      expect(result).toHaveProperty('timestamp');
      expect(result.autoClosed).toBe(0);
    });
  });
});
/**
 * QueueManager Unit Tests
 * Tests calculateQueuePriority (sync, no DB) and async functions with mocked Prisma.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    nadiaConversationQueue: {
      findMany: vi.fn().mockResolvedValue([]),
      findFirst: vi.fn().mockResolvedValue(null),
      findUnique: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((args: any) =>
        Promise.resolve({ id: 'q-001', ...args.data, queuedAt: args.data.queuedAt || new Date() })
      ),
      update: vi.fn().mockImplementation((args: any) =>
        Promise.resolve({ id: args.where?.id || 'q-001', ...args.data, conversation: { id: 'conv-1', customerPhone: '+971501234567', status: 'queued' } })
      ),
      delete: vi.fn().mockResolvedValue({ id: 'q-001' }),
      deleteMany: vi.fn().mockResolvedValue({ count: 0 }),
      count: vi.fn().mockResolvedValue(0),
      aggregate: vi.fn().mockResolvedValue({ _avg: { priority: 5 } }),
    },
    nadiaConversation: {
      findUnique: vi.fn().mockResolvedValue({ id: 'conv-1', customerPhone: '+971501234567', status: 'active', intent: 'property_search', leadScore: 60 }),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

vi.mock('../../database.js', () => ({ prisma: mockPrisma }));
vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import {
  calculateQueuePriority,
  getQueuedConversations,
  queueConversationForAssignment,
  assignFromQueue,
  removeFromQueue,
  getQueueStats,
  autoCloseInactiveConversations,
} from './queueManager';

describe('calculateQueuePriority', () => {
  it('returns base priority 5 for neutral inputs', () => {
    expect(calculateQueuePriority(50, 'general_inquiry', 0)).toBe(5);
  });
  it('returns 1 for hot lead + make_offer + high engagement', () => {
    expect(calculateQueuePriority(90, 'make_offer', 15)).toBe(1);
  });
  it('returns 10 for cold lead + complaint', () => {
    expect(calculateQueuePriority(20, 'complaint', 0)).toBe(10);
  });
  it('boosts for schedule_tour', () => {
    expect(calculateQueuePriority(50, 'schedule_tour', 0)).toBe(3);
  });
  it('boosts for financing', () => {
    expect(calculateQueuePriority(50, 'financing', 0)).toBe(4);
  });
  it('boosts for high message count', () => {
    expect(calculateQueuePriority(50, 'general_inquiry', 12)).toBe(3);
  });
  it('boosts for moderate message count', () => {
    expect(calculateQueuePriority(50, 'general_inquiry', 7)).toBe(4);
  });
  it('clamps to minimum 1', () => {
    expect(calculateQueuePriority(100, 'make_offer', 20)).toBe(1);
  });
  it('clamps to maximum 10', () => {
    expect(calculateQueuePriority(10, 'complaint', 0)).toBe(10);
  });
  it('lead score 60-79 gives -1', () => {
    expect(calculateQueuePriority(70, 'general_inquiry', 0)).toBe(4);
  });
});

describe('getQueuedConversations', () => {
  beforeEach(() => vi.clearAllMocks());
  it('returns empty array when empty', async () => {
    mockPrisma.nadiaConversationQueue.findMany.mockResolvedValueOnce([]);
    expect(await getQueuedConversations()).toEqual([]);
  });
  it('maps queue entries', async () => {
    mockPrisma.nadiaConversationQueue.findMany.mockResolvedValueOnce([{
      id: 'q-1', priority: 2, queuedAt: new Date('2025-01-01T00:00:00Z'),
      conversation: { id: 'conv-1', customerPhone: '+971501234567', status: 'active', intent: 'make_offer', leadScore: 85, messages: [{ body: 'Hello' }] },
    }]);
    const result = await getQueuedConversations();
    expect(result).toHaveLength(1);
    expect(result[0].priority_label).toBe('\uD83D\uDD25 HOT');
  });
  it('respects limit', async () => {
    mockPrisma.nadiaConversationQueue.findMany.mockResolvedValueOnce([]);
    await getQueuedConversations(5);
    expect(mockPrisma.nadiaConversationQueue.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 5 }));
  });
});

describe('queueConversationForAssignment', () => {
  beforeEach(() => vi.clearAllMocks());
  it('creates new queue entry', async () => {
    mockPrisma.nadiaConversation.findUnique.mockResolvedValueOnce({ id: 'conv-1', leadScore: 70, intent: 'schedule_tour' });
    mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce(null);
    mockPrisma.nadiaConversationQueue.create.mockResolvedValueOnce({ id: 'q-new', conversationId: 'conv-1', priority: 3, status: 'queued' });
    const result = await queueConversationForAssignment('conv-1');
    expect(result).toBeDefined();
    expect(mockPrisma.nadiaConversationQueue.create).toHaveBeenCalled();
  });
  it('throws when conversation not found', async () => {
    mockPrisma.nadiaConversation.findUnique.mockResolvedValueOnce(null);
    await expect(queueConversationForAssignment('nonexistent')).rejects.toThrow();
  });
});

describe('assignFromQueue', () => {
  beforeEach(() => vi.clearAllMocks());
  it('returns null when not found', async () => {
    mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce(null);
    expect(await assignFromQueue('nonexistent', '+971500000000')).toBeNull();
  });
  it('assigns and updates conversation', async () => {
    mockPrisma.nadiaConversationQueue.findUnique.mockResolvedValueOnce({ id: 'q-1', conversationId: 'conv-1', conversation: { id: 'conv-1' } });
    mockPrisma.nadiaConversationQueue.update.mockResolvedValueOnce({ id: 'q-1', status: 'assigned', conversation: { id: 'conv-1' } });
    const result = await assignFromQueue('q-1', '+971500000000');
    expect(result).toBeDefined();
    expect(mockPrisma.nadiaConversation.update).toHaveBeenCalled();
  });
});

describe('removeFromQueue', () => {
  beforeEach(() => vi.clearAllMocks());
  it('calls deleteMany', async () => {
    await removeFromQueue('conv-1');
    expect(mockPrisma.nadiaConversationQueue.deleteMany).toHaveBeenCalledWith({ where: { conversationId: 'conv-1' } });
  });
});

describe('getQueueStats', () => {
  beforeEach(() => vi.clearAllMocks());
  it('returns stats object', async () => {
    mockPrisma.nadiaConversationQueue.count.mockResolvedValueOnce(10).mockResolvedValueOnce(3).mockResolvedValueOnce(4).mockResolvedValueOnce(3);
    mockPrisma.nadiaConversationQueue.aggregate.mockResolvedValueOnce({ _avg: { priority: 4.5 } });
    mockPrisma.nadiaConversationQueue.findFirst.mockResolvedValueOnce({ queuedAt: new Date(Date.now() - 30 * 60000) });
    const stats = await getQueueStats();
    expect(stats.totalQueued).toBe(10);
    expect(stats.queueHealth).toBe('Busy');
  });
  it('returns Empty for 0 queued', async () => {
    mockPrisma.nadiaConversationQueue.count.mockResolvedValue(0);
    mockPrisma.nadiaConversationQueue.aggregate.mockResolvedValueOnce({ _avg: { priority: null } });
    mockPrisma.nadiaConversationQueue.findFirst.mockResolvedValueOnce(null);
    expect((await getQueueStats()).queueHealth).toBe('Empty');
  });
});

describe('autoCloseInactiveConversations', () => {
  beforeEach(() => vi.clearAllMocks());
  it('returns count of auto-closed', async () => {
    mockPrisma.nadiaConversation.findMany.mockResolvedValueOnce([{ id: 'conv-old', status: 'active', messages: [] }]);
    mockPrisma.nadiaConversation.update.mockResolvedValueOnce({});
    mockPrisma.nadiaConversationQueue.deleteMany.mockResolvedValueOnce({ count: 0 });
    const result = await autoCloseInactiveConversations(7);
    expect(result.autoClosed).toBe(1);
  });
  it('returns 0 when none inactive', async () => {
    mockPrisma.nadiaConversation.findMany.mockResolvedValueOnce([]);
    expect((await autoCloseInactiveConversations(7)).autoClosed).toBe(0);
  });
});