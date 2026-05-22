import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CandidateScoringService } from '../services/CandidateScoringService.js';
import MessageTemplateService from '../services/MessageTemplateService.js';
import { ResumeParserService } from '../services/ResumeParserService.js';
import { ConversationMetricsAnalyzer } from '../services/ConversationMetricsAnalyzer.js';
import { EnhancedIntentDetectionService } from '../services/EnhancedIntentDetectionService.js';
import { LeadQualificationService } from '../services/LeadQualificationService.js';
import { ConversationBatchProcessor } from '../services/ConversationBatchProcessor.js';
import { LeadScoringIntegration } from '../utils/LeadScoringIntegration.js';

const router = express.Router();
let prisma = new PrismaClient();
let scoringService = CandidateScoringService;
let templateService = MessageTemplateService;
let recruitmentAuditLogger = (eventType, payload) => {
  console.log(`[RecruitmentAudit] ${eventType}`, payload);
};

const RECRUITMENT_READ_ROLES = ['hr', 'hiring_manager', 'executive', 'admin'];
const RECRUITMENT_WRITE_ROLES = ['hr', 'admin'];
const RECRUITMENT_MANAGER_REVIEW_ROLES = ['hiring_manager', 'hr', 'admin'];
const OFFER_PIPELINE_STATUSES = ['offer', 'offer_approved', 'offer_accepted'];

export function __setRecruitmentTestDeps({ prismaClient, candidateScoringService, messageTemplateService, auditLogger } = {}) {
  if (prismaClient) prisma = prismaClient;
  if (candidateScoringService) scoringService = candidateScoringService;
  if (messageTemplateService) templateService = messageTemplateService;
  if (auditLogger) recruitmentAuditLogger = auditLogger;
}

export function __resetRecruitmentTestDeps() {
  prisma = new PrismaClient();
  scoringService = CandidateScoringService;
  templateService = MessageTemplateService;
  recruitmentAuditLogger = (eventType, payload) => {
    console.log(`[RecruitmentAudit] ${eventType}`, payload);
  };
}

function logRecruitmentAudit(req, eventType, payload = {}) {
  try {
    recruitmentAuditLogger(eventType, {
      at: new Date().toISOString(),
      actor_role: req.recruitmentAccess?.role || req.headers['x-user-role'] || req.user?.role || 'unknown',
      actor_id: req.user?.id || req.headers['x-user-id'] || null,
      route: req.originalUrl,
      method: req.method,
      ...payload
    });
  } catch (auditError) {
    console.warn('Recruitment audit logging failed:', auditError.message);
  }
}

export function requireRecruitmentAccess(level = 'read') {
  return (req, res, next) => {
    // Keep backward compatibility in environments where auth is not wired yet.
    if (process.env.RECRUITMENT_AUTH_MODE !== 'enforced') {
      return next();
    }

    const headerRole = req.headers['x-user-role'];
    const userRole = (headerRole || req.user?.role || '').toString().trim().toLowerCase();

    if (!userRole) {
      return res.status(401).json({
        error: 'Authentication required for recruitment routes'
      });
    }

    const allowedRoles = level === 'write' ? RECRUITMENT_WRITE_ROLES : RECRUITMENT_READ_ROLES;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Recruitment ${level} access denied for role: ${userRole}`
      });
    }

    req.recruitmentAccess = { role: userRole, level };
    return next();
  };
}

export function requireManagerReviewAccess() {
  return (req, res, next) => {
    if (process.env.RECRUITMENT_AUTH_MODE !== 'enforced') {
      return next();
    }

    const headerRole = req.headers['x-user-role'];
    const userRole = (headerRole || req.user?.role || '').toString().trim().toLowerCase();

    if (!userRole) {
      return res.status(401).json({
        error: 'Authentication required for manager review routes'
      });
    }

    if (!RECRUITMENT_MANAGER_REVIEW_ROLES.includes(userRole)) {
      return res.status(403).json({
        error: `Manager review access denied for role: ${userRole}`
      });
    }

    req.recruitmentAccess = { role: userRole, level: 'manager_review' };
    return next();
  };
}

export function computeScreeningMetrics(scores = []) {
  if (!scores.length) {
    return {
      total_candidates: 0,
      strong_matches: 0,
      moderate_matches: 0,
      weak_matches: 0,
      rejected_matches: 0,
      good_matches: 0,
      potential_matches: 0,
      no_match: 0,
      average_score: 0,
      median_score: 0,
      factor_averages: {
        skills: 0,
        experience: 0,
        education: 0,
        cultural_fit: 0,
        location_match: 0
      },
      score_distribution: {
        very_high: 0,
        high: 0,
        medium: 0,
        low: 0,
        very_low: 0
      }
    };
  }

  const statusCounts = {
    strong_match: 0,
    moderate_match: 0,
    weak_match: 0,
    rejected: 0
  };

  let totalScore = 0;
  const sortedScores = [];

  scores.forEach(score => {
    if (statusCounts[score.screening_status] !== undefined) {
      statusCounts[score.screening_status]++;
    }
    totalScore += score.overall_score || 0;
    sortedScores.push(score.overall_score || 0);
  });

  sortedScores.sort((a, b) => a - b);
  const medianScore = sortedScores.length % 2 === 0
    ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
    : sortedScores[Math.floor(sortedScores.length / 2)];

  return {
    total_candidates: scores.length,
    strong_matches: statusCounts.strong_match,
    moderate_matches: statusCounts.moderate_match,
    weak_matches: statusCounts.weak_match,
    rejected_matches: statusCounts.rejected,
    good_matches: statusCounts.moderate_match,
    potential_matches: statusCounts.weak_match,
    no_match: statusCounts.rejected,
    average_score: Math.round(totalScore / scores.length),
    median_score: Math.round(medianScore),
    factor_averages: {
      skills: Math.round(scores.reduce((sum, s) => sum + (s.skills_score || 0), 0) / scores.length),
      experience: Math.round(scores.reduce((sum, s) => sum + (s.experience_score || 0), 0) / scores.length),
      education: Math.round(scores.reduce((sum, s) => sum + (s.education_score || 0), 0) / scores.length),
      cultural_fit: Math.round(scores.reduce((sum, s) => sum + (s.cultural_fit_score || 0), 0) / scores.length),
      location_match: Math.round(scores.reduce((sum, s) => sum + (s.location_match_score || 0), 0) / scores.length)
    },
    score_distribution: {
      very_high: scores.filter(s => (s.overall_score || 0) >= 85).length,
      high: scores.filter(s => (s.overall_score || 0) >= 75 && (s.overall_score || 0) < 85).length,
      medium: scores.filter(s => (s.overall_score || 0) >= 50 && (s.overall_score || 0) < 75).length,
      low: scores.filter(s => (s.overall_score || 0) >= 25 && (s.overall_score || 0) < 50).length,
      very_low: scores.filter(s => (s.overall_score || 0) < 25).length
    }
  };
}

export function buildRecruitmentOverview(jobs = [], applications = [], scores = []) {
  const metrics = computeScreeningMetrics(scores);
  const openJobs = jobs.filter(job => job.status === 'open');

  return {
    totals: {
      jobs: jobs.length,
      open_jobs: openJobs.length,
      active_applications: applications.filter(app => !['hired', 'rejected'].includes(app.status)).length,
      interview_pipeline: applications.filter(app => app.status === 'interview').length,
      offer_pipeline: applications.filter(app => OFFER_PIPELINE_STATUSES.includes(app.status)).length,
      hired: applications.filter(app => app.status === 'hired').length
    },
    screening: metrics,
    recent_jobs: jobs.slice(0, 5).map(job => ({
      id: job.id,
      title: job.title,
      department: job.department,
      status: job.status,
      applications: job._count?.applications || 0
    }))
  };
}

export function buildOnboardingChecklist(candidate, job, startDate) {
  const fullName = [candidate.first_name, candidate.last_name].filter(Boolean).join(' ') || candidate.email || 'Candidate';
  return {
    candidate_name: fullName,
    company_name: 'White Caves Real Estate',
    job_title: job.title,
    start_date: startDate,
    buddy_name: 'Sarah Johnson',
    training_modules: [
      'HR Orientation',
      'CRM Access Setup',
      `${job.department || 'Department'} Workflow Training`
    ],
    checklist_items: [
      'Bring Emirates ID and work authorization documents',
      'Sign HR and payroll documents',
      'Collect laptop and access credentials from IT',
      'Attend manager introduction and workflow briefing'
    ]
  };
}

// Setup multer for file uploads
const uploadsDir = 'server/uploads/resumes';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, DOC, and TXT files are allowed.'));
    }
  }
});

// ============= CANDIDATES ENDPOINTS =============

// Create a new candidate
router.post('/candidates', async (req, res) => {
  try {
    const { email, phone, first_name, last_name, location, linkedin_url, source } = req.body;

    // Validate required fields
    if (!email || !first_name || !last_name) {
      return res.status(400).json({
        error: 'Missing required fields: email, first_name, last_name'
      });
    }

    // Check if candidate already exists
    const existingCandidate = await prisma.candidate.findUnique({
      where: { email }
    });

    if (existingCandidate) {
      return res.status(409).json({
        error: 'Candidate with this email already exists',
        candidate_id: existingCandidate.id
      });
    }

    const candidate = await prisma.candidate.create({
      data: {
        email,
        phone,
        first_name,
        last_name,
        location,
        linkedin_url,
        source: source || 'manual_upload'
      }
    });

    res.status(201).json({
      success: true,
      message: 'Candidate created successfully',
      candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({
      error: 'Failed to create candidate',
      details: error.message
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
      prisma.candidate.findMany({
        where: filters,
        include: {
          scores: { orderBy: { scored_at: 'desc' }, take: 1 },
          applications: true,
          interviews: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.candidate.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: candidates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({
      error: 'Failed to fetch candidates',
      details: error.message
    });
  }
});

// Get a single candidate by ID
router.get('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        scores: { orderBy: { scored_at: 'desc' } },
        applications: {
          include: { job: true },
          orderBy: { applied_at: 'desc' }
        },
        interviews: { orderBy: { scheduled_at: 'desc' } }
      }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    res.json({
      success: true,
      candidate
    });
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      error: 'Failed to fetch candidate',
      details: error.message
    });
  }
});

// Update a candidate
router.put('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, first_name, last_name, location, linkedin_url, status, notes } = req.body;

    const candidate = await prisma.candidate.update({
      where: { id },
      data: {
        email,
        phone,
        first_name,
        last_name,
        location,
        linkedin_url,
        status,
        notes
      }
    });

    res.json({
      success: true,
      message: 'Candidate updated successfully',
      candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({
      error: 'Failed to update candidate',
      details: error.message
    });
  }
});

// Delete a candidate
router.delete('/candidates/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.candidate.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Candidate deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({
      error: 'Failed to delete candidate',
      details: error.message
    });
  }
});

// ============= JOBS ENDPOINTS =============

// Create a new job posting
router.post('/jobs', async (req, res) => {
  try {
    const { title, description, department, location, salary_min, salary_max, required_skills, experience_years } = req.body;

    if (!title || !department) {
      return res.status(400).json({
        error: 'Missing required fields: title, department'
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        department,
        location,
        salary_min: salary_min ? parseFloat(salary_min) : null,
        salary_max: salary_max ? parseFloat(salary_max) : null,
        required_skills: required_skills || [],
        experience_years: experience_years ? parseInt(experience_years) : null
      }
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      error: 'Failed to create job',
      details: error.message
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
      prisma.job.findMany({
        where: filters,
        include: {
          applications: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.job.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      error: 'Failed to fetch jobs',
      details: error.message
    });
  }
});

// Get a single job by ID
router.get('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        applications: {
          include: { candidate: true },
          orderBy: { applied_at: 'desc' }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      success: true,
      job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      error: 'Failed to fetch job',
      details: error.message
    });
  }
});

// Update a job
router.put('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, department, location, salary_min, salary_max, status, required_skills, experience_years } = req.body;

    const job = await prisma.job.update({
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
        experience_years: experience_years ? parseInt(experience_years) : undefined
      }
    });

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      error: 'Failed to update job',
      details: error.message
    });
  }
});

// Delete a job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      error: 'Failed to delete job',
      details: error.message
    });
  }
});

// ============= APPLICATIONS ENDPOINTS =============

// Create an application
router.post('/applications', async (req, res) => {
  try {
    const { candidate_id, job_id, notes } = req.body;

    if (!candidate_id || !job_id) {
      return res.status(400).json({
        error: 'Missing required fields: candidate_id, job_id'
      });
    }

    // Check if application already exists
    const existingApp = await prisma.application.findFirst({
      where: {
        candidate_id,
        job_id
      }
    });

    if (existingApp) {
      return res.status(409).json({
        error: 'Application already exists for this candidate and job',
        application_id: existingApp.id
      });
    }

    const application = await prisma.application.create({
      data: {
        candidate_id,
        job_id,
        notes
      },
      include: {
        candidate: true,
        job: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      application
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      error: 'Failed to create application',
      details: error.message
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
      prisma.application.findMany({
        where: filters,
        include: {
          candidate: true,
          job: true
        },
        orderBy: { applied_at: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.application.count({ where: filters })
    ]);

    res.json({
      success: true,
      data: applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({
      error: 'Failed to fetch applications',
      details: error.message
    });
  }
});

// Get a single application
router.get('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        candidate: true,
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({
      error: 'Failed to fetch application',
      details: error.message
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
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status }
    });

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      error: 'Failed to update application status',
      details: error.message
    });
  }
});

// Update application
router.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const application = await prisma.application.update({
      where: { id },
      data: {
        status,
        notes
      }
    });

    res.json({
      success: true,
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({
      error: 'Failed to update application',
      details: error.message
    });
  }
});

// Delete application
router.delete('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.application.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      error: 'Failed to delete application',
      details: error.message
    });
  }
});

// ============= RESUME UPLOAD ENDPOINT =============

// Upload resume for a candidate
router.post('/candidates/:candidate_id/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    const { candidate_id } = req.params;

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded'
      });
    }

    // Create resume upload record
    const resumeUpload = await prisma.resumeUpload.create({
      data: {
        candidate_id,
        file_path: req.file.path,
        file_name: req.file.originalname,
        file_size: req.file.size,
        mime_type: req.file.mimetype
      }
    });

    // Update candidate with resume URL
    await prisma.candidate.update({
      where: { id: candidate_id },
      data: {
        resume_url: req.file.path
      }
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: resumeUpload,
      note: 'Resume text extraction is queued for processing. Check status with extraction_status field.'
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }
    res.status(500).json({
      error: 'Failed to upload resume',
      details: error.message
    });
  }
});

// ============= BATCH SCREENING ENDPOINTS (Phase 1B) =============

// Score a single candidate for a job
router.post('/jobs/:job_id/score-candidate', requireRecruitmentAccess('write'), async (req, res) => {
  try {
    const { job_id } = req.params;
    const { candidate_id, weights } = req.body;

    // Validate input
    if (!candidate_id) {
      return res.status(400).json({
        error: 'candidate_id is required'
      });
    }

    // Score the candidate
    const score = await scoringService.scoreCandidateForJob(
      candidate_id,
      job_id,
      weights
    );

    logRecruitmentAudit(req, 'candidate_scored', {
      job_id,
      candidate_id,
      screening_status: score.screening_status,
      overall_score: score.overall_score
    });

    res.status(201).json({
      success: true,
      message: 'Candidate scored successfully',
      score
    });
  } catch (error) {
    console.error('Error scoring candidate:', error);
    res.status(500).json({
      error: 'Failed to score candidate',
      details: error.message
    });
  }
});

// Batch score all candidates for a job
router.post('/jobs/:job_id/batch-score', async (req, res) => {
  try {
    const { job_id } = req.params;
    const { weights } = req.body;

    // Batch score all candidates
    const scores = await scoringService.batchScoreCandidatesForJob(
      job_id,
      weights
    );

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
          location_match: s.location_match_score
        }
      }))
    });
  } catch (error) {
    console.error('Error batch scoring candidates:', error);
    res.status(500).json({
      error: 'Failed to batch score candidates',
      details: error.message
    });
  }
});

// Get top candidates for a job
router.get('/jobs/:job_id/top-candidates', requireRecruitmentAccess('read'), async (req, res) => {
  try {
    const { job_id } = req.params;
    const { threshold = 75, limit = 10 } = req.query;

    const topCandidates = await scoringService.getTopCandidatesForJob(
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
          linkedin_url: score.candidate.linkedin_url
        },
        score: {
          overall: score.overall_score,
          status: score.screening_status,
          factors: {
            skills: score.skills_score,
            experience: score.experience_score,
            education: score.education_score,
            cultural_fit: score.cultural_fit_score,
            location_match: score.location_match_score
          },
          feedback: score.feedback
        }
      }))
    });
  } catch (error) {
    console.error('Error fetching top candidates:', error);
    res.status(500).json({
      error: 'Failed to fetch top candidates',
      details: error.message
    });
  }
});

// Manager self-service shortlist view for a job
router.get('/jobs/:job_id/manager-shortlist', requireManagerReviewAccess(), async (req, res) => {
  try {
    const { job_id } = req.params;
    const { min_score = 70, limit = 20 } = req.query;

    const threshold = parseInt(min_score, 10);
    const take = parseInt(limit, 10);

    const scores = await prisma.candidateScore.findMany({
      where: {
        job_id,
        overall_score: { gte: threshold }
      },
      include: {
        candidate: true
      },
      orderBy: { overall_score: 'desc' },
      take
    });

    const candidateIds = scores.map(score => score.candidate_id);
    const applications = candidateIds.length
      ? await prisma.application.findMany({
        where: {
          job_id,
          candidate_id: { in: candidateIds }
        }
      })
      : [];

    const applicationByCandidate = new Map(applications.map(app => [app.candidate_id, app]));

    const shortlist = scores.map(score => {
      const application = applicationByCandidate.get(score.candidate_id);
      const recommendation = score.screening_status === 'strong_match'
        ? 'priority_shortlist'
        : score.screening_status === 'moderate_match'
          ? 'review_shortlist'
          : 'manual_review';

      return {
        candidate: {
          id: score.candidate.id,
          name: `${score.candidate.first_name || ''} ${score.candidate.last_name || ''}`.trim() || score.candidate.email,
          email: score.candidate.email,
          phone: score.candidate.phone,
          location: score.candidate.location,
          status: score.candidate.status
        },
        application: application ? {
          id: application.id,
          status: application.status,
          applied_at: application.applied_at,
          notes: application.notes
        } : null,
        score: {
          overall: score.overall_score,
          screening_status: score.screening_status,
          feedback: score.feedback
        },
        recommendation
      };
    });

    logRecruitmentAudit(req, 'manager_shortlist_viewed', {
      job_id,
      min_score: threshold,
      results: shortlist.length
    });

    res.status(200).json({
      success: true,
      job_id,
      min_score: threshold,
      total: shortlist.length,
      shortlist
    });
  } catch (error) {
    console.error('Error building manager shortlist:', error);
    res.status(500).json({
      error: 'Failed to build manager shortlist',
      details: error.message
    });
  }
});

// Manager review decision for a candidate application
router.post('/applications/:application_id/manager-review', requireManagerReviewAccess(), async (req, res) => {
  try {
    const { application_id } = req.params;
    const { decision, review_note } = req.body;

    if (!decision || !['shortlist', 'hold', 'reject'].includes(decision)) {
      return res.status(400).json({
        error: 'decision is required and must be one of: shortlist, hold, reject'
      });
    }

    const application = await prisma.application.findUnique({
      where: { id: application_id },
      include: { candidate: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const decisionMap = {
      shortlist: { applicationStatus: 'shortlisted', candidateStatus: 'under_review' },
      hold: { applicationStatus: 'manager_review', candidateStatus: application.candidate.status || 'under_review' },
      reject: { applicationStatus: 'rejected', candidateStatus: 'rejected' }
    };

    const decisionConfig = decisionMap[decision];
    const noteParts = [
      `Manager review decision: ${decision} on ${new Date().toISOString()}`,
      review_note ? `Note: ${review_note}` : null
    ].filter(Boolean);

    const updatedApplication = await prisma.application.update({
      where: { id: application_id },
      data: {
        status: decisionConfig.applicationStatus,
        notes: [application.notes, ...noteParts].filter(Boolean).join(' | ')
      }
    });

    await prisma.candidate.update({
      where: { id: application.candidate_id },
      data: { status: decisionConfig.candidateStatus }
    });

    logRecruitmentAudit(req, 'manager_review_submitted', {
      application_id,
      job_id: application.job_id,
      candidate_id: application.candidate_id,
      decision,
      application_status: decisionConfig.applicationStatus,
      candidate_status: decisionConfig.candidateStatus
    });

    res.status(200).json({
      success: true,
      message: 'Manager review decision recorded',
      application_id,
      decision,
      status: updatedApplication.status,
      candidate_status: decisionConfig.candidateStatus
    });
  } catch (error) {
    console.error('Error recording manager review:', error);
    res.status(500).json({
      error: 'Failed to record manager review',
      details: error.message
    });
  }
});

// Get candidate screening details
router.get('/candidates/:candidate_id/screening-scores', async (req, res) => {
  try {
    const { candidate_id } = req.params;

    const scores = await prisma.candidateScore.findMany({
      where: { candidate_id },
      include: { job: true },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({
      success: true,
      candidate_id,
      total_applications: scores.length,
      scores: scores.map(score => ({
        job: {
          id: score.job.id,
          title: score.job.title,
          department: score.job.department,
          location: score.job.location
        },
        score: {
          overall: score.overall_score,
          status: score.screening_status,
          factors: {
            skills: score.skills_score,
            experience: score.experience_score,
            education: score.education_score,
            cultural_fit: score.cultural_fit_score,
            location_match: score.location_match_score
          },
          feedback: score.feedback
        },
        scored_at: score.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching screening scores:', error);
    res.status(500).json({
      error: 'Failed to fetch screening scores',
      details: error.message
    });
  }
});

// Extract and parse resume text
router.post('/candidates/:candidate_id/extract-resume', async (req, res) => {
  try {
    const { candidate_id } = req.params;

    // Get candidate with latest resume
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidate_id },
      include: {
        resumeUploads: {
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    });

    if (!candidate) {
      return res.status(404).json({
        error: 'Candidate not found'
      });
    }

    if (!candidate.resumeUploads || candidate.resumeUploads.length === 0) {
      return res.status(400).json({
        error: 'No resume found for this candidate'
      });
    }

    const resumeUpload = candidate.resumeUploads[0];

    // Extract text from resume
    const extracted = await ResumeParserService.extractTextFromResume(
      resumeUpload.file_path
    );

    // Parse resume text to extract data
    const parsedData = ResumeParserService.parseResumeText(extracted.text);

    // Update candidate with parsed resume text
    const updated = await prisma.candidate.update({
      where: { id: candidate_id },
      data: {
        resume_text: extracted.text
      }
    });

    // Update extraction status
    await prisma.resumeUpload.update({
      where: { id: resumeUpload.id },
      data: {
        extraction_status: 'completed',
        extracted_data: JSON.stringify(parsedData)
      }
    });

    res.status(200).json({
      success: true,
      message: 'Resume extracted and parsed successfully',
      candidate_id,
      extraction: {
        method: extracted.method,
        pages: extracted.pageCount || 1
      },
      parsed_data: {
        skills: parsedData.skills,
        experience: parsedData.experience,
        education: parsedData.education,
        contact: parsedData.contact
      }
    });
  } catch (error) {
    console.error('Error extracting resume:', error);
    res.status(500).json({
      error: 'Failed to extract resume',
      details: error.message
    });
  }
});

// Get screening metrics and insights
router.get('/jobs/:job_id/screening-metrics', requireRecruitmentAccess('read'), async (req, res) => {
  try {
    const { job_id } = req.params;

    const scores = await prisma.candidateScore.findMany({
      where: { job_id }
    });

    if (scores.length === 0) {
      return res.status(200).json({
        success: true,
        job_id,
        message: 'No candidates screened yet for this job',
        metrics: computeScreeningMetrics([])
      });
    }

    res.status(200).json({
      success: true,
      job_id,
      metrics: computeScreeningMetrics(scores)
    });
  } catch (error) {
    console.error('Error fetching screening metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch screening metrics',
      details: error.message
    });
  }
});

// Recruitment overview for Zoe analytics
router.get('/overview', requireRecruitmentAccess('read'), async (req, res) => {
  try {
    const [jobs, applications, scores] = await Promise.all([
      prisma.job.findMany({
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { applications: true } } }
      }),
      prisma.application.findMany({ orderBy: { applied_at: 'desc' } }),
      prisma.candidateScore.findMany({ orderBy: { created_at: 'desc' } })
    ]);

    res.status(200).json({
      success: true,
      overview: buildRecruitmentOverview(jobs, applications, scores)
    });
  } catch (error) {
    console.error('Error fetching recruitment overview:', error);
    res.status(500).json({
      error: 'Failed to fetch recruitment overview',
      details: error.message
    });
  }
});

// ============= WHATSAPP INTEGRATION ENDPOINTS =============

// Send screening results to all candidates for a job via WhatsApp
router.post('/jobs/:jobId/send-whatsapp-results', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { filter_status } = req.body; // Optional: filter by screening status

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get all candidates scored for this job
    let scoredCandidates = await prisma.candidateScore.findMany({
      where: { job_id: jobId },
      include: {
        candidate: true
      }
    });

    // Optional filter by screening status
    if (filter_status) {
      scoredCandidates = scoredCandidates.filter(
        score => score.screening_status === filter_status
      );
    }

    // Send WhatsApp message to each candidate
    const results = {
      total: scoredCandidates.length,
      sent: 0,
      failed: 0,
      messages: []
    };

    for (const scoreRecord of scoredCandidates) {
      try {
        await scoringService.sendScoringResultViaMeta(
          scoreRecord.candidate,
          job,
          scoreRecord
        );
        results.sent++;
        results.messages.push({
          candidate_id: scoreRecord.candidate_id,
          phone: scoreRecord.candidate.whatsapp_phone || scoreRecord.candidate.phone_number,
          status: 'sent'
        });
      } catch (error) {
        results.failed++;
        results.messages.push({
          candidate_id: scoreRecord.candidate_id,
          phone: scoreRecord.candidate.whatsapp_phone || scoreRecord.candidate.phone_number,
          status: 'failed',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      job_id: jobId,
      job_title: job.title,
      results
    });
  } catch (error) {
    console.error('Error sending WhatsApp results:', error);
    res.status(500).json({
      error: 'Failed to send WhatsApp messages',
      details: error.message
    });
  }
});

// Batch score candidates and send WhatsApp messages
router.post('/jobs/:jobId/batch-score-and-notify', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { candidate_ids } = req.body;

    // Get job details
    const job = await prisma.job.findUnique({
      where: { id: jobId }
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
      candidates: []
    };

    for (const candidateId of candidate_ids) {
      try {
        // Score the candidate
        const scoreRecord = await scoringService.scoreCandidateForJob(
          candidateId,
          jobId
        );

        results.scored++;

        // Get candidate details
        const candidate = await prisma.candidate.findUnique({
          where: { id: candidateId }
        });

        // Send WhatsApp message
        if (candidate?.whatsapp_phone || candidate?.phone_number) {
          try {
            await scoringService.sendScoringResultViaMeta(
              candidate,
              job,
              scoreRecord
            );
            results.messaged++;
          } catch (msgError) {
            console.warn('Failed to send message for candidate:', candidateId);
          }
        }

        results.candidates.push({
          candidate_id: candidateId,
          score: scoreRecord.overall_score,
          status: scoreRecord.screening_status,
          message_sent: candidate?.whatsapp_phone ? true : false
        });
      } catch (error) {
        results.failed++;
        results.candidates.push({
          candidate_id: candidateId,
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      job_id: jobId,
      job_title: job.title,
      results
    });
  } catch (error) {
    console.error('Error in batch score and notify:', error);
    res.status(500).json({
      error: 'Failed to process batch scoring',
      details: error.message
    });
  }
});

// Get WhatsApp message templates
router.get('/whatsapp/templates', async (req, res) => {
  try {
    const templates = templateService.getAll();
    res.json({
      success: true,
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        variables: t.variables,
        enabled: t.enabled
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get preview of a message template
router.get('/whatsapp/templates/:templateId/preview', async (req, res) => {
  try {
    const preview = templateService.getPreview(req.params.templateId);
    res.json({
      success: true,
      template_id: req.params.templateId,
      preview
    });
  } catch (error) {
    res.status(404).json({
      error: 'Template not found',
      details: error.message
    });
  }
});

// Send offer letter and move application to offer stage
router.post('/applications/:application_id/send-offer', requireRecruitmentAccess('write'), async (req, res) => {
  try {
    const { application_id } = req.params;
    const { salary, start_date, department, company_name = 'White Caves Real Estate' } = req.body;

    if (!salary || !start_date) {
      return res.status(400).json({
        error: 'salary and start_date are required'
      });
    }

    const application = await prisma.application.findUnique({
      where: { id: application_id },
      include: { candidate: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const variables = {
      candidate_name: application.candidate.first_name || application.candidate.email || 'Candidate',
      job_title: application.job.title,
      company_name,
      department: department || application.job.department || 'General',
      start_date,
      salary
    };

    const message = await scoringService.sendTemplateMessageViaMeta(
      application.candidate,
      'offer_letter',
      variables,
      'offer_letter'
    );

    await prisma.application.update({
      where: { id: application_id },
      data: {
        status: 'offer',
        notes: `Offer sent on ${new Date().toISOString()} | Salary: ${salary} | Start: ${start_date}`
      }
    });

    await prisma.candidate.update({
      where: { id: application.candidate_id },
      data: { status: 'selected' }
    });

    logRecruitmentAudit(req, 'offer_sent', {
      application_id,
      candidate_id: application.candidate_id,
      job_id: application.job_id,
      salary,
      start_date,
      template_id: 'offer_letter'
    });

    res.status(200).json({
      success: true,
      message: 'Offer sent successfully',
      application_id,
      whatsapp_message_id: message?._id,
      offer: variables
    });
  } catch (error) {
    console.error('Error sending offer:', error);
    res.status(500).json({
      error: 'Failed to send offer',
      details: error.message
    });
  }
});

// Approve a sent offer before candidate acceptance
router.post('/applications/:application_id/approve-offer', requireRecruitmentAccess('write'), async (req, res) => {
  try {
    const { application_id } = req.params;
    const { approved_by = 'HR', approval_note } = req.body;

    const application = await prisma.application.findUnique({
      where: { id: application_id },
      include: { candidate: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!['offer', 'offer_approved'].includes(application.status)) {
      return res.status(409).json({
        error: `Offer can only be approved from offer stage. Current status: ${application.status}`
      });
    }

    const noteParts = [
      `Offer approved on ${new Date().toISOString()} by ${approved_by}`,
      approval_note ? `Note: ${approval_note}` : null
    ].filter(Boolean);

    const updated = await prisma.application.update({
      where: { id: application_id },
      data: {
        status: 'offer_approved',
        notes: [application.notes, ...noteParts].filter(Boolean).join(' | ')
      }
    });

    logRecruitmentAudit(req, 'offer_approved', {
      application_id,
      candidate_id: application.candidate_id,
      job_id: application.job_id,
      approved_by,
      status: updated.status
    });

    res.status(200).json({
      success: true,
      message: 'Offer approved successfully',
      application_id,
      status: updated.status
    });
  } catch (error) {
    console.error('Error approving offer:', error);
    res.status(500).json({
      error: 'Failed to approve offer',
      details: error.message
    });
  }
});

// Record candidate response to an offer
router.post('/applications/:application_id/respond-offer', requireRecruitmentAccess('write'), async (req, res) => {
  try {
    const { application_id } = req.params;
    const { decision, response_note, confirmed_start_date } = req.body;

    if (!decision || !['accept', 'decline'].includes(decision)) {
      return res.status(400).json({
        error: 'decision is required and must be one of: accept, decline'
      });
    }

    const application = await prisma.application.findUnique({
      where: { id: application_id },
      include: { candidate: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!['offer', 'offer_approved', 'offer_accepted', 'offer_declined'].includes(application.status)) {
      return res.status(409).json({
        error: `Offer response can only be recorded from offer stages. Current status: ${application.status}`
      });
    }

    const accepted = decision === 'accept';
    const nextStatus = accepted ? 'offer_accepted' : 'offer_declined';
    const candidateStatus = accepted ? 'selected' : 'rejected';
    const decisionTimestamp = new Date().toISOString();
    const noteParts = [
      `Offer ${accepted ? 'accepted' : 'declined'} on ${decisionTimestamp}`,
      confirmed_start_date ? `Confirmed start: ${confirmed_start_date}` : null,
      response_note ? `Response note: ${response_note}` : null
    ].filter(Boolean);

    await prisma.application.update({
      where: { id: application_id },
      data: {
        status: nextStatus,
        notes: [application.notes, ...noteParts].filter(Boolean).join(' | ')
      }
    });

    await prisma.candidate.update({
      where: { id: application.candidate_id },
      data: { status: candidateStatus }
    });

    logRecruitmentAudit(req, 'offer_response_recorded', {
      application_id,
      candidate_id: application.candidate_id,
      job_id: application.job_id,
      decision,
      application_status: nextStatus,
      candidate_status: candidateStatus
    });

    res.status(200).json({
      success: true,
      message: `Offer ${accepted ? 'accepted' : 'declined'} successfully`,
      application_id,
      status: nextStatus,
      candidate_status: candidateStatus
    });
  } catch (error) {
    console.error('Error recording offer response:', error);
    res.status(500).json({
      error: 'Failed to record offer response',
      details: error.message
    });
  }
});

// Start onboarding after offer acceptance
router.post('/applications/:application_id/start-onboarding', requireRecruitmentAccess('write'), async (req, res) => {
  try {
    const { application_id } = req.params;
    const { start_date } = req.body;

    if (!start_date) {
      return res.status(400).json({
        error: 'start_date is required'
      });
    }

    const application = await prisma.application.findUnique({
      where: { id: application_id },
      include: { candidate: true, job: true }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (!['offer_accepted', 'offer_approved'].includes(application.status)) {
      return res.status(409).json({
        error: `Onboarding can only start after offer approval/acceptance. Current status: ${application.status}`
      });
    }

    const onboarding = buildOnboardingChecklist(application.candidate, application.job, start_date);

    const message = await scoringService.sendTemplateMessageViaMeta(
      application.candidate,
      'onboarding_welcome',
      {
        ...onboarding,
        checklist_items: onboarding.checklist_items.map(item => `• ${item}`).join('\n'),
        training_modules: onboarding.training_modules.map(item => `• ${item}`).join('\n')
      },
      'onboarding_welcome'
    );

    await prisma.application.update({
      where: { id: application_id },
      data: {
        status: 'hired',
        notes: `Onboarding started on ${new Date().toISOString()} | Start: ${start_date}`
      }
    });

    await prisma.candidate.update({
      where: { id: application.candidate_id },
      data: { status: 'hired' }
    });

    logRecruitmentAudit(req, 'onboarding_started', {
      application_id,
      candidate_id: application.candidate_id,
      job_id: application.job_id,
      start_date,
      template_id: 'onboarding_welcome'
    });

    res.status(200).json({
      success: true,
      message: 'Onboarding started successfully',
      application_id,
      whatsapp_message_id: message?._id,
      onboarding
    });
  } catch (error) {
    console.error('Error starting onboarding:', error);
    res.status(500).json({
      error: 'Failed to start onboarding',
      details: error.message
    });
  }
});

// ============= INTERVIEW SCHEDULING ENDPOINTS =============

// Create interview session with available slots
router.post('/candidates/:candidateId/interview/schedule', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { jobId, interviewerIds, slotOptions } = req.body;

    if (!jobId || !interviewerIds || !slotOptions) {
      return res.status(400).json({
        error: 'Missing required fields: jobId, interviewerIds, slotOptions'
      });
    }

    const { InterviewSchedulingService } = await import('../services/InterviewSchedulingService.js');

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
      details: error.message
    });
  }
});

// Process candidate response to interview invitation
router.post('/interview/process-response', async (req, res) => {
  try {
    const { waId, phoneNumber, messageContent, sessionId } = req.body;

    if (!waId || !phoneNumber || !messageContent || !sessionId) {
      return res.status(400).json({
        error: 'Missing required fields: waId, phoneNumber, messageContent, sessionId'
      });
    }

    const { InterviewSchedulingService } = await import('../services/InterviewSchedulingService.js');

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
      details: error.message
    });
  }
});

// Send interview reminder
router.post('/interview/:interviewId/send-reminder', async (req, res) => {
  try {
    const { interviewId } = req.params;

    const { InterviewSchedulingService } = await import('../services/InterviewSchedulingService.js');

    const result = await InterviewSchedulingService.sendInterviewReminder(interviewId);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to send reminder',
      details: error.message
    });
  }
});

// Get interview statistics for a job
router.get('/jobs/:jobId/interview-stats', async (req, res) => {
  try {
    const { jobId } = req.params;

    const { InterviewSchedulingService } = await import('../services/InterviewSchedulingService.js');

    const stats = await InterviewSchedulingService.getInterviewStats(jobId);

    if (!stats) {
      return res.status(404).json({
        error: 'No interviews found for this job'
      });
    }

    res.json({
      success: true,
      jobId,
      stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get interview statistics',
      details: error.message
    });
  }
});

// Get interview session details
router.get('/interview/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        candidate: {
          select: {
            id: true,
            first_name: true,
            email: true,
            phone_number: true,
            whatsapp_phone: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        }
      }
    });

    if (!session) {
      return res.status(404).json({
        error: 'Interview session not found'
      });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get interview session',
      details: error.message
    });
  }
});

// Get all interviews for a candidate
router.get('/candidates/:candidateId/interviews', async (req, res) => {
  try {
    const { candidateId } = req.params;

    const interviews = await prisma.interview.findMany({
      where: { candidateId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true
          }
        },
        session: {
          select: {
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });

    res.json({
      success: true,
      candidateId,
      total: interviews.length,
      interviews
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get candidate interviews',
      details: error.message
    });
  }
});

// Update interview status (completed, no-show, etc)
router.patch('/interview/:interviewId/status', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { status, feedback, notes } = req.body;

    const validStatuses = ['scheduled', 'in-progress', 'completed', 'no_show', 'rescheduled', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const updated = await prisma.interview.update({
      where: { id: interviewId },
      data: {
        status,
        feedback,
        notes,
        completedAt: status === 'completed' ? new Date() : null,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      interview: updated
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to update interview status',
      details: error.message
    });
  }
});

// ============= PHASE 1C PART 3: LEAD SCORING ENDPOINTS =============

/**
 * POST /recruitment/conversations/:candidateId/analyze
 * Analyze single conversation history and return metrics
 */
router.post('/conversations/:candidateId/analyze', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: 'Messages must be an array',
        example: [{ content: 'text', timestamp: '2024-01-01T00:00:00Z', direction: 'incoming' }]
      });
    }

    // Analyze conversation metrics
    const metrics = ConversationMetricsAnalyzer.analyzeConversation(messages);

    // Detect intent from latest message
    const latestMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
    const intent = EnhancedIntentDetectionService.detectIntent(latestMessage, messages.slice(-5));

    // Get qualification assessment
    const qualification = EnhancedIntentDetectionService.assessQualification(messages);

    return res.json({
      success: true,
      candidateId,
      analysis: {
        metrics,
        intent,
        qualification,
        messageCount: messages.length,
        analyzedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Conversation analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze conversation',
      details: error.message
    });
  }
});

/**
 * POST /recruitment/leads/:candidateId/calculate-score
 * Calculate comprehensive lead score combining resume + conversation
 */
router.post('/leads/:candidateId/calculate-score', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { resumeScore, conversationMessages, jobId } = req.body;

    if (typeof resumeScore !== 'number' || !Array.isArray(conversationMessages)) {
      return res.status(400).json({
        error: 'Invalid input. Require: resumeScore (number), conversationMessages (array)'
      });
    }

    // Get previous lead score for velocity calculation
    let previousLeadScore = null;
    try {
      previousLeadScore = await prisma.leadScore.findFirst({
        where: { candidateId, jobId: jobId || null },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      // LeadScore table may not exist yet
      console.warn('LeadScore table not found, continuing without velocity');
    }

    // Calculate lead score
    const leadScore = LeadQualificationService.calculateLeadScore(
      resumeScore,
      conversationMessages,
      candidateId,
      previousLeadScore
    );

    // Try to save to database
    try {
      if (jobId) {
        await prisma.leadScore.create({
          data: {
            candidateId,
            jobId,
            overallScore: leadScore.overallScore,
            scoreBreakdown: leadScore.scoreBreakdown,
            leadTemperature: leadScore.leadTemperature,
            qualificationLevel: leadScore.qualificationLevel,
            recommendations: leadScore.recommendations
          }
        });
      }
    } catch (dbError) {
      console.warn('Could not save to database:', dbError.message);
    }

    return res.json({
      success: true,
      candidateId,
      leadScore,
      savedToDatabase: !!jobId
    });
  } catch (error) {
    console.error('Lead score calculation error:', error);
    return res.status(500).json({
      error: 'Failed to calculate lead score',
      details: error.message
    });
  }
});

/**
 * GET /recruitment/leads?temperature=hot|warm|cold&jobId=?&limit=20
 * List qualified leads by temperature tier
 */
router.get('/leads', async (req, res) => {
  try {
    const { temperature, jobId, limit = 20 } = req.query;
    const parsedLimit = Math.min(parseInt(limit) || 20, 100);

    let query = {};
    if (temperature) {
      query.leadTemperature = temperature.toUpperCase();
    }
    if (jobId) {
      query.jobId = jobId;
    }

    // Try to fetch from database
    let leads = [];
    try {
      leads = await prisma.leadScore.findMany({
        where: query,
        take: parsedLimit,
        orderBy: { overallScore: 'desc' },
        include: {
          candidate: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
              location: true
            }
          }
        }
      });
    } catch (dbError) {
      console.warn('Could not query database:', dbError.message);
    }

    // Format response
    const formattedLeads = leads.map(lead => ({
      candidateId: lead.candidateId,
      candidate: lead.candidate,
      overallScore: lead.overallScore,
      temperature: lead.leadTemperature,
      qualification: lead.qualificationLevel,
      recommendations: lead.recommendations,
      scoredAt: lead.createdAt
    }));

    // Get temperature breakdown
    const breakdown = {
      HOT: formattedLeads.filter(l => l.temperature === 'HOT').length,
      WARM: formattedLeads.filter(l => l.temperature === 'WARM').length,
      COLD: formattedLeads.filter(l => l.temperature === 'COLD').length
    };

    return res.json({
      success: true,
      filters: { temperature, jobId, limit: parsedLimit },
      leadsCount: formattedLeads.length,
      breakdown,
      leads: formattedLeads
    });
  } catch (error) {
    console.error('Lead listing error:', error);
    return res.status(500).json({
      error: 'Failed to list leads',
      details: error.message
    });
  }
});

/**
 * PATCH /recruitment/leads/:candidateId/status
 * Update lead status and trigger recommended actions
 */
router.patch('/leads/:candidateId/status', async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { newStatus, jobId, notes } = req.body;

    if (!newStatus) {
      return res.status(400).json({
        error: 'newStatus is required',
        validStatuses: ['hot_interview_scheduled', 'warm_under_review', 'cold_archived', 'nurture_sequence']
      });
    }

    // Fetch lead data
    let leadData = null;
    try {
      leadData = await prisma.leadScore.findFirst({
        where: { candidateId, jobId: jobId || null },
        orderBy: { createdAt: 'desc' }
      });
    } catch (e) {
      console.warn('Could not fetch lead data');
    }

    // Get integration insights
    const integrationResult = LeadScoringIntegration.integrateWithInterviewScheduling(
      { candidateId, leadScore: leadData, resumeScore: leadData?.scoreBreakdown?.resumeScore || 0 },
      null // Passing null for service - would be actual service in production
    );

    // Log the status update
    const updateLog = {
      candidateId,
      jobId,
      oldStatus: leadData?.leadTemperature,
      newStatus,
      notes,
      updatedAt: new Date(),
      integrationDecision: integrationResult.decision
    };

    try {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: {
          lead_temperature: newStatus.split('_')[0].toUpperCase(),
          updated_at: new Date()
        }
      });
    } catch (dbError) {
      console.warn('Could not update candidate record');
    }

    return res.json({
      success: true,
      candidateId,
      updated: {
        status: newStatus,
        notes,
        integrationActions: integrationResult.decision?.autoActions || [],
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Lead status update error:', error);
    return res.status(500).json({
      error: 'Failed to update lead status',
      details: error.message
    });
  }
});

/**
 * GET /recruitment/analytics/lead-funnel?jobId=?
 * Analytics on lead quality distribution and KPIs
 */
router.get('/analytics/lead-funnel', async (req, res) => {
  try {
    const { jobId } = req.query;

    let query = {};
    if (jobId) {
      query.jobId = jobId;
    }

    // Fetch all lead scores
    let allLeads = [];
    try {
      allLeads = await prisma.leadScore.findMany({
        where: query,
        select: {
          overallScore: true,
          leadTemperature: true,
          qualificationLevel: true,
          scoreBreakdown: true,
          createdAt: true
        }
      });
    } catch (dbError) {
      console.warn('Could not fetch lead data from database');
    }

    // If no database data, return template analytics
    if (allLeads.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalLeads: 0,
          temperatureDistribution: {
            HOT: 0,
            WARM: 0,
            COLD: 0
          },
          qualificationDistribution: {
            Excellent: 0,
            Good: 0,
            Fair: 0,
            Weak: 0,
            Poor: 0
          },
          scoreDistribution: {
            '80-100': 0,
            '60-79': 0,
            '40-59': 0,
            '0-39': 0
          },
          averageScores: {
            overall: 0,
            resume: 0,
            conversation: 0,
            engagement: 0
          },
          kpis: {
            hotLeadPercentage: 0,
            averageQualification: 'Unknown',
            conversionPotential: 'Unknown'
          },
          jobId: jobId || 'all',
          generatedAt: new Date()
        }
      });
    }

    // Calculate analytics
    const temperatureBreakdown = {
      HOT: allLeads.filter(l => l.leadTemperature === 'HOT').length,
      WARM: allLeads.filter(l => l.leadTemperature === 'WARM').length,
      COLD: allLeads.filter(l => l.leadTemperature === 'COLD').length
    };

    const qualificationBreakdown = {
      Excellent: allLeads.filter(l => l.qualificationLevel === 'Excellent').length,
      Good: allLeads.filter(l => l.qualificationLevel === 'Good').length,
      Fair: allLeads.filter(l => l.qualificationLevel === 'Fair').length,
      Weak: allLeads.filter(l => l.qualificationLevel === 'Weak').length,
      Poor: allLeads.filter(l => l.qualificationLevel === 'Poor').length
    };

    const scoreDistribution = {
      '80-100': allLeads.filter(l => l.overallScore >= 80).length,
      '60-79': allLeads.filter(l => l.overallScore >= 60 && l.overallScore < 80).length,
      '40-59': allLeads.filter(l => l.overallScore >= 40 && l.overallScore < 60).length,
      '0-39': allLeads.filter(l => l.overallScore < 40).length
    };

    const avgOverallScore = (allLeads.reduce((sum, l) => sum + l.overallScore, 0) / allLeads.length).toFixed(1);
    const avgResumeScore = (allLeads.reduce((sum, l) => sum + (l.scoreBreakdown?.resumeScore || 0), 0) / allLeads.length).toFixed(1);
    const avgConversationScore = (allLeads.reduce((sum, l) => sum + (l.scoreBreakdown?.conversationScore || 0), 0) / allLeads.length).toFixed(1);
    const avgEngagementScore = (allLeads.reduce((sum, l) => sum + (l.scoreBreakdown?.engagementVelocity || 0), 0) / allLeads.length).toFixed(1);

    return res.json({
      success: true,
      analytics: {
        totalLeads: allLeads.length,
        temperatureDistribution: temperatureBreakdown,
        qualificationDistribution: qualificationBreakdown,
        scoreDistribution,
        averageScores: {
          overall: parseFloat(avgOverallScore),
          resume: parseFloat(avgResumeScore),
          conversation: parseFloat(avgConversationScore),
          engagement: parseFloat(avgEngagementScore)
        },
        kpis: {
          hotLeadPercentage: ((temperatureBreakdown.HOT / allLeads.length) * 100).toFixed(1),
          warmLeadPercentage: ((temperatureBreakdown.WARM / allLeads.length) * 100).toFixed(1),
          coldLeadPercentage: ((temperatureBreakdown.COLD / allLeads.length) * 100).toFixed(1),
          averageQualification: Object.keys(qualificationBreakdown).reduce((a, b) => 
            qualificationBreakdown[a] > qualificationBreakdown[b] ? a : b
          ),
          conversionPotential: parseFloat(avgOverallScore) > 70 ? 'High' : parseFloat(avgOverallScore) > 50 ? 'Medium' : 'Low'
        },
        jobId: jobId || 'all',
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Lead funnel analytics error:', error);
    return res.status(500).json({
      error: 'Failed to generate analytics',
      details: error.message
    });
  }
});

export default router;
