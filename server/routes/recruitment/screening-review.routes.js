/**
 * screening-review.routes.js — Manager shortlist & manager review endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { logRecruitmentAudit } from './recruitment.context.js';
import { requireManagerReviewAccess } from './recruitment.access.js';
import { normalizeCandidateScore } from '../../services/recruitmentRecordMapper.js';

const router = express.Router();

// Manager self-service shortlist view for a job
router.get('/jobs/:job_id/manager-shortlist', requireManagerReviewAccess(), async (req, res) => {
  try {
    const { job_id } = req.params;
    const { min_score = 70, limit = 20 } = req.query;

    const threshold = parseInt(min_score, 10);
    const take = parseInt(limit, 10);

    const scores = await ctx.prisma.candidateScore.findMany({
      where: {
        job_id,
        overall_score: { gte: threshold },
      },
      include: {
        candidate: true,
      },
      orderBy: { overall_score: 'desc' },
      take,
    });

    const candidateIds = scores.map(score => score.candidate_id);
    const applications = candidateIds.length
      ? await ctx.prisma.application.findMany({
          where: {
            job_id,
            candidate_id: { in: candidateIds },
          },
        })
      : [];

    const applicationByCandidate = new Map(applications.map(app => [app.candidate_id, app]));

    const shortlist = scores.map(normalizeCandidateScore).map(score => {
      const application = applicationByCandidate.get(score.candidate_id);
      const recommendation =
        score.screening_status === 'strong_match'
          ? 'priority_shortlist'
          : score.screening_status === 'moderate_match'
            ? 'review_shortlist'
            : 'manual_review';

      return {
        candidate: {
          id: score.candidate.id,
          name:
            `${score.candidate.first_name || ''} ${score.candidate.last_name || ''}`.trim() ||
            score.candidate.email,
          email: score.candidate.email,
          phone: score.candidate.phone,
          location: score.candidate.location,
          status: score.candidate.status,
        },
        application: application
          ? {
              id: application.id,
              status: application.status,
              applied_at: application.applied_at,
              notes: application.notes,
            }
          : null,
        score: {
          overall: score.overall_score,
          screening_status: score.screening_status,
          feedback: score.feedback,
        },
        recommendation,
      };
    });

    logRecruitmentAudit(req, 'manager_shortlist_viewed', {
      job_id,
      min_score: threshold,
      results: shortlist.length,
    });

    res.status(200).json({
      success: true,
      job_id,
      min_score: threshold,
      total: shortlist.length,
      shortlist,
    });
  } catch (error) {
    console.error('Error building manager shortlist:', error);
    res.status(500).json({
      error: 'Failed to build manager shortlist',
      details: error.message,
    });
  }
});

// Manager review decision for a candidate application
router.post(
  '/applications/:application_id/manager-review',
  requireManagerReviewAccess(),
  async (req, res) => {
    try {
      const { application_id } = req.params;
      const { decision, review_note } = req.body;

      if (!decision || !['shortlist', 'hold', 'reject'].includes(decision)) {
        return res.status(400).json({
          error: 'decision is required and must be one of: shortlist, hold, reject',
        });
      }

      const application = await ctx.prisma.application.findUnique({
        where: { id: application_id },
        include: { candidate: true, job: true },
      });

      if (!application) {
        return res.status(404).json({ error: 'Application not found' });
      }

      const decisionMap = {
        shortlist: { applicationStatus: 'shortlisted', candidateStatus: 'under_review' },
        hold: {
          applicationStatus: 'manager_review',
          candidateStatus: application.candidate.status || 'under_review',
        },
        reject: { applicationStatus: 'rejected', candidateStatus: 'rejected' },
      };

      const decisionConfig = decisionMap[decision];
      const noteParts = [
        `Manager review decision: ${decision} on ${new Date().toISOString()}`,
        review_note ? `Note: ${review_note}` : null,
      ].filter(Boolean);

      const updatedApplication = await ctx.prisma.application.update({
        where: { id: application_id },
        data: {
          status: decisionConfig.applicationStatus,
          notes: [application.notes, ...noteParts].filter(Boolean).join(' | '),
        },
      });

      await ctx.prisma.candidate.update({
        where: { id: application.candidate_id },
        data: { status: decisionConfig.candidateStatus },
      });

      logRecruitmentAudit(req, 'manager_review_submitted', {
        application_id,
        job_id: application.job_id,
        candidate_id: application.candidate_id,
        decision,
        application_status: decisionConfig.applicationStatus,
        candidate_status: decisionConfig.candidateStatus,
      });

      res.status(200).json({
        success: true,
        message: 'Manager review decision recorded',
        application_id,
        decision,
        status: updatedApplication.status,
        candidate_status: decisionConfig.candidateStatus,
      });
    } catch (error) {
      console.error('Error recording manager review:', error);
      res.status(500).json({
        error: 'Failed to record manager review',
        details: error.message,
      });
    }
  }
);

export default router;
