# Phase 1C: Implementation Roadmap & Task Breakdown

**Status:** 📋 Planning Complete  
**Ready to Start:** ✅ Yes  
**Timeline:** 3 weeks (Jan 17 - Feb 7)  
**Acceleration:** 1 week faster than Phase 1B

---

## 🗺️ High-Level Roadmap

```
PHASE 1C TIMELINE
═══════════════════════════════════════════════════════════

WEEK 1: FOUNDATION (Jan 17-23)
├─ Day 1: Twilio Setup & Configuration
├─ Day 2: WhatsAppService Implementation
├─ Day 3: Database Schema Migration
├─ Day 4: Basic Message Sending
├─ Day 5: Webhook & Message Reception
└─ Deliverable: Basic WhatsApp communication working

WEEK 2: FEATURES (Jan 24-30)
├─ Day 1: Message Templates System
├─ Day 2: Interview Scheduling Service
├─ Day 3: Calendar Integration (optional)
├─ Day 4: Message Personalization
├─ Day 5: Delivery Tracking & Analytics
└─ Deliverable: Full feature set implemented

WEEK 3: AUTOMATION & LAUNCH (Jan 31-Feb 7)
├─ Day 1: Campaign Management
├─ Day 2: Automated Triggers & Workflows
├─ Day 3: Comprehensive Testing
├─ Day 4: Documentation & Examples
├─ Day 5: Production Deployment
└─ Deliverable: Phase 1C complete, system live

TOTAL: ~40 hours of development
SUCCESS: Full WhatsApp integration + candidate messaging
```

---

## 📋 Detailed Task Breakdown

### PHASE 1C - WEEK 1: FOUNDATION

#### Task 1.1: Twilio Setup & Configuration
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Setup Twilio account and configure WhatsApp Business API

**Steps:**
1. Create Twilio account (https://www.twilio.com)
2. Upgrade to paid account ($20 USD typical)
3. Create WhatsApp Business Profile
4. Get Twilio WhatsApp sandbox number or production number
5. Get Account SID and Auth Token
6. Create .env variables
7. Setup webhook URL (ngrok for local testing)
8. Configure webhook in Twilio console

**Dependencies:** None
**Blockers:** None

**Deliverable:**
- `.env` with Twilio credentials
- Webhook URL configured
- Twilio ready for API calls

**Verification:**
```bash
# Test connection
curl -X GET https://api.twilio.com/2010-04-01/Accounts \
  -u $TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN
# Should return: 200 OK
```

---

#### Task 1.2: Install & Configure Twilio SDK
**Status:** ⏳ Not Started  
**Estimated:** 1 hour

**Description:**
Add Twilio client library and setup configuration

**Steps:**
1. `npm install twilio`
2. Create `server/config/twilio.js` config file
3. Initialize Twilio client with credentials
4. Create helper functions for common operations
5. Test basic connectivity

**Dependencies:** Task 1.1 (Twilio setup)
**Code Location:** `server/config/twilio.js`, `server/services/WhatsAppService.js`

**File to Create:**
```javascript
// server/config/twilio.js
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default client;
```

**Deliverable:**
- Twilio SDK installed
- Configuration file created
- Client ready for use

---

#### Task 1.3: Create WhatsAppService Class
**Status:** ⏳ Not Started  
**Estimated:** 4 hours

**Description:**
Build core WhatsApp service with messaging, delivery tracking, and error handling

**File:** `server/services/WhatsAppService.js`

**Key Methods:**
```javascript
class WhatsAppService {
  // Send a single message
  async sendMessage(toPhone, message, options = {})
  
  // Send message from template
  async sendTemplateMessage(toPhone, templateId, variables)
  
  // Check message delivery status
  async getMessageStatus(messageSid)
  
  // Get message history
  async getMessageHistory(candidateId, limit = 20)
  
  // Parse incoming message
  async parseIncomingMessage(twilioData)
  
  // Handle message delivery webhook
  async handleDeliveryUpdate(messageSid, status)
  
  // Validate phone number format
  validatePhoneNumber(phone)
}
```

**Logic:**
- Format phone numbers correctly
- Add E.164 prefix validation
- Implement retry logic for failed sends
- Track message SIDs
- Store all messages in database
- Handle Twilio API errors gracefully

**Dependencies:** Task 1.2 (Twilio SDK)
**Deliverable:** WhatsAppService fully functional

---

#### Task 1.4: Database Schema Migration
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Create new database tables for WhatsApp communication

**Steps:**
1. Update Prisma schema with new models
2. Create migration files
3. Run migrations
4. Seed test data (optional)

**New Models:**
- `WhatsAppMessage` - All messages sent/received
- `InterviewSchedule` - Interview bookings
- `MessageTemplate` - Message templates
- `CampaignTracking` - Campaign metrics
- Enhanced `Candidate` model
- Enhanced `Application` model

**Database Impact:**
- 4 new tables
- 2 table updates
- ~50 new fields total

**Dependencies:** Task 1.3 (WhatsAppService foundation)
**Deliverable:** Database ready for data

---

#### Task 1.5: Create Webhook Endpoint
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Setup endpoint to receive and process Twilio webhook events

**Endpoint:** `POST /api/recruitment/whatsapp/webhook`

**Responsibilities:**
1. Verify Twilio request signature (security)
2. Parse incoming message/status update
3. Store in WhatsAppMessage
4. Trigger intent detection
5. Handle response actions
6. Log webhook events

**Security:**
- Validate Twilio request signature
- Rate limiting
- Input validation
- Error handling

**Dependencies:** Task 1.4 (Database), Task 1.3 (WhatsAppService)
**Deliverable:** Webhook processing working

---

#### Task 1.6: Basic Send Message Endpoint
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Create API endpoint to send WhatsApp messages

**Endpoint:** `POST /api/recruitment/whatsapp/send-message`

**Request:**
```json
{
  "candidate_id": "string",
  "message_type": "screening_result|interview_request|custom",
  "message": "Custom message text (optional)",
  "variables": { }
}
```

**Response:**
```json
{
  "success": true,
  "message_id": "message_sid",
  "status": "sent"
}
```

**Logic:**
1. Validate candidate exists and has phone number
2. Check opt-in status
3. Get message template
4. Render with variables
5. Call WhatsAppService.sendMessage()
6. Store message record
7. Return response

**Dependencies:** Task 1.5 (webhook), Task 1.3 (service)
**Deliverable:** Can send messages via API

---

#### Task 1.7: Week 1 Testing & Validation
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Test all Week 1 components working together

**Test Cases:**
1. ✅ Twilio connection works
2. ✅ Send simple message to test phone
3. ✅ Webhook receives delivery update
4. ✅ Database records created
5. ✅ Message status tracking works
6. ✅ Error handling for invalid phones
7. ✅ Rate limiting prevents spam

**Manual Testing:**
- Send test message to your phone
- Verify delivery status updates
- Check database records
- Test error scenarios

**Deliverable:**
- All tests passing
- Week 1 foundation stable

---

### PHASE 1C - WEEK 2: FEATURES

#### Task 2.1: Message Templates System
**Status:** ⏳ Not Started  
**Estimated:** 3 hours

**Description:**
Build system for managing and rendering message templates

**Features:**
- Create/read/update/delete templates
- Variable substitution
- Template validation
- Default templates included

**Endpoints:**
- `GET /api/recruitment/whatsapp/templates` - List all
- `POST /api/recruitment/whatsapp/templates` - Create
- `GET /api/recruitment/whatsapp/templates/:id` - Get
- `PUT /api/recruitment/whatsapp/templates/:id` - Update
- `DELETE /api/recruitment/whatsapp/templates/:id` - Delete

**Template Rendering:**
```javascript
// Example
const template = "Hi {{candidate_name}}, congrats on {{job_title}}!";
const variables = { candidate_name: "John", job_title: "Senior Dev" };
const rendered = renderTemplate(template, variables);
// Result: "Hi John, congrats on Senior Dev!"
```

**Default Templates:**
1. screening_result
2. interview_invitation
3. interview_reminder
4. offer_letter
5. follow_up
6. thank_you

**Dependencies:** Task 1.4 (Database)
**Deliverable:** Template system working

---

#### Task 2.2: Interview Scheduling Service
**Status:** ⏳ Not Started  
**Estimated:** 4 hours

**Description:**
Build service for managing interview scheduling workflow

**Key Methods:**
```javascript
class InterviewScheduleService {
  async scheduleInterview(candidateId, jobId, details)
  async getAvailableSlots(jobId, date)
  async confirmBooking(scheduleId)
  async cancelInterview(scheduleId, reason)
  async getRSVPStatus(scheduleId)
  async updateInterviewStatus(scheduleId, status)
  async getInterviewHistory(candidateId)
}
```

**Features:**
- Create interview records
- Track candidate RSVP
- Calendar integration (Google Calendar API - optional)
- Prevent double-booking
- Generate meeting links (Zoom, Teams, etc.)
- Store interview feedback

**Dependencies:** Task 2.1 (Templates)
**Deliverable:** Interview scheduling fully functional

---

#### Task 2.3: Message Personalization Engine
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Advanced personalization for messages

**Features:**
- Extract candidate data
- Extract job data
- Extract scoring data
- Render with templates
- Multi-language support (future)

**Example:**
```javascript
const personalized = await personalize(
  template: "screening_result",
  candidate: candidateRecord,
  job: jobRecord,
  score: scoringResult
);
// Returns fully rendered message with all data
```

**Dependencies:** Task 2.1 (Templates), Task 1.3 (WhatsAppService)
**Deliverable:** Personalization engine working

---

#### Task 2.4: Delivery Tracking & Status Updates
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Track and display message delivery status

**Statuses:**
- `pending` - Message sent, awaiting Twilio update
- `sent` - Message successfully sent to carrier
- `delivered` - Message delivered to phone
- `read` - Recipient read the message
- `failed` - Delivery failed

**Features:**
- Update status from webhook
- Calculate delivery time
- Generate delivery reports
- Identify failed messages
- Retry failed messages

**Endpoint:**
```
GET /api/recruitment/whatsapp/messages/:messageId/status
```

**Dependencies:** Task 1.5 (webhook), Task 1.3 (service)
**Deliverable:** Full delivery tracking

---

#### Task 2.5: Week 2 Testing
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Test all Week 2 features

**Test Scenarios:**
1. ✅ Send template-based message
2. ✅ Schedule interview via WhatsApp
3. ✅ Personalization renders correctly
4. ✅ Delivery tracking updates in real-time
5. ✅ Interview RSVP handling
6. ✅ Template management CRUD
7. ✅ Error handling for edge cases

**Deliverable:**
- All Week 2 tests passing
- Features stable and integrated

---

### PHASE 1C - WEEK 3: AUTOMATION & LAUNCH

#### Task 3.1: Campaign Management System
**Status:** ⏳ Not Started  
**Estimated:** 3 hours

**Description:**
Build system for bulk messaging campaigns

**Features:**
- Create campaigns
- Target candidates by criteria
- Schedule bulk sends
- Rate limiting
- Campaign analytics

**Endpoints:**
- `POST /api/recruitment/whatsapp/campaigns` - Create
- `GET /api/recruitment/whatsapp/campaigns` - List
- `GET /api/recruitment/whatsapp/campaigns/:id` - Get details
- `POST /api/recruitment/whatsapp/campaigns/:id/execute` - Run
- `GET /api/recruitment/whatsapp/campaigns/:id/metrics` - Stats

**Campaign Types:**
- `bulk_messaging` - Send message to group
- `follow_up` - Re-engage non-responders
- `reminder` - Send reminders
- `outreach` - Reach new candidates

**Dependencies:** Task 2.1 (Templates), Task 1.3 (WhatsAppService)
**Deliverable:** Campaign system working

---

#### Task 3.2: Automated Triggers & Workflows
**Status:** ⏳ Not Started  
**Estimated:** 4 hours

**Description:**
Setup automatic message sending based on events

**Trigger Types:**
1. **Scoring Completion** - Send result when candidate scored
2. **Interview Booking** - Send confirmation when scheduled
3. **Time-Based** - Send reminder 24h before interview
4. **Response-Based** - React to candidate messages

**Implementation:**
- Hook into CandidateScoringService
- Create job scheduler for time-based triggers
- Implement state machines for workflows
- Error handling and retry logic

**Workflow Example:**
```
TRIGGER: Candidate scored 85+ for job

ACTION SEQUENCE:
1. Load template: "screening_result"
2. Personalize with score data
3. Send message via WhatsApp
4. Create WhatsAppMessage record
5. Wait for response (webhook)
6. If "Schedule" → offer time slots
7. If accepts → create InterviewSchedule
8. Set reminder for 24h before
```

**Dependencies:** Task 3.1 (Campaigns), Task 2.2 (Scheduling)
**Deliverable:** Workflows operational

---

#### Task 3.3: Response Parsing & Intent Detection
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Parse incoming messages and detect candidate intent

**Intent Types:**
- `schedule_interview` - "Yes", "Schedule", "When?"
- `ask_question` - "What about salary?", "More info"
- `decline` - "Not interested", "No thanks"
- `confirm_rsvp` - "Confirmed", "I'll be there"
- `unknown` - Anything else

**Implementation:**
- Keyword matching (simple)
- Future: NLP/ML (Phase 2+)
- Confidence scoring
- Fallback to manual review

**Dependency:** Task 1.5 (webhook)
**Deliverable:** Intent detection working

---

#### Task 3.4: Comprehensive Testing
**Status:** ⏳ Not Started  
**Estimated:** 3 hours

**Description:**
Full system testing and validation

**Test Coverage:**
1. **Unit Tests** - Individual services
2. **Integration Tests** - Services working together
3. **End-to-End Tests** - Full workflows
4. **Performance Tests** - Rate limiting, concurrency
5. **Security Tests** - Input validation, signature verification
6. **Error Scenarios** - Network failures, API issues

**Test File:** `tests/whatsapp.test.js`

**Key Scenarios:**
- ✅ Send message to valid phone
- ✅ Send message to invalid phone (error handling)
- ✅ Receive delivery update
- ✅ Receive incoming message
- ✅ Schedule interview workflow
- ✅ Campaign bulk sending (rate limited)
- ✅ Message deduplication
- ✅ Phone number validation

**Deliverable:**
- Comprehensive test suite
- >90% code coverage
- All tests passing

---

#### Task 3.5: Documentation
**Status:** ⏳ Not Started  
**Estimated:** 3 hours

**Description:**
Complete documentation for Phase 1C

**Documents:**
1. **PHASE_1C_IMPLEMENTATION_COMPLETE.md** - Technical guide
2. **PHASE_1C_QUICK_REFERENCE.md** - API reference
3. **PHASE_1C_WORKFLOWS.md** - Workflow diagrams
4. **PHASE_1C_TROUBLESHOOTING.md** - Common issues
5. **WHATSAPP_SETUP_GUIDE.md** - Twilio setup steps
6. **DEPLOYMENT_GUIDE.md** - Production deployment

**Content:**
- API documentation with examples
- Architecture diagrams
- Database schema
- Workflow diagrams
- Troubleshooting guide
- Deployment checklist

**Deliverable:**
- 8+ documentation files
- 50+ pages total
- Complete coverage

---

#### Task 3.6: Production Deployment
**Status:** ⏳ Not Started  
**Estimated:** 2 hours

**Description:**
Deploy Phase 1C to production

**Steps:**
1. Update .env with production credentials
2. Update Twilio webhook URL to production
3. Run database migrations
4. Deploy code to server
5. Test all endpoints in production
6. Monitor for errors
7. Update documentation

**Verification:**
- ✅ All endpoints accessible
- ✅ Messages sending/receiving
- ✅ Webhooks processing
- ✅ Database queries working
- ✅ Logging operational
- ✅ Error handling in place

**Deliverable:**
- Phase 1C live in production
- System fully operational

---

#### Task 3.7: Week 3 Final Testing
**Status:** ⏳ Not Started  
**Estimated:** 1 hour

**Description:**
Final validation before completion

**Checklist:**
- ✅ All endpoints tested
- ✅ Workflows validated
- ✅ Performance acceptable
- ✅ Documentation complete
- ✅ Error handling robust
- ✅ Production ready

**Deliverable:**
- Phase 1C complete and validated
- Ready for Phase 1D

---

## 📊 Task Summary & Effort Estimates

| Task | Week | Estimated | Status | Notes |
|------|------|-----------|--------|-------|
| 1.1 Twilio Setup | 1 | 2h | ⏳ | Critical path |
| 1.2 SDK Setup | 1 | 1h | ⏳ | Depends on 1.1 |
| 1.3 WhatsAppService | 1 | 4h | ⏳ | Core component |
| 1.4 Database Schema | 1 | 2h | ⏳ | Depends on 1.3 |
| 1.5 Webhook Endpoint | 1 | 2h | ⏳ | Depends on 1.4 |
| 1.6 Send Message API | 1 | 2h | ⏳ | Depends on 1.5 |
| 1.7 Week 1 Testing | 1 | 2h | ⏳ | Integration test |
| 2.1 Templates System | 2 | 3h | ⏳ | Core feature |
| 2.2 Scheduling Service | 2 | 4h | ⏳ | Complex feature |
| 2.3 Personalization | 2 | 2h | ⏳ | Enhancement |
| 2.4 Delivery Tracking | 2 | 2h | ⏳ | Depends on webhook |
| 2.5 Week 2 Testing | 2 | 2h | ⏳ | Integration test |
| 3.1 Campaigns | 3 | 3h | ⏳ | Advanced feature |
| 3.2 Workflows | 3 | 4h | ⏳ | Automation |
| 3.3 Intent Detection | 3 | 2h | ⏳ | Simple NLP |
| 3.4 Full Testing | 3 | 3h | ⏳ | Test suite |
| 3.5 Documentation | 3 | 3h | ⏳ | Deliverable |
| 3.6 Deployment | 3 | 2h | ⏳ | Production |
| 3.7 Final Testing | 3 | 1h | ⏳ | Sign-off |
| **TOTAL** | **3w** | **~45h** | **⏳** | **Complete system** |

---

## 🔀 Dependency Graph

```
1.1 Twilio Setup
    ↓
1.2 SDK Setup
    ↓
1.3 WhatsAppService (core)
    ↓
1.4 Database Schema
    ↓
1.5 Webhook Endpoint ←─┐
    ↓                  │
1.6 Send Message API  │
    ↓                  │
1.7 Week 1 Testing ◄──┘
    ↓
2.1 Templates ─────┐
    ↓              │
2.2 Scheduling ────├─→ 2.5 Testing
    ↓              │
2.3 Personalization┤
    ↓              │
2.4 Delivery Tracking ┘
    ↓
3.1 Campaigns
    ↓
3.2 Workflows ─┐
    ↓          ├─→ 3.4 Full Testing
3.3 Intent ────┘
    ↓
3.5 Documentation
    ↓
3.6 Deployment
    ↓
3.7 Final Testing (COMPLETE)
```

---

## ✅ Completion Checklist

**Week 1 Completion:**
- [ ] Twilio account created and configured
- [ ] WhatsAppService implemented and tested
- [ ] Database migrated with new tables
- [ ] Webhook endpoint receiving messages
- [ ] Send message API working
- [ ] Basic tests passing

**Week 2 Completion:**
- [ ] Template system functional
- [ ] Interview scheduling working
- [ ] Personalization engine ready
- [ ] Delivery tracking accurate
- [ ] All features tested together

**Week 3 Completion:**
- [ ] Campaign management system working
- [ ] Automated workflows operational
- [ ] Intent detection functional
- [ ] Comprehensive test suite passing
- [ ] Documentation complete
- [ ] Production deployment successful
- [ ] Final validation passed

**Overall Phase 1C Completion:**
- ✅ WhatsApp integration complete
- ✅ All features implemented
- ✅ System tested and validated
- ✅ Documentation complete
- ✅ Ready for Phase 1D

---

## 🚀 Next Steps

**Proceed with Phase 1C?**

1. ✅ Approve this roadmap
2. ✅ Confirm Twilio budget
3. ✅ Start Task 1.1 (Twilio Setup)
4. ✅ Continue with Week 1 tasks

**Timeline:**
- Start: January 17, 2026
- Completion: February 7, 2026
- Acceleration: 1 week faster

**Ready to begin?** 🚀
