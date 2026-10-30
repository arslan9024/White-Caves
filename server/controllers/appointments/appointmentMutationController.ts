/**
 * Appointment Mutation Controller
 * Handles appointment creation, rescheduling, status updates, deletion, and lead rescoring.
 */

import { Response } from 'express';
import { prisma } from '../../database.js';
import { sanitizeString } from '../../utils/sanitize.js';
import { validate, rules, validateIdParam } from '../../utils/validate.js';
import { AppError } from '../../middleware/errorHandler.js';
import { triggerLeadRescore } from '../../services/ai/leadAutoRescore.js';
import {
  RouteRequest,
  db,
  VALID_TYPES,
  VALID_STATUSES,
} from './appointmentCommon.js';

export const createAppointment = async (req: RouteRequest, res: Response): Promise<void> => {
  const {
    title,
    type,
    scheduledAt,
    durationMins,
    location,
    notes,
    clientName,
    clientEmail,
    clientPhone,
    agentId,
    propertyId,
    leadId,
  } = req.body;

  validate(req.body, {
    title: rules.requiredStringWithMax('Title', 255),
    type: rules.oneOf('Appointment type', [...VALID_TYPES]),
    location: rules.optionalStringWithMax('Location', 500),
    notes: rules.optionalStringWithMax('Notes', 2000),
    clientEmail: rules.optionalEmail('Client email'),
    agentId: rules.optionalMongoId('Agent ID'),
    propertyId: rules.optionalMongoId('Property ID'),
    leadId: rules.optionalMongoId('Lead ID'),
  });

  if (!scheduledAt) throw new AppError('scheduledAt is required', 400);

  const scheduled = new Date(scheduledAt);
  if (isNaN(scheduled.getTime())) throw new AppError('scheduledAt must be a valid date', 400);
  if (scheduled < new Date())
    throw new AppError('Appointment cannot be scheduled in the past', 400);

  const appt = await db.appointment.create({
    data: {
      title: sanitizeString(title.trim()),
      type: type || 'viewing',
      status: 'scheduled',
      scheduledAt: scheduled,
      durationMins: durationMins
        ? Math.min(480, Math.max(15, parseInt(String(durationMins), 10)))
        : 60,
      location: location ? sanitizeString(location) : null,
      notes: notes ? sanitizeString(notes) : null,
      clientName: clientName ? sanitizeString(clientName) : null,
      clientEmail: clientEmail?.trim()?.toLowerCase() || null,
      clientPhone: clientPhone?.trim() || null,
      agentId: agentId || null,
      propertyId: propertyId || null,
      leadId: leadId || null,
      createdById: req.user?.id || null,
    },
  });

  await prisma.activity.create({
    data: {
      type: 'appointment',
      action: 'created',
      description: `Appointment scheduled: ${appt.title} on ${scheduled.toLocaleDateString('en-AE')}`,
      userId: req.user?.id || null,
      leadId: leadId || null,
    },
  });
  triggerLeadRescore(appt.leadId, 'appointment_created');

  res.status(201).json({ success: true, data: appt });
};

export const updateAppointment = async (req: RouteRequest, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Appointment ID');

  const existing = await db.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError('Appointment not found', 404);

  const {
    title,
    type,
    status,
    scheduledAt,
    durationMins,
    location,
    notes,
    cancelReason,
    clientName,
    clientEmail,
    clientPhone,
    agentId,
    propertyId,
    leadId,
  } = req.body;

  validate(req.body, {
    title: rules.optionalStringWithMax('Title', 255),
    type: rules.oneOf('Appointment type', [...VALID_TYPES]),
    status: rules.oneOf('Status', [...VALID_STATUSES]),
    location: rules.optionalStringWithMax('Location', 500),
    notes: rules.optionalStringWithMax('Notes', 2000),
    clientEmail: rules.optionalEmail('Client email'),
    agentId: rules.optionalMongoId('Agent ID'),
    propertyId: rules.optionalMongoId('Property ID'),
    leadId: rules.optionalMongoId('Lead ID'),
  });

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = sanitizeString(String(title).trim());
  if (type !== undefined) data.type = type;
  if (status !== undefined) {
    data.status = status;
    if (status === 'completed' && !existing.completedAt) data.completedAt = new Date();
  }
  if (scheduledAt !== undefined) {
    const d = new Date(scheduledAt);
    if (isNaN(d.getTime())) throw new AppError('scheduledAt must be a valid date', 400);
    data.scheduledAt = d;
  }
  if (durationMins !== undefined) {
    data.durationMins = Math.min(480, Math.max(15, parseInt(String(durationMins), 10)));
  }
  if (location !== undefined) data.location = location ? sanitizeString(location) : null;
  if (notes !== undefined) data.notes = notes ? sanitizeString(notes) : null;
  if (cancelReason !== undefined)
    data.cancelReason = cancelReason ? sanitizeString(cancelReason) : null;
  if (clientName !== undefined) data.clientName = clientName ? sanitizeString(clientName) : null;
  if (clientEmail !== undefined) data.clientEmail = clientEmail?.trim()?.toLowerCase() || null;
  if (clientPhone !== undefined) data.clientPhone = clientPhone?.trim() || null;
  if (agentId !== undefined) data.agentId = agentId || null;
  if (propertyId !== undefined) data.propertyId = propertyId || null;
  if (leadId !== undefined) data.leadId = leadId || null;

  const updated = await db.appointment.update({ where: { id }, data });

  const statusChanged = status !== undefined && status !== existing.status;
  if (statusChanged || scheduledAt !== undefined) {
    await prisma.activity.create({
      data: {
        type: 'appointment',
        action: scheduledAt !== undefined ? 'rescheduled' : 'status_changed',
        description:
          scheduledAt !== undefined
            ? `Appointment "${updated.title}" rescheduled to ${new Date(scheduledAt).toLocaleDateString('en-AE')}`
            : `Appointment "${updated.title}" status: ${existing.status} → ${status}`,
        userId: req.user?.id || null,
        leadId: updated.leadId || null,
      },
    });
  }
  triggerLeadRescore(
    updated.leadId,
    statusChanged ? 'appointment_status_changed' : 'appointment_updated'
  );

  res.status(200).json({ success: true, data: updated });
};

export const deleteAppointment = async (req: RouteRequest, res: Response): Promise<void> => {
  const { id } = req.params as Record<string, string>;
  validateIdParam(id, 'Appointment ID');

  const existing = await db.appointment.findUnique({ where: { id } });
  if (!existing) throw new AppError('Appointment not found', 404);

  await db.appointment.delete({ where: { id } });
  triggerLeadRescore(existing.leadId, 'appointment_deleted');

  res.status(200).json({ success: true, message: `Appointment "${existing.title}" deleted` });
};

