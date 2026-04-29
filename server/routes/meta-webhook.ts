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
import { createMetaAPIClient, MetaAPIClient, WebhookEvent } from '../services/whatsapp/metaAPI.js';
import { verifyWebhookSignature, normalizePhone, rateLimiter } from '../services/whatsapp/whatsappUtils.js';
import { requireRole } from '../middleware/rbac.js';
import { prisma } from '../database.js';
import { detectIntent, calculateLeadScore } from '../services/nadia/messageProcessor.js';

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
      const rawBody = JSON.stringify(req.body);
      if (!verifyWebhookSignature(rawBody, signature, appSecret)) {
        console.warn('[Meta Webhook] Invalid signature — rejecting');
        res.status(401).json({ success: false, error: 'Invalid signature' });
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
    const content = message.text?.body || '';
    const messageType = message.type || 'text';
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    console.log(`[Meta Webhook] Message from ${customerPhone}: ${content.substring(0, 80)}`);

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

    // 2. Store message
    const storedMessage = await prisma.nadiaMessage.create({
      data: {
        conversationId: conversation.id,
        waMessageId: message.id,
        direction: 'inbound',
        body: content,
        messageType,
        status: 'delivered',
        timestamp,
      },
    });

    // 3. Run NLP analysis (Nina)
    let nlpResult: { intent?: string; score?: number } = {};
    try {
      const intent = detectIntent(content);
      const score = calculateLeadScore({
        messageCount: 1,
        responseTime: 0,
        intentClarity: intent !== 'general_inquiry' ? 1 : 0.3,
        budgetMentioned: content.toLowerCase().includes('budget') || content.toLowerCase().includes('aed'),
        timelineMentioned: content.toLowerCase().includes('asap') || content.toLowerCase().includes('urgent'),
        propertyInterest: content.toLowerCase().includes('property') || content.toLowerCase().includes('villa') ? 1 : 0,
      });
      nlpResult = { intent, score };
    } catch (nlpErr) {
      console.warn('[Meta Webhook] NLP processing failed:', nlpErr);
    }

    // 4. Update conversation with NLP results
    if (nlpResult.intent || nlpResult.score) {
      await prisma.nadiaConversation.update({
        where: { id: conversation.id },
        data: {
          ...(nlpResult.intent && { intent: nlpResult.intent }),
          ...(nlpResult.score && { leadScore: nlpResult.score }),
          updatedAt: new Date(),
        },
      });
    }

    // 5. Emit event for real-time listeners
    if ((global as any).eventEmitter) {
      (global as any).eventEmitter.emit('meta:message:received', {
        id: storedMessage.id,
        conversationId: conversation.id,
        from: customerPhone,
        content,
        type: messageType,
        timestamp,
        nlp: nlpResult,
      });
    }
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

    console.log(`[Meta Webhook] Status update: ${waMessageId} → ${newStatus}`);

    // Find and update the message in DB
    const existing = await prisma.nadiaMessage.findFirst({
      where: { waMessageId },
    });

    if (existing) {
      await prisma.nadiaMessage.update({
        where: { id: existing.id },
        data: { status: newStatus },
      });
    }

    // If failed, log the error detail
    if (newStatus === 'failed' && status.errors?.length) {
      console.error(`[Meta Webhook] Message ${waMessageId} failed:`, status.errors);
    }

    // Emit event
    if ((global as any).eventEmitter) {
      (global as any).eventEmitter.emit('meta:message:status_updated', {
        messageId: waMessageId,
        dbId: existing?.id,
        status: newStatus,
        timestamp: new Date(parseInt(status.timestamp) * 1000),
        recipientId: status.recipient_id,
        errors: status.errors,
      });
    }
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
        phoneNumberId: stats.phoneNumberId ? stats.phoneNumberId.substring(0, 5) + '***' : 'NOT_SET',
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
