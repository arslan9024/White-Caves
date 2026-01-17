import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { CandidateScoringService } from '../services/CandidateScoringService.js';
import { ResumeParserService } from '../services/ResumeParserService.js';

const router = express.Router();
const prisma = new PrismaClient();

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
router.post('/jobs/:job_id/score-candidate', async (req, res) => {
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
    const score = await CandidateScoringService.scoreCandidateForJob(
      candidate_id,
      job_id,
      weights
    );

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
    const scores = await CandidateScoringService.batchScoreCandidatesForJob(
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
router.get('/jobs/:job_id/top-candidates', async (req, res) => {
  try {
    const { job_id } = req.params;
    const { threshold = 75, limit = 10 } = req.query;

    const topCandidates = await CandidateScoringService.getTopCandidatesForJob(
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
router.get('/jobs/:job_id/screening-metrics', async (req, res) => {
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
        metrics: {
          total_candidates: 0,
          strong_matches: 0,
          good_matches: 0,
          potential_matches: 0,
          weak_matches: 0,
          no_match: 0,
          average_score: 0,
          median_score: 0
        }
      });
    }

    // Calculate metrics
    const statusCounts = {
      strong_match: 0,
      good_match: 0,
      potential_match: 0,
      weak_match: 0,
      does_not_match: 0
    };

    let totalScore = 0;
    const sortedScores = [];

    scores.forEach(score => {
      statusCounts[score.screening_status]++;
      totalScore += score.overall_score;
      sortedScores.push(score.overall_score);
    });

    sortedScores.sort((a, b) => a - b);
    const medianScore = sortedScores.length % 2 === 0
      ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2
      : sortedScores[Math.floor(sortedScores.length / 2)];

    const averageScore = Math.round(totalScore / scores.length);

    // Average factor scores
    const factorAverages = {
      skills: Math.round(scores.reduce((sum, s) => sum + s.skills_score, 0) / scores.length),
      experience: Math.round(scores.reduce((sum, s) => sum + s.experience_score, 0) / scores.length),
      education: Math.round(scores.reduce((sum, s) => sum + s.education_score, 0) / scores.length),
      cultural_fit: Math.round(scores.reduce((sum, s) => sum + s.cultural_fit_score, 0) / scores.length),
      location_match: Math.round(scores.reduce((sum, s) => sum + s.location_match_score, 0) / scores.length)
    };

    res.status(200).json({
      success: true,
      job_id,
      metrics: {
        total_candidates: scores.length,
        strong_matches: statusCounts.strong_match,
        good_matches: statusCounts.good_match,
        potential_matches: statusCounts.potential_match,
        weak_matches: statusCounts.weak_match,
        no_match: statusCounts.does_not_match,
        average_score: averageScore,
        median_score: Math.round(medianScore),
        factor_averages: factorAverages,
        score_distribution: {
          very_high: scores.filter(s => s.overall_score >= 85).length,
          high: scores.filter(s => s.overall_score >= 75 && s.overall_score < 85).length,
          medium: scores.filter(s => s.overall_score >= 65 && s.overall_score < 75).length,
          low: scores.filter(s => s.overall_score >= 50 && s.overall_score < 65).length,
          very_low: scores.filter(s => s.overall_score < 50).length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching screening metrics:', error);
    res.status(500).json({
      error: 'Failed to fetch screening metrics',
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
        await CandidateScoringService.sendScoringResultViaMeta(
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
        const scoreRecord = await CandidateScoringService.scoreCandidateForJob(
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
            await CandidateScoringService.sendScoringResultViaMeta(
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
    const { MessageTemplateService } = await import('../services/MessageTemplateService.js');
    const templates = MessageTemplateService.getAll();
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
    const { MessageTemplateService } = await import('../services/MessageTemplateService.js');
    const preview = MessageTemplateService.getPreview(req.params.templateId);
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

export default router;
