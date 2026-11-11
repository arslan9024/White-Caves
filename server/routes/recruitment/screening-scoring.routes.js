/**
 * screening-scoring.routes.js — Resume upload, candidate scoring & top-candidate endpoints
 * Extracted from recruitment.js (Single Purpose File decomposition)
 */
import express from 'express';
import { ctx } from './recruitment.context.js';
import { logRecruitmentAudit } from './recruitment.context.js';
import { requireRecruitmentAccess } from './recruitment.access.js';
import { upload } from './recruitment.upload.js';
import fs from 'fs';

const router = express.Router();

// ============= RESUME UPLOAD ENDPOINT =============

// Upload resume for a candidate
router.post(
  '/candidates/:candidate_id/upload-resume',
  upload.single('resume'),
  async (req, res) => {
    try {
      const { candidate_id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        });
      }

      // Create resume upload record
      const resumeUpload = await ctx.prisma.resumeUpload.create({
        data: {
          candidate_id,
          file_path: req.file.path,
          file_name: req.file.originalname,
          file_size: req.file.size,
          mime_type: req.file.mimetype,
        },
      });

      // Update candidate with resume URL
      await ctx.prisma.candidate.update({
        where: { id: candidate_id },
        data: {
          resume_url: req.file.path,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Resume uploaded successfully',
        resume: resumeUpload,
        note: 'Resume text extraction is queued for processing. Check status with extraction_status field.',
      });
    } catch (error) {
      console.error('Error uploading resume:', error);
      // Clean up uploaded file on error
      if (req.file) {
        fs.unlink(req.file.path, err => {
          if (err) console.error('Error deleting uploaded file:', err);
        });
      }
      res.status(500).json({
        error: 'Failed to upload resume',
        details: error.message,
      });
    }
  }
);

// ============= BATCH SCREENING ENDPOINTS (Phase 1B) =============

// Score a single candidate for a job
router.post(
  '/jobs/:job_id/score-candidate',
  requireRecruitmentAccess('write'),
  async (req, res) => {
    try {
      const { job_id } = req.params;
      const { candidate_id, weights } = req.body;

      // Validate input
      if (!candidate_id) {
        return res.status(400).json({
          error: 'candidate_id is required',
        });
      }

      // Score the candidate
      const score = await ctx.scoringService.scoreCandidateForJob(candidate_id, job_id, weights);

      logRecruitmentAudit(req, 'candidate_scored', {
        job_id,
        candidate_id,
        screening_status: score.screening_status,
        overall_score: score.overall_score,
      });

      res.status(201).json({
        success: true,
        message: 'Candidate scored successfully',
        score,
      });
    } catch (error) {
      console.error('Error scoring candidate:', error);
      res.status(500).json({
        error: 'Failed to score candidate',
        details: error.message,
      });
    }
  }
);

// Batch score all candidates for a job
router.post('/jobs/:job_id/batch-score', async (req, res) => {
  try {
    const { job_id } = req.params;
    const { weights } = req.body;

    // Batch score all candidates
    const scores = await ctx.scoringService.batchScoreCandidatesForJob(job_id, weights);

    res.status(200).json({
      success: true,
      message: `Scored ${scores.length} candidates for job`,
      job_id,
      total_candidates: scores.length,
      scores: scores.map(s => ({
        candidate_id: s.candidate_id,
        overall_score: s.overall_score,
        screening_status: s.screening_status,
        factors: {
          skills: s.skills_score,
          experience: s.experience_score,
          education: s.education_score,
          cultural_fit: s.cultural_fit_score,
          location_match: s.location_match_score,
        },
      })),
    });
  } catch (error) {
    console.error('Error batch scoring candidates:', error);
    res.status(500).json({
      error: 'Failed to batch score candidates',
      details: error.message,
    });
  }
});

// Get top candidates for a job
router.get('/jobs/:job_id/top-candidates', requireRecruitmentAccess('read'), async (req, res) => {
  try {
    const { job_id } = req.params;
    const { threshold = 75, limit = 10 } = req.query;

    const topCandidates = await ctx.scoringService.getTopCandidatesForJob(
      job_id,
      parseInt(threshold),
      parseInt(limit)
    );

    res.status(200).json({
      success: true,
      message: `Found ${topCandidates.length} top candidates`,
      job_id,
      threshold: parseInt(threshold),
      limit: parseInt(limit),
      candidates: topCandidates.map(score => ({
        candidate: {
          id: score.candidate.id,
          name: `${score.candidate.first_name} ${score.candidate.last_name}`,
          email: score.candidate.email,
          phone: score.candidate.phone,
          location: score.candidate.location,
          linkedin_url: score.candidate.linkedin_url,
        },
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
      })),
    });
  } catch (error) {
    console.error('Error fetching top candidates:', error);
    res.status(500).json({
      error: 'Failed to fetch top candidates',
      details: error.message,
    });
  }
});

export default router;
