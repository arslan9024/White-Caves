/**
 * jobs.routes.js — Job posting CRUD endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';

const router = express.Router();

// ============= JOBS ENDPOINTS =============

// Create a new job posting
router.post('/jobs', async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      location,
      salary_min,
      salary_max,
      required_skills,
      experience_years,
    } = req.body;

    if (!title || !department) {
      return res.status(400).json({
        error: 'Missing required fields: title, department',
      });
    }

    const job = await ctx.prisma.job.create({
      data: {
        title,
        description,
        department,
        location,
        salary_min: salary_min ? parseFloat(salary_min) : null,
        salary_max: salary_max ? parseFloat(salary_max) : null,
        required_skills: required_skills || [],
        experience_years: experience_years ? parseInt(experience_years) : null,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      error: 'Failed to create job',
      details: error.message,
    });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const { status = 'open', page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {};
    if (status) filters.status = status;

    const [jobs, total] = await Promise.all([
      ctx.prisma.job.findMany({
        where: filters,
        include: {
          applications: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      ctx.prisma.job.count({ where: filters }),
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      error: 'Failed to fetch jobs',
      details: error.message,
    });
  }
});

// Get a single job by ID
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await ctx.prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: { candidate: true },
          orderBy: { applied_at: 'desc' },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      error: 'Failed to fetch job',
      details: error.message,
    });
  }
});

// Update a job
router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      department,
      location,
      salary_min,
      salary_max,
      status,
      required_skills,
      experience_years,
    } = req.body;

    const job = await ctx.prisma.job.update({
      where: { id },
      data: {
        title,
        description,
        department,
        location,
        salary_min: salary_min ? parseFloat(salary_min) : undefined,
        salary_max: salary_max ? parseFloat(salary_max) : undefined,
        status,
        required_skills,
        experience_years: experience_years ? parseInt(experience_years) : undefined,
      },
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      error: 'Failed to update job',
      details: error.message,
    });
  }
});

// Delete a job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await ctx.prisma.job.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      error: 'Failed to delete job',
      details: error.message,
    });
  }
});

export default router;
