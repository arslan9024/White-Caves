/**
 * Appointments API Routes
 * Full CRUD for appointment scheduling (viewings, meetings, calls, signings).
 * Endpoints: /api/appointments
 */

import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requirePermission, requireRole } from '../middleware/rbac.js';
import {
  getGoogleAuthUrl,
  handleGoogleCallback,
  syncGoogleCalendarEvent,
  getAppointments,
  getUpcomingAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointments/index.js';

const router = Router();

// Google Calendar OAuth & Sync
router.get(
  '/calendar/google/auth-url',
  requirePermission('manage_appointments'),
  asyncHandler(getGoogleAuthUrl)
);
router.get(
  '/calendar/google/callback',
  requirePermission('manage_appointments'),
  asyncHandler(handleGoogleCallback)
);
router.post(
  '/:id/calendar-sync/google',
  requirePermission('manage_appointments'),
  asyncHandler(syncGoogleCalendarEvent)
);

// Appointment Queries
router.get('/', requirePermission('view_appointments'), asyncHandler(getAppointments));
router.get(
  '/upcoming',
  requirePermission('view_appointments'),
  asyncHandler(getUpcomingAppointments)
);
router.get('/:id', requirePermission('view_appointments'), asyncHandler(getAppointmentById));

// Appointment Mutations
router.post('/', requirePermission('manage_appointments'), asyncHandler(createAppointment));
router.patch('/:id', requirePermission('manage_appointments'), asyncHandler(updateAppointment));
router.delete(
  '/:id',
  requireRole('owner', 'manager', 'admin'),
  asyncHandler(deleteAppointment)
);

export default router;
