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
  private isConfigured = false;
  private maxSendRetries = 3;
  private baseRetryDelayMs = 300;
  private stats = {
    totalSendRequests: 0,
    messageSendRequests: 0,
    templateSendRequests: 0,
    successfulSends: 0,
    failedSends: 0,
    retryableFailureEvents: 0,
    nonRetryableFailureEvents: 0,
    retriesScheduled: 0,
    validationFailures: 0,
    skippedNoCredentials: 0,
    skippedNoClient: 0,
    lastFailureMessage: null as string | null,
  };

  constructor() {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_BOT_TOKEN;
    const businessAccountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    this.isConfigured = Boolean(accessToken && phoneNumberId);
    this.maxSendRetries = this.parsePositiveInt(process.env.WHATSAPP_MAX_SEND_RETRIES, 3, 1, 6);
    this.baseRetryDelayMs = this.parsePositiveInt(
      process.env.WHATSAPP_RETRY_BASE_DELAY_MS,
      300,
      0,
      5000
    );

    const strictWhatsAppRequired =
      process.env.WHATSAPP_STRICT_REQUIRED === 'true' ||
      process.env.WHATSAPP_STRICT_REQUIRED === '1';

    if (accessToken && phoneNumberId) {
      try {
        this.client = new MetaAPIClient({ accessToken, businessAccountId, phoneNumberId });
        log.info('WhatsApp Meta API client ready');
      } catch (err) {
        log.error('Failed to init MetaAPIClient:', err);
      }
    } else {
      if (process.env.NODE_ENV === 'production') {
        const message =
          'WHATSAPP_ACCESS_TOKEN (or WHATSAPP_BOT_TOKEN) and WHATSAPP_PHONE_NUMBER_ID are not configured; WhatsApp sending is disabled';

        if (strictWhatsAppRequired) {
          log.error(`CRITICAL: ${message} (WHATSAPP_STRICT_REQUIRED=true)`);
          throw new Error(`CRITICAL: ${message}`);
        }

        log.error(`${message} (continuing startup in degraded mode)`);
      } else {
        log.info('WhatsApp credentials not configured — message sending disabled in development');
      }
    }
  }

  /**
   * Initialize and verify WhatsApp bot connection
   */
  async initialize(): Promise<void> {
    if (!this.isConfigured) {
      throw new Error(
        'WhatsApp credentials not configured. Set WHATSAPP_ACCESS_TOKEN (or WHATSAPP_BOT_TOKEN) and WHATSAPP_PHONE_NUMBER_ID.'
      );
    }
    log.info('WhatsApp Bot initialized');
  }

  /**
   * Send a plain-text message to a phone number.
   * Sends message when client is available with retry/backoff on transient failures.
   */
  async sendMessage(phoneNumber: string, message: string): Promise<string | undefined> {
    this.stats.totalSendRequests += 1;
    this.stats.messageSendRequests += 1;

    try {
      this.assertValidPhoneNumber(phoneNumber);
      this.assertValidMessageBody(message);
    } catch (error) {
      this.stats.validationFailures += 1;
      this.recordSendFailure(error);
      throw error;
    }

    if (!this.isConfigured) {
      this.stats.skippedNoCredentials += 1;
      if (process.env.NODE_ENV === 'production') {
        log.warn(`sendMessage skipped (no credentials) to ${phoneNumber}`);
      } else {
        log.info(`sendMessage skipped (no credentials) to ${phoneNumber}`);
      }
      return undefined;
    }
    if (!this.client) {
      this.stats.skippedNoClient += 1;
      log.info(`sendMessage compatibility no-op for ${phoneNumber}`);
      return undefined;
    }

    try {
      const messageId = await this.sendWithRetry(
        () => this.client!.sendMessage(phoneNumber, message),
        `sendMessage:${phoneNumber}`
      );
      this.stats.successfulSends += 1;
      log.info(`Message sent to ${phoneNumber}, id=${messageId}`);
      return messageId;
    } catch (err) {
      this.recordSendFailure(err);
      log.error(`sendMessage failed for ${phoneNumber}:`, err);
      throw err;
    }
  }

  /**
   * Handle an incoming webhook message payload.
   */
  async handleIncomingMessage(data: {
    from?: string;
    body?: string;
    timestamp?: number;
  }): Promise<void> {
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

    if (
      lowerBody.includes('property') ||
      lowerBody.includes('villa') ||
      lowerBody.includes('apartment')
    ) {
      reply = `Thank you for your interest! Our property advisors are available 9 AM–10 PM Gulf time. Please share your requirements and we'll get back to you shortly.`;
    } else if (
      lowerBody.includes('price') ||
      lowerBody.includes('cost') ||
      lowerBody.includes('budget')
    ) {
      reply =
        'We have properties across all price ranges in Dubai. Please call +971 56 361 6136 or visit whitecaves.ae for current listings and pricing.';
    } else {
      reply = `Hello! 👋 Welcome to White Caves Real Estate. How can we help you today? Type "property" to explore listings or call +971 56 361 6136.`;
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
  ): Promise<string | undefined> {
    this.stats.totalSendRequests += 1;
    this.stats.templateSendRequests += 1;

    try {
      this.assertValidPhoneNumber(phoneNumber);
      this.assertValidTemplateName(templateName);
    } catch (error) {
      this.stats.validationFailures += 1;
      this.recordSendFailure(error);
      throw error;
    }

    if (!this.isConfigured) {
      this.stats.skippedNoCredentials += 1;
      if (process.env.NODE_ENV === 'production') {
        log.warn(`sendTemplateMessage skipped (no credentials) to ${phoneNumber}`);
      } else {
        log.info(`sendTemplateMessage skipped (no credentials) to ${phoneNumber}`);
      }
      return undefined;
    }
    if (!this.client) {
      this.stats.skippedNoClient += 1;
      log.info(`sendTemplateMessage compatibility no-op for ${phoneNumber}`);
      return undefined;
    }

    try {
      const paramTexts = parameters?.map(p => p.text);
      const messageId = await this.sendWithRetry(
        () => this.client!.sendTemplate(phoneNumber, templateName, paramTexts),
        `sendTemplateMessage:${templateName}:${phoneNumber}`
      );
      this.stats.successfulSends += 1;
      log.info(`Template "${templateName}" sent to ${phoneNumber}, id=${messageId}`);
      return messageId;
    } catch (err) {
      this.recordSendFailure(err);
      log.error(`sendTemplateMessage failed for ${phoneNumber}:`, err);
      throw err;
    }
  }

  public getStats(): {
    configured: boolean;
    clientReady: boolean;
    maxSendRetries: number;
    baseRetryDelayMs: number;
    totalSendRequests: number;
    messageSendRequests: number;
    templateSendRequests: number;
    successfulSends: number;
    failedSends: number;
    retryableFailureEvents: number;
    nonRetryableFailureEvents: number;
    retriesScheduled: number;
    validationFailures: number;
    skippedNoCredentials: number;
    skippedNoClient: number;
    lastFailureMessage: string | null;
    client: ReturnType<MetaAPIClient['getStats']> | null;
  } {
    return {
      configured: this.isConfigured,
      clientReady: Boolean(this.client),
      maxSendRetries: this.maxSendRetries,
      baseRetryDelayMs: this.baseRetryDelayMs,
      ...this.stats,
      client: this.client?.getStats() ?? null,
    };
  }

  private async sendWithRetry(
    operation: () => Promise<string>,
    operationLabel: string
  ): Promise<string> {
    let lastError: unknown;

    for (let attempt = 1; attempt <= this.maxSendRetries; attempt += 1) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        const retryable = this.isRetryableError(error);

        if (retryable) {
          this.stats.retryableFailureEvents += 1;
        } else {
          this.stats.nonRetryableFailureEvents += 1;
        }

        if (!retryable || attempt >= this.maxSendRetries) {
          break;
        }

        const delayMs = this.getRetryDelayMs(attempt);
        this.stats.retriesScheduled += 1;
        log.warn(
          `${operationLabel} attempt ${attempt}/${this.maxSendRetries} failed, retrying in ${delayMs}ms: ${this.getErrorMessage(error)}`
        );
        await this.delay(delayMs);
      }
    }

    throw lastError instanceof Error ? lastError : new Error(`${operationLabel} failed`);
  }

  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof Error)) {
      return true;
    }

    const normalized = error.message.toLowerCase();
    return (
      normalized.includes('timeout') ||
      normalized.includes('rate') ||
      normalized.includes('429') ||
      normalized.includes('503') ||
      normalized.includes('network') ||
      normalized.includes('econn')
    );
  }

  private getRetryDelayMs(attempt: number): number {
    if (process.env.NODE_ENV === 'test') {
      return 0;
    }

    return this.baseRetryDelayMs * attempt;
  }

  private parsePositiveInt(
    raw: string | undefined,
    fallback: number,
    min: number,
    max: number
  ): number {
    if (!raw) {
      return fallback;
    }

    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) {
      return fallback;
    }

    return Math.max(min, Math.min(max, parsed));
  }

  private assertValidPhoneNumber(phoneNumber: string): void {
    if (!phoneNumber || !phoneNumber.trim()) {
      throw new Error('phoneNumber is required');
    }
  }

  private assertValidMessageBody(message: string): void {
    if (!message || !message.trim()) {
      throw new Error('message body is required');
    }
  }

  private assertValidTemplateName(templateName: string): void {
    if (!templateName || !templateName.trim()) {
      throw new Error('templateName is required');
    }
  }

  private recordSendFailure(error: unknown): void {
    this.stats.failedSends += 1;
    this.stats.lastFailureMessage = this.getErrorMessage(error);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return typeof error === 'string' ? error : 'Unknown error';
  }

  private async delay(ms: number): Promise<void> {
    if (ms <= 0) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new WhatsAppBotService();
