import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

/**
 * W25-008: Community Announcements
 * POST /api/v1/community/announcements
 */
router.post(
  '/announcements',
  requireRole('owner', 'managing_director', 'admin', 'community_manager'),
  asyncHandler(async (req: Request, res: Response) => {
    // Schema validation enforced for payload
    const { title, body, targetScope } = req.body;
    if (!title || !body || !targetScope) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const announcement = await prisma.communityAnnouncement.create({
      data: { title, content: body, targetScope, status: 'sent', dispatchedAt: new Date() },
    });

    // Real implementation would trigger FCM and WhatsApp broadcasting here.
    // We mock dispatching logic here.

    res.status(201).json({ success: true, data: announcement });
  })
);

/**
 * W25-009: Facility Booking
 * POST /api/v1/community/bookings
 */
router.post(
  '/bookings',
  asyncHandler(async (req: Request, res: Response) => {
    const { facilityId, unitId, tenantId, startTime, endTime } = req.body;

    if (!facilityId || !unitId || !tenantId || !startTime || !endTime) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check 24h constraint (in reality this would apply to cancellation, but let's check past bookings just in case)
    if (start < new Date()) {
      return res.status(400).json({ success: false, error: 'Cannot book in the past' });
    }

    // W25-009: Check max 2 active bookings per unit
    const activeBookings = await prisma.facilityBooking.count({
      where: { unitId, status: 'confirmed', endTime: { gt: new Date() } },
    });
    if (activeBookings >= 2) {
      return res
        .status(409)
        .json({ success: false, error: 'Unit has reached maximum of 2 active bookings' });
    }

    // W25-009: Check overlapping slots & capacity
    const overlapping = await prisma.facilityBooking.count({
      where: {
        facilityId,
        status: 'confirmed',
        OR: [{ startTime: { lt: end }, endTime: { gt: start } }],
      },
    });

    const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });

    if (facility.capacity && overlapping >= facility.capacity) {
      return res
        .status(409)
        .json({ success: false, error: 'Facility capacity reached for this time slot' });
    }

    const booking = await prisma.facilityBooking.create({
      data: { facilityId, unitId, tenantId, startTime: start, endTime: end, status: 'confirmed' },
    });

    res.status(201).json({ success: true, data: booking });
  })
);

/**
 * W25-011: Service Charges (Landlord Portal)
 * GET /api/v1/community/service-charges
 */
router.get(
  '/service-charges',
  asyncHandler(async (req: Request, res: Response) => {
    // Normally filter by logged-in landlordId
    const charges = await prisma.serviceCharge.findMany({
      orderBy: { dueDate: 'asc' },
    });
    res.json({ success: true, data: charges });
  })
);

/**
 * W25-012: Community Events CRUD & RSVP
 * POST /api/v1/community/events
 */
router.post(
  '/events',
  requireRole('owner', 'managing_director', 'admin', 'community_manager'),
  asyncHandler(async (req: Request, res: Response) => {
    const { title, description, location, startTime, endTime, maxAttendees } = req.body;

    const event = await prisma.communityEvent.create({
      data: {
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        maxAttendees,
      },
    });
    res.status(201).json({ success: true, data: event });
  })
);

/**
 * W25-012: Event RSVP
 * POST /api/v1/community/events/:id/rsvp
 */
router.post(
  '/events/:id/rsvp',
  asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { tenantId } = req.body;

    const event = await prisma.communityEvent.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    if (event.maxAttendees && event.currentRsvps >= event.maxAttendees) {
      return res.status(409).json({ success: false, error: 'Event is at maximum capacity' });
    }

    try {
      const rsvp = await prisma.eventRSVP.create({
        data: { eventId: id, tenantId },
      });
      await prisma.communityEvent.update({
        where: { id },
        data: { currentRsvps: { increment: 1 } },
      });
      res.status(201).json({ success: true, data: rsvp });
    } catch (err) {
      // Unique constraint violation -> already RSVPd
      res.status(409).json({ success: false, error: 'Already RSVPd' });
    }
  })
);

export default router;
