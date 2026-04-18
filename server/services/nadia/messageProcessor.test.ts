/**
 * MessageProcessor Unit Tests
 * Tests pure-function NLP utilities: intent detection, sentiment, entity extraction,
 * lead scoring, bot response, and conversation-state analysis.
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}));

import {
  detectIntent,
  detectSentiment,
  extractEntities,
  calculateLeadScore,
  generateBotResponse,
  analyzeConversationState,
} from './messageProcessor';

describe('detectIntent', () => {
  it('detects property_search from property keywords', () => {
    expect(detectIntent('I am looking for an apartment in Dubai')).toBe('property_search');
  });
  it('detects schedule_tour from touring keywords', () => {
    expect(detectIntent('I want to schedule a tour to visit')).toBe('schedule_tour');
  });
  it('detects information_request from price inquiry', () => {
    expect(detectIntent('What is the price and bedrooms?')).toBe('information_request');
  });
  it('detects make_offer intent', () => {
    expect(detectIntent('I want to buy and offer to purchase proceed')).toBe('make_offer');
  });
  it('detects financing intent', () => {
    expect(detectIntent('mortgage loan finance payment plan installment')).toBe('financing');
  });
  it('detects complaint intent', () => {
    expect(detectIntent('I have a complaint problem issue not working')).toBe('complaint');
  });
  it('detects legal_enquiry intent', () => {
    expect(detectIntent('I need contract deed registration legal documents')).toBe('legal_enquiry');
  });
  it('returns general_inquiry for no keywords', () => {
    expect(detectIntent('hello there')).toBe('general_inquiry');
  });
  it('returns general_inquiry for empty string', () => {
    expect(detectIntent('')).toBe('general_inquiry');
  });
  it('is case-insensitive', () => {
    expect(detectIntent('LOOKING FOR AN APARTMENT')).toBe('property_search');
  });
  it('returns a string', () => {
    expect(typeof detectIntent('hello')).toBe('string');
  });
});

describe('detectSentiment', () => {
  it('detects positive sentiment', () => {
    expect(detectSentiment('This is amazing and wonderful!')).toBe('positive');
  });
  it('detects negative sentiment', () => {
    expect(detectSentiment('terrible awful hate disappointed')).toBe('negative');
  });
  it('detects neutral for no keywords', () => {
    expect(detectSentiment('Can you send me the details?')).toBe('neutral');
  });
  it('returns neutral for empty string', () => {
    expect(detectSentiment('')).toBe('neutral');
  });
  it('positive wins when more positive keywords', () => {
    expect(detectSentiment('great love amazing excellent perfect but bad')).toBe('positive');
  });
  it('negative wins when more negative keywords', () => {
    expect(detectSentiment('terrible awful bad poor worst angry good')).toBe('negative');
  });
  it('returns valid sentiment type', () => {
    expect(['positive', 'neutral', 'negative']).toContain(detectSentiment('some text'));
  });
});

describe('extractEntities', () => {
  it('extracts property type', () => {
    expect(extractEntities('I want a villa in Dubai')).toContain('property_type:villa');
  });
  it('extracts location', () => {
    expect(extractEntities('Looking in dubai marina area')).toContain('location:dubai marina');
  });
  it('extracts bedrooms', () => {
    expect(extractEntities('I need 3 bedrooms')).toContain('bedrooms:3');
  });
  it('extracts price mentions', () => {
    expect(extractEntities('Budget is 2 million AED')).toContain('price_mentioned');
  });
  it('extracts amenities', () => {
    const entities = extractEntities('Must have pool and gym');
    expect(entities).toContain('amenity:pool');
    expect(entities).toContain('amenity:gym');
  });
  it('returns empty for no entities', () => {
    expect(extractEntities('hello there')).toEqual([]);
  });
  it('returns empty for empty string', () => {
    expect(extractEntities('')).toEqual([]);
  });
  it('extracts multiple entities', () => {
    const entities = extractEntities('3 bedroom apartment in dubai marina with pool');
    expect(entities.length).toBeGreaterThanOrEqual(3);
  });
  it('always returns array', () => {
    expect(Array.isArray(extractEntities('anything'))).toBe(true);
  });
});

describe('calculateLeadScore', () => {
  // Note: defaults hoursActive=0 (<1 → +10) and responseTime=0 (<5 → +10) add +20 to every call
  it('returns 70 with empty factors (base 50 + 20 defaults)', () => {
    expect(calculateLeadScore({})).toBe(70);
  });
  it('boosts for make_offer', () => {
    expect(calculateLeadScore({ intent: 'make_offer' })).toBe(95);
  });
  it('boosts for schedule_tour', () => {
    expect(calculateLeadScore({ intent: 'schedule_tour' })).toBe(90);
  });
  it('reduces for complaint', () => {
    expect(calculateLeadScore({ intent: 'complaint' })).toBe(65);
  });
  it('boosts for positive sentiment', () => {
    expect(calculateLeadScore({ sentiment: 'positive' })).toBe(85);
  });
  it('reduces for negative sentiment', () => {
    expect(calculateLeadScore({ sentiment: 'negative' })).toBe(60);
  });
  it('boosts for high message count', () => {
    expect(calculateLeadScore({ messageCount: 20 })).toBe(90);
  });
  it('clamps to 0 minimum', () => {
    expect(calculateLeadScore({ intent: 'complaint', sentiment: 'negative' })).toBeGreaterThanOrEqual(0);
  });
  it('clamps to 100 maximum', () => {
    expect(calculateLeadScore({ intent: 'make_offer', sentiment: 'positive', messageCount: 20, hasPhone: true, entities: ['a','b','c'], hoursActive: 0.5, responseTime: 1 })).toBeLessThanOrEqual(100);
  });
});

describe('generateBotResponse', () => {
  it('generates response for property_search', () => {
    const r = generateBotResponse({ intent: 'property_search', entities: [], sentiment: 'neutral' });
    expect(typeof r).toBe('string');
    expect(r.length).toBeGreaterThan(0);
  });
  it('includes customer name when provided', () => {
    const r = generateBotResponse({ intent: 'property_search', entities: [], sentiment: 'neutral', customerName: 'Alice' });
    expect(r).toContain('Alice');
  });
  it('returns fallback for unknown intent', () => {
    const r = generateBotResponse({ intent: 'xyz', entities: [], sentiment: 'neutral' });
    expect(r.length).toBeGreaterThan(0);
  });
});

describe('analyzeConversationState', () => {
  it('returns discovery for 0 messages', () => {
    expect(analyzeConversationState(0, 'general_inquiry', 'neutral', 50).activePhase).toBe('discovery');
  });
  it('returns engagement for 1-2 messages', () => {
    expect(analyzeConversationState(2, 'property_search', 'neutral', 50).activePhase).toBe('engagement');
  });
  it('returns consideration for 3-6 messages', () => {
    expect(analyzeConversationState(5, 'information_request', 'positive', 60).activePhase).toBe('consideration');
  });
  it('returns decision for 7-11 messages', () => {
    expect(analyzeConversationState(10, 'make_offer', 'positive', 80).activePhase).toBe('decision');
  });
  it('returns closing for 12+ messages', () => {
    expect(analyzeConversationState(15, 'make_offer', 'positive', 90).activePhase).toBe('closing');
  });
  it('includes nextAction', () => {
    expect(typeof analyzeConversationState(0, 'general_inquiry', 'neutral', 50).nextAction).toBe('string');
  });
  it('includes estimatedDaysToClose', () => {
    expect(typeof analyzeConversationState(5, 'property_search', 'positive', 70).estimatedDaysToClose).toBe('number');
  });
  it('positive sentiment reduces days', () => {
    const pos = analyzeConversationState(5, 'property_search', 'positive', 70);
    const neg = analyzeConversationState(5, 'property_search', 'negative', 70);
    expect(pos.estimatedDaysToClose).toBeLessThan(neg.estimatedDaysToClose);
  });
  it('high lead score reduces days', () => {
    const hi = analyzeConversationState(5, 'property_search', 'neutral', 80);
    const lo = analyzeConversationState(5, 'property_search', 'neutral', 30);
    expect(hi.estimatedDaysToClose).toBeLessThan(lo.estimatedDaysToClose);
  });
});