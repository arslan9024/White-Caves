/**
 * nadiaSlice.test.ts — Comprehensive tests for Nadia Redux slice
 * ───────────────────────────────────────────────────────────────
 * Tests: initial state, sync reducers (selectConversation, clearError, resetNadia),
 *        all 6 async thunks (pending/fulfilled/rejected), all selectors + derived.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { NadiaState, Conversation, QueuedConversation } from '@/types/nadia';
import nadiaReducer, {
  selectConversation,
  clearError,
  resetNadia,
  fetchConversations,
  fetchMessages,
  sendMessage,
  fetchQueue,
  assignAgent,
  closeConversation,
  selectNadiaConversations,
  selectNadiaMessages,
  selectNadiaQueue,
  selectNadiaStats,
  selectSelectedConversationId,
  selectSelectedConversation,
  selectNadiaLoading,
  selectNadiaError,
  selectNadiaLastUpdated,
  selectConversationCount,
  selectQueuedCount,
  selectUrgentCount,
  selectHighPriorityCount,
  selectActiveConversations,
  selectHotLeads,
} from './nadiaSlice';

// Mock the service layer
vi.mock('@/services/nadiaAPI', () => ({
  default: {
    conversations: { list: vi.fn(), close: vi.fn() },
    messages: { listByConversation: vi.fn(), send: vi.fn() },
    queue: { list: vi.fn(), getStats: vi.fn(), assignAgent: vi.fn() },
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────

const getInitialState = () => nadiaReducer(undefined, { type: 'unknown' });

const sampleConv = (overrides: Partial<Conversation> = {}): Conversation => ({
  id: 'conv-1',
  customerName: 'Ahmed',
  customerPhone: '+971501234567',
  status: 'ACTIVE',
  priority: 'HIGH',
  leadScore: 80,
  assignedAgent: undefined,
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-25T10:00:00Z',
  ...overrides,
});

const sampleMessage = (overrides = {}) => ({
  id: 'msg-1',
  conversationId: 'conv-1',
  content: 'Hello',
  sender: 'CUSTOMER' as const,
  timestamp: '2026-03-25T10:00:00Z',
  ...overrides,
});

const sampleQueueItem = (overrides: Partial<QueuedConversation> = {}): QueuedConversation => ({
  queueId: 'q-1',
  conversationId: 'conv-1',
  customerPhone: '+971501234567',
  priority: 'HIGH',
  leadScore: 80,
  createdAt: '2026-03-25T09:00:00Z',
  waitTimeMinutes: 15,
  sortOrder: 1,
  status: 'ACTIVE',
  ...overrides,
});

const defaultStats = {
  totalQueued: 0,
  byPriority: { URGENT: 0, HIGH: 0, NORMAL: 0, LOW: 0 },
  avgResponseTimeMinutes: 0,
  agentAvailability: 0,
  oldestInQueueMinutes: 0,
};

// Build a fake RootState with just the nadia slice
const buildRoot = (overrides = {}) => ({
  nadia: { ...getInitialState(), ...overrides },
}) as any;

// ─── Tests ───────────────────────────────────────────────────────────

describe('nadiaSlice', () => {
  beforeEach(() => vi.clearAllMocks());

  // ── Initial state ─────────────────────────────────────────────────
  describe('initial state', () => {
    it('has correct defaults', () => {
      const state = getInitialState();
      expect(state.conversations).toEqual([]);
      expect(state.messages).toEqual([]);
      expect(state.queue).toEqual([]);
      expect(state.selectedConversationId).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastUpdated).toBeNull();
      expect(state.lastMessageSent).toBeNull();
      expect(state.stats.totalQueued).toBe(0);
    });
  });

  // ── Sync reducers ─────────────────────────────────────────────────
  describe('sync reducers', () => {
    it('selectConversation sets conversation id', () => {
      const state = getInitialState();
      const next = nadiaReducer(state, selectConversation('conv-1'));
      expect(next.selectedConversationId).toBe('conv-1');
    });

    it('selectConversation can clear selection', () => {
      const state = { ...getInitialState(), selectedConversationId: 'conv-1' };
      const next = nadiaReducer(state, selectConversation(null));
      expect(next.selectedConversationId).toBeNull();
    });

    it('clearError resets error', () => {
      const state = { ...getInitialState(), error: 'Something failed' };
      const next = nadiaReducer(state, clearError());
      expect(next.error).toBeNull();
    });

    it('resetNadia returns to initial state', () => {
      const dirty: NadiaState = {
        ...getInitialState(),
        conversations: [sampleConv()],
        messages: [sampleMessage()],
        loading: true,
        error: 'err',
        selectedConversationId: 'conv-1',
      };
      const next = nadiaReducer(dirty, resetNadia());
      expect(next).toEqual(getInitialState());
    });
  });

  // ── fetchConversations ────────────────────────────────────────────
  describe('fetchConversations', () => {
    it('pending: sets loading, clears error', () => {
      const state = { ...getInitialState(), error: 'old' };
      const next = nadiaReducer(state, { type: fetchConversations.pending.type });
      expect(next.loading).toBe(true);
      expect(next.error).toBeNull();
    });

    it('fulfilled: stores conversations', () => {
      const convs = [sampleConv(), sampleConv({ id: 'conv-2' })];
      const next = nadiaReducer(getInitialState(), {
        type: fetchConversations.fulfilled.type,
        payload: convs,
      });
      expect(next.conversations).toHaveLength(2);
      expect(next.loading).toBe(false);
      expect(next.lastUpdated).toBeDefined();
    });

    it('rejected: sets error', () => {
      const next = nadiaReducer(getInitialState(), {
        type: fetchConversations.rejected.type,
        payload: 'Network error',
      });
      expect(next.error).toBe('Network error');
      expect(next.loading).toBe(false);
    });
  });

  // ── fetchMessages ─────────────────────────────────────────────────
  describe('fetchMessages', () => {
    it('pending: sets loading', () => {
      const next = nadiaReducer(getInitialState(), { type: fetchMessages.pending.type });
      expect(next.loading).toBe(true);
    });

    it('fulfilled: stores messages', () => {
      const msgs = [sampleMessage(), sampleMessage({ id: 'msg-2' })];
      const next = nadiaReducer(getInitialState(), {
        type: fetchMessages.fulfilled.type,
        payload: { conversationId: 'conv-1', messages: msgs },
      });
      expect(next.messages).toHaveLength(2);
      expect(next.loading).toBe(false);
    });

    it('rejected: sets error', () => {
      const next = nadiaReducer(getInitialState(), {
        type: fetchMessages.rejected.type,
        payload: 'Fetch failed',
      });
      expect(next.error).toBe('Fetch failed');
    });
  });

  // ── sendMessage ───────────────────────────────────────────────────
  describe('sendMessage', () => {
    it('pending: sets loading', () => {
      const next = nadiaReducer(getInitialState(), { type: sendMessage.pending.type });
      expect(next.loading).toBe(true);
    });

    it('fulfilled: appends message', () => {
      const state = { ...getInitialState(), messages: [sampleMessage()] };
      const newMsg = sampleMessage({ id: 'msg-2', content: 'Reply', sender: 'AGENT' });
      const next = nadiaReducer(state, {
        type: sendMessage.fulfilled.type,
        payload: newMsg,
      });
      expect(next.messages).toHaveLength(2);
      expect(next.messages[1].content).toBe('Reply');
      expect(next.lastMessageSent).toBeDefined();
    });

    it('rejected: sets error', () => {
      const next = nadiaReducer(getInitialState(), {
        type: sendMessage.rejected.type,
        payload: 'Send failed',
      });
      expect(next.error).toBe('Send failed');
    });
  });

  // ── fetchQueue ────────────────────────────────────────────────────
  describe('fetchQueue', () => {
    it('pending: sets loading', () => {
      const next = nadiaReducer(getInitialState(), { type: fetchQueue.pending.type });
      expect(next.loading).toBe(true);
    });

    it('fulfilled: stores queue and stats', () => {
      const stats = { ...defaultStats, totalQueued: 3, byPriority: { URGENT: 1, HIGH: 2, NORMAL: 0, LOW: 0 } };
      const next = nadiaReducer(getInitialState(), {
        type: fetchQueue.fulfilled.type,
        payload: { queue: [sampleQueueItem()], stats },
      });
      expect(next.queue).toHaveLength(1);
      expect(next.stats.totalQueued).toBe(3);
      expect(next.stats.byPriority.URGENT).toBe(1);
    });

    it('rejected: sets error', () => {
      const next = nadiaReducer(getInitialState(), {
        type: fetchQueue.rejected.type,
        payload: 'Queue error',
      });
      expect(next.error).toBe('Queue error');
    });
  });

  // ── assignAgent ───────────────────────────────────────────────────
  describe('assignAgent', () => {
    it('pending: sets loading', () => {
      const next = nadiaReducer(getInitialState(), { type: assignAgent.pending.type });
      expect(next.loading).toBe(true);
    });

    it('fulfilled: removes from queue and updates conversation', () => {
      const state: NadiaState = {
        ...getInitialState(),
        queue: [sampleQueueItem()],
        conversations: [sampleConv()],
      };
      const next = nadiaReducer(state, {
        type: assignAgent.fulfilled.type,
        payload: { queueId: 'q-1', conversationId: 'conv-1' },
      });
      expect(next.queue).toHaveLength(0);
      expect(next.loading).toBe(false);
    });

    it('rejected: sets error', () => {
      const next = nadiaReducer(getInitialState(), {
        type: assignAgent.rejected.type,
        payload: 'Assign failed',
      });
      expect(next.error).toBe('Assign failed');
    });
  });

  // ── closeConversation ─────────────────────────────────────────────
  describe('closeConversation', () => {
    it('pending: sets loading', () => {
      const next = nadiaReducer(getInitialState(), { type: closeConversation.pending.type });
      expect(next.loading).toBe(true);
    });

    it('fulfilled: updates conversation and clears selection if selected', () => {
      const closedConv = sampleConv({ status: 'CLOSED' });
      const state: NadiaState = {
        ...getInitialState(),
        conversations: [sampleConv()],
        selectedConversationId: 'conv-1',
      };
      const next = nadiaReducer(state, {
        type: closeConversation.fulfilled.type,
        payload: closedConv,
      });
      expect(next.conversations[0].status).toBe('CLOSED');
      expect(next.selectedConversationId).toBeNull();
    });

    it('fulfilled: does not clear selection of different conversation', () => {
      const closedConv = sampleConv({ id: 'conv-2', status: 'CLOSED' });
      const state: NadiaState = {
        ...getInitialState(),
        conversations: [sampleConv(), sampleConv({ id: 'conv-2' })],
        selectedConversationId: 'conv-1',
      };
      const next = nadiaReducer(state, {
        type: closeConversation.fulfilled.type,
        payload: closedConv,
      });
      expect(next.selectedConversationId).toBe('conv-1');
    });

    it('rejected: sets error', () => {
      const next = nadiaReducer(getInitialState(), {
        type: closeConversation.rejected.type,
        payload: 'Close failed',
      });
      expect(next.error).toBe('Close failed');
    });
  });

  // ── Selectors ─────────────────────────────────────────────────────
  describe('selectors', () => {
    const root = buildRoot({
      conversations: [
        sampleConv({ id: 'conv-1', status: 'ACTIVE', leadScore: 80 }),
        sampleConv({ id: 'conv-2', status: 'CLOSED', leadScore: 40 }),
        sampleConv({ id: 'conv-3', status: 'ACTIVE', leadScore: 90 }),
      ],
      messages: [sampleMessage()],
      queue: [sampleQueueItem()],
      stats: { ...defaultStats, totalQueued: 1, byPriority: { URGENT: 2, HIGH: 3, NORMAL: 0, LOW: 0 } },
      selectedConversationId: 'conv-1',
      loading: true,
      error: 'test error',
      lastUpdated: new Date('2026-03-25'),
    });

    it('selectNadiaConversations returns conversations', () => {
      expect(selectNadiaConversations(root)).toHaveLength(3);
    });

    it('selectNadiaMessages returns messages', () => {
      expect(selectNadiaMessages(root)).toHaveLength(1);
    });

    it('selectNadiaQueue returns queue', () => {
      expect(selectNadiaQueue(root)).toHaveLength(1);
    });

    it('selectNadiaStats returns stats', () => {
      expect(selectNadiaStats(root).totalQueued).toBe(1);
    });

    it('selectSelectedConversationId returns id', () => {
      expect(selectSelectedConversationId(root)).toBe('conv-1');
    });

    it('selectSelectedConversation returns the matching conversation', () => {
      const conv = selectSelectedConversation(root);
      expect(conv).not.toBeNull();
      expect(conv!.id).toBe('conv-1');
    });

    it('selectSelectedConversation returns null when no selection', () => {
      const noSelection = buildRoot({ ...root.nadia, selectedConversationId: null });
      expect(selectSelectedConversation(noSelection)).toBeNull();
    });

    it('selectNadiaLoading returns loading flag', () => {
      expect(selectNadiaLoading(root)).toBe(true);
    });

    it('selectNadiaError returns error', () => {
      expect(selectNadiaError(root)).toBe('test error');
    });

    it('selectNadiaLastUpdated returns date', () => {
      expect(selectNadiaLastUpdated(root)).toBeDefined();
    });

    it('selectConversationCount returns count', () => {
      expect(selectConversationCount(root)).toBe(3);
    });

    it('selectQueuedCount returns queue length', () => {
      expect(selectQueuedCount(root)).toBe(1);
    });

    it('selectUrgentCount returns URGENT priority', () => {
      expect(selectUrgentCount(root)).toBe(2);
    });

    it('selectHighPriorityCount returns HIGH priority', () => {
      expect(selectHighPriorityCount(root)).toBe(3);
    });

    it('selectActiveConversations returns only ACTIVE', () => {
      const active = selectActiveConversations(root);
      expect(active).toHaveLength(2);
      expect(active.every((c: any) => c.status === 'ACTIVE')).toBe(true);
    });

    it('selectHotLeads returns high-scoring leads sorted desc', () => {
      const hot = selectHotLeads(root);
      expect(hot).toHaveLength(2); // score 80 + 90
      expect(hot[0].leadScore).toBe(90);
      expect(hot[1].leadScore).toBe(80);
    });
  });
});
