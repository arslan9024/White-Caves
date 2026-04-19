/**
 * Linda WhatsApp Routes
 * Endpoints for receiving and sending WhatsApp messages via LocalAuth
 * POST /api/linda/webhook - Receive messages
 * GET /api/linda/status - Check connection
 * POST /api/linda/send - Send message
 * GET /api/linda/conversations - Get all conversations
 */

import { Router, Request, Response } from 'express';
import { LindaClient, WhatsAppMessage, getLindaClient } from '../services/whatsapp/lindaClient';
import { requirePermission } from '../middleware/rbac';
import { createLogger } from '../utils/logger.js';
const log = createLogger('LindaRoutes');

const router = Router();
let lindaClient: LindaClient | null = null;

/**
 * Initialize Linda client
 */
async function initializeLinda(): Promise<LindaClient> {
  if (!lindaClient) {
    lindaClient = getLindaClient({
      sessionPath: process.env.LINDA_SESSION_PATH || './.linda-session',
      headless: true,
      autoRestart: true,
    });

    try {
      await lindaClient.initialize();
    } catch (error) {
      log.error('[Linda Routes] Error initializing Linda:', error);
      // Continue without throwing - Linda might be offline but other channels work
    }
  }

  return lindaClient;
}

/**
 * GET /api/linda/status
 * Check Linda connection status
 */
router.get('/status', requirePermission('access_whatsapp_business'), async (req: Request, res: Response) => {
  try {
    const linda = await initializeLinda();
    const stats = linda.getStats();

    res.json({
      success: true,
      data: {
        status: stats.status,
        isConnected: stats.isConnected,
        queuedMessages: stats.queuedMessages,
        reconnectAttempts: stats.reconnectAttempts,
      },
    });
  } catch (error) {
    log.error('[Linda Routes] Error getting status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/linda/send/:conversationId
 * Send message via WhatsApp
 * Body: { phoneNumber: string, message: string }
 */
router.post('/send/:conversationId', requirePermission('access_whatsapp_business'), async (req: Request, res: Response) => {
  try {
    const { phoneNumber, message } = req.body;
    const { conversationId } = req.params;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: phoneNumber, message',
      });
    }

    const linda = await initializeLinda();

    // Validate phone format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format',
      });
    }

    // Send message
    const messageId = await linda.sendMessage(phoneNumber, message);

    res.json({
      success: true,
      data: {
        conversationId,
        messageId,
        phoneNumber,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        timestamp: new Date(),
        channel: 'LINDA_WHATSAPP',
      },
    });
  } catch (error) {
    log.error('[Linda Routes] Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/linda/webhook
 * Receive messages from WhatsApp (via polling simulation)
 * In real implementation, Linda polls for new messages periodically
 */
router.post('/webhook', requirePermission('access_whatsapp_business'), async (req: Request, res: Response) => {
  try {
    const linda = await initializeLinda();
    const messages = linda.getMessageQueue();

    if (messages.length === 0) {
      return res.json({
        success: true,
        data: {
          messages: [],
          count: 0,
        },
      });
    }

    // Process each message
    const processedMessages = messages.map((msg) => ({
      id: msg.id,
      conversationId: `LINDA_${msg.from.replace(/\D/g, '')}`,
      from: msg.from,
      to: msg.to,
      content: msg.body,
      timestamp: msg.timestamp,
      channel: 'LINDA_WHATSAPP',
      type: msg.type,
      hasMedia: msg.hasMedia,
    }));

    res.json({
      success: true,
      data: {
        messages: processedMessages,
        count: processedMessages.length,
      },
    });
  } catch (error) {
    log.error('[Linda Routes] Error processing webhook:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/linda/conversations
 * Get list of active conversations
 */
router.get('/conversations', requirePermission('access_whatsapp_business'), async (req: Request, res: Response) => {
  try {
    const linda = await initializeLinda();
    const conversations = await linda.getConversations();

    res.json({
      success: true,
      data: {
        conversations,
        count: conversations.length,
      },
    });
  } catch (error) {
    log.error('[Linda Routes] Error getting conversations:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/linda/conversations/:phoneNumber/history
 * Get conversation history
 */
router.get('/conversations/:phoneNumber/history', requirePermission('access_whatsapp_business'), async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;

    const linda = await initializeLinda();
    const history = await linda.getConversationHistory(phoneNumber, limit);

    res.json({
      success: true,
      data: {
        phoneNumber,
        messages: history,
        count: history.length,
      },
    });
  } catch (error) {
    log.error('[Linda Routes] Error getting conversation history:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * POST /api/linda/ready
 * Check if Linda session is authenticated and ready
 */
router.post('/ready', async (req: Request, res: Response) => {
  try {
    const linda = await initializeLinda();
    const isConnected = linda.isConnected();

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Linda not connected - please scan QR code from /api/linda/qr',
      });
    }

    res.json({
      success: true,
      message: 'Linda is ready',
    });
  } catch (error) {
    log.error('[Linda Routes] Error checking ready:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/linda/health
 * Health check (simpler than status)
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const linda = await initializeLinda();
    const stats = linda.getStats();

    const healthy = stats.isConnected || stats.reconnectAttempts < stats.reconnectAttempts; // Simple heuristic

    res.status(healthy ? 200 : 503).json({
      success: healthy,
      status: stats.status,
      isConnected: stats.isConnected,
      timestamp: new Date(),
    });
  } catch (error) {
    log.error('[Linda Routes] Error health check:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed',
    });
  }
});

/**
 * POST /api/linda/disconnect
 * Manually disconnect Linda
 */
router.post('/disconnect', async (req: Request, res: Response) => {
  try {
    if (lindaClient) {
      await lindaClient.disconnect();
      lindaClient = null;
    }

    res.json({
      success: true,
      message: 'Linda disconnected',
    });
  } catch (error) {
    log.error('[Linda Routes] Error disconnecting:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/linda/stats
 * Get detailed statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const linda = await initializeLinda();
    const stats = linda.getStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
  } catch (error) {
    log.error('[Linda Routes] Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
