/**
 * ConversationMemory Unit Tests
 * Tests: context management, message tracking, theme detection,
 * preference extraction, pattern recognition, cleanup, stats
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationMemory, Message, ConversationMemoryState } from './conversationMemory';
import { Intent, IntentResult, Entity } from './ninaEngine';

// ============================================================================
// HELPERS
// ============================================================================

function makeMessage(
  overrides: Partial<Message> = {}
): Message {
  return {
    id: `msg-${Math.random().toString(36).slice(2, 8)}`,
    conversationId: 'conv-1',
    content: 'Hello, I am looking for a villa in Dubai Marina',
    sender: 'CUSTOMER',
    timestamp: new Date(),
    ...overrides,
  };
}

function makeIntentResult(
  overrides: Partial<IntentResult> = {}
): IntentResult {
  return {
    primary: { intent: Intent.PROPERTY_INQUIRY, confidence: 0.9, reasoning: 'keyword match' },
    secondary: [],
    entities: [],
    sentiment: { sentiment: 'NEUTRAL', score: 0, keywords: [] },
    topics: [],
    requiresAgentHandoff: false,
    suggestedResponse: '',
    timestamp: new Date(),
    ...overrides,
  };
}

// ============================================================================
// TESTS
// ============================================================================

describe('ConversationMemory', () => {
  let memory: ConversationMemory;

  beforeEach(() => {
    memory = new ConversationMemory();
  });

  // --------------------------------------------------------------------------
  // Context creation & retrieval
  // --------------------------------------------------------------------------
  describe('getOrCreateContext', () => {
    it('creates a new context for unknown conversation', () => {
      const ctx = memory.getOrCreateContext('conv-new');

      expect(ctx.conversationId).toBe('conv-new');
      expect(ctx.messageHistory).toEqual([]);
      expect(ctx.themes).toEqual([]);
      expect(ctx.userPreferences).toEqual([]);
      expect(ctx.patterns).toEqual([]);
      expect(ctx.recentIntents).toEqual([]);
      expect(ctx.predictedNextIntents).toEqual([]);
      expect(ctx.createdAt).toBeInstanceOf(Date);
      expect(ctx.lastUpdateTime).toBeInstanceOf(Date);
      expect(ctx.duration).toBe(0);
    });

    it('returns the same context on repeated calls', () => {
      const a = memory.getOrCreateContext('conv-repeat');
      const b = memory.getOrCreateContext('conv-repeat');
      expect(a).toBe(b);
    });

    it('returns different contexts for different conversations', () => {
      const a = memory.getOrCreateContext('conv-a');
      const b = memory.getOrCreateContext('conv-b');
      expect(a).not.toBe(b);
      expect(a.conversationId).toBe('conv-a');
      expect(b.conversationId).toBe('conv-b');
    });
  });

  // --------------------------------------------------------------------------
  // getContext
  // --------------------------------------------------------------------------
  describe('getContext', () => {
    it('returns undefined for unknown conversation', () => {
      expect(memory.getContext('does-not-exist')).toBeUndefined();
    });

    it('returns context after creation', () => {
      memory.getOrCreateContext('conv-x');
      expect(memory.getContext('conv-x')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // updateContext
  // --------------------------------------------------------------------------
  describe('updateContext', () => {
    it('adds message to history', () => {
      const msg = makeMessage({ conversationId: 'conv-1' });
      const result = makeIntentResult();

      const ctx = memory.updateContext('conv-1', msg, result);

      expect(ctx.messageHistory).toHaveLength(1);
      expect(ctx.messageHistory[0]).toBe(msg);
    });

    it('tracks recent intents (max 5)', () => {
      const intents = [
        Intent.GREETING,
        Intent.PROPERTY_INQUIRY,
        Intent.VIEWING_REQUEST,
        Intent.PURCHASE_INTEREST,
        Intent.NEGOTIATION,
        Intent.FAREWELL,
      ];

      for (const intent of intents) {
        memory.updateContext(
          'conv-intents',
          makeMessage({ conversationId: 'conv-intents' }),
          makeIntentResult({ primary: { intent, confidence: 0.9, reasoning: 'test' } }),
        );
      }

      const ctx = memory.getContext('conv-intents')!;
      expect(ctx.recentIntents).toHaveLength(5);
      // First intent (GREETING) should be trimmed
      expect(ctx.recentIntents).not.toContain(Intent.GREETING);
      expect(ctx.recentIntents[ctx.recentIntents.length - 1]).toBe(Intent.FAREWELL);
    });

    it('caps message history at MAX_HISTORY (100)', () => {
      for (let i = 0; i < 110; i++) {
        memory.updateContext(
          'conv-overflow',
          makeMessage({ conversationId: 'conv-overflow', content: `msg-${i}` }),
          makeIntentResult(),
        );
      }

      const ctx = memory.getContext('conv-overflow')!;
      expect(ctx.messageHistory.length).toBeLessThanOrEqual(100);
      // Oldest messages trimmed — first remaining should be msg-10
      expect(ctx.messageHistory[0].content).toBe('msg-10');
    });

    it('updates duration', () => {
      const ctx = memory.updateContext(
        'conv-dur',
        makeMessage({ conversationId: 'conv-dur' }),
        makeIntentResult(),
      );

      expect(ctx.duration).toBeGreaterThanOrEqual(0);
      expect(ctx.lastUpdateTime.getTime()).toBeGreaterThanOrEqual(ctx.createdAt.getTime());
    });
  });

  // --------------------------------------------------------------------------
  // Theme tracking
  // --------------------------------------------------------------------------
  describe('theme tracking', () => {
    it('creates themes from topics', () => {
      memory.updateContext(
        'conv-themes',
        makeMessage({ conversationId: 'conv-themes' }),
        makeIntentResult({ topics: ['luxury', 'waterfront'] }),
      );

      const ctx = memory.getContext('conv-themes')!;
      expect(ctx.themes).toHaveLength(2);
      expect(ctx.themes.map((t) => t.topic)).toContain('luxury');
      expect(ctx.themes.map((t) => t.topic)).toContain('waterfront');
    });

    it('increments frequency for repeated topics', () => {
      for (let i = 0; i < 3; i++) {
        memory.updateContext(
          'conv-freq',
          makeMessage({ conversationId: 'conv-freq' }),
          makeIntentResult({ topics: ['marina'] }),
        );
      }

      const ctx = memory.getContext('conv-freq')!;
      const marina = ctx.themes.find((t) => t.topic === 'marina');
      expect(marina).toBeDefined();
      expect(marina!.frequency).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // User preference extraction
  // --------------------------------------------------------------------------
  describe('user preferences', () => {
    it('extracts property type preference from message', () => {
      memory.updateContext(
        'conv-pref',
        makeMessage({ conversationId: 'conv-pref', content: 'I want a villa in Palm Jumeirah' }),
        makeIntentResult(),
      );

      const ctx = memory.getContext('conv-pref')!;
      const typePref = ctx.userPreferences.find((p) => p.key === 'PROPERTY_TYPE');
      expect(typePref).toBeDefined();
      expect(typePref!.value).toBe('villa');
    });

    it('extracts budget from PRICE entities', () => {
      const entities: Entity[] = [
        { type: 'PRICE', value: '2,000,000 AED', confidence: 0.95 },
      ];

      memory.updateContext(
        'conv-budget',
        makeMessage({ conversationId: 'conv-budget' }),
        makeIntentResult({ entities }),
      );

      const ctx = memory.getContext('conv-budget')!;
      const budgetPref = ctx.userPreferences.find((p) => p.key === 'BUDGET');
      expect(budgetPref).toBeDefined();
      expect(budgetPref!.value).toBe('2,000,000 AED');
      expect(budgetPref!.confidence).toBe(0.95);
    });

    it('extracts location from LOCATION entities', () => {
      const entities: Entity[] = [
        { type: 'LOCATION', value: 'Downtown Dubai', confidence: 0.85 },
      ];

      memory.updateContext(
        'conv-loc',
        makeMessage({ conversationId: 'conv-loc' }),
        makeIntentResult({ entities }),
      );

      const ctx = memory.getContext('conv-loc')!;
      const locPref = ctx.userPreferences.find((p) => p.key === 'LOCATION');
      expect(locPref).toBeDefined();
      expect(locPref!.value).toBe('Downtown Dubai');
    });

    it('higher confidence replaces lower confidence preference', () => {
      memory.updateContext(
        'conv-conf',
        makeMessage({ conversationId: 'conv-conf' }),
        makeIntentResult({ entities: [{ type: 'LOCATION', value: 'Marina', confidence: 0.6 }] }),
      );

      memory.updateContext(
        'conv-conf',
        makeMessage({ conversationId: 'conv-conf' }),
        makeIntentResult({ entities: [{ type: 'LOCATION', value: 'JBR', confidence: 0.95 }] }),
      );

      const ctx = memory.getContext('conv-conf')!;
      const locPref = ctx.userPreferences.find((p) => p.key === 'LOCATION');
      expect(locPref!.value).toBe('JBR');
      expect(locPref!.confidence).toBe(0.95);
    });

    it('lower confidence does NOT replace higher confidence', () => {
      memory.updateContext(
        'conv-keep',
        makeMessage({ conversationId: 'conv-keep' }),
        makeIntentResult({ entities: [{ type: 'PRICE', value: '5M AED', confidence: 0.95 }] }),
      );

      memory.updateContext(
        'conv-keep',
        makeMessage({ conversationId: 'conv-keep' }),
        makeIntentResult({ entities: [{ type: 'PRICE', value: '2M AED', confidence: 0.5 }] }),
      );

      const ctx = memory.getContext('conv-keep')!;
      const pref = ctx.userPreferences.find((p) => p.key === 'BUDGET');
      expect(pref!.value).toBe('5M AED');
    });
  });

  // --------------------------------------------------------------------------
  // Customer info extraction
  // --------------------------------------------------------------------------
  describe('extractCustomerInfo', () => {
    it('extracts phone number', () => {
      const ctx = memory.getOrCreateContext('conv-phone');
      memory.extractCustomerInfo(ctx, 'Please call me at 0501234567');
      expect(ctx.customerPhone).toBe('0501234567');
    });

    it('extracts customer name', () => {
      const ctx = memory.getOrCreateContext('conv-name');
      memory.extractCustomerInfo(ctx, 'My name is Ahmed Khan');
      expect(ctx.customerName).toBe('Ahmed Khan');
    });

    it('does not overwrite existing phone', () => {
      const ctx = memory.getOrCreateContext('conv-nooverwrite');
      ctx.customerPhone = '0509999999';
      memory.extractCustomerInfo(ctx, 'Also try 0501111111');
      expect(ctx.customerPhone).toBe('0509999999');
    });

    it('does not overwrite existing name', () => {
      const ctx = memory.getOrCreateContext('conv-nooverwrite2');
      ctx.customerName = 'Original Name';
      memory.extractCustomerInfo(ctx, "I'm New Name");
      expect(ctx.customerName).toBe('Original Name');
    });
  });

  // --------------------------------------------------------------------------
  // Pattern recognition & prediction
  // --------------------------------------------------------------------------
  describe('pattern recognition', () => {
    it('identifies 2-gram patterns from intents', () => {
      const intents = [
        Intent.GREETING,
        Intent.PROPERTY_INQUIRY,
        Intent.VIEWING_REQUEST,
      ];

      for (const intent of intents) {
        memory.updateContext(
          'conv-patterns',
          makeMessage({ conversationId: 'conv-patterns' }),
          makeIntentResult({ primary: { intent, confidence: 0.9, reasoning: 'test' } }),
        );
      }

      const ctx = memory.getContext('conv-patterns')!;
      expect(ctx.patterns.length).toBeGreaterThan(0);
      // Should have GREETING->PROPERTY_INQUIRY and PROPERTY_INQUIRY->VIEWING_REQUEST
      const patternKeys = ctx.patterns.map((p) => p.pattern.join('->'));
      expect(patternKeys).toContain(`${Intent.GREETING}->${Intent.PROPERTY_INQUIRY}`);
    });
  });

  // --------------------------------------------------------------------------
  // Cleanup
  // --------------------------------------------------------------------------
  describe('clearOldConversations', () => {
    it('removes stale conversations (>24h old)', () => {
      const ctx = memory.getOrCreateContext('conv-old');
      // Artificially age the context
      ctx.lastUpdateTime = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago

      memory.getOrCreateContext('conv-fresh'); // fresh context

      memory.clearOldConversations();

      expect(memory.getContext('conv-old')).toBeUndefined();
      expect(memory.getContext('conv-fresh')).toBeDefined();
    });

    it('keeps conversations within TTL', () => {
      memory.getOrCreateContext('conv-recent');
      memory.clearOldConversations();
      expect(memory.getContext('conv-recent')).toBeDefined();
    });
  });

  // --------------------------------------------------------------------------
  // Stats
  // --------------------------------------------------------------------------
  describe('getStats', () => {
    it('returns zeroes for empty memory', () => {
      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(0);
      expect(stats.totalMessages).toBe(0);
      expect(stats.averageThemes).toBe(0);
    });

    it('counts conversations and messages', () => {
      memory.updateContext('conv-s1', makeMessage({ conversationId: 'conv-s1' }), makeIntentResult());
      memory.updateContext('conv-s1', makeMessage({ conversationId: 'conv-s1' }), makeIntentResult());
      memory.updateContext('conv-s2', makeMessage({ conversationId: 'conv-s2' }), makeIntentResult());

      const stats = memory.getStats();
      expect(stats.totalConversations).toBe(2);
      expect(stats.totalMessages).toBe(3);
    });
  });

  // --------------------------------------------------------------------------
  // Export
  // --------------------------------------------------------------------------
  describe('exportConversation', () => {
    it('returns null for unknown conversation', () => {
      expect(memory.exportConversation('nope')).toBeNull();
    });

    it('returns state for known conversation', () => {
      memory.getOrCreateContext('conv-export');
      const exported = memory.exportConversation('conv-export');
      expect(exported).toBeDefined();
      expect(exported!.conversationId).toBe('conv-export');
    });
  });
});
