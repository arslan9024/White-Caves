/**
 * Job Applications API Routes
 * Endpoints: /api/job-applications
 * Handles public job applications (no auth required for POST) and
 * privileged read/update operations (auth required for GET, PATCH).
 */

import { Router, Request, Response } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import type { AuthRequest } from '../middleware/auth.js';
import { authMiddleware } from '../middleware/auth.js';
import { prisma } from '../database.js';
import { sanitizeString } from '../utils/sanitize.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

const VALID_STATUSES = ['received', 'reviewed', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'] as const;

// ─── POST /api/job-applications — Public: submit a job application ────────
router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, phone, position, experience, coverLetter } = req.body || {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new AppError('Applicant name is required', 400);
    }
    if (!email || typeof email !== 'string') {
      throw new AppError('Valid email address is required', 400);
    }
    const trimmedEmail = email.trim();
    // Validate email: must contain exactly one @, non-empty local part,
    // non-empty domain with at least one dot — bounded length prevents ReDoS.
    if (trimmedEmail.length > 254 || !trimmedEmail.includes('@')) {
      throw new AppError('Valid email address is required', 400);
    }
    const atIdx = trimmedEmail.lastIndexOf('@');
    const localPart = trimmedEmail.slice(0, atIdx);
    const domainPart = trimmedEmail.slice(atIdx + 1);
    if (!localPart || !domainPart || !domainPart.includes('.')) {
      throw new AppError('Valid email address is required', 400);
    }
    if (!position || typeof position !== 'string' || !position.trim()) {
      throw new AppError('Position applied for is required', 400);
    }

    const application = await prisma.jobApplication.create({
      data: {
        name: sanitizeString(name.trim()),
        email: trimmedEmail.toLowerCase(),
        phone: phone ? sanitizeString(String(phone).trim()) : null,
        position: sanitizeString(position.trim()),
        experience: experience ? sanitizeString(String(experience).trim()) : null,
        coverLetter: coverLetter ? sanitizeString(String(coverLetter).trim()) : null,
        status: 'received',
      },
      select: { id: true, name: true, position: true, status: true, createdAt: true },
    });

    res.status(201).json({
      success: true,
      data: application,
      message: 'Application received. We will be in touch within 5 business days.',
    });
  })
);

// ─── GET /api/job-applications — HR/admin: list all applications ──────────
router.get(
  '/',
  authMiddleware,
  requireRole(['owner', 'admin', 'manager', 'managing_director']),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { status, position, page = '1', pageSize = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(pageSize as string) || 20));

    const where: Record<string, unknown> = {};
    if (status && VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      where.status = status as string;
    }
    if (position) {
      where.position = { contains: sanitizeString(String(position)), mode: 'insensitive' };
    }

    const [applications, total] = await Promise.all([
      prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * limit,
        take: limit,
      }),
      prisma.jobApplication.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: applications,
      pagination: { page: pageNum, pageSize: limit, total, totalPages: Math.ceil(total / limit) },
    });
  })
);

// ─── PATCH /api/job-applications/:id — HR/admin: update status & notes ───
router.patch(
  '/:id',
  authMiddleware,
  requireRole(['owner', 'admin', 'manager', 'managing_director']),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status, notes } = req.body || {};

    if (status && !VALID_STATUSES.includes(status as (typeof VALID_STATUSES)[number])) {
      throw new AppError(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`, 400);
    }

    const exists = await prisma.jobApplication.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new AppError('Application not found', 404);

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes: sanitizeString(String(notes)) } : {}),
      },
    });

    res.status(200).json({ success: true, data: updated });
  })
);

export default router;
