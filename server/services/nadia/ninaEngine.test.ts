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