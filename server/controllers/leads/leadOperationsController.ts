/**
 * leadOperationsController.ts
 * Handlers for SLA breach tracking, task cockpit, timeline visualization, and activities.
 */

import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validateIdParam } from '../../utils/validate.js';
import { notificationService } from '../../services/NotificationService.js';
import { triggerLeadRescore } from '../../services/ai/leadAutoRescore.js';
import {
  buildLeadTaskCockpit,
  buildLeadTimeline,
} from '../../services/leadWorkflowService.js';
import {
  RouteRequest,
  SLA_HOURS,
  SLA_MS,
  routeParamToString,
  normalizeJsonRecord,
} from './leadCommon.js';

export async function getSlaBreaches(req: RouteRequest, res: Response): Promise<void> {
  const { page = '1', pageSize = '50' } = req.query as Record<string, string | undefined>;
  const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(pageSize as string, 10) || 50));
  const skip = (pageNum - 1) * limit;

  const slaThreshold = new Date(Date.now() - SLA_MS);

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: {
        status: { in: ['new', 'contacted'] },
        createdAt: { lt: slaThreshold },
      },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        source: true,
        score: true,
        createdAt: true,
        assignedToId: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.lead.count({
      where: {
        status: { in: ['new', 'contacted'] },
        createdAt: { lt: slaThreshold },
      },
    }),
  ]);

  const now = Date.now();
  const enriched = leads.map(lead => ({
    ...lead,
    slaBreachHours: Math.round(((now - lead.createdAt.getTime()) / (1000 * 60 * 60)) * 10) / 10,
  }));

  res.status(200).json({
    success: true,
    data: enriched,
    pagination: {
      page: pageNum,
      pageSize: limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    meta: { slaHours: SLA_HOURS },
  });
}

export async function getTaskCockpit(req: RouteRequest, res: Response): Promise<void> {
  const ownerFilter = (req as any).ownershipFilter ?? {};
  const leads = await prisma.lead.findMany({
    where: {
      status: { in: ['new', 'contacted', 'qualified', 'viewing'] },
      ...(ownerFilter as Prisma.LeadWhereInput),
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      status: true,
      source: true,
      score: true,
      createdAt: true,
      lastContact: true,
      assignedToId: true,
      createdById: true,
      assignedTo: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true, location: true } },
    },
    take: 100,
    orderBy: [{ createdAt: 'desc' }],
  });

  res.status(200).json({
    success: true,
    data: buildLeadTaskCockpit(leads),
  });
}

export async function triggerSlaNudge(req: RouteRequest, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Lead ID');

  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
      assignedToId: true,
      assignedTo: { select: { id: true, name: true, email: true } },
    },
  });

  if (!lead) throw new AppError('Lead not found', 404);

  const breachMs = Date.now() - lead.createdAt.getTime();
  const breachHrs = Math.round((breachMs / (1000 * 60 * 60)) * 10) / 10;
  const isBreached = breachMs > SLA_MS;

  if (!isBreached) {
    throw new AppError(
      `Lead is within SLA window (${breachHrs}h elapsed, limit is ${SLA_HOURS}h)`,
      409
    );
  }

  const notifyUserId = lead.assignedToId ?? req.user?.id ?? null;
  if (notifyUserId) {
    await notificationService.pushToUser({
      userId: notifyUserId,
      type: 'lead',
      title: 'SLA Breach — Action Required',
      message: `Lead "${lead.name}" has been unresponded for ${breachHrs}h (SLA: ${SLA_HOURS}h). Please take action immediately.`,
      metadata: { leadId: id, breachHours: breachHrs, slaHours: SLA_HOURS },
    });
  }

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'sla_nudge_sent',
      description: `SLA nudge sent for lead "${lead.name}" (${breachHrs}h in breach)`,
      userId: req.user?.id ?? null,
      leadId: id,
      metadata: { breachHours: breachHrs, notifiedUserId: notifyUserId },
    },
  });

  res.status(200).json({
    success: true,
    message: `SLA nudge sent for lead "${lead.name}"`,
    data: {
      leadId: id,
      breachHours: breachHrs,
      slaHours: SLA_HOURS,
      notifiedUserId: notifyUserId,
    },
  });
}

export async function getLeadTimeline(req: RouteRequest, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Lead ID');

  const lead = await prisma.lead.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      source: true,
      score: true,
      createdAt: true,
      lastContact: true,
      assignedToId: true,
      createdById: true,
      assignedTo: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true, location: true } },
    },
  });

  if (!lead) throw new AppError('Lead not found', 404);

  const [activities, viewings] = await Promise.all([
    prisma.activity.findMany({
      where: { leadId: id },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
      take: 100,
    }),
    prisma.viewing.findMany({
      where: { leadId: id },
      orderBy: { scheduledAt: 'desc' },
      include: {
        property: { select: { title: true, location: true } },
        agent: { select: { id: true, name: true } },
      },
      take: 50,
    }),
  ]);

  const normalizedActivities = activities.map(activity => ({
    ...activity,
    metadata: normalizeJsonRecord(activity.metadata),
  }));

  res.status(200).json({
    success: true,
    data: buildLeadTimeline({ lead, activities: normalizedActivities, viewings }),
  });
}

export async function getLeadActivities(req: Request, res: Response): Promise<void> {
  const leadId = routeParamToString(req.params.id);
  if (!leadId) {
    throw new AppError('Lead ID is required', 400);
  }

  validateIdParam(leadId, 'Lead ID');
  const { page = '1', pageSize = '20' } = req.query as Record<string, string | undefined>;
  const pageNum = Math.max(1, parseInt(page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(pageSize as string) || 20));

  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where: { leadId },
      orderBy: { createdAt: 'desc' },
      skip: (pageNum - 1) * limit,
      take: limit,
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.activity.count({ where: { leadId } }),
  ]);

  res.status(200).json({
    success: true,
    data: activities,
    pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function createLeadActivity(req: RouteRequest, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Lead ID');
  const { type, action, description } = req.body;

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) throw new AppError('Lead not found', 404);

  const userRole = req.user?.role || '';
  const userId = req.user?.id || '';
  const isManagerOrAbove = ['owner', 'manager', 'admin'].includes(userRole);
  if (!isManagerOrAbove && lead.assignedToId !== userId && lead.createdById !== userId) {
    throw new AppError('Access denied — you can only add activities to your own leads', 403);
  }

  const VALID_TYPES = ['lead', 'property', 'deal', 'commission', 'agent', 'client', 'system'];
  const VALID_ACTIONS = [
    'created',
    'updated',
    'deleted',
    'status_changed',
    'note_added',
    'call',
    'email',
    'visit',
  ];
  const resolvedType = VALID_TYPES.includes(type) ? type : 'lead';
  const resolvedAction = VALID_ACTIONS.includes(action) ? action : 'note_added';
  const sanitizedDesc = sanitizeString((description || 'Activity logged').substring(0, 2000));

  const activity = await prisma.activity.create({
    data: {
      type: resolvedType,
      action: resolvedAction,
      description: sanitizedDesc,
      userId: req.user?.id || null,
      leadId: id,
    },
    include: { user: { select: { id: true, name: true } } },
  });

  await prisma.lead.update({ where: { id }, data: { lastContact: new Date() } });
  triggerLeadRescore(id, 'lead_activity_logged');

  res.status(201).json({ success: true, data: activity });
}

