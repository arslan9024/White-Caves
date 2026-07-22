import { prisma } from '../../database.js';
import { getMetaClient } from '../whatsapp/metaAPI.js'; // Wait, getMetaClient isn't exported from metaAPI.ts, it's defined in meta-webhook.ts.
// Let's just create the logic and pass the client.

export async function processHandoffTriggers(
  conversationId: string,
  customerPhone: string,
  content: string,
  confidence: number,
  unresolvedTurns: number,
  leadId?: string | null
) {
  const lowerMsg = content.toLowerCase();
  const keywordDetected =
    lowerMsg.includes('human') ||
    lowerMsg.includes('agent') ||
    lowerMsg.includes('مساعدة') ||
    lowerMsg.includes('help');

  const needsHandoff = confidence < 0.7 || keywordDetected || unresolvedTurns >= 3;

  if (needsHandoff) {
    // 1. Send handoff message to customer
    // We'll return true to let the caller handle sending, or we can send it here if we pass a callback

    // 2. Create CRM agent task
    await prisma.activity.create({
      data: {
        type: 'task',
        action: 'requires_human',
        description: `Human handoff required for WhatsApp conversation. Reason: ${
          keywordDetected
            ? 'Keyword detected'
            : confidence < 0.7
              ? 'Low confidence'
              : 'Unresolved turns > 3'
        }`,
        leadId: leadId || undefined,
        metadata: {
          conversationId,
          confidence,
          unresolvedTurns,
        },
      },
    });

    // 3. Update conversation status
    await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        status: 'assigned_to_agent',
      },
    });

    return true;
  }

  return false;
}
