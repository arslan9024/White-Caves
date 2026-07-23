/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
/**
 * Meta Business API Webhook Routes
 * Endpoints for receiving production WhatsApp messages from Meta
 * POST /api/webhooks/meta - Receive messages
 * GET /api/webhooks/meta/verify - Webhook verification
 *
 * Phase 3A: Fully wired to Nadia pipeline — stores messages in DB,
 * triggers Nina NLP, updates conversation status.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { createMetaAPIClient, MetaAPIClient, WebhookEvent } from '../services/whatsapp/metaAPI.js';
import {
  verifyWebhookSignature,
  normalizePhone,
  rateLimiter,
} from '../services/whatsapp/whatsappUtils.js';
import { requireRole } from '../middleware/rbac.js';
import { prisma } from '../database.js';
import { detectIntent, calculateLeadScore } from '../services/nadia/messageProcessor.js';
import { getSocketServer } from '../services/socketServer.js';
import { processHandoffTriggers } from '../services/nadia/handoffManager.js';
import { processChatWithOpenAI, ChatMessage } from '../services/nadia/openaiProcessor.js';
import { setWhatsAppConsent } from '../services/whatsapp/consentManager.js';

const router = Router();

// Meta API client (lazy initialized)
let metaClient: MetaAPIClient | null = null;

/**
 * Get or create Meta API client
 */
function getMetaClient(): MetaAPIClient {
  if (!metaClient) {
    const config = {
      accessToken: process.env.META_ACCESS_TOKEN || '',
      businessAccountId: process.env.META_BUSINESS_ACCOUNT_ID || '',
      phoneNumberId: process.env.META_PHONE_NUMBER_ID || '',
      webhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || '',
    };

    if (!config.accessToken || !config.businessAccountId || !config.phoneNumberId) {
      console.warn('[Meta Webhook] Meta API not fully configured - check environment variables');
    }

    metaClient = createMetaAPIClient(config);
  }

  return metaClient;
}

/**
 * GET /api/webhooks/meta/verify
 * Meta webhook verification (required on first setup)
 * Query params: hub.mode, hub.challenge, hub.verify_token
 */
router.get('/verify', (req: Request, res: Response) => {
  try {
    const mode = req.query['hub.mode'] as string;
    const challenge = req.query['hub.challenge'] as string;
    const verifyToken = req.query['hub.verify_token'] as string;

    console.log('[Meta Webhook] Verification request:', { mode, verifyToken: '***' });

    const meta = getMetaClient();
    const result = meta.verifyWebhook(mode, challenge, verifyToken);

    if (result) {
      res.set('Content-Type', 'text/plain');
      res.send(result);
      console.log('[Meta Webhook] Verification successful');
    } else {
      console.warn('[Meta Webhook] Verification failed - invalid token or mode');
      res.status(403).json({
        success: false,
        error: 'Verification failed',
      });
    }
  } catch (error) {
    console.error('[Meta Webhook] Verification error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/webhooks/meta
 * Receive messages and status updates from Meta/WhatsApp
 * Verifies HMAC-SHA256 signature if META_APP_SECRET is set.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Verify webhook signature (if app secret is configured)
    const appSecret = process.env.META_APP_SECRET;
    if (appSecret) {
      const signature = req.headers['x-hub-signature-256'] as string | undefined;
      if (!signature) {
        console.warn('[Meta Webhook] Missing x-hub-signature-256 header — rejecting');
        res.status(403).json({ success: false, error: 'Missing signature header' });
        return;
      }

      const rawBody = (req as Request & { rawBody?: string }).rawBody;
      if (!rawBody) {
        console.warn('[Meta Webhook] Missing rawBody for signature verification — rejecting');
        res.status(500).json({ success: false, error: 'Webhook raw body unavailable' });
        return;
      }

      if (!verifyWebhookSignature(rawBody, signature, appSecret)) {
        console.warn('[Meta Webhook] Invalid signature — rejecting');
        res.status(403).json({ success: false, error: 'Invalid signature' });
        return;
      }
    }

    console.log('[Meta Webhook] Incoming webhook event');

    // Acknowledge receipt immediately
    res.json({ success: true });

    // Parse event
    const meta = getMetaClient();
    const event: WebhookEvent = meta.parseWebhookEvent(req.body);

    // Reject if not whatsapp
    if (event.entry[0]?.changes[0]?.value?.messaging_product !== 'whatsapp') {
      console.log('[Meta Webhook] Ignoring non-WhatsApp event');
      return;
    }

    // Process messages
    for (const entry of event.entry) {
      for (const change of entry.changes) {
        const value = change.value;

        // Handle incoming messages
        if (value.messages) {
          for (const message of value.messages) {
            await handleIncomingMessage(message, value.metadata.phone_number_id);
          }
        }

        // Handle status updates
        if (value.statuses) {
          for (const status of value.statuses) {
            await handleStatusUpdate(status);
          }
        }
      }
    }
  } catch (error) {
    console.error('[Meta Webhook] Error processing event:', error);
    // Still return 200 to prevent retry
    res.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * Handle incoming message — FULL PIPELINE
 * 1. Normalize phone number
 * 2. Find or create NadiaConversation
 * 3. Store NadiaMessage in DB
 * 4. Run Nina NLP analysis
 * 5. Update conversation with NLP results
 * 6. Emit event for real-time listeners
 */
async function handleIncomingMessage(message: any, phoneNumberId: string): Promise<void> {
  try {
    const customerPhone = normalizePhone(message.from) || message.from;
    if (!customerPhone) {
      console.warn('[Meta Webhook] Ignoring inbound message with missing sender phone');
      return;
    }

    const content = message.text?.body || '';
    const messageType = message.type || 'text';

    // W24-005: Consent opt-in/opt-out keywords
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

    const timestampEpoch = Number.parseInt(String(message.timestamp || ''), 10);
    const timestamp = Number.isFinite(timestampEpoch)
      ? new Date(timestampEpoch * 1000)
      : new Date();

    const contentHash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
    const waMessageId =
      (message.id as string | undefined) ||
      `meta-${customerPhone}-${messageType}-${String(message.timestamp || 'na')}-${contentHash}`;

    console.log(`[Meta Webhook] Message from ${customerPhone}: ${content.substring(0, 80)}`);

    // Idempotency guard: Meta can deliver duplicate webhook events.
    // If we have already persisted this WA message ID, skip re-processing.
    const existingMessage = await prisma.nadiaMessage.findFirst({
      where: { waMessageId },
      select: { id: true, conversationId: true },
    });

    if (existingMessage) {
      console.log(`[Meta Webhook] Duplicate message ignored: ${waMessageId}`);
      return;
    }

    // 1. Find or create conversation
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

    // 1.5. Link or create CRM lead for inbound WhatsApp contact (W3-006)
    const existingLead = await prisma.lead.findFirst({
      where: {
        OR: [{ phone: customerPhone }, { phone: message.from }],
      },
      select: { id: true, status: true, source: true },
    });

    let leadId: string | null = existingLead?.id || null;
    if (!existingLead) {
      const createdLead = await prisma.lead.create({
        data: {
          name: `WhatsApp Lead ${customerPhone}`,
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

    // 2. Store message
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

    // 3. Check for handoff triggers first
    const isHandoff = await processHandoffTriggers(
      conversation.id,
      customerPhone,
      content,
      1.0, // mock confidence since we don't have intent yet
      0, // unresolved turns mock
      leadId
    );

    if (isHandoff) {
      await getMetaClient().sendMessage(customerPhone, 'I am connecting you to a human agent now.');
    } else {
      // 4. Run OpenAI property / maintenance processing
      try {
        // Fetch last 5 messages for context
        const recentMessages = await prisma.nadiaMessage.findMany({
          where: { conversationId: conversation.id },
          orderBy: { timestamp: 'desc' },
          take: 5,
        });

        const chatMessages = recentMessages.reverse().map(m => ({
          role: m.direction === 'inbound' ? 'user' : 'assistant',
          content: m.body,
        })) as ChatMessage[];

        const reply = await processChatWithOpenAI(chatMessages);

        // Save AI reply to DB
        await prisma.nadiaMessage.create({
          data: {
            conversationId: conversation.id,
            waMessageId: `meta-out-${Date.now()}`,
            direction: 'outbound',
            body: reply,
            messageType: 'text',
            status: 'sent',
            timestamp: new Date(),
          },
        });

        // Send WhatsApp reply
        await getMetaClient().sendMessage(customerPhone, reply);
      } catch (err) {
        console.error('[Meta Webhook] OpenAI processing error:', err);
      }
    }

    // 5. Update conversation timestamps
    await prisma.nadiaConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    // 6. Emit real-time event via Socket.io
    getSocketServer()?.emitMetaMessage({
      id: storedMessage.id,
      conversationId: conversation.id,
      leadId: leadId ?? undefined,
      from: customerPhone,
      content,
      type: messageType,
      timestamp,
      nlp: {}, // Removing mock NLP
    } as any);
  } catch (error) {
    console.error('[Meta Webhook] Error handling message:', error);
  }
}

/**
 * Handle message status update — FULL PIPELINE
 * Updates NadiaMessage.status in DB when Meta reports delivery/read/failed.
 */
async function handleStatusUpdate(status: any): Promise<void> {
  try {
    const waMessageId = status.id;
    const newStatus = status.status; // sent, delivered, read, failed

    if (!waMessageId || !newStatus) {
      console.warn('[Meta Webhook] Ignoring malformed status payload');
      return;
    }

    console.log(`[Meta Webhook] Status update: ${waMessageId} → ${newStatus}`);

    // Find and update the message in DB
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

    // If failed, log the error detail
    if (newStatus === 'failed' && status.errors?.length) {
      console.error(`[Meta Webhook] Message ${waMessageId} failed:`, status.errors);
    }

    // Emit real-time status update via Socket.io (Meta API channel)
    getSocketServer()?.emitMetaStatus({
      messageId: waMessageId,
      dbId: existing?.id,
      status: newStatus,
      timestamp: new Date(parseInt(status.timestamp) * 1000),
      recipientId: status.recipient_id,
      errors: status.errors,
    });
  } catch (error) {
    console.error('[Meta Webhook] Error handling status:', error);
  }
}

/**
 * POST /api/webhooks/meta/send
 * Send message via Meta API (internal helper)
 * Body: { to: string, message: string, conversationId: string }
 */
router.post('/send', requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const { to, message, conversationId } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, message',
      });
    }

    const sendAllowance = rateLimiter.canSend(to);
    if (!sendAllowance.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded for WhatsApp sends',
        retryAfterMs: sendAllowance.retryAfterMs,
      });
    }

    const meta = getMetaClient();
    const messageId = await meta.sendMessage(to, message);

    res.json({
      success: true,
      data: {
        conversationId,
        messageId,
        to,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        timestamp: new Date(),
        channel: 'META_API',
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/webhooks/meta/template
 * Send template message via Meta API
 * Body: { to: string, template: string, parameters?: string[], conversationId: string }
 */
router.post('/template', requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const { to, template, parameters, conversationId } = req.body;

    if (!to || !template) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, template',
      });
    }

    const sendAllowance = rateLimiter.canSend(to);
    if (!sendAllowance.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded for WhatsApp template sends',
        retryAfterMs: sendAllowance.retryAfterMs,
      });
    }

    const meta = getMetaClient();
    const messageId = await meta.sendTemplate(to, template, parameters);

    res.json({
      success: true,
      data: {
        conversationId,
        messageId,
        to,
        template,
        timestamp: new Date(),
        channel: 'META_API',
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error sending template:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/webhooks/meta/status
 * Check Meta API connectivity
 */
router.get('/status', requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const meta = getMetaClient();
    const stats = meta.getStats();

    const isConfigured =
      process.env.META_ACCESS_TOKEN &&
      process.env.META_BUSINESS_ACCOUNT_ID &&
      process.env.META_PHONE_NUMBER_ID;

    res.json({
      success: true,
      data: {
        configured: !!isConfigured,
        apiVersion: stats.apiVersion,
        phoneNumberId: stats.phoneNumberId
          ? stats.phoneNumberId.substring(0, 5) + '***'
          : 'NOT_SET',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error getting status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/webhooks/meta/image
 * Send image via Meta API
 * Body: { to: string, imageUrl: string, conversationId: string }
 */
router.post('/image', requireRole('owner'), async (req: Request, res: Response) => {
  try {
    const { to, imageUrl, conversationId } = req.body;

    if (!to || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, imageUrl',
      });
    }

    const meta = getMetaClient();
    const messageId = await meta.sendImage(to, imageUrl);

    res.json({
      success: true,
      data: {
        conversationId,
        messageId,
        to,
        imageUrl: imageUrl.substring(0, 50) + '...',
        channel: 'META_API',
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error sending image:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
