# Phase 1C: Quick Start Guide

**Phase:** 1C - WhatsApp Integration  
**Status:** 📋 Ready to Begin  
**Timeline:** 3 weeks (Jan 17 - Feb 7, 2026)

---

## 🎯 Quick Overview

Phase 1C adds **WhatsApp messaging** to your recruitment system:
- ✅ Send screening results to candidates
- ✅ Schedule interviews via WhatsApp
- ✅ Automated reminders and follow-ups
- ✅ Candidate responses and intent detection
- ✅ Campaign management and analytics

---

## 🚀 Getting Started (5 Steps)

### Step 1: Twilio Account Setup (15 minutes)
1. Go to https://www.twilio.com
2. Create free account
3. Upgrade to paid ($20 USD typical)
4. Create WhatsApp Business Profile
5. Get account credentials (SID, Auth Token)
6. Get WhatsApp number

### Step 2: Environment Variables (5 minutes)
Add to `.env`:
```bash
TWILIO_ACCOUNT_SID=your_sid_here
TWILIO_AUTH_TOKEN=your_token_here
TWILIO_WHATSAPP_NUMBER=+1234567890
TWILIO_WEBHOOK_URL=https://your-domain.com/api/whatsapp/webhook
WHATSAPP_ENABLED=true
```

### Step 3: Install Dependencies (2 minutes)
```bash
npm install twilio
```

### Step 4: Run First Task (2 hours)
Start with Task 1.1 in the roadmap:
- [ ] Setup Twilio
- [ ] Configure credentials
- [ ] Test connection

### Step 5: Build & Deploy (Ongoing)
Follow the 3-week roadmap with 19 tasks.

---

## 📋 Key Files & Locations

### New Files to Create
```
server/
  ├─ services/
  │   ├─ WhatsAppService.js (new)
  │   ├─ InterviewScheduleService.js (new)
  │   ├─ MessageTemplateService.js (new)
  │   └─ CampaignService.js (new)
  ├─ routes/
  │   └─ whatsapp.js (new)
  └─ config/
      └─ twilio.js (new)

prisma/
  └─ schema.prisma (update)

tests/
  └─ whatsapp.test.js (new)
```

### Files to Update
```
server/routes/recruitment.js (add WhatsApp endpoints)
package.json (add twilio dependency)
.env (add Twilio credentials)
```

---

## 🔌 API Endpoints (Quick Reference)

### Send Message
```bash
POST /api/recruitment/whatsapp/send-message
{
  "candidate_id": "123",
  "message_type": "screening_result",
  "variables": { "job_title": "Senior Dev", "overall_score": 87 }
}
```

### Schedule Interview
```bash
POST /api/recruitment/whatsapp/schedule-interview
{
  "candidate_id": "123",
  "job_id": "456",
  "interview_date": "2026-01-25",
  "interview_time": "14:00"
}
```

### Receive Webhook
```bash
POST /api/recruitment/whatsapp/webhook
# (Twilio sends this automatically)
```

### Get Message History
```bash
GET /api/recruitment/whatsapp/message-history?candidate_id=123
```

### List Templates
```bash
GET /api/recruitment/whatsapp/templates
```

### Create Campaign
```bash
POST /api/recruitment/whatsapp/campaigns
{
  "campaign_name": "Strong Matches - Engineering",
  "template_id": "screening_result",
  "target_job_id": "456",
  "target_status": "strong_match"
}
```

---

## 📊 Database Changes

### New Tables
- `WhatsAppMessage` - All messages
- `InterviewSchedule` - Interview bookings
- `MessageTemplate` - Message templates
- `CampaignTracking` - Campaign metrics

### Updated Tables
- `Candidate` - Add whatsapp_phone, opt_in_messaging
- `Application` - Add interview_id, interview_date

---

## ⏱️ Timeline at a Glance

```
WEEK 1 (Jan 17-23): Foundation
  Day 1: Twilio + Config
  Day 2: WhatsAppService
  Day 3: Database
  Day 4-5: Basic endpoints
  Goal: Send/receive messages working

WEEK 2 (Jan 24-30): Features
  Day 1: Templates
  Day 2: Interview scheduling
  Day 3-4: Personalization & tracking
  Day 5: Testing
  Goal: Full feature set ready

WEEK 3 (Jan 31-Feb 7): Automation
  Day 1-2: Campaigns & workflows
  Day 3: Intent detection
  Day 4: Documentation
  Day 5: Deployment & testing
  Goal: Production live
```

---

## 💡 Key Concepts

### Message Templates
Reusable message formats with variable placeholders:
```
"Hi {{candidate_name}}, thanks for applying for {{job_title}}!
Your score: {{overall_score}}/100
Next: {{feedback}}"
```

### Interview Scheduling
Two-way WhatsApp conversation for booking:
1. System offers time slots
2. Candidate selects slot
3. Interview recorded in database
4. Reminder sent 24h before

### Campaigns
Bulk sending with personalization:
- Target candidates by criteria
- Render template with data
- Rate limit (100/hour)
- Track delivery & response

### Webhooks
Twilio notifies your system of:
- Message delivery status
- Incoming messages
- Read receipts

---

## 🔐 Security Checklist

Before going live:
- [ ] Validate Twilio request signatures
- [ ] Rate limit message sends
- [ ] Validate phone numbers
- [ ] Check opt-in status
- [ ] Log all API calls
- [ ] Handle errors gracefully
- [ ] Encrypt sensitive data
- [ ] Monitor for abuse

---

## 📈 Success Metrics

| Metric | Target |
|--------|--------|
| Message delivery rate | >95% |
| Response rate | >60% |
| Interview scheduling rate | >40% |
| API response time | <200ms |
| Webhook reliability | >99% |

---

## ❓ FAQ

**Q: How much does Twilio cost?**
A: ~$0.01 per message + $0.01 for inbound. Start with $20 credit.

**Q: Can I use WhatsApp without Twilio?**
A: Yes, but Twilio is easiest. Alternatives: MessageBird, Vonage, Meta API.

**Q: How do I test locally?**
A: Use ngrok to expose your webhook: `ngrok http 3000`

**Q: What if a message fails to send?**
A: Automatic retry with fallback. Logged in database.

**Q: Can I send media (images, PDFs)?**
A: Yes! Twilio WhatsApp supports media URLs.

**Q: How long does delivery take?**
A: Usually <2 seconds in developed markets.

**Q: What's the rate limit?**
A: Default 100 messages/hour (configurable).

---

## 🎓 Learning Resources

- [Twilio WhatsApp API Docs](https://www.twilio.com/en-us/whatsapp)
- [Twilio Node.js SDK](https://github.com/twilio/twilio-node)
- [WhatsApp Business Best Practices](https://www.whatsapp.com/business/best-practices/)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/cloud-api/message-templates)

---

## 🚀 Ready to Start?

1. **Approve this plan** ✅
2. **Setup Twilio account** (15 min)
3. **Add credentials to .env** (5 min)
4. **Follow Task 1.1** in the roadmap

**Questions?** Check the detailed PHASE_1C_ARCHITECTURE.md

**Let's build!** 🚀
