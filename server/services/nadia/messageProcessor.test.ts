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
