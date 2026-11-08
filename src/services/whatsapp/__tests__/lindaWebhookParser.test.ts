import { describe, it, expect } from 'vitest';
import { parseWhatsAppWebhook, MetaWebhookEntry } from '../lindaWebhookParser';

describe('Linda WhatsApp Webhook & Intent Parser Engine', () => {
  it('correctly parses an incoming VIP Penthouse inquiry', () => {
    const rawWebhook: MetaWebhookEntry = {
      id: 'WHATSAPP_EVENT_001',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '+971501234567',
              phone_number_id: 'PN_9901'
            },
            contacts: [
              {
                profile: { name: 'His Excellency Sheikh Mansoor' },
                wa_id: '971501234567'
              }
            ],
            messages: [
              {
                id: 'wamid.HBgLMzk3MTUwMTIzNDU2NwUCABEYEjA=',
                from: '971501234567',
                timestamp: '1731056400',
                type: 'text',
                text: {
                  body: 'Hello Linda, I am interested in acquiring a luxury 15M AED penthouse in Palm Jumeirah.'
                }
              }
            ]
          }
        }
      ]
    };

    const parsed = parseWhatsAppWebhook(rawWebhook);
    expect(parsed).not.toBeNull();
    expect(parsed?.intent).toBe('VIP_PURCHASE');
    expect(parsed?.vipConfidenceScore).toBeGreaterThanOrEqual(0.9);
    expect(parsed?.extractedParameters.budgetAed).toBe(15_000_000);
    expect(parsed?.extractedParameters.propertyType).toBe('PENTHOUSE');
    expect(parsed?.extractedParameters.communities).toContain('Palm Jumeirah');
    expect(parsed?.senderName).toBe('His Excellency Sheikh Mansoor');
  });

  it('handles off-plan launch inquiries with payment plan mentions', () => {
    const rawWebhook: MetaWebhookEntry = {
      id: 'WHATSAPP_EVENT_002',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '+971509998877', phone_number_id: 'PN_9901' },
            messages: [
              {
                id: 'wamid.HBgLMzk3MTUwOTk5ODg3NwUCABEYEjB=',
                from: '971509998877',
                timestamp: '1731056500',
                type: 'text',
                text: {
                  body: 'Please send me details on the new off-plan launch in DAMAC Hills 2 with 70/30 payment plan.'
                }
              }
            ]
          }
        }
      ]
    };

    const parsed = parseWhatsAppWebhook(rawWebhook);
    expect(parsed?.intent).toBe('OFF_PLAN_LAUNCH');
    expect(parsed?.extractedParameters.communities).toContain('DAMAC Hills 2');
  });
});
