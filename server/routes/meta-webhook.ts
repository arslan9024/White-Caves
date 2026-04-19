/**
 * Meta Business API Webhook Routes
 * Endpoints for receiving production WhatsApp messages from Meta
 * POST /api/webhooks/meta - Receive messages
 * GET /api/webhooks/meta/verify - Webhook verification
 */

import { Router, Request, Response } from 'express';
import { createMetaAPIClient, MetaAPIClient, WebhookEvent } from '../services/whatsapp/metaAPI';
import { requireRole } from '../middleware/rbac';
import { createLogger } from '../utils/logger.js';
const log = createLogger('MetaWebhook');

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
      log.warn('[Meta Webhook] Meta API not fully configured - check environment variables');
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

    log.info('[Meta Webhook] Verification request:', { mode, verifyToken: '***' });

    const meta = getMetaClient();
    const result = meta.verifyWebhook(mode, challenge, verifyToken);

    if (result) {
      res.set('Content-Type', 'text/plain');
      res.send(result);
      log.info('[Meta Webhook] Verification successful');
    } else {
      log.warn('[Meta Webhook] Verification failed - invalid token or mode');
      res.status(403).json({
        success: false,
        error: 'Verification failed',
      });
    }
  } catch (error) {
    log.error('[Meta Webhook] Verification error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/webhooks/meta
 * Receive messages and status updates from Meta/WhatsApp
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    log.info('[Meta Webhook] Incoming webhook event');

    // Acknowledge receipt immediately
    res.json({ success: true });

    // Parse event
    const meta = getMetaClient();
    const event: WebhookEvent = meta.parseWebhookEvent(req.body);

    // Reject if not whatsapp
    if (event.entry[0]?.changes[0]?.value?.messaging_product !== 'whatsapp') {
      log.info('[Meta Webhook] Ignoring non-WhatsApp event');
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
    log.error('[Meta Webhook] Error processing event:', error);
    // Still return 200 to prevent retry
    res.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

/**
 * Handle incoming message
 */
async function handleIncomingMessage(message: any, phoneNumberId: string): Promise<void> {
  try {
    const messageData = {
      id: message.id,
      from: message.from,
      type: message.type,
      timestamp: parseInt(message.timestamp),
      phoneNumberId,
      content: message.text?.body || '',
      hasMedia: !!message.image || !!message.document || !!message.audio || !!message.video,
      mediaId: message.image?.id || message.document?.id || message.audio?.id || message.video?.id,
    };

    log.info(`[Meta Webhook] Message received from ${messageData.from}: ${messageData.content.substring(0, 50)}`);

    // In real implementation, this would:
    // 1. Route to NADIA message processor
    // 2. Store in database
    // 3. Update conversation
    // 4. Trigger NLP analysis
    // 5. Queue for agent if needed

    // Emit event that API/service layer can listen to
    if (global.eventEmitter) {
      global.eventEmitter.emit('meta:message:received', messageData);
    }
  } catch (error) {
    log.error('[Meta Webhook] Error handling message:', error);
  }
}

/**
 * Handle message status update
 */
async function handleStatusUpdate(status: any): Promise<void> {
  try {
    log.info(`[Meta Webhook] Status update for message ${status.id}: ${status.status}`);

    const statusData = {
      messageId: status.id,
      status: status.status,
      timestamp: parseInt(status.timestamp),
      recipientId: status.recipient_id,
      errors: status.errors,
    };

    // In real implementation, this would:
    // 1. Find message in database
    // 2. Update status
    // 3. Trigger callbacks/notifications
    // 4. Log for analytics

    // Emit event
    if (global.eventEmitter) {
      global.eventEmitter.emit('meta:message:status_updated', statusData);
    }
  } catch (error) {
    log.error('[Meta Webhook] Error handling status:', error);
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
    log.error('[Meta Webhook] Error sending message:', error);
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
    log.error('[Meta Webhook] Error sending template:', error);
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
    log.error('[Meta Webhook] Error getting status:', error);
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
    log.error('[Meta Webhook] Error sending image:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
