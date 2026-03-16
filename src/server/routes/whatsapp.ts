/**
 * WhatsApp Integration Routes
 * Handles session management, message sending, and connection lifecycle
 */

import express, { Router, Request, Response } from 'express';
import { WhatsAppServiceManager, WhatsAppService, WhatsAppConnectionError, WhatsAppAuthenticationError, WhatsAppMessageError } from '../services/WhatsAppService';
import WhatsAppSession from '../models/WhatsAppSession';
import type { RedisClientType } from 'redis';

const router: Router = express.Router();

/**
 * Custom request types with WhatsApp context
 */
interface WhatsAppRequest extends Request {
  sessionId?: string;
  whatsAppService?: WhatsAppService;
}

// ================================
// Middleware
// ================================

/**
 * Owner authentication middleware
 */
const ownerMiddleware = async (req: Request, res: Response, next: express.NextFunction) => {
  const userEmail = (req as any).user?.email;
  const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';

  if (!userEmail || userEmail !== ownerEmail) {
    return res.status(403).json({ error: 'Access denied. Owner only.' });
  }
  next();
};

/**
 * Extract and validate session ID from params
 */
const extractSessionId = (req: WhatsAppRequest, res: Response, next: express.NextFunction) => {
  const { sessionId } = req.params;
  
  if (!sessionId) {
    return res.status(400).json({
      error: 'SESSION_ID_REQUIRED',
      message: 'Session ID is required'
    });
  }

  req.sessionId = sessionId;
  req.whatsAppService = WhatsAppServiceManager.getInstance(sessionId);
  next();
};

/**
 * Global error handler for WhatsApp errors
 */
const handleWhatsAppError = (err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('[WhatsApp API] Error:', err.code || err.message);

  if (err instanceof WhatsAppConnectionError) {
    return res.status(503).json({
      error: 'CONNECTION_ERROR',
      message: 'WhatsApp client not connected',
      details: err.details
    });
  }

  if (err instanceof WhatsAppAuthenticationError) {
    return res.status(401).json({
      error: 'AUTH_ERROR',
      message: 'WhatsApp authentication failed',
      details: err.details
    });
  }

  if (err instanceof WhatsAppMessageError) {
    return res.status(400).json({
      error: 'MESSAGE_ERROR',
      message: 'Failed to send message',
      details: err.details
    });
  }

  // Default error
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

/**
 * GET /api/whatsapp/session
 * Fetch current WhatsApp session status and configuration
 */
router.get('/session', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';

    // Get or create session from database
    let session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      session = await WhatsAppSession.create({
        userId: (req as any).user._id,
        ownerEmail,
        sessionId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        connectionStatus: 'disconnected'
      });
    }

    // Get service instance
    const service = WhatsAppServiceManager.getInstance(session.sessionId);
    const status = service.getStatus();

    res.json({
      sessionId: session.sessionId,
      connectionStatus: session.connectionStatus,
      phoneNumber: session.phoneNumber,
      businessName: session.businessName,
      connectedAt: session.connectedAt,
      lastMessageAt: session.lastMessageAt,
      messageCount: session.messageCount,
      autoReplyEnabled: session.autoReplyEnabled,
      chatbotEnabled: session.chatbotEnabled,
      businessHoursOnly: session.businessHoursOnly,
      businessHours: session.businessHours,
      welcomeMessage: session.welcomeMessage,
      awayMessage: session.awayMessage,
      quickReplies: session.quickReplies,
      serviceStatus: status // Real-time status from service
    });
  } catch (error) {
    console.error('Error fetching WhatsApp session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

/**
 * POST /api/whatsapp/connect
 * Initiate WhatsApp connection (QR code or Meta OAuth)
 */
router.post('/connect', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const { connectionMethod = 'qr' } = req.body;
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';

    // Get or create session
    let session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      session = await WhatsAppSession.create({
        userId: (req as any).user._id,
        ownerEmail,
        sessionId: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        connectionStatus: 'connecting'
      });
    } else {
      session.connectionStatus = 'connecting';
      await session.save();
    }

    // Initialize WhatsApp service
    const redisClient = (req as any).app.get('redisClient') as RedisClientType | null;
    const service = WhatsAppServiceManager.getInstance(session.sessionId, {
      ownerEmail,
      mongoSessionModel: WhatsAppSession as any,
      redisClient: redisClient as any
    });

    // Listen for QR code event
    let qrCode = '';
    service.once('qr-received', (data) => {
      qrCode = data.qr;
    });

    // Initialize service (will generate QR code)
    await service.initialize();

    // Wait for QR code to be generated
    if (!qrCode) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    res.json({
      success: true,
      sessionId: session.sessionId,
      connectionStatus: 'qr_pending',
      qrCode: qrCode || 'QR code generation in progress...',
      message: 'Scan the QR code with WhatsApp to connect',
      expiresIn: 60 // seconds
    });

    // Auto-logout QR code after 60 seconds
    setTimeout(() => {
      service.reconnect().catch(err => console.error('QR timeout reconnect error:', err));
    }, 60000);

  } catch (error) {
    console.error('Error initiating WhatsApp connection:', error);
    res.status(500).json({ error: 'Failed to initiate connection' });
  }
});

/**
 * GET /api/whatsapp/qr-status
 * Poll for current QR code status (for frontend polling)
 */
router.get('/qr-status', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const redisClient = (req as any).app.get('redisClient') as RedisClientType | null;
    const service = WhatsAppServiceManager.getInstance(session.sessionId);
    const status = service.getStatus();

    res.json({
      sessionId: session.sessionId,
      connected: status.connected,
      authenticated: status.authenticated,
      connectionStatus: session.connectionStatus,
      message: status.authenticated ? 'Connected and authenticated' : 'Waiting for authentication...'
    });
  } catch (error) {
    console.error('Error fetching QR status:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

/**
 * POST /api/whatsapp/send-message
 * Send a message via WhatsApp
 */
router.post('/send-message', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Missing phoneNumber or message' });
    }

    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const service = WhatsAppServiceManager.getInstance(session.sessionId);

    if (!service.isAuthenticated()) {
      return res.status(400).json({ error: 'WhatsApp not authenticated' });
    }

    const messageId = await service.sendMessage(phoneNumber, message);

    // Update message count
    session.messageCount = (session.messageCount || 0) + 1;
    session.lastMessageAt = new Date();
    await session.save();

    res.json({
      success: true,
      messageId,
      sentAt: new Date()
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * POST /api/whatsapp/disconnect
 * Gracefully disconnect WhatsApp session
 */
router.post('/disconnect', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Get and shutdown service
    const service = WhatsAppServiceManager.getInstance(session.sessionId);
    await service.shutdown();
    WhatsAppServiceManager.removeInstance(session.sessionId);

    // Update session status
    session.connectionStatus = 'disconnected';
    session.connectedAt = null;
    session.phoneNumber = null;
    await session.save();

    res.json({
      success: true,
      message: 'WhatsApp disconnected successfully'
    });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

/**
 * POST /api/whatsapp/webhook
 * Handle incoming WhatsApp messages via webhook
 * Called by WhatsAppService when messages are received
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const { messageId, from, body, timestamp, hasMedia, mediaUrl } = req.body;

    // Store message in database
    const message = {
      messageId,
      from,
      body,
      timestamp,
      hasMedia,
      mediaUrl,
      receivedAt: new Date()
    };

    console.log('Received webhook message:', message);

    // Process message asynchronously
    setImmediate(async () => {
      // Emit event for message processing
      (req as any).app.emit('whatsapp-message', message);
    });

    // Return success immediately
    res.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

/**
 * GET /api/whatsapp/service-health
 * Check WhatsApp service health and uptime
 */
router.get('/service-health', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found', healthy: false });
    }

    const service = WhatsAppServiceManager.getInstance(session.sessionId);
    const status = service.getStatus();

    res.json({
      healthy: status.connected && status.authenticated,
      status: {
        connected: status.connected,
        authenticated: status.authenticated,
        messagesSent: status.messagesSent,
        messagesReceived: status.messagesReceived,
        uptime: status.uptime,
        lastHeartbeat: status.lastHeartbeat
      }
    });
  } catch (error) {
    console.error('Error checking service health:', error);
    res.status(500).json({ error: 'Failed to check health', healthy: false });
  }
});

// ================================
// Enhanced Message Queue Routes
// ================================

/**
 * GET /api/whatsapp/queue-status
 * Get detailed message queue status for current session
 */
router.get('/queue-status', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const service = WhatsAppServiceManager.getInstance(session.sessionId);
    const queueStatus = service.getQueueStatus();

    res.json({
      success: true,
      sessionId: session.sessionId,
      queue: {
        size: queueStatus.queueSize,
        maxSize: queueStatus.maxQueueSize,
        processing: queueStatus.processing,
        messages: queueStatus.messages.slice(0, 20) // Show first 20
      },
      priorities: {
        high: queueStatus.messages.filter((m: any) => m.priority === 'high').length,
        normal: queueStatus.messages.filter((m: any) => m.priority === 'normal').length,
        low: queueStatus.messages.filter((m: any) => m.priority === 'low').length
      }
    });
  } catch (error) {
    console.error('Error fetching queue status:', error);
    res.status(500).json({ error: 'Failed to fetch queue status' });
  }
});

/**
 * GET /api/whatsapp/sessions/:sessionId/queue
 * Get queue status for specific session
 */
router.get('/sessions/:sessionId/queue', extractSessionId, ownerMiddleware, (req: WhatsAppRequest, res: Response) => {
  try {
    const service = req.whatsAppService!;
    const queueStatus = service.getQueueStatus();

    res.json({
      success: true,
      sessionId: req.sessionId,
      queue: queueStatus
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve queue status' });
  }
});

// ================================
// Enhanced Contact Routes  
// ================================

/**
 * GET /api/whatsapp/contacts
 * Get list of contacts (chats) for current session
 */
router.get('/contacts', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (!session.connectionStatus || session.connectionStatus !== 'authenticated') {
      return res.status(503).json({
        error: 'NOT_AUTHENTICATED',
        message: 'Please connect WhatsApp first'
      });
    }

    // Placeholder: In real implementation, fetch from WhatsApp client
    res.json({
      success: true,
      sessionId: session.sessionId,
      contacts: [],
      message: 'Feature coming soon'
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// ================================
// Message History Routes
// ================================

/**
 * GET /api/whatsapp/messages
 * Get message history for current session
 */
router.get('/messages', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Placeholder: Message history storage
    res.json({
      success: true,
      sessionId: session.sessionId,
      messages: [],
      pagination: {
        limit,
        offset,
        total: 0
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ================================
// Multi-Session Management
// ================================

/**
 * GET /api/whatsapp/all-sessions
 * Get all WhatsApp sessions (admin only)
 */
router.get('/all-sessions', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const sessions = await WhatsAppSession.find({});
    
    res.json({
      success: true,
      count: sessions.length,
      sessions: sessions.map(session => ({
        sessionId: session.sessionId,
        ownerEmail: session.ownerEmail,
        phoneNumber: session.phoneNumber,
        connectionStatus: session.connectionStatus,
        connectedAt: session.connectedAt,
        messageCount: session.messageCount
      }))
    });
  } catch (error) {
    console.error('Error fetching all sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

/**
 * POST /api/whatsapp/sessions/:sessionId/reconnect
 * Manually trigger reconnection for a session
 */
router.post('/sessions/:sessionId/reconnect', extractSessionId, ownerMiddleware, async (req: WhatsAppRequest, res: Response, next: express.NextFunction) => {
  try {
    const service = req.whatsAppService!;
    await service.reconnect();

    res.json({
      success: true,
      message: 'Reconnection initiated',
      sessionId: req.sessionId,
      status: service.getStatus()
    });
  } catch (error) {
    next(error);
  }
});

// ================================
// Statistics & Monitoring
// ================================

/**
 * GET /api/whatsapp/stats
 * Get WhatsApp statistics for current session
 */
router.get('/stats', ownerMiddleware, async (req: Request, res: Response) => {
  try {
    const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';
    const session = await WhatsAppSession.findOne({ ownerEmail });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const service = WhatsAppServiceManager.getInstance(session.sessionId);
    const status = service.getStatus();
    const queueStatus = service.getQueueStatus();

    res.json({
      success: true,
      stats: {
        connection: {
          connected: status.connected,
          authenticated: status.authenticated,
          phoneNumber: session.phoneNumber,
          uptime: status.uptime
        },
        messaging: {
          messagesSent: status.messagesSent,
          messagesReceived: status.messagesReceived,
          queued: queueStatus.queueSize
        },
        timestamps: {
          connectedAt: session.connectedAt,
          lastMessageAt: session.lastMessageAt,
          lastHeartbeat: status.lastHeartbeat
        }
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ================================
// Global Health & Status Routes
// ================================

/**
 * GET /api/whatsapp/health
 * Check global WhatsApp service health
 */
router.get('/health', (req: Request, res: Response) => {
  try {
    const sessions = WhatsAppServiceManager.getAllInstances();
    const authenticatedCount = sessions.filter((s: WhatsAppService) => s.isAuthenticated()).length;

    res.json({
      success: true,
      service: 'WhatsApp Integration',
      timestamp: new Date().toISOString(),
      health: {
        status: 'operational',
        activeSessions: sessions.length,
        authenticatedSessions: authenticatedCount,
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      service: 'WhatsApp Integration',
      health: { status: 'degraded' }
    });
  }
});

// ================================
// Error Handler (Must be last)
// ================================

router.use(handleWhatsAppError);

export default router;
