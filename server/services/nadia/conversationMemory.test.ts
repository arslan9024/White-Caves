import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationMemory } from './conversationMemory';

function makeMsg(id, content, sender = 'CUSTOMER') {
  return { id, conversationId: 'conv-1', content, sender, timestamp: new Date() };
}

function makeIR(intent = 'GREETING') {
  return {
    primary: { intent, confidence: 0.9, reasoning: 'test' },
    secondary: [],
    sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
    entities: [],
    topics: [],
    conversationStage: 'INITIAL',
    requiresAgentHandoff: false,
    suggestedResponse: '',
    timestamp: new Date(),
  };
}

describe('ConversationMemory', () => {
  let mem;
  beforeEach(() => { mem = new ConversationMemory(); });

  describe('getOrCreateContext', () => {
    it('creates new context for unknown conversation', () => {
      const ctx = mem.getOrCreateContext('conv-1');
      expect(ctx.conversationId).toBe('conv-1');
      expect(ctx.messageHistory).toEqual([]);
    });

    it('returns same context on repeated calls', () => {
      const a = mem.getOrCreateContext('conv-1');
      const b = mem.getOrCreateContext('conv-1');
      expect(a).toBe(b);
    });
  });

  describe('updateContext', () => {
    it('adds message to history', () => {
      const msg = makeMsg('m1', 'hello');
      mem.updateContext('conv-1', msg, makeIR());
      const ctx = mem.getOrCreateContext('conv-1');
      expect(ctx.messageHistory).toHaveLength(1);
    });

    it('tracks recent intents', () => {
      mem.updateContext('conv-1', makeMsg('m1', 'hi'), makeIR('GREETING'));
      mem.updateContext('conv-1', makeMsg('m2', 'info'), makeIR('INFORMATION_REQUEST'));
      const ctx = mem.getOrCreateContext('conv-1');
      expect(ctx.recentIntents).toContain('GREETING');
      expect(ctx.recentIntents).toContain('INFORMATION_REQUEST');
    });

    it('limits recent intents to 5', () => {
      for (let i = 0; i < 8; i++) {
        mem.updateContext('conv-1', makeMsg('m' + i, 'msg'), makeIR('GREETING'));
      }
      const ctx = mem.getOrCreateContext('conv-1');
      expect(ctx.recentIntents.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getContext', () => {
    it('returns undefined for unknown conversation', () => {
      expect(mem.getContext('nope')).toBeUndefined();
    });

    it('returns existing context', () => {
      mem.getOrCreateContext('conv-1');
      expect(mem.getContext('conv-1')).toBeDefined();
    });
  });

  describe('getStats', () => {
    it('returns stats with totalConversations', () => {
      mem.getOrCreateContext('conv-1');
      const stats = mem.getStats();
      expect(stats).toHaveProperty('totalConversations');
      expect(stats.totalConversations).toBe(1);
    });

    it('returns totalMessages count', () => {
      mem.updateContext('conv-1', makeMsg('m1', 'hello'), makeIR());
      const stats = mem.getStats();
      expect(stats.totalMessages).toBe(1);
    });

    it('returns averageThemes', () => {
      const stats = mem.getStats();
      expect(stats).toHaveProperty('averageThemes');
    });
  });

  describe('isolation', () => {
    it('keeps separate contexts per conversation', () => {
      mem.getOrCreateContext('conv-1');
      mem.getOrCreateContext('conv-2');
      const stats = mem.getStats();
      expect(stats.totalConversations).toBe(2);
    });
  });
});
