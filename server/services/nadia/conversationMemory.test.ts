/**
 * ConversationMemory Unit Tests
 * Tests in-memory conversation context store.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

vi.mock('./ninaEngine', () => ({
  Intent: {
    PROPERTY_INQUIRY: 'PROPERTY_INQUIRY',
    VIEWING_REQUEST: 'VIEWING_REQUEST',
    GREETING: 'GREETING',
    FAREWELL: 'FAREWELL',
    UNKNOWN: 'UNKNOWN',
  },
}));

import { ConversationMemory } from './conversationMemory';

describe('ConversationMemory', () => {
  let memory: ConversationMemory;

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  describe('getOrCreateContext', () => {
    it('creates a new context', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx).toBeDefined();
      expect(ctx.conversationId).toBe('conv-1');
    });
    it('returns same context on repeated calls', () => {
      const ctx1 = memory.getOrCreateContext('conv-1');
      const ctx2 = memory.getOrCreateContext('conv-1');
      expect(ctx1).toBe(ctx2);
    });
    it('creates separate contexts for different IDs', () => {
      const ctx1 = memory.getOrCreateContext('conv-1');
      const ctx2 = memory.getOrCreateContext('conv-2');
      expect(ctx1.conversationId).not.toBe(ctx2.conversationId);
    });
    it('initializes with empty messageHistory', () => {
      expect(memory.getOrCreateContext('conv-1').messageHistory).toEqual([]);
    });
    it('initializes lastUpdateTime as Date', () => {
      expect(memory.getOrCreateContext('conv-1').lastUpdateTime).toBeInstanceOf(Date);
    });
    it('initializes with zero duration', () => {
      expect(memory.getOrCreateContext('conv-1').duration).toBe(0);
    });
    it('initializes empty arrays', () => {
      const ctx = memory.getOrCreateContext('conv-1');
      expect(ctx.themes).toEqual([]);
      expect(ctx.userPreferences).toEqual([]);
      expect(ctx.patterns).toEqual([]);
      expect(ctx.recentIntents).toEqual([]);
    });
  });

  describe('getContext', () => {
    it('returns undefined for unknown ID', () => {
      expect(memory.getContext('nonexistent')).toBeUndefined();
    });
    it('returns context after creation', () => {
      memory.getOrCreateContext('conv-1');
      expect(memory.getContext('conv-1')?.conversationId).toBe('conv-1');
    });
  });

  describe('updateContext', () => {
    it('adds message to history', () => {
      memory.getOrCreateContext('conv-1');
      const message = { id: 'msg-1', conversationId: 'conv-1', content: 'Hello', sender: 'CUSTOMER' as const, timestamp: new Date() };
      const intentResult = {
        primary: { intent: 'GREETING' as any, confidence: 0.9, reasoning: 'Keyword match' },
        secondary: [], entities: [],
        sentiment: { sentiment: 'NEUTRAL' as const, score: 0, keywords: [] },
        topics: [], requiresAgentHandoff: false, suggestedResponse: 'Hello!', timestamp: new Date(),
      };
      const ctx = memory.updateContext('conv-1', message, intentResult);
      expect(ctx.messageHistory).toHaveLength(1);
      expect(ctx.messageHistory[0].content).toBe('Hello');
    });
    it('updates lastUpdateTime', () => {
      memory.getOrCreateContext('conv-1');
      const before = memory.getContext('conv-1')!.lastUpdateTime;
      const message = { id: 'msg-2', conversationId: 'conv-1', content: 'Test', sender: 'CUSTOMER' as const, timestamp: new Date() };
      const intentResult = {
        primary: { intent: 'UNKNOWN' as any, confidence: 0.1, reasoning: '' },
        secondary: [], entities: [],
        sentiment: { sentiment: 'NEUTRAL' as const, score: 0, keywords: [] },
        topics: [], requiresAgentHandoff: false, suggestedResponse: '', timestamp: new Date(),
      };
      const ctx = memory.updateContext('conv-1', message, intentResult);
      expect(ctx.lastUpdateTime.getTime()).toBeGreaterThanOrEqual(before.getTime());
    });
    it('appends multiple messages', () => {
      memory.getOrCreateContext('conv-1');
      const makeMsg = (id: string, text: string) => ({ id, conversationId: 'conv-1', content: text, sender: 'CUSTOMER' as const, timestamp: new Date() });
      const makeIntent = () => ({
        primary: { intent: 'UNKNOWN' as any, confidence: 0.1, reasoning: '' },
        secondary: [], entities: [],
        sentiment: { sentiment: 'NEUTRAL' as const, score: 0, keywords: [] },
        topics: [], requiresAgentHandoff: false, suggestedResponse: '', timestamp: new Date(),
      });
      memory.updateContext('conv-1', makeMsg('m1', 'First'), makeIntent());
      memory.updateContext('conv-1', makeMsg('m2', 'Second'), makeIntent());
      memory.updateContext('conv-1', makeMsg('m3', 'Third'), makeIntent());
      expect(memory.getContext('conv-1')!.messageHistory).toHaveLength(3);
    });
    it('tracks recent intents', () => {
      memory.getOrCreateContext('conv-1');
      const message = { id: 'msg-1', conversationId: 'conv-1', content: 'Looking for property', sender: 'CUSTOMER' as const, timestamp: new Date() };
      const intentResult = {
        primary: { intent: 'PROPERTY_INQUIRY' as any, confidence: 0.9, reasoning: 'Keyword' },
        secondary: [], entities: [],
        sentiment: { sentiment: 'NEUTRAL' as const, score: 0, keywords: [] },
        topics: ['property'], requiresAgentHandoff: false, suggestedResponse: 'I can help!', timestamp: new Date(),
      };
      const ctx = memory.updateContext('conv-1', message, intentResult);
      expect(ctx.recentIntents.length).toBeGreaterThan(0);
    });
  });

  describe('getStats', () => {
    it('returns stats object', () => {
      const stats = memory.getStats();
      expect(stats).toHaveProperty('totalConversations');
      expect(stats).toHaveProperty('totalMessages');
      expect(stats).toHaveProperty('averageThemes');
    });
    it('returns 0 initially', () => {
      expect(memory.getStats().totalConversations).toBe(0);
    });
    it('counts created contexts', () => {
      memory.getOrCreateContext('conv-1');
      memory.getOrCreateContext('conv-2');
      expect(memory.getStats().totalConversations).toBe(2);
    });
  });

  describe('exportConversation', () => {
    it('returns null for unknown ID', () => {
      expect(memory.exportConversation('nonexistent')).toBeNull();
    });
    it('returns state for known ID', () => {
      memory.getOrCreateContext('conv-1');
      const exported = memory.exportConversation('conv-1');
      expect(exported?.conversationId).toBe('conv-1');
    });
  });

  describe('capacity', () => {
    it('handles 50+ concurrent contexts', () => {
      for (let i = 0; i < 50; i++) memory.getOrCreateContext(`conv-${i}`);
      expect(memory.getStats().totalConversations).toBe(50);
    });
  });
});