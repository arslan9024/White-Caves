/**
 * queueManager � Test Suite
 * 22 tests covering exported functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockQueue } = vi.hoisted(() => ({
  mockQueue: {
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
    create: vi.fn().mockResolvedValue({ id: 'q1' }),
    deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    aggregate: vi.fn().mockResolvedValue({ _avg: { priority: 5 } }),
  },
}));

vi.mock('../../database.js', () => ({
  prisma: {
    nadiaConversationQueue: mockQueue,
    conversation: {
      findUnique: vi.fn().mockResolvedValue({ id: 'conv_1', leadScore: 50, intent: 'UNKNOWN', messages: [] }),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

import { calculateQueuePriority, getQueuedConversations, removeFromQueue } from './queueManager';

describe('queueManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -- calculateQueuePriority (pure function) --

  it('returns base priority 5 for neutral inputs', () => {
    expect(calculateQueuePriority(50, 'general_inquiry', 0)).toBe(5);
  });

  it('higher lead score gives lower priority number', () => {
    const high = calculateQueuePriority(90, 'general_inquiry', 0);
    const low = calculateQueuePriority(20, 'general_inquiry', 0);
    expect(high).toBeLessThan(low);
  });

  it('make_offer intent gives highest priority', () => {
    const offer = calculateQueuePriority(50, 'make_offer', 0);
    const general = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(offer).toBeLessThan(general);
  });

  it('schedule_tour intent gives high priority', () => {
    const tour = calculateQueuePriority(50, 'schedule_tour', 0);
    const general = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(tour).toBeLessThan(general);
  });

  it('complaint intent lowers priority', () => {
    const complaint = calculateQueuePriority(50, 'complaint', 0);
    const general = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(complaint).toBeGreaterThan(general);
  });

  it('10+ messages boosts priority', () => {
    const engaged = calculateQueuePriority(50, 'general_inquiry', 15);
    const fresh = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(engaged).toBeLessThan(fresh);
  });

  it('5-9 messages slightly boosts priority', () => {
    const mid = calculateQueuePriority(50, 'general_inquiry', 7);
    const fresh = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(mid).toBeLessThan(fresh);
  });

  it('priority clamped to minimum 1', () => {
    expect(calculateQueuePriority(100, 'make_offer', 20)).toBeGreaterThanOrEqual(1);
  });

  it('priority clamped to maximum 10', () => {
    expect(calculateQueuePriority(10, 'complaint', 0)).toBeLessThanOrEqual(10);
  });

  it('returns integer', () => {
    expect(Number.isInteger(calculateQueuePriority(65, 'financing', 3))).toBe(true);
  });

  it('financing intent slightly boosts priority', () => {
    const fin = calculateQueuePriority(50, 'financing', 0);
    const general = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(fin).toBeLessThan(general);
  });

  it('leadScore >= 80 gives -3 boost', () => {
    const p80 = calculateQueuePriority(80, 'general_inquiry', 0);
    const p50 = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(p50 - p80).toBe(3);
  });

  it('leadScore >= 60 gives -1 boost', () => {
    const p60 = calculateQueuePriority(60, 'general_inquiry', 0);
    const p50 = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(p50 - p60).toBe(1);
  });

  it('leadScore <= 30 gives +4 penalty', () => {
    const p30 = calculateQueuePriority(30, 'general_inquiry', 0);
    const p50 = calculateQueuePriority(50, 'general_inquiry', 0);
    expect(p30 - p50).toBe(4);
  });

  // -- getQueuedConversations --

  it('getQueuedConversations returns array', async () => {
    const result = await getQueuedConversations();
    expect(Array.isArray(result)).toBe(true);
  });

  it('getQueuedConversations calls findMany', async () => {
    await getQueuedConversations();
    expect(mockQueue.findMany).toHaveBeenCalled();
  });

  it('getQueuedConversations respects limit', async () => {
    await getQueuedConversations(5);
    expect(mockQueue.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 5 }),
    );
  });

  // -- removeFromQueue --

  it('removeFromQueue calls deleteMany', async () => {
    await removeFromQueue('conv_1');
    expect(mockQueue.deleteMany).toHaveBeenCalled();
  });

  it('removeFromQueue targets correct conversationId', async () => {
    await removeFromQueue('conv_2');
    expect(mockQueue.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { conversationId: 'conv_2' } }),
    );
  });

  it('removeFromQueue returns delete result', async () => {
    const result = await removeFromQueue('conv_1');
    expect(result).toHaveProperty('count');
  });

  // -- Edge case --

  it('calculateQueuePriority handles boundary leadScore 80', () => {
    const p = calculateQueuePriority(80, 'general_inquiry', 0);
    expect(p).toBe(2);
  });

  it('calculateQueuePriority handles boundary leadScore 60', () => {
    const p = calculateQueuePriority(60, 'general_inquiry', 0);
    expect(p).toBe(4);
  });
});
