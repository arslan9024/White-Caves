# Phase 1C: WhatsApp Integration - Architecture & Planning

**Phase:** 1C  
**Timeline:** January 17 - February 7, 2026  
**Duration:** 3 weeks (accelerated from 2 weeks)  
**Status:** 🔄 Planning & Design

---

## 📋 Phase 1C Overview

Phase 1C adds **WhatsApp communication** to the recruitment system, enabling automated candidate outreach, interview scheduling, and two-way conversations through WhatsApp messaging.

### Core Objectives
- ✅ Send screening results to candidates via WhatsApp
- ✅ Schedule interviews through messaging
- ✅ Automated follow-up campaigns
- ✅ Message templates and personalization
- ✅ Delivery tracking and analytics
- ✅ 2-way conversation support

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│           RECRUITMENT SYSTEM - PHASE 1C                 │
│          WhatsApp Communication Layer                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  API LAYER                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Phase 1B Endpoints (Scoring):                          │
│  • /jobs/{id}/score-candidate                           │
│  • /jobs/{id}/batch-score                              │
│  • /jobs/{id}/top-candidates                           │
│  • /candidates/{id}/screening-scores                   │
│  • /candidates/{id}/extract-resume                     │
│  • /jobs/{id}/screening-metrics                        │
│                                                         │
│  Phase 1C Endpoints (NEW - WhatsApp):                   │
│  • /whatsapp/send-message                              │
│  • /whatsapp/schedule-interview                        │
│  • /whatsapp/webhook                                   │
│  • /whatsapp/message-history                           │
│  • /whatsapp/templates                                 │
│  • /whatsapp/campaigns                                 │
│                                                         │
└────────┬─────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────────┐
│               SERVICES LAYER                             │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ WhatsAppService  │  │ InterviewScheduleService     │ │
│  │                  │  │                              │ │
│  │ • sendMessage    │  │ • scheduleInterview          │ │
│  │ • receiveMessage │  │ • getAvailableSlots          │ │
│  │ • checkStatus    │  │ • confirmBooking             │ │
│  │ • parseIncoming  │  │ • sendReminders              │ │
│  │                  │  │ • trackRSVP                  │ │
│  └──────────────────┘  └──────────────────────────────┘ │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │ MessageTemplate  │  │ CampaignService              │ │
│  │ Service          │  │                              │ │
│  │                  │  │ • createCampaign             │ │
│  │ • renderTemplate │  │ • batchSendMessages          │ │
│  │ • personalize    │  │ • trackMetrics               │ │
│  │ • validate       │  │ • segmentCandidates          │ │
│  │ • listTemplates  │  │ • analyzeResponse            │ │
│  └──────────────────┘  └──────────────────────────────┘ │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────────┐
│            WHATSAPP API INTEGRATION                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Twilio WhatsApp Business API                           │
│  ├─ Send messages                                       │
│  ├─ Receive messages (webhook)                          │
│  ├─ Track delivery status                               │
│  ├─ Get message history                                 │
│  └─ Media support (images, documents)                   │
│                                                          │
│  Configuration:                                         │
│  • TWILIO_ACCOUNT_SID                                   │
│  • TWILIO_AUTH_TOKEN                                    │
│  • TWILIO_WHATSAPP_NUMBER                               │
│  • TWILIO_WEBHOOK_URL                                   │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────────┐
│              DATA PERSISTENCE LAYER                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  New Tables:                                            │
│  • WhatsAppMessage (all messages sent/received)         │
│  • InterviewSchedule (interview bookings)               │
│  • MessageTemplate (reusable templates)                 │
│  • CampaignTracking (campaign metrics)                  │
│  • WhatsAppWebhookLog (webhook event tracking)          │
│                                                          │
│  Enhanced Tables:                                       │
│  • Candidate (add whatsapp_phone, opt_in fields)       │
│  • Application (add interview_date, status fields)      │
│                                                          │
└────────┬─────────────────────────────────────────────────┘
         │
┌────────▼─────────────────────────────────────────────────┐
│              DATABASE (MongoDB/PostgreSQL)               │
├──────────────────────────────────────────────────────────┤
│  All data storage and retrieval                         │
└──────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow: WhatsApp Message Workflow

```
PHASE 1B SCORING
│
├─ Candidate scored
├─ Status: strong_match
└─ Ready for contact

    ▼

PHASE 1C OUTREACH
│
├─ Trigger: scoreCandidateForJob() completes
├─ Check: candidate.whatsapp_phone exists
├─ Check: candidate.opt_in_messaging = true
└─ Select message template

    ▼

MESSAGE PERSONALIZATION
│
├─ Load template: "screening_result.txt"
├─ Personalize with:
│  ├─ candidate.first_name
│  ├─ job.title
│  ├─ overall_score
│  └─ feedback snippet
└─ Generate message text

    ▼

SEND VIA TWILIO
│
├─ Call Twilio API
├─ POST /Messages
├─ Body: { To: +971XXXXXXXXX, Body: message }
└─ Receive: message_sid

    ▼

STORE MESSAGE
│
├─ Create WhatsAppMessage record
├─ Fields:
│  ├─ message_sid (Twilio ID)
│  ├─ candidate_id
│  ├─ message_type ("screening_result")
│  ├─ content
│  ├─ status ("pending")
│  └─ created_at
└─ Save to database

    ▼

MONITOR DELIVERY
│
├─ Webhook: Twilio sends status updates
├─ Update: WhatsAppMessage.status
│  ├─ "sent"
│  ├─ "delivered"
│  ├─ "read"
│  └─ "failed"
└─ Track: delivery_timestamp

    ▼

HANDLE RESPONSE
│
├─ Candidate replies (or initiates chat)
├─ Webhook: Twilio sends incoming message
├─ Parse: message content
├─ Store: WhatsAppMessage record (incoming)
├─ Detect intent:
│  ├─ "schedule_interview"?
│  ├─ "ask_question"?
│  ├─ "decline"?
│  └─ "not_interested"?
└─ Trigger: appropriate action

    ▼

ACTION: Schedule Interview
│
├─ Show available time slots
├─ Candidate selects slot
├─ Create InterviewSchedule record
├─ Send confirmation
└─ Update Application.interview_date

    ▼

INTERVIEW REMINDER
│
├─ Scheduled job: 24 hours before
├─ Send WhatsApp reminder
├─ Include: interview_date, location link
└─ Request: confirmation
```

---

## 🗄️ Database Schema Extensions

### New Table: WhatsAppMessage

```prisma
model WhatsAppMessage {
  id                    String   @id @default(cuid())
  
  // Relationship
  candidate_id          String
  candidate             Candidate @relation(fields: [candidate_id], references: [id])
  
  // Message Details
  message_sid           String   @unique  // Twilio message ID
  message_type          String   // "screening_result", "interview_request", "reminder", etc.
  direction             String   // "outgoing" or "incoming"
  
  // Content
  content               String   // Actual message text
  template_id           String?  // If from template
  media_url             String?  // Image, document, etc.
  
  // Status Tracking
  status                String   // "pending", "sent", "delivered", "read", "failed"
  error_message         String?  // If failed
  
  // Timestamps
  sent_at               DateTime?
  delivered_at          DateTime?
  read_at               DateTime?
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt
  
  // Metadata
  metadata              Json?    // Custom data
}
```

### New Table: InterviewSchedule

```prisma
model InterviewSchedule {
  id                    String   @id @default(cuid())
  
  // Relationships
  candidate_id          String
  candidate             Candidate @relation(fields: [candidate_id], references: [id])
  job_id                String
  job                   Job @relation(fields: [job_id], references: [id])
  application_id        String?
  application           Application? @relation(fields: [application_id], references: [id])
  
  // Schedule Details
  interview_date        DateTime
  interview_time        String    // "14:00"
  duration_minutes      Int       // 30, 60, etc.
  timezone              String    // "Asia/Dubai"
  
  // Interview Type
  interview_type        String    // "phone_screening", "technical", "hr", "final"
  interviewer_id        String?   // Recruiter/Hiring Manager ID
  interviewer_name      String?
  
  // Meeting Details
  meeting_link          String?   // Zoom, Google Meet, Teams link
  meeting_password      String?
  location              String?   // Physical location or "Virtual"
  
  // Status
  status                String    // "scheduled", "confirmed", "completed", "cancelled", "no_show"
  candidate_rsvp        String?   // "pending", "confirmed", "declined"
  rsvp_timestamp        DateTime?
  
  // Feedback
  interviewer_feedback  String?
  interviewer_rating    Int?      // 1-5
  next_stage            String?   // "offer", "reject", "second_round", etc.
  
  // Reminders
  reminder_sent_24h     Boolean @default(false)
  reminder_sent_1h      Boolean @default(false)
  
  // Timestamps
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt
}
```

### New Table: MessageTemplate

```prisma
model MessageTemplate {
  id                    String   @id @default(cuid())
  
  // Identification
  name                  String   @unique  // "screening_result", "interview_invite"
  category              String   // "screening", "interview", "follow_up", "reminder"
  description           String?
  
  // Template Content
  subject               String?  // Optional subject line
  body                  String   // Message template with placeholders
  
  // Variables Used
  variables             String[] // ["candidate_name", "job_title", "interview_date"]
  
  // Configuration
  is_active             Boolean @default(true)
  created_by            String?
  
  // Timestamps
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt
}
```

### New Table: CampaignTracking

```prisma
model CampaignTracking {
  id                    String   @id @default(cuid())
  
  // Campaign Details
  campaign_name         String
  campaign_type         String   // "bulk_messaging", "follow_up", "reminder"
  
  // Targeting
  target_job_id         String?
  target_status         String?  // "strong_match", "good_match", etc.
  total_recipients      Int
  
  // Metrics
  messages_sent         Int @default(0)
  messages_delivered    Int @default(0)
  messages_read         Int @default(0)
  messages_failed       Int @default(0)
  
  // Response Metrics
  responses_received    Int @default(0)
  interview_scheduled   Int @default(0)
  candidates_interested Int @default(0)
  
  // Timing
  scheduled_date        DateTime?
  started_at            DateTime?
  completed_at          DateTime?
  
  // Status
  status                String   // "draft", "scheduled", "running", "completed"
  
  // Timestamps
  created_at            DateTime @default(now())
  updated_at            DateTime @updatedAt
}
```

### Enhanced: Candidate Model

```prisma
// Add these fields to existing Candidate model:
model Candidate {
  // ... existing fields ...
  
  // WhatsApp Communication
  whatsapp_phone        String?  @unique  // Phone number for WhatsApp
  whatsapp_verified     Boolean @default(false)
  
  // Preferences
  opt_in_messaging      Boolean @default(false)  // User explicitly opted in
  preferred_contact_time String? // "morning", "afternoon", "evening"
  
  // Related Models
  whatsappMessages      WhatsAppMessage[]
  interviewSchedules    InterviewSchedule[]
}
```

### Enhanced: Application Model

```prisma
// Add these fields to existing Application model:
model Application {
  // ... existing fields ...
  
  // Interview Details
  interview_id          String?
  interview             InterviewSchedule? @relation(fields: [interview_id], references: [id])
  
  // Communication
  last_message_sent     DateTime?
  last_message_received DateTime?
  message_count         Int @default(0)
}
```

---

## 🔌 Twilio WhatsApp Setup

### Prerequisites
1. Twilio account (https://www.twilio.com)
2. WhatsApp Business Account activated
3. Twilio WhatsApp Sandbox or Production number

### Configuration in .env

```bash
# Twilio Credentials
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890  # Your Twilio WhatsApp number
TWILIO_WEBHOOK_URL=https://your-domain.com/api/whatsapp/webhook

# WhatsApp Settings
WHATSAPP_ENABLED=true
WHATSAPP_MESSAGE_RATE_LIMIT=100  # Messages per hour
WHATSAPP_RETRY_ATTEMPTS=3

# Timezone (for scheduling)
DEFAULT_TIMEZONE=Asia/Dubai
```

---

## 📡 API Endpoints (Phase 1C)

### 1. Send WhatsApp Message

```
POST /api/recruitment/whatsapp/send-message

Body:
{
  "candidate_id": "string",
  "message_type": "screening_result|interview_request|reminder|custom",
  "template_id": "string (optional)",
  "custom_message": "string (optional)",
  "variables": {
    "job_title": "Senior Developer",
    "overall_score": 87,
    "feedback": "..."
  }
}

Response:
{
  "success": true,
  "message_id": "message_sid",
  "status": "sent",
  "sent_at": "2026-01-17T10:30:00Z"
}
```

### 2. Schedule Interview via WhatsApp

```
POST /api/recruitment/whatsapp/schedule-interview

Body:
{
  "candidate_id": "string",
  "job_id": "string",
  "interview_date": "2026-01-25",
  "interview_time": "14:00",
  "interview_type": "phone_screening",
  "duration_minutes": 30,
  "meeting_link": "https://zoom.us/j/..."
}

Response:
{
  "success": true,
  "schedule_id": "string",
  "interview_date": "2026-01-25T14:00:00Z",
  "confirmation_sent": true
}
```

### 3. WhatsApp Webhook (Receive Messages)

```
POST /api/recruitment/whatsapp/webhook

Body (from Twilio):
{
  "MessageSid": "SMxxxxx",
  "AccountSid": "ACxxxxx",
  "From": "+971XXXXXXXXX",
  "To": "+1234567890",
  "Body": "I'm interested in the interview!",
  "NumMedia": 0,
  "MessageStatus": "received"
}

Response:
{
  "success": true,
  "status": "processed"
}
```

### 4. Get Message History

```
GET /api/recruitment/whatsapp/message-history?candidate_id=CANDIDATE_ID

Response:
{
  "candidate_id": "string",
  "total_messages": 5,
  "messages": [
    {
      "id": "string",
      "direction": "outgoing|incoming",
      "content": "string",
      "status": "delivered",
      "sent_at": "2026-01-17T10:30:00Z"
    },
    ...
  ]
}
```

### 5. List Message Templates

```
GET /api/recruitment/whatsapp/templates

Response:
{
  "templates": [
    {
      "id": "string",
      "name": "screening_result",
      "category": "screening",
      "body": "Hi {{candidate_name}}, ...",
      "variables": ["candidate_name", "job_title", "overall_score"]
    },
    ...
  ]
}
```

### 6. Launch Campaign

```
POST /api/recruitment/whatsapp/campaigns

Body:
{
  "campaign_name": "Strong Matches - Engineering",
  "campaign_type": "bulk_messaging",
  "template_id": "screening_result",
  "target_job_id": "job_123",
  "target_status": "strong_match",
  "scheduled_date": "2026-01-18T09:00:00Z"
}

Response:
{
  "success": true,
  "campaign_id": "string",
  "target_recipients": 15,
  "status": "scheduled"
}
```

---

## 📝 Message Templates

### Template 1: Screening Result

```
Hi {{candidate_name}}! 👋

Great news! We've reviewed your resume for the {{job_title}} position at Tuesday People & Minds.

📊 Your Score: {{overall_score}}/100 ({{screening_status}})

💡 Highlights:
{{feedback}}

✨ We'd love to move forward! Are you available for a quick chat this week?

Reply with:
- 📅 "Schedule" to book an interview
- ❓ "Questions" if you have questions
- ⏰ "Later" if you need more time

Looking forward to hearing from you! 🚀

--- Tuesday People & Minds Recruitment Team
```

### Template 2: Interview Invitation

```
🎯 Interview Invitation - {{job_title}}

Hi {{candidate_name}},

You're invited to interview for the {{job_title}} position!

📅 Suggested Times:
- {{time_slot_1}}
- {{time_slot_2}}
- {{time_slot_3}}

⏱️ Duration: {{duration_minutes}} minutes
🔗 Platform: {{meeting_platform}}
📍 Link: {{meeting_link}}

Reply with the time that works best for you! ✨

--- Tuesday People & Minds Recruitment Team
```

### Template 3: Interview Reminder

```
⏰ Reminder: Your Interview is Tomorrow!

Hi {{candidate_name}},

Just a friendly reminder about your {{interview_type}} interview:

📅 Date: {{interview_date}} at {{interview_time}}
⏱️ Duration: {{duration_minutes}} minutes
🔗 Link: {{meeting_link}}

Please confirm your attendance by replying: "Confirmed"

See you soon! 👋

--- Tuesday People & Minds Recruitment Team
```

### Template 4: Offer Letter

```
🎉 Great News, {{candidate_name}}!

We're thrilled to offer you the position of {{job_title}} at Tuesday People & Minds!

💼 Job Details:
- Title: {{job_title}}
- Department: {{department}}
- Start Date: {{start_date}}
- Salary: {{salary_range}}

Next Steps:
1. Reply "Accept" to confirm
2. We'll send detailed offer letter via email
3. Onboarding begins {{start_date}}

Congratulations! 🎊

--- Tuesday People & Minds Recruitment Team
```

---

## 🔄 Workflow Examples

### Example 1: Automated Screening Result Notification

```
TRIGGER: batch-score endpoint completes for 10 candidates

ACTION:
1. Get all candidates with screening_status = "strong_match"
2. For each candidate:
   a. Check: whatsapp_phone exists
   b. Check: opt_in_messaging = true
   c. Load template: "screening_result"
   d. Render with candidate data
   e. Send via Twilio
   f. Create WhatsAppMessage record

RESULT:
- 10 messages sent
- Status tracked in database
- Webhook will update delivery status
```

### Example 2: Interactive Interview Scheduling

```
FLOW:
1. Candidate receives screening result message
2. Candidate replies: "Schedule"
3. Webhook receives message
4. System detects intent: schedule_interview
5. Send back: "Available times:"
   - Monday 2 PM
   - Tuesday 3 PM
   - Wednesday 10 AM
6. Candidate replies: "Tuesday 3 PM"
7. System:
   a. Creates InterviewSchedule record
   b. Updates Application.interview_id
   c. Sends confirmation
   d. Schedules reminder for 24h before

RESULT:
- Interview booked completely via WhatsApp
- Data synchronized in system
```

### Example 3: Campaign: Follow-Up Strong Matches

```
SCENARIO: You want to reach out to all strong matches for a specific job

STEPS:
1. Create campaign via POST /campaigns
2. Target: job_id = "senior_dev", status = "strong_match"
3. Finds 25 matching candidates
4. Uses template: "interview_invitation"
5. Schedules bulk send for next morning

EXECUTION:
- 25 messages queued
- Sent 5 at a time (rate limiting)
- Each includes time slot options
- Webhook tracks delivery

METRICS:
- Messages sent: 25
- Messages delivered: 24
- Replies: 18 (72% response rate!)
- Interviews scheduled: 16
```

---

## ⚙️ Implementation Plan

### Week 1: Foundation Setup
- [ ] Setup Twilio account & WhatsApp Business
- [ ] Install Twilio SDK
- [ ] Create WhatsAppService class
- [ ] Implement message sending
- [ ] Setup webhook endpoint
- [ ] Database schema migration

### Week 2: Features & Scheduling
- [ ] Message templates system
- [ ] Interview scheduling service
- [ ] Calendar integration (optional)
- [ ] Message personalization
- [ ] Delivery tracking

### Week 3: Automation & Testing
- [ ] Campaign management
- [ ] Automated triggers
- [ ] Bulk messaging
- [ ] Response handling
- [ ] Comprehensive testing
- [ ] Documentation

---

## 📊 Success Metrics

| Metric | Target |
|--------|--------|
| Message Delivery Rate | >95% |
| Response Rate | >60% |
| Interview Scheduling Rate | >40% |
| API Response Time | <200ms |
| Webhook Reliability | >99% |
| Message Rate | 100/hour (configurable) |

---

## 🚀 Next Steps

Ready to begin Phase 1C implementation?

1. **Approve this design** - Confirm architecture and approach
2. **Setup Twilio** - Get credentials and webhook URL
3. **Begin implementation** - Start with WhatsAppService
4. **Database migration** - Add new tables
5. **API endpoints** - Build WhatsApp routes
6. **Testing** - Comprehensive validation

**Proceed with Phase 1C?** ✅
