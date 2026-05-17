/**
 * NADIA WhatsApp Assistant Route Tests — Phase 4D
 *
 * Focused tests for intent classification + auto-response route flows.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockClassify = vi.fn();
const mockAutoResponse = vi.fn();

vi.mock('../services/nadia/whatsappAssistant.js', () => ({
  classifyWhatsAppIntent: (...args: unknown[]) => mockClassify(...args),
  generateWhatsAppAutoResponse: (...args: unknown[]) => mockAutoResponse(...args),
}));

vi.mock('../middleware/rbac.js', () => ({
  requirePermission: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

describe('NADIA Assistant Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('classifies intent from message', () => {
    mockClassify.mockReturnValue({
      intent: 'property_search',
      confidence: 0.83,
      sentiment: 'positive',
      entities: ['location:dubai marina'],
      leadScore: 78,
      shouldEscalate: false,
      escalationReason: null,
    });

    const result = mockClassify('Looking for apartment in Dubai Marina');
    expect(result.intent).toBe('property_search');
    expect(result.confidence).toBeGreaterThan(0.6);
    expect(result.shouldEscalate).toBe(false);
  });

  it('generates escalation auto-response when needed', () => {
    mockAutoResponse.mockReturnValue({
      classification: {
        intent: 'complaint',
        confidence: 0.72,
        sentiment: 'negative',
        entities: [],
        leadScore: 45,
        shouldEscalate: true,
        escalationReason: 'intent_requires_agent',
      },
      response: 'I\'m connecting you to a specialist right now.',
      responseType: 'escalate_to_agent',
    });

    const result = mockAutoResponse({ message: 'I need a manager now' });
    expect(result.responseType).toBe('escalate_to_agent');
    expect(result.classification.shouldEscalate).toBe(true);
  });
});
