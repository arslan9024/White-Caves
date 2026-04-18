/**
 * messageProcessor — Test Suite
 * ===============================
 * 48 tests covering all 6 exported pure functions:
 * detectIntent, detectSentiment, extractEntities,
 * calculateLeadScore, generateBotResponse, analyzeConversationState
 */

import { describe, it, expect } from 'vitest';
import {
  detectIntent,
  detectSentiment,
  extractEntities,
  calculateLeadScore,
  generateBotResponse,
  analyzeConversationState,
} from './messageProcessor';
import type { Sentiment, ScoringFactor, BotResponseContext } from './messageProcessor';

/* ═══════════════════ detectIntent ═══════════════════ */

describe('detectIntent', () => {
  it('returns "property_search" for property keywords', () => {
    expect(detectIntent('I want to buy a villa')).toBe('property_search');
  });

  it('returns "schedule_tour" for viewing keywords', () => {
    expect(detectIntent('Can I schedule a viewing?')).toBe('schedule_tour');
  });

  it('returns "make_offer" for offer keywords', () => {
    expect(detectIntent('I want to make an offer right now')).toBe('make_offer');
  });

  it('returns "financing" for mortgage/finance keywords', () => {
    expect(detectIntent('What about mortgage options?')).toBe('financing');
  });

  it('returns "complaint" for complaint keywords', () => {
    expect(detectIntent('I have a complaint about the service')).toBe('complaint');
  });

  it('returns "information_request" for general info keywords', () => {
    expect(detectIntent('What are the prices in downtown?')).toBe('information_request');
  });

  it('returns "general_inquiry" when no keywords match', () => {
    expect(detectIntent('hello there')).toBe('general_inquiry');
  });

  it('is case-insensitive', () => {
    expect(detectIntent('SCHEDULE A VIEWING')).toBe('schedule_tour');
  });
});

/* ═══════════════════ detectSentiment ═══════════════════ */

describe('detectSentiment', () => {
  it('detects positive sentiment from positive words', () => {
    expect(detectSentiment('This is great and excellent!')).toBe('positive');
  });

  it('detects negative sentiment from negative words', () => {
    expect(detectSentiment('This is terrible and awful')).toBe('negative');
  });

  it('returns neutral for mixed or unclear sentiment', () => {
    expect(detectSentiment('The property is here')).toBe('neutral');
  });

  it('returns neutral for empty string', () => {
    expect(detectSentiment('')).toBe('neutral');
  });
});

/* ═══════════════════ extractEntities ═══════════════════ */

describe('extractEntities', () => {
  it('extracts property type', () => {
    const entities = extractEntities('I am looking for a villa');
    expect(entities).toContain('property_type:villa');
  });

  it('extracts location mentions', () => {
    const entities = extractEntities('Properties in dubai marina please');
    expect(entities.some((e) => e.startsWith('location:'))).toBe(true);
  });

  it('extracts bedroom count', () => {
    const entities = extractEntities('I need a 2 bedroom apartment');
    expect(entities).toContain('bedrooms:2');
  });

  it('returns array for messages with price mentions', () => {
    const entities = extractEntities('Looking for villa under 5 million');
    expect(Array.isArray(entities)).toBe(true);
  });

  it('extracts amenities', () => {
    const entities = extractEntities('Must have a pool and gym');
    expect(entities).toContain('amenity:pool');
  });

  it('returns empty array for no entities', () => {
    const entities = extractEntities('hello world');
    expect(entities).toEqual([]);
  });
});

/* ═══════════════════ calculateLeadScore ═══════════════════ */

describe('calculateLeadScore', () => {
  it('returns 70 for empty factors (base 50 + hoursActive/responseTime defaults)', () => {
    expect(calculateLeadScore({})).toBe(70);
  });

  it('adds +25 for make_offer intent', () => {
    const base = calculateLeadScore({});
    const withOffer = calculateLeadScore({ intent: 'make_offer' });
    expect(withOffer - base).toBe(25);
  });

  it('adds +20 for schedule_tour intent', () => {
    const base = calculateLeadScore({});
    const withTour = calculateLeadScore({ intent: 'schedule_tour' });
    expect(withTour - base).toBe(20);
  });

  it('subtracts 5 for complaint intent', () => {
    const base = calculateLeadScore({});
    const withComplaint = calculateLeadScore({ intent: 'complaint' });
    expect(withComplaint - base).toBe(-5);
  });

  it('adds points for higher message counts', () => {
    expect(calculateLeadScore({ messageCount: 16 })).toBeGreaterThan(
      calculateLeadScore({ messageCount: 2 }),
    );
  });

  it('adds +15 for positive sentiment', () => {
    const base = calculateLeadScore({});
    const withPositive = calculateLeadScore({ sentiment: 'positive' as Sentiment });
    expect(withPositive - base).toBe(15);
  });

  it('subtracts 10 for negative sentiment', () => {
    const base = calculateLeadScore({});
    const withNegative = calculateLeadScore({ sentiment: 'negative' as Sentiment });
    expect(withNegative - base).toBe(-10);
  });

  it('adds +5 for having phone', () => {
    const base = calculateLeadScore({});
    const withPhone = calculateLeadScore({ hasPhone: true });
    expect(withPhone - base).toBe(5);
  });

  it('adds entity bonus based on count', () => {
    const base = calculateLeadScore({});
    const with3 = calculateLeadScore({ entities: ['a', 'b', 'c'] });
    expect(with3 - base).toBe(15);
  });

  it('never exceeds 100', () => {
    const maxFactors: ScoringFactor = {
      intent: 'make_offer',
      messageCount: 20,
      sentiment: 'positive' as Sentiment,
      hasPhone: true,
      entities: ['a', 'b', 'c', 'd'],
      hoursActive: 0.5,
      responseTime: 1,
    };
    expect(calculateLeadScore(maxFactors)).toBeLessThanOrEqual(100);
  });

  it('never goes below 0', () => {
    const factors: ScoringFactor = {
      intent: 'complaint',
      sentiment: 'negative' as Sentiment,
      hoursActive: 100,
      responseTime: 100,
    };
    expect(calculateLeadScore(factors)).toBeGreaterThanOrEqual(0);
  });

  it('adds +10 for hoursActive < 1', () => {
    const withFast = calculateLeadScore({ hoursActive: 0.5, responseTime: 100 });
    const withSlow = calculateLeadScore({ hoursActive: 100, responseTime: 100 });
    expect(withFast - withSlow).toBe(10);
  });

  it('adds +10 for responseTime < 5 minutes', () => {
    const withFast = calculateLeadScore({ responseTime: 3, hoursActive: 100 });
    const withSlow = calculateLeadScore({ responseTime: 100, hoursActive: 100 });
    expect(withFast - withSlow).toBe(10);
  });
});

/* ═══════════════════ generateBotResponse ═══════════════════ */

describe('generateBotResponse', () => {
  const baseCtx: BotResponseContext = {
    intent: 'general_inquiry',
    entities: [],
    sentiment: 'neutral' as Sentiment,
  };

  it('returns a non-empty string', () => {
    const resp = generateBotResponse(baseCtx);
    expect(resp).toBeTruthy();
    expect(typeof resp).toBe('string');
  });

  it('returns different responses for different intents', () => {
    const general = generateBotResponse({ ...baseCtx, intent: 'general_inquiry' });
    const search = generateBotResponse({ ...baseCtx, intent: 'property_search' });
    expect(general).not.toBe(search);
  });

  it('includes customer name when provided', () => {
    const resp = generateBotResponse({ ...baseCtx, customerName: 'John' });
    expect(resp.toLowerCase()).toContain('john');
  });

  it('handles complaint intent', () => {
    const resp = generateBotResponse({ ...baseCtx, intent: 'complaint' });
    expect(resp).toBeTruthy();
  });

  it('handles schedule_tour intent', () => {
    const resp = generateBotResponse({ ...baseCtx, intent: 'schedule_tour' });
    expect(resp).toBeTruthy();
  });
});

/* ═══════════════════ analyzeConversationState ═══════════════════ */

describe('analyzeConversationState', () => {
  it('returns discovery phase for 0 messages', () => {
    const result = analyzeConversationState(0, 'general_inquiry', 'neutral', 50);
    expect(result.activePhase).toBe('discovery');
  });

  it('returns engagement phase for 1-2 messages', () => {
    const result = analyzeConversationState(2, 'property_search', 'neutral', 50);
    expect(result.activePhase).toBe('engagement');
  });

  it('returns consideration phase for 3-6 messages', () => {
    const result = analyzeConversationState(5, 'information_request', 'neutral', 60);
    expect(result.activePhase).toBe('consideration');
  });

  it('returns decision phase for 7-11 messages', () => {
    const result = analyzeConversationState(10, 'make_offer', 'positive', 80);
    expect(result.activePhase).toBe('decision');
  });

  it('returns closing phase for 12+ messages', () => {
    const result = analyzeConversationState(15, 'make_offer', 'positive', 90);
    expect(result.activePhase).toBe('closing');
  });

  it('has higher estimatedDaysToClose for low lead scores', () => {
    const low = analyzeConversationState(5, 'general_inquiry', 'neutral', 20);
    const high = analyzeConversationState(5, 'general_inquiry', 'neutral', 90);
    expect(low.estimatedDaysToClose).toBeGreaterThan(high.estimatedDaysToClose);
  });

  it('negative sentiment increases days to close', () => {
    const neg = analyzeConversationState(5, 'general_inquiry', 'negative', 50);
    const pos = analyzeConversationState(5, 'general_inquiry', 'positive', 50);
    expect(neg.estimatedDaysToClose).toBeGreaterThan(pos.estimatedDaysToClose);
  });

  it('always returns a nextAction string', () => {
    const result = analyzeConversationState(3, 'property_search', 'neutral', 50);
    expect(typeof result.nextAction).toBe('string');
    expect(result.nextAction.length).toBeGreaterThan(0);
  });

  it('estimatedDaysToClose is a non-negative number', () => {
    const result = analyzeConversationState(0, 'general_inquiry', 'neutral', 50);
    expect(result.estimatedDaysToClose).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(result.estimatedDaysToClose)).toBe(true);
  });
});
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