import express from 'express';
import { WhatsAppMessage, WhatsAppChatbotRule, WhatsAppSettings, WhatsAppContact, WhatsAppSession } from '../lib/database.js';
import chatbotService from '../services/ChatbotService.js';

const router = express.Router();

const OWNER_EMAIL = process.env.WHATSAPP_OWNER_EMAIL || 'admin@whitecaves.com';

const isOwnerMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Authorization required' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (req.app.locals.firebaseInitialized) {
      const decodedToken = await req.app.locals.admin.auth().verifyIdToken(idToken);
      if (decodedToken.email !== OWNER_EMAIL) {
        return res.status(403).json({ success: false, error: 'Access denied. Owner only feature.' });
      }
      req.user = decodedToken;
    } else {
      const headerEmail = req.headers['x-owner-email'];
      if (headerEmail !== OWNER_EMAIL) {
        return res.status(403).json({ success: false, error: 'Access denied. Owner only feature.' });
      }
    }

    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid authentication token' });
  }
};

// Helper functions
async function isWithinBusinessHours(session) {
  if (!session?.businessHoursOnly) return true;
  const now = new Date();
  const dubaiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dubai' }));
  const hours = dubaiTime.getHours();
  const businessHours = session.businessHours || { start: '09:00', end: '22:00' };
  const startHour = parseInt(businessHours.start.split(':')[0], 10);
  const endHour = parseInt(businessHours.end.split(':')[0], 10);
  return hours >= startHour && hours < endHour;
}

async function sendWhatsAppReply(phoneNumber, message, session) {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.log('[WhatsApp] Auto-reply simulated (no API credentials):', { to: phoneNumber, message: message.substring(0, 50) + '...' });
    return { success: true, simulated: true };
  }
  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: message }
      })
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('[WhatsApp] Send error:', error);
    return { success: false, error: error.message };
  }
}

// Routes
router.get('/settings', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.json({ success: true, settings: { isConnected: false } });
    }
    let settings = await WhatsAppSettings.findOne({ ownerEmail: OWNER_EMAIL });
    if (!settings) {
      settings = await WhatsAppSettings.create({ ownerEmail: OWNER_EMAIL });
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/settings', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const settings = await WhatsAppSettings.findOneAndUpdate(
      { ownerEmail: OWNER_EMAIL },
      { ...req.body, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/messages', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.json({ success: true, messages: [] });
    }
    const { contactId, limit = 50 } = req.query;
    const query = contactId ? { waId: contactId } : {};
    const messages = await WhatsAppMessage.find(query).sort({ createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/messages', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const message = await WhatsAppMessage.create({
      ...req.body,
      direction: 'outgoing',
      status: 'sent'
    });
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/contacts', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.json({ success: true, contacts: [] });
    }
    const contacts = await WhatsAppContact.find().sort({ lastMessageAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/chatbot/rules', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.json({ success: true, rules: [] });
    }
    const rules = await WhatsAppChatbotRule.find().sort({ priority: -1 });
    res.json({ success: true, rules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/chatbot/rules', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const rule = await WhatsAppChatbotRule.create(req.body);
    res.json({ success: true, rule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/chatbot/rules/:id', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    const rule = await WhatsAppChatbotRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!rule) {
      return res.status(404).json({ success: false, error: 'Rule not found' });
    }
    res.json({ success: true, rule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/chatbot/rules/:id', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.status(400).json({ success: false, error: 'Database not available' });
    }
    await WhatsAppChatbotRule.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/analytics', isOwnerMiddleware, async (req, res) => {
  try {
    if (!req.app.locals.useDatabase) {
      return res.json({ success: true, analytics: { totalMessages: 0, uniqueContacts: 0 } });
    }
    const totalMessages = await WhatsAppMessage.countDocuments();
    const uniqueContacts = await WhatsAppContact.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayMessages = await WhatsAppMessage.countDocuments({ createdAt: { $gte: todayStart } });
    const unreadCount = await WhatsAppMessage.countDocuments({ isRead: false, direction: 'incoming' });
    res.json({
      success: true,
      analytics: { totalMessages, uniqueContacts, todayMessages, unreadCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const { entry } = req.body;
    if (entry) {
      const session = req.app.locals.useDatabase ? await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL }) : null;

      for (const e of entry) {
        const changes = e.changes || [];
        for (const change of changes) {
          if (change.value && change.value.messages) {
            for (const msg of change.value.messages) {
              const messageContent = msg.text?.body || '';
              const senderPhone = msg.from;
              const conversationId = `wa_${senderPhone}`;

              if (req.app.locals.useDatabase) {
                await WhatsAppMessage.create({
                  waId: senderPhone,
                  phoneNumber: senderPhone,
                  direction: 'incoming',
                  messageType: msg.type || 'text',
                  content: messageContent,
                  isRead: false
                });
                await WhatsAppContact.findOneAndUpdate(
                  { waId: senderPhone },
                  { waId: senderPhone, phoneNumber: senderPhone, lastMessageAt: new Date(), $inc: { unreadCount: 1 } },
                  { upsert: true }
                );
              }

              if (session?.chatbotEnabled && messageContent) {
                const withinHours = await isWithinBusinessHours(session);
                let replyMessage = null;

                if (!withinHours && session.awayMessage) {
                  replyMessage = session.awayMessage;
                } else if (withinHours) {
                  const quickReply = session.quickReplies?.find(qr =>
                    qr.enabled && messageContent.toLowerCase().includes(qr.trigger.toLowerCase())
                  );

                  if (quickReply) {
                    replyMessage = quickReply.response;
                  } else {
                    const chatResponse = chatbotService.processMessage(messageContent, conversationId);
                    replyMessage = chatResponse.response;

                    const leadScore = chatbotService.calculateLeadScore(conversationId);
                    if (req.app.locals.useDatabase && leadScore > 0) {
                      await WhatsAppContact.findOneAndUpdate(
                        { waId: senderPhone },
                        {
                          leadScore,
                          detectedIntent: chatResponse.intent,
                          detectedLanguage: chatResponse.language,
                          extractedEntities: chatResponse.entities
                        }
                      );
                    }
                  }
                }

                if (replyMessage) {
                  const sendResult = await sendWhatsAppReply(senderPhone, replyMessage, session);

                  if (req.app.locals.useDatabase && sendResult.success) {
                    await WhatsAppMessage.create({
                      waId: senderPhone,
                      phoneNumber: senderPhone,
                      direction: 'outgoing',
                      messageType: 'text',
                      content: replyMessage,
                      isRead: true,
                      metadata: { automated: true, simulated: sendResult.simulated }
                    });

                    if (session) {
                      session.messageCount = (session.messageCount || 0) + 1;
                      session.lastMessageAt = new Date();
                      await session.save();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'whitecaves_whatsapp_verify';
  if (mode === 'subscribe' && token === verifyToken) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

router.get('/session', isOwnerMiddleware, async (req, res) => {
  try {
    let session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) {
      session = await WhatsAppSession.create({
        userId: req.user?.uid || null,
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

router.post('/connect', isOwnerMiddleware, async (req, res) => {
  try {
    const { connectionMethod } = req.body;
    let session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) {
      session = await WhatsAppSession.create({
        userId: req.user?.uid || null,
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
      res.json({ success: true, connectionStatus: 'qr_pending', qrCode: qrData, qrExpiry, message: 'Scan the QR code with WhatsApp to connect' });
    } else if (connectionMethod === 'meta') {
      session.connectionStatus = 'connecting';
      await session.save();
      const metaAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.META_APP_ID || 'YOUR_META_APP_ID'}&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI || 'https://whitecaves.com/api/whatsapp/meta/callback')}&scope=whatsapp_business_management,whatsapp_business_messaging&response_type=code&state=${session.sessionId}`;
      res.json({ success: true, connectionStatus: 'connecting', authUrl: metaAuthUrl, message: 'Redirect to Meta to authenticate' });
    } else {
      res.status(400).json({ error: 'Invalid connection method' });
    }
  } catch (error) {
    console.error('Error initiating WhatsApp connection:', error);
    res.status(500).json({ error: 'Failed to initiate connection' });
  }
});

router.post('/disconnect', isOwnerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    session.connectionStatus = 'disconnected';
    session.lastQrCode = null;
    session.qrCodeExpiry = null;
    session.accessToken = null;
    session.refreshToken = null;
    session.connectedAt = null;
    await session.save();
    res.json({ success: true, message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: 'Failed to disconnect' });
  }
});

router.put('/session/settings', isOwnerMiddleware, async (req, res) => {
  try {
    const { autoReplyEnabled, chatbotEnabled, businessHoursOnly, businessHours, welcomeMessage, awayMessage, quickReplies } = req.body;
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    if (autoReplyEnabled !== undefined) session.autoReplyEnabled = autoReplyEnabled;
    if (chatbotEnabled !== undefined) session.chatbotEnabled = chatbotEnabled;
    if (businessHoursOnly !== undefined) session.businessHoursOnly = businessHoursOnly;
    if (businessHours) session.businessHours = { ...session.businessHours, ...businessHours };
    if (welcomeMessage) session.welcomeMessage = welcomeMessage;
    if (awayMessage) session.awayMessage = awayMessage;
    if (quickReplies) session.quickReplies = quickReplies;
    await session.save();
    res.json({ success: true, message: 'Settings updated successfully', settings: { autoReplyEnabled: session.autoReplyEnabled, chatbotEnabled: session.chatbotEnabled, businessHoursOnly: session.businessHoursOnly, businessHours: session.businessHours, welcomeMessage: session.welcomeMessage, awayMessage: session.awayMessage, quickReplies: session.quickReplies } });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

router.get('/qr/refresh', isOwnerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    const qrData = `whatsapp://connect?session=${session.sessionId}&token=${crypto.randomBytes(32).toString('base64')}&t=${Date.now()}`;
    const qrExpiry = new Date(Date.now() + 5 * 60 * 1000);
    session.connectionStatus = 'qr_pending';
    session.lastQrCode = qrData;
    session.qrCodeExpiry = qrExpiry;
    await session.save();
    res.json({ success: true, qrCode: qrData, qrExpiry });
  } catch (error) {
    console.error('Error refreshing QR code:', error);
    res.status(500).json({ error: 'Failed to refresh QR code' });
  }
});

router.post('/simulate/connect', isOwnerMiddleware, async (req, res) => {
  try {
    const session = await WhatsAppSession.findOne({ ownerEmail: OWNER_EMAIL });
    if (!session) return res.status(404).json({ error: 'No session found' });
    session.connectionStatus = 'connected';
    session.phoneNumber = '+971 56 361 6136';
    session.connectedAt = new Date();
    await session.save();
    res.json({ success: true, connectionStatus: 'connected', phoneNumber: session.phoneNumber, connectedAt: session.connectedAt });
  } catch (error) {
    console.error('Error simulating connection:', error);
    res.status(500).json({ error: 'Failed to simulate connection' });
  }
});

router.get('/meta/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code || !state) return res.redirect('/owner/whatsapp/settings?error=missing_params');
    const session = await WhatsAppSession.findOne({ sessionId: state });
    if (!session) return res.redirect('/owner/whatsapp/settings?error=invalid_session');
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

router.post('/chatbot/test', isOwnerMiddleware, async (req, res) => {
  try {
    const { message, conversationId = 'test_conversation' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const result = chatbotService.processMessage(message, conversationId);
    const leadScore = chatbotService.calculateLeadScore(conversationId);

    res.json({
      success: true,
      input: message,
      response: result.response,
      intent: result.intent,
      confidence: Math.round(result.confidence * 100),
      language: result.language,
      entities: result.entities,
      suggestedActions: result.suggestedActions,
      leadScore
    });
  } catch (error) {
    console.error('Chatbot test error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

router.post('/chatbot/clear-context', isOwnerMiddleware, (req, res) => {
  const { conversationId = 'test_conversation' } = req.body;
  chatbotService.clearContext(conversationId);
  res.json({ success: true, message: 'Conversation context cleared' });
});

router.post('/simulate/message', isOwnerMiddleware, async (req, res) => {
  try {
    const { from, message } = req.body;
    if (!from || !message) return res.status(400).json({ error: 'from and message are required' });

    const webhookPayload = {
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: from,
              type: 'text',
              text: { body: message }
            }]
          }
        }]
      }]
    };

    const response = await fetch(`http://localhost:${req.app.locals.PORT}/api/whatsapp/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload)
    });

    res.json({ success: true, message: 'Simulated message sent to webhook', webhookResponse: response.status });
  } catch (error) {
    console.error('Simulate message error:', error);
    res.status(500).json({ error: 'Failed to simulate message' });
  }
});

export default router;
