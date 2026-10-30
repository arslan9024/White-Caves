/**
 * nadiaMessageController.ts
 * Handlers for inbound/outbound messages, agent replies, and lead conversion.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import type { AuthRequest } from '../../middleware/auth.js';
import {
  detectIntent,
  calculateLeadScore,
  detectSentiment,
  extractEntities,
} from '../../services/nadia/messageProcessor.js';
import whatsAppBotService from '../../services/WhatsAppBotService.js';

export async function sendMessage(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
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

  const sentiment = senderType === 'customer' ? detectSentiment(content) : null;
  extractEntities(content);
  const updatedIntent = senderType === 'customer' ? detectIntent(content) : conversation.intent;

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
}

export async function replyConversation(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
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
}

export async function getMessages(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as Record<string, string>;
  const { limit = 50, offset = 0 } = req.query as Record<string, string | undefined>;

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
}

export async function convertConversationToLead(req: Request, res: Response): Promise<void> {
  const { conversationId } = req.params as { conversationId: string };
  const authUser = (req as AuthRequest).user;

  const conversation = await prisma.nadiaConversation.findUnique({
    where: { id: conversationId },
    include: { queue: true, messages: { orderBy: { timestamp: 'asc' }, take: 1 } },
  });
  if (!conversation) throw new AppError('Conversation not found', 404);

  if (conversation.leadId) {
    const existingLead = await prisma.lead.findUnique({ where: { id: conversation.leadId } });
    res.status(200).json({ success: true, data: existingLead, alreadyConverted: true });
    return;
  }

  let assignedToId: string | null = null;
  if (conversation.agentPhone) {
    const agent = await prisma.user.findFirst({ where: { phone: conversation.agentPhone } });
    if (agent) assignedToId = agent.id;
  }
  if (!assignedToId && authUser?.id) assignedToId = authUser.id;

  const lead = await prisma.lead.create({
    data: {
      name: `WA: ${conversation.customerPhone}`,
      phone: conversation.customerPhone,
      source: 'whatsapp',
      status: 'new',
      score: conversation.leadScore,
      tags: ['whatsapp_conversion'],
      notes: `Converted from WhatsApp conversation ${conversationId}. Intent: ${conversation.intent ?? 'unknown'}`,
      assignedToId,
      createdById: authUser?.id ?? null,
    },
  });

  await prisma.nadiaConversation.update({
    where: { id: conversationId },
    data: {
      leadId: lead.id,
      convertedAt: new Date(),
      convertedByPhone: conversation.agentPhone ?? null,
    },
  });

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'created',
      description: `Lead created from WhatsApp conversation (${conversation.customerPhone})`,
      userId: authUser?.id ?? null,
      leadId: lead.id,
      metadata: { conversationId, source: 'whatsapp_conversion' },
    },
  });

  res.status(201).json({ success: true, data: lead, alreadyConverted: false });
}

