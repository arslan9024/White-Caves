/**
 * whatsapp.routes.js — WhatsApp screening notification & template endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { requireRecruitmentAccess } from './recruitment.access.js';

const router = express.Router();

// ============= WHATSAPP INTEGRATION ENDPOINTS =============

// Send screening results to all candidates for a job via WhatsApp
router.post('/jobs/:jobId/send-whatsapp-results', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { filter_status } = req.body; // Optional: filter by screening status

    // Get job details
    const job = await ctx.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get all candidates scored for this job
    let scoredCandidates = await ctx.prisma.candidateScore.findMany({
      where: { job_id: jobId },
      include: {
        candidate: true,
      },
    });

    // Optional filter by screening status
    if (filter_status) {
      scoredCandidates = scoredCandidates.filter(score => score.screening_status === filter_status);
    }

    // Send WhatsApp message to each candidate
    const results = {
      total: scoredCandidates.length,
      sent: 0,
      failed: 0,
      messages: [],
    };

    for (const scoreRecord of scoredCandidates) {
      try {
        await ctx.scoringService.sendScoringResultViaMeta(scoreRecord.candidate, job, scoreRecord);
        results.sent++;
        results.messages.push({
          candidate_id: scoreRecord.candidate_id,
          phone: scoreRecord.candidate.whatsapp_phone || scoreRecord.candidate.phone_number,
          status: 'sent',
        });
      } catch (error) {
        results.failed++;
        results.messages.push({
          candidate_id: scoreRecord.candidate_id,
          phone: scoreRecord.candidate.whatsapp_phone || scoreRecord.candidate.phone_number,
          status: 'failed',
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      job_id: jobId,
      job_title: job.title,
      results,
    });
  } catch (error) {
    console.error('Error sending WhatsApp results:', error);
    res.status(500).json({
      error: 'Failed to send WhatsApp messages',
      details: error.message,
    });
  }
});

// Batch score candidates and send WhatsApp messages
router.post('/jobs/:jobId/batch-score-and-notify', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { candidate_ids } = req.body;

    // Get job details
    const job = await ctx.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Score each candidate and send WhatsApp message
    const results = {
      total: candidate_ids.length,
      scored: 0,
      messaged: 0,
      failed: 0,
      candidates: [],
    };

    for (const candidateId of candidate_ids) {
      try {
        // Score the candidate
        const scoreRecord = await ctx.scoringService.scoreCandidateForJob(candidateId, jobId);

        results.scored++;

        // Get candidate details
        const candidate = await ctx.prisma.candidate.findUnique({
          where: { id: candidateId },
        });

        // Send WhatsApp message
        if (candidate?.whatsapp_phone || candidate?.phone_number) {
          try {
            await ctx.scoringService.sendScoringResultViaMeta(candidate, job, scoreRecord);
            results.messaged++;
          } catch (msgError) {
            console.warn('Failed to send message for candidate:', candidateId);
          }
        }

        results.candidates.push({
          candidate_id: candidateId,
          score: scoreRecord.overall_score,
          status: scoreRecord.screening_status,
          message_sent: candidate?.whatsapp_phone ? true : false,
        });
      } catch (error) {
        results.failed++;
        results.candidates.push({
          candidate_id: candidateId,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      job_id: jobId,
      job_title: job.title,
      results,
    });
  } catch (error) {
    console.error('Error in batch score and notify:', error);
    res.status(500).json({
      error: 'Failed to process batch scoring',
      details: error.message,
    });
  }
});

// Get WhatsApp message templates
router.get('/whatsapp/templates', async (req, res) => {
  try {
    const templates = ctx.templateService.getAll();
    res.json({
      success: true,
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        variables: t.variables,
        enabled: t.enabled,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get preview of a message template
router.get('/whatsapp/templates/:templateId/preview', async (req, res) => {
  try {
    const preview = ctx.templateService.getPreview(req.params.templateId);
    res.json({
      success: true,
      template_id: req.params.templateId,
      preview,
    });
  } catch (error) {
    res.status(404).json({
      error: 'Template not found',
      details: error.message,
    });
  }
});

// Validate WhatsApp templates against production readiness checks
router.get(
  '/whatsapp/templates/production-validation',
  requireRecruitmentAccess('read'),
  async (req, res) => {
    try {
      const { template_id } = req.query;
      const maxBodyLength = req.query.max_body_length
        ? parseInt(req.query.max_body_length, 10)
        : undefined;
      const options = Number.isFinite(maxBodyLength) ? { maxBodyLength } : {};

      if (template_id) {
        const result = ctx.templateService.validateTemplateForProduction(template_id, options);
        return res.status(200).json({
          success: true,
          validation: result,
        });
      }

      const result = ctx.templateService.validateAllTemplatesForProduction(options);
      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      const statusCode = error.message?.includes('Template not found') ? 404 : 500;
      return res.status(statusCode).json({
        error: 'Failed to validate templates for production',
        details: error.message,
      });
    }
  }
);

export default router;
