/**
 * ninaEngine � Test Suite
 * 28 tests covering the NinaEngine class
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NinaEngine, Intent } from './ninaEngine';
import type { ConversationContext } from './ninaEngine';

function makeContext(overrides: Partial<ConversationContext> = {}): ConversationContext {
  return {
    conversationId: 'conv_1',
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

  it('creates an instance', () => {
    expect(engine).toBeInstanceOf(NinaEngine);
  });

  it('has processMessage method', () => {
    expect(typeof engine.processMessage).toBe('function');
  });

  it('processMessage returns IntentResult object', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('result has primary intent', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(result).toHaveProperty('primary');
    expect(result.primary).toHaveProperty('intent');
  });

  it('result has sentiment with sentiment field', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(result).toHaveProperty('sentiment');
    expect(result.sentiment).toHaveProperty('sentiment');
  });

  it('result has entities array', () => {
    const result = engine.processMessage('I want a villa', makeContext());
    expect(result).toHaveProperty('entities');
    expect(Array.isArray(result.entities)).toBe(true);
  });

  it('result has suggestedResponse string', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(typeof result.suggestedResponse).toBe('string');
  });

  it('result has topics array', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(Array.isArray(result.topics)).toBe(true);
  });

  it('result has requiresAgentHandoff boolean', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(typeof result.requiresAgentHandoff).toBe('boolean');
  });

  it('result has timestamp', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(result.timestamp).toBeInstanceOf(Date);
  });

  it('detects PROPERTY_INQUIRY for property keywords', () => {
    const result = engine.processMessage('I want to buy a villa in dubai marina', makeContext());
    expect(result.primary.intent.startsWith('PROPERTY_INQUIRY')).toBe(true);
  });

  it('detects VIEWING_REQUEST for viewing keywords', () => {
    const result = engine.processMessage('I want to schedule a viewing of the property', makeContext());
    expect(result.primary.intent.startsWith('VIEWING_REQUEST')).toBe(true);
  });

  it('detects PURCHASE_INTEREST for purchase keywords', () => {
    const result = engine.processMessage('I want to buy and purchase now', makeContext());
    expect(result.primary.intent.startsWith('PURCHASE_INTEREST')).toBe(true);
  });

  it('detects COMPLAINT for complaint keywords', () => {
    const result = engine.processMessage('I have a complaint about the terrible service', makeContext());
    expect(result.primary.intent.startsWith('COMPLAINT')).toBe(true);
  });

  it('returns GREETING or UNKNOWN for casual messages', () => {
    const result = engine.processMessage('hi there', makeContext());
    expect([Intent.GREETING, Intent.UNKNOWN]).toContain(result.primary.intent);
  });

  it('detects POSITIVE sentiment', () => {
    const result = engine.processMessage('This is amazing and wonderful!', makeContext());
    expect(result.sentiment.sentiment).toBe('POSITIVE');
  });

  it('detects NEGATIVE sentiment', () => {
    const result = engine.processMessage('This is terrible and awful service', makeContext());
    expect(result.sentiment.sentiment).toBe('NEGATIVE');
  });

  it('detects NEUTRAL sentiment for plain messages', () => {
    const result = engine.processMessage('hello', makeContext());
    expect(result.sentiment.sentiment).toBe('NEUTRAL');
  });

  it('primary intent has numeric confidence', () => {
    const result = engine.processMessage('I want to buy a villa', makeContext());
    expect(typeof result.primary.confidence).toBe('number');
    expect(result.primary.confidence).toBeGreaterThanOrEqual(0);
  });

  it('has secondary intents array', () => {
    const result = engine.processMessage('I want to buy a villa', makeContext());
    expect(Array.isArray(result.secondary)).toBe(true);
  });

  it('suggestedResponse is non-empty for property queries', () => {
    const result = engine.processMessage('I want to buy a villa', makeContext());
    expect(result.suggestedResponse.length).toBeGreaterThan(0);
  });

  it('different intents produce different responses', () => {
    const r1 = engine.processMessage('I want to buy a villa', makeContext());
    const r2 = engine.processMessage('I have a complaint about the service', makeContext());
    expect(r1.suggestedResponse).not.toBe(r2.suggestedResponse);
  });

  it('handles empty message', () => {
    const result = engine.processMessage('', makeContext());
    expect(result).toBeDefined();
    expect(result.primary).toBeDefined();
  });

  it('handles very long message', () => {
    const msg = 'I want to buy a property '.repeat(200);
    const result = engine.processMessage(msg, makeContext());
    expect(result).toBeDefined();
  });

  it('handles special characters', () => {
    const result = engine.processMessage('<script>alert(1)</script>', makeContext());
    expect(result).toBeDefined();
  });

  it('uses context recentIntents', () => {
    const ctx = makeContext({ recentIntents: [Intent.PROPERTY_INQUIRY] });
    const result = engine.processMessage('show me more', ctx);
    expect(result).toBeDefined();
  });

  it('has recordFeedback method', () => {
    expect(typeof engine.recordFeedback).toBe('function');
  });

  it('recordFeedback does not throw', () => {
    expect(() => engine.recordFeedback('msg1', Intent.PROPERTY_INQUIRY, Intent.UNKNOWN)).not.toThrow();
  });
});
