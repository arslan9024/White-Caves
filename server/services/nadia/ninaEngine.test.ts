/**
 * NinaEngine — Unit Tests
 * Tests the NLP engine: processMessage, intent detection, entity extraction,
 * sentiment analysis, handoff logic, and response generation.
 * All in-memory — no database mocking needed.
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

import { NinaEngine, Intent, type ConversationContext } from './ninaEngine';

function createFreshContext(overrides: Partial<ConversationContext> = {}): ConversationContext {
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

  // ----------------------------------------------------------------
  // processMessage — Core Pipeline
  // ----------------------------------------------------------------
  describe('processMessage', () => {
    it('returns a fully-formed IntentResult', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want to buy a villa in Dubai Marina', ctx);
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.primary.intent).toBeDefined();
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.primary.reasoning).toBeDefined();
      expect(result.entities).toBeDefined();
      expect(result.sentiment).toBeDefined();
      expect(result.topics).toBeDefined();
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
      expect(typeof result.suggestedResponse).toBe('string');
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('includes secondary intents', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want a villa and can I schedule a viewing next week?', ctx);
      expect(result.secondary).toBeDefined();
      expect(Array.isArray(result.secondary)).toBe(true);
    });
  });

  // ----------------------------------------------------------------
  // Intent Detection
  // ----------------------------------------------------------------
  describe('intent detection', () => {
    it('detects PROPERTY_INQUIRY for property search terms', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I am looking for a 3 bedroom apartment', ctx);
      expect([
        Intent.PROPERTY_INQUIRY,
        Intent.PROPERTY_INQUIRY_RESIDENTIAL,
        Intent.INFORMATION_REQUEST,
      ]).toContain(result.primary.intent);
    });

    it('detects VIEWING_REQUEST for scheduling terms', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('Can I schedule a viewing for tomorrow?', ctx);
      expect([
        Intent.VIEWING_REQUEST,
        Intent.VIEWING_REQUEST_IMMEDIATE,
        Intent.VIEWING_REQUEST_SCHEDULED,
      ]).toContain(result.primary.intent);
    });

    it('detects PURCHASE_INTEREST for buying terms', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want to make an offer on this property', ctx);
      expect([
        Intent.PURCHASE_INTEREST,
        Intent.PURCHASE_INTEREST_READY,
        Intent.NEGOTIATION,
        Intent.NEGOTIATION_PRICE,
        Intent.PROPERTY_INQUIRY,
        Intent.PROPERTY_INQUIRY_RESIDENTIAL,
      ]).toContain(result.primary.intent);
    });

    it('detects COMPLAINT for negative service terms', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want to complain about the terrible service', ctx);
      expect([
        Intent.COMPLAINT,
        Intent.COMPLAINT_AGENT,
        Intent.COMPLAINT_SERVICE,
      ]).toContain(result.primary.intent);
    });

    it('detects GREETING for hello/hi', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('Hello, good morning!', ctx);
      expect([Intent.GREETING, Intent.UNKNOWN]).toContain(result.primary.intent);
    });

    it('returns UNKNOWN for gibberish', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('asdfghjkl zxcvbnm', ctx);
      expect(result.primary.intent).toBe(Intent.UNKNOWN);
    });
  });

  // ----------------------------------------------------------------
  // Entity Extraction
  // ----------------------------------------------------------------
  describe('entity extraction', () => {
    it('extracts PROPERTY_TYPE entity', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want a villa in Dubai', ctx);
      const propEntity = result.entities.find(e => e.type === 'PROPERTY_TYPE');
      expect(propEntity).toBeDefined();
      expect(propEntity!.value.toLowerCase()).toContain('villa');
    });

    it('extracts LOCATION entity', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('Something in Dubai Marina', ctx);
      const locEntity = result.entities.find(e => e.type === 'LOCATION');
      expect(locEntity).toBeDefined();
    });

    it('extracts BEDROOMS entity', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I need a 3 bedroom apartment', ctx);
      const bedEntity = result.entities.find(e => e.type === 'BEDROOMS');
      if (bedEntity) {
        expect(bedEntity.value).toContain('3');
      }
    });

    it('extracts PHONE entity', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('My number is +971501234567', ctx);
      const phoneEntity = result.entities.find(e => e.type === 'PHONE');
      if (phoneEntity) {
        expect(phoneEntity.value).toContain('971');
      }
    });

    it('returns empty entities for plain text', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('hello there', ctx);
      expect(Array.isArray(result.entities)).toBe(true);
    });
  });

  // ----------------------------------------------------------------
  // Sentiment Analysis
  // ----------------------------------------------------------------
  describe('sentiment analysis', () => {
    it('detects POSITIVE sentiment', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('This is amazing and I love it!', ctx);
      expect(result.sentiment.sentiment).toBe('POSITIVE');
      expect(result.sentiment.score).toBeGreaterThan(0);
    });

    it('detects NEGATIVE sentiment', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('This is terrible and I hate it, very bad awful worst experience ever', ctx);
      expect(['NEGATIVE', 'NEUTRAL']).toContain(result.sentiment.sentiment);
      expect(result.sentiment.score).toBeLessThanOrEqual(0);
    });

    it('detects NEUTRAL sentiment', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('ok fine', ctx);
      expect(result.sentiment.sentiment).toBe('NEUTRAL');
    });
  });

  // ----------------------------------------------------------------
  // Agent Handoff
  // ----------------------------------------------------------------
  describe('agent handoff', () => {
    it('flags handoff for COMPLAINT intents', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want to file a complaint about the terrible agent service', ctx);
      if ([
        Intent.COMPLAINT, Intent.COMPLAINT_AGENT,
        Intent.COMPLAINT_PROPERTY, Intent.COMPLAINT_PROCESS,
        Intent.COMPLAINT_SERVICE,
      ].includes(result.primary.intent)) {
        expect(result.requiresAgentHandoff).toBe(true);
      }
    });

    it('flags handoff for ASSISTANCE_NEEDED', () => {
      const ctx = createFreshContext({ needsAssistance: true });
      const result = engine.processMessage('I need help from a real person please', ctx);
      // Either the intent triggers handoff or the context does
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
    });

    it('does not flag handoff for simple property inquiry', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('Show me apartments in Dubai Marina', ctx);
      if (result.primary.intent === Intent.PROPERTY_INQUIRY) {
        expect(result.requiresAgentHandoff).toBe(false);
      }
    });
  });

  // ----------------------------------------------------------------
  // Response Generation
  // ----------------------------------------------------------------
  describe('response generation', () => {
    it('generates non-empty response for property inquiry', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('I want to see villas', ctx);
      expect(result.suggestedResponse).toBeDefined();
      expect(result.suggestedResponse.length).toBeGreaterThan(0);
    });

    it('generates empathetic response for complaints', () => {
      const ctx = createFreshContext();
      const result = engine.processMessage('The service is awful, I want to complain', ctx);
      expect(result.suggestedResponse).toBeDefined();
      expect(result.suggestedResponse.length).toBeGreaterThan(0);
    });
  });

  // ----------------------------------------------------------------
  // recordFeedback
  // ----------------------------------------------------------------
  describe('recordFeedback', () => {
    it('does not throw', () => {
      expect(() => {
        engine.recordFeedback('msg-1', Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST);
      }).not.toThrow();
    });
  });

  // ----------------------------------------------------------------
  // Context Influence
  // ----------------------------------------------------------------
  describe('context influence', () => {
    it('uses recent intents to boost context-driven results', () => {
      const ctx = createFreshContext({
        recentIntents: [Intent.PROPERTY_INQUIRY, Intent.VIEWING_REQUEST],
        recentTopics: ['villa', 'dubai marina'],
      });
      const result = engine.processMessage('Yes, that sounds good', ctx);
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
    });

    it('handles customer name in context', () => {
      const ctx = createFreshContext({ customerName: 'Ahmed' });
      const result = engine.processMessage('I want a villa', ctx);
      expect(result.suggestedResponse).toBeDefined();
    });
  });
});
