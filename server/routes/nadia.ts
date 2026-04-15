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
  generateBotResponse,
} from '../services/nadia/messageProcessor.js';
import { getQueuedConversations, assignFromQueue } from '../services/nadia/queueManager.js';
import { requirePermission } from '../middleware/rbac';
import { validate, rules, validateIdParam } from '../utils/validate.js';
import { sanitizeString } from '../utils/sanitize.js';

const router = Router();

// ============================================================================
// CONVERSATION ENDPOINTS
// ============================================================================

/**
 * POST /api/nadia/conversations
 * Create a new conversation (customer initiates contact)
 */
router.post(
  '/conversations',
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { wabaId, customerPhone, initialMessage } = req.body;

    validate(req.body, {
      customerPhone: rules.requiredString('Customer Phone'),
      wabaId: rules.optionalString('WABA ID'),
      initialMessage: rules.optionalStringWithMax('Initial Message', 4096),
    });

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
      const entities = extractEntities(initialMessage);
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
          body: sanitizeString(initialMessage),
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
  requirePermission('access_whatsapp_business'),
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
  requirePermission('access_whatsapp_business'),
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
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (agentPhone) {
      filter.agentPhone = agentPhone;
    }

    // Determine sort field
    const sortField =
      sortBy === 'leadScore'
        ? 'leadScore'
        : sortBy === 'updatedAt'
          ? 'updatedAt'
          : 'createdAt';

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
        hasMore: (parseInt(offset as string) || 0) + parseInt(limit as string || '20') < total,
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
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    validateIdParam(conversationId, 'conversation');
    const { status, agentPhone, closedReason } = req.body;

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    const updateData: any = {};

    if (status) {
      const validStatuses = ['active', 'assigned_to_agent', 'closed', 'bot_handling'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      updateData.status = status;
      if (status === 'assigned_to_agent' && agentPhone) {
        updateData.agentPhone = agentPhone;
        updateData.routedAt = new Date();
      }
      if (status === 'closed') {
        updateData.closedAt = new Date();
        updateData.closedReason = closedReason ? sanitizeString(closedReason) : 'completed';
      }
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
 * DELETE /api/nadia/conversations/:conversationId
 * Close/delete a conversation
 */
router.delete(
  '/conversations/:conversationId',
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    validateIdParam(conversationId, 'conversation');
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
        closedReason: reason ? sanitizeString(reason) : 'closed_by_user',
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
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    validateIdParam(conversationId, 'conversation');
    const { content, senderType = 'customer', senderPhone } = req.body;

    validate(req.body, {
      content: rules.requiredStringWithMax('Content', 4096),
      senderType: rules.oneOf('Sender Type', ['customer', 'agent', 'bot']),
    });

    const conversation = await prisma.nadiaConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 404);
    }

    // Process message if from customer
    const sentiment = senderType === 'customer' ? detectSentiment(content) : null;
    const entities = senderType === 'customer' ? extractEntities(content) : null;
    const updatedIntent =
      senderType === 'customer' ? detectIntent(content) : conversation.intent;

    // Create message
    const message = await prisma.nadiaMessage.create({
      data: {
        conversationId,
        waMessageId: `local-${Date.now()}`,
        direction: senderType === 'customer' ? 'inbound' : 'outbound',
        body: sanitizeString(content),
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
 * GET /api/nadia/conversations/:conversationId/messages
 * Get all messages for a conversation
 */
router.get(
  '/conversations/:conversationId/messages',
  requirePermission('access_whatsapp_business'),
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
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { limit = 10 } = req.query;

    const queued = await getQueuedConversations(
      Math.min(parseInt(limit as string) || 10, 100)
    );

    res.status(200).json({
      success: true,
      data: queued,
    });
  })
);

/**
 * PATCH /api/nadia/queue/:queueId/assign
 * Assign a queued conversation to an agent
 */
router.patch(
  '/queue/:queueId/assign',
  requirePermission('access_whatsapp_business'),
  asyncHandler(async (req: Request, res: Response) => {
    const { queueId } = req.params;
    validateIdParam(queueId, 'queueId');
    const { agentPhone } = req.body;

    validate(req.body, {
      agentPhone: rules.requiredString('Agent Phone'),
    });

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
// HEALTH CHECK
// ============================================================================

/**
 * GET /api/nadia/health
 * Health check endpoint
 */
router.get(
  '/health',
  requirePermission('access_whatsapp_business'),
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
