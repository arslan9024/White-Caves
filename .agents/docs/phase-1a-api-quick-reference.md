# Tuesday Recruitment System - Phase 1A API Quick Reference

**Last Updated:** January 17, 2026  
**API Version:** 1.0.0  
**Status:** Phase 1A Complete - Ready for Phase 1B  

---

## Quick Start

### 1. Apply Database Migration
```bash
npx prisma migrate dev --name "add_recruitment_models"
```

### 2. Start Server
```bash
npm run server
# Server runs on http://localhost:3000
```

### 3. Test API
```bash
# See examples below
```

---

## API Base URL
```
http://localhost:3000/api/recruitment
```

---

## Candidates API

### Create Candidate
```bash
POST /candidates
Content-Type: application/json

{
  "email": "candidate@example.com",
  "first_name": "Ahmed",
  "last_name": "Al-Mansouri",
  "phone": "+971501234567",
  "location": "Dubai",
  "linkedin_url": "https://linkedin.com/in/ahmalmansouri",
  "source": "linkedin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Candidate created successfully",
  "candidate": {
    "id": "uuid-123",
    "email": "candidate@example.com",
    "first_name": "Ahmed",
    "last_name": "Al-Mansouri",
    "phone": "+971501234567",
    "location": "Dubai",
    "linkedin_url": "https://linkedin.com/in/ahmalmansouri",
    "source": "linkedin",
    "status": "new",
    "resume_url": null,
    "createdAt": "2026-01-17T10:30:00Z",
    "updatedAt": "2026-01-17T10:30:00Z"
  }
}
```

### List Candidates
```bash
GET /candidates?status=screening&page=1&limit=20
```

**Query Parameters:**
- `status` - Filter by status: new, under_review, rejected, selected, hired
- `source` - Filter by source: linkedin, indeed, manual_upload, job_board, referral
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "email": "candidate@example.com",
      "first_name": "Ahmed",
      "last_name": "Al-Mansouri",
      "status": "screening",
      "scores": [
        {
          "overall_score": 78,
          "skills_score": 85,
          "experience_score": 80
        }
      ],
      "applications": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Candidate Details
```bash
GET /candidates/{candidateId}
```

**Response (200):**
```json
{
  "success": true,
  "candidate": {
    "id": "uuid-123",
    "email": "candidate@example.com",
    "first_name": "Ahmed",
    "last_name": "Al-Mansouri",
    "phone": "+971501234567",
    "location": "Dubai",
    "resume_url": "server/uploads/resumes/resume-123456.pdf",
    "status": "screening",
    "scores": [
      {
        "id": "score-uuid",
        "overall_score": 78,
        "skills_score": 85,
        "experience_score": 80,
        "cultural_fit": 72,
        "education_score": 90,
        "location_match": 95,
        "scored_at": "2026-01-17T11:00:00Z"
      }
    ],
    "applications": [
      {
        "id": "app-uuid",
        "job_id": "job-uuid",
        "status": "screening",
        "applied_at": "2026-01-15T09:30:00Z"
      }
    ],
    "interviews": [
      {
        "id": "interview-uuid",
        "interview_type": "phone_screening",
        "scheduled_at": "2026-01-20T14:00:00Z",
        "status": "scheduled"
      }
    ]
  }
}
```

### Update Candidate
```bash
PUT /candidates/{candidateId}
Content-Type: application/json

{
  "status": "selected",
  "notes": "Excellent candidate, moving to next round"
}
```

### Delete Candidate
```bash
DELETE /candidates/{candidateId}
```

---

## Jobs API

### Create Job
```bash
POST /jobs
Content-Type: application/json

{
  "title": "Senior Software Engineer",
  "description": "Looking for experienced Full Stack Developer",
  "department": "Engineering",
  "location": "Dubai",
  "salary_min": 150000,
  "salary_max": 250000,
  "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
  "experience_years": 5,
  "status": "open"
}
```

### List Jobs
```bash
GET /jobs?status=open&page=1&limit=20
```

**Query Parameters:**
- `status` - Filter: open, closed, on_hold (default: open)
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

### Get Job Details
```bash
GET /jobs/{jobId}
```

**Response (200):**
```json
{
  "success": true,
  "job": {
    "id": "job-uuid",
    "title": "Senior Software Engineer",
    "description": "Looking for experienced Full Stack Developer",
    "department": "Engineering",
    "location": "Dubai",
    "salary_min": 150000,
    "salary_max": 250000,
    "required_skills": ["JavaScript", "React", "Node.js", "PostgreSQL"],
    "experience_years": 5,
    "status": "open",
    "applications": [
      {
        "id": "app-uuid",
        "candidate_id": "cand-uuid",
        "status": "screening",
        "applied_at": "2026-01-15T09:30:00Z"
      }
    ]
  }
}
```

### Update Job
```bash
PUT /jobs/{jobId}
Content-Type: application/json

{
  "status": "closed",
  "salary_max": 280000
}
```

### Delete Job
```bash
DELETE /jobs/{jobId}
# Note: Cascades delete to all applications
```

---

## Applications API

### Create Application
```bash
POST /applications
Content-Type: application/json

{
  "candidate_id": "candidate-uuid",
  "job_id": "job-uuid",
  "notes": "Referred by current employee John Smith"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Application created successfully",
  "application": {
    "id": "app-uuid",
    "candidate_id": "candidate-uuid",
    "job_id": "job-uuid",
    "status": "applied",
    "applied_at": "2026-01-17T10:45:00Z",
    "whatsapp_sent": false,
    "candidate": {
      "id": "candidate-uuid",
      "email": "candidate@example.com",
      "first_name": "Ahmed",
      "last_name": "Al-Mansouri"
    },
    "job": {
      "id": "job-uuid",
      "title": "Senior Software Engineer",
      "department": "Engineering"
    }
  }
}
```

### List Applications
```bash
GET /applications?status=screening&job_id={jobId}&page=1&limit=20
```

**Query Parameters:**
- `status` - Filter: applied, screening, interview, offer, hired, rejected
- `job_id` - Filter by job ID
- `candidate_id` - Filter by candidate ID
- `page` - Page number
- `limit` - Results per page

### Get Application
```bash
GET /applications/{applicationId}
```

### Update Application Status
```bash
PUT /applications/{applicationId}/status
Content-Type: application/json

{
  "status": "interview"
}
```

**Valid statuses:** applied, screening, interview, offer, hired, rejected

### Update Application
```bash
PUT /applications/{applicationId}
Content-Type: application/json

{
  "status": "interview",
  "notes": "Phone screening passed, schedule technical interview"
}
```

### Delete Application
```bash
DELETE /applications/{applicationId}
```

---

## Resume Upload API

### Upload Resume
```bash
POST /candidates/{candidateId}/upload-resume
Content-Type: multipart/form-data

File: resume.pdf (max 10MB)
```

**Supported formats:** PDF, DOCX, DOC, TXT

**Response (201):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "resume": {
    "id": "upload-uuid",
    "candidate_id": "candidate-uuid",
    "file_path": "server/uploads/resumes/resume-123456.pdf",
    "file_name": "resume.pdf",
    "file_size": 245678,
    "mime_type": "application/pdf",
    "extraction_status": "pending",
    "createdAt": "2026-01-17T11:00:00Z"
  },
  "note": "Resume text extraction is queued for processing. Check status with extraction_status field."
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: email, first_name, last_name"
}
```

### 409 Conflict
```json
{
  "error": "Candidate with this email already exists",
  "candidate_id": "uuid-123"
}
```

### 404 Not Found
```json
{
  "error": "Candidate not found"
}
```

### 500 Server Error
```json
{
  "error": "Failed to create candidate",
  "details": "Database connection error"
}
```

---

## Common Workflows

### Workflow 1: Hiring New Candidate
```bash
# 1. Create job
POST /jobs
→ Get jobId

# 2. Create candidate
POST /candidates
→ Get candidateId

# 3. Upload resume
POST /candidates/{candidateId}/upload-resume
→ Resume stored for processing

# 4. Create application
POST /applications
{
  "candidate_id": "{candidateId}",
  "job_id": "{jobId}"
}
→ Get applicationId

# 5. Update status through pipeline
PUT /applications/{applicationId}/status
→ applied → screening → interview → offer → hired
```

### Workflow 2: Batch Screening
```bash
# 1. List open jobs
GET /jobs?status=open

# 2. Get job applications
GET /applications?job_id={jobId}&status=applied

# 3. Update to screening status
PUT /applications/{applicationId}/status
{
  "status": "screening"
}

# 4. View candidate scores (Phase 1B)
GET /candidates/{candidateId}
→ Check scores.overall_score
```

### Workflow 3: View Recruitment Dashboard
```bash
# Get all candidates
GET /candidates?page=1&limit=50

# Get all applications by status
GET /applications?status=interview
GET /applications?status=offer

# Get open jobs with application counts
GET /jobs?status=open
```

---

## Data Models Quick Reference

### Candidate Status Values
- `new` - Just added to system
- `under_review` - Screening in progress
- `rejected` - Did not meet criteria
- `selected` - Passed screening
- `hired` - Offer accepted

### Application Status Values
- `applied` - Initial application
- `screening` - Resume screening
- `interview` - Interview scheduled
- `offer` - Offer extended
- `hired` - Hired and onboarded
- `rejected` - Application rejected

### Interview Types
- `phone_screening` - Initial phone screen
- `technical` - Technical assessment
- `hr` - HR round
- `final` - Final round

---

## Phase 1B Preview

Next phase will add:
- Automated resume text extraction (PDF, DOCX)
- AI-powered candidate scoring (5-factor model)
- WhatsApp integration for Linda
- Real-time Zoe dashboard metrics
- Interview scheduling API
- Offer letter generation

---

## Support & Questions

For API issues or questions, refer to:
- [Phase 1A Implementation Guide](PHASE_1A_IMPLEMENTATION_COMPLETE.md)
- [Tuesday People & Minds Plan](TUESDAY_PEOPLE_MINDS_PLAN.md)
- Server logs: `server/index.js` console output
