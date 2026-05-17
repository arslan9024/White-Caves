/**
 * NADIA WhatsApp CRM API Routes
 * Handles conversation lifecycle, message management, and queue routing
 * Mock mode: No Meta API credentials required
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import {
  detectIntent,
  calculateLeadScore,
  detectSentiment,
  extractEntities,
} from '../services/nadia/messageProcessor.js';
import {
  getQueuedConversations,
  assignFromQueue,
  queueConversationForAssignment,
  getQueueStats,
} from '../services/nadia/queueManager.js';
import {
  classifyWhatsAppIntent,
  generateWhatsAppAutoResponse,
} from '../services/nadia/whatsappAssistant.js';
import whatsAppBotService from '../services/WhatsAppBotService.js';
import { requirePermission, resolveBackendRole, roleHasPermission } from '../middleware/rbac';
import type { AuthRequest } from '../middleware/auth';

const router = Router();

const ALLOWED_CONVERSATION_STATUSES = ['active', 'assigned_to_agent', 'in_bot_flow', 'closed'];

const canPerform = (req: Request, permission: string): boolean => {
  const role = (req as AuthRequest).user?.role;
  if (!role) return false;
  return roleHasPermission(resolveBackendRole(role), permission);
};

// ============================================================================
// CONVERSATION ENDPOINTS
// ============================================================================

/**
 * POST /api/nadia/conversations
 * Create a new conversation (customer initiates contact)
 */
router.post(
  '/conversations',
  requirePermission('reply_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { wabaId, customerPhone, initialMessage } = req.body;

    if (!customerPhone) {
      throw new AppError('customerPhone is required', 400);
    }

    // Create conversation
    const conversation = await prisma.nadiaConversation.create({
      data: {
        wabaId: wabaId || 'mock-waba-id',
        customerPhone,
        status: 'active',
        intent: null,
        leadScore: 50, // Initial score
        timeline: null,
      },
      include: {
        messages: true,
        queue: true,
      },
    });

    // If initialMessage provided, process it
    if (initialMessage) {
      const intent = detectIntent(initialMessage);
      const sentiment = detectSentiment(initialMessage);
      const leadScore = calculateLeadScore({
        messageCount: 1,
        intent,
        sentiment,
        hasPhone: !!customerPhone,
      });

      // Create first message
      await prisma.nadiaMessage.create({
        data: {
          conversationId: conversation.id,
          waMessageId: `local-${Date.now()}`,
          direction: 'inbound',
          body: initialMessage,
          messageType: 'text',
          status: 'delivered',
          timestamp: new Date(),
        },
      });

      // Update conversation with detected intent and score
      await prisma.nadiaConversation.update({
        where: { id: conversation.id },
        data: {
          intent,
          leadScore,
        },
      });
    }

    const updated = await prisma.nadiaConversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: true,
        queue: true,
      },
    });

    res.status(201).json({
      success: true,
      data: updated,
    });
  })
);

/**
 * GET /api/nadia/conversations/:conversationId
 * Fetch conversation details
 */
router.get(
  '/conversations/:conversationId',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
        queue: true,
      },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    res.status(200).json({
      success: true,
      data: conversation,
    });
  })
);

/**
 * GET /api/nadia/conversations
 * List conversations with optional filtering and sorting
 */
router.get(
  '/conversations',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 20,
      offset = 0,
      agentPhone,
    } = req.query;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (agentPhone) {
      filter.agentPhone = agentPhone;
    }

    // Determine sort field
    const sortField =
      sortBy === 'leadScore' ? 'leadScore' : sortBy === 'updatedAt' ? 'updatedAt' : 'createdAt';

    // Get total count
    const total = await prisma.nadiaConversation.count({
      where: filter,
    });

    // Get paginated results
    const data = await prisma.nadiaConversation.findMany({
      where: filter,
      orderBy: {
        [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
      },
      take: Math.min(parseInt(limit as string) || 20, 100), // Max 100 per page
      skip: parseInt(offset as string) || 0,
      include: {
        messages: {
          take: 3, // Last 3 messages for preview
          orderBy: { timestamp: 'desc' },
        },
        queue: true,
      },
    });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        total,
        offset: parseInt(offset as string) || 0,
        limit: parseInt(limit as string) || 20,
        hasMore: (parseInt(offset as string) || 0) + parseInt((limit as string) || '20') < total,
      },
    });
  })
);

/**
 * PATCH /api/nadia/conversations/:conversationId
 * Update conversation (status, agent assignment, etc.)
 */
router.patch(
  '/conversations/:conversationId',
  requirePermission('assign_whatsapp_conversations', 'close_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { status, agentPhone, closedReason } = req.body;

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    if (status !== undefined) {
      if (typeof status !== 'string' || !ALLOWED_CONVERSATION_STATUSES.includes(status)) {
        throw new AppError(
          `Invalid status. Must be one of: ${ALLOWED_CONVERSATION_STATUSES.join(', ')}`,
          400
        );
      }

      if (status === 'assigned_to_agent' && (!agentPhone || typeof agentPhone !== 'string')) {
        throw new AppError('agentPhone is required when assigning a conversation', 400);
      }

      if (status === 'assigned_to_agent' && !canPerform(req, 'assign_whatsapp_conversations')) {
        throw new AppError(
          'Access denied — requires permission: assign_whatsapp_conversations',
          403
        );
      }

      if (status === 'closed' && !canPerform(req, 'close_whatsapp_conversations')) {
        throw new AppError(
          'Access denied — requires permission: close_whatsapp_conversations',
          403
        );
      }

      if (
        status !== 'closed' &&
        status !== 'assigned_to_agent' &&
        !canPerform(req, 'assign_whatsapp_conversations')
      ) {
        throw new AppError(
          'Access denied — requires permission: assign_whatsapp_conversations',
          403
        );
      }
    }

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
      if (status === 'assigned_to_agent' && agentPhone) {
        updateData.agentPhone = agentPhone;
        updateData.routedAt = new Date();
      }
      if (status === 'closed') {
        updateData.closedAt = new Date();
        updateData.closedReason = closedReason || 'completed';
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError('No valid update fields provided', 400);
    }

    const updated = await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: updateData,
      include: {
        messages: true,
        queue: true,
      },
    });

    res.status(200).json({
      success: true,
      data: updated,
    });
  })
);

/**
 * PATCH /api/nadia/conversations/:conversationId/assign
 * Explicit assignment endpoint for inbox workflow
 */
router.patch(
  '/conversations/:conversationId/assign',
  requirePermission('assign_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { agentPhone } = req.body;

    if (!agentPhone || typeof agentPhone !== 'string') {
      throw new AppError('agentPhone is required', 400);
    }

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const updated = await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        status: 'assigned_to_agent',
        agentPhone,
        routedAt: new Date(),
      },
      include: {
        messages: true,
        queue: true,
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

/**
 * PATCH /api/nadia/conversations/:conversationId/close
 * Explicit close endpoint for inbox workflow
 */
router.patch(
  '/conversations/:conversationId/close',
  requirePermission('close_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { reason } = req.body;

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const closed = await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        status: 'closed',
        closedAt: new Date(),
        closedReason: typeof reason === 'string' && reason.trim() ? reason : 'closed_by_user',
      },
      include: {
        messages: true,
        queue: true,
      },
    });

    res.status(200).json({ success: true, data: closed });
  })
);

/**
 * DELETE /api/nadia/conversations/:conversationId
 * Close/delete a conversation
 */
router.delete(
  '/conversations/:conversationId',
  requirePermission('close_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { reason } = req.body;

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Don't actually delete — just mark as closed
    const closed = await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        status: 'closed',
        closedAt: new Date(),
        closedReason: reason || 'closed_by_user',
      },
      include: {
        messages: true,
        queue: true,
      },
    });

    res.status(200).json({
      success: true,
      data: closed,
    });
  })
);

// ============================================================================
// MESSAGE ENDPOINTS
// ============================================================================

/**
 * POST /api/nadia/conversations/:conversationId/messages
 * Send a message (customer or agent)
 */
router.post(
  '/conversations/:conversationId/messages',
  requirePermission('reply_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { content, senderType = 'customer' } = req.body;

    if (!content) {
      throw new AppError('content is required', 400);
    }

    if (!['customer', 'agent'].includes(senderType)) {
      throw new AppError('senderType must be customer or agent', 400);
    }

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Process message if from customer
    const sentiment = senderType === 'customer' ? detectSentiment(content) : null;
    extractEntities(content);
    const updatedIntent = senderType === 'customer' ? detectIntent(content) : conversation.intent;

    // Create message
    const message = await prisma.nadiaMessage.create({
      data: {
        conversationId,
        waMessageId: `local-${Date.now()}`,
        direction: senderType === 'customer' ? 'inbound' : 'outbound',
        body: content,
        messageType: 'text',
        status: 'delivered',
        timestamp: new Date(),
      },
    });

    // If customer message, recalculate lead score and update intent
    if (senderType === 'customer') {
      const messageCount = await prisma.nadiaMessage.count({
        where: { conversationId },
      });

      const newScore = calculateLeadScore({
        messageCount,
        intent: updatedIntent ?? undefined,
        sentiment: sentiment ?? undefined,
        hasPhone: !!conversation.customerPhone,
      });

      await prisma.nadiaConversation.update({
        where: { id: conversationId },
        data: {
          intent: updatedIntent,
          leadScore: newScore,
        },
      });
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  })
);

/**
 * POST /api/nadia/conversations/:conversationId/reply
 * Explicit agent reply endpoint for inbox workflow
 */
router.post(
  '/conversations/:conversationId/reply',
  requirePermission('reply_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      throw new AppError('content is required', 400);
    }

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const messageBody = content.trim();

    const outbound = await prisma.nadiaMessage.create({
      data: {
        conversationId,
        waMessageId: `local-reply-${Date.now()}`,
        direction: 'outbound',
        body: messageBody,
        messageType: 'text',
        status: 'pending',
        timestamp: new Date(),
      },
    });

    try {
      const sentMessageId = await whatsAppBotService.sendMessage(
        conversation.customerPhone,
        messageBody
      );

      await prisma.nadiaMessage.update({
        where: { id: outbound.id },
        data: {
          status: sentMessageId ? 'sent' : 'delivered',
          ...(sentMessageId ? { waMessageId: sentMessageId } : {}),
        },
      });
    } catch {
      await prisma.nadiaMessage.update({
        where: { id: outbound.id },
        data: { status: 'failed' },
      });

      throw new AppError('Failed to send WhatsApp reply via Meta adapter', 502);
    }

    await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        status: conversation.status === 'closed' ? 'assigned_to_agent' : conversation.status,
        updatedAt: new Date(),
      },
    });

    res.status(201).json({ success: true, data: outbound });
  })
);

/**
 * GET /api/nadia/conversations/:conversationId/messages
 * Get all messages for a conversation
 */
router.get(
  '/conversations/:conversationId/messages',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await prisma.nadiaMessage.findMany({
      where: { conversationId },
      orderBy: { timestamp: 'asc' },
      take: Math.min(parseInt(limit as string) || 50, 200),
      skip: parseInt(offset as string) || 0,
    });

    const total = await prisma.nadiaMessage.count({
      where: { conversationId },
    });

    res.status(200).json({
      success: true,
      data: messages,
      pagination: {
        total,
        limit: parseInt(limit as string) || 50,
        offset: parseInt(offset as string) || 0,
      },
    });
  })
);

// ============================================================================
// QUEUE ENDPOINTS
// ============================================================================

/**
 * GET /api/nadia/queue
 * Get conversations waiting for assignment (priority-ranked)
 */
router.get(
  '/queue',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit = 10 } = req.query;

    const queued = await getQueuedConversations(Math.min(parseInt(limit as string) || 10, 100));

    res.status(200).json({
      success: true,
      data: queued,
    });
  })
);

/**
 * GET /api/nadia/queue-stats
 * Get queue summary for the Nadia dashboard.
 */
router.get(
  '/queue-stats',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (_req: Request, res: Response) => {
    const stats = await getQueueStats();

    res.status(200).json({
      success: true,
      data: {
        totalQueued: stats.totalQueued,
        byPriority: {
          URGENT: stats.hotCount,
          HIGH: stats.warmCount,
          NORMAL: 0,
          LOW: stats.coldCount,
        },
        avgResponseTimeMinutes: 0,
        agentAvailability: stats.totalQueued === 0 ? 100 : Math.max(0, 100 - stats.totalQueued * 5),
        oldestInQueueMinutes: stats.oldestWaitMinutes,
      },
    });
  })
);

/**
 * PATCH /api/nadia/queue/:queueId/assign
 * Assign a queued conversation to an agent
 */
router.patch(
  '/queue/:queueId/assign',
  requirePermission('assign_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { queueId } = req.params;
    const { agentPhone } = req.body;

    if (!agentPhone) {
      throw new AppError('agentPhone is required', 400);
    }

    const assigned = await assignFromQueue(queueId, agentPhone);

    if (!assigned) {
      throw new AppError('Queue entry not found', 404);
    }

    res.status(200).json({
      success: true,
      data: assigned,
    });
  })
);

// ============================================================================
// WHATSAPP ASSISTANT ENDPOINTS (Phase 4D)
// ============================================================================

/**
 * POST /api/nadia/assistant/classify
 * Classify intent and return assistant decision metadata
 */
router.post(
  '/assistant/classify',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      throw new AppError('message is required', 400);
    }

    const result = classifyWhatsAppIntent(message);
    res.status(200).json({ success: true, data: result });
  })
);

/**
 * POST /api/nadia/assistant/auto-response
 * Generate auto-response preview from message
 */
router.post(
  '/assistant/auto-response',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { message, customerName } = req.body;
    if (!message || typeof message !== 'string') {
      throw new AppError('message is required', 400);
    }

    const result = generateWhatsAppAutoResponse({ message, customerName });
    res.status(200).json({ success: true, data: result });
  })
);

/**
 * POST /api/nadia/assistant/respond
 * Process inbound message + persist generated auto-response to conversation
 */
router.post(
  '/assistant/respond',
  requirePermission('reply_whatsapp_conversations'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId, message, customerName } = req.body;

    if (!conversationId || typeof conversationId !== 'string') {
      throw new AppError('conversationId is required', 400);
    }
    if (!message || typeof message !== 'string') {
      throw new AppError('message is required', 400);
    }

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });
    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const assistant = generateWhatsAppAutoResponse({ message, customerName });

    const inbound = await prisma.nadiaMessage.create({
      data: {
        conversationId,
        waMessageId: `local-in-${Date.now()}`,
        direction: 'inbound',
        body: message,
        messageType: 'text',
        status: 'delivered',
        timestamp: new Date(),
      },
    });

    const outbound = await prisma.nadiaMessage.create({
      data: {
        conversationId,
        waMessageId: `local-out-${Date.now()}`,
        direction: 'outbound',
        body: assistant.response,
        messageType: 'text',
        status: 'delivered',
        timestamp: new Date(),
      },
    });

    const updatedConversation = await prisma.nadiaConversation.update({
      where: { id: conversationId },
      data: {
        intent: assistant.classification.intent,
        leadScore: assistant.classification.leadScore,
        status: assistant.classification.shouldEscalate ? 'assigned_to_agent' : 'in_bot_flow',
        routedAt: assistant.classification.shouldEscalate ? new Date() : conversation.routedAt,
      },
    });

    if (assistant.classification.shouldEscalate) {
      await queueConversationForAssignment(
        conversationId,
        assistant.classification.escalationReason || 'assistant_escalation'
      );
    }

    res.status(200).json({
      success: true,
      data: {
        classification: assistant.classification,
        response: assistant.response,
        responseType: assistant.responseType,
        messages: { inbound, outbound },
        conversation: updatedConversation,
      },
    });
  })
);

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/nadia/health
 * Health check endpoint
 */
router.get(
  '/health',
  requirePermission('view_whatsapp_conversations'),
  asyncHandler(async (_req: Request, res: Response) => {
    const conversationCount = await prisma.nadiaConversation.count();
    const messageCount = await prisma.nadiaMessage.count();
    const queueCount = await prisma.nadiaConversationQueue.count();

    res.status(200).json({
      success: true,
      status: 'operational',
      data: {
        conversationCount,
        messageCount,
        queueCount,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

export default router;
