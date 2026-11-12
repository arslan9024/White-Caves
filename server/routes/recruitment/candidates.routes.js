/**
 * candidates.routes.js — Candidate CRUD endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';

const router = express.Router();

// ============= CANDIDATES ENDPOINTS =============

// Create a new candidate
router.post('/candidates', async (req, res) => {
  try {
    const { email, phone, first_name, last_name, location, linkedin_url, source } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name) {
      return res.status(400).json({
        error: 'Missing required fields: email, first_name, last_name',
      });
    }

    // Check if candidate already exists
    const existingCandidate = await ctx.prisma.candidate.findUnique({
      where: { email },
    });

    if (existingCandidate) {
      return res.status(409).json({
        error: 'Candidate with this email already exists',
        candidate_id: existingCandidate.id,
      });
    }

    const candidate = await ctx.prisma.candidate.create({
      data: {
        email,
        phone,
        first_name,
        last_name,
        location,
        linkedin_url,
        source: source || 'manual_upload',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      candidate,
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({
      error: 'Failed to create candidate',
      details: error.message,
    });
  }
});

// Get all candidates with pagination and filters
router.get('/candidates', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, source } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = {};
    if (status) filters.status = status;
    if (source) filters.source = source;

    const [candidates, total] = await Promise.all([
      ctx.prisma.candidate.findMany({
        where: filters,
        include: {
          scores: { orderBy: { scored_at: 'desc' }, take: 1 },
          applications: true,
          interviews: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      ctx.prisma.candidate.count({ where: filters }),
    ]);

    res.json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      error: 'Failed to fetch candidates',
      details: error.message,
    });
  }
});

// Get a single candidate by ID
router.get('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await ctx.prisma.candidate.findUnique({
      where: { id },
      include: {
        scores: { orderBy: { scored_at: 'desc' } },
        applications: {
          include: { job: true },
          orderBy: { applied_at: 'desc' },
        },
        interviews: { orderBy: { scheduled_at: 'desc' } },
      },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({
      success: true,
      candidate,
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate',
      details: error.message,
    });
  }
});

// Update a candidate
router.put('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, first_name, last_name, location, linkedin_url, status, notes } = req.body;

    const candidate = await ctx.prisma.candidate.update({
      where: { id },
      data: {
        email,
        phone,
        first_name,
        last_name,
        location,
        linkedin_url,
        status,
        notes,
      },
    });

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate,
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({
      error: 'Failed to update candidate',
      details: error.message,
    });
  }
});

// Delete a candidate
router.delete('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await ctx.prisma.candidate.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Candidate deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      error: 'Failed to delete candidate',
      details: error.message,
    });
  }
});

export default router;
