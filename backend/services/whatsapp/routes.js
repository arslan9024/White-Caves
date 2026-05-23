/**
 * WhatsApp Integration API Routes
 * 
 * RESTful endpoints for:
 * - Device linking & authentication
 * - Multi-account management
 * - Message sending & receiving
 * - Conversation & counter tracking
 * - Analytics & reporting
 */

const express = require('express');
const router = express.Router();

/**
 * Initialize WhatsApp routes
 */
function initializeWhatsAppRoutes(whatsappFactory) {
  const whatsappWeb = whatsappFactory.getComponent('whatsappWeb');
  const conversationTracker = whatsappFactory.getComponent('conversationTracker');
  const counterManager = whatsappFactory.getComponent('counterManager');

  /**
   * ==================== DEVICE LINKING ====================
   */

  /**
   * POST /api/whatsapp/link
   * Initiate WhatsApp device linking
   * Returns: QR code for scanning
   */
  router.post('/link', async (req, res) => {
    try {
      const { accountId, phoneNumber } = req.body;

      if (!accountId || !phoneNumber) {
        return res.status(400).json({
          error: 'accountId and phoneNumber required',
        });
      }

      const linkResult = await whatsappWeb.initiateDeviceLinking(accountId, phoneNumber);

      res.json({
        success: true,
        data: linkResult,
      });
    } catch (error) {
      console.error('[API] Link device error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/whatsapp/confirm-link
   * Confirm device linking after QR scan
   */
  router.post('/confirm-link', async (req, res) => {
    try {
      const { sessionId, authToken, phoneNumber } = req.body;

      if (!sessionId || !authToken) {
        return res.status(400).json({
          error: 'sessionId and authToken required',
        });
      }

      const result = await whatsappWeb.confirmDeviceLinking(
        sessionId,
        authToken,
        phoneNumber
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('[API] Confirm link error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * ==================== ACCOUNT MANAGEMENT ====================
   */

  /**
   * POST /api/whatsapp/connect
   * Connect authenticated WhatsApp account
   */
  router.post('/connect', async (req, res) => {
    try {
      const { accountId } = req.body;

      if (!accountId) {
        return res.status(400).json({ error: 'accountId required' });
      }

      const result = await whatsappWeb.connect(accountId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('[API] Connect error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/whatsapp/disconnect
   * Disconnect WhatsApp account
   */
  router.post('/disconnect', async (req, res) => {
    try {
      const { accountId } = req.body;

      if (!accountId) {
        return res.status(400).json({ error: 'accountId required' });
      }

      const result = await whatsappWeb.disconnect(accountId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('[API] Disconnect error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/whatsapp/unlink
   * Unlink WhatsApp account permanently
   */
  router.post('/unlink', async (req, res) => {
    try {
      const { accountId } = req.body;

      if (!accountId) {
        return res.status(400).json({ error: 'accountId required' });
      }

      const result = await whatsappWeb.unlinkAccount(accountId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('[API] Unlink error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/accounts
   * List all connected accounts
   */
  router.get('/accounts', async (req, res) => {
    try {
      const accounts = whatsappWeb.listAccounts();

      res.json({
        success: true,
        data: {
          accounts,
          count: accounts.length,
        },
      });
    } catch (error) {
      console.error('[API] List accounts error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/account/:accountId
   * Get account session info
   */
  router.get('/account/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;
      const session = whatsappWeb.getSession(accountId);

      if (!session) {
        return res.status(404).json({ error: 'Account not found' });
      }

      res.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error('[API] Get account error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * ==================== MESSAGING ====================
   */

  /**
   * POST /api/whatsapp/send
   * Send message via WhatsApp
   */
  router.post('/send', async (req, res) => {
    try {
      const { accountId, recipientPhone, message } = req.body;

      if (!accountId || !recipientPhone || !message) {
        return res.status(400).json({
          error: 'accountId, recipientPhone, and message required',
        });
      }

      const result = await whatsappWeb.sendMessage(
        accountId,
        recipientPhone,
        message
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('[API] Send message error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * ==================== CONVERSATIONS ====================
   */

  /**
   * GET /api/whatsapp/conversations/:accountId
   * List conversations for account
   */
  router.get('/conversations/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;
      const { limit = 50, skip = 0 } = req.query;

      const conversations = await conversationTracker.listConversations(accountId, {
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

      res.json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      console.error('[API] List conversations error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/conversation/:conversationId/messages
   * Get messages for conversation
   */
  router.get('/conversation/:conversationId/messages', async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { limit = 50, skip = 0 } = req.query;

      const messages = await conversationTracker.getMessages(conversationId, {
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

      res.json({
        success: true,
        data: messages,
      });
    } catch (error) {
      console.error('[API] Get messages error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/conversation/:conversationId/stats
   * Get conversation statistics
   */
  router.get('/conversation/:conversationId/stats', async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { accountId } = req.query;

      if (!accountId) {
        return res.status(400).json({ error: 'accountId required' });
      }

      const stats = await conversationTracker.getConversationStats(
        conversationId,
        accountId
      );

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error('[API] Get stats error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/whatsapp/conversation/:conversationId/mark-read
   * Mark conversation as read
   */
  router.post('/conversation/:conversationId/mark-read', async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { accountId } = req.body;

      if (!accountId) {
        return res.status(400).json({ error: 'accountId required' });
      }

      const result = await conversationTracker.markAsRead(conversationId, accountId);

      res.json({
        success: true,
        data: { messagesMarked: result },
      });
    } catch (error) {
      console.error('[API] Mark read error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/search/conversations
   * Search conversations
   */
  router.get('/search/conversations', async (req, res) => {
    try {
      const { accountId, q } = req.query;
      const { limit = 20, skip = 0 } = req.query;

      if (!accountId || !q) {
        return res.status(400).json({
          error: 'accountId and search query (q) required',
        });
      }

      const results = await conversationTracker.searchConversations(accountId, q, {
        limit: parseInt(limit),
        skip: parseInt(skip),
      });

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('[API] Search conversations error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/search/messages
   * Search messages
   */
  router.get('/search/messages', async (req, res) => {
    try {
      const { accountId, q, conversationId } = req.query;
      const { limit = 50, skip = 0 } = req.query;

      if (!accountId || !q) {
        return res.status(400).json({
          error: 'accountId and search query (q) required',
        });
      }

      const results = await conversationTracker.searchMessages(accountId, q, {
        limit: parseInt(limit),
        skip: parseInt(skip),
        conversationId,
      });

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      console.error('[API] Search messages error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * ==================== COUNTERS & ANALYTICS ====================
   */

  /**
   * GET /api/whatsapp/counters/:accountId
   * Get all counters for account
   */
  router.get('/counters/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;
      const { period = 'all' } = req.query;

      const counters = await counterManager.getCounters(accountId, period);

      res.json({
        success: true,
        data: counters,
      });
    } catch (error) {
      console.error('[API] Get counters error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/counters/:accountId/today
   * Get today's counters
   */
  router.get('/counters/:accountId/today', async (req, res) => {
    try {
      const { accountId } = req.params;

      const counters = await counterManager.getTodayCounters(accountId);

      res.json({
        success: true,
        data: counters,
      });
    } catch (error) {
      console.error('[API] Get today counters error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/counters/:accountId/week
   * Get this week's counters
   */
  router.get('/counters/:accountId/week', async (req, res) => {
    try {
      const { accountId } = req.params;

      const counters = await counterManager.getThisWeekCounters(accountId);

      res.json({
        success: true,
        data: counters,
      });
    } catch (error) {
      console.error('[API] Get week counters error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/counters/:accountId/month
   * Get this month's counters
   */
  router.get('/counters/:accountId/month', async (req, res) => {
    try {
      const { accountId } = req.params;

      const counters = await counterManager.getThisMonthCounters(accountId);

      res.json({
        success: true,
        data: counters,
      });
    } catch (error) {
      console.error('[API] Get month counters error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/metrics/:accountId
   * Get performance metrics
   */
  router.get('/metrics/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;

      const metrics = await counterManager.getPerformanceMetrics(accountId);

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error('[API] Get metrics error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/trends/:accountId
   * Get counter trends
   */
  router.get('/trends/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;
      const { days = 7 } = req.query;

      const trends = await counterManager.getCounterTrends(accountId, parseInt(days));

      res.json({
        success: true,
        data: trends,
      });
    } catch (error) {
      console.error('[API] Get trends error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/whatsapp/segments/:accountId
   * Get segment breakdown
   */
  router.get('/segments/:accountId', async (req, res) => {
    try {
      const { accountId } = req.params;
      const { period = 'today' } = req.query;

      const breakdown = await counterManager.getSegmentBreakdown(accountId, period);

      res.json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      console.error('[API] Get segments error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = {
  initializeWhatsAppRoutes,
  router,
};
