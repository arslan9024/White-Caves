/**
 * Email Service — Unit Tests
 *
 * Covers:
 *  - wrapInBrandedTemplate: HTML envelope, preheader injection
 *  - EMAIL_TEMPLATES.*: subject, html, text rendering for all 9 templates
 *  - sendEmail (dev mode): returns {success:true, devMode:true} without calling Resend
 *  - sendEmailWithRetry: succeeds on first dev-mode attempt
 *  - sendEmailTracked: increments devMode counter per successful dev send
 *  - getEmailStats: returns typed shape with isDevMode flag
 *
 * Note: In the test environment RESEND_API_KEY is unset → IS_DEV = true.
 * All sends are log-only (no network calls). Production-path tests would
 * require a full Resend client mock and are left for integration coverage.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Silence logger output during tests ──────────────────────────────────
vi.mock('../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  createLogger: vi.fn(() => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  })),
}));

import {
  sendEmail,
  sendEmailTracked,
  sendEmailWithRetry,
  getEmailStats,
  EMAIL_TEMPLATES,
  wrapInBrandedTemplate,
} from './emailService.js';

// ── wrapInBrandedTemplate ────────────────────────────────────────────────
describe('wrapInBrandedTemplate', () => {
  it('wraps content in a valid HTML document', () => {
    const html = wrapInBrandedTemplate('<p>Hello World</p>');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<p>Hello World</p>');
    expect(html).toContain('White Caves');
  });

  it('includes the preheader text when provided', () => {
    const html = wrapInBrandedTemplate('<p>Body</p>', { preheader: 'Preview text here' });
    expect(html).toContain('Preview text here');
    expect(html).toContain('class="preheader"');
  });

  it('omits preheader div when not provided', () => {
    const html = wrapInBrandedTemplate('<p>Body</p>');
    expect(html).not.toContain('class="preheader"');
  });

  it('includes the footer with contact info', () => {
    const html = wrapInBrandedTemplate('<p>Content</p>');
    expect(html).toContain('whitecaves.com');
    expect(html).toContain('Dubai, UAE');
  });
});

// ── EMAIL_TEMPLATES ──────────────────────────────────────────────────────
describe('EMAIL_TEMPLATES', () => {
  // ── welcome ─────────────────────────────────────────────────────────
  describe('welcome', () => {
    it('subject contains the recipient name', () => {
      const t = EMAIL_TEMPLATES.welcome('Alice');
      expect(t.subject).toContain('Alice');
    });

    it('plain-text body greets the recipient', () => {
      const t = EMAIL_TEMPLATES.welcome('Alice');
      expect(t.text).toContain('Alice');
    });

    it('HTML body renders branded template with name', () => {
      const t = EMAIL_TEMPLATES.welcome('Alice');
      expect(t.html).toContain('<!DOCTYPE html>');
      expect(t.html).toContain('Alice');
    });

    it('all three fields are non-empty strings', () => {
      const t = EMAIL_TEMPLATES.welcome('Bob');
      expect(t.subject.length).toBeGreaterThan(0);
      expect(t.text.length).toBeGreaterThan(0);
      expect(t.html.length).toBeGreaterThan(0);
    });
  });

  // ── propertyAlert ────────────────────────────────────────────────────
  describe('propertyAlert', () => {
    const t = EMAIL_TEMPLATES.propertyAlert('Carol', 'Burj Vista 3BR', 'Downtown Dubai', 'AED 3.2M');

    it('subject contains area and title', () => {
      expect(t.subject).toContain('Downtown Dubai');
      expect(t.subject).toContain('Burj Vista 3BR');
    });

    it('text body contains all four params', () => {
      expect(t.text).toContain('Carol');
      expect(t.text).toContain('Burj Vista 3BR');
      expect(t.text).toContain('Downtown Dubai');
      expect(t.text).toContain('AED 3.2M');
    });

    it('HTML body contains price highlighted', () => {
      expect(t.html).toContain('AED 3.2M');
    });
  });

  // ── viewingConfirmation ──────────────────────────────────────────────
  describe('viewingConfirmation', () => {
    const t = EMAIL_TEMPLATES.viewingConfirmation(
      'Dana',
      'Palm Jumeirah Villa',
      '15 Jun 2026 at 14:00',
      'Agent Eva'
    );

    it('subject contains the property title', () => {
      expect(t.subject).toContain('Palm Jumeirah Villa');
    });

    it('text includes all booking details', () => {
      expect(t.text).toContain('Dana');
      expect(t.text).toContain('Palm Jumeirah Villa');
      expect(t.text).toContain('15 Jun 2026');
      expect(t.text).toContain('Agent Eva');
    });

    it('HTML shows agent name in the table', () => {
      expect(t.html).toContain('Agent Eva');
    });
  });

  // ── leadAssigned ──────────────────────────────────────────────────────
  describe('leadAssigned', () => {
    it('subject contains lead name', () => {
      const t = EMAIL_TEMPLATES.leadAssigned('Agent Frank', 'Lead Grace', 'grace@example.com', 'portal');
      expect(t.subject).toContain('Lead Grace');
    });

    it('text body contains all assigned-lead details', () => {
      const t = EMAIL_TEMPLATES.leadAssigned('Agent Frank', 'Lead Grace', 'grace@example.com', 'portal');
      expect(t.text).toContain('Agent Frank');
      expect(t.text).toContain('Lead Grace');
      expect(t.text).toContain('grace@example.com');
      expect(t.text).toContain('portal');
    });

    it('HTML shows "Not provided" when email is empty', () => {
      const t = EMAIL_TEMPLATES.leadAssigned('Agent', 'Lead', '', 'direct');
      expect(t.html).toContain('Not provided');
    });

    it('HTML includes the source as a badge', () => {
      const t = EMAIL_TEMPLATES.leadAssigned('Agent', 'Lead', 'x@x.com', 'whatsapp');
      expect(t.html).toContain('whatsapp');
    });
  });

  // ── contractSigned ────────────────────────────────────────────────────
  describe('contractSigned', () => {
    const t = EMAIL_TEMPLATES.contractSigned(
      'Hannah',
      'Marina Heights 2BR',
      'WC-2026-0042',
      '1 Jul 2026'
    );

    it('subject contains property title', () => {
      expect(t.subject).toContain('Marina Heights 2BR');
    });

    it('text body includes contract reference', () => {
      expect(t.text).toContain('WC-2026-0042');
      expect(t.text).toContain('1 Jul 2026');
    });

    it('HTML includes client name and contract ref', () => {
      expect(t.html).toContain('Hannah');
      expect(t.html).toContain('WC-2026-0042');
    });
  });

  // ── viewingCancelled ──────────────────────────────────────────────────
  describe('viewingCancelled', () => {
    const t = EMAIL_TEMPLATES.viewingCancelled(
      'Iris',
      'JBR Penthouse',
      '5 Jun 2026 at 11:00',
      'Agent Jack'
    );

    it('subject contains property title', () => {
      expect(t.subject).toContain('JBR Penthouse');
    });

    it('text body explains the cancellation', () => {
      expect(t.text).toContain('Iris');
      expect(t.text).toContain('JBR Penthouse');
      expect(t.text).toContain('5 Jun 2026');
      expect(t.text).toContain('Agent Jack');
    });

    it('HTML includes reschedule CTA', () => {
      expect(t.html).toContain('Reschedule');
    });
  });

  // ── paymentReminder ───────────────────────────────────────────────────
  describe('paymentReminder', () => {
    const t = EMAIL_TEMPLATES.paymentReminder('Karen', 'AED 12,000', 'April Rent', '1 Apr 2026');

    it('subject contains amount and due date', () => {
      expect(t.subject).toContain('AED 12,000');
      expect(t.subject).toContain('1 Apr 2026');
    });

    it('HTML highlights the amount', () => {
      expect(t.html).toContain('AED 12,000');
      expect(t.html).toContain('April Rent');
    });
  });

  // ── reraExpiry ────────────────────────────────────────────────────────
  describe('reraExpiry', () => {
    const t = EMAIL_TEMPLATES.reraExpiry('Leo', 'BRN-123456', '31 Dec 2026', '30');

    it('subject includes the BRN number', () => {
      expect(t.subject).toContain('BRN-123456');
    });

    it('text body states days remaining', () => {
      expect(t.text).toContain('30');
      expect(t.text).toContain('31 Dec 2026');
    });

    it('HTML includes renewal CTA', () => {
      expect(t.html).toContain('Renewal');
    });
  });

  // ── documentReady ─────────────────────────────────────────────────────
  describe('documentReady', () => {
    const t = EMAIL_TEMPLATES.documentReady('Mia', 'Tenancy Agreement', 'WC-TA-2026-001');

    it('subject contains the document type', () => {
      expect(t.subject).toContain('Tenancy Agreement');
    });

    it('HTML includes the document title', () => {
      expect(t.html).toContain('WC-TA-2026-001');
      expect(t.html).toContain('Tenancy Agreement');
    });
  });
});

// ── sendEmail — dev mode ─────────────────────────────────────────────────
describe('sendEmail — dev mode (IS_DEV = true, no API key)', () => {
  it('returns success:true with devMode:true', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Dev Test',
      text: 'Body text',
    });

    expect(result.success).toBe(true);
    expect(result.devMode).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns a messageId prefixed with "dev_"', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Dev ID test',
      text: 'Body',
    });

    expect(result.messageId).toBeDefined();
    expect(result.messageId).toMatch(/^dev_/);
  });

  it('handles array of recipients', async () => {
    const result = await sendEmail({
      to: ['a@example.com', 'b@example.com'],
      subject: 'Group send',
      text: 'Hi both',
    });

    expect(result.success).toBe(true);
    expect(result.devMode).toBe(true);
  });

  it('accepts optional from/replyTo overrides without throwing', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Override test',
      text: 'Hello',
      from: 'custom@whitecaves.com',
      replyTo: 'reply@whitecaves.com',
    });

    expect(result.success).toBe(true);
  });

  it('accepts html and tags fields without throwing', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'HTML test',
      html: '<p>Hello</p>',
      tags: [{ name: 'template', value: 'welcome' }],
    });

    expect(result.success).toBe(true);
  });
});

// ── sendEmailWithRetry ───────────────────────────────────────────────────
describe('sendEmailWithRetry', () => {
  it('returns success on the first attempt in dev mode', async () => {
    const result = await sendEmailWithRetry({
      to: 'retry@example.com',
      subject: 'Retry Test',
      text: 'Hello',
    });

    expect(result.success).toBe(true);
    expect(result.devMode).toBe(true);
  });

  it('returns correct shape with 1 max retry', async () => {
    const result = await sendEmailWithRetry(
      { to: 'r@example.com', subject: 'Single retry', text: 'Body' },
      1
    );
    expect(result.success).toBe(true);
  });
});

// ── sendEmailTracked + getEmailStats ─────────────────────────────────────
describe('sendEmailTracked + getEmailStats', () => {
  it('getEmailStats returns the correct typed shape', () => {
    const stats = getEmailStats();

    expect(typeof stats.sent).toBe('number');
    expect(typeof stats.failed).toBe('number');
    expect(typeof stats.devMode).toBe('number');
    expect(typeof stats.isDevMode).toBe('boolean');
  });

  it('isDevMode is true when no RESEND_API_KEY is set', () => {
    const stats = getEmailStats();
    expect(stats.isDevMode).toBe(true);
  });

  it('increments devMode counter after a tracked dev-mode send', async () => {
    const before = getEmailStats();

    await sendEmailTracked({
      to: 'tracked@example.com',
      subject: 'Tracked send',
      text: 'Hello',
    });

    const after = getEmailStats();
    expect(after.devMode).toBe(before.devMode + 1);
  });

  it('does not increment sent counter in dev mode', async () => {
    const before = getEmailStats();

    await sendEmailTracked({
      to: 'no-increment@example.com',
      subject: 'No sent counter',
      text: 'Check',
    });

    const after = getEmailStats();
    expect(after.sent).toBe(before.sent); // sent stays the same
  });

  it('multiple tracked sends accumulate the devMode counter', async () => {
    const before = getEmailStats();

    await sendEmailTracked({ to: 'a@example.com', subject: 'S1', text: 'B' });
    await sendEmailTracked({ to: 'b@example.com', subject: 'S2', text: 'B' });
    await sendEmailTracked({ to: 'c@example.com', subject: 'S3', text: 'B' });

    const after = getEmailStats();
    expect(after.devMode).toBeGreaterThanOrEqual(before.devMode + 3);
  });
});
