/**
 * applications.routes.js — Application CRUD & status endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';

const router = express.Router();

// ============= APPLICATIONS ENDPOINTS =============

// Create an application
router.post('/applications', async (req, res) => {
  try {
    const { candidate_id, job_id, notes } = req.body;

    if (!candidate_id || !job_id) {
      return res.status(400).json({
        error: 'Missing required fields: candidate_id, job_id',
      });
    }

    // Check if application already exists
    const existingApp = await ctx.prisma.application.findFirst({
      where: {
        candidate_id,
        job_id,
      },
    });

    if (existingApp) {
      return res.status(409).json({
        error: 'Application already exists for this candidate and job',
        application_id: existingApp.id,
      });
    }

    const application = await ctx.prisma.application.create({
      data: {
        candidate_id,
        job_id,
        notes,
      },
      include: {
        candidate: true,
        job: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      error: 'Failed to create application',
      details: error.message,
    });
  }
});

// Get all applications
router.get('/applications', async (req, res) => {
  try {
    const { status, job_id, candidate_id, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {};
    if (status) filters.status = status;
    if (job_id) filters.job_id = job_id;
    if (candidate_id) filters.candidate_id = candidate_id;

    const [applications, total] = await Promise.all([
      ctx.prisma.application.findMany({
        where: filters,
        include: {
          candidate: true,
          job: true,
        },
        orderBy: { applied_at: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      ctx.prisma.application.count({ where: filters }),
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Failed to fetch applications',
      details: error.message,
    });
  }
});

// Get a single application
router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await ctx.prisma.application.findUnique({
      where: { id },
      include: {
        candidate: true,
        job: true,
      },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      error: 'Failed to fetch application',
      details: error.message,
    });
  }
});

// Update application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const application = await ctx.prisma.application.update({
      where: { id },
      data: { status },
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      error: 'Failed to update application status',
      details: error.message,
    });
  }
});

// Update application
router.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await ctx.prisma.application.update({
      where: { id },
      data: {
        status,
        notes,
      },
    });

    res.json({
      success: true,
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      error: 'Failed to update application',
      details: error.message,
    });
  }
});

// Delete application
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await ctx.prisma.application.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      error: 'Failed to delete application',
      details: error.message,
    });
  }
});

export default router;
