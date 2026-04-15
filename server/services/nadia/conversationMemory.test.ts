/**
 * ConversationMemory — Unit Tests
 * Tests in-memory conversation state: create, update, predict, clear, stats, export.
 * No database — purely in-memory Map-based storage.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import { ConversationMemory, type Message } from './conversationMemory';
import { Intent, type IntentResult, type Entity } from './ninaEngine';

describe('ConversationMemory', () => {
  let memory: ConversationMemory;

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  // ----------------------------------------------------------------
  // getOrCreateContext
  // ----------------------------------------------------------------
  describe('getOrCreateContext', () => {
    it('creates a new context for unknown conversationId', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.conversationId).toBe('conv-1');
      expect(ctx.messageHistory).toEqual([]);
      expect(ctx.themes).toEqual([]);
      expect(ctx.userPreferences).toEqual([]);
      expect(ctx.recentIntents).toEqual([]);
      expect(ctx.topEntities).toEqual([]);
      expect(ctx.predictedNextIntents).toEqual([]);
      expect(ctx.createdAt).toBeInstanceOf(Date);
    });

    it('returns the same context on second call', () => {
      const ctx1 = memory.getOrCreateContext('conv-1');
      const ctx2 = memory.getOrCreateContext('conv-1');
      expect(ctx1).toBe(ctx2);
    });
  });

  // ----------------------------------------------------------------
  // getContext
  // ----------------------------------------------------------------
  describe('getContext', () => {
    it('returns undefined for unknown conversationId', () => {
      expect(memory.getContext('missing')).toBeUndefined();
    });

    it('returns context after creation', () => {
      memory.getOrCreateContext('conv-1');
      const ctx = memory.getContext('conv-1');
      expect(ctx).toBeDefined();
      expect(ctx!.conversationId).toBe('conv-1');
    });
  });

  // ----------------------------------------------------------------
  // updateContext
  // ----------------------------------------------------------------
  describe('updateContext', () => {
    it('adds message to history', () => {
      const msg: Message = {
        id: 'msg-1',
        conversationId: 'conv-1',
        content: 'I want a villa in Dubai Marina',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      };
      const intentResult: IntentResult = {
        primary: { intent: Intent.PROPERTY_INQUIRY, confidence: 85, reasoning: 'keyword match' },
        secondary: [],
        entities: [{ type: 'PROPERTY_TYPE', value: 'villa', confidence: 0.9 }],
        sentiment: { sentiment: 'POSITIVE', score: 0.5, keywords: ['want'] },
        topics: ['property', 'dubai marina'],
        requiresAgentHandoff: false,
        suggestedResponse: 'Great choice!',
        timestamp: new Date(),
      };
      const ctx = memory.updateContext('conv-1', msg, intentResult);
      expect(ctx.messageHistory).toHaveLength(1);
      expect(ctx.messageHistory[0].id).toBe('msg-1');
      expect(ctx.recentIntents).toContain(Intent.PROPERTY_INQUIRY);
    });

    it('updates lastUpdateTime', () => {
      const before = new Date();
      const msg: Message = {
        id: 'msg-2',
        conversationId: 'conv-1',
        content: 'Tell me more',
        sender: 'CUSTOMER',
        timestamp: new Date(),
      };
      const intentResult: IntentResult = {
        primary: { intent: Intent.INFORMATION_REQUEST, confidence: 70, reasoning: 'request' },
        secondary: [],
        entities: [],
        sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
        topics: ['info'],
        requiresAgentHandoff: false,
        suggestedResponse: 'Sure!',
        timestamp: new Date(),
      };
      const ctx = memory.updateContext('conv-1', msg, intentResult);
      expect(ctx.lastUpdateTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
  });

  // ----------------------------------------------------------------
  // extractCustomerInfo
  // ----------------------------------------------------------------
  describe('extractCustomerInfo', () => {
    it('extracts name from "my name is X" patterns', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'My name is John Smith');
      expect(ctx.customerName).toBeDefined();
    });

    it('extracts phone number from message', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      memory.extractCustomerInfo(ctx, 'Call me at +971501234567');
      expect(ctx.customerPhone).toBeDefined();
    });
  });

  // ----------------------------------------------------------------
  // predictNextIntents
  // ----------------------------------------------------------------
  describe('predictNextIntents', () => {
    it('returns empty array for fresh context', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      const predicted = memory.predictNextIntents(ctx);
      expect(Array.isArray(predicted)).toBe(true);
    });

    it('returns predictions after multiple intents', () => {
      const ctx = memory.getOrCreateContext('conv-2');
      // Simulate pattern building
      ctx.recentIntents.push(Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST, Intent.PURCHASE_INTEREST);
      ctx.patterns.push({
        pattern: [Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST],
        frequency: 5,
        predictedNextIntent: Intent.PURCHASE_INTEREST,
        successRate: 0.8,
      });
      const predicted = memory.predictNextIntents(ctx);
      expect(Array.isArray(predicted)).toBe(true);
    });
  });

  // ----------------------------------------------------------------
  // clearOldConversations
  // ----------------------------------------------------------------
  describe('clearOldConversations', () => {
    it('does not throw on empty memory', () => {
      expect(() => memory.clearOldConversations()).not.toThrow();
    });

    it('preserves recent conversations', () => {
      memory.getOrCreateContext('conv-fresh');
      memory.clearOldConversations();
      expect(memory.getContext('conv-fresh')).toBeDefined();
    });
  });

  // ----------------------------------------------------------------
  // getStats
  // ----------------------------------------------------------------
  describe('getStats', () => {
    it('returns zero stats for empty memory', () => {
      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(0);
      expect(stats.totalMessages).toBe(0);
      expect(stats.averageThemes).toBe(0);
    });

    it('counts conversations after creation', () => {
      memory.getOrCreateContext('conv-1');
      memory.getOrCreateContext('conv-2');
      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(2);
    });
  });

  // ----------------------------------------------------------------
  // exportConversation
  // ----------------------------------------------------------------
  describe('exportConversation', () => {
    it('returns null for unknown conversation', () => {
      expect(memory.exportConversation('missing')).toBeNull();
    });

    it('returns full state for known conversation', () => {
      memory.getOrCreateContext('conv-1');
      const exported = memory.exportConversation('conv-1');
      expect(exported).not.toBeNull();
      expect(exported!.conversationId).toBe('conv-1');
      expect(exported!.messageHistory).toEqual([]);
    });
  });
});
