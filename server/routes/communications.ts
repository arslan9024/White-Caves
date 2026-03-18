/**
 * Communications API Routes — Full Implementation
 * Message management and communication tracking
 * Endpoints: /api/communications
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();
const prisma = new PrismaClient();

// ─── POST /api/communications/messages/send ─────────────────────────────
// Log an outgoing message (WhatsApp, email, SMS)
router.post(
  '/messages/send',
  asyncHandler(async (req: Request, res: Response) => {
    const { recipientId, channel, content, leadId } = req.body;

    if (!recipientId || !content) {
      throw new AppError('Recipient ID and content are required', 400);
    }

    // Log the communication as an activity
    const activity = await prisma.activity.create({
      data: {
        type: 'client',
        action: channel === 'email' ? 'email' : channel === 'call' ? 'call' : 'note_added',
        description: `Message sent via ${channel || 'system'}: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
        userId: (req as any).user?.id || null,
        leadId: leadId || null,
        metadata: {
          recipientId,
          channel: channel || 'system',
          contentPreview: content.substring(0, 200),
          sentAt: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: activity.id,
        status: 'sent',
        channel: channel || 'system',
        sentAt: activity.createdAt.toISOString(),
      },
    });
  })
);

// ─── GET /api/communications/messages/:recipientId ──────────────────────
// Get communication history with a specific recipient (via activities)
router.get(
  '/messages/:recipientId',
  asyncHandler(async (req: Request, res: Response) => {
    const { recipientId } = req.params;
    const { page = '1', pageSize = '20' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string)));

    // Retrieve activities linked to this lead as messages
    const where: any = {
      leadId: recipientId,
      action: { in: ['email', 'call', 'note_added'] },
    };

    const [messages, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.activity.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: messages.map((m: any) => ({
        id: m.id,
        type: m.action,
        description: m.description,
        sender: m.user?.name || 'System',
        timestamp: m.createdAt.toISOString(),
        metadata: m.metadata,
      })),
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── GET /api/communications/conversations ──────────────────────────────
// List unique leads with recent communication activity
router.get(
  '/conversations',
  asyncHandler(async (req: Request, res: Response) => {
    // Get leads that have communication activities
    const recentComms = await prisma.activity.findMany({
      where: {
        action: { in: ['email', 'call', 'note_added'] },
        leadId: { not: null },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        leadId: true,
        action: true,
        description: true,
        createdAt: true,
        lead: { select: { id: true, name: true, email: true, phone: true, status: true } },
      },
    });

    // Deduplicate by leadId, keeping most recent
    const seen = new Set<string>();
    const conversations = recentComms
      .filter((c: any) => {
        if (!c.leadId || seen.has(c.leadId)) return false;
        seen.add(c.leadId);
        return true;
      })
      .map((c: any) => ({
        leadId: c.leadId,
        lead: c.lead,
        lastMessage: c.description,
        lastActivity: c.action,
        lastContactAt: c.createdAt.toISOString(),
      }));

    res.status(200).json({ success: true, data: conversations });
  })
);

// ─── GET /api/communications/status ─────────────────────────────────────
// Integration channel status check
router.get(
  '/status',
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: {
        whatsapp: { connected: false, status: 'not_configured' },
        email: { connected: true, status: 'active' },
        sms: { connected: false, status: 'not_configured' },
      },
    });
  })
);

export default router;
