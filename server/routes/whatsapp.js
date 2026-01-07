import express from 'express';
import crypto from 'crypto';
import WhatsAppSession from '../models/WhatsAppSession.js';

const router = express.Router();

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const ownerMiddleware = async (req, res, next) => {
  const userEmail = req.user?.email;
  if (!userEmail || userEmail !== OWNER_EMAIL) {
    return res.status(403).json({ error: 'Access denied. Owner only.' });
  }
  next();
};

router.get('/session', ownerMiddleware, async (req, res) => {
  try {
    let session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    
    if (!session) {
      session = await WhatsAppSession.create({
        userId: req.user._id || new (await import('mongoose')).default.Types.ObjectId(),
        ownerEmail: OWNER_EMAIL,
        sessionId: `wa_${crypto.randomBytes(16).toString('hex')}`,
        connectionStatus: 'disconnected'
      });
    }
    
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
      quickReplies: session.quickReplies
    });
  } catch (error) {
    console.error('Error fetching WhatsApp session:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

router.post('/connect', ownerMiddleware, async (req, res) => {
  try {
    const { connectionMethod } = req.body;
    
    let session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    
    if (!session) {
      session = await WhatsAppSession.create({
        userId: req.user._id || new (await import('mongoose')).default.Types.ObjectId(),
        ownerEmail: OWNER_EMAIL,
        sessionId: `wa_${crypto.randomBytes(16).toString('hex')}`,
        connectionStatus: 'connecting'
      });
    }
    
    if (connectionMethod === 'qr') {
      const qrData = `whatsapp://connect?session=${session.sessionId}&token=${crypto.randomBytes(32).toString('base64')}`;
      const qrExpiry = new Date(Date.now() + 5 * 60 * 1000);
      
      session.connectionStatus = 'qr_pending';
      session.lastQrCode = qrData;
      session.qrCodeExpiry = qrExpiry;
      await session.save();
      
      res.json({
        success: true,
        connectionStatus: 'qr_pending',
        qrCode: qrData,
        qrExpiry: qrExpiry,
        message: 'Scan the QR code with WhatsApp to connect'
      });
    } else if (connectionMethod === 'meta') {
      session.connectionStatus = 'connecting';
      await session.save();
      
      const metaAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID || 'YOUR_META_APP_ID'}&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI || 'https://whitecaves.com/api/whatsapp/meta/callback')}&scope=whatsapp_business_management,whatsapp_business_messaging&response_type=code&state=${session.sessionId}`;
      
      res.json({
        success: true,
        connectionStatus: 'connecting',
        authUrl: metaAuthUrl,
        message: 'Redirect to Meta to authenticate'
      });
    } else {
      res.status(400).json({ error: 'Invalid connection method' });
    }
  } catch (error) {
    console.error('Error initiating WhatsApp connection:', error);
    res.status(500).json({ error: 'Failed to initiate connection' });
  }
});

router.post('/disconnect', ownerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    
    if (!session) {
      return res.status(404).json({ error: 'No session found' });
    }
    
    session.connectionStatus = 'disconnected';
    session.lastQrCode = null;
    session.qrCodeExpiry = null;
    session.accessToken = null;
    session.refreshToken = null;
    session.connectedAt = null;
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

router.put('/settings', ownerMiddleware, async (req, res) => {
  try {
    const {
      autoReplyEnabled,
      chatbotEnabled,
      businessHoursOnly,
      businessHours,
      welcomeMessage,
      awayMessage,
      quickReplies
    } = req.body;
    
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    
    if (!session) {
      return res.status(404).json({ error: 'No session found' });
    }
    
    if (autoReplyEnabled !== undefined) session.autoReplyEnabled = autoReplyEnabled;
    if (chatbotEnabled !== undefined) session.chatbotEnabled = chatbotEnabled;
    if (businessHoursOnly !== undefined) session.businessHoursOnly = businessHoursOnly;
    if (businessHours) session.businessHours = { ...session.businessHours, ...businessHours };
    if (welcomeMessage) session.welcomeMessage = welcomeMessage;
    if (awayMessage) session.awayMessage = awayMessage;
    if (quickReplies) session.quickReplies = quickReplies;
    
    await session.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: {
        autoReplyEnabled: session.autoReplyEnabled,
        chatbotEnabled: session.chatbotEnabled,
        businessHoursOnly: session.businessHoursOnly,
        businessHours: session.businessHours,
        welcomeMessage: session.welcomeMessage,
        awayMessage: session.awayMessage,
        quickReplies: session.quickReplies
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.get('/qr/refresh', ownerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    
    if (!session) {
      return res.status(404).json({ error: 'No session found' });
    }
    
    const qrData = `whatsapp://connect?session=${session.sessionId}&token=${crypto.randomBytes(32).toString('base64')}&t=${Date.now()}`;
    const qrExpiry = new Date(Date.now() + 5 * 60 * 1000);
    
    session.connectionStatus = 'qr_pending';
    session.lastQrCode = qrData;
    session.qrCodeExpiry = qrExpiry;
    await session.save();
    
    res.json({
      success: true,
      qrCode: qrData,
      qrExpiry: qrExpiry
    });
  } catch (error) {
    console.error('Error refreshing QR code:', error);
    res.status(500).json({ error: 'Failed to refresh QR code' });
  }
});

router.post('/simulate/connect', ownerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    
    if (!session) {
      return res.status(404).json({ error: 'No session found' });
    }
    
    session.connectionStatus = 'connected';
    session.phoneNumber = '+971 56 361 6136';
    session.connectedAt = new Date();
    await session.save();
    
    res.json({
      success: true,
      connectionStatus: 'connected',
      phoneNumber: session.phoneNumber,
      connectedAt: session.connectedAt
    });
  } catch (error) {
    console.error('Error simulating connection:', error);
    res.status(500).json({ error: 'Failed to simulate connection' });
  }
});

router.get('/meta/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code || !state) {
      return res.redirect('/owner/whatsapp/settings?error=missing_params');
    }
    
    const session = await WhatsAppSession.findOne({ sessionId: state });
    
    if (!session) {
      return res.redirect('/owner/whatsapp/settings?error=invalid_session');
    }
    
    session.connectionStatus = 'connected';
    session.connectedAt = new Date();
    session.phoneNumber = '+971 56 361 6136';
    await session.save();
    
    res.redirect('/owner/whatsapp/settings?success=connected');
  } catch (error) {
    console.error('Meta callback error:', error);
    res.redirect('/owner/whatsapp/settings?error=callback_failed');
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { object, entry } = req.body;
    
    if (object !== 'whatsapp_business_account') {
      return res.sendStatus(404);
    }
    
    for (const e of entry) {
      const changes = e.changes || [];
      for (const change of changes) {
        if (change.field === 'messages') {
          const messages = change.value?.messages || [];
          for (const message of messages) {
            console.log('Received WhatsApp message:', {
              from: message.from,
              type: message.type,
              text: message.text?.body
            });
          }
        }
      }
    }
    
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.sendStatus(500);
  }
});

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'whitecaves_verify_token';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

export default router;
