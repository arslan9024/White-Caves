import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSendEmailTracked, mockWrapInBrandedTemplate } = vi.hoisted(() => ({
  mockSendEmailTracked: vi.fn(),
  mockWrapInBrandedTemplate: vi.fn((html: string) => `<wrapped>${html}</wrapped>`),
}));

vi.mock('../services/emailService.js', () => ({
  sendEmailTracked: (...args: unknown[]) => mockSendEmailTracked(...args),
  wrapInBrandedTemplate: (...args: unknown[]) => mockWrapInBrandedTemplate(...args),
}));

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import { getEmailTriggerRegistry, sendTriggeredEmail } from '../services/emailTriggers.js';

describe('emailTriggers Wave 12', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSendEmailTracked.mockResolvedValue({ success: true, messageId: 'msg-1' });
  });

  it('exposes trigger registry for supported events', () => {
    const registry = getEmailTriggerRegistry();
    expect(registry.welcome).toBeDefined();
    expect(registry.lead_assigned).toBeDefined();
    expect(registry.contract_ready).toBeDefined();
  });

  it('renders template and sends tracked email for trigger event', async () => {
    const result = await sendTriggeredEmail({
      event: 'welcome',
      to: 'client@whitecaves.ae',
      variables: { name: 'Alya' },
    });

    expect(result.success).toBe(true);
    expect(mockWrapInBrandedTemplate).toHaveBeenCalledWith(expect.stringContaining('Alya'));
    expect(mockSendEmailTracked).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'client@whitecaves.ae',
        tags: [{ name: 'trigger_event', value: 'welcome' }],
      })
    );
  });
});
