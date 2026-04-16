/**
 * Conversation Memory — Tests
 * Tests ConversationMemory class: context creation, updates, themes, patterns,
 * predictions, preferences, customer info extraction, cleanup, stats, export
 */

import { describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import { vi } from 'vitest';
import { ConversationMemory, Message } from './conversationMemory';
import { Intent, IntentResult } from './ninaEngine';

// ─── Helpers ────────────────────────────────────────────────────────
function makeMessage(content: string, id = 'msg-1', convId = 'conv-1'): Message {
  return {
    id,
    conversationId: convId,
    content,
    sender: 'CUSTOMER',
    timestamp: new Date(),
  };
}

function makeIntentResult(intent: Intent = Intent.PROPERTY_INQUIRY): IntentResult {
  return {
    primary: { intent, confidence: 85, reasoning: 'keyword match' },
    secondary: [],
    entities: [],
    sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
    topics: ['real_estate'],
    requiresAgentHandoff: false,
    suggestedResponse: 'Thank you',
    timestamp: new Date(),
  };
}

describe('ConversationMemory', () => {
  let memory: ConversationMemory;

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  // ─── getOrCreateContext ─────────────────────────────────────────
  describe('getOrCreateContext', () => {
    it('should create a new context for unknown conversation', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.conversationId).toBe('conv-1');
      expect(ctx.messageHistory).toEqual([]);
      expect(ctx.themes).toEqual([]);
      expect(ctx.userPreferences).toEqual([]);
    });

    it('should return same context for same conversation ID', () => {
      const ctx1 = memory.getOrCreateContext('conv-1');
      const ctx2 = memory.getOrCreateContext('conv-1');
      expect(ctx1).toBe(ctx2);
    });

    it('should create separate contexts for different conversations', () => {
      const ctx1 = memory.getOrCreateContext('conv-1');
      const ctx2 = memory.getOrCreateContext('conv-2');
      expect(ctx1).not.toBe(ctx2);
      expect(ctx1.conversationId).toBe('conv-1');
      expect(ctx2.conversationId).toBe('conv-2');
    });

    it('should initialize with correct default fields', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.patterns).toEqual([]);
      expect(ctx.recentIntents).toEqual([]);
      expect(ctx.topEntities).toEqual([]);
      expect(ctx.predictedNextIntents).toEqual([]);
      expect(ctx.duration).toBe(0);
    });
  });

  // ─── updateContext ──────────────────────────────────────────────
  describe('updateContext', () => {
    it('should add message to history', () => {
      const msg = makeMessage('Looking for a villa in Dubai Marina');
      const result = makeIntentResult();
      const ctx = memory.updateContext('conv-1', msg, result);
      expect(ctx.messageHistory).toHaveLength(1);
      expect(ctx.messageHistory[0].content).toBe('Looking for a villa in Dubai Marina');
    });

    it('should update recent intents', () => {
      const msg = makeMessage('I want to buy');
      const result = makeIntentResult(Intent.PURCHASE_INTEREST);
      const ctx = memory.updateContext('conv-1', msg, result);
      expect(ctx.recentIntents).toContain(Intent.PURCHASE_INTEREST);
    });

    it('should keep only last 5 recent intents', () => {
      for (let i = 0; i < 8; i++) {
        const msg = makeMessage(`Message ${i}`, `msg-${i}`);
        memory.updateContext('conv-1', msg, makeIntentResult());
      }
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.recentIntents).toHaveLength(5);
    });

    it('should update themes from topics', () => {
      const msg = makeMessage('Show me apartments');
      const result = makeIntentResult();
      result.topics = ['real_estate', 'residential'];
      const ctx = memory.updateContext('conv-1', msg, result);
      expect(ctx.themes.length).toBeGreaterThan(0);
    });

    it('should update duration', () => {
      const msg = makeMessage('Hello');
      const ctx = memory.updateContext('conv-1', msg, makeIntentResult());
      expect(typeof ctx.duration).toBe('number');
    });
  });

  // ─── getContext ─────────────────────────────────────────────────
  describe('getContext', () => {
    it('should return undefined for unknown conversation', () => {
      expect(memory.getContext('unknown')).toBeUndefined();
    });

    it('should return context after creation', () => {
      memory.getOrCreateContext('conv-1');
      expect(memory.getContext('conv-1')).toBeDefined();
    });
  });

  // ─── extractCustomerInfo ────────────────────────────────────────
  describe('extractCustomerInfo', () => {
    it('should extract phone number from message', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'My number is 0501234567');
      expect(ctx.customerPhone).toBe('0501234567');
    });

    it('should extract customer name', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'My name is Ahmed');
      expect(ctx.customerName).toBe('Ahmed');
    });

    it('should not overwrite existing phone', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      ctx.customerPhone = '0501111111';
      memory.extractCustomerInfo(ctx, 'Call me at 0502222222');
      expect(ctx.customerPhone).toBe('0501111111');
    });
  });

  // ─── predictNextIntents ─────────────────────────────────────────
  describe('predictNextIntents', () => {
    it('should return empty predictions for new context', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      const predictions = memory.predictNextIntents(ctx);
      expect(Array.isArray(predictions)).toBe(true);
    });
  });

  // ─── clearOldConversations ──────────────────────────────────────
  describe('clearOldConversations', () => {
    it('should not clear recent conversations', () => {
      memory.getOrCreateContext('conv-1');
      memory.clearOldConversations();
      expect(memory.getContext('conv-1')).toBeDefined();
    });
  });

  // ─── getStats ───────────────────────────────────────────────────
  describe('getStats', () => {
    it('should return zero stats for empty memory', () => {
      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(0);
      expect(stats.totalMessages).toBe(0);
      expect(stats.averageThemes).toBe(0);
    });

    it('should count conversations correctly', () => {
      memory.getOrCreateContext('conv-1');
      memory.getOrCreateContext('conv-2');
      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(2);
    });
  });

  // ─── exportConversation ─────────────────────────────────────────
  describe('exportConversation', () => {
    it('should return null for unknown conversation', () => {
      expect(memory.exportConversation('unknown')).toBeNull();
    });

    it('should return context for known conversation', () => {
      memory.getOrCreateContext('conv-1');
      const exported = memory.exportConversation('conv-1');
      expect(exported).not.toBeNull();
      expect(exported!.conversationId).toBe('conv-1');
    });
  });
});
