/**
 * Agent Availability Routes — Phase 3C
 * ─────────────────────────────────────
 * CRUD for agent working-hour schedules.
 *
 * GET    /api/agent-availability/:agentId  — Get agent's weekly schedule
 * PUT    /api/agent-availability           — Set current user's schedule (single day)
 * PUT    /api/agent-availability/weekly     — Set full weekly schedule (bulk)
 * DELETE /api/agent-availability/:dayOfWeek — Remove a specific day's schedule
 */

import { Router, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../middleware/auth.js';
import {
  getAgentAvailability,
  setAgentAvailability,
  setAgentWeeklyAvailability,
} from '../services/schedulingService.js';
import { prisma } from '../database.js';
import logger from '../utils/logger.js';

const router = Router();

const routeParamToString = (value: string | string[] | undefined): string | null => {
  if (typeof value === 'string' && value.trim().length > 0) {
    return value;
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
    const first = value[0].trim();
    return first.length > 0 ? first : null;
  }
  return null;
};

// ─── GET /api/agent-availability/:agentId — Get agent's availability ────

router.get(
  '/:agentId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { agentId } = req.params as Record<string, string>;

    // Verify agent exists
    const agent = await prisma.user.findUnique({
      where: { id: agentId },
      select: { id: true, name: true, role: true },
    });
    if (!agent) throw new AppError('Agent not found', 404);

    const schedule = await getAgentAvailability(agentId);

    res.json({
      success: true,
      data: {
        agentId: agent.id,
        agentName: agent.name,
        schedule,
      },
    });
  })
);

// ─── PUT /api/agent-availability — Set single day's availability ─────────

router.put(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    // Schema validation enforced for availability payload
    const { dayOfWeek, startTime, endTime, isActive, slotDuration, breakStart, breakEnd } =
      req.body;

    if (dayOfWeek === undefined || dayOfWeek === null) {
      throw new AppError('dayOfWeek is required (0=Sunday, 6=Saturday)', 400);
    }
    if (!startTime) throw new AppError('startTime is required (HH:mm format)', 400);
    if (!endTime) throw new AppError('endTime is required (HH:mm format)', 400);

    // Validate time format
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(startTime)) throw new AppError('Invalid startTime format (use HH:mm)', 400);
    if (!timeRegex.test(endTime)) throw new AppError('Invalid endTime format (use HH:mm)', 400);
    if (breakStart && !timeRegex.test(breakStart))
      throw new AppError('Invalid breakStart format (use HH:mm)', 400);
    if (breakEnd && !timeRegex.test(breakEnd))
      throw new AppError('Invalid breakEnd format (use HH:mm)', 400);

    const result = await setAgentAvailability(userId, {
      dayOfWeek,
      startTime,
      endTime,
      isActive: isActive !== false,
      slotDuration: slotDuration || 30,
      breakStart,
      breakEnd,
    });

    logger.info('Agent availability updated', { agentId: userId, dayOfWeek });
    res.json({ success: true, data: result });
  })
);

// ─── PUT /api/agent-availability/weekly — Set full week schedule ─────────

router.put(
  '/weekly',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const { schedules } = req.body;

    if (!Array.isArray(schedules) || schedules.length === 0) {
      throw new AppError('schedules array is required', 400);
    }
    if (schedules.length > 7) {
      throw new AppError('Maximum 7 schedules (one per day of week)', 400);
    }

    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    for (const s of schedules) {
      if (s.dayOfWeek === undefined) throw new AppError('Each schedule needs dayOfWeek', 400);
      if (!s.startTime || !timeRegex.test(s.startTime))
        throw new AppError(`Invalid startTime for day ${s.dayOfWeek}`, 400);
      if (!s.endTime || !timeRegex.test(s.endTime))
        throw new AppError(`Invalid endTime for day ${s.dayOfWeek}`, 400);
    }

    const results = await setAgentWeeklyAvailability(userId, schedules);

    logger.info('Agent weekly availability set', { agentId: userId, days: schedules.length });
    res.json({ success: true, data: results });
  })
);

// ─── DELETE /api/agent-availability/:dayOfWeek — Remove day schedule ─────

router.delete(
  '/:dayOfWeek',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Authentication required', 401);

    const dayParam = routeParamToString(req.params.dayOfWeek);
    if (!dayParam) {
      throw new AppError('dayOfWeek is required', 400);
    }
    const dayOfWeek = parseInt(dayParam, 10);
    if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
      throw new AppError('Invalid dayOfWeek (0-6)', 400);
    }

    // Check if exists
    const existing = await prisma.agentAvailability.findUnique({
      where: { agentId_dayOfWeek: { agentId: userId, dayOfWeek } },
    });

    if (!existing) {
      throw new AppError('No availability set for this day', 404);
    }

    await prisma.agentAvailability.delete({
      where: { agentId_dayOfWeek: { agentId: userId, dayOfWeek } },
    });

    logger.info('Agent availability removed', { agentId: userId, dayOfWeek });
    res.json({ success: true, message: `Availability for day ${dayOfWeek} removed` });
  })
);

export default router;
