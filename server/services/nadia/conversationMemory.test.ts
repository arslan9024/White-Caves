/**
 * ConversationMemory — Unit Tests
 * Tests the in-memory conversation state manager.
 * Pure in-memory — no database or external I/O needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import { ConversationMemory, ConversationMemoryState, Message } from './conversationMemory';
import { Intent, IntentResult } from './ninaEngine';

// ── Helpers ──────────────────────────────────────────────────────────
function makeMessage(overrides: Partial<Message> = {}): Message {
  return {
    id: `msg-${Date.now()}`,
    conversationId: 'conv-1',
    content: 'Hello',
    sender: 'CUSTOMER',
    timestamp: new Date(),
    ...overrides,
  };
}

function makeIntentResult(overrides: Partial<IntentResult> = {}): IntentResult {
  return {
    primary: { intent: Intent.PROPERTY_INQUIRY, confidence: 80, reasoning: 'test' },
    secondary: [],
    entities: [],
    sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
    topics: ['property'],
    requiresAgentHandoff: false,
    suggestedResponse: 'How can I help?',
    timestamp: new Date(),
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────
describe('ConversationMemory', () => {
  let memory: ConversationMemory;

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  // ── getOrCreateContext ────────────────────────────────────────────
  describe('getOrCreateContext', () => {
    it('creates a new context for unknown conversation', () => {
      const ctx = memory.getOrCreateContext('conv-new');
      expect(ctx).toBeDefined();
      expect(ctx.conversationId).toBe('conv-new');
      expect(ctx.messageHistory).toEqual([]);
    });

    it('returns existing context for known conversation', () => {
      const first = memory.getOrCreateContext('conv-1');
      const second = memory.getOrCreateContext('conv-1');
      expect(first).toBe(second);
    });

    it('creates separate contexts for different conversations', () => {
      const a = memory.getOrCreateContext('conv-a');
      const b = memory.getOrCreateContext('conv-b');
      expect(a.conversationId).toBe('conv-a');
      expect(b.conversationId).toBe('conv-b');
      expect(a).not.toBe(b);
    });
  });

  // ── updateContext ─────────────────────────────────────────────────
  describe('updateContext', () => {
    it('adds message to history', () => {
      const msg = makeMessage({ conversationId: 'conv-1' });
      const result = memory.updateContext('conv-1', msg, makeIntentResult());
      expect(result.messageHistory.length).toBe(1);
      expect(result.messageHistory[0].content).toBe('Hello');
    });

    it('updates recent intents', () => {
      const intentResult = makeIntentResult({
        primary: { intent: Intent.VIEWING_REQUEST, confidence: 90, reasoning: 'viewing' },
      });
      const result = memory.updateContext('conv-1', makeMessage(), intentResult);
      expect(result.recentIntents).toContain(Intent.VIEWING_REQUEST);
    });

    it('caps message history at 100', () => {
      for (let i = 0; i < 105; i++) {
        memory.updateContext('conv-1', makeMessage({ id: `msg-${i}` }), makeIntentResult());
      }
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.messageHistory.length).toBeLessThanOrEqual(100);
    });

    it('caps recent intents at 5', () => {
      const intents = [
        Intent.PROPERTY_INQUIRY,
        Intent.VIEWING_REQUEST,
        Intent.PURCHASE_INTEREST,
        Intent.COMPLAINT,
        Intent.INFORMATION_REQUEST,
        Intent.NEGOTIATION,
        Intent.GREETING,
      ];
      for (const intent of intents) {
        memory.updateContext(
          'conv-1',
          makeMessage({ id: `msg-${intent}` }),
          makeIntentResult({ primary: { intent, confidence: 80, reasoning: 'test' } }),
        );
      }
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.recentIntents.length).toBeLessThanOrEqual(5);
    });

    it('updates timestamps on context', () => {
      memory.updateContext('conv-1', makeMessage(), makeIntentResult());
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.lastUpdateTime).toBeDefined();
    });
  });

  // ── getContext ────────────────────────────────────────────────────
  describe('getContext', () => {
    it('returns undefined for unknown conversation', () => {
      expect(memory.getContext('unknown')).toBeUndefined();
    });

    it('returns context after update', () => {
      memory.updateContext('conv-1', makeMessage(), makeIntentResult());
      const ctx = memory.getContext('conv-1');
      expect(ctx).toBeDefined();
      expect(ctx?.conversationId).toBe('conv-1');
    });
  });

  // ── extractCustomerInfo ──────────────────────────────────────────
  describe('extractCustomerInfo', () => {
    it('extracts phone number from message', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'My number is 0501234567');
      expect(ctx.customerPhone).toBeDefined();
    });

    it('extracts name from message', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'My name is Ahmed');
      expect(ctx.customerName).toBe('Ahmed');
    });

    it('handles message with no extractable info', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'I want to see a property');
      // Should not crash
      expect(ctx).toBeDefined();
    });
  });

  // ── predictNextIntents ───────────────────────────────────────────
  describe('predictNextIntents', () => {
    it('returns array of predicted intents', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      const predictions = memory.predictNextIntents(ctx);
      expect(Array.isArray(predictions)).toBe(true);
    });

    it('returns max 3 predictions', () => {
      // Build up some intent history
      for (let i = 0; i < 10; i++) {
        memory.updateContext('conv-1', makeMessage({ id: `msg-${i}` }), makeIntentResult());
      }
      const ctx = memory.getOrCreateContext('conv-1');
      const predictions = memory.predictNextIntents(ctx);
      expect(predictions.length).toBeLessThanOrEqual(3);
    });
  });

  // ── clearOldConversations ────────────────────────────────────────
  describe('clearOldConversations', () => {
    it('does not remove recent conversations', () => {
      memory.updateContext('conv-recent', makeMessage(), makeIntentResult());
      memory.clearOldConversations();
      expect(memory.getContext('conv-recent')).toBeDefined();
    });
  });

  // ── getStats ─────────────────────────────────────────────────────
  describe('getStats', () => {
    it('returns stats object', () => {
      const stats = memory.getStats();
      expect(stats).toHaveProperty('totalConversations');
      expect(stats).toHaveProperty('totalMessages');
      expect(stats).toHaveProperty('averageThemes');
    });

    it('counts conversations correctly', () => {
      memory.updateContext('conv-1', makeMessage(), makeIntentResult());
      memory.updateContext('conv-2', makeMessage({ conversationId: 'conv-2' }), makeIntentResult());
      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(2);
    });
  });

  // ── exportConversation ───────────────────────────────────────────
  describe('exportConversation', () => {
    it('returns null for unknown conversation', () => {
      expect(memory.exportConversation('unknown')).toBeNull();
    });

    it('returns full state for known conversation', () => {
      memory.updateContext('conv-1', makeMessage(), makeIntentResult());
      const exported = memory.exportConversation('conv-1');
      expect(exported).toBeDefined();
      expect(exported?.conversationId).toBe('conv-1');
    });
  });
});
