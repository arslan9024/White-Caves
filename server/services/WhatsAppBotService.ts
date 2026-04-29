/**
 * WhatsApp Bot Service
 * WhatsApp integration using the official Meta Business API.
 * Delegates all message sending to MetaAPIClient.
 * Features: Message routing, lead capture, customer support
 */

import { createLogger } from '../utils/logger.js';
import { MetaAPIClient } from './whatsapp/metaAPI.js';

const log = createLogger('WhatsApp');

class WhatsAppBotService {
  private client: MetaAPIClient | null = null;

  constructor() {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_BOT_TOKEN;
    const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (accessToken && businessAccountId && phoneNumberId) {
      try {
        this.client = new MetaAPIClient({ accessToken, businessAccountId, phoneNumberId });
        log.info('WhatsApp Meta API client ready');
      } catch (err) {
        log.error('Failed to init MetaAPIClient:', err);
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        log.error(
          'CRITICAL: WHATSAPP_ACCESS_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID, and WHATSAPP_PHONE_NUMBER_ID must be set in production'
        );
      } else {
        log.warn('WhatsApp credentials not configured — message sending disabled');
      }
    }
  }

  /**
   * Initialize and verify WhatsApp bot connection
   */
  async initialize(): Promise<void> {
    if (!this.client) {
      throw new Error(
        'WhatsApp credentials not configured. Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_BUSINESS_ACCOUNT_ID, and WHATSAPP_PHONE_NUMBER_ID.'
      );
    }
    log.info('WhatsApp Bot initialized');
  }

  /**
   * Send a plain-text message to a phone number.
   * Returns the Meta message ID, or null when credentials are absent.
   */
  async sendMessage(phoneNumber: string, message: string): Promise<string | null> {
    if (!this.client) {
      log.warn(`sendMessage skipped (no credentials) to ${phoneNumber}`);
      return null;
    }
    try {
      const messageId = await this.client.sendMessage(phoneNumber, message);
      log.info(`Message sent to ${phoneNumber}, id=${messageId}`);
      return messageId;
    } catch (err) {
      log.error(`sendMessage failed for ${phoneNumber}:`, err);
      throw err;
    }
  }

  /**
   * Handle an incoming webhook message payload.
   */
  async handleIncomingMessage(data: { from?: string; body?: string; timestamp?: number }): Promise<void> {
    const { from, body } = data;
    log.info('Incoming message received', { from });
    if (from && body) {
      await this.processMessage(body, from);
    }
  }

  /**
   * Process message — auto-reply with a welcome message for now.
   */
  async processMessage(messageBody: string, senderPhone: string): Promise<void> {
    log.info(`Processing message from ${senderPhone}: "${messageBody?.slice(0, 80)}"`);

    const lowerBody = (messageBody || '').toLowerCase().trim();
    let reply: string;

    if (lowerBody.includes('property') || lowerBody.includes('villa') || lowerBody.includes('apartment')) {
      reply =
        'Thank you for your interest! Our property advisors are available 9 AM–10 PM Gulf time. Please share your requirements and we'll get back to you shortly.';
    } else if (lowerBody.includes('price') || lowerBody.includes('cost') || lowerBody.includes('budget')) {
      reply = 'We have properties across all price ranges in Dubai. Please call +971 56 361 6136 or visit whitecaves.ae for current listings and pricing.';
    } else {
      reply =
        'Hello! 👋 Welcome to White Caves Real Estate. How can we help you today? Type "property" to explore listings or call +971 56 361 6136.';
    }

    await this.sendMessage(senderPhone, reply);
  }

  /**
   * Send a pre-approved template message.
   */
  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    parameters?: Array<{ type: string; text: string }>
  ): Promise<string | null> {
    if (!this.client) {
      log.warn(`sendTemplateMessage skipped (no credentials) to ${phoneNumber}`);
      return null;
    }
    try {
      const paramTexts = parameters?.map((p) => p.text);
      const messageId = await this.client.sendTemplate(phoneNumber, templateName, paramTexts);
      log.info(`Template "${templateName}" sent to ${phoneNumber}, id=${messageId}`);
      return messageId;
    } catch (err) {
      log.error(`sendTemplateMessage failed for ${phoneNumber}:`, err);
      throw err;
    }
  }
}

export default new WhatsAppBotService();
