/**
 * Orchestrator Routes
 *
 * Admin API surface for the AssistantOrchestrator event bus.
 *
 * Endpoints:
 *   GET  /api/orchestrator/status  — handler registration status + metrics
 *   GET  /api/orchestrator/events  — last 50 events (ring buffer, ?limit=N)
 *   POST /api/orchestrator/emit    — manually emit an event (owner/admin only, testing)
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { requireRole } from '../middleware/rbac.js';
import {
  assistantOrchestrator,
  getOrchestratorStatus,
  type OrchestratorEvent,
  type OrchestratorEventPayloads,
} from '../services/orchestrator/AssistantOrchestrator.js';

const router = Router();

/** All valid event names (for admin emit validation) */
const VALID_EVENTS: OrchestratorEvent[] = [
  'linda:message_received',
  'nina:intent_classified',
  'nadia:lead_scored',
  'mary:property_status_changed',
  'henry:compliance_failed',
  'henry:document_generated',
  'cross:viewing_booked',
  'cross:offer_accepted',
];

// ─── GET /api/orchestrator/status ─────────────────────────────────────────────

/**
 * Returns handler registration counts, registered assistants, and activity metrics.
 * Accessible to manager, admin, and owner roles.
 */
router.get(
  '/status',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (_req: Request, res: Response) => {
    const status = getOrchestratorStatus();
    res.json({ success: true, data: status });
  })
);

// ─── GET /api/orchestrator/events ─────────────────────────────────────────────

/**
 * Returns the last N events from the in-memory ring buffer (newest last).
 * Query param: ?limit=N (1–50, default 50).
 * Accessible to manager, admin, and owner roles.
 */
router.get(
  '/events',
  requireRole('owner', 'admin', 'manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const rawLimit = parseInt(String(req.query.limit ?? '50'), 10);
    const limit = Math.max(1, Math.min(isNaN(rawLimit) ? 50 : rawLimit, 50));
    const events = assistantOrchestrator.getRecentEvents(limit);
    res.json({ success: true, data: { events, count: events.length } });
  })
);

// ─── POST /api/orchestrator/emit ──────────────────────────────────────────────

/**
 * Manually emit an orchestrator event. Owner/admin only — for integration testing.
 *
 * Body: { event: OrchestratorEvent, payload: object }
 */
router.post(
  '/emit',
  requireRole('owner', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const { event, payload } = req.body as { event: unknown; payload: unknown };

    if (!event || typeof event !== 'string') {
      throw new AppError('event is required and must be a string', 400);
    }
    if (!VALID_EVENTS.includes(event as OrchestratorEvent)) {
      throw new AppError(
        `Invalid event "${event}". Valid options: ${VALID_EVENTS.join(', ')}`,
        400
      );
    }
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new AppError('payload must be a non-null object', 400);
    }

    assistantOrchestrator.emitEvent(
      event as OrchestratorEvent,
      payload as OrchestratorEventPayloads[OrchestratorEvent]
    );

    res.status(202).json({
      success: true,
      message: `Event "${event}" emitted successfully`,
      data: { event, emittedAt: new Date().toISOString() },
    });
  })
);

export default router;
