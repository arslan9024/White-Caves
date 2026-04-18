import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent } from './ninaEngine';

function makeContext(recentIntents = []) {
  return {
    conversationId: 'test-conv',
    recentIntents,
    messageCount: 0,
    currentTopic: '',
    language: 'en',
  };
}

describe('NinaEngine', () => {
  let engine;
  beforeEach(() => { engine = new NinaEngine(); });

  describe('Intent enum', () => {
    it('has GREETING', () => { expect(Intent.GREETING).toBe('GREETING'); });
    it('has PROPERTY_INQUIRY', () => { expect(Intent.PROPERTY_INQUIRY).toBe('PROPERTY_INQUIRY'); });
    it('has COMPLAINT', () => { expect(Intent.COMPLAINT).toBe('COMPLAINT'); });
    it('has UNKNOWN', () => { expect(Intent.UNKNOWN).toBe('UNKNOWN'); });
    it('has FAREWELL', () => { expect(Intent.FAREWELL).toBe('FAREWELL'); });
    it('has VIEWING_REQUEST', () => { expect(Intent.VIEWING_REQUEST).toBe('VIEWING_REQUEST'); });
    it('has PURCHASE_INTEREST', () => { expect(Intent.PURCHASE_INTEREST).toBe('PURCHASE_INTEREST'); });
  });

  describe('processMessage', () => {
    it('returns result with primary intent', () => {
      const result = engine.processMessage('hello there', makeContext());
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
      expect(result.primary.intent).toBeDefined();
    });

    it('detects greeting intent', () => {
      const result = engine.processMessage('hello hi hey good morning', makeContext());
      expect(result.primary.intent).toBe(Intent.GREETING);
    });

    it('detects property inquiry', () => {
      const result = engine.processMessage('I am looking for an apartment to rent', makeContext());
      expect(result.primary.intent).toBe(Intent.PROPERTY_INQUIRY);
    });

    it('detects complaint with strong text', () => {
      const result = engine.processMessage(
        'I have a complaint and I am unhappy and disappointed about the wrong thing',
        makeContext()
      );
      expect(result.primary.intent).toBe(Intent.COMPLAINT);
    });

    it('returns confidence score', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
      expect(result.primary.confidence).toBeLessThanOrEqual(100);
    });

    it('returns sentiment result', () => {
      const result = engine.processMessage('This is wonderful and amazing', makeContext());
      expect(result.sentiment).toBeDefined();
      expect(result.sentiment.sentiment).toBeDefined();
    });

    it('detects positive sentiment', () => {
      const result = engine.processMessage('This is wonderful and amazing and great', makeContext());
      expect(result.sentiment.sentiment).toBe('POSITIVE');
    });

    it('detects negative sentiment', () => {
      const result = engine.processMessage('This is terrible and horrible and awful', makeContext());
      expect(result.sentiment.sentiment).toBe('NEGATIVE');
    });

    it('returns entities array', () => {
      const result = engine.processMessage('I need a 3 bedroom villa in Abdoun', makeContext());
      expect(Array.isArray(result.entities)).toBe(true);
    });

    it('returns topics array', () => {
      const result = engine.processMessage('Tell me about the property details', makeContext());
      expect(Array.isArray(result.topics)).toBe(true);
    });

    it('has requiresAgentHandoff flag', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(typeof result.requiresAgentHandoff).toBe('boolean');
    });

    it('has suggestedResponse', () => {
      const result = engine.processMessage('hello', makeContext());
      expect(typeof result.suggestedResponse).toBe('string');
    });

    it('handles empty string', () => {
      const result = engine.processMessage('', makeContext());
      expect(result).toBeDefined();
      expect(result.primary).toBeDefined();
    });
  });
});
