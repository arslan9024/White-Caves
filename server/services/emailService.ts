/**
 * Email Service — White Caves Email Automation
 * Provider: Resend (resend.com) with SendGrid/SMTP fallback awareness
 *
 * Phase 3B: Email Automation
 *
 * Features:
 * - Send transactional & marketing emails via Resend API
 * - Dev mode: log-only (no actual send) when RESEND_API_KEY is missing
 * - Branded HTML email templates with White Caves branding
 * - Delivery tracking via Resend webhooks
 * - Retry with exponential backoff
 */

import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

// ─── TYPES ──────────────────────────────────────────────────────────────

export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  tags?: Array<{ name: string; value: string }>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  devMode?: boolean;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// ─── CONFIGURATION ──────────────────────────────────────────────────────

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const DEFAULT_FROM = process.env.EMAIL_FROM || 'White Caves <noreply@whitecaves.com>';
const DEFAULT_REPLY_TO = process.env.EMAIL_REPLY_TO || 'support@whitecaves.com';
const IS_DEV = !RESEND_API_KEY || process.env.NODE_ENV === 'development';

// Lazy-init Resend client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

// ─── CORE SEND FUNCTION ─────────────────────────────────────────────────

/**
 * Send an email via Resend (or log in dev mode)
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  const {
    to,
    subject,
    text,
    html,
    from = DEFAULT_FROM,
    replyTo = DEFAULT_REPLY_TO,
    tags,
  } = options;

  const recipients = Array.isArray(to) ? to : [to];

  // Dev mode — log only
  if (IS_DEV) {
    logger.info(`[Email] DEV MODE — would send to: ${recipients.join(', ')}`);
    logger.info(`[Email]   Subject: ${subject}`);
    logger.info(`[Email]   Body: ${(text || '').substring(0, 100)}...`);
    return {
      success: true,
      messageId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      devMode: true,
    };
  }

  // Production — send via Resend
  const client = getResendClient();
  if (!client) {
    return { success: false, error: 'Resend client not initialized' };
  }

  try {
    const { data, error } = await client.emails.send({
      from,
      to: recipients,
      subject,
      text: text || '',
      html: html || text || '',
      reply_to: replyTo,
      tags,
    });

    if (error) {
      logger.error(`[Email] Resend error:`, error);
      return { success: false, error: error.message || 'Send failed' };
    }

    logger.info(`[Email] Sent to ${recipients.join(', ')} — ID: ${data?.id}`);
    return {
      success: true,
      messageId: data?.id || undefined,
    };
  } catch (err) {
    logger.error('[Email] Send exception:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

// ─── SEND WITH RETRY ────────────────────────────────────────────────────

/**
 * Send with exponential backoff retry (max 3 attempts)
 */
export async function sendEmailWithRetry(
  options: EmailOptions,
  maxRetries = 3,
): Promise<EmailResult> {
  let lastResult: EmailResult = { success: false, error: 'No attempts made' };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    lastResult = await sendEmail(options);
    if (lastResult.success) return lastResult;

    if (attempt < maxRetries) {
      const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
      logger.warn(`[Email] Retry ${attempt}/${maxRetries} in ${delayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return lastResult;
}

// ─── HTML EMAIL WRAPPER ─────────────────────────────────────────────────

/**
 * Wrap content in branded White Caves HTML email layout
 */
export function wrapInBrandedTemplate(
  bodyContent: string,
  options?: { preheader?: string },
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>White Caves Real Estate</title>
  <style>
    body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f9; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 24px; text-align: center; }
    .header h1 { color: #c9a84c; font-size: 24px; margin: 0; font-weight: 600; letter-spacing: 1px; }
    .header p { color: #a0a8b4; font-size: 12px; margin: 8px 0 0; text-transform: uppercase; letter-spacing: 2px; }
    .body { padding: 32px 24px; color: #2d3748; line-height: 1.6; font-size: 15px; }
    .body h2 { color: #1a1a2e; font-size: 20px; margin-top: 0; }
    .body a { color: #c9a84c; text-decoration: none; font-weight: 600; }
    .cta { display: inline-block; background: #c9a84c; color: #1a1a2e !important; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; margin: 16px 0; }
    .footer { background: #f8f9fa; padding: 20px 24px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; }
    .footer a { color: #c9a84c; text-decoration: none; }
    .preheader { display: none !important; max-height: 0; overflow: hidden; mso-hide: all; }
  </style>
</head>
<body>
  ${options?.preheader ? `<div class="preheader">${options.preheader}</div>` : ''}
  <div class="container">
    <div class="header">
      <h1>White Caves</h1>
      <p>Real Estate Excellence</p>
    </div>
    <div class="body">
      ${bodyContent}
    </div>
    <div class="footer">
      <p>White Caves Real Estate LLC · Dubai, UAE</p>
      <p><a href="https://whitecaves.com">whitecaves.com</a> · <a href="tel:+97143456789">+971 4 345 6789</a></p>
      <p style="margin-top: 12px; font-size: 11px; color: #a0aec0;">
        You're receiving this because you expressed interest in White Caves properties.
        <a href="{{unsubscribe_url}}">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

// ─── PREDEFINED EMAIL TEMPLATES ─────────────────────────────────────────

export const EMAIL_TEMPLATES = {
  welcome: (name: string): EmailTemplate => ({
    subject: `Welcome to White Caves, ${name}!`,
    text: `Hello ${name},\n\nWelcome to White Caves Real Estate. We're excited to help you find your perfect property in Dubai.\n\nYour dedicated team is ready to assist you.\n\nBest regards,\nWhite Caves Team`,
    html: wrapInBrandedTemplate(`
      <h2>Welcome, ${name}!</h2>
      <p>We're thrilled to have you join White Caves Real Estate. Our team is ready to help you find your perfect property in Dubai's most sought-after locations.</p>
      <p>Here's what you can expect:</p>
      <ul>
        <li>🏠 Curated property selections matching your preferences</li>
        <li>📊 Market insights and investment analysis</li>
        <li>🤝 Dedicated agent support throughout your journey</li>
        <li>📱 WhatsApp updates on new listings</li>
      </ul>
      <a href="https://whitecaves.com/dashboard" class="cta">Explore Properties →</a>
    `, { preheader: `Welcome aboard, ${name}! Your property journey starts here.` }),
  }),

  propertyAlert: (name: string, propertyTitle: string, area: string, price: string): EmailTemplate => ({
    subject: `New listing in ${area}: ${propertyTitle}`,
    text: `Hi ${name},\n\nA new property matching your criteria is now available:\n\n${propertyTitle}\nArea: ${area}\nPrice: ${price}\n\nVisit whitecaves.com for details.\n\nBest,\nWhite Caves Team`,
    html: wrapInBrandedTemplate(`
      <h2>New Property Match!</h2>
      <p>Hi ${name}, a property matching your criteria just became available:</p>
      <div style="background:#f7f8fa; padding:16px; border-radius:8px; margin:16px 0; border-left:4px solid #c9a84c;">
        <strong style="font-size:17px;">${propertyTitle}</strong><br>
        <span style="color:#718096;">📍 ${area}</span><br>
        <span style="color:#c9a84c; font-size:18px; font-weight:600;">${price}</span>
      </div>
      <a href="https://whitecaves.com/properties" class="cta">View Property →</a>
    `, { preheader: `New listing: ${propertyTitle} in ${area} — ${price}` }),
  }),

  viewingConfirmation: (name: string, propertyTitle: string, dateTime: string, agentName: string): EmailTemplate => ({
    subject: `Viewing Confirmed: ${propertyTitle}`,
    text: `Hi ${name},\n\nYour viewing is confirmed.\n\nProperty: ${propertyTitle}\nDate/Time: ${dateTime}\nAgent: ${agentName}\n\nSee you there!\nWhite Caves Team`,
    html: wrapInBrandedTemplate(`
      <h2>Viewing Confirmed ✅</h2>
      <p>Hi ${name}, your property viewing has been confirmed:</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:8px 0; color:#718096;">Property</td><td style="padding:8px 0; font-weight:600;">${propertyTitle}</td></tr>
        <tr><td style="padding:8px 0; color:#718096;">Date & Time</td><td style="padding:8px 0; font-weight:600;">${dateTime}</td></tr>
        <tr><td style="padding:8px 0; color:#718096;">Your Agent</td><td style="padding:8px 0; font-weight:600;">${agentName}</td></tr>
      </table>
      <p>Your agent will meet you at the property. Please arrive 5 minutes early.</p>
      <a href="https://whitecaves.com/viewings" class="cta">Manage Viewings →</a>
    `, { preheader: `Your viewing for ${propertyTitle} is confirmed for ${dateTime}` }),
  }),

  documentReady: (name: string, documentType: string, documentTitle: string): EmailTemplate => ({
    subject: `Your ${documentType} is Ready for Review`,
    text: `Hi ${name},\n\nYour document "${documentTitle}" (${documentType}) is ready for review.\n\nPlease log in to your White Caves portal to view and sign it.\n\nBest,\nWhite Caves Team`,
    html: wrapInBrandedTemplate(`
      <h2>Document Ready 📄</h2>
      <p>Hi ${name}, your document is ready for review:</p>
      <div style="background:#f7f8fa; padding:16px; border-radius:8px; margin:16px 0;">
        <strong>${documentTitle}</strong><br>
        <span style="color:#718096;">Type: ${documentType}</span>
      </div>
      <p>Please review and sign the document at your earliest convenience.</p>
      <a href="https://whitecaves.com/documents" class="cta">Review Document →</a>
    `),
  }),

  paymentReminder: (name: string, amount: string, description: string, dueDate: string): EmailTemplate => ({
    subject: `Payment Reminder: ${amount} due ${dueDate}`,
    text: `Dear ${name},\n\nFriendly reminder: your payment of ${amount} for ${description} is due on ${dueDate}.\n\nPlease contact us if you need assistance.\n\nBest,\nWhite Caves Team`,
    html: wrapInBrandedTemplate(`
      <h2>Payment Reminder</h2>
      <p>Dear ${name}, a friendly reminder about your upcoming payment:</p>
      <div style="background:#fff5f5; padding:16px; border-radius:8px; margin:16px 0; border-left:4px solid #e53e3e;">
        <strong style="font-size:20px; color:#e53e3e;">${amount}</strong><br>
        <span style="color:#718096;">${description}</span><br>
        <span style="color:#2d3748; font-weight:600;">Due: ${dueDate}</span>
      </div>
      <p>Please ensure timely payment to avoid any service disruption.</p>
      <a href="https://whitecaves.com/payments" class="cta">Make Payment →</a>
    `),
  }),

  reraExpiry: (name: string, brnNumber: string, expiryDate: string, daysRemaining: string): EmailTemplate => ({
    subject: `⚠️ RERA License Expiry Alert: BRN ${brnNumber}`,
    text: `Dear ${name},\n\nYour RERA license (BRN ${brnNumber}) expires in ${daysRemaining} days on ${expiryDate}.\n\nPlease initiate renewal immediately.\n\nWhite Caves Compliance Team`,
    html: wrapInBrandedTemplate(`
      <h2>⚠️ RERA License Expiry Alert</h2>
      <p>Dear ${name}, your RERA license requires attention:</p>
      <div style="background:#fffbeb; padding:16px; border-radius:8px; margin:16px 0; border-left:4px solid #d69e2e;">
        <strong>BRN: ${brnNumber}</strong><br>
        <span style="color:#d69e2e; font-size:18px; font-weight:600;">Expires in ${daysRemaining} days</span><br>
        <span style="color:#718096;">Expiry Date: ${expiryDate}</span>
      </div>
      <p>Please initiate renewal to avoid service disruption. Our compliance team can assist.</p>
      <a href="https://whitecaves.com/compliance" class="cta">Start Renewal →</a>
    `),
  }),
};

// ─── EMAIL STATISTICS ───────────────────────────────────────────────────

let emailStats = {
  sent: 0,
  failed: 0,
  devMode: 0,
};

export function getEmailStats() {
  return { ...emailStats, isDevMode: IS_DEV };
}

// Wrap sendEmail to track stats
const originalSendEmail = sendEmail;
export async function sendEmailTracked(options: EmailOptions): Promise<EmailResult> {
  const result = await originalSendEmail(options);
  if (result.devMode) emailStats.devMode++;
  else if (result.success) emailStats.sent++;
  else emailStats.failed++;
  return result;
}
