/**
 * leadActionController.ts
 * Dedicated controller for homepage search lead capture and atomic bulk actions.
 */

import { Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { getSocketServer } from '../../services/socketServer.js';
import { notificationService } from '../../services/NotificationService.js';
import { triggerLeadRescore } from '../../services/ai/leadAutoRescore.js';
import { RouteRequest } from './leadCommon.js';

export async function createLeadFromSearch(req: RouteRequest, res: Response): Promise<void> {
  const { mode, location, propertyType, beds, minPrice, maxPrice, sessionId, searchedAt } =
    req.body as {
      mode?: string;
      location?: string;
      propertyType?: string;
      beds?: number;
      minPrice?: number;
      maxPrice?: number;
      sessionId?: string;
      searchedAt?: string;
    };

  if (!mode || !['buy', 'rent'].includes(mode)) {
    throw new AppError('Field "mode" must be "buy" or "rent"', 400);
  }

  const cleanLocation = location ? sanitizeString(location).slice(0, 200) : null;
  const cleanPropertyType = propertyType ? sanitizeString(propertyType).slice(0, 100) : null;
  const cleanSessionId = sessionId ? sanitizeString(sessionId).slice(0, 100) : null;

  const parts: string[] = [`${mode.toUpperCase()} search`];
  if (cleanLocation) parts.push(cleanLocation);
  if (cleanPropertyType) parts.push(cleanPropertyType);
  const bedsNum = typeof beds === 'number' && beds > 0 ? Math.ceil(beds) : 0;
  if (bedsNum > 0) parts.push(`${bedsNum}BR`);
  const leadName = `[Homepage] ${parts.join(' - ')}`;

  const tags: string[] = ['homepage_search', mode];
  if (cleanLocation) tags.push(cleanLocation.toLowerCase().replace(/\s+/g, '_'));
  if (cleanPropertyType) tags.push(cleanPropertyType.toLowerCase().replace(/\s+/g, '_'));

  const searchSummary = JSON.stringify({
    mode,
    location: cleanLocation,
    propertyType: cleanPropertyType,
    beds: bedsNum || null,
    minPrice: typeof minPrice === 'number' ? minPrice : null,
    maxPrice: typeof maxPrice === 'number' ? maxPrice : null,
    sessionId: cleanSessionId,
    searchedAt: searchedAt ?? new Date().toISOString(),
  });

  const lead = await prisma.lead.create({
    data: {
      name: leadName,
      email: null,
      phone: null,
      source: 'homepage_search',
      status: 'new',
      stage: 'awareness',
      score: 10,
      tags,
      notes: `Auto-captured from homepage search:\n${searchSummary}`,
      budget: typeof maxPrice === 'number' && maxPrice > 0 ? maxPrice : null,
    } as any,
    select: {
      id: true,
      name: true,
      source: true,
      status: true,
      score: true,
      tags: true,
      createdAt: true,
    },
  });
  triggerLeadRescore(lead.id, 'homepage_search_lead_created');

  try {
    const io = getSocketServer();
    if (io) {
      (io as any).to('crm').emit('lead:created', { source: 'homepage_search', leadId: lead.id });
    }
  } catch {
    // Socket server unavailable - non-fatal
  }

  res.status(201).json({ success: true, data: lead });
}

export async function executeBulkAction(req: RouteRequest, res: Response): Promise<void> {
  const { ids, action, payload } = req.body as {
    ids: unknown;
    action: unknown;
    payload: unknown;
  };

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError('ids must be a non-empty array', 400);
  }
  if (ids.length > 100) {
    throw new AppError('Bulk action is limited to 100 leads per request', 400);
  }

  const VALID_BULK_ACTIONS = ['assign', 'change-status', 'archive', 'set-reminder'] as const;
  type BulkAction = (typeof VALID_BULK_ACTIONS)[number];

  if (!VALID_BULK_ACTIONS.includes(action as BulkAction)) {
    throw new AppError(`Invalid action. Must be one of: ${VALID_BULK_ACTIONS.join(', ')}`, 400);
  }
  const typedAction = action as BulkAction;

  const userRole = req.user?.role ?? 'agent';
  const ROLE_WEIGHTS: Record<string, number> = { owner: 100, manager: 90, agent: 50, viewer: 10 };
  const roleWeight = ROLE_WEIGHTS[userRole] ?? 0;

  if (typedAction === 'assign' && roleWeight < ROLE_WEIGHTS['manager']) {
    throw new AppError('Only managers and above can bulk-assign leads', 403);
  }

  const payloadObj =
    payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  const payloadMetadata = JSON.parse(JSON.stringify(payloadObj)) as Prisma.InputJsonValue;
  const updateData: Record<string, unknown> = {};
  let activityDescription = '';

  if (typedAction === 'change-status') {
    const newStatus = payloadObj['status'];
    if (!newStatus || typeof newStatus !== 'string') {
      throw new AppError('payload.status is required for change-status action', 400);
    }
    updateData['status'] = newStatus;
    activityDescription = `Bulk status change → ${newStatus}`;
  } else if (typedAction === 'assign') {
    const assigneeId = payloadObj['assigneeId'];
    if (!assigneeId || typeof assigneeId !== 'string') {
      throw new AppError('payload.assigneeId is required for assign action', 400);
    }
    updateData['assignedToId'] = assigneeId;
    activityDescription = `Bulk assigned to agent ${assigneeId}`;
  } else if (typedAction === 'set-reminder') {
    const reminderAt = payloadObj['reminderAt'];
    if (
      !reminderAt ||
      typeof reminderAt !== 'string' ||
      Number.isNaN(new Date(reminderAt).getTime())
    ) {
      throw new AppError('payload.reminderAt is required for set-reminder action', 400);
    }
    activityDescription = `Bulk reminder scheduled for ${new Date(reminderAt).toISOString()}`;
  } else if (typedAction === 'archive') {
    updateData['status'] = 'archived';
    activityDescription = 'Bulk archived';
  }

  const validIds = (ids as string[]).filter(id => typeof id === 'string' && id.length > 0);

  await prisma.$transaction(async tx => {
    if (Object.keys(updateData).length > 0) {
      await (tx.lead as any).updateMany({
        where: { id: { in: validIds } },
        data: updateData as any,
      });
    }

    for (const leadId of validIds) {
      await tx.activity.create({
        data: {
          type: 'lead',
          action: typedAction === 'set-reminder' ? 'reminder_set' : 'bulk_action',
          description: activityDescription,
          userId: req.user?.id ?? null,
          leadId,
          metadata: {
            bulkAction: typedAction,
            payload: payloadMetadata,
          } as Prisma.InputJsonValue,
        },
      });
    }
  });

  if (typedAction === 'assign' && typeof payloadObj['assigneeId'] === 'string') {
    await notificationService.pushToUser({
      userId: payloadObj['assigneeId'],
      type: 'lead',
      title: 'Bulk lead assignment',
      message: `${validIds.length} lead(s) were assigned to you.`,
      metadata: { leadIds: validIds, bulkAction: typedAction },
    });
  }

  res.status(200).json({
    success: true,
    message: `Bulk action '${typedAction}' applied to ${validIds.length} lead(s)`,
    affected: validIds.length,
  });
}

