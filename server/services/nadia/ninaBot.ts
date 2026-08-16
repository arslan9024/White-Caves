/**
 * Nina WhatsApp Bot Core Service — Wave 37 (REQ-WA-004)
 *
 * Provides high-level entry points for:
 * 1. Incoming WhatsApp message processing (intent, language detection EN/AR, confidence scoring)
 * 2. Property inquiry & viewing booking qualification flows
 * 3. Escalation decisioning (< 60% confidence or explicit human trigger)
 * 4. Automatic lead creation in Clara CRM upon pre-qualification completion
 */

import { generateWhatsAppAutoResponse } from './whatsappAssistant.js';
import { prisma } from '../../database.js';
import logger from '../../utils/logger.js';

export interface NinaMessageContext {
  senderPhone: string;
  senderName?: string;
  messageText: string;
  conversationId?: string;
}

export interface NinaProcessingResponse {
  intent: string;
  confidence: number;
  replyText: string;
  shouldEscalate: boolean;
  escalationReason: string | null;
  leadId?: string | null;
}

/**
 * Main Nina message handler for incoming WhatsApp messages
 */
export async function processNinaMessage(ctx: NinaMessageContext): Promise<NinaProcessingResponse> {
  const { senderPhone, senderName, messageText } = ctx;

  const responseObj = generateWhatsAppAutoResponse({ message: messageText, customerName: senderName });
  const classification = responseObj.classification;

  // Check language (Arabic detection)
  const isArabic = /[\u0600-\u06FF]/.test(messageText);

  let replyText = responseObj.response;
  if (isArabic) {
    replyText = `أهلاً بك في وايتكيفز للعقارات! 🏰 كيف يمكننا مساعدتك اليوم في بحثك عن العقارات؟`;
  }

  let createdLeadId: string | null = null;

  // If message indicates a purchase/rental inquiry with valid budget or property type, create/update lead in CRM
  if (classification.leadScore >= 20) {
    createdLeadId = await autoCreateLeadFromConversation({
      phone: senderPhone,
      name: senderName || 'WhatsApp Lead',
      source: 'WhatsApp Nina Bot',
      score: classification.leadScore,
      notes: `Inquiry text: "${messageText.substring(0, 100)}..."`,
    });
  }

  logger.info('[NinaBot] processed message', {
    senderPhone,
    intent: classification.intent,
    confidence: classification.confidence,
    shouldEscalate: classification.shouldEscalate,
    leadId: createdLeadId,
  });

  return {
    intent: classification.intent,
    confidence: classification.confidence,
    replyText,
    shouldEscalate: classification.shouldEscalate,
    escalationReason: classification.escalationReason,
    leadId: createdLeadId,
  };
}

export interface AutoLeadInput {
  phone: string;
  name: string;
  source: string;
  score: number;
  notes?: string;
}

/**
 * Auto-create or update lead record in Clara CRM from pre-qualification conversation
 */
export async function autoCreateLeadFromConversation(input: AutoLeadInput): Promise<string> {
  const { phone, name, source, score, notes } = input;

  const existing = await prisma.lead.findFirst({
    where: { phone },
  });

  if (existing) {
    const updated = await prisma.lead.update({
      where: { id: existing.id },
      data: {
        score: Math.max(existing.score, score),
        notes: notes ? `${existing.notes || ''}\n${notes}` : existing.notes,
      },
    });
    return updated.id;
  }

  const created = await prisma.lead.create({
    data: {
      name,
      phone,
      source,
      score,
      status: 'new',
      notes,
    },
  });

  return created.id;
}
