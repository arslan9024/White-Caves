/**
 * interviews.routes.js — Interview scheduling & session management endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';

const router = express.Router();

// ============= INTERVIEW SCHEDULING ENDPOINTS =============

// Create interview session with available slots
router.post('/candidates/:candidateId/interview/schedule', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { jobId, interviewerIds, slotOptions } = req.body;

    if (!jobId || !interviewerIds || !slotOptions) {
      return res.status(400).json({
        error: 'Missing required fields: jobId, interviewerIds, slotOptions',
      });
    }

    const { InterviewSchedulingService } =
      await import('../../services/InterviewSchedulingService.js');

    const result = await InterviewSchedulingService.createInterviewSession(
      candidateId,
      jobId,
      interviewerIds,
      slotOptions
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create interview session',
      details: error.message,
    });
  }
});

// Process candidate response to interview invitation
router.post('/interview/process-response', async (req, res) => {
  try {
    const { waId, phoneNumber, messageContent, sessionId } = req.body;

    if (!waId || !phoneNumber || !messageContent || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields: waId, phoneNumber, messageContent, sessionId',
      });
    }

    const { InterviewSchedulingService } =
      await import('../../services/InterviewSchedulingService.js');

    const result = await InterviewSchedulingService.processInterviewResponse(
      waId,
      phoneNumber,
      messageContent,
      sessionId
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to process interview response',
      details: error.message,
    });
  }
});

// Send interview reminder
router.post('/interview/:interviewId/send-reminder', async (req, res) => {
  try {
    const { interviewId } = req.params;

    const { InterviewSchedulingService } =
      await import('../../services/InterviewSchedulingService.js');

    const result = await InterviewSchedulingService.sendInterviewReminder(interviewId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send reminder',
      details: error.message,
    });
  }
});

// Get interview statistics for a job
router.get('/jobs/:jobId/interview-stats', async (req, res) => {
  try {
    const { jobId } = req.params;

    const { InterviewSchedulingService } =
      await import('../../services/InterviewSchedulingService.js');

    const stats = await InterviewSchedulingService.getInterviewStats(jobId);

    if (!stats) {
      return res.status(404).json({
        error: 'No interviews found for this job',
      });
    }

    res.json({
      success: true,
      jobId,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get interview statistics',
      details: error.message,
    });
  }
});

// Get interview session details
router.get('/interview/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ctx.prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        candidate: {
          select: {
            id: true,
            first_name: true,
            email: true,
            phone_number: true,
            whatsapp_phone: true,
          },
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(404).json({
        error: 'Interview session not found',
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get interview session',
      details: error.message,
    });
  }
});

// Get all interviews for a candidate
router.get('/candidates/:candidateId/interviews', async (req, res) => {
  try {
    const { candidateId } = req.params;

    const interviews = await ctx.prisma.interview.findMany({
      where: { candidateId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
          },
        },
        session: {
          select: {
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });

    res.json({
      success: true,
      candidateId,
      total: interviews.length,
      interviews,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get candidate interviews',
      details: error.message,
    });
  }
});

// Update interview status (completed, no-show, etc)
router.patch('/interview/:interviewId/status', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status, feedback, notes } = req.body;

    const validStatuses = [
      'scheduled',
      'in-progress',
      'completed',
      'no_show',
      'rescheduled',
      'cancelled',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', '),
      });
    }

    const updated = await ctx.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status,
        feedback,
        notes,
        completedAt: status === 'completed' ? new Date() : null,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      interview: updated,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update interview status',
      details: error.message,
    });
  }
});

export default router;
