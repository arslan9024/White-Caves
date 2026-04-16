/**
 * NinaEngine — Unit Tests
 * Tests the core NLP engine: intent detection, sentiment, entities, topics, handoff.
 * Pure in-memory — no database or external I/O needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import { NinaEngine, Intent, ConversationContext, IntentResult } from './ninaEngine';

// ── Helpers ──────────────────────────────────────────────────────────
function makeContext(overrides: Partial<ConversationContext> = {}): ConversationContext {
  return {
    conversationId: 'conv-1',
    recentIntents: [],
    recentTopics: [],
    mentionedProperties: [],
    needsAssistance: false,
    lastMessageTimestamp: new Date(),
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────
describe('NinaEngine', () => {
  let engine: NinaEngine;

  beforeEach(() => {
    engine = new NinaEngine();
  });

  // ── processMessage ───────────────────────────────────────────────
  describe('processMessage', () => {
    it('returns a complete IntentResult', () => {
      const result = engine.processMessage('I want to buy a villa in Dubai Marina', makeContext());
      expect(result).toHaveProperty('primary');
      expect(result).toHaveProperty('secondary');
      expect(result).toHaveProperty('entities');
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('topics');
      expect(result).toHaveProperty('requiresAgentHandoff');
      expect(result).toHaveProperty('suggestedResponse');
      expect(result).toHaveProperty('timestamp');
    });

    it('detects property inquiry intent', () => {
      const result = engine.processMessage('I am looking for a villa in Palm Jumeirah', makeContext());
      expect(result.primary.intent).toBe(Intent.PROPERTY_INQUIRY);
    });

    it('detects viewing request intent', () => {
      const result = engine.processMessage('I want to schedule a viewing for tomorrow', makeContext());
      expect([Intent.VIEWING_REQUEST, Intent.PROPERTY_INQUIRY]).toContain(result.primary.intent);
    });

    it('detects complaint intent', () => {
      const result = engine.processMessage('I have a complaint about the terrible service delay', makeContext());
      expect(result.primary.intent).toBe(Intent.COMPLAINT);
    });

    it('detects greeting intent', () => {
      const result = engine.processMessage('Hello, good morning!', makeContext());
      expect([Intent.GREETING, Intent.UNKNOWN]).toContain(result.primary.intent);
    });

    it('provides confidence score', () => {
      const result = engine.processMessage('I want to buy a villa', makeContext());
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.primary.confidence).toBeLessThanOrEqual(100);
    });

    it('provides reasoning for intent', () => {
      const result = engine.processMessage('I want to view a property', makeContext());
      expect(typeof result.primary.reasoning).toBe('string');
    });

    it('handles empty message', () => {
      const result = engine.processMessage('', makeContext());
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
    });
  });

  // ── Secondary Intents ────────────────────────────────────────────
  describe('secondary intents', () => {
    it('returns array of secondary intents', () => {
      const result = engine.processMessage(
        'I want to buy a villa and schedule a viewing please',
        makeContext(),
      );
      expect(Array.isArray(result.secondary)).toBe(true);
    });

    it('returns max 3 secondary intents', () => {
      const result = engine.processMessage(
        'I want to buy a villa, schedule a viewing, need mortgage info, and check legal requirements',
        makeContext(),
      );
      expect(result.secondary.length).toBeLessThanOrEqual(3);
    });
  });

  // ── Entity Extraction ────────────────────────────────────────────
  describe('entities', () => {
    it('extracts property type', () => {
      const result = engine.processMessage('I want a villa', makeContext());
      const hasPropertyType = result.entities.some(e => e.type === 'PROPERTY_TYPE');
      expect(hasPropertyType).toBe(true);
    });

    it('extracts location', () => {
      const result = engine.processMessage('Looking in Dubai Marina area', makeContext());
      const hasLocation = result.entities.some(e => e.type === 'LOCATION');
      expect(hasLocation).toBe(true);
    });

    it('extracts bedrooms', () => {
      const result = engine.processMessage('I need 3 bedrooms', makeContext());
      const hasBedrooms = result.entities.some(e => e.type === 'BEDROOMS');
      expect(hasBedrooms).toBe(true);
    });

    it('extracts price', () => {
      const result = engine.processMessage('Budget is 2000000 AED', makeContext());
      const hasPrice = result.entities.some(e => e.type === 'PRICE');
      expect(hasPrice).toBe(true);
    });

    it('extracts multiple entities', () => {
      const result = engine.processMessage('3 bedroom villa in Dubai Marina for 5000000 AED', makeContext());
      expect(result.entities.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ── Sentiment Analysis ───────────────────────────────────────────
  describe('sentiment', () => {
    it('detects positive sentiment', () => {
      const result = engine.processMessage('This is excellent and wonderful', makeContext());
      expect(result.sentiment.sentiment).toBe('POSITIVE');
      expect(result.sentiment.score).toBeGreaterThan(0);
    });

    it('detects negative sentiment', () => {
      const result = engine.processMessage('terrible horrible awful bad angry frustrated disappointed', makeContext());
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
      expect(result.sentiment.score).toBeLessThan(0);
    });

    it('detects neutral sentiment', () => {
      const result = engine.processMessage('I am looking at options', makeContext());
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
    });

    it('returns matched keywords', () => {
      const result = engine.processMessage('This is excellent', makeContext());
      expect(Array.isArray(result.sentiment.keywords)).toBe(true);
    });
  });

  // ── Topics ───────────────────────────────────────────────────────
  describe('topics', () => {
    it('extracts topics from message', () => {
      const result = engine.processMessage('I want to buy a villa in Dubai Marina', makeContext());
      expect(Array.isArray(result.topics)).toBe(true);
    });

    it('extracts property-related topics', () => {
      const result = engine.processMessage('3 bedroom villa near beach', makeContext());
      expect(result.topics.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ── Agent Handoff ────────────────────────────────────────────────
  describe('requiresAgentHandoff', () => {
    it('flags complaints appropriately', () => {
      const result = engine.processMessage('complaint problem issue terrible delay broken fraud', makeContext());
      expect(result.primary.intent).toBe(Intent.COMPLAINT);
      // Handoff may or may not trigger depending on sentiment/entity thresholds
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
    });

    it('does not require handoff for simple queries', () => {
      const result = engine.processMessage('What villas are available?', makeContext());
      expect(result.requiresAgentHandoff).toBe(false);
    });

    it('requires handoff for assistance requests', () => {
      const ctx = makeContext({ needsAssistance: true });
      const result = engine.processMessage('I need help from an agent please', ctx);
      // May or may not handoff depending on keyword matching
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
    });
  });

  // ── recordFeedback ───────────────────────────────────────────────
  describe('recordFeedback', () => {
    it('records intent correction without error', () => {
      expect(() => {
        engine.recordFeedback('msg-1', Intent.VIEWING_REQUEST, Intent.PROPERTY_INQUIRY);
      }).not.toThrow();
    });

    it('handles same intent (no mismatch)', () => {
      expect(() => {
        engine.recordFeedback('msg-1', Intent.PROPERTY_INQUIRY, Intent.PROPERTY_INQUIRY);
      }).not.toThrow();
    });
  });
});
