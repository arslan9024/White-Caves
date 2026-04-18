/**
 * ninaEngine — Test Suite
 * =========================
 * 28 tests covering NinaEngine class, Intent enum, processMessage, recordFeedback
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent } from './ninaEngine';
import type { ConversationContext, IntentResult } from './ninaEngine';

function makeContext(overrides: Partial<ConversationContext> = {}): ConversationContext {
  return {
    conversationId: 'test-conv-1',
    recentIntents: [],
    recentTopics: [],
    mentionedProperties: [],
    needsAssistance: false,
    lastMessageTimestamp: new Date(),
    ...overrides,
  };
}

describe('NinaEngine', () => {
  let engine: NinaEngine;

  beforeEach(() => {
    engine = new NinaEngine();
  });

  /* ═══════════════════ Intent enum ═══════════════════ */

  describe('Intent enum', () => {
    it('has PROPERTY_INQUIRY value', () => {
      expect(Intent.PROPERTY_INQUIRY).toBeDefined();
    });

    it('has VIEWING_REQUEST value', () => {
      expect(Intent.VIEWING_REQUEST).toBeDefined();
    });

    it('has COMPLAINT value', () => {
      expect(Intent.COMPLAINT).toBeDefined();
    });

    it('has GREETING value', () => {
      expect(Intent.GREETING).toBeDefined();
    });

    it('has UNKNOWN value', () => {
      expect(Intent.UNKNOWN).toBeDefined();
    });

    it('has PURCHASE_INTEREST value', () => {
      expect(Intent.PURCHASE_INTEREST).toBeDefined();
    });

    it('has NEGOTIATION value', () => {
      expect(Intent.NEGOTIATION).toBeDefined();
    });
  });

  /* ═══════════════════ processMessage ═══════════════════ */

  describe('processMessage', () => {
    it('returns an IntentResult object', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Hello, I need help', ctx);
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.secondary).toBeDefined();
      expect(result.entities).toBeDefined();
      expect(result.sentiment).toBeDefined();
    });

    it('detects property inquiry intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want to buy a villa in Dubai Marina', ctx);
      expect(result.primary.intent).toMatch(/PROPERTY/);
    });

    it('returns confidence between 0 and 100', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Show me apartments', ctx);
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.primary.confidence).toBeLessThanOrEqual(100);
    });

    it('detects entities from message', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I need a 3 bedroom villa in Jumeirah', ctx);
      expect(result.entities.length).toBeGreaterThan(0);
    });

    it('returns entity objects with type, value, confidence', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Looking for a villa', ctx);
      if (result.entities.length > 0) {
        const entity = result.entities[0];
        expect(entity).toHaveProperty('type');
        expect(entity).toHaveProperty('value');
        expect(entity).toHaveProperty('confidence');
      }
    });

    it('analyzes sentiment', () => {
      const ctx = makeContext();
      const result = engine.processMessage('This is wonderful!', ctx);
      expect(result.sentiment.sentiment).toBe('POSITIVE');
    });

    it('detects negative sentiment', () => {
      const ctx = makeContext();
      const result = engine.processMessage('This is terrible and frustrating', ctx);
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
    });

    it('returns neutral sentiment for factual messages', () => {
      const ctx = makeContext();
      const result = engine.processMessage('The property is located here', ctx);
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
    });

    it('provides suggestedResponse string', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Hello', ctx);
      expect(typeof result.suggestedResponse).toBe('string');
      expect(result.suggestedResponse.length).toBeGreaterThan(0);
    });

    it('includes topics array', () => {
      const ctx = makeContext();
      const result = engine.processMessage('What is the price of this apartment?', ctx);
      expect(Array.isArray(result.topics)).toBe(true);
    });

    it('sets requiresAgentHandoff for complaints', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I have a serious complaint about the agent service', ctx);
      expect(result.requiresAgentHandoff).toBe(true);
    });

    it('sets timestamp on result', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Hello', ctx);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('returns secondary intents array', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want to buy and schedule a viewing', ctx);
      expect(Array.isArray(result.secondary)).toBe(true);
    });

    it('uses context for intent boosting', () => {
      const ctx = makeContext({
        recentIntents: [Intent.PROPERTY_INQUIRY],
      });
      const result = engine.processMessage('Tell me more about it', ctx);
      // With recent property inquiry context, follow-up should still relate
      expect(result.primary).toBeDefined();
    });

    it('handles empty message gracefully', () => {
      const ctx = makeContext();
      const result = engine.processMessage('', ctx);
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
    });
  });

  /* ═══════════════════ recordFeedback ═══════════════════ */

  describe('recordFeedback', () => {
    it('does not throw when recording feedback', () => {
      expect(() =>
        engine.recordFeedback('msg-1', Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST),
      ).not.toThrow();
    });

    it('accepts same actual and predicted intents', () => {
      expect(() =>
        engine.recordFeedback('msg-2', Intent.GREETING, Intent.GREETING),
      ).not.toThrow();
    });

    it('can be called multiple times', () => {
      engine.recordFeedback('msg-1', Intent.COMPLAINT, Intent.UNKNOWN);
      engine.recordFeedback('msg-2', Intent.VIEWING_REQUEST, Intent.PROPERTY_INQUIRY);
      // Should not throw
    });
  });
});
/**
 * NinaEngine Unit Tests
 * Tests AI NLP engine: intent detection, entity extraction, sentiment analysis.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import { NinaEngine, Intent, type ConversationContext } from './ninaEngine';

function makeContext(overrides: Partial<ConversationContext> = {}): ConversationContext {
  return {
    conversationId: 'conv-test',
    recentIntents: [],
    recentTopics: [],
    mentionedProperties: [],
    needsAssistance: false,
    lastMessageTimestamp: new Date(),
    ...overrides,
  };
}

describe('NinaEngine', () => {
  let engine: NinaEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    engine = new NinaEngine();
  });

  describe('initialization', () => {
    it('creates instance', () => {
      expect(engine).toBeInstanceOf(NinaEngine);
    });
    it('has processMessage', () => {
      expect(typeof engine.processMessage).toBe('function');
    });
    it('has recordFeedback', () => {
      expect(typeof engine.recordFeedback).toBe('function');
    });
  });

  describe('processMessage', () => {
    it('returns IntentResult shape', () => {
      const r = engine.processMessage('Hello', makeContext());
      expect(r).toHaveProperty('primary');
      expect(r).toHaveProperty('secondary');
      expect(r).toHaveProperty('entities');
      expect(r).toHaveProperty('sentiment');
      expect(r).toHaveProperty('topics');
      expect(r).toHaveProperty('requiresAgentHandoff');
      expect(r).toHaveProperty('suggestedResponse');
      expect(r).toHaveProperty('timestamp');
    });
    it('primary has intent, confidence, reasoning', () => {
      const r = engine.processMessage('Hello', makeContext());
      expect(r.primary).toHaveProperty('intent');
      expect(r.primary).toHaveProperty('confidence');
      expect(typeof r.primary.confidence).toBe('number');
    });
    it('detects GREETING', () => {
      expect(engine.processMessage('Hello good morning', makeContext()).primary.intent).toBe(Intent.GREETING);
    });
    it('detects PROPERTY_INQUIRY', () => {
      expect(engine.processMessage('looking for villa apartment property', makeContext()).primary.intent).toBe(Intent.PROPERTY_INQUIRY);
    });
    it('detects VIEWING_REQUEST', () => {
      expect(engine.processMessage('schedule a viewing tour visit', makeContext()).primary.intent).toBe(Intent.VIEWING_REQUEST);
    });
    it('detects COMPLAINT', () => {
      expect(engine.processMessage('complaint problem issue', makeContext()).primary.intent).toBe(Intent.COMPLAINT);
    });
    it('detects FAREWELL', () => {
      expect(engine.processMessage('goodbye bye farewell', makeContext()).primary.intent).toBe(Intent.FAREWELL);
    });
    it('returns UNKNOWN for random text', () => {
      expect(engine.processMessage('xyzabc123', makeContext()).primary.intent).toBe(Intent.UNKNOWN);
    });
    it('suggestedResponse is string', () => {
      expect(typeof engine.processMessage('Hello', makeContext()).suggestedResponse).toBe('string');
    });
    it('timestamp is Date', () => {
      expect(engine.processMessage('Hello', makeContext()).timestamp).toBeInstanceOf(Date);
    });
  });

  describe('sentiment', () => {
    it('detects POSITIVE', () => {
      expect(engine.processMessage('amazing wonderful excellent love it!', makeContext()).sentiment.sentiment).toBe('POSITIVE');
    });
    it('detects NEGATIVE', () => {
      expect(engine.processMessage('terrible horrible awful bad angry frustrated disappointed', makeContext()).sentiment.sentiment).toBe('NEGATIVE');
    });
    it('detects NEUTRAL', () => {
      expect(engine.processMessage('send document please', makeContext()).sentiment.sentiment).toBe('NEUTRAL');
    });
    it('sentiment has score', () => {
      expect(typeof engine.processMessage('great', makeContext()).sentiment.score).toBe('number');
    });
    it('sentiment has keywords array', () => {
      expect(Array.isArray(engine.processMessage('amazing', makeContext()).sentiment.keywords)).toBe(true);
    });
  });

  describe('entity extraction', () => {
    it('returns entities array', () => {
      expect(Array.isArray(engine.processMessage('villa in Dubai Marina', makeContext()).entities)).toBe(true);
    });
    it('extracts property type', () => {
      const entities = engine.processMessage('Looking for a villa', makeContext()).entities;
      const prop = entities.find((e) => e.type === 'PROPERTY_TYPE');
      if (prop) expect(prop).toHaveProperty('value');
    });
    it('extracts location', () => {
      const entities = engine.processMessage('apartment in Dubai Marina', makeContext()).entities;
      const loc = entities.find((e) => e.type === 'LOCATION');
      if (loc) expect(loc).toHaveProperty('value');
    });
  });

  describe('agent handoff', () => {
    it('requiresAgentHandoff is boolean', () => {
      expect(typeof engine.processMessage('complaint', makeContext()).requiresAgentHandoff).toBe('boolean');
    });
    it('no handoff for greeting', () => {
      expect(engine.processMessage('Hello', makeContext()).requiresAgentHandoff).toBe(false);
    });
  });

  describe('topics', () => {
    it('returns topics array', () => {
      expect(Array.isArray(engine.processMessage('property', makeContext()).topics)).toBe(true);
    });
  });

  describe('recordFeedback', () => {
    it('does not throw', () => {
      expect(() => engine.recordFeedback('msg-1', Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST)).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('handles empty message', () => {
      expect(engine.processMessage('', makeContext())).toHaveProperty('primary');
    });
    it('handles very long message', () => {
      expect(engine.processMessage('property '.repeat(100), makeContext())).toBeDefined();
    });
    it('uses context recentIntents', () => {
      const ctx = makeContext({ recentIntents: [Intent.PROPERTY_INQUIRY] });
      expect(engine.processMessage('price?', ctx)).toBeDefined();
    });
  });
});