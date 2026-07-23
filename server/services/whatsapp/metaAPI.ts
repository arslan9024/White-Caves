/**
 * Meta Business API Client - WhatsApp Business Official Integration
 * Handles: Message sending, media upload, webhook integration, status tracking
 * Requirements: Meta Business Account, WhatsApp Business App credentials
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

export interface MetaAPIConfig {
  accessToken: string; // Permanent access token from Meta
  businessAccountId?: string; // Optional: needed only for account-info lookup paths
  phoneNumberId: string; // WhatsApp Business Phone Number ID
  webhookVerifyToken?: string; // For webhook verification
  apiVersion?: string; // Default: v17.0
  timeout?: number; // Default: 30000ms
}

export interface SendMessagePayload {
  messaging_product: 'whatsapp';
  recipient_type: 'individual' | 'group';
  to: string; // Recipient phone number (prefixed with country code)
  type: 'text' | 'image' | 'document' | 'template';
  text?: {
    body: string;
  };
  image?: {
    link: string; // URL to image
  };
  document?: {
    link: string; // URL to document
  };
  template?: {
    name: string;
    language: { code: string };
    parameters?: {
      body: { parameters: Array<{ type: string; text?: string }> };
    };
  };
}

export interface MessageResponse {
  messages: Array<{
    id: string; // Message ID
    message_status: string;
  }>;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
}

export interface MessageStatus {
  id: string;
  status: 'accepted' | 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
  recipient_id?: string;
  error?: {
    code: number;
    message: string;
  };
}

export interface MediaUploadResponse {
  id: string; // Media ID
  url: string; // URL to access media
}

export interface WebhookEvent {
  entry: Array<{
    changes: Array<{
      value: {
        messaging_product: 'whatsapp';
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          type: string;
          text?: { body: string };
          image?: { id: string; mime_type: string };
          document?: { id: string; filename: string; mime_type: string };
          audio?: { id: string; mime_type: string };
          video?: { id: string; mime_type: string };
        }>;
        statuses?: Array<{
          id: string;
          status: MessageStatus['status'];
          timestamp: string;
          recipient_id: string;
          errors?: Array<{ code: number; message: string }>;
        }>;
      };
    }>;
  }>;
}

/**
 * Meta API Client
 */
export class MetaAPIClient {
  private client: AxiosInstance;
  private config: MetaAPIConfig;
  private readonly BASE_URL = 'https://graph.facebook.com';

  constructor(config: MetaAPIConfig) {
    if (!config.accessToken || !config.phoneNumberId) {
      throw new Error('Meta API config incomplete: accessToken and phoneNumberId required');
    }

    this.config = {
      apiVersion: 'v17.0',
      timeout: 30000,
      ...config,
    };

    this.client = axios.create({
      baseURL: `${this.BASE_URL}/${this.config.apiVersion}`,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Send text message
   */
  public async sendMessage(toPhoneNumber: string, messageText: string): Promise<string> {
    try {
      const { hasWhatsAppConsent } = await import('./consentManager.js');
      if (!(await hasWhatsAppConsent(toPhoneNumber))) {
        console.warn(`[Meta API] Blocked message to ${toPhoneNumber} due to opt-out status.`);
        return 'blocked_no_consent';
      }

      const payload: SendMessagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhoneNumber,
        type: 'text',
        text: {
          body: messageText,
        },
      };

      const response = await this.client.post<MessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      const messageId = response.data.messages[0]?.id;
      console.log(`[Meta API] Message sent: ${messageId} to ${toPhoneNumber}`);

      return messageId;
    } catch (error) {
      console.error('[Meta API] Error sending message:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send message with template
   */
  public async sendTemplate(
    toPhoneNumber: string,
    templateName: string,
    parameters?: string[]
  ): Promise<string> {
    try {
      const payload: SendMessagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          ...(parameters && {
            parameters: {
              body: {
                parameters: parameters.map(param => ({
                  type: 'text',
                  text: param,
                })),
              },
            },
          }),
        },
      };

      const response = await this.client.post<MessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return response.data.messages[0]?.id;
    } catch (error) {
      console.error('[Meta API] Error sending template:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send image
   */
  public async sendImage(toPhoneNumber: string, imageUrl: string): Promise<string> {
    try {
      const payload: SendMessagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhoneNumber,
        type: 'image',
        image: {
          link: imageUrl,
        },
      };

      const response = await this.client.post<MessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return response.data.messages[0]?.id;
    } catch (error) {
      console.error('[Meta API] Error sending image:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send document
   */
  public async sendDocument(
    toPhoneNumber: string,
    documentUrl: string,
    filename?: string
  ): Promise<string> {
    try {
      const payload: SendMessagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: toPhoneNumber,
        type: 'document',
        document: {
          link: documentUrl,
        },
      };

      const response = await this.client.post<MessageResponse>(
        `/${this.config.phoneNumberId}/messages`,
        payload
      );

      return response.data.messages[0]?.id;
    } catch (error) {
      console.error('[Meta API] Error sending document:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get message status
   */
  public async getMessageStatus(messageId: string): Promise<MessageStatus> {
    try {
      const response = await this.client.get<any>(`/${messageId}`);

      return {
        id: messageId,
        status: response.data.status,
        timestamp: response.data.timestamp,
        recipient_id: response.data.recipient_id,
        error: response.data.error,
      };
    } catch (error) {
      console.error('[Meta API] Error getting message status:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload media for reuse
   */
  public async uploadMedia(
    fileBuffer: Buffer,
    mimeType: string,
    filename: string
  ): Promise<MediaUploadResponse> {
    try {
      const formData = new FormData();
      const blob = new Blob([fileBuffer as unknown as BlobPart], { type: mimeType });
      formData.append('file', blob, filename);
      formData.append('type', mimeType);

      const response = await this.client.post<{ id: string }>(
        `/${this.config.phoneNumberId}/media`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return {
        id: response.data.id,
        url: `${this.BASE_URL}/${this.config.apiVersion}/${response.data.id}`,
      };
    } catch (error) {
      console.error('[Meta API] Error uploading media:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Download media
   */
  public async downloadMedia(mediaId: string): Promise<Buffer> {
    try {
      const response = await this.client.get(`/${mediaId}`, {
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('[Meta API] Error downloading media:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify webhook
   */
  public verifyWebhook(mode: string, challenge: string, verifyToken: string): string | null {
    if (mode === 'subscribe' && verifyToken === this.config.webhookVerifyToken) {
      console.log('[Meta API] Webhook verified');
      return challenge;
    }
    console.warn('[Meta API] Webhook verification failed');
    return null;
  }

  /**
   * Parse webhook event
   */
  public parseWebhookEvent(body: any): WebhookEvent {
    return body as WebhookEvent;
  }

  /**
   * Get business account info
   */
  public async getAccountInfo(): Promise<any> {
    try {
      if (!this.config.businessAccountId) {
        throw new Error('businessAccountId is required for getAccountInfo()');
      }

      const response = await this.client.get(`/${this.config.businessAccountId}`);
      return response.data;
    } catch (error) {
      console.error('[Meta API] Error getting account info:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get phone number info
   */
  public async getPhoneNumberInfo(): Promise<any> {
    try {
      const response = await this.client.get(`/${this.config.phoneNumberId}`);
      return response.data;
    } catch (error) {
      console.error('[Meta API] Error getting phone number info:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>;

      if (axiosError.response?.data?.error) {
        const errorData = axiosError.response.data.error;
        return new Error(
          `Meta API Error [${errorData.code}]: ${errorData.message || 'Unknown error'}`
        );
      }
    }

    return error instanceof Error ? error : new Error('Unknown error occurred');
  }

  /**
   * Get API statistics
   */
  public getStats(): {
    apiVersion: string;
    businessAccountId?: string;
    phoneNumberId: string;
  } {
    return {
      apiVersion: this.config.apiVersion!,
      businessAccountId: this.config.businessAccountId,
      phoneNumberId: this.config.phoneNumberId,
    };
  }
}

/**
 * Factory function
 */
export function createMetaAPIClient(config: MetaAPIConfig): MetaAPIClient {
  return new MetaAPIClient(config);
}
