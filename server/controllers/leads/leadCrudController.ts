/**
 * leadCrudController.ts
 * Dedicated controller for single-lead CRUD operations (create, update, delete).
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../../utils/validate.js';
import { getSocketServer } from '../../services/socketServer.js';
import { notificationService } from '../../services/NotificationService.js';
import { invalidateLeadCache } from '../../services/cacheInvalidation.js';
import { triggerLeadRescore } from '../../services/ai/leadAutoRescore.js';
import {
  RouteRequest,
  VALID_LEAD_STATUSES,
  VALID_LEAD_SOURCES,
  SLA_MS,
} from './leadCommon.js';

export async function createLead(req: RouteRequest, res: Response): Promise<void> {
  const {
    name,
    email,
    phone,
    company,
    status,
    source,
    budget,
    score,
    notes,
    tags,
    assignedToId,
    propertyId,
  } = req.body;

  validate(req.body, {
    name: rules.requiredStringWithMax('Lead name', 255),
    email: rules.optionalEmail('Email'),
    phone: rules.optionalStringWithMax('Phone', 50),
    company: rules.optionalStringWithMax('Company', 255),
    status: rules.oneOf('Status', [...VALID_LEAD_STATUSES]),
    source: rules.oneOf('Source', [...VALID_LEAD_SOURCES]),
    budget: rules.optionalPositiveNumber('Budget'),
    assignedToId: rules.optionalMongoId('Assigned agent ID'),
    propertyId: rules.optionalMongoId('Property ID'),
    tags: rules.optionalArray('Tags'),
    notes: rules.optionalStringWithMax('Notes', 5000),
  });

  const lead = await prisma.lead.create({
    data: {
      name: sanitizeString(name.trim()),
      email: email?.trim()?.toLowerCase() || null,
      phone: phone?.trim() || null,
      company: company ? sanitizeString(company.trim()) : null,
      status: status || 'new',
      source: source || 'direct',
      budget: budget ? parseFloat(budget) : null,
      score: score ? Math.max(0, Math.min(100, parseInt(String(score), 10) || 0)) : 0,
      notes: notes ? sanitizeString(notes) : null,
      tags: (tags || []).map((t: unknown) =>
        typeof t === 'string' ? sanitizeString(t) : String(t)
      ),
      assignedToId: assignedToId || null,
      createdById: req.user?.id || null,
      propertyId: propertyId || null,
    },
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: 'created',
      description: `New lead created: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      userId: req.user?.id || null,
      leadId: lead.id,
    },
  });

  const assignedAgent = lead.assignedTo as { name?: string; email?: string } | null;
  if (assignedAgent?.email) {
    try {
      const { sendEmailTracked, EMAIL_TEMPLATES } = await import('../../services/emailService.js');
      const template = EMAIL_TEMPLATES.leadAssigned(
        assignedAgent.name || 'Agent',
        lead.name,
        lead.email || '',
        lead.source || 'direct'
      );
      sendEmailTracked({
        to: assignedAgent.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        tags: [{ name: 'type', value: 'lead_assigned' }],
      }).catch(err => console.error('[email] leadAssigned send failed:', err));
    } catch (err) {
      console.error('[email] leadAssigned import failed:', err);
    }
  }

  if (lead.assignedToId) {
    await notificationService.pushToUser({
      userId: lead.assignedToId,
      type: 'lead',
      title: 'New lead assigned',
      message: `${lead.name} was assigned to you`,
      metadata: { leadId: lead.id, source: lead.source },
    });
  }

  triggerLeadRescore(lead.id, 'lead_created');

  try {
    const slaDeadlineMs = Date.now() + SLA_MS;
    await (prisma.lead as any).update({
      where: { id: lead.id },
      data: { slaDeadline: new Date(slaDeadlineMs) },
    });
  } catch {
    // Graceful no-op if field is not present
  }

  await invalidateLeadCache(lead.id);

  res.status(201).json({ success: true, data: lead });
}

export async function updateLead(req: RouteRequest, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Lead ID');
  const {
    name,
    email,
    phone,
    company,
    status,
    source,
    budget,
    score,
    notes,
    tags,
    assignedToId,
    propertyId,
  } = req.body;

  validate(req.body, {
    name: rules.optionalStringWithMax('Lead name', 255),
    email: rules.optionalEmail('Email'),
    phone: rules.optionalStringWithMax('Phone', 50),
    company: rules.optionalStringWithMax('Company', 255),
    notes: rules.optionalStringWithMax('Notes', 5000),
    status: rules.oneOf('Status', [...VALID_LEAD_STATUSES]),
    source: rules.oneOf('Source', [...VALID_LEAD_SOURCES]),
    budget: rules.optionalPositiveNumber('Budget'),
    assignedToId: rules.optionalMongoId('Assigned agent ID'),
    propertyId: rules.optionalMongoId('Property ID'),
    tags: rules.optionalArray('Tags'),
  });

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) throw new AppError('Lead not found', 404);

  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  const isLeadCreator = existing.createdById === req.user?.id;
  if (!isAdmin && !isLeadCreator) {
    throw new AppError('You do not have permission to update this lead', 403);
  }

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = sanitizeString(String(name).trim());
  if (email !== undefined) data.email = email ? String(email).trim().toLowerCase() : null;
  if (phone !== undefined) data.phone = phone ? String(phone).trim() : null;
  if (company !== undefined)
    data.company = company ? sanitizeString(String(company).trim()) : null;
  if (status !== undefined) data.status = status;
  if (source !== undefined) data.source = source;
  if (budget !== undefined) data.budget = budget ? parseFloat(budget) : null;
  if (score !== undefined) {
    const parsed = parseInt(score as string, 10);
    data.score = !isNaN(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
  }
  if (notes !== undefined) data.notes = notes ? sanitizeString(notes) : null;
  if (tags !== undefined)
    data.tags = Array.isArray(tags)
      ? tags.map((t: unknown) => (typeof t === 'string' ? sanitizeString(t) : String(t)))
      : [];
  if (assignedToId !== undefined) data.assignedToId = assignedToId || null;
  if (propertyId !== undefined) data.propertyId = propertyId || null;

  const statusChanged = status !== undefined && status !== null && status !== existing.status;

  const lead = await prisma.lead.update({
    where: { id },
    data,
    include: { assignedTo: { select: { id: true, name: true, email: true } } },
  });

  await prisma.activity.create({
    data: {
      type: 'lead',
      action: statusChanged ? 'status_changed' : 'updated',
      description: statusChanged
        ? `Lead "${lead.name}" status: ${existing.status} → ${status}`
        : `Lead "${lead.name}" updated`,
      userId: req.user?.id || null,
      leadId: lead.id,
      metadata: statusChanged ? { oldStatus: existing.status, newStatus: status } : undefined,
    },
  });

  try {
    (getSocketServer() as any)?.emitLeadUpdated({
      leadId: lead.id,
      status: lead.status,
      assignedTo: lead.assignedTo?.id,
      score: lead.score ?? undefined,
      updatedBy: req.user?.id,
    });
  } catch (err) {
    console.error('Socket emit lead:updated failed:', err);
  }

  triggerLeadRescore(lead.id, statusChanged ? 'lead_status_changed' : 'lead_updated');

  const agentChanged = assignedToId !== undefined && assignedToId !== existing.assignedToId;

  if (lead.assignedToId && statusChanged) {
    await notificationService.pushToUser({
      userId: lead.assignedToId,
      type: 'lead',
      title: 'Lead status updated',
      message: `${lead.name} moved to ${lead.status}`,
      metadata: { leadId: lead.id, oldStatus: existing.status, newStatus: lead.status },
    });
  }

  if (lead.assignedToId && agentChanged) {
    await notificationService.pushToUser({
      userId: lead.assignedToId,
      type: 'lead',
      title: 'New lead assigned',
      message: `${lead.name} was assigned to you`,
      metadata: { leadId: lead.id, source: lead.source },
    });
  }

  res.status(200).json({ success: true, data: lead });
}

export async function deleteLead(req: RouteRequest, res: Response): Promise<void> {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Lead ID');

  const existing = await prisma.lead.findUnique({ where: { id } });
  if (!existing) throw new AppError('Lead not found', 404);

  const isAdmin = ['owner', 'manager'].includes(req.user?.role || '');
  const isLeadCreator = existing.createdById === req.user?.id;
  if (!isAdmin && !isLeadCreator) {
    throw new AppError('You do not have permission to delete this lead', 403);
  }

  await prisma.$transaction(async tx => {
    await tx.commission.updateMany({ where: { leadId: id }, data: { leadId: null } });
    await tx.activity.deleteMany({ where: { leadId: id } });
    await tx.lead.delete({ where: { id } });

    await tx.activity.create({
      data: {
        type: 'lead',
        action: 'deleted',
        description: `Lead deleted: ${existing.name} (by ${req.user?.email})`,
        userId: req.user?.id || null,
      },
    });
  });

  res.status(200).json({ success: true, message: `Lead "${existing.name}" deleted` });
}
