/**
 * WhatsApp Utilities — Unit tests
 * Phase 3A: WhatsApp Cloud API Migration
 */

import { describe, it, expect } from 'vitest';
import {
  normalizePhone,
  isValidWhatsAppNumber,
  verifyWebhookSignature,
  rateLimiter,
  WHATSAPP_TEMPLATES,
  getTemplateParams,
  renderTemplate,
} from '../whatsappUtils.js';

describe('normalizePhone', () => {
  it('normalizes UAE local number with 0 prefix', () => {
    expect(normalizePhone('0501234567')).toBe('971501234567');
  });

  it('normalizes +971 prefix', () => {
    expect(normalizePhone('+971501234567')).toBe('971501234567');
  });

  it('normalizes 00971 prefix', () => {
    expect(normalizePhone('00971501234567')).toBe('971501234567');
  });

  it('normalizes already clean 971 number', () => {
    expect(normalizePhone('971501234567')).toBe('971501234567');
  });

  it('strips spaces and dashes', () => {
    expect(normalizePhone('+971 50 123 4567')).toBe('971501234567');
    expect(normalizePhone('050-123-4567')).toBe('971501234567');
  });

  it('handles UK numbers', () => {
    expect(normalizePhone('+447700900000')).toBe('447700900000');
  });

  it('handles US numbers', () => {
    expect(normalizePhone('+12025551234')).toBe('12025551234');
  });

  it('returns null for empty/null', () => {
    expect(normalizePhone('')).toBeNull();
    expect(normalizePhone(null)).toBeNull();
    expect(normalizePhone(undefined)).toBeNull();
  });

  it('returns null for too short numbers', () => {
    expect(normalizePhone('12345')).toBeNull();
  });

  it('normalizes UAE landline 04', () => {
    expect(normalizePhone('043456789')).toBe('97143456789');
  });
});

describe('isValidWhatsAppNumber', () => {
  it('returns true for valid UAE mobile', () => {
    expect(isValidWhatsAppNumber('+971501234567')).toBe(true);
  });

  it('returns false for null/empty', () => {
    expect(isValidWhatsAppNumber(null)).toBe(false);
    expect(isValidWhatsAppNumber('')).toBe(false);
  });
});

describe('verifyWebhookSignature', () => {
  it('verifies correct HMAC-SHA256 signature', () => {
    const body = '{"test":"payload"}';
    const secret = 'test_secret_123';

    // Compute expected signature
    const crypto = require('crypto');
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex');

    expect(verifyWebhookSignature(body, expected, secret)).toBe(true);
  });

  it('rejects wrong signature', () => {
    expect(verifyWebhookSignature('body', 'sha256=wrong', 'secret')).toBe(false);
  });

  it('rejects missing signature', () => {
    expect(verifyWebhookSignature('body', undefined, 'secret')).toBe(false);
  });

  it('rejects empty secret', () => {
    expect(verifyWebhookSignature('body', 'sha256=abc', '')).toBe(false);
  });
});

describe('rateLimiter', () => {
  it('allows first message', () => {
    const result = rateLimiter.canSend('971501234567');
    expect(result.allowed).toBe(true);
    expect(result.retryAfterMs).toBe(0);
  });

  it('tracks stats', () => {
    const stats = rateLimiter.getStats();
    expect(stats.globalCount).toBeGreaterThan(0);
    expect(stats.trackedPhones).toBeGreaterThan(0);
  });
});

describe('WHATSAPP_TEMPLATES', () => {
  it('has 10 predefined templates including Wave 61 additions', () => {
    expect(Object.keys(WHATSAPP_TEMPLATES).length).toBe(10);
    expect(WHATSAPP_TEMPLATES.lead_qualify).toBeDefined();
    expect(WHATSAPP_TEMPLATES.invoice_sent).toBeDefined();
    expect(WHATSAPP_TEMPLATES.viewing_confirmation_ar).toBeDefined();
  });

  it('viewing_confirmation has 4 params', () => {
    expect(WHATSAPP_TEMPLATES.viewing_confirmation.paramCount).toBe(4);
    expect(WHATSAPP_TEMPLATES.viewing_confirmation.category).toBe('UTILITY');
  });

  it('rera_expiry_alert has 3 params', () => {
    expect(WHATSAPP_TEMPLATES.rera_expiry_alert.paramCount).toBe(3);
  });

  it('invoice_sent has 5 params', () => {
    expect(WHATSAPP_TEMPLATES.invoice_sent.paramCount).toBe(5);
    expect(WHATSAPP_TEMPLATES.invoice_sent.category).toBe('UTILITY');
  });
});

describe('getTemplateParams', () => {
  it('returns params for known template', () => {
    const params = getTemplateParams('follow_up_hot', {
      param1: 'John',
      param2: 'Villa in JBR',
      param3: 'Agent Smith',
    });
    expect(params).toEqual(['John', 'Villa in JBR', 'Agent Smith']);
  });

  it('supports array input for params', () => {
    const params = getTemplateParams('lead_qualify', ['Sarah', 'Downtown Apartment']);
    expect(params).toEqual(['Sarah', 'Downtown Apartment']);
  });

  it('returns null for unknown template', () => {
    expect(getTemplateParams('nonexistent', {})).toBeNull();
  });

  it('returns empty strings for missing params', () => {
    const params = getTemplateParams('follow_up_warm', {});
    expect(params).toEqual(['', '']);
  });
});

describe('renderTemplate', () => {
  it('interpolates parameters correctly into template string', () => {
    const text = renderTemplate('viewing_confirmation', ['Fatima', 'Marina Vista 402', 'Tomorrow at 4 PM', 'Layla']);
    expect(text).toContain('Hello Fatima');
    expect(text).toContain('Marina Vista 402');
    expect(text).toContain('Tomorrow at 4 PM');
    expect(text).toContain('Layla');
  });

  it('handles fallback for unknown templates', () => {
    const text = renderTemplate('custom_promo', ['Special Offer']);
    expect(text).toContain('custom_promo');
    expect(text).toContain('Special Offer');
  });
});
