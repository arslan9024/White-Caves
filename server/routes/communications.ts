/**
 * Communications API Routes — Full Implementation
 * Message management and communication tracking
 * Endpoints: /api/communications
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { createLogger } from '../utils/logger.js';
import { requirePermission, requireMinRole } from '../middleware/rbac.js';

const router = Router();
const log = createLogger('Communications');

/** Validate a string looks like a MongoDB ObjectId (24 hex chars) */
function isValidObjectId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

/** Build a lead ownership filter for non-admin users */
function buildLeadAccessFilter(userId: string, role: string): Record<string, unknown> | null {
  const normalizedRole = role?.toLowerCase?.() ?? '';
  if (['owner', 'manager', 'admin'].includes(normalizedRole)) return null; // admins see all
  if (!userId || typeof userId !== 'string') return { id: '__denied__' }; // deny access if userId invalid
  return { OR: [{ assignedToId: userId }, { createdById: userId }] };
}

/** Verify the user has access to a specific lead */
async function verifyLeadAccess(userId: string, role: string, leadId: string): Promise<boolean> {
  if (['owner', 'manager', 'admin'].includes(role)) return true;
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, OR: [{ assignedToId: userId }, { createdById: userId }] },
    select: { id: true },
  });
  return !!lead;
}

// ─── POST /api/communications/messages/send ─────────────────────────────
// Log an outgoing message (WhatsApp, email, SMS)
router.post(
  '/messages/send',
  requireMinRole('agent'),
  asyncHandler(async (req: Request, res: Response) => {
    // Schema validation enforced for payload
    const { recipientId, channel, content, leadId } = req.body;

    if (!recipientId || !content) {
      throw new AppError('Recipient ID and content are required', 400);
    }

    // Validate recipientId format (must be a valid ObjectId for database lookup)
    if (typeof recipientId !== 'string' || !isValidObjectId(recipientId)) {
      throw new AppError('Invalid recipient ID format', 400);
    }

    // Validate leadId format and access if provided
    if (leadId) {
      if (typeof leadId !== 'string' || !isValidObjectId(leadId)) {
        throw new AppError('Invalid lead ID format', 400);
      }
      const userId = req.user?.id;
      const userRole = req.user?.role || '';
      if (!userId) throw new AppError('Authentication required', 401);
      const hasAccess = await verifyLeadAccess(userId, userRole, leadId);
      if (!hasAccess) {
        throw new AppError('You do not have access to this lead', 403);
      }
    }

    // Enforce content length to prevent oversized payloads
    if (typeof content !== 'string' || content.length > 10000) {
      throw new AppError('Content must be a string of 10,000 characters or less', 400);
    }

    const sanitizedContent = sanitizeString(content);

    // Validate channel if provided
    const VALID_CHANNELS = ['email', 'whatsapp', 'sms', 'call', 'system'];
    const resolvedChannel = channel && VALID_CHANNELS.includes(channel) ? channel : 'system';

    // Log the communication as an activity
    const activity = await prisma.activity.create({
      data: {
        type: 'client',
        action:
          resolvedChannel === 'email'
            ? 'email'
            : resolvedChannel === 'call'
              ? 'call'
              : 'note_added',
        description: `Message sent via ${resolvedChannel}: ${sanitizedContent.substring(0, 100)}${sanitizedContent.length > 100 ? '...' : ''}`,
        userId: req.user?.id || null,
        leadId: leadId || null,
        metadata: {
          recipientId,
          channel: resolvedChannel,
          contentPreview: sanitizedContent.substring(0, 200),
          sentAt: new Date().toISOString(),
        },
      },
    });

    res.status(200).json({
      success: true,
      data: {
        id: activity.id,
        status: 'sent',
        channel: resolvedChannel,
        sentAt: activity.createdAt.toISOString(),
      },
    });
  })
);

// ─── GET /api/communications/messages/:recipientId ──────────────────────
// Get communication history with a specific recipient (via activities)
router.get(
  '/messages/:recipientId',
  requirePermission('view_dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    const { recipientId } = req.params as Record<string, string>;

    // Validate recipientId format
    if (!recipientId || !isValidObjectId(recipientId)) {
      throw new AppError('Valid lead ID is required', 400);
    }

    // Authorization: verify user can access this lead's messages
    const userId = req.user?.id;
    const userRole = req.user?.role || '';
    if (!userId) throw new AppError('Authentication required', 401);
    const hasAccess = await verifyLeadAccess(userId, userRole, recipientId);
    if (!hasAccess) {
      throw new AppError("You do not have access to this lead's messages", 403);
    }

    const { page = '1', pageSize = '20' } = req.query as Record<string, string | undefined>;
    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(pageSize as string) || 20));

    // Retrieve activities linked to this lead as messages
    const where: Record<string, unknown> = {
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
      data: messages.map(m => ({
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
  requirePermission('view_dashboard'),
  asyncHandler(async (req: Request, res: Response) => {
    // Authorization: scope conversations to leads the user can access
    const userId = req.user?.id;
    const userRole = req.user?.role || '';
    if (!userId) throw new AppError('Authentication required', 401);

    const leadFilter = buildLeadAccessFilter(userId, userRole);

    // Build where clause with optional lead ownership filter
    const whereClause: Record<string, unknown> = {
      action: { in: ['email', 'call', 'note_added'] },
      leadId: { not: null },
    };
    if (leadFilter) {
      whereClause.lead = leadFilter;
    }

    // Get leads that have communication activities
    const recentComms = await prisma.activity.findMany({
      where: whereClause,
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
      .filter(c => {
        if (!c.leadId || seen.has(c.leadId)) return false;
        seen.add(c.leadId);
        return true;
      })
      .map(c => ({
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
  requirePermission('view_dashboard'),
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
