/**
 * screening-insights.routes.js — Screening scores, resume extraction & screening metrics endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { requireRecruitmentAccess } from './recruitment.access.js';
import { computeScreeningMetrics } from './recruitment.metrics.js';
import { ResumeParserService } from '../../services/ResumeParserService.js';
import { normalizeCandidateScore } from '../../services/recruitmentRecordMapper.js';

const router = express.Router();

// Get candidate screening details
router.get('/candidates/:candidate_id/screening-scores', async (req, res) => {
  try {
    const { candidate_id } = req.params;

    const scores = await ctx.prisma.candidateScore.findMany({
      where: { candidate_id },
      include: { job: true },
      orderBy: { scored_at: 'desc' },
    });

    res.status(200).json({
      success: true,
      candidate_id,
      total_applications: scores.length,
      scores: scores.map(normalizeCandidateScore).map(score => ({
        job: score.job
          ? {
              id: score.job.id,
              title: score.job.title,
              department: score.job.department,
              location: score.job.location,
            }
          : null,
        score: {
          overall: score.overall_score,
          status: score.screening_status,
          factors: {
            skills: score.skills_score,
            experience: score.experience_score,
            education: score.education_score,
            cultural_fit: score.cultural_fit_score,
            location_match: score.location_match_score,
          },
          feedback: score.feedback,
        },
        scored_at: score.scored_at,
      })),
    });
  } catch (error) {
    console.error('Error fetching screening scores:', error);
    res.status(500).json({
      error: 'Failed to fetch screening scores',
      details: error.message,
    });
  }
});

// Extract and parse resume text
router.post('/candidates/:candidate_id/extract-resume', async (req, res) => {
  try {
    const { candidate_id } = req.params;

    // Get candidate with latest resume
    const candidate = await ctx.prisma.candidate.findUnique({
      where: { id: candidate_id },
    });

    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found',
      });
    }

    if (!candidate.resume_url) {
      return res.status(400).json({
        error: 'No resume found for this candidate',
      });
    }

    // Extract text from resume
    const extracted = await ResumeParserService.extractTextFromResume(candidate.resume_url);

    // Parse resume text to extract data
    const parsedData = ResumeParserService.parseResumeText(extracted.text);

    // Update candidate with parsed resume text
    await ctx.prisma.candidate.update({
      where: { id: candidate_id },
      data: {
        resume_text: extracted.text,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Resume extracted and parsed successfully',
      candidate_id,
      extraction: {
        method: extracted.method,
        pages: extracted.pageCount || 1,
      },
      parsed_data: {
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        contact: parsedData.contact,
      },
    });
  } catch (error) {
    console.error('Error extracting resume:', error);
    res.status(500).json({
      error: 'Failed to extract resume',
      details: error.message,
    });
  }
});

// Get screening metrics and insights
router.get(
  '/jobs/:job_id/screening-metrics',
  requireRecruitmentAccess('read'),
  async (req, res) => {
    try {
      const { job_id } = req.params;
      const includeLegacyAliases = req.query.include_legacy_aliases === 'true';

      const scores = await ctx.prisma.candidateScore.findMany({
        where: { job_id },
      });

      if (scores.length === 0) {
        return res.status(200).json({
          success: true,
          job_id,
          message: 'No candidates screened yet for this job',
          metrics: computeScreeningMetrics([], { includeLegacyAliases }),
        });
      }

      res.status(200).json({
        success: true,
        job_id,
        metrics: computeScreeningMetrics(scores, { includeLegacyAliases }),
      });
    } catch (error) {
      console.error('Error fetching screening metrics:', error);
      res.status(500).json({
        error: 'Failed to fetch screening metrics',
        details: error.message,
      });
    }
  }
);

export default router;
