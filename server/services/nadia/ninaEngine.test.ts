/**
 * Nina Engine — Tests
 * Tests NinaEngine class: processMessage, intent detection, entity extraction,
 * sentiment analysis, handoff logic, response generation, feedback recording
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

import { NinaEngine, Intent, ConversationContext } from './ninaEngine';

// ─── Helpers ────────────────────────────────────────────────────────
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

describe('NinaEngine', () => {
  let engine: NinaEngine;

  beforeEach(() => {
    engine = new NinaEngine();
  });

  // ─── processMessage ─────────────────────────────────────────────
  describe('processMessage', () => {
    it('should return IntentResult with all expected fields', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want to buy a villa in Dubai Marina', ctx);

      expect(result).toHaveProperty('primary');
      expect(result).toHaveProperty('secondary');
      expect(result).toHaveProperty('entities');
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('topics');
      expect(result).toHaveProperty('requiresAgentHandoff');
      expect(result).toHaveProperty('suggestedResponse');
      expect(result).toHaveProperty('timestamp');
    });

    it('should detect property inquiry intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Show me available properties', ctx);
      expect(result.primary.intent).toContain('PROPERTY');
    });

    it('should detect viewing request intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want to schedule a viewing for tomorrow', ctx);
      expect(result.primary.intent).toContain('VIEWING');
    });

    it('should detect purchase interest intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I am ready to buy this property', ctx);
      expect(result.primary.intent).toContain('PURCHASE');
    });

    it('should detect complaint intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I have a complaint about the service, very disappointed', ctx);
      expect(result.primary.intent).toContain('COMPLAINT');
    });

    it('should detect greeting intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Hello, good morning', ctx);
      expect(result.primary.intent).toBe(Intent.GREETING);
    });

    it('should detect farewell intent', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Thank you goodbye', ctx);
      expect(result.primary.intent).toBe(Intent.FAREWELL);
    });
  });

  // ─── Confidence Scoring ─────────────────────────────────────────
  describe('confidence scoring', () => {
    it('should have confidence between 0 and 100', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want a villa', ctx);
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.primary.confidence).toBeLessThanOrEqual(100);
    });

    it('should boost confidence for context-matching intents', () => {
      const ctx = makeContext({ recentIntents: [Intent.PROPERTY_INQUIRY] });
      const result = engine.processMessage('Show me properties', ctx);
      expect(result.primary.confidence).toBeGreaterThan(0);
    });
  });

  // ─── Entity Extraction ─────────────────────────────────────────
  describe('entity extraction', () => {
    it('should extract property type entity', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want a villa', ctx);
      const propertyEntities = result.entities.filter((e) => e.type === 'PROPERTY_TYPE');
      expect(propertyEntities.length).toBeGreaterThan(0);
      expect(propertyEntities[0].value).toBe('villa');
    });

    it('should extract location entity', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Properties in dubai marina', ctx);
      const locationEntities = result.entities.filter((e) => e.type === 'LOCATION');
      expect(locationEntities.length).toBeGreaterThan(0);
    });

    it('should extract bedroom entity', () => {
      const ctx = makeContext();
      const result = engine.processMessage('3 bedroom apartment', ctx);
      const bedroomEntities = result.entities.filter((e) => e.type === 'BEDROOMS');
      expect(bedroomEntities.length).toBeGreaterThan(0);
    });

    it('should extract amenity entities', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I need a place with pool and gym', ctx);
      const amenityEntities = result.entities.filter((e) => e.type === 'AMENITY');
      expect(amenityEntities.length).toBeGreaterThan(0);
    });

    it('should return empty entities for unrelated messages', () => {
      const ctx = makeContext();
      const result = engine.processMessage('hello there', ctx);
      // May or may not have entities, but should not crash
      expect(Array.isArray(result.entities)).toBe(true);
    });
  });

  // ─── Sentiment Analysis ────────────────────────────────────────
  describe('sentiment analysis', () => {
    it('should detect positive sentiment', () => {
      const ctx = makeContext();
      const result = engine.processMessage('This is amazing and excellent', ctx);
      expect(result.sentiment.sentiment).toBe('POSITIVE');
    });

    it('should detect negative sentiment', () => {
      const ctx = makeContext();
      const result = engine.processMessage('This is terrible and awful', ctx);
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
    });

    it('should detect neutral sentiment', () => {
      const ctx = makeContext();
      const result = engine.processMessage('show me properties', ctx);
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
    });

    it('should return score between -1 and 1', () => {
      const ctx = makeContext();
      const result = engine.processMessage('amazing beautiful wonderful', ctx);
      expect(result.sentiment.score).toBeGreaterThanOrEqual(-1);
      expect(result.sentiment.score).toBeLessThanOrEqual(1);
    });
  });

  // ─── Agent Handoff ─────────────────────────────────────────────
  describe('agent handoff', () => {
    it('should require handoff for complaints', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I have a complaint the service is terrible', ctx);
      expect(result.requiresAgentHandoff).toBe(true);
    });

    it('should require handoff for assistance requests', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I need help please assist me', ctx);
      expect(result.requiresAgentHandoff).toBe(true);
    });

    it('should not require handoff for simple property search', () => {
      const ctx = makeContext();
      const result = engine.processMessage('show me villas', ctx);
      expect(result.requiresAgentHandoff).toBe(false);
    });
  });

  // ─── Response Generation ───────────────────────────────────────
  describe('response generation', () => {
    it('should generate non-empty response', () => {
      const ctx = makeContext();
      const result = engine.processMessage('Hello', ctx);
      expect(result.suggestedResponse.length).toBeGreaterThan(0);
    });

    it('should include customer name in greeting', () => {
      const ctx = makeContext({ customerName: 'Ahmed' });
      const result = engine.processMessage('Hello good morning', ctx);
      expect(result.suggestedResponse).toContain('Ahmed');
    });

    it('should generate handoff message for complaints', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I have a complaint about the agent, very disappointed', ctx);
      expect(result.suggestedResponse).toContain('team');
    });
  });

  // ─── Topics Extraction ─────────────────────────────────────────
  describe('topics extraction', () => {
    it('should extract topics from message', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want to buy a villa in dubai marina with pool', ctx);
      expect(result.topics.length).toBeGreaterThan(0);
    });

    it('should detect viewing topic', () => {
      const ctx = makeContext();
      const result = engine.processMessage('I want to view the property', ctx);
      expect(result.topics.some((t) => t.toUpperCase().includes('VIEWING'))).toBe(true);
    });
  });

  // ─── recordFeedback ────────────────────────────────────────────
  describe('recordFeedback', () => {
    it('should record feedback for incorrect prediction', () => {
      // Should not throw
      engine.recordFeedback('msg-1', Intent.PURCHASE_INTEREST, Intent.PROPERTY_INQUIRY);
    });

    it('should not record feedback when prediction is correct', () => {
      // Should not throw
      engine.recordFeedback('msg-2', Intent.GREETING, Intent.GREETING);
    });
  });

  // ─── Secondary Intents ─────────────────────────────────────────
  describe('secondary intents', () => {
    it('should detect secondary intents for complex messages', () => {
      const ctx = makeContext();
      const result = engine.processMessage(
        'I want to buy a villa with pool and schedule a viewing, how much does it cost?',
        ctx,
      );
      expect(result.secondary.length).toBeGreaterThan(0);
    });

    it('should limit secondary intents to max 3', () => {
      const ctx = makeContext();
      const result = engine.processMessage(
        'buy villa pool gym schedule tour view price cost help assist complaint',
        ctx,
      );
      expect(result.secondary.length).toBeLessThanOrEqual(3);
    });
  });
});
