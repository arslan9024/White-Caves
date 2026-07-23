/**
 * Linda opportunityScoring unit tests
 */

import { describe, it, expect } from 'vitest';
import { scoreOpportunity, classifyMessage, scoreOpportunityBatch } from './opportunityScoring.js';

describe('opportunityScoring - scoreOpportunity', () => {
  it('returns cold score for negative signals', () => {
    const result = scoreOpportunity({ message: 'not interested, unsubscribe' });
    expect(result.tier).toBe('cold');
    expect(result.total).toBe(0);
  });

  it('returns high tier for urgent + cash buyer message', () => {
    const result = scoreOpportunity(
      { message: 'Hi I need a villa ASAP in DAMAC Hills 2, cash buyer, budget AED 2.5M' },
      { dealType: 'buy', timeline: 'ASAP' }
    );
    expect(result.tier).toBe('high');
    expect(result.total).toBeGreaterThanOrEqual(70);
    expect(result.signals.length).toBeGreaterThan(0);
  });

  it('detects project interest in DAMAC Hills 2', () => {
    const result = scoreOpportunity({ message: 'Looking for a villa in DAMAC Hills 2 community' });
    expect(result.components.projectInterest).toBeGreaterThan(0);
  });

  it('gives full score to all components on a rich message', () => {
    const result = scoreOpportunity(
      {
        message: 'I want to buy a 4BR villa in DAMAC Hills 2, AED 3M budget, cash purchase, ASAP. Can you send floor plans? Are there any available units?',
        previousMessages: ['msg1', 'msg2', 'msg3', 'msg4', 'msg5'],
      },
      { dealType: 'buy', budgetMin: 2_500_000, budgetMax: 3_500_000 }
    );
    expect(result.components.urgency).toBeGreaterThan(15);
    expect(result.components.budget).toBeGreaterThan(15);
    expect(result.components.engagement).toBeGreaterThan(10);
    expect(result.components.projectInterest).toBeGreaterThan(5);
  });

  it('confidence is higher when multiple components are active', () => {
    const richResult = scoreOpportunity({ message: 'urgent cash buyer AED 2M DAMAC Hills 2 ASAP buy villa now' });
    const sparsResult = scoreOpportunity({ message: 'hi' });
    expect(richResult.confidenceScore).toBeGreaterThan(sparsResult.confidenceScore);
  });
});

describe('opportunityScoring - classifyMessage', () => {
  it('classifies viewing intent', () => {
    const r = classifyMessage('Can I schedule a viewing appointment for tomorrow?');
    expect(r.intent).toBe('schedule_viewing');
    expect(r.confidence).toBeGreaterThan(0.5);
  });

  it('classifies offer intent', () => {
    const r = classifyMessage('I would like to make an offer and sign the MOU');
    expect(r.intent).toBe('make_offer');
  });

  it('classifies info request', () => {
    const r = classifyMessage('Please send me the brochure and floor plan');
    expect(r.intent).toBe('request_info');
  });

  it('classifies objection', () => {
    const r = classifyMessage('Not interested, please stop messaging');
    expect(r.intent).toBe('objection');
  });

  it('classifies general enquiry', () => {
    const r = classifyMessage('I am looking for a 2BR apartment to rent');
    expect(r.intent).toBe('enquiry');
  });
});

describe('opportunityScoring - scoreOpportunityBatch', () => {
  it('scores an array of messages', () => {
    const items = [
      { context: { message: 'Cash buyer ASAP DAMAC villa AED 3M' } },
      { context: { message: 'not interested' } },
      { context: { message: 'Looking for 2BR' } },
    ];
    const results = scoreOpportunityBatch(items);
    expect(results).toHaveLength(3);
    // Cash buyer + urgent should score higher than 'not interested'
    expect(results[0].total).toBeGreaterThan(results[1].total);
    expect(results[1].tier).toBe('cold');
  });
});
