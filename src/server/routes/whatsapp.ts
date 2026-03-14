/**
 * WhatsApp Integration Routes
 * Handles session management, message sending, and connection lifecycle
 */

import express, { Router, Request, Response } from 'express';
import { WhatsAppServiceManager, WhatsAppService } from '../services/WhatsAppService';
import WhatsAppSession from '../models/WhatsAppSession';
import type { RedisClientType } from 'redis';

const router: Router = express.Router();

// Middleware
const ownerMiddleware = async (req: Request, res: Response, next: express.NextFunction) => {
  const userEmail = (req as any).user?.email;
  const ownerEmail = process.env.WHATSAPP_OWNER_EMAIL || 'arslanmalikgoraha@gmail.com';

  if (!userEmail || userEmail !== ownerEmail) {
    return res.status(403).json({ error: 'Access denied. Owner only.' });
  }
  next();
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

export default router;
