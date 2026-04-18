import { describe, it, expect } from 'vitest';
import { detectIntent, detectSentiment, extractEntities, calculateLeadScore, generateBotResponse, analyzeConversationState } from './messageProcessor';

describe('messageProcessor', () => {
  describe('detectIntent', () => {
    it('property_search for property keywords', () => { expect(detectIntent('I am looking for an apartment')).toBe('property_search'); });
    it('schedule_tour for tour keywords', () => { expect(detectIntent('I want to schedule a tour to view the property')).toBe('schedule_tour'); });
    it('information_request for price keywords', () => { expect(detectIntent('What is the price and details')).toBe('information_request'); });
    it('make_offer for purchase intent', () => { expect(detectIntent('I want to buy this, what is the next step to proceed with the offer')).toBe('make_offer'); });
    it('financing for loan keywords', () => { expect(detectIntent('Can I get a mortgage or payment plan for financing')).toBe('financing'); });
    it('legal_enquiry for legal keywords', () => { expect(detectIntent('I need the contract and registration documents')).toBe('legal_enquiry'); });
    it('complaint for issue keywords', () => { expect(detectIntent('I have a problem and need help urgently')).toBe('complaint'); });
    it('general_inquiry for unrelated text', () => { expect(detectIntent('Hello how are you')).toBe('general_inquiry'); });
    it('handles empty string', () => { expect(detectIntent('')).toBe('general_inquiry'); });
    it('case insensitive', () => { expect(detectIntent('LOOKING FOR A VILLA')).toBe('property_search'); });
  });

  describe('detectSentiment', () => {
    it('positive for happy words', () => { expect(detectSentiment('This is amazing and wonderful')).toBe('positive'); });
    it('negative for bad words', () => { expect(detectSentiment('This is terrible and awful')).toBe('negative'); });
    it('neutral for no keywords', () => { expect(detectSentiment('The sky is blue')).toBe('neutral'); });
    it('neutral for balanced', () => { expect(detectSentiment('ok fine alright')).toBe('neutral'); });
    it('handles empty string', () => { expect(detectSentiment('')).toBe('neutral'); });
    it('positive wins when more positive', () => { expect(detectSentiment('great excellent love but bad')).toBe('positive'); });
    it('negative wins when more negative', () => { expect(detectSentiment('good but terrible awful ugly')).toBe('negative'); });
  });

  describe('extractEntities', () => {
    it('extracts property type', () => { expect(extractEntities('I want a villa')).toContain('property_type:villa'); });
    it('extracts location', () => { expect(extractEntities('property in dubai marina')).toContain('location:dubai marina'); });
    it('extracts bedrooms', () => { expect(extractEntities('3 bedroom apartment')).toContain('bedrooms:3'); });
    it('detects price mention', () => { expect(extractEntities('budget is aed 500000')).toContain('price_mentioned'); });
    it('extracts amenities', () => { const e = extractEntities('needs pool and gym'); expect(e).toContain('amenity:pool'); expect(e).toContain('amenity:gym'); });
    it('empty for unrelated text', () => { expect(extractEntities('hello world')).toEqual([]); });
    it('multiple entities', () => { const e = extractEntities('villa in palm jumeirah with 3 bedrooms and pool'); expect(e.length).toBeGreaterThanOrEqual(3); });
  });

  describe('calculateLeadScore', () => {
    it('default factors score includes time bonuses', () => { expect(calculateLeadScore({})).toBe(70); });
    it('make_offer boosts score', () => { expect(calculateLeadScore({ intent: 'make_offer' })).toBeGreaterThan(70); });
    it('complaint lowers vs default', () => { expect(calculateLeadScore({ intent: 'complaint' })).toBeLessThan(calculateLeadScore({})); });
    it('positive sentiment boosts', () => { expect(calculateLeadScore({ sentiment: 'positive' })).toBeGreaterThan(50); });
    it('negative sentiment lowers vs default', () => { expect(calculateLeadScore({ sentiment: 'negative' })).toBeLessThan(calculateLeadScore({})); });
    it('many messages boost', () => { expect(calculateLeadScore({ messageCount: 20 })).toBeGreaterThan(60); });
    it('phone boosts', () => { expect(calculateLeadScore({ hasPhone: true })).toBeGreaterThan(50); });
    it('clamped to 0-100', () => { const s = calculateLeadScore({ intent: 'make_offer', sentiment: 'positive', messageCount: 20, hasPhone: true, entities: ['a','b','c'], hoursActive: 0.5, responseTime: 2 }); expect(s).toBeLessThanOrEqual(100); expect(s).toBeGreaterThanOrEqual(0); });
    it('entities boost', () => { expect(calculateLeadScore({ entities: ['a','b','c'] })).toBeGreaterThan(50); });
    it('fast response boosts', () => { expect(calculateLeadScore({ responseTime: 2 })).toBeGreaterThan(50); });
  });

  describe('generateBotResponse', () => {
    it('returns string', () => { expect(typeof generateBotResponse({ intent: 'property_search', entities: [], sentiment: 'neutral' })).toBe('string'); });
    it('includes customer name', () => { expect(generateBotResponse({ intent: 'general_inquiry', entities: [], sentiment: 'neutral', customerName: 'Alice' })).toContain('Alice'); });
    it('general_inquiry fallback', () => { expect(generateBotResponse({ intent: 'unknown_intent', entities: [], sentiment: 'neutral' })).toContain('Hello'); });
    it('different responses per intent', () => { const a = generateBotResponse({ intent: 'property_search', entities: [], sentiment: 'neutral' }); const b = generateBotResponse({ intent: 'complaint', entities: [], sentiment: 'neutral' }); expect(a).not.toBe(b); });
  });

  describe('analyzeConversationState', () => {
    it('discovery for 0 messages', () => { expect(analyzeConversationState(0, 'general_inquiry', 'neutral', 50).activePhase).toBe('discovery'); });
    it('engagement for few messages', () => { expect(analyzeConversationState(2, 'property_search', 'neutral', 50).activePhase).toBe('engagement'); });
    it('consideration for moderate', () => { expect(analyzeConversationState(5, 'information_request', 'neutral', 50).activePhase).toBe('consideration'); });
    it('decision for many', () => { expect(analyzeConversationState(10, 'make_offer', 'positive', 80).activePhase).toBe('decision'); });
    it('closing for 12+', () => { expect(analyzeConversationState(15, 'make_offer', 'positive', 90).activePhase).toBe('closing'); });
    it('has nextAction', () => { expect(analyzeConversationState(0, 'general_inquiry', 'neutral', 50).nextAction).toBeTruthy(); });
    it('has estimatedDaysToClose', () => { expect(analyzeConversationState(0, 'general_inquiry', 'neutral', 50).estimatedDaysToClose).toBeGreaterThan(0); });
    it('high score reduces days', () => { const low = analyzeConversationState(5, 'property_search', 'neutral', 30); const high = analyzeConversationState(5, 'property_search', 'neutral', 80); expect(high.estimatedDaysToClose).toBeLessThanOrEqual(low.estimatedDaysToClose); });
  });
});
