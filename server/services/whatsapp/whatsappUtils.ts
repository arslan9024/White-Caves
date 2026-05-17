/**
 * WhatsApp Utilities — Phone normalization, signature verification, rate limiting
 * Phase 3A: WhatsApp Cloud API Migration
 */

import crypto from 'crypto';

// ─── PHONE NUMBER NORMALIZATION ─────────────────────────────────────────

/**
 * Normalize phone number to E.164 format for WhatsApp Cloud API
 * Handles UAE (+971), common local formats, and international numbers.
 *
 * @param phone — raw phone string from DB or user input
 * @param defaultCountryCode — default country code if missing (default: '971' for UAE)
 * @returns E.164 number without + prefix (as WhatsApp API expects), or null if invalid
 *
 * Examples:
 *   '0501234567'     → '971501234567'
 *   '+971501234567'  → '971501234567'
 *   '00971501234567' → '971501234567'
 *   '971501234567'   → '971501234567'
 *   '+44 7700 900000'→ '447700900000'
 *   ''               → null
 */
export function normalizePhone(
  phone: string | null | undefined,
  defaultCountryCode = '971',
): string | null {
  if (!phone) return null;

  // Strip all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, '');

  // Remove leading + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Remove leading 00 (international dialing prefix)
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }

  // UAE local numbers starting with 0 (e.g. 050, 055, 056, 058, 04, 02)
  if (cleaned.startsWith('0') && cleaned.length >= 9 && cleaned.length <= 10) {
    cleaned = defaultCountryCode + cleaned.substring(1);
  }

  // Validate: should be 7-15 digits (E.164 spec)
  if (cleaned.length < 7 || cleaned.length > 15) return null;

  // Should start with a valid country code digit (1-9)
  if (cleaned.startsWith('0')) return null;

  return cleaned;
}

/**
 * Check if a phone number looks valid for WhatsApp
 */
export function isValidWhatsAppNumber(phone: string | null | undefined): boolean {
  return normalizePhone(phone) !== null;
}

// ─── WEBHOOK SIGNATURE VERIFICATION ─────────────────────────────────────

/**
 * Verify Meta webhook payload signature (HMAC-SHA256)
 * Meta sends X-Hub-Signature-256 header with each webhook POST.
 *
 * @param rawBody — raw request body as Buffer or string
 * @param signature — X-Hub-Signature-256 header value (format: "sha256=abc123...")
 * @param appSecret — Meta App Secret
 * @returns true if signature matches
 */
export function verifyWebhookSignature(
  rawBody: Buffer | string,
  signature: string | undefined,
  appSecret: string,
): boolean {
  if (!signature || !appSecret) return false;

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  } catch {
    return false;
  }
}

// ─── RATE LIMITER ───────────────────────────────────────────────────────

interface RateBucket {
  count: number;
  resetAt: number;
}

/**
 * Simple in-memory rate limiter for WhatsApp Cloud API
 * Meta limits: ~80 messages/sec globally, ~1000/phone/day
 */
class WhatsAppRateLimiter {
  private globalBucket: RateBucket = { count: 0, resetAt: 0 };
  private perPhoneBuckets = new Map<string, RateBucket>();

  private readonly GLOBAL_LIMIT = 80;     // per second
  private readonly GLOBAL_WINDOW = 1000;  // 1 second
  private readonly PHONE_LIMIT = 1000;    // per day per phone
  private readonly PHONE_WINDOW = 86_400_000; // 24 hours

  /**
   * Check if we can send. Returns { allowed, retryAfterMs }
   */
  canSend(toPhone: string): { allowed: boolean; retryAfterMs: number } {
    const now = Date.now();

    // Global rate check
    if (now >= this.globalBucket.resetAt) {
      this.globalBucket = { count: 0, resetAt: now + this.GLOBAL_WINDOW };
    }
    if (this.globalBucket.count >= this.GLOBAL_LIMIT) {
      return { allowed: false, retryAfterMs: this.globalBucket.resetAt - now };
    }

    // Per-phone rate check
    let phoneBucket = this.perPhoneBuckets.get(toPhone);
    if (!phoneBucket || now >= phoneBucket.resetAt) {
      phoneBucket = { count: 0, resetAt: now + this.PHONE_WINDOW };
      this.perPhoneBuckets.set(toPhone, phoneBucket);
    }
    if (phoneBucket.count >= this.PHONE_LIMIT) {
      return { allowed: false, retryAfterMs: phoneBucket.resetAt - now };
    }

    // Allow and increment
    this.globalBucket.count++;
    phoneBucket.count++;

    return { allowed: true, retryAfterMs: 0 };
  }

  /**
   * Get stats
   */
  getStats() {
    return {
      globalCount: this.globalBucket.count,
      trackedPhones: this.perPhoneBuckets.size,
    };
  }

  /**
   * Cleanup old phone buckets (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    for (const [phone, bucket] of this.perPhoneBuckets) {
      if (now >= bucket.resetAt) {
        this.perPhoneBuckets.delete(phone);
      }
    }
  }
}

export const rateLimiter = new WhatsAppRateLimiter();

// ─── MESSAGE TEMPLATES (Meta-approved format) ───────────────────────────

export interface WhatsAppTemplate {
  name: string;
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
  language: string;
  description: string;
  bodyText: string;
  paramCount: number;
}

/**
 * Predefined WhatsApp message templates (must match Meta-approved templates)
 * Parameters are positional: {{1}}, {{2}}, etc.
 */
export const WHATSAPP_TEMPLATES: Record<string, WhatsAppTemplate> = {
  viewing_confirmation: {
    name: 'viewing_confirmation',
    category: 'UTILITY',
    language: 'en',
    description: 'Confirm viewing appointment',
    bodyText: 'Hello {{1}}, your viewing at {{2}} is confirmed for {{3}}. Your agent {{4}} will meet you there. Reply YES to confirm or RESCHEDULE to change.',
    paramCount: 4,
  },
  follow_up_hot: {
    name: 'follow_up_hot',
    category: 'MARKETING',
    language: 'en',
    description: 'Hot lead follow-up',
    bodyText: 'Hi {{1}}, thank you for your interest in {{2}}! Our expert {{3}} is available to discuss this property. Would you like to schedule a viewing?',
    paramCount: 3,
  },
  follow_up_warm: {
    name: 'follow_up_warm',
    category: 'MARKETING',
    language: 'en',
    description: 'Warm lead nurturing',
    bodyText: 'Hello {{1}}, we have new properties matching your preferences in {{2}}. Would you like us to send you the details? Reply YES to receive our latest listings.',
    paramCount: 2,
  },
  payment_reminder: {
    name: 'payment_reminder',
    category: 'UTILITY',
    language: 'en',
    description: 'Payment due reminder',
    bodyText: 'Dear {{1}}, a friendly reminder that your payment of {{2}} for {{3}} is due on {{4}}. Please contact us if you need assistance.',
    paramCount: 4,
  },
  document_ready: {
    name: 'document_ready',
    category: 'UTILITY',
    language: 'en',
    description: 'Document ready for review',
    bodyText: 'Hello {{1}}, your {{2}} document is ready for review. Please visit your portal or contact {{3}} to collect it.',
    paramCount: 3,
  },
  rera_expiry_alert: {
    name: 'rera_expiry_alert',
    category: 'UTILITY',
    language: 'en',
    description: 'RERA BRN license expiry warning',
    bodyText: 'Important: Your RERA license (BRN {{1}}) expires in {{2}} days on {{3}}. Please initiate renewal to avoid service disruption. Contact our compliance team for assistance.',
    paramCount: 3,
  },
  lease_renewal: {
    name: 'lease_renewal',
    category: 'UTILITY',
    language: 'en',
    description: 'Lease renewal notification',
    bodyText: 'Dear {{1}}, your lease for {{2}} is set to expire on {{3}}. We would love to assist with your renewal. Reply RENEW to start the process or CONTACT for a callback.',
    paramCount: 3,
  },
};

/**
 * Get template parameters from data
 */
export function getTemplateParams(
  templateName: string,
  data: Record<string, string>,
): string[] | null {
  const template = WHATSAPP_TEMPLATES[templateName];
  if (!template) return null;

  // Map positional params from data
  const params: string[] = [];
  for (let i = 1; i <= template.paramCount; i++) {
    params.push(data[`param${i}`] || data[`p${i}`] || '');
  }
  return params;
}
