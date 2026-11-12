import crypto from 'crypto';
import { Express, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../database.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import authMiddleware from '../middleware/auth.js';
import { WHATSAPP_WEBHOOK_SECRET } from '../config/env.js';
import logger from '../utils/logger.js';
import { requireRole, requirePermission } from '../middleware/rbac.js';

export function mountWhatsappCompatibilityRoutes(app: Express): void {
  // WhatsApp Webhook (public endpoint — requires webhook secret for verification)
  app.post(
    '/api/whatsapp/webhook',
    asyncHandler(async (req: Request, res: Response) => {
      if (!WHATSAPP_WEBHOOK_SECRET) {
        throw new AppError('WhatsApp webhook not configured — set WHATSAPP_WEBHOOK_SECRET', 500);
      }
      // SECURITY: Only accept webhook secret via header (never query params — they leak in logs)
      const webhookToken = (req.headers['x-webhook-token'] || '') as string;
      if (!webhookToken) {
        throw new AppError('Webhook token required in x-webhook-token header', 403);
      }
      // Use timing-safe comparison to prevent timing attacks on secret
      const expected = Buffer.from(WHATSAPP_WEBHOOK_SECRET, 'utf8');
      const received = Buffer.from(webhookToken, 'utf8');
      if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
        throw new AppError('Invalid webhook token', 403);
      }
      logger.debug('WhatsApp webhook received', {
        hasEntry: !!req.body?.entry,
        entryCount: req.body?.entry?.length ?? 0,
      });
      res.status(200).json({ success: true });
    })
  );

  // ============================================================================
  // STATIC ROUTES — Static APIs for frontend pages not yet backed by full CRUD
  // These prevent 404 errors and return meaningful empty/default data
  // ============================================================================

  // WhatsApp API stubs (WhatsAppSettingsPage, WhatsAppDashboardPage, WhatsAppChatbotPage)
  app.get(
    '/api/whatsapp/stats',
    authMiddleware,
    requirePermission('access_whatsapp_business'),
    asyncHandler(async (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        data: { totalMessages: 0, sentToday: 0, received: 0, activeChats: 0, sessions: [] },
      });
    })
  );
  app.get(
    '/api/whatsapp/settings',
    authMiddleware,
    requirePermission('access_whatsapp_business'),
    asyncHandler(async (_req: Request, res: Response) => {
      const row = await prisma.systemSetting.findUnique({ where: { key: 'whatsapp_settings' } });
      const defaults = { phoneNumber: '', connected: false, autoReply: false, businessHours: null };
      const data = row ? { ...defaults, ...(row.value as object) } : defaults;
      res.status(200).json({ success: true, data });
    })
  );
  app.put(
    '/api/whatsapp/settings',
    authMiddleware,
    requireRole('owner'),
    asyncHandler(async (req: Request, res: Response) => {
      const { phoneNumber, autoReply, businessHours } = req.body ?? {};
      const userId = (req as Request & { user?: { id: string } }).user?.id;
      const current = await prisma.systemSetting.findUnique({
        where: { key: 'whatsapp_settings' },
      });
      const existing = (current?.value ?? {}) as Record<string, unknown>;
      const updated: Prisma.InputJsonValue = {
        ...existing,
        ...(phoneNumber !== undefined && { phoneNumber: String(phoneNumber) }),
        ...(autoReply !== undefined && { autoReply: Boolean(autoReply) }),
        ...(businessHours !== undefined && { businessHours }),
      } as Prisma.InputJsonValue;
      await prisma.systemSetting.upsert({
        where: { key: 'whatsapp_settings' },
        update: {
          value: updated as Prisma.InputJsonValue,
          category: 'whatsapp',
          updatedBy: userId,
        },
        create: {
          key: 'whatsapp_settings',
          value: updated as Prisma.InputJsonValue,
          category: 'whatsapp',
          updatedBy: userId,
        },
      });
      res.status(200).json({ success: true, data: updated });
    })
  );
  app.post(
    '/api/whatsapp/session',
    authMiddleware,
    requireRole('owner'),
    asyncHandler(async (req: Request, res: Response) => {
      const { phoneNumber } = req.body ?? {};
      const userId = (req as Request & { user?: { id: string } }).user?.id;
      if (!phoneNumber)
        throw new AppError('phoneNumber is required to start a WhatsApp session', 400);
      const sessionId = `wa-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const sessionData = {
        sessionId,
        phoneNumber: String(phoneNumber),
        status: 'pending',
        startedAt: new Date().toISOString(),
      };
      await prisma.systemSetting.upsert({
        where: { key: 'whatsapp_session' },
        update: { value: sessionData, category: 'whatsapp', updatedBy: userId },
        create: {
          key: 'whatsapp_session',
          value: sessionData,
          category: 'whatsapp',
          updatedBy: userId,
        },
      });
      res.status(200).json({ success: true, data: sessionData });
    })
  );
  app.post(
    '/api/whatsapp/init',
    authMiddleware,
    requireRole('owner'),
    asyncHandler(async (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'WhatsApp initialization pending — configure phone number first',
      });
    })
  );
  app.post(
    '/api/whatsapp/disconnect',
    authMiddleware,
    requireRole('owner'),
    asyncHandler(async (_req: Request, res: Response) => {
      res.status(200).json({ success: true, message: 'WhatsApp disconnected' });
    })
  );
  app.post(
    '/api/whatsapp/message',
    authMiddleware,
    requirePermission('access_whatsapp_business'),
    asyncHandler(async (_req: Request, res: Response) => {
      res
        .status(200)
        .json({ success: true, data: { id: Date.now().toString(), status: 'queued' } });
    })
  );
  app.get(
    '/api/whatsapp/chatbot/messages',
    authMiddleware,
    requirePermission('access_whatsapp_business'),
    asyncHandler(async (req: Request, res: Response) => {
      const conversationId = req.query.conversationId as string | undefined;
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));

      const where = conversationId ? { conversationId } : {};
      const messages = await prisma.nadiaMessage.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
        include: { conversation: { select: { id: true, customerPhone: true, status: true } } },
      });

      res.status(200).json({ success: true, data: messages.reverse() });
    })
  );
  app.post(
    '/api/whatsapp/chatbot/messages',
    authMiddleware,
    requirePermission('access_whatsapp_business'),
    asyncHandler(async (req: Request, res: Response) => {
      const { conversationId, body, messageType = 'text', direction = 'outbound' } = req.body;
      if (!conversationId || !body) {
        throw new AppError('conversationId and body are required', 400);
      }

      const conversation = await prisma.nadiaConversation.findUnique({
        where: { id: conversationId },
      });
      if (!conversation) throw new AppError('Conversation not found', 404);

      const message = await prisma.nadiaMessage.create({
        data: {
          conversationId,
          waMessageId: `manual-${Date.now()}`,
          direction: ['inbound', 'outbound'].includes(direction) ? direction : 'outbound',
          body: String(body).slice(0, 4096),
          messageType: ['text', 'image', 'document', 'audio', 'video'].includes(messageType)
            ? messageType
            : 'text',
          status: 'sent',
          timestamp: new Date(),
        },
      });

      res.status(201).json({ success: true, data: message });
    })
  );
  app.delete(
    '/api/whatsapp/chatbot/messages/:id',
    authMiddleware,
    requirePermission('access_whatsapp_business'),
    asyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params as Record<string, string>;
      const message = await prisma.nadiaMessage.findUnique({ where: { id } });
      if (!message) throw new AppError('Message not found', 404);
      await prisma.nadiaMessage.delete({ where: { id } });
      res.status(200).json({ success: true });
    })
  );
}
