/**
 * Email Service — White Caves CRM
 * 
 * Production-ready email sending with template support.
 * Supports: Resend, SendGrid, SMTP (nodemailer), and mock mode.
 * 
 * Provider is auto-detected from environment variables:
 *   - RESEND_API_KEY  → Resend (recommended for startups)
 *   - SENDGRID_API_KEY → SendGrid
 *   - SMTP_HOST        → Generic SMTP / nodemailer
 *   - None set         → Mock mode (logs to console, perfect for dev)
 * 
 * Usage:
 *   import { emailService } from './services/emailService.js';
 *   await emailService.send({ to: 'a@b.com', subject: 'Hello', template: 'welcome', data: { name: 'Ali' } });
 */

import logger from '../utils/logger.js';

// ─── Types ────────────────────────────────────────────────────────────────

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailOptions {
  to: string | string[] | EmailAddress | EmailAddress[];
  subject: string;
  /** Plain-text body (fallback) */
  text?: string;
  /** HTML body — if template is provided, this is auto-generated */
  html?: string;
  /** Named template (see TEMPLATES below) */
  template?: EmailTemplate;
  /** Data to interpolate into the template */
  data?: Record<string, unknown>;
  /** Override from address (defaults to config) */
  from?: string;
  /** CC recipients */
  cc?: string | string[];
  /** BCC recipients */
  bcc?: string | string[];
  /** Reply-to address */
  replyTo?: string;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Priority: high, normal, low */
  priority?: 'high' | 'normal' | 'low';
  /** Tags for analytics (provider-dependent) */
  tags?: string[];
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export type EmailTemplate =
  | 'welcome'
  | 'password_reset'
  | 'lead_assigned'
  | 'viewing_confirmation'
  | 'viewing_reminder'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'commission_approved'
  | 'commission_paid'
  | 'lease_expiry_reminder'
  | 'maintenance_update'
  | 'daily_report'
  | 'generic';

// ─── Configuration ────────────────────────────────────────────────────────

interface EmailConfig {
  provider: 'resend' | 'sendgrid' | 'smtp' | 'mock';
  from: string;
  fromName: string;
  replyTo?: string;
  // Provider-specific
  resendApiKey?: string;
  sendgridApiKey?: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPass?: string;
  smtpSecure?: boolean;
}

function resolveConfig(): EmailConfig {
  const from = process.env.EMAIL_FROM || 'noreply@whitecaves.ae';
  const fromName = process.env.EMAIL_FROM_NAME || 'White Caves CRM';
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;

  if (process.env.RESEND_API_KEY) {
    return { provider: 'resend', from, fromName, replyTo, resendApiKey: process.env.RESEND_API_KEY };
  }
  if (process.env.SENDGRID_API_KEY) {
    return { provider: 'sendgrid', from, fromName, replyTo, sendgridApiKey: process.env.SENDGRID_API_KEY };
  }
  if (process.env.SMTP_HOST) {
    return {
      provider: 'smtp',
      from,
      fromName,
      replyTo,
      smtpHost: process.env.SMTP_HOST,
      smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
      smtpUser: process.env.SMTP_USER,
      smtpPass: process.env.SMTP_PASS,
      smtpSecure: process.env.SMTP_SECURE === 'true',
    };
  }

  // No provider configured — mock mode
  return { provider: 'mock', from, fromName, replyTo };
}

const config = resolveConfig();

// ─── Template Engine ──────────────────────────────────────────────────────

const TEMPLATES: Record<EmailTemplate, { subject: string; html: (data: Record<string, unknown>) => string }> = {
  welcome: {
    subject: 'Welcome to White Caves CRM',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1e293b;">Welcome, ${d.name || 'there'}! 🏠</h1>
        <p>Your White Caves CRM account is ready. You can now:</p>
        <ul>
          <li>Browse and manage properties across Dubai</li>
          <li>Track leads and close deals faster</li>
          <li>Communicate with clients via WhatsApp</li>
        </ul>
        <a href="${d.loginUrl || 'https://whitecaves.ae/login'}" style="display: inline-block; background: #3b82f6; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">Log In Now</a>
        <p style="margin-top: 24px; color: #64748b; font-size: 12px;">White Caves — Dubai&apos;s Premier Real Estate CRM</p>
      </div>`,
  },

  password_reset: {
    subject: 'Reset Your White Caves Password',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">Password Reset Request</h2>
        <p>We received a request to reset the password for <strong>${d.email}</strong>.</p>
        <p>Click the button below to set a new password. This link expires in ${d.expiryMinutes || 60} minutes.</p>
        <a href="${d.resetUrl}" style="display: inline-block; background: #ef4444; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">Reset Password</a>
        <p style="margin-top: 16px; color: #64748b;">If you didn&apos;t request this, you can safely ignore this email.</p>
      </div>`,
  },

  lead_assigned: {
    subject: 'New Lead Assigned to You',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">🔔 New Lead Assignment</h2>
        <p>A new lead has been assigned to you:</p>
        <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.leadName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.leadPhone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Source</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.source || 'direct'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Score</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.score || 0}/100</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Budget</td><td style="padding: 8px;">${d.budget ? `AED ${Number(d.budget).toLocaleString()}` : 'Not specified'}</td></tr>
        </table>
        <a href="${d.leadUrl || '#'}" style="display: inline-block; background: #10b981; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none;">View Lead</a>
      </div>`,
  },

  viewing_confirmation: {
    subject: 'Viewing Confirmed — {{propertyTitle}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">✅ Viewing Confirmed</h2>
        <p>Your property viewing has been confirmed:</p>
        <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Property</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.propertyTitle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Date & Time</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.dateTime}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Location</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.location}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Agent</td><td style="padding: 8px;">${d.agentName}</td></tr>
        </table>
      </div>`,
  },

  viewing_reminder: {
    subject: 'Reminder: Property Viewing Tomorrow',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f59e0b;">⏰ Viewing Reminder</h2>
        <p>Reminder: You have a property viewing scheduled for <strong>${d.dateTime}</strong>.</p>
        <p><strong>Property:</strong> ${d.propertyTitle}<br/><strong>Location:</strong> ${d.location}</p>
      </div>`,
  },

  offer_received: {
    subject: 'New Offer Received — AED {{amount}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">💰 New Offer Received</h2>
        <p>A new offer has been submitted:</p>
        <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Property</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.propertyTitle}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Offer Amount</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">AED ${Number(d.amount).toLocaleString()}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Buyer</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.buyerName}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Expires</td><td style="padding: 8px;">${d.expiresAt || 'No expiry'}</td></tr>
        </table>
        <a href="${d.offerUrl || '#'}" style="display: inline-block; background: #3b82f6; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Review Offer</a>
      </div>`,
  },

  offer_accepted: {
    subject: 'Your Offer Has Been Accepted! 🎉',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">🎉 Offer Accepted!</h2>
        <p>Congratulations! Your offer of <strong>AED ${Number(d.amount).toLocaleString()}</strong> for <strong>${d.propertyTitle}</strong> has been accepted.</p>
        <p>Your agent will contact you shortly with next steps.</p>
      </div>`,
  },

  offer_rejected: {
    subject: 'Offer Update — {{propertyTitle}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #ef4444;">Offer Not Accepted</h2>
        <p>Unfortunately, your offer of <strong>AED ${Number(d.amount).toLocaleString()}</strong> for <strong>${d.propertyTitle}</strong> was not accepted.</p>
        ${d.counterAmount ? `<p>A counter-offer of <strong>AED ${Number(d.counterAmount).toLocaleString()}</strong> has been proposed.</p>` : ''}
        <p>Please contact your agent for further discussion.</p>
      </div>`,
  },

  commission_approved: {
    subject: 'Commission Approved — AED {{amount}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">✅ Commission Approved</h2>
        <p>Your commission of <strong>AED ${Number(d.amount).toLocaleString()}</strong> has been approved.</p>
        <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Type</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.type || 'sale'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Property</td><td style="padding: 8px;">${d.propertyTitle || 'N/A'}</td></tr>
        </table>
        <p>Payment will be processed according to the standard payment schedule.</p>
      </div>`,
  },

  commission_paid: {
    subject: 'Commission Paid — AED {{amount}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #10b981;">💸 Commission Paid</h2>
        <p>Your commission of <strong>AED ${Number(d.amount).toLocaleString()}</strong> has been paid.</p>
        <p>Please check your bank account for the deposit.</p>
      </div>`,
  },

  lease_expiry_reminder: {
    subject: 'Lease Expiring — {{propertyTitle}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f59e0b;">📋 Lease Expiry Reminder</h2>
        <p>The lease for <strong>${d.propertyTitle}</strong> is expiring on <strong>${d.expiryDate}</strong>.</p>
        <p><strong>Tenant:</strong> ${d.tenantName}<br/><strong>Monthly Rent:</strong> AED ${Number(d.monthlyRent).toLocaleString()}</p>
        <p>Please take action to renew or close this lease.</p>
      </div>`,
  },

  maintenance_update: {
    subject: 'Maintenance Update — {{title}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">🔧 Maintenance Update</h2>
        <p>Your maintenance request <strong>"${d.title}"</strong> has been updated:</p>
        <p><strong>New Status:</strong> ${d.status}<br/><strong>Property:</strong> ${d.propertyTitle || 'N/A'}</p>
        ${d.notes ? `<p><strong>Notes:</strong> ${d.notes}</p>` : ''}
      </div>`,
  },

  daily_report: {
    subject: 'White Caves Daily Summary — {{date}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">📊 Daily Summary — ${d.date}</h2>
        <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">New Leads</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.newLeads || 0}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Viewings Scheduled</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.viewings || 0}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Deals Closed</td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${d.dealsClosed || 0}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold;">Revenue</td><td style="padding: 8px;">AED ${Number(d.revenue || 0).toLocaleString()}</td></tr>
        </table>
        <a href="${d.dashboardUrl || 'https://whitecaves.ae/dashboard'}" style="display: inline-block; background: #3b82f6; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none;">Open Dashboard</a>
      </div>`,
  },

  generic: {
    subject: '{{subject}}',
    html: (d) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e293b;">${d.heading || d.subject || 'Notification'}</h2>
        ${d.body || d.message || '<p>You have a new notification from White Caves CRM.</p>'}
      </div>`,
  },
};

// ─── Provider Implementations ────────────────────────────────────────────

type SendFn = (options: EmailOptions, resolvedHtml: string, resolvedText: string) => Promise<EmailResult>;

/** Mock provider — logs to console, returns success */
const mockSend: SendFn = async (options, resolvedHtml, _resolvedText) => {
  const to = typeof options.to === 'string' ? options.to : JSON.stringify(options.to);
  logger.info(`📧 [MOCK EMAIL] To: ${to} | Subject: ${options.subject}`);
  logger.debug(`📧 [MOCK EMAIL] HTML length: ${resolvedHtml.length} chars`);
  return { success: true, messageId: `mock-${Date.now()}`, provider: 'mock' };
};

/** Resend provider — uses fetch (no external deps) */
const resendSend: SendFn = async (options, resolvedHtml, resolvedText) => {
  try {
    const toAddresses = normalizeRecipients(options.to);
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${config.fromName} <${options.from || config.from}>`,
        to: toAddresses,
        subject: options.subject,
        html: resolvedHtml,
        text: resolvedText,
        reply_to: options.replyTo || config.replyTo,
        cc: options.cc ? (Array.isArray(options.cc) ? options.cc : [options.cc]) : undefined,
        bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]) : undefined,
        headers: options.headers,
        tags: options.tags?.map((t) => ({ name: t, value: 'true' })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, provider: 'resend', error: `Resend API ${response.status}: ${error}` };
    }

    const result = await response.json() as { id: string };
    return { success: true, messageId: result.id, provider: 'resend' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, provider: 'resend', error: msg };
  }
};

/** SendGrid provider — uses fetch (no external deps) */
const sendgridSend: SendFn = async (options, resolvedHtml, resolvedText) => {
  try {
    const toAddresses = normalizeRecipients(options.to);
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: toAddresses.map((e) => ({ email: e })) }],
        from: { email: options.from || config.from, name: config.fromName },
        reply_to: (options.replyTo || config.replyTo) ? { email: options.replyTo || config.replyTo } : undefined,
        subject: options.subject,
        content: [
          { type: 'text/plain', value: resolvedText },
          { type: 'text/html', value: resolvedHtml },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, provider: 'sendgrid', error: `SendGrid API ${response.status}: ${error}` };
    }

    const messageId = response.headers.get('x-message-id') || `sg-${Date.now()}`;
    return { success: true, messageId, provider: 'sendgrid' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, provider: 'sendgrid', error: msg };
  }
};

/** SMTP provider — requires nodemailer (lazy-loaded) */
const smtpSend: SendFn = async (options, resolvedHtml, resolvedText) => {
  try {
    // Lazy-load nodemailer only when SMTP is configured
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodemailer = await import(/* webpackIgnore: true */ 'nodemailer' as string) as any;
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpSecure,
      auth: config.smtpUser ? { user: config.smtpUser, pass: config.smtpPass } : undefined,
    });

    const toAddresses = normalizeRecipients(options.to);
    const result = await transporter.sendMail({
      from: `"${config.fromName}" <${options.from || config.from}>`,
      to: toAddresses.join(', '),
      subject: options.subject,
      text: resolvedText,
      html: resolvedHtml,
      replyTo: options.replyTo || config.replyTo,
      cc: options.cc,
      bcc: options.bcc,
      priority: options.priority,
      headers: options.headers,
    });

    return { success: true, messageId: result.messageId, provider: 'smtp' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, provider: 'smtp', error: msg };
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────

function normalizeRecipients(to: EmailOptions['to']): string[] {
  if (typeof to === 'string') return [to];
  if (Array.isArray(to)) {
    return to.map((t) => (typeof t === 'string' ? t : t.email));
  }
  return [to.email];
}

function interpolateSubject(subject: string, data?: Record<string, unknown>): string {
  if (!data) return subject;
  return subject.replace(/\{\{(\w+)\}\}/g, (_, key) => String(data[key] ?? ''));
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Email Service Class ────────────────────────────────────────────────

class EmailService {
  private sendFn: SendFn;
  private _sent = 0;
  private _failed = 0;

  constructor() {
    switch (config.provider) {
      case 'resend':
        this.sendFn = resendSend;
        logger.info('📧 Email provider: Resend');
        break;
      case 'sendgrid':
        this.sendFn = sendgridSend;
        logger.info('📧 Email provider: SendGrid');
        break;
      case 'smtp':
        this.sendFn = smtpSend;
        logger.info(`📧 Email provider: SMTP (${config.smtpHost}:${config.smtpPort})`);
        break;
      default:
        this.sendFn = mockSend;
        logger.warn('📧 Email provider: MOCK — set RESEND_API_KEY, SENDGRID_API_KEY, or SMTP_HOST for real emails');
    }
  }

  /** Send an email. If template is specified, html is auto-generated from template + data. */
  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      // Resolve template → HTML
      let html = options.html || '';
      let subject = options.subject;

      if (options.template && TEMPLATES[options.template]) {
        const tpl = TEMPLATES[options.template];
        html = tpl.html(options.data || {});
        // Allow subject override, otherwise use template subject
        if (!options.subject || options.subject === tpl.subject) {
          subject = interpolateSubject(tpl.subject, options.data);
        } else {
          subject = interpolateSubject(options.subject, options.data);
        }
      } else {
        subject = interpolateSubject(subject, options.data);
      }

      // Generate text fallback
      const text = options.text || stripHtml(html);

      const result = await this.sendFn({ ...options, subject }, html, text);

      if (result.success) {
        this._sent++;
        logger.debug('Email sent', {
          to: typeof options.to === 'string' ? options.to : 'multiple',
          subject,
          provider: result.provider,
          messageId: result.messageId,
        });
      } else {
        this._failed++;
        logger.error('Email failed', {
          to: typeof options.to === 'string' ? options.to : 'multiple',
          subject,
          provider: result.provider,
          error: result.error,
        });
      }

      return result;
    } catch (err) {
      this._failed++;
      const msg = err instanceof Error ? err.message : String(err);
      logger.error('Email send error', { error: msg });
      return { success: false, provider: config.provider, error: msg };
    }
  }

  /** Send to multiple recipients with same template */
  async sendBulk(recipients: Array<{ to: string; data?: Record<string, unknown> }>, options: Omit<EmailOptions, 'to' | 'data'>): Promise<EmailResult[]> {
    const results: EmailResult[] = [];
    // Process sequentially to avoid rate limits
    for (const recipient of recipients) {
      const result = await this.send({
        ...options,
        to: recipient.to,
        data: recipient.data,
      });
      results.push(result);
    }
    return results;
  }

  /** Get stats for monitoring */
  getStats() {
    return {
      provider: config.provider,
      sent: this._sent,
      failed: this._failed,
      total: this._sent + this._failed,
    };
  }

  /** Check if email service is configured (non-mock) */
  isConfigured(): boolean {
    return config.provider !== 'mock';
  }

  /** Get available templates */
  getTemplates(): EmailTemplate[] {
    return Object.keys(TEMPLATES) as EmailTemplate[];
  }
}

// Singleton export
export const emailService = new EmailService();
export default emailService;
