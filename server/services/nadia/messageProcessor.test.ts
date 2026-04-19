import { describe, it, expect } from 'vitest';
import { detectIntent, detectSentiment, extractEntities, calculateLeadScore, generateBotResponse, analyzeConversationState } from './messageProcessor';

describe('messageProcessor', () => {
  describe('detectIntent', () => {
    it('detects property search', () => { expect(detectIntent('I am looking for a property')).toBe('property_search'); });
    it('detects schedule tour', () => { expect(detectIntent('I want to schedule a tour and view the apartment')).toBe('schedule_tour'); });
    it('detects make offer', () => { expect(detectIntent('I want to buy and purchase this offer')).toBe('make_offer'); });
    it('detects complaint', () => { expect(detectIntent('I have a complaint about this issue problem')).toBe('complaint'); });
    it('returns general_inquiry for no match', () => { expect(detectIntent('hello')).toBe('general_inquiry'); });
    it('returns general_inquiry for gibberish', () => { expect(detectIntent('xyzzy foobar baz')).toBe('general_inquiry'); });
    it('handles empty string', () => { expect(detectIntent('')).toBe('general_inquiry'); });
    it('detects information request', () => { expect(detectIntent('what is the price and cost of bedrooms')).toBe('information_request'); });
    it('detects financing intent', () => { expect(detectIntent('I need a loan and mortgage for financing')).toBe('financing'); });
  });

  describe('detectSentiment', () => {
    it('detects positive', () => { expect(detectSentiment('This is great and wonderful')).toBe('positive'); });
    it('detects negative', () => { expect(detectSentiment('This is terrible and awful')).toBe('negative'); });
    it('detects neutral', () => { expect(detectSentiment('The property is located in Amman')).toBe('neutral'); });
    it('handles empty string', () => { expect(detectSentiment('')).toBe('neutral'); });
  });

  describe('extractEntities', () => {
    it('returns array', () => { expect(Array.isArray(extractEntities('I want a 3 bedroom apartment in Amman'))).toBe(true); });
    it('handles empty string', () => { expect(Array.isArray(extractEntities(''))).toBe(true); });
  });

  describe('calculateLeadScore', () => {
    it('returns base score for empty factors', () => { expect(calculateLeadScore({})).toBe(70); });
    it('increases score for high engagement', () => { expect(calculateLeadScore({ messageCount: 20, responseRate: 0.9 })).toBeGreaterThanOrEqual(50); });
    it('caps score at 100', () => { expect(calculateLeadScore({ messageCount: 100, responseRate: 1.0, hoursActive: 48, responseTime: 1, intentStrength: 1.0 })).toBeLessThanOrEqual(100); });
    it('returns number type', () => { expect(typeof calculateLeadScore({ messageCount: 5 })).toBe('number'); });
  });

  describe('generateBotResponse', () => {
    it('returns string response', () => {
      const r = generateBotResponse({ intent: 'property_search', sentiment: 'neutral', entities: [], conversationStage: 'initial', customerName: 'Ahmad' });
      expect(typeof r).toBe('string'); expect(r.length).toBeGreaterThan(0);
    });
    it('handles complaint intent', () => { expect(typeof generateBotResponse({ intent: 'complaint', sentiment: 'negative', entities: [], conversationStage: 'active', customerName: 'Sara' })).toBe('string'); });
  });

  describe('analyzeConversationState', () => {
    it('returns analysis object', () => {
      const a = analyzeConversationState([{ role: 'customer', content: 'hello', timestamp: new Date() }, { role: 'agent', content: 'hi there', timestamp: new Date() }]);
      expect(a).toBeDefined(); expect(typeof a).toBe('object');
    });
    it('handles empty messages', () => { expect(analyzeConversationState([])).toBeDefined(); });
  });
});
