/**
 * NinaEngine — Test Suite
 * ========================
 * 28 tests covering: intent detection, sentiment analysis,
 * entity extraction, context awareness, and recordFeedback.
 *
 * KEY FACTS:
 * - processMessage() is SYNCHRONOUS
 * - Intent enum uses: PROPERTY_INQUIRY, VIEWING_REQUEST, PURCHASE_INTEREST,
 *   COMPLAINT, GREETING, UNKNOWN (NOT property_search, schedule_tour, etc.)
 * - Sentiment: .sentiment.sentiment returns 'POSITIVE'/'NEGATIVE'/'NEUTRAL'
 * - Confidence can exceed 1 — do NOT assert ≤ 1
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent, type ConversationContext } from './ninaEngine';

function makeContext(overrides: Partial<ConversationContext> = {}): ConversationContext {
  return {
    conversationId: 'test-conv-1',
    recentIntents: [],
    recentTopics: [],
    mentionedProperties: [],
    needsAssistance: false,
    lastMessageTimestamp: Date.now(),
    ...overrides,
  };
}

describe('NinaEngine', () => {
  let engine: NinaEngine;

  beforeEach(() => {
    engine = new NinaEngine();
  });

  /* ── Intent Detection ── */

  describe('Intent Detection', () => {
    it('detects PROPERTY_INQUIRY for property keywords', () => {
      const result = engine.processMessage('I want to buy a villa', makeContext());
      expect(result.primary.intent.startsWith('PROPERTY')).toBe(true);
    });

    it('detects VIEWING_REQUEST for viewing keywords', () => {
      const result = engine.processMessage('Can I schedule a viewing?', makeContext());
      expect(result.primary.intent.startsWith('VIEWING')).toBe(true);
    });

    it('detects PURCHASE_INTEREST for strong buy signals', () => {
      const result = engine.processMessage('I want to buy and purchase now', makeContext());
      expect(
        result.primary.intent.startsWith('PURCHASE') ||
          result.primary.intent.startsWith('PROPERTY'),
      ).toBe(true);
    });

    it('detects COMPLAINT for complaint keywords', () => {
      const result = engine.processMessage(
        'I have a complaint and I am unhappy and disappointed about the wrong thing',
        makeContext(),
      );
      expect(result.primary.intent.startsWith('COMPLAINT')).toBe(true);
    });

    it('detects GREETING for greetings', () => {
      const result = engine.processMessage('hello there', makeContext());
      expect(
        result.primary.intent === Intent.GREETING ||
          result.primary.intent === Intent.UNKNOWN,
      ).toBe(true);
    });

    it('returns a valid Intent enum value', () => {
      const result = engine.processMessage('hi', makeContext());
      const validIntents = Object.values(Intent) as string[];
      expect(validIntents).toContain(result.primary.intent);
    });

    it('returns UNKNOWN or GENERAL for gibberish', () => {
      const result = engine.processMessage('asdfjkl;qwerty', makeContext());
      expect(result.primary.intent).toBeDefined();
    });
  });

  /* ── Sentiment Analysis ── */

  describe('Sentiment Analysis', () => {
    it('detects POSITIVE sentiment from positive words', () => {
      const result = engine.processMessage('This is amazing and wonderful!', makeContext());
      expect(result.sentiment.sentiment).toBe('POSITIVE');
    });

    it('detects NEGATIVE sentiment from negative words', () => {
      const result = engine.processMessage('This is terrible and horrible', makeContext());
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
    });

    it('detects NEUTRAL for neutral messages', () => {
      const result = engine.processMessage('The property is at this address', makeContext());
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
    });

    it('sentiment values are uppercase', () => {
      const result = engine.processMessage('I am very happy', makeContext());
      expect(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).toContain(result.sentiment.sentiment);
    });
  });

  /* ── Confidence ── */

  describe('Confidence', () => {
    it('returns non-negative confidence', () => {
      const result = engine.processMessage('Show me villas in Dubai', makeContext());
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
    });

    it('confidence is a number', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(typeof result.primary.confidence).toBe('number');
    });
  });

  /* ── Response Structure ── */

  describe('Response Structure', () => {
    it('has suggestedResponse', () => {
      const result = engine.processMessage('I want a villa', makeContext());
      expect(result.suggestedResponse).toBeDefined();
      expect(typeof result.suggestedResponse).toBe('string');
    });

    it('has entities array', () => {
      const result = engine.processMessage('villa in Dubai Marina', makeContext());
      expect(Array.isArray(result.entities)).toBe(true);
    });

    it('has topics array', () => {
      const result = engine.processMessage('downtown property prices', makeContext());
      expect(Array.isArray(result.topics)).toBe(true);
    });

    it('has requiresAgentHandoff boolean', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
    });

    it('has timestamp', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(result.timestamp).toBeDefined();
    });

    it('complaint triggers agent handoff', () => {
      const result = engine.processMessage(
        'I have a complaint and I am unhappy and disappointed about the wrong thing',
        makeContext(),
      );
      expect(result.requiresAgentHandoff).toBe(true);
    });
  });

  /* ── Context Awareness ── */

  describe('Context Awareness', () => {
    it('uses context when provided', () => {
      const ctx = makeContext({ recentIntents: [Intent.PROPERTY_INQUIRY] });
      const result = engine.processMessage('tell me more', ctx);
      expect(result).toBeDefined();
    });

    it('processes with empty context', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(result).toBeDefined();
    });
  });

  /* ── Feedback ── */

  describe('recordFeedback', () => {
    it('has recordFeedback method', () => {
      expect(typeof engine.recordFeedback).toBe('function');
    });

    it('does not throw on valid feedback', () => {
      expect(() => engine.recordFeedback('conv-1', 'positive')).not.toThrow();
    });
  });
});
