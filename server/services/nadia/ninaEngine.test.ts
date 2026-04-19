import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent } from './ninaEngine';

function makeContext(recentIntents = []) {
  return { conversationId: 'test-conv', recentIntents, messageCount: 0, currentTopic: '', language: 'en' };
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
    it('returns result with primary intent', () => { const r = engine.processMessage('hello there', makeContext()); expect(r).toBeDefined(); expect(r.primary).toBeDefined(); expect(r.primary.intent).toBeDefined(); });
    it('detects greeting', () => { expect(engine.processMessage('hello hi hey good morning', makeContext()).primary.intent).toBe(Intent.GREETING); });
    it('detects property inquiry', () => { expect(engine.processMessage('I am looking for an apartment to rent', makeContext()).primary.intent).toBe(Intent.PROPERTY_INQUIRY); });
    it('detects complaint', () => { expect(engine.processMessage('I have a complaint and I am unhappy and disappointed about the wrong thing', makeContext()).primary.intent).toBe(Intent.COMPLAINT); });
    it('returns confidence score', () => { const c = engine.processMessage('hello', makeContext()).primary.confidence; expect(c).toBeGreaterThanOrEqual(0); expect(c).toBeLessThanOrEqual(100); });
    it('returns sentiment', () => { const r = engine.processMessage('This is wonderful and amazing', makeContext()); expect(r.sentiment).toBeDefined(); expect(r.sentiment.sentiment).toBeDefined(); });
    it('detects positive sentiment', () => { expect(engine.processMessage('This is wonderful and amazing and great', makeContext()).sentiment.sentiment).toBe('POSITIVE'); });
    it('detects negative sentiment', () => { expect(engine.processMessage('This is terrible and horrible and awful', makeContext()).sentiment.sentiment).toBe('NEGATIVE'); });
    it('returns entities array', () => { expect(Array.isArray(engine.processMessage('I need a 3 bedroom villa in Abdoun', makeContext()).entities)).toBe(true); });
    it('returns topics array', () => { expect(Array.isArray(engine.processMessage('Tell me about the property details', makeContext()).topics)).toBe(true); });
    it('has requiresAgentHandoff flag', () => { expect(typeof engine.processMessage('hello', makeContext()).requiresAgentHandoff).toBe('boolean'); });
    it('has suggestedResponse', () => { expect(typeof engine.processMessage('hello', makeContext()).suggestedResponse).toBe('string'); });
    it('handles empty string', () => { const r = engine.processMessage('', makeContext()); expect(r).toBeDefined(); expect(r.primary).toBeDefined(); });
  });
});
