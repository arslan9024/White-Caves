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