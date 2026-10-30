import crypto from 'crypto';
import { prisma } from '../../database.js';
import { normalizePhone } from '../../services/whatsapp/whatsappUtils.js';
import { setWhatsAppConsent } from '../../services/whatsapp/consentManager.js';
import { classifyWhatsAppIntent } from '../../services/nadia/whatsappAssistant.js';
import { getSocketServer } from '../../services/socketServer.js';
import {
  getHandoffMessage,
  processHandoffTriggers,
} from '../../services/nadia/handoffManager.js';
import { getMetaClient } from './metaWebhookCommon.js';
import { generateBotReply } from './metaWebhookAutoResponder.js';

export async function handleIncomingMessage(
  message: { from: string },
  phoneNumberId: string,
  contactName?: string
): Promise<void> {
  try {
    const msg = message as any;
    const customerPhone = normalizePhone(msg.from) || msg.from;
    if (!customerPhone) {
      console.warn('[Meta Webhook] Ignoring inbound message with missing sender phone');
      return;
    }

    const messageType = msg.type || 'text';
    let content = msg.text?.body || '';

    if (!content && msg.interactive) {
      content =
        msg.interactive.button_reply?.title ||
        msg.interactive.button_reply?.id ||
        msg.interactive.list_reply?.title ||
        msg.interactive.list_reply?.id ||
        '';
    }
    if (!content && msg.button) {
      content = msg.button.text || msg.button.payload || '';
    }
    if (!content && (msg.image || msg.document || msg.video)) {
      content =
        msg.image?.caption ||
        msg.document?.caption ||
        msg.video?.caption ||
        `[${messageType.toUpperCase()}]`;
    }
    if (!content && msg.location) {
      content = `[LOCATION: ${msg.location.name || ''} ${msg.location.address || ''} (${msg.location.latitude}, ${msg.location.longitude})]`.trim();
    }
    if (!content) {
      content = `[${messageType.toUpperCase()}]`;
    }

    const timestampEpoch = Number.parseInt(String(msg.timestamp || ''), 10);
    const timestamp = Number.isFinite(timestampEpoch)
      ? new Date(timestampEpoch * 1000)
      : new Date();

    const contentHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
    const waMessageId =
      (msg.id as string | undefined) ||
      `meta-${customerPhone}-${messageType}-${String(msg.timestamp || 'na')}-${contentHash}`;

    console.log(`[Meta Webhook] Message from ${customerPhone}: ${content.substring(0, 80)}`);

    const existingMessage = await prisma.nadiaMessage.findFirst({
      where: { waMessageId },
      select: { id: true, conversationId: true },
    });

    if (existingMessage) {
      console.log(`[Meta Webhook] Duplicate message ignored: ${waMessageId}`);
      return;
    }

    const trimmed = content.trim().toUpperCase();
    if (trimmed === 'STOP') {
      await setWhatsAppConsent(customerPhone, false);
      try {
        await getMetaClient().sendMessage(
          customerPhone,
          'You have opted out of WhatsApp messages. Reply START to opt back in.'
        );
      } catch (err) {
        console.error('[Meta Webhook] Failed to send opt-out confirmation message:', err);
      }
      return;
    } else if (trimmed === 'START') {
      await setWhatsAppConsent(customerPhone, true);
      try {
        await getMetaClient().sendMessage(
          customerPhone,
          'You have opted back in to WhatsApp messages.'
        );
      } catch (err) {
        console.error('[Meta Webhook] Failed to send opt-in confirmation message:', err);
      }
      return;
    }

    let conversation = await prisma.nadiaConversation.findFirst({
      where: { customerPhone, status: { in: ['active', 'assigned_to_agent', 'in_bot_flow'] } },
      orderBy: { createdAt: 'desc' },
    });

    if (!conversation) {
      conversation = await prisma.nadiaConversation.create({
        data: {
          wabaId: phoneNumberId,
          customerPhone,
          status: 'active',
        },
      });
      console.log(`[Meta Webhook] New conversation created: ${conversation.id}`);
    }

    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [{ phone: customerPhone }, { phone: message.from }],
      },
      select: { id: true, status: true, source: true, score: true },
    });

    let leadId: string | null = existingLead?.id || null;
    if (!existingLead) {
      const createdLead = await prisma.lead.create({
        data: {
          name: contactName || `WhatsApp Lead ${customerPhone}`,
          phone: customerPhone,
          source: 'whatsapp',
          status: 'new',
          notes: `Auto-created from inbound WhatsApp message (${conversation.id})`,
        },
        select: { id: true },
      });
      leadId = createdLead.id;

      await prisma.activity.create({
        data: {
          type: 'lead',
          action: 'created',
          description: `Lead auto-created from WhatsApp inbound: ${customerPhone}`,
          leadId,
          metadata: {
            channel: 'META_API',
            conversationId: conversation.id,
          },
        },
      });
    }

    if (leadId && !conversation.leadId) {
      await prisma.nadiaConversation.update({
        where: { id: conversation.id },
        data: { leadId },
      });
      conversation.leadId = leadId;
    }

    const storedMessage = await prisma.nadiaMessage.create({
      data: {
        conversationId: conversation.id,
        waMessageId,
        direction: 'inbound',
        body: content,
        messageType,
        status: 'delivered',
        timestamp,
      },
    });

    const classification = classifyWhatsAppIntent(content);
    if (leadId && classification.leadScore > 0 && typeof (prisma.lead as any)?.update === 'function') {
      await prisma.lead
        .update({
          where: { id: leadId },
          data: {
            score: Math.max(existingLead?.score || 0, classification.leadScore),
          },
        })
        .catch(() => {});
    }

    getSocketServer()?.emitMetaMessage({
      id: storedMessage.id,
      conversationId: conversation.id,
      leadId: leadId ?? undefined,
      from: customerPhone,
      content,
      type: messageType,
      timestamp,
      nlp: {
        intent: classification.intent,
        score: classification.leadScore,
      },
    } as any);

    if (conversation.status === 'assigned_to_agent') {
      console.log(`[Meta Webhook] Conversation ${conversation.id} is with an agent. Routing message to human broker.`);
      await prisma.nadiaConversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });
      getSocketServer()?.emitConversationUpdated({
        conversationId: conversation.id,
        status: 'assigned_to_agent',
        intent: classification.intent,
        leadScore: classification.leadScore,
      });
      return;
    }

    const isHandoff = await processHandoffTriggers(
      conversation.id,
      customerPhone,
      content,
      classification.confidence,
      0,
      leadId,
      {
        customerName: contactName,
        intent: classification.intent,
        sentiment: classification.sentiment,
        entities: classification.entities,
        leadScore: classification.leadScore,
        escalationReason: classification.escalationReason,
      }
    );

    if (isHandoff) {
      const handoffText = getHandoffMessage(content);
      const handoffMsgId = await getMetaClient().sendMessage(customerPhone, handoffText);

      await prisma.nadiaMessage
        .create({
          data: {
            conversationId: conversation.id,
            waMessageId: handoffMsgId || `handoff-out-${Date.now()}`,
            direction: 'outbound',
            body: handoffText,
            messageType: 'text',
            status: 'sent',
            timestamp: new Date(),
          },
        })
        .catch(err => console.error(err));

      getSocketServer()?.emitConversationUpdated({
        conversationId: conversation.id,
        status: 'assigned_to_agent',
        intent: classification.intent,
        leadScore: classification.leadScore,
      });
      getSocketServer()?.emitMetaHandoff?.({
        conversationId: conversation.id,
        leadId: leadId || undefined,
        customerPhone,
        customerName: contactName,
        reason: classification.escalationReason || 'customer_requested_human',
        contextPacket: {
          intent: classification.intent,
          confidence: classification.confidence,
          sentiment: classification.sentiment,
          entities: classification.entities,
          leadScore: classification.leadScore,
        },
      });
    } else {
      const reply = await generateBotReply(content, contactName, conversation.id);
      const botMsgId = await getMetaClient().sendMessage(customerPhone, reply);

      await prisma.nadiaMessage
        .create({
          data: {
            conversationId: conversation.id,
            waMessageId: botMsgId || `meta-out-${Date.now()}`,
            direction: 'outbound',
            body: reply,
            messageType: 'text',
            status: 'sent',
            timestamp: new Date(),
          },
        })
        .catch(err => console.error(err));
    }

    await prisma.nadiaConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error handling message:', error);
  }
}

export async function handleStatusUpdate(status: { id?: string; status?: string }): Promise<void> {
  try {
    const waMessageId = status.id;
    const newStatus = status.status;

    if (!waMessageId || !newStatus) {
      console.warn('[Meta Webhook] Ignoring malformed status payload');
      return;
    }

    console.log(`[Meta Webhook] Status update: ${waMessageId} → ${newStatus}`);

    const existing = await prisma.nadiaMessage.findFirst({
      where: { waMessageId },
    });

    if (existing) {
      if (existing.status === newStatus) {
        console.log(`[Meta Webhook] Duplicate status ignored: ${waMessageId} already ${newStatus}`);
        return;
      }

      await prisma.nadiaMessage.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });
    }

    const st = status as any;
    if (newStatus === 'failed' && st.errors?.length) {
      console.error(`[Meta Webhook] Message ${waMessageId} failed:`, st.errors);
    }

    getSocketServer()?.emitMetaStatus({
      messageId: waMessageId,
      dbId: existing?.id,
      status: newStatus,
      timestamp: new Date(parseInt(st.timestamp || '0') * 1000),
      recipientId: st.recipient_id,
      errors: st.errors,
    });
  } catch (error) {
    console.error('[Meta Webhook] Error handling status:', error);
  }
}
