/**
 * nadiaAssistantController.ts
 * Handlers for WhatsApp assistant AI intent classification, auto-response preview, and automated responses.
 */

import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import {
  classifyWhatsAppIntent,
  generateWhatsAppAutoResponse,
} from '../../services/nadia/whatsappAssistant.js';
import { queueConversationForAssignment } from '../../services/nadia/queueManager.js';
import { getNadiaEscalationConfidenceThreshold } from './nadiaCommon.js';

export async function classifyAssistant(req: Request, res: Response): Promise<void> {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    throw new AppError('message is required', 400);
  }

  const result = classifyWhatsAppIntent(message);
  res.status(200).json({ success: true, data: result });
}

export async function autoResponseAssistant(req: Request, res: Response): Promise<void> {
  const { message, customerName } = req.body;
  if (!message || typeof message !== 'string') {
    throw new AppError('message is required', 400);
  }

  const escalationConfidenceThreshold = getNadiaEscalationConfidenceThreshold();
  const result = generateWhatsAppAutoResponse({
    message,
    customerName,
    escalationConfidenceThreshold,
  });
  res.status(200).json({ success: true, data: result });
}

export async function respondAssistant(req: Request, res: Response): Promise<void> {
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

  const escalationConfidenceThreshold = getNadiaEscalationConfidenceThreshold();
  const assistant = generateWhatsAppAutoResponse({
    message,
    customerName,
    escalationConfidenceThreshold,
  });

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
      assistant.classification.escalationReason || 'assistant_escalation',
      {
        source: 'assistant/respond',
        messagePreview: message.slice(0, 280),
        classification: {
          intent: assistant.classification.intent,
          confidence: assistant.classification.confidence,
          sentiment: assistant.classification.sentiment,
          entities: assistant.classification.entities,
          leadScore: assistant.classification.leadScore,
          firstResponseState: assistant.classification.firstResponseState,
          escalationReason: assistant.classification.escalationReason,
        },
      }
    );
  }

  res.status(200).json({
    success: true,
    data: {
      classification: assistant.classification,
      response: assistant.response,
      responseType: assistant.responseType,
      escalationPolicy: {
        confidenceThreshold: escalationConfidenceThreshold,
      },
      messages: { inbound, outbound },
      conversation: updatedConversation,
    },
  });
}
