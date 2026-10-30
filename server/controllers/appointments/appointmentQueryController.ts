/**
 * Appointment Query Controller
 * Endpoints for listing appointments with filters/pagination, upcoming schedule, and single appointment details.
 */

import { Request, Response } from 'express';
import { parsePagination } from '../../config/pagination.js';
import { AppError } from '../../middleware/errorHandler.js';
import { validateIdParam } from '../../utils/validate.js';
import {
  RouteRequest,
  db,
  VALID_TYPES,
  VALID_STATUSES,
  routeParamToString,
} from './appointmentCommon.js';

export const getAppointments = async (req: RouteRequest, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req.query);
  const { status, type, agentId, propertyId, leadId, from, to } = req.query as Record<
    string,
    string
  >;

  const where: Record<string, unknown> = {};
  if (status && VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
    where.status = status;
  }
  if (type && VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    where.type = type;
  }
  if (agentId) where.agentId = agentId;
  if (propertyId) where.propertyId = propertyId;
  if (leadId) where.leadId = leadId;

  const dateFilter: Record<string, Date> = {};
  if (from) dateFilter.gte = new Date(from);
  if (to) dateFilter.lte = new Date(to);
  if (Object.keys(dateFilter).length > 0) where.scheduledAt = dateFilter;

  const [appointments, total] = await Promise.all([
    db.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      skip,
      take: limit,
    }),
    db.appointment.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: appointments,
    pagination: { page, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
  });
};

export const getUpcomingAppointments = async (req: RouteRequest, res: Response): Promise<void> => {
  const { limit: limitParam } = req.query as Record<string, string>;
  const limit = Math.min(parseInt(limitParam || '20', 10), 100);
  const now = new Date();
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const appointments = await db.appointment.findMany({
    where: {
      scheduledAt: { gte: now, lte: in30Days },
      status: { in: ['scheduled', 'confirmed'] },
    },
    orderBy: { scheduledAt: 'asc' },
    take: limit,
  });

  res.status(200).json({ success: true, data: appointments });
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  const appointmentId = routeParamToString(req.params.id);
  if (!appointmentId) {
    throw new AppError('Appointment ID is required', 400);
  }

  validateIdParam(appointmentId, 'Appointment ID');
  const appt = await db.appointment.findUnique({ where: { id: appointmentId } });
  if (!appt) throw new AppError('Appointment not found', 404);
  res.status(200).json({ success: true, data: appt });
};

