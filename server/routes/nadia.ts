import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission } from '../middleware/rbac.js';
import {
  createConversation,
  getConversation,
  listConversations,
  updateConversation,
  assignConversation,
  closeConversation,
  deleteConversation,
  sendMessage,
  replyConversation,
  getMessages,
  convertConversationToLead,
  getQueue,
  getQueueStatsHandler,
  assignQueueEntry,
  classifyAssistant,
  autoResponseAssistant,
  respondAssistant,
  getNadiaHealth,
  searchMaryInventory,
  alertHenry,
  getCrossStatus,
  getWabaEnhancements,
  getWabaMatrix,
  getMetaPolicies,
} from '../controllers/nadia/index.js';

const router = Router();

// ─── Conversations Lifecycle ──────────────────────────────────────────────────
router.post('/conversations', requirePermission('reply_whatsapp_conversations'), asyncHandler(createConversation));
router.get('/conversations/:conversationId', requirePermission('view_whatsapp_conversations'), asyncHandler(getConversation));
router.get('/conversations', requirePermission('view_whatsapp_conversations'), asyncHandler(listConversations));
router.patch('/conversations/:conversationId', requirePermission('assign_whatsapp_conversations', 'close_whatsapp_conversations'), asyncHandler(updateConversation));
router.patch('/conversations/:conversationId/assign', requirePermission('assign_whatsapp_conversations'), asyncHandler(assignConversation));
router.patch('/conversations/:conversationId/close', requirePermission('close_whatsapp_conversations'), asyncHandler(closeConversation));
router.delete('/conversations/:conversationId', requirePermission('close_whatsapp_conversations'), asyncHandler(deleteConversation));

// ─── Messages & Lead Conversion ───────────────────────────────────────────────
router.post('/conversations/:conversationId/messages', requirePermission('reply_whatsapp_conversations'), asyncHandler(sendMessage));
router.post('/conversations/:conversationId/reply', requirePermission('reply_whatsapp_conversations'), asyncHandler(replyConversation));
router.get('/conversations/:conversationId/messages', requirePermission('view_whatsapp_conversations'), asyncHandler(getMessages));
router.post('/conversations/:conversationId/convert-to-lead', requirePermission('manage_leads'), asyncHandler(convertConversationToLead));

// ─── Queue Management ─────────────────────────────────────────────────────────
router.get('/queue', requirePermission('view_whatsapp_conversations'), asyncHandler(getQueue));
router.get('/queue-stats', requirePermission('view_whatsapp_conversations'), asyncHandler(getQueueStatsHandler));
router.patch('/queue/:queueId/assign', requirePermission('assign_whatsapp_conversations'), asyncHandler(assignQueueEntry));

// ─── WhatsApp Assistant Intelligence ─────────────────────────────────────────
router.post('/assistant/classify', requirePermission('view_whatsapp_conversations'), asyncHandler(classifyAssistant));
router.post('/assistant/auto-response', requirePermission('view_whatsapp_conversations'), asyncHandler(autoResponseAssistant));
router.post('/assistant/respond', requirePermission('reply_whatsapp_conversations'), asyncHandler(respondAssistant));

// ─── System Health & Cross-Agent Integrations ─────────────────────────────────
router.get('/health', requirePermission('view_whatsapp_conversations'), asyncHandler(getNadiaHealth));
router.post('/mary-search', requirePermission('view_whatsapp_conversations'), asyncHandler(searchMaryInventory));
router.post('/henry-alert', requirePermission('view_whatsapp_conversations'), asyncHandler(alertHenry));
router.get('/cross-status', requirePermission('view_whatsapp_conversations'), asyncHandler(getCrossStatus));
router.get('/waba/enhancements', requirePermission('view_whatsapp_conversations'), asyncHandler(getWabaEnhancements));
router.get('/waba/enhancements/matrix', requirePermission('view_whatsapp_conversations'), asyncHandler(getWabaMatrix));
router.get('/meta/policies', requirePermission('view_whatsapp_conversations'), asyncHandler(getMetaPolicies));

export default router;
