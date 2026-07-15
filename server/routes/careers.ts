import { Router, Request, Response } from 'express';
import { prisma } from '../database.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendEmail } from '../services/emailService.js';
import { requireRole } from '../middleware/rbac.js';

const router = Router();

/**
 * W25-005: Get Active Job Postings
 * GET /api/v1/careers
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const jobs = await prisma.jobPosting.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: jobs });
  })
);

/**
 * W25-005 & W25-006: Submit Job Application
 * POST /api/v1/careers/applications
 */
router.post(
  '/applications',
  asyncHandler(async (req: Request, res: Response) => {
    const { jobId, firstName, lastName, email, phone, linkedinUrl, reraBrn, cvUrl } = req.body;

    if (!jobId || !firstName || !lastName || !email || !cvUrl) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const job = await prisma.jobPosting.findUnique({ where: { id: jobId } });
    if (!job || !job.isActive) {
      return res.status(404).json({ success: false, error: 'Job not found or inactive' });
    }

    // Create Application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        firstName,
        lastName,
        email,
        phone,
        linkedinUrl,
        reraBrn,
        cvUrl,
        status: 'applied',
      },
    });

    // W25-006: Send acknowledgement email
    try {
      await sendEmail({
        to: email,
        subject: `Application Received: ${job.title} at White Caves`,
        html: `<p>Dear ${firstName},</p>
             <p>Thank you for applying for the <strong>${job.title}</strong> position at White Caves Real Estate.</p>
             <p>We have received your application and CV. Our HR team will review your profile, and we'll be in touch within 5 business days.</p>
             <br/>
             <p>Best regards,<br/>White Caves HR Team</p>`,
      });
    } catch (err) {
      console.error('Failed to send career ack email', err);
    }

    res.status(201).json({ success: true, data: application });
  })
);

/**
 * W25-007: Application tracking (Admin)
 * GET /api/v1/careers/applications
 */
router.get(
  '/applications',
  requireRole('owner', 'managing_director', 'admin', 'hr'),
  asyncHandler(async (req: Request, res: Response) => {
    const applications = await prisma.jobApplication.findMany({
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: applications });
  })
);

/**
 * W25-007: Update Application Stage
 * PATCH /api/v1/careers/applications/:id/stage
 */
router.patch(
  '/applications/:id/stage',
  requireRole('owner', 'managing_director', 'admin', 'hr'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { stage } = req.body; // applied, screening, interview, offer, hired, rejected

    if (!['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'].includes(stage)) {
      return res.status(400).json({ success: false, error: 'Invalid stage' });
    }

    const application = await prisma.jobApplication.update({
      where: { id },
      data: { status: stage },
    });

    // Optional: Send email notification on status change

    res.json({ success: true, data: application });
  })
);

export default router;
