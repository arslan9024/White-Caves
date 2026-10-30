import { Request, Response } from 'express';
import { prisma } from '../../database.js';
import {
  normalizePhone,
  rateLimiter,
  renderTemplate,
} from '../../services/whatsapp/whatsappUtils.js';
import { getMetaClient } from './metaWebhookCommon.js';

export const sendMessageHandler = async (req: Request, res: Response) => {
  try {
    const { to, message, conversationId } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, message',
      });
    }

    const sendAllowance = rateLimiter.canSend(to);
    if (!sendAllowance.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded for WhatsApp sends',
        retryAfterMs: sendAllowance.retryAfterMs,
      });
    }

    const meta = getMetaClient();
    const messageId = await meta.sendMessage(to, message);

    let targetConvId = conversationId;
    if (!targetConvId) {
      const normalizedTo = normalizePhone(to) || to;
      const conv = await prisma.nadiaConversation.findFirst({
        where: { customerPhone: normalizedTo },
        orderBy: { createdAt: 'desc' },
      });
      targetConvId = conv?.id;
    }
    if (targetConvId) {
      await prisma.nadiaMessage
        .create({
          data: {
            conversationId: targetConvId,
            waMessageId: messageId || `agent-send-${Date.now()}`,
            direction: 'outbound',
            body: message,
            messageType: 'text',
            status: 'sent',
            timestamp: new Date(),
          },
        })
        .catch(err => console.error(err));
    }

    res.json({
      success: true,
      data: {
        conversationId: targetConvId,
        messageId,
        to,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        timestamp: new Date(),
        channel: 'META_API',
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error sending message:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const sendTemplateHandler = async (req: Request, res: Response) => {
  try {
    const { to, template, parameters, conversationId, languageCode = 'en' } = req.body;

    if (!to || !template) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, template',
      });
    }

    const sendAllowance = rateLimiter.canSend(to);
    if (!sendAllowance.allowed) {
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded for WhatsApp template sends',
        retryAfterMs: sendAllowance.retryAfterMs,
      });
    }

    const meta = getMetaClient();
    const messageId = await meta.sendTemplate(to, template, parameters, languageCode);
    const renderedBody = renderTemplate(template, parameters);

    let targetConvId = conversationId;
    if (!targetConvId) {
      const normalizedTo = normalizePhone(to) || to;
      const conv = await prisma.nadiaConversation.findFirst({
        where: { customerPhone: normalizedTo },
        orderBy: { createdAt: 'desc' },
      });
      targetConvId = conv?.id;
    }
    if (targetConvId) {
      await prisma.nadiaMessage
        .create({
          data: {
            conversationId: targetConvId,
            waMessageId: messageId || `agent-template-${Date.now()}`,
            direction: 'outbound',
            body: renderedBody,
            messageType: 'template',
            status: 'sent',
            timestamp: new Date(),
          },
        })
        .catch(err => console.error(err));
    }

    res.json({
      success: true,
      data: {
        conversationId: targetConvId,
        messageId,
        to,
        template,
        renderedBody,
        timestamp: new Date(),
        channel: 'META_API',
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error sending template:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const getStatusHandler = async (_req: Request, res: Response) => {
  try {
    const meta = getMetaClient();
    const stats = meta.getStats();

    const isConfigured =
      process.env.META_ACCESS_TOKEN &&
      process.env.META_BUSINESS_ACCOUNT_ID &&
      process.env.META_PHONE_NUMBER_ID;

    res.json({
      success: true,
      data: {
        configured: !!isConfigured,
        apiVersion: stats.apiVersion,
        phoneNumberId: stats.phoneNumberId
          ? stats.phoneNumberId.substring(0, 5) + '***'
          : 'NOT_SET',
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error getting status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const sendImageHandler = async (req: Request, res: Response) => {
  try {
    const { to, imageUrl, conversationId } = req.body;

    if (!to || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, imageUrl',
      });
    }

    const meta = getMetaClient();
    const messageId = await meta.sendImage(to, imageUrl);

    let targetConvId = conversationId;
    if (!targetConvId) {
      const normalizedTo = normalizePhone(to) || to;
      const conv = await prisma.nadiaConversation.findFirst({
        where: { customerPhone: normalizedTo },
        orderBy: { createdAt: 'desc' },
      });
      targetConvId = conv?.id;
    }
    if (targetConvId) {
      await prisma.nadiaMessage
        .create({
          data: {
            conversationId: targetConvId,
            waMessageId: messageId || `agent-img-${Date.now()}`,
            direction: 'outbound',
            body: imageUrl,
            messageType: 'image',
            status: 'sent',
            timestamp: new Date(),
          },
        })
        .catch(err => console.error(err));
    }

    res.json({
      success: true,
      data: {
        conversationId: targetConvId,
        messageId,
        to,
        imageUrl: imageUrl.substring(0, 50) + '...',
        channel: 'META_API',
      },
    });
  } catch (error) {
    console.error('[Meta Webhook] Error sending image:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
