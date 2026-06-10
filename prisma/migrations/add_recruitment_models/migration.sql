-- CreateTable "Job"
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "department" TEXT,
    "location" TEXT,
    "salary_min" DOUBLE PRECISION,
    "salary_max" DOUBLE PRECISION,
    "required_skills" TEXT[],
    "experience_years" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Candidate"
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "location" TEXT,
    "linkedin_url" TEXT,
    "resume_url" TEXT,
    "resume_text" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "notes" TEXT,
    "conversation_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lead_temperature" TEXT NOT NULL DEFAULT 'WARM',
    "engagement_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_analyzed_at" TIMESTAMP(3),
    "whatsapp_phone" TEXT,
    "opt_in_messaging" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Application"
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "whatsapp_sent" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp_msg_id" TEXT,
    "whatsapp_sent_at" TIMESTAMP(3),
    "conversation_score" DOUBLE PRECISION,
    "intent_type" TEXT,
    "engagement_metrics" JSONB,
    "lead_temperature" TEXT,
    "score_updated_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable "CandidateScore"
CREATE TABLE "CandidateScore" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT,
    "overall_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "skills_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "experience_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cultural_fit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "education_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "location_match" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoring_method" TEXT NOT NULL DEFAULT 'rule_based',
    "feedback" TEXT,
    "scored_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CandidateScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable "Interview"
CREATE TABLE "Interview" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "application_id" TEXT,
    "interview_type" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "interviewer" TEXT,
    "rating" DOUBLE PRECISION,
    "feedback" TEXT,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Interview_pkey" PRIMARY KEY ("id")
);

-- CreateTable "InterviewSchedule"
CREATE TABLE "InterviewSchedule" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "application_id" TEXT,
    "interview_date" TIMESTAMP(3),
    "interview_time" TEXT,
    "duration_minutes" INTEGER NOT NULL DEFAULT 30,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Dubai',
    "interview_type" TEXT NOT NULL,
    "interviewer_ids" TEXT[],
    "session_status" TEXT NOT NULL DEFAULT 'pending_scheduling',
    "available_slots" JSONB,
    "selected_slot" JSONB,
    "decline_reason" TEXT,
    "whatsapp_sent" BOOLEAN NOT NULL DEFAULT false,
    "whatsapp_msg_id" TEXT,
    "reminder_sent_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable "LeadScore"
CREATE TABLE "LeadScore" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "score_breakdown" JSONB NOT NULL,
    "lead_temperature" TEXT NOT NULL,
    "qualification_level" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL,
    "score_history" JSONB,
    "engagement_velocity" DOUBLE PRECISION,
    "qualified_for_roles" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable "ConversationMetric"
CREATE TABLE "ConversationMetric" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "message_count" INTEGER NOT NULL,
    "avg_response_time" DOUBLE PRECISION NOT NULL,
    "avg_message_length" INTEGER NOT NULL,
    "engagement_score" DOUBLE PRECISION NOT NULL,
    "sentiment_avg" DOUBLE PRECISION NOT NULL,
    "conversation_duration" JSONB NOT NULL,
    "activity_trend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConversationMetric_pkey" PRIMARY KEY ("id")
);

-- CreateTable "RecruitmentMetric"
CREATE TABLE "RecruitmentMetric" (
    "id" TEXT NOT NULL,
    "metric_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_applications" INTEGER NOT NULL DEFAULT 0,
    "applications_screened" INTEGER NOT NULL DEFAULT 0,
    "applications_rejected" INTEGER NOT NULL DEFAULT 0,
    "interviews_scheduled" INTEGER NOT NULL DEFAULT 0,
    "interviews_completed" INTEGER NOT NULL DEFAULT 0,
    "offers_made" INTEGER NOT NULL DEFAULT 0,
    "hires" INTEGER NOT NULL DEFAULT 0,
    "avg_time_to_hire" DOUBLE PRECISION,
    "avg_cost_per_hire" DOUBLE PRECISION,
    "automation_percentage" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruitmentMetric_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_email_key" ON "Candidate"("email");

-- CreateIndex
CREATE INDEX "LeadScore_lead_temperature_idx" ON "LeadScore"("lead_temperature");

-- CreateIndex
CREATE INDEX "LeadScore_overall_score_idx" ON "LeadScore"("overall_score");

-- CreateIndex
CREATE INDEX "LeadScore_job_id_idx" ON "LeadScore"("job_id");

-- CreateIndex
CREATE INDEX "ConversationMetric_candidate_id_idx" ON "ConversationMetric"("candidate_id");

-- CreateIndex
CREATE INDEX "ConversationMetric_job_id_idx" ON "ConversationMetric"("job_id");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateScore" ADD CONSTRAINT "CandidateScore_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateScore" ADD CONSTRAINT "CandidateScore_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSchedule" ADD CONSTRAINT "InterviewSchedule_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadScore" ADD CONSTRAINT "LeadScore_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadScore" ADD CONSTRAINT "LeadScore_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMetric" ADD CONSTRAINT "ConversationMetric_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMetric" ADD CONSTRAINT "ConversationMetric_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
