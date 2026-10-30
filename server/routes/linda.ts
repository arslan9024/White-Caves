import { Router } from 'express';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import {
  acknowledgeSentimentAlert,
  backgroundAnalysisOptIn,
  broadcastMessages,
  connectLinda,
  createCampaign,
  disconnectLinda,
  dispatchCampaign,
  dispatchDueCampaignsHandler,
  getCampaigns,
  getConversationHistory,
  getConversations,
  getGorahaSavedStatus,
  getHealth,
  getQr,
  getSentimentAlerts,
  getSessions,
  getStats,
  getStatus,
  henryTrigger,
  inventoryBroadcast,
  nlpRoute,
  readyCheck,
  sendMessage,
  transcribeAudio,
  webhookIngestion,
} from '../controllers/linda/index.js';

const router = Router();

// Connection & System Health
router.get('/status', requirePermission('view_whatsapp_conversations'), getStatus);
router.get('/qr', requirePermission('view_whatsapp_conversations'), getQr);
router.post('/connect', requireRole('owner', 'admin'), connectLinda);
router.post('/disconnect', requireRole('owner', 'admin'), disconnectLinda);
router.get('/stats', requirePermission('view_whatsapp_conversations'), getStats);
router.get('/sessions', requirePermission('view_whatsapp_conversations'), getSessions);
router.get('/health', getHealth);
router.post('/ready', readyCheck);

// Messaging & Conversations
router.post('/send/:conversationId', requirePermission('reply_whatsapp_conversations'), sendMessage);
router.post('/broadcast', requireRole('owner', 'admin'), broadcastMessages);
router.post('/webhook', requirePermission('view_whatsapp_conversations'), webhookIngestion);
router.get('/conversations', requirePermission('view_whatsapp_conversations'), getConversations);
router.get('/conversations/:phoneNumber/history', requirePermission('view_whatsapp_conversations'), getConversationHistory);
router.get('/conversations/:phoneNumber/goraha-saved', requirePermission('view_whatsapp_conversations'), getGorahaSavedStatus);

// Campaigns & Broadcasts
router.get('/campaigns', requireRole('owner', 'admin'), getCampaigns);
router.post('/campaigns', requireRole('owner', 'admin'), createCampaign);
router.post('/campaigns/:id/dispatch', requireRole('owner', 'admin'), dispatchCampaign);
router.post('/campaigns/dispatch-due', requireRole('owner', 'admin'), dispatchDueCampaignsHandler);
router.post('/inventory-broadcast', inventoryBroadcast);

// Intelligence & Cross-Assistant Integrations
router.post('/nlp-route', nlpRoute);
router.post('/henry-trigger', henryTrigger);
router.post('/transcribe', requirePermission('view_whatsapp_conversations'), transcribeAudio);
router.get('/sentiment-alerts', requirePermission('view_whatsapp_conversations'), getSentimentAlerts);
router.post('/sentiment-alerts/:alertId/acknowledge', requirePermission('view_whatsapp_conversations'), acknowledgeSentimentAlert);
router.post('/background-analysis/opt-in', requireRole('owner', 'admin'), backgroundAnalysisOptIn);

export default router;
