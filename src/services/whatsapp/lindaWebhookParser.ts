/**
 * Linda WhatsApp Webhook Ingestion & Intent Parsing Engine
 * Domain: Linda WhatsApp AI CRM & Omnichannel Concierge
 * Standard: AEGIS V5.0 (TURING-LAW-000, Sub-10ms parsing)
 */

export interface MetaWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: 'whatsapp';
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: { name: string };
        wa_id: string;
      }>;
      messages?: Array<{
        from: string;
        id: string;
        timestamp: string;
        type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'interactive';
        text?: { body: string };
        audio?: { id: string; mime_type: string };
        document?: { id: string; filename: string; mime_type: string };
        interactive?: {
          type: string;
          button_reply?: { id: string; title: string };
          list_reply?: { id: string; title: string; description?: string };
        };
      }>;
    };
    field: string;
  }>;
}

export type BuyerIntent = 'VIP_PURCHASE' | 'OFF_PLAN_LAUNCH' | 'RENTAL_INQUIRY' | 'COMMERCIAL_INVESTMENT' | 'GENERAL_SUPPORT';

export interface ParsedWhatsAppPayload {
  messageId: string;
  from: string;
  senderName: string;
  timestamp: Date;
  type: string;
  textBody: string;
  intent: BuyerIntent;
  vipConfidenceScore: number;
  extractedParameters: {
    budgetAed?: number;
    communities?: string[];
    propertyType?: 'VILLA' | 'PENTHOUSE' | 'APARTMENT' | 'COMMERCIAL';
  };
}

const DUBAI_COMMUNITIES = [
  'Palm Jumeirah',
  'DAMAC Hills 2',
  'Dubai Hills Estate',
  'Downtown Dubai',
  'Dubai Marina',
  'Emirates Hills',
  'Jumeirah Golf Estates'
];

export function parseWhatsAppWebhook(entry: MetaWebhookEntry): ParsedWhatsAppPayload | null {
  const change = entry.changes?.[0]?.value;
  const message = change?.messages?.[0];
  if (!message) return null;

  const contact = change?.contacts?.[0];
  const senderName = contact?.profile?.name || 'Valued Client';
  const textBody = message.text?.body || message.interactive?.button_reply?.title || message.interactive?.list_reply?.title || '';

  const lower = textBody.toLowerCase();

  let intent: BuyerIntent = 'GENERAL_SUPPORT';
  let vipScore = 0.5;

  if (lower.includes('penthouse') || lower.includes('villa') || lower.includes('luxury') || lower.includes('million')) {
    intent = 'VIP_PURCHASE';
    vipScore = 0.95;
  } else if (lower.includes('off-plan') || lower.includes('launch') || lower.includes('payment plan')) {
    intent = 'OFF_PLAN_LAUNCH';
    vipScore = 0.85;
  } else if (lower.includes('rent') || lower.includes('ejari') || lower.includes('lease')) {
    intent = 'RENTAL_INQUIRY';
    vipScore = 0.7;
  } else if (lower.includes('commercial') || lower.includes('office') || lower.includes('yield') || lower.includes('roi')) {
    intent = 'COMMERCIAL_INVESTMENT';
    vipScore = 0.9;
  }

  const detectedCommunities = DUBAI_COMMUNITIES.filter(c => lower.includes(c.toLowerCase()));

  // Extract budget approximations e.g. 5M, 10M, 5,000,000
  let budgetAed: number | undefined;
  const millionMatch = textBody.match(/(\d+(\.\d+)?)\s*(m|million|milyon)/i);
  if (millionMatch) {
    budgetAed = parseFloat(millionMatch[1]) * 1_000_000;
  }

  let propertyType: 'VILLA' | 'PENTHOUSE' | 'APARTMENT' | 'COMMERCIAL' | undefined;
  if (lower.includes('villa')) propertyType = 'VILLA';
  else if (lower.includes('penthouse')) propertyType = 'PENTHOUSE';
  else if (lower.includes('apartment') || lower.includes('flat')) propertyType = 'APARTMENT';
  else if (lower.includes('office') || lower.includes('retail')) propertyType = 'COMMERCIAL';

  return {
    messageId: message.id,
    from: message.from,
    senderName,
    timestamp: new Date(parseInt(message.timestamp, 10) * 1000),
    type: message.type,
    textBody,
    intent,
    vipConfidenceScore: vipScore,
    extractedParameters: {
      budgetAed,
      communities: detectedCommunities.length > 0 ? detectedCommunities : undefined,
      propertyType
    }
  };
}
