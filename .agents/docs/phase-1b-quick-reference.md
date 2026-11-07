# Phase 1B Quick Reference

## 🚀 Getting Started

### 1. Start the Server
```bash
npm run server
# Server runs on http://localhost:3000
```

### 2. Run API Tests
```bash
# In a new terminal
node plans/PHASE_1B_API_TESTS.js
```

---

## 📡 API Endpoints (Quick Reference)

### 1. Score Single Candidate
```
POST /api/recruitment/jobs/{jobId}/score-candidate

Body:
{
  "candidate_id": "string",
  "weights": {                    // Optional
    "skills": 0.35,
    "experience": 0.25,
    "education": 0.15,
    "cultural_fit": 0.15,
    "location_match": 0.10
  }
}

Response:
{
  "overall_score": 87,            // 0-100
  "screening_status": "strong_match",
  "skills_score": 90,
  "experience_score": 85,
  "education_score": 88,
  "cultural_fit_score": 82,
  "location_match_score": 90,
  "feedback": "Excellent skills match..."
}
```

### 2. Batch Score All Candidates
```
POST /api/recruitment/jobs/{jobId}/batch-score

Body:
{
  "weights": {}  // Optional custom weights
}

Response:
{
  "total_candidates": 25,
  "scores": [
    {
      "candidate_id": "string",
      "overall_score": 92,
      "screening_status": "strong_match",
      "factors": { ... }
    },
    ...  // Sorted by score (highest first)
  ]
}
```

### 3. Get Top Candidates
```
GET /api/recruitment/jobs/{jobId}/top-candidates?threshold=75&limit=10

Query Parameters:
  threshold  : Minimum score (default 75)
  limit      : Max results (default 10)

Response:
{
  "candidates": [
    {
      "candidate": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin_url": "string"
      },
      "score": {
        "overall": 92,
        "status": "strong_match",
        "factors": { ... },
        "feedback": "string"
      }
    },
    ...
  ]
}
```

### 4. Get Candidate Screening Scores
```
GET /api/recruitment/candidates/{candidateId}/screening-scores

Response:
{
  "candidate_id": "string",
  "total_applications": 5,
  "scores": [
    {
      "job": {
        "id": "string",
        "title": "string",
        "department": "string",
        "location": "string"
      },
      "score": {
        "overall": 87,
        "status": "strong_match",
        "factors": { ... },
        "feedback": "string"
      },
      "scored_at": "2026-01-17T10:30:00Z"
    },
    ...
  ]
}
```

### 5. Extract & Parse Resume
```
POST /api/recruitment/candidates/{candidateId}/extract-resume

Response:
{
  "success": true,
  "extraction": {
    "method": "pdf_extraction",  // or docx_extraction, doc_extraction, etc
    "pages": 2
  },
  "parsed_data": {
    "skills": ["JavaScript", "React", "Node.js", ...],
    "experience": [
      {
        "position": "Senior Developer",
        "company": "TechCorp",
        "duration": "3 years"
      },
      ...
    ],
    "education": [
      {
        "degree": "Bachelor of Science in Computer Science",
        "field": "Computer Science"
      }
    ],
    "contact": {
      "email": "user@example.com",
      "phone": "+971 50 123 4567",
      "linkedin": "https://linkedin.com/in/user",
      "website": "https://example.com"
    }
  }
}
```

### 6. Get Job Screening Metrics
```
GET /api/recruitment/jobs/{jobId}/screening-metrics

Response:
{
  "metrics": {
    "total_candidates": 25,
    "strong_matches": 5,
    "good_matches": 8,
    "potential_matches": 7,
    "weak_matches": 4,
    "no_match": 1,
    "average_score": 76,
    "median_score": 78,
    "factor_averages": {
      "skills": 78,
      "experience": 74,
      "education": 72,
      "cultural_fit": 70,
      "location_match": 75
    },
    "score_distribution": {
      "very_high": 5,      // 85-100
      "high": 8,           // 75-84
      "medium": 7,         // 65-74
      "low": 4,            // 50-64
      "very_low": 1        // <50
    }
  }
}
```

---

## 🎯 Scoring Guide

### Overall Score Interpretation
- **85-100:** Strong Match - Highly Recommended
- **75-84:** Good Match - Recommended
- **65-74:** Potential Match - Consider with training
- **50-64:** Weak Match - Requires significant development
- **<50:** Does Not Match - Not suitable

### Factor Weights (Default)
```
Skills Match:     35%  (Most important)
Experience:       25%
Education:        15%
Cultural Fit:     15%
Location Match:   10%
```

### Custom Weights Example
```json
{
  "skills": 0.40,
  "experience": 0.30,
  "education": 0.10,
  "cultural_fit": 0.10,
  "location_match": 0.10
}
```

---

## 📝 Test Data

### 50 Sample Candidates Available
File: `plans/PHASE_1B_TEST_DATASET.sql`

Includes diverse profiles:
- Senior developers (8+ years)
- Mid-level developers (3-5 years)
- Junior developers (0-2 years)
- Designers, DevOps, QA, etc.
- Various locations across UAE
- Different skill sets

### Load Test Data
```bash
# If using MongoDB directly:
# Import the candidate data

# If using PostgreSQL:
psql -U postgres -d recruitment < plans/PHASE_1B_TEST_DATASET.sql
```

---

## 🧪 Testing Examples

### Test 1: Score a Developer
```bash
curl -X POST http://localhost:3000/api/recruitment/jobs/JOB_ID/score-candidate \
  -H "Content-Type: application/json" \
  -d '{"candidate_id": "CANDIDATE_ID"}'
```

### Test 2: Get Top 5 Developers
```bash
curl "http://localhost:3000/api/recruitment/jobs/JOB_ID/top-candidates?threshold=80&limit=5"
```

### Test 3: Batch Score All
```bash
curl -X POST http://localhost:3000/api/recruitment/jobs/JOB_ID/batch-score
```

### Test 4: View Metrics
```bash
curl "http://localhost:3000/api/recruitment/jobs/JOB_ID/screening-metrics"
```

---

## 🔍 Resume Extraction Support

### Supported Formats
- ✅ PDF files (.pdf)
- ✅ Word documents (.docx)
- ✅ Legacy Word (.doc)
- ✅ Text files (.txt)

### Extracted Information
- **Skills:** 50+ keyword matching across 15 categories
- **Experience:** Job titles, companies, duration
- **Education:** Degrees, field of study
- **Contact:** Email, phone, LinkedIn, website

---

## 📊 Common Queries

### Find All Strong Candidates for a Job
```bash
curl "http://localhost:3000/api/recruitment/jobs/JOB_ID/top-candidates?threshold=85&limit=50"
```

### Get Dashboard Metrics
```bash
curl "http://localhost:3000/api/recruitment/jobs/JOB_ID/screening-metrics"
```

### Review All Scores for a Candidate
```bash
curl "http://localhost:3000/api/recruitment/candidates/CANDIDATE_ID/screening-scores"
```

### Score with Custom Weights (CEO Hiring)
```bash
curl -X POST http://localhost:3000/api/recruitment/jobs/JOB_ID/score-candidate \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": "CANDIDATE_ID",
    "weights": {
      "experience": 0.50,
      "education": 0.20,
      "cultural_fit": 0.20,
      "skills": 0.05,
      "location_match": 0.05
    }
  }'
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| API returns 404 | Check job/candidate IDs exist |
| Score is 0 | Ensure resume_text is populated |
| Resume extraction fails | File format may be unsupported |
| Batch scoring is slow | Normal for 100+ candidates |
| Custom weights error | Weights must sum to 1.0 |

---

## 📚 Full Documentation

- **Complete Guide:** `plans/PHASE_1B_IMPLEMENTATION_COMPLETE.md`
- **Implementation Summary:** `plans/PHASE_1B_SUMMARY.md`
- **Test Framework:** `plans/PHASE_1B_API_TESTS.js`
- **Database Schema:** `prisma/schema.prisma`

---

## ✅ Phase 1B Status

✅ Resume extraction (PDF, DOCX, DOC, TXT)
✅ Candidate scoring (5-factor model)
✅ Batch processing
✅ Analytics dashboard
✅ API endpoints
✅ Test framework
✅ Documentation

**Ready for:** Phase 1C (WhatsApp Integration)

---

## 🔄 Phase Timeline

- **Phase 1A (Jan 10-17):** Foundation - ✅ Complete
- **Phase 1B (Jan 17-24):** Resume & Scoring - ✅ Complete
- **Phase 1C (Jan 24-Feb 7):** WhatsApp Integration - 🔄 Next
- **Phase 1D (Feb 7-21):** Zoe Dashboard - ⏳ Upcoming

---

**Need Help?** Check the full implementation guide or run the test script!
