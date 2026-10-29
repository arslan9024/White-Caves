/**
 * nadiaConversationController.ts
 * Handlers for Nadia conversation lifecycle: creation, retrieval, listing, updates, assignment, and closing.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import {
  detectIntent,
  calculateLeadScore,
  detectSentiment,
} from '../../services/nadia/messageProcessor.js';
import {
  ALLOWED_CONVERSATION_STATUSES,
  canPerform,
} from './nadiaCommon.js';

export async function createConversation(req: Request, res: Response): Promise<void> {
  const { wabaId, customerPhone, initialMessage } = req.body;

  if (!customerPhone) {
    throw new AppError('customerPhone is required', 400);
  }

  const conversation = await prisma.nadiaConversation.create({
    data: {
      wabaId: wabaId || 'mock-waba-id',
      customerPhone,
      status: 'active',
      intent: null,
      leadScore: 50,
      timeline: null,
    },
    include: {
      messages: true,
      queue: true,
    },
  });

  if (initialMessage) {
    const intent = detectIntent(initialMessage);
    const sentiment = detectSentiment(initialMessage);
    const leadScore = calculateLeadScore({
      messageCount: 1,
      intent,
      sentiment,
      hasPhone: !!customerPhone,
    });

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
}

export async function getConversation(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;

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
}

export async function listConversations(req: Request, res: Response): Promise<void> {
  const {
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 20,
    offset = 0,
    agentPhone,
  } = req.query as Record<string, string | undefined>;

  const filter: Record<string, unknown> = {};
  if (status && status !== 'all') {
    filter.status = status;
  }
  if (agentPhone) {
    filter.agentPhone = agentPhone;
  }

  const sortField =
    sortBy === 'leadScore' ? 'leadScore' : sortBy === 'updatedAt' ? 'updatedAt' : 'createdAt';

  const total = await prisma.nadiaConversation.count({
    where: filter,
  });

  const data = await prisma.nadiaConversation.findMany({
    where: filter,
    orderBy: {
      [sortField]: sortOrder === 'asc' ? 'asc' : 'desc',
    },
    take: Math.min(parseInt(limit as string) || 20, 100),
    skip: parseInt(offset as string) || 0,
    include: {
      messages: {
        take: 3,
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
}

export async function updateConversation(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
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
}

export async function assignConversation(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
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
}

export async function closeConversation(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
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
}

export async function deleteConversation(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
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
}
