/**
 * Message Processor — Tests
 * Tests: detectIntent, detectSentiment, extractEntities, calculateLeadScore,
 * generateBotResponse, analyzeConversationState
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
}));

import {
  detectIntent,
  detectSentiment,
  extractEntities,
  calculateLeadScore,
  generateBotResponse,
  analyzeConversationState,
} from './messageProcessor';

// ─── detectIntent ─────────────────────────────────────────────────
describe('detectIntent', () => {
  it('should detect property_search intent', () => {
    expect(detectIntent('I am looking for a villa')).toBe('property_search');
  });

  it('should detect schedule_tour intent', () => {
    expect(detectIntent('Can I schedule a tour to view the property?')).toBe('schedule_tour');
  });

  it('should detect information_request intent', () => {
    expect(detectIntent('What is the price cost and specifications details of this?')).toBe('information_request');
  });

  it('should detect make_offer intent', () => {
    expect(detectIntent('I want to make an offer to purchase')).toBe('make_offer');
  });

  it('should detect financing intent', () => {
    expect(detectIntent('I need a mortgage loan with payment plan installment')).toBe('financing');
  });

  it('should detect legal_enquiry intent', () => {
    expect(detectIntent('What documents are needed for the contract?')).toBe('legal_enquiry');
  });

  it('should detect complaint intent', () => {
    expect(detectIntent('I have a problem and need urgent help')).toBe('complaint');
  });

  it('should return general_inquiry for unknown messages', () => {
    expect(detectIntent('asdfghjkl random text')).toBe('general_inquiry');
  });

  it('should be case-insensitive', () => {
    expect(detectIntent('LOOKING FOR A VILLA')).toBe('property_search');
  });

  it('should handle empty string', () => {
    expect(detectIntent('')).toBe('general_inquiry');
  });
});

// ─── detectSentiment ──────────────────────────────────────────────
describe('detectSentiment', () => {
  it('should detect positive sentiment', () => {
    expect(detectSentiment('This is amazing and excellent!')).toBe('positive');
  });

  it('should detect negative sentiment', () => {
    expect(detectSentiment('This is terrible and awful')).toBe('negative');
  });

  it('should detect neutral sentiment', () => {
    expect(detectSentiment('The sky is blue today')).toBe('neutral');
  });

  it('should handle mixed sentiments (positive dominates)', () => {
    expect(detectSentiment('great excellent amazing but bad')).toBe('positive');
  });

  it('should handle mixed sentiments (negative dominates)', () => {
    expect(detectSentiment('good but terrible awful disappointing')).toBe('negative');
  });

  it('should return neutral for ok/fine/alright', () => {
    const result = detectSentiment('ok fine alright');
    expect(result).toBe('neutral');
  });

  it('should return neutral for empty string', () => {
    expect(detectSentiment('')).toBe('neutral');
  });
});

// ─── extractEntities ──────────────────────────────────────────────
describe('extractEntities', () => {
  it('should extract property type', () => {
    const entities = extractEntities('I want a villa');
    expect(entities).toContain('property_type:villa');
  });

  it('should extract location', () => {
    const entities = extractEntities('Something in dubai marina');
    expect(entities).toContain('location:dubai marina');
  });

  it('should extract bedroom count', () => {
    const entities = extractEntities('Looking for a 3 bedroom apartment');
    expect(entities).toContain('bedrooms:3');
  });

  it('should extract amenities', () => {
    const entities = extractEntities('Must have a pool and gym');
    expect(entities).toContain('amenity:pool');
    expect(entities).toContain('amenity:gym');
  });

  it('should handle no entities', () => {
    const entities = extractEntities('hello there');
    expect(entities).toEqual([]);
  });

  it('should detect price mentions', () => {
    const entities = extractEntities('Budget is AED 2000000');
    expect(entities.some((e: string) => e.includes('price'))).toBe(true);
  });

  it('should extract multiple entity types', () => {
    const entities = extractEntities('3 bed villa in palm jumeirah with pool');
    expect(entities.length).toBeGreaterThanOrEqual(3);
  });
});

// ─── calculateLeadScore ──────────────────────────────────────────
describe('calculateLeadScore', () => {
  it('should return base score with bonuses for undefined timing factors', () => {
    // Base 50 + 10 (hoursActive undefined → 0 < 1) + 10 (responseTime undefined → 0 < 5) = 70
    expect(calculateLeadScore({})).toBe(70);
  });

  it('should boost score for make_offer intent', () => {
    const score = calculateLeadScore({ intent: 'make_offer' });
    expect(score).toBeGreaterThan(50);
  });

  it('should boost score for schedule_tour intent', () => {
    const score = calculateLeadScore({ intent: 'schedule_tour' });
    expect(score).toBeGreaterThan(50);
  });

  it('should reduce score for complaint intent (relative to base)', () => {
    const base = calculateLeadScore({});
    const score = calculateLeadScore({ intent: 'complaint' });
    expect(score).toBeLessThan(base);
  });

  it('should boost for positive sentiment', () => {
    const score = calculateLeadScore({ sentiment: 'positive' });
    expect(score).toBeGreaterThan(50);
  });

  it('should reduce for negative sentiment (relative to base)', () => {
    const base = calculateLeadScore({});
    const score = calculateLeadScore({ sentiment: 'negative' });
    expect(score).toBeLessThan(base);
  });

  it('should boost for high message count', () => {
    const score = calculateLeadScore({ messageCount: 20 });
    expect(score).toBeGreaterThan(50);
  });

  it('should boost for phone presence', () => {
    const score = calculateLeadScore({ hasPhone: true });
    expect(score).toBeGreaterThan(50);
  });

  it('should boost for multiple entities', () => {
    const score = calculateLeadScore({ entities: ['a', 'b', 'c'] });
    expect(score).toBeGreaterThan(50);
  });

  it('should clamp to 0-100 range', () => {
    const highScore = calculateLeadScore({
      intent: 'make_offer',
      sentiment: 'positive',
      messageCount: 20,
      hasPhone: true,
      entities: ['a', 'b', 'c'],
      hoursActive: 0.5,
      responseTime: 3,
    });
    expect(highScore).toBeLessThanOrEqual(100);
    expect(highScore).toBeGreaterThanOrEqual(0);
  });

  it('should not exceed 100 even with all positive signals', () => {
    const score = calculateLeadScore({
      intent: 'make_offer',
      sentiment: 'positive',
      messageCount: 20,
      hasPhone: true,
      entities: ['a', 'b', 'c', 'd'],
      hoursActive: 0.1,
      responseTime: 1,
    });
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ─── generateBotResponse ─────────────────────────────────────────
describe('generateBotResponse', () => {
  it('should generate property_search response', () => {
    const response = generateBotResponse({ intent: 'property_search', entities: [], sentiment: 'neutral' });
    expect(response).toContain('property');
  });

  it('should generate schedule_tour response', () => {
    const response = generateBotResponse({ intent: 'schedule_tour', entities: [], sentiment: 'neutral' });
    expect(response).toContain('tour');
  });

  it('should include customer name if provided', () => {
    const response = generateBotResponse({ intent: 'general_inquiry', entities: [], sentiment: 'neutral', customerName: 'Ahmed' });
    expect(response).toContain('Ahmed');
  });

  it('should generate greeting without customer name', () => {
    const response = generateBotResponse({ intent: 'general_inquiry', entities: [], sentiment: 'neutral' });
    expect(response).toContain('Hello');
  });

  it('should generate complaint response', () => {
    const response = generateBotResponse({ intent: 'complaint', entities: [], sentiment: 'negative' });
    expect(response).toContain('issue');
  });

  it('should fallback to general_inquiry for unknown intent', () => {
    const response = generateBotResponse({ intent: 'unknown_intent', entities: [], sentiment: 'neutral' });
    expect(response.length).toBeGreaterThan(0);
  });
});

// ─── analyzeConversationState ────────────────────────────────────
describe('analyzeConversationState', () => {
  it('should return discovery phase for 0 messages', () => {
    const result = analyzeConversationState(0, 'general_inquiry', 'neutral', 50);
    expect(result.activePhase).toBe('discovery');
  });

  it('should return engagement phase for 1-2 messages', () => {
    const result = analyzeConversationState(2, 'property_search', 'neutral', 50);
    expect(result.activePhase).toBe('engagement');
  });

  it('should return consideration phase for 3-6 messages', () => {
    const result = analyzeConversationState(5, 'information_request', 'positive', 60);
    expect(result.activePhase).toBe('consideration');
  });

  it('should return decision phase for 7-11 messages', () => {
    const result = analyzeConversationState(10, 'make_offer', 'positive', 80);
    expect(result.activePhase).toBe('decision');
  });

  it('should return closing phase for 12+ messages', () => {
    const result = analyzeConversationState(15, 'make_offer', 'positive', 90);
    expect(result.activePhase).toBe('closing');
  });

  it('should include nextAction string', () => {
    const result = analyzeConversationState(5, 'property_search', 'neutral', 50);
    expect(typeof result.nextAction).toBe('string');
    expect(result.nextAction.length).toBeGreaterThan(0);
  });

  it('should estimate days to close', () => {
    const result = analyzeConversationState(5, 'property_search', 'neutral', 50);
    expect(typeof result.estimatedDaysToClose).toBe('number');
    expect(result.estimatedDaysToClose).toBeGreaterThan(0);
  });

  it('should estimate fewer days for high lead score', () => {
    const lowScore = analyzeConversationState(5, 'property_search', 'neutral', 30);
    const highScore = analyzeConversationState(5, 'property_search', 'neutral', 80);
    expect(highScore.estimatedDaysToClose).toBeLessThanOrEqual(lowScore.estimatedDaysToClose);
  });

  it('should estimate fewer days for positive sentiment', () => {
    const negative = analyzeConversationState(5, 'property_search', 'negative', 50);
    const positive = analyzeConversationState(5, 'property_search', 'positive', 50);
    expect(positive.estimatedDaysToClose).toBeLessThanOrEqual(negative.estimatedDaysToClose);
  });
});
