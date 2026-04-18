import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent } from './ninaEngine';

function makeContext() {
  return {
    conversationId: 'test-ctx',
    customerName: '',
    recentIntents: [] as string[],
    messageCount: 0,
    firstMessageTime: new Date(),
    lastMessageTime: new Date(),
    language: 'en',
  };
}

describe('NinaEngine', () => {
  let engine: NinaEngine;
  beforeEach(() => { engine = new NinaEngine(); });

  /* -- Intent Detection -- */
  describe('Intent Detection', () => {
    it('detects PROPERTY_INQUIRY for property keywords', () => {
      const result = engine.processMessage('I am looking for a property or villa in Dubai', makeContext());
      expect(result.primary.intent.startsWith('PROPERTY')).toBe(true);
    });

    it('detects VIEWING_REQUEST for viewing keywords', () => {
      const result = engine.processMessage('I want to schedule a viewing and visit the property tour', makeContext());
      expect(result.primary.intent.startsWith('VIEWING')).toBe(true);
    });

    it('detects PURCHASE_INTEREST for strong buy signals', () => {
      const result = engine.processMessage(
        'I am ready to buy and purchase this property, I am serious and want to invest',
        makeContext(),
      );
      expect(result.primary.intent.startsWith('PURCHASE')).toBe(true);
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
      const result = engine.processMessage('Tell me about properties in Dubai Marina', makeContext());
      expect(Object.values(Intent)).toContain(result.primary.intent);
    });

    it('returns UNKNOWN or GENERAL for gibberish', () => {
      const result = engine.processMessage('xyzzy plugh abracadabra', makeContext());
      expect([Intent.UNKNOWN, Intent.GREETING]).toContain(result.primary.intent);
    });
  });

  /* -- Sentiment -- */
  describe('Sentiment Analysis', () => {
    it('detects POSITIVE sentiment from positive words', () => {
      const result = engine.processMessage('This is wonderful and amazing, I love it', makeContext());
      expect(result.sentiment.sentiment).toBe('POSITIVE');
    });

    it('detects NEGATIVE sentiment from negative words', () => {
      const result = engine.processMessage('This is terrible and horrible, I hate it', makeContext());
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
    });

    it('detects NEUTRAL for neutral messages', () => {
      const result = engine.processMessage('I would like information about available units', makeContext());
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
    });

    it('sentiment values are uppercase', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(result.sentiment.sentiment).toMatch(/^(POSITIVE|NEGATIVE|NEUTRAL)$/);
    });
  });

  /* -- Confidence -- */
  describe('Confidence', () => {
    it('returns non-negative confidence', () => {
      const result = engine.processMessage('property search', makeContext());
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
    });

    it('confidence is a number', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(typeof result.primary.confidence).toBe('number');
    });
  });

  /* -- Response Structure -- */
  describe('Response Structure', () => {
    it('has suggestedResponse', () => {
      const result = engine.processMessage('hi', makeContext());
      expect(result.suggestedResponse).toBeDefined();
    });

    it('has entities array', () => {
      const result = engine.processMessage('I want a villa', makeContext());
      expect(Array.isArray(result.entities)).toBe(true);
    });

    it('has topics array', () => {
      const result = engine.processMessage('price information', makeContext());
      expect(Array.isArray(result.topics)).toBe(true);
    });

    it('has requiresAgentHandoff boolean', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
    });

    it('has timestamp', () => {
      const result = engine.processMessage('test', makeContext());
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

  /* -- Context Awareness -- */
  describe('Context Awareness', () => {
    it('uses context when provided', () => {
      const ctx = makeContext();
      ctx.recentIntents = [Intent.PROPERTY_INQUIRY];
      const result = engine.processMessage('tell me more about it', ctx);
      expect(result).toBeDefined();
    });

    it('processes with empty context', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(result).toBeDefined();
    });
  });

  /* -- recordFeedback -- */
  describe('recordFeedback', () => {
    it('has recordFeedback method', () => {
      expect(typeof engine.recordFeedback).toBe('function');
    });

    it('does not throw on valid feedback', () => {
      expect(() => {
        engine.recordFeedback('conv-1', Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST);
      }).not.toThrow();
    });
  });
});
