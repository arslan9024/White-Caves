import { prisma } from '../../database.js';
import { queueConversationForAssignment } from './queueManager.js';

export interface HandoffOptions {
  customerName?: string;
  intent?: string;
  sentiment?: string;
  entities?: string[];
  leadScore?: number;
  escalationReason?: string | null;
  budget?: number;
}

export const ESCALATION_KEYWORDS = [
  'human',
  'agent',
  'real person',
  'representative',
  'manager',
  'complaint',
  'lawyer',
  'support team',
  'speak to someone',
  'talk to someone',
  'talk to agent',
  'help',
  'مساعدة',
  'وكيل',
  'تحدث مع شخص',
  'موظف',
];

export function isHandoffKeyword(message: string): boolean {
  const lowerMsg = message.toLowerCase();
  return ESCALATION_KEYWORDS.some(kw => lowerMsg.includes(kw));
}

export function getHandoffMessage(content: string): string {
  const isArabic = /[\u0600-\u06FF]/.test(content);
  return isArabic
    ? 'نقوم الآن بتحويلك إلى أحد مستشاري وايتكيفز العقاريين لمساعدتك. سيتواصل معك أحد وكلائنا قريباً.'
    : 'I am connecting you with a White Caves property specialist right now. One of our agents will be with you shortly.';
}

export async function processHandoffTriggers(
  conversationId: string,
  customerPhone: string,
  content: string,
  confidence: number,
  unresolvedTurns: number,
  leadId?: string | null,
  options?: HandoffOptions
): Promise<boolean> {
  const keywordDetected = isHandoffKeyword(content);
  const intentEscalation = options?.intent === 'complaint' || options?.intent === 'legal_enquiry';
  const highBudgetEscalation = Boolean(options?.budget && options.budget >= 5_000_000);
  const explicitEscalationReason = Boolean(options?.escalationReason);

  const needsHandoff =
    confidence < 0.6 ||
    keywordDetected ||
    intentEscalation ||
    highBudgetEscalation ||
    explicitEscalationReason ||
    unresolvedTurns >= 3;

  if (needsHandoff) {
    let reasonText = 'Human handoff required for WhatsApp conversation.';
    if (keywordDetected) reasonText += ' Reason: Customer requested human agent';
    else if (intentEscalation) reasonText += ` Reason: Escalated intent (${options?.intent})`;
    else if (highBudgetEscalation) reasonText += ' Reason: VIP High-budget inquiry (AED 5M+)';
    else if (unresolvedTurns >= 3) reasonText += ' Reason: Unresolved turns >= 3';
    else if (confidence < 0.6) reasonText += ' Reason: Low NLP confidence';
    else if (options?.escalationReason) reasonText += ` Reason: ${options.escalationReason}`;

    const contextPacket = {
      conversationId,
      customerPhone,
      customerName: options?.customerName || null,
      leadId: leadId || null,
      leadScore: options?.leadScore || 50,
      intent: options?.intent || 'general_inquiry',
      confidence,
      sentiment: options?.sentiment || 'neutral',
      entities: options?.entities || [],
      reason: reasonText,
      escalationReason:
        options?.escalationReason ||
        (keywordDetected
          ? 'customer_requested_human'
          : intentEscalation
            ? 'intent_requires_agent'
            : confidence < 0.6
              ? 'low_intent_confidence'
              : 'unresolved_turns'),
      lastMessage: content,
      timestamp: new Date().toISOString(),
    };

    // 1. Create CRM agent task with Context Packet
    await prisma.activity.create({
      data: {
        type: 'task',
        action: 'requires_human',
        description: reasonText,
        leadId: leadId || undefined,
        metadata: contextPacket,
      },
    });

    // 2. Queue conversation for agent assignment with priority
    try {
      if (prisma.nadiaConversationQueue) {
        await queueConversationForAssignment(conversationId, reasonText, {
          source: 'whatsapp_webhook',
          messagePreview: content.slice(0, 150),
          classification: {
            intent: options?.intent,
            confidence,
            sentiment: options?.sentiment,
            entities: options?.entities,
            leadScore: options?.leadScore,
            escalationReason: contextPacket.escalationReason,
          },
        });
      }
    } catch (queueErr) {
      console.warn('[HandoffManager] Queue assignment skipped or unavailable:', queueErr);
    }

    // 3. Update conversation status
    await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        status: 'assigned_to_agent',
        ...(leadId && { leadId }),
        ...(options?.intent && { intent: options.intent }),
        ...(options?.leadScore !== undefined && { leadScore: options.leadScore }),
        routedAt: new Date(),
      },
    });

    return true;
  }

  return false;
}
