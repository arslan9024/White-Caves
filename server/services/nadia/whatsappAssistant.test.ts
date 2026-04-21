/**
 * WhatsApp Assistant Service Tests — Phase 4D
 */

import { describe, it, expect } from 'vitest';
import {
  classifyWhatsAppIntent,
  generateWhatsAppAutoResponse,
} from './whatsappAssistant';

describe('WhatsApp Assistant (Phase 4D)', () => {
  it('classifies property search intent with confidence', () => {
    const result = classifyWhatsAppIntent('I am looking for a 2 bed apartment in Dubai Marina around 2 million');
    expect(result.intent).toBe('property_search');
    expect(result.entities.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0.6);
    expect(result.shouldEscalate).toBe(false);
  });

  it('escalates complaint intent', () => {
    const result = classifyWhatsAppIntent('I have a serious complaint, this is urgent and not working');
    expect(result.intent).toBe('complaint');
    expect(result.shouldEscalate).toBe(true);
    expect(result.escalationReason).toBeTruthy();
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
});
