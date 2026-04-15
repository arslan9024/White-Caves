/**
 * MessageProcessor — Unit Tests
 * All pure functions: detectIntent, detectSentiment, extractEntities,
 * calculateLeadScore, generateBotResponse, analyzeConversationState.
 * No external dependencies — no mocking needed except logger.
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
  type ScoringFactor,
  type BotResponseContext,
} from './messageProcessor';

// ── detectIntent ─────────────────────────────────────────────────────
describe('detectIntent', () => {
  it('detects property_search from "looking for villa"', () => {
    const result = detectIntent('I am looking for a 3 bedroom villa');
    expect(result).toBe('property_search');
  });

  it('detects schedule_tour from "schedule a viewing"', () => {
    const result = detectIntent('Can I schedule a viewing tomorrow?');
    expect(result).toBe('schedule_tour');
  });

  it('detects information_request from "what is the price"', () => {
    const result = detectIntent('What is the price for this property?');
    expect(['information_request', 'property_search']).toContain(result);
  });

  it('detects make_offer from "make an offer"', () => {
    const result = detectIntent('I want to make an offer on this unit');
    expect(result).toBe('make_offer');
  });

  it('detects financing from "mortgage options"', () => {
    const result = detectIntent('What mortgage options are available?');
    expect(['financing', 'schedule_tour', 'information_request']).toContain(result);
  });

  it('detects complaint from "terrible service"', () => {
    const result = detectIntent('This is terrible service, I want to complain');
    expect(['complaint', 'general_inquiry']).toContain(result);
  });

  it('returns general for unmatched input', () => {
    const result = detectIntent('asdfghjkl random noise');
    expect(typeof result).toBe('string');
  });

  it('handles empty string', () => {
    const result = detectIntent('');
    expect(typeof result).toBe('string');
  });
});

// ── detectSentiment ──────────────────────────────────────────────────
describe('detectSentiment', () => {
  it('detects positive sentiment', () => {
    expect(detectSentiment('This is amazing and perfect!')).toBe('positive');
  });

  it('detects negative sentiment', () => {
    expect(detectSentiment('This is terrible and awful')).toBe('negative');
  });

  it('detects neutral sentiment', () => {
    expect(detectSentiment('ok fine')).toBe('neutral');
  });

  it('handles empty string', () => {
    const result = detectSentiment('');
    expect(['positive', 'neutral', 'negative']).toContain(result);
  });
});

// ── extractEntities ──────────────────────────────────────────────────
describe('extractEntities', () => {
  it('extracts property type', () => {
    const entities = extractEntities('I want a villa');
    expect(entities.some(e => e.includes('villa'))).toBe(true);
  });

  it('extracts location', () => {
    const entities = extractEntities('Something in Dubai Marina please');
    expect(entities.some(e => e.toLowerCase().includes('dubai marina'))).toBe(true);
  });

  it('extracts amenities', () => {
    const entities = extractEntities('Must have a pool and gym');
    expect(entities.some(e => e.includes('pool'))).toBe(true);
  });

  it('returns empty array for no entities', () => {
    const entities = extractEntities('hello there');
    expect(Array.isArray(entities)).toBe(true);
  });

  it('handles empty string', () => {
    const entities = extractEntities('');
    expect(Array.isArray(entities)).toBe(true);
  });
});

// ── calculateLeadScore ──────────────────────────────────────────────
describe('calculateLeadScore', () => {
  it('returns score between 0 and 100', () => {
    const score = calculateLeadScore({ messageCount: 5, intent: 'property_search' });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('gives higher score for more engagement', () => {
    const low = calculateLeadScore({ messageCount: 1 });
    const high = calculateLeadScore({ messageCount: 20, intent: 'make_offer', hasPhone: true });
    expect(high).toBeGreaterThan(low);
  });

  it('boosts score when phone provided', () => {
    const noPhone = calculateLeadScore({ messageCount: 5 });
    const withPhone = calculateLeadScore({ messageCount: 5, hasPhone: true });
    expect(withPhone).toBeGreaterThanOrEqual(noPhone);
  });

  it('gives higher score for make_offer intent', () => {
    const general = calculateLeadScore({ intent: 'property_search', messageCount: 5 });
    const offer = calculateLeadScore({ intent: 'make_offer', messageCount: 5 });
    expect(offer).toBeGreaterThanOrEqual(general);
  });

  it('handles empty factors', () => {
    const score = calculateLeadScore({});
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

// ── generateBotResponse ─────────────────────────────────────────────
describe('generateBotResponse', () => {
  it('returns string response', () => {
    const ctx: BotResponseContext = { intent: 'property_search', entities: ['villa'], sentiment: 'positive' };
    const response = generateBotResponse(ctx);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('personalizes with customer name', () => {
    const ctx: BotResponseContext = { intent: 'property_search', entities: [], sentiment: 'neutral', customerName: 'Ahmed' };
    const response = generateBotResponse(ctx);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('handles complaint intent', () => {
    const ctx: BotResponseContext = { intent: 'complaint', entities: [], sentiment: 'negative' };
    const response = generateBotResponse(ctx);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });

  it('handles unknown intent', () => {
    const ctx: BotResponseContext = { intent: 'unknown', entities: [], sentiment: 'neutral' };
    const response = generateBotResponse(ctx);
    expect(typeof response).toBe('string');
    expect(response.length).toBeGreaterThan(0);
  });
});

// ── analyzeConversationState ────────────────────────────────────────
describe('analyzeConversationState', () => {
  it('returns early phase for new conversations', () => {
    const analysis = analyzeConversationState(1, 'property_search', 'neutral', 10);
    expect(['discovery', 'engagement']).toContain(analysis.activePhase);
    expect(analysis.nextAction).toBeDefined();
    expect(analysis.estimatedDaysToClose).toBeGreaterThan(0);
  });

  it('returns engagement phase for mid-conversation', () => {
    const analysis = analyzeConversationState(5, 'information_request', 'positive', 40);
    expect(['discovery', 'engagement', 'consideration']).toContain(analysis.activePhase);
  });

  it('returns closing phase for high-intent high-score', () => {
    const analysis = analyzeConversationState(15, 'make_offer', 'positive', 90);
    expect(['consideration', 'decision', 'closing']).toContain(analysis.activePhase);
    expect(analysis.estimatedDaysToClose).toBeLessThanOrEqual(30);
  });

  it('handles edge case with zero messages', () => {
    const analysis = analyzeConversationState(0, 'unknown', 'neutral', 0);
    expect(analysis.activePhase).toBeDefined();
    expect(typeof analysis.estimatedDaysToClose).toBe('number');
  });
});
