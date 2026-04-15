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
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { sanitizeString } from '../utils/sanitize.js';

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
      console.error('[Linda Routes] Error initializing Linda:', error);
      // Continue without throwing - Linda might be offline but other channels work
    }
  }

  return lindaClient;
}

/**
 * GET /api/linda/status
 * Check Linda connection status
 */
router.get('/status', requirePermission('access_whatsapp_business'), asyncHandler(async (req: Request, res: Response) => {
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
}));

/**
 * POST /api/linda/send/:conversationId
 * Send message via WhatsApp
 * Body: { phoneNumber: string, message: string }
 */
router.post('/send/:conversationId', requirePermission('access_whatsapp_business'), asyncHandler(async (req: Request, res: Response) => {
    const { phoneNumber, message } = req.body;
    const { conversationId } = req.params;

    validate(req.body, {
      phoneNumber: rules.requiredString('Phone Number'),
      message: rules.requiredStringWithMax('Message', 4096),
    });

    const linda = await initializeLinda();

    // Validate phone format
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      throw new AppError('Invalid phone number format — must be at least 10 digits', 400);
    }

    const safeMessage = sanitizeString(message);

    // Send message
    const messageId = await linda.sendMessage(phoneNumber, safeMessage);

    res.json({
      success: true,
      data: {
        conversationId,
        messageId,
        phoneNumber,
        message: safeMessage.substring(0, 100) + (safeMessage.length > 100 ? '...' : ''),
        timestamp: new Date(),
        channel: 'LINDA_WHATSAPP',
      },
    });
}));

/**
 * POST /api/linda/webhook
 * Receive messages from WhatsApp (via polling simulation)
 * In real implementation, Linda polls for new messages periodically
 */
router.post('/webhook', requirePermission('access_whatsapp_business'), asyncHandler(async (req: Request, res: Response) => {
    const linda = await initializeLinda();
    const messages = linda.getMessageQueue();

    if (messages.length === 0) {
      res.json({
        success: true,
        data: { messages: [], count: 0 },
      });
      return;
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
}));

/**
 * GET /api/linda/conversations
 * Get list of active conversations
 */
router.get('/conversations', requirePermission('access_whatsapp_business'), asyncHandler(async (req: Request, res: Response) => {
    const linda = await initializeLinda();
    const conversations = await linda.getConversations();

    res.json({
      success: true,
      data: {
        conversations,
        count: conversations.length,
      },
    });
}));

/**
 * GET /api/linda/conversations/:phoneNumber/history
 * Get conversation history
 */
router.get('/conversations/:phoneNumber/history', requirePermission('access_whatsapp_business'), asyncHandler(async (req: Request, res: Response) => {
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
}));

/**
 * POST /api/linda/ready
 * Check if Linda session is authenticated and ready
 */
router.post('/ready', asyncHandler(async (req: Request, res: Response) => {
    const linda = await initializeLinda();
    const isConnected = linda.isConnected();

    if (!isConnected) {
      throw new AppError('Linda not connected — please scan QR code from /api/linda/qr', 503);
    }

    res.json({
      success: true,
      message: 'Linda is ready',
    });
}));

/**
 * GET /api/linda/health
 * Health check (simpler than status)
 */
router.get('/health', asyncHandler(async (req: Request, res: Response) => {
    const linda = await initializeLinda();
    const stats = linda.getStats();

    const healthy = stats.isConnected;

    res.status(healthy ? 200 : 503).json({
      success: healthy,
      status: stats.status,
      isConnected: stats.isConnected,
      timestamp: new Date(),
    });
}));

/**
 * POST /api/linda/disconnect
 * Manually disconnect Linda
 */
router.post('/disconnect', asyncHandler(async (req: Request, res: Response) => {
    if (lindaClient) {
      await lindaClient.disconnect();
      lindaClient = null;
    }

    res.json({
      success: true,
      message: 'Linda disconnected',
    });
}));

/**
 * GET /api/linda/stats
 * Get detailed statistics
 */
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
    const linda = await initializeLinda();
    const stats = linda.getStats();

    res.json({
      success: true,
      data: stats,
      timestamp: new Date(),
    });
}));

export default router;
