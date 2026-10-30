import { createMetaAPIClient, MetaAPIClient } from '../../services/whatsapp/metaAPI.js';

let metaClient: MetaAPIClient | null = null;

export function getMetaClient(): MetaAPIClient {
  if (!metaClient) {
    const config = {
      accessToken:
        process.env.META_ACCESS_TOKEN ||
        process.env.META_WA_ACCESS_TOKEN ||
        process.env.WHATSAPP_ACCESS_TOKEN ||
        '',
      businessAccountId: process.env.META_BUSINESS_ACCOUNT_ID || '',
      phoneNumberId:
        process.env.META_PHONE_NUMBER_ID ||
        process.env.META_WA_PHONE_NUMBER_ID ||
        process.env.WHATSAPP_PHONE_NUMBER_ID ||
        '',
      webhookVerifyToken:
        process.env.META_WEBHOOK_VERIFY_TOKEN ||
        process.env.WHATSAPP_VERIFY_TOKEN ||
        '',
    };

    if (!config.accessToken || !config.businessAccountId || !config.phoneNumberId) {
      console.warn('[Meta Webhook] Meta API not fully configured - check environment variables');
    }

    metaClient = createMetaAPIClient(config);
  }

  return metaClient;
}
