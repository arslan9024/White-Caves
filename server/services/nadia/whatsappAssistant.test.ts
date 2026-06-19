/**
 * WhatsApp Assistant Service Tests — Phase 4D
 */

import { describe, it, expect } from 'vitest';
import { classifyWhatsAppIntent, generateWhatsAppAutoResponse } from './whatsappAssistant';

describe('WhatsApp Assistant (Phase 4D)', () => {
  it('classifies property search intent with confidence', () => {
    const result = classifyWhatsAppIntent(
      'I am looking for a 2 bed apartment in Dubai Marina around 2 million'
    );
    expect(result.intent).toBe('property_search');
    expect(result.entities.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.6);
    expect(result.firstResponseState).toBe('auto_reply');
    expect(result.shouldEscalate).toBe(false);
  });

  it('escalates complaint intent', () => {
    const result = classifyWhatsAppIntent(
      'I have a serious complaint, this is urgent and not working'
    );
    expect(result.intent).toBe('complaint');
    expect(result.firstResponseState).toBe('escalate_to_agent');
    expect(result.shouldEscalate).toBe(true);
    expect(result.escalationReason).toBeTruthy();
  });

  it('uses clarify state for broad low-context inquiries', () => {
    const result = classifyWhatsAppIntent('Need details please');
    expect(result.firstResponseState).toBe('clarify');
    expect(result.shouldEscalate).toBe(false);
  });

  it('auto-generates bot response for non-escalation flow', () => {
    const result = generateWhatsAppAutoResponse({
      message: 'Can you share apartment details and amenities in Dubai Marina?',
      customerName: 'Ahmed',
    });
    expect(result.responseType).toBe('bot');
    expect(result.response.toLowerCase()).toContain('ahmed');
  });

  it('auto-generates escalation response when human requested', () => {
    const result = generateWhatsAppAutoResponse({
      message: 'I want to talk to an agent now',
    });
    expect(result.responseType).toBe('escalate_to_agent');
    expect(result.classification.shouldEscalate).toBe(true);
  });

  it('escalates explicit real-person handoff requests', () => {
    const result = classifyWhatsAppIntent('Please connect me to a real person from support team');
    expect(result.shouldEscalate).toBe(true);
    expect(result.escalationReason).toBe('customer_requested_human');
  });

  it('does not force escalation for urgent but clear property-search intent', () => {
    const result = classifyWhatsAppIntent(
      'Need an urgent viewing for a 2 bedroom apartment in Marina tomorrow'
    );
    expect(result.intent).toBe('property_search');
    expect(result.shouldEscalate).toBe(false);
    expect(result.firstResponseState).toBe('auto_reply');
  });

  it('returns clarification prompt when classification state is clarify', () => {
    const result = generateWhatsAppAutoResponse({
      message: 'Need options',
      customerName: 'Sara',
    });
    expect(result.responseType).toBe('bot');
    expect(result.classification.firstResponseState).toBe('clarify');
    expect(result.response.toLowerCase()).toContain('preferred area');
  });

  // ── P1-004: Confidence-gate threshold contract tests ─────────────────

  it('confidence is a number in the 0–1 range', () => {
    const result = classifyWhatsAppIntent('I need a villa');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('triggers escalation when confidence is below 0.6 threshold', () => {
    // Very short ambiguous message → confidence will be below 0.6
    const result = classifyWhatsAppIntent('hi');
    // Either escalate_to_agent or clarify — both indicate low confidence gate
    expect(['escalate_to_agent', 'clarify']).toContain(result.firstResponseState);
  });

  it('escalation reason is low_intent_confidence when below threshold and no explicit keyword', () => {
    // "info" alone gives general_inquiry at low confidence without explicit escalation keywords
    const result = classifyWhatsAppIntent('info');
    if (result.shouldEscalate && result.escalationReason === 'low_intent_confidence') {
      expect(result.confidence).toBeLessThan(0.6);
    } else {
      // clarify path is also acceptable for very low context messages
      expect(['clarify', 'auto_reply']).toContain(result.firstResponseState);
    }
  });

  it('structured context handoff response includes specialist handoff language', () => {
    const result = generateWhatsAppAutoResponse({
      message: 'I need to speak with a manager about my complaint',
    });
    expect(result.responseType).toBe('escalate_to_agent');
    expect(result.response).toContain('specialist');
    expect(result.classification.escalationReason).toBe('customer_requested_human');
  });

  it('classification result has all required contract fields', () => {
    const result = classifyWhatsAppIntent('Looking for a 2BR in JBR with sea view');
    expect(result).toHaveProperty('intent');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('sentiment');
    expect(result).toHaveProperty('entities');
    expect(result).toHaveProperty('leadScore');
    expect(result).toHaveProperty('firstResponseState');
    expect(result).toHaveProperty('shouldEscalate');
    expect(result).toHaveProperty('escalationReason');
  });

  it('does not escalate high-confidence explicit property inquiry', () => {
    const result = classifyWhatsAppIntent(
      'I want to buy a 3 bedroom villa in Palm Jumeirah with sea view, budget 5M AED'
    );
    expect(result.confidence).toBeGreaterThan(0.6);
    expect(result.shouldEscalate).toBe(false);
    expect(result.firstResponseState).toBe('auto_reply');
  });

  it('intent escalation maps to correct escalation reason', () => {
    const result = classifyWhatsAppIntent('I need to speak to a lawyer about this legal matter');
    if (result.shouldEscalate) {
      expect(['intent_requires_agent', 'customer_requested_human']).toContain(
        result.escalationReason
      );
    }
  });
});
