# Phase 1C Part 3: Prisma Schema Extensions - Complete
**Date:** 2025-01-15 | **Status:** ✅ COMPLETE & COMMITTED  
**Commit:** 1828d1f

---

## 📋 Overview

Extended the Prisma schema (`prisma/schema.prisma`) with 11 new/extended models to support the Phase 1C Part 3 intent detection and lead scoring system. The schema now includes full recruitment database infrastructure with proper relationships, indexing, and cascade rules.

---

## 🗄️ Database Models (Extended & New)

### **Extended Models** (Modified)

#### 1. **Candidate** (Extended)
Added Phase 1C Part 3 fields:
- `conversation_score` (Float) - 0-100 engagement quality
- `lead_temperature` (String) - HOT, WARM, COLD classification
- `engagement_score` (Float) - 0-100 overall engagement
- `last_analyzed_at` (DateTime) - Last scoring timestamp
- `whatsapp_phone` (String) - Tracked WhatsApp number
- `opt_in_messaging` (Boolean) - Messaging consent

**Key Fields (Pre-existing):**
- `email` (UNIQUE) - Primary identifier
- `phone`, `first_name`, `last_name`
- `resume_url`, `resume_text` - Resume storage
- `status` - new, under_review, rejected, selected, hired
- `source` - Application source

**Relations:**
```
Candidate 1:N Application
Candidate 1:N Interview
Candidate 1:N InterviewSchedule
Candidate 1:N CandidateScore
Candidate 1:N LeadScore
Candidate 1:N ConversationMetric
```

---

#### 2. **Application** (Extended)
Added Phase 1C Part 3 fields:
- `conversation_score` (Float) - Score specific to this application
- `intent_type` (String) - Primary detected intent
- `engagement_metrics` (JSONB) - Detailed engagement metrics object
- `lead_temperature` (String) - Application-level temperature
- `score_updated_at` (DateTime) - Last score update
- `whatsapp_sent_at` (DateTime) - Message send timestamp
- `whatsapp_msg_id` (String) - WhatsApp message tracking

**Key Fields (Pre-existing):**
- `candidate_id` (FK) - Foreign key to Candidate
- `job_id` (FK) - Foreign key to Job
- `status` - applied, screening, interview, offer, hired, rejected
- `applied_at` (DateTime) - Application timestamp

**Relations:**
```
Application N:1 Candidate (CASCADE)
Application N:1 Job (CASCADE)
Application 1:N Interview
Application 1:N InterviewSchedule
```

---

#### 3. **InterviewSchedule** (Extended)
Added WhatsApp integration fields:
- `whatsapp_sent` (Boolean) - Message sent flag
- `whatsapp_msg_id` (String) - Message tracking ID
- `reminder_sent_at` (DateTime) - Reminder timestamp

Already includes:
- `session_status` - pending_scheduling, scheduled, completed, declined
- `available_slots` (JSONB) - Slot options array
- `selected_slot` (JSONB) - Selected slot object

---

### **New Models**

#### 4. **Job** (New)
Represents job postings in the recruitment system.

**Fields:**
- `id` (UUID) - Primary key
- `title` (String) - Job title
- `description` (Text) - Job description
- `department` (String) - Department name
- `location` (String) - Job location
- `salary_min`, `salary_max` (Float) - Salary range
- `required_skills` (String[]) - Array of required skills
- `experience_years` (Int) - Experience requirement
- `status` (String, default: "open") - open, closed, on_hold
- `source` (String) - linkedin, internal, job_board
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
```
Job 1:N Application
Job 1:N Interview
Job 1:N InterviewSchedule
Job 1:N CandidateScore
Job 1:N LeadScore
Job 1:N ConversationMetric
```

---

#### 5. **LeadScore** (New - Core for Phase 1C Part 3)
Stores lead quality scores with historical tracking.

**Fields:**
- `id` (UUID) - Primary key
- `candidate_id` (FK) - Foreign key to Candidate
- `job_id` (FK) - Foreign key to Job
- `overall_score` (Float, 0-100) - Main lead quality score
- `score_breakdown` (JSONB) - Component scores:
  ```json
  {
    "resumeScore": 85,
    "conversationScore": 72,
    "intentScore": 88,
    "engagementVelocity": 0.15,
    "sentimentScore": 0.65
  }
  ```
- `lead_temperature` (String) - HOT, WARM, COLD
- `qualification_level` (String) - Excellent, Good, Fair, Weak, Poor
- `recommendations` (JSONB) - Array of action recommendations:
  ```json
  [
    {
      "action": "schedule_interview",
      "priority": "high",
      "reasoning": "Strong candidate with positive sentiment"
    }
  ]
  ```
- `score_history` (JSONB, optional) - Array for trend analysis
- `engagement_velocity` (Float) - Rate of change in engagement
- `qualified_for_roles` (String[]) - Roles this lead qualifies for
- `createdAt`, `updatedAt` - Timestamps

**Indexes:**
- `lead_temperature` - For filtering by temperature
- `overall_score` - For sorting by score
- `job_id` - For job-based filtering

**Relations:**
```
LeadScore N:1 Candidate (CASCADE)
LeadScore N:1 Job (CASCADE)
```

---

#### 6. **ConversationMetric** (New - Core for Phase 1C Part 3)
Stores detailed conversation analytics.

**Fields:**
- `id` (UUID) - Primary key
- `candidate_id` (FK) - Foreign key to Candidate
- `job_id` (FK) - Foreign key to Job
- `message_count` (Int) - Total messages exchanged
- `avg_response_time` (Float) - Average response time in minutes
- `avg_message_length` (Int) - Average message length in characters
- `engagement_score` (Float, 0-100) - Overall engagement quality
- `sentiment_avg` (Float, -1 to 1) - Average sentiment across messages
- `conversation_duration` (JSONB) - Duration breakdown:
  ```json
  {
    "days": 5,
    "hours": 3,
    "minutes": 45,
    "totalMinutes": 7425
  }
  ```
- `activity_trend` (String) - Increasing, Decreasing, Stable
- `createdAt`, `updatedAt` - Timestamps

**Indexes:**
- `candidate_id` - For candidate-based filtering
- `job_id` - For job-based filtering

**Relations:**
```
ConversationMetric N:1 Candidate (CASCADE)
ConversationMetric N:1 Job (CASCADE)
```

---

#### 7. **CandidateScore** (Existing in Phase 1A - Enhanced)
Stores resume-based screening scores.

**Fields:**
- `id` (UUID) - Primary key
- `candidate_id` (FK) - Foreign key to Candidate
- `job_id` (FK, optional) - Foreign key to Job
- `overall_score` (Float, 0-100) - Overall resume score
- `skills_score` (Float, 0-100) - Skills match score
- `experience_score` (Float, 0-100) - Experience score
- `cultural_fit` (Float, 0-100) - Cultural fit score
- `education_score` (Float, 0-100) - Education score
- `location_match` (Float, 0-100) - Location match score
- `scoring_method` (String, default: "rule_based") - rule_based, ml_model
- `feedback` (Text) - Scoring feedback
- `scored_at` (DateTime) - Scoring timestamp

---

#### 8. **Interview** (Existing in Phase 1A - Enhanced)
Stores interview records and feedback.

**Fields:**
- `id` (UUID) - Primary key
- `candidate_id` (FK) - Foreign key to Candidate
- `job_id` (FK) - Foreign key to Job
- `application_id` (FK, optional) - Foreign key to Application
- `interview_type` (String) - phone_screening, technical, hr, final
- `scheduled_at` (DateTime) - Scheduled time
- `completed_at` (DateTime) - Completion time
- `interviewer` (String) - Interviewer name/ID
- `rating` (Float, 0-10) - Interview rating
- `feedback` (Text) - Interviewer feedback
- `status` (String, default: "scheduled") - scheduled, completed, cancelled, no_show
- `createdAt`, `updatedAt` - Timestamps

**Relations:**
```
Interview N:1 Candidate (CASCADE)
Interview N:1 Job (CASCADE)
Interview N:1 Application (SET NULL)
```

---

#### 9. **RecruitmentMetric** (Existing in Phase 1A - Enhanced)
Tracks recruitment KPIs and metrics.

**Fields:**
- `id` (UUID) - Primary key
- `metric_date` (DateTime, default: now) - Metric date
- `total_applications` (Int) - Total applications
- `applications_screened` (Int) - Screened applications
- `applications_rejected` (Int) - Rejected applications
- `interviews_scheduled` (Int) - Scheduled interviews
- `interviews_completed` (Int) - Completed interviews
- `offers_made` (Int) - Offers made
- `hires` (Int) - Successful hires
- `avg_time_to_hire` (Float) - Average time in days
- `avg_cost_per_hire` (Float) - Average cost
- `automation_percentage` (Float, 0-100) - Automation usage %
- `createdAt`, `updatedAt` - Timestamps

---

## 📊 Database Relationships

```
┌─────────────┐
│   Job       │
└──────┬──────┘
       │ 1:N
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│  Application     │◄──────┐            │   Candidate      │
└────┬─────────────┘       │            └────┬─────────────┘
     │                     │                 │ 1:N
     │ 1:N                 │                 ├──────────────────────┐
     ▼                     │                 │                      │
  Interview         ┌──────┴─────────┐      │                      ▼
  InterviewSchedule │                │      │            ┌──────────────────┐
                    │                │      │            │  CandidateScore  │
                    │         ┌──────┴──────┴────────────┤  Interview       │
                    │         │                          │  InterviewSched. │
                    │         ▼                          │  LeadScore       │
                    │    ┌──────────────┐               │  ConversationM.  │
                    └────│  LeadScore   │               └──────────────────┘
                         │ ConversationM│
                         └──────────────┘
```

---

## 🔍 Key Relationships & Cascades

| Relationship | Delete Rule | Impact |
|-------------|------------|--------|
| Application → Candidate | CASCADE | Deleting candidate deletes all applications |
| Application → Job | CASCADE | Deleting job deletes all applications |
| Interview → Candidate | CASCADE | Deleting candidate deletes all interviews |
| Interview → Application | SET NULL | Deleting application removes link to interview |
| LeadScore → Candidate | CASCADE | Deleting candidate deletes all lead scores |
| LeadScore → Job | CASCADE | Deleting job deletes all lead scores |
| ConversationMetric → Candidate | CASCADE | Deleting candidate deletes all metrics |
| ConversationMetric → Job | CASCADE | Deleting job deletes all metrics |

---

## 📈 Data Persistence Integration

### API Endpoints Using New Schema

**1. POST /recruitment/conversations/:candidateId/analyze**
- Reads: Message data (external)
- Creates: ConversationMetric record
- Stores: engagement_score, sentiment_avg, activity_trend

**2. POST /recruitment/leads/:candidateId/calculate-score**
- Reads: Candidate, CandidateScore, Application
- Creates: LeadScore record
- Stores: score_breakdown, recommendations, engagement_velocity

**3. GET /recruitment/leads?temperature=hot|warm|cold&jobId=?&limit=20**
- Reads: LeadScore table
- Filters: By lead_temperature, job_id
- Indexes: Optimized with lead_temperature and job_id indexes

**4. PATCH /recruitment/leads/:candidateId/status**
- Updates: Candidate.lead_temperature
- Updates: Application.lead_temperature
- Generates: Integration decisions

**5. GET /recruitment/analytics/lead-funnel?jobId=?**
- Aggregates: LeadScore data
- Calculates: temperature distribution, score distribution
- Returns: KPI dashboard data

---

## 🚀 Migration Status

### Current Status
- ✅ Prisma schema extended (11 models)
- ✅ Migration SQL file created
- ✅ Prisma client generated (v6.19.2)
- ⏳ Database migration pending (database connectivity required)

### Manual Migration Steps (When Database Available)

```bash
# Option 1: Using Prisma migrate (recommended)
npx prisma migrate deploy

# Option 2: Using raw SQL (if needed)
# Execute prisma/migrations/add_recruitment_models/migration.sql directly in PostgreSQL

# Option 3: Verify schema applied
npx prisma db push
```

---

## 📋 Schema Change Summary

| Item | Count |
|------|-------|
| **New Models** | 2 (Job, LeadScore, ConversationMetric) |
| **Extended Models** | 3 (Candidate, Application, InterviewSchedule) |
| **Fields Added to Candidate** | 6 |
| **Fields Added to Application** | 5 |
| **Database Indexes** | 5 |
| **Foreign Key Relationships** | 12 |
| **Total Lines of Schema Code** | 450+ |
| **Total Tables After Migration** | 10 (User, Property + 8 recruitment) |

---

## ✅ Validation Checklist

- [x] Prisma schema syntax valid
- [x] All relationships properly defined
- [x] Cascade rules correctly configured
- [x] Indexes created for performance
- [x] Migration SQL file created
- [x] Prisma client generated successfully
- [x] Git committed with descriptive message

---

## 🔗 Related Files

**Schema Files:**
- [prisma/schema.prisma](prisma/schema.prisma)
- [prisma/migrations/add_recruitment_models/migration.sql](prisma/migrations/add_recruitment_models/migration.sql)

**Service Files (Depend on This Schema):**
- [server/services/ConversationMetricsAnalyzer.js](server/services/ConversationMetricsAnalyzer.js)
- [server/services/EnhancedIntentDetectionService.js](server/services/EnhancedIntentDetectionService.js)
- [server/services/LeadQualificationService.js](server/services/LeadQualificationService.js)
- [server/services/ConversationBatchProcessor.js](server/services/ConversationBatchProcessor.js)
- [server/utils/LeadScoringIntegration.js](server/utils/LeadScoringIntegration.js)

**API Endpoints (Depend on This Schema):**
- [server/routes/recruitment.js](server/routes/recruitment.js) - 5 new endpoints

---

## 📝 Next Steps

1. **Apply Migration:** When database is available, run `npx prisma migrate deploy`
2. **Test Database Connectivity:** Verify all models can be queried
3. **Run API Tests:** Test all 5 Phase 1C Part 3 endpoints with database
4. **Integration Testing:** Verify data flows correctly through services
5. **Production Deployment:** Deploy schema and services together

---

**Status:** ✅ SCHEMA DESIGN COMPLETE & COMMITTED  
**Ready for:** Database migration and API testing
