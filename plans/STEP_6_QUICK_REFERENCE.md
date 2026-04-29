# STEP 6 - QUICK REFERENCE GUIDE

**Quick Links**:
- 🔧 Detailed Tasks: STEP_6_TECHNICAL_SPECIFICATION.md
- 📅 Day-by-Day: STEP_6_SPRINT_SCHEDULE.md
- 📋 Main Plan: STEP_6_RENEWAL_ALERTS_PLAN.md
- ✅ Planning Status: STEP_6_PLANNING_COMPLETE.md

---

## 🎯 AT A GLANCE

**What**: Automated renewal alerts for property contracts  
**Why**: Prevent contract lapses, automate notifications, track renewals  
**When**: January 19-26, 2026 (8 days)  
**Who**: AI Agent  
**Where**: server/ and src/ directories  

---

## 📦 WHAT TO BUILD

### 1. Database Models (3)
```
RenewalAlert    → Tracks renewal status & notifications
RenewalTemplate → Email/SMS/WhatsApp message templates
RenewalHistory  → Historical renewal records
```

### 2. Services (3)
```
RenewalService     → Business logic for renewals
NotificationService → Multi-channel message sending
RenewalScheduler    → Automated job execution
```

### 3. API Endpoints (10)
```
GET    /api/renewals/upcoming          → List upcoming renewals
POST   /api/renewals/create            → Create alert
GET    /api/renewals/:id               → Get details
POST   /api/renewals/:id/send-reminder → Send reminder
POST   /api/renewals/:id/create-contract → Create renewal contract
POST   /api/renewals/:id/complete      → Mark complete
GET    /api/renewals/contract/:id/history → Get history
GET    /api/renewals/metrics           → Get metrics
GET    /api/renewals/templates         → Get templates
GET    /api/renewals/dashboard         → Get dashboard data
```

### 4. React Components (6)
```
RenewalDashboard    → Main view with stats and list
RenewalAlertCard    → Individual renewal card
RenewalHistoryView  → Timeline and history
RenewalForm         → Creation form
SendReminderModal   → Notification distribution
RenewalMetrics      → Analytics dashboard
```

---

## 🚀 HOW TO BUILD (PHASES)

### Phase 1: Models (Day 1)
1. Create RenewalAlert model
2. Create RenewalTemplate model
3. Create RenewalHistory model
4. Create database indexes
5. Run tests

**Files to Create**:
- `server/models/RenewalAlert.js`
- `server/models/RenewalTemplate.js`
- `server/models/RenewalHistory.js`
- `server/migrations/create-renewal-indexes.js` (optional)

### Phase 2: Services (Days 2-3)
1. Enhance RenewalService (7 methods)
2. Enhance NotificationService (5 methods)
3. Create RenewalScheduler (4 jobs)
4. Run tests

**Files to Create/Update**:
- `server/services/RenewalService.js`
- `server/services/NotificationService.js` (update)
- `server/services/RenewalScheduler.js`

### Phase 3: API (Day 4)
1. Create routes file
2. Implement 10 endpoints
3. Add validation
4. Add authorization
5. Test all endpoints

**Files to Create**:
- `server/routes/renewals.js`

### Phase 4: Frontend (Days 5-7)
1. Create RenewalDashboard
2. Create RenewalAlertCard
3. Create RenewalHistoryView
4. Create RenewalForm
5. Create SendReminderModal
6. Create RenewalMetrics
7. Run component tests

**Files to Create**:
- `src/components/RenewalDashboard.jsx`
- `src/components/RenewalDashboard.css`
- `src/components/RenewalAlertCard.jsx`
- `src/components/RenewalAlertCard.css`
- `src/components/RenewalHistoryView.jsx`
- `src/components/RenewalHistoryView.css`
- `src/components/RenewalForm.jsx`
- `src/components/RenewalForm.css`
- `src/components/SendReminderModal.jsx`
- `src/components/SendReminderModal.css`
- `src/components/RenewalMetrics.jsx`
- `src/components/RenewalMetrics.css`

### Phase 5: Integration (Days 5-7)
1. Update Contract model
2. Integrate with event system
3. Create email templates
4. Run migrations

### Phase 6: Testing (Day 7)
1. Unit tests for services
2. Integration tests for API
3. Component tests for UI
4. E2E workflow test

### Phase 7: Documentation (Day 8)
1. API reference guide
2. Component prop specs
3. User guide
4. Admin guide

---

## 🔑 KEY MODEL FIELDS

### RenewalAlert
```javascript
{
  contractId: ObjectId,           // Reference to Contract
  propertyId: ObjectId,           // Reference to Property
  buyerId: ObjectId,              // Reference to User
  sellerId: ObjectId,             // Reference to User
  agentId: ObjectId,              // Reference to Agent
  
  expiryDate: Date,               // When contract expires
  renewalWindowDays: Number,      // Days before expiry to renew
  reminderDates: [Date],          // When to send reminders
  
  status: String,                 // Pending|Notified|Renewed|Expired|Archived
  notificationsSent: [{
    channel: String,              // email|sms|whatsapp|in-app
    sentAt: Date,
    deliveryStatus: String,       // sent|delivered|failed
    retryCount: Number
  }],
  
  renewalContractId: ObjectId,    // Link to renewal contract
  completedAt: Date,              // When renewal completed
  
  createdAt: Date,
  updatedAt: Date
}
```

### RenewalTemplate
```javascript
{
  name: String,                   // "Default", "Urgent", etc.
  description: String,
  
  reminderDaysBeforeExpiry: [Number],  // [30, 14, 7, 1]
  reminderChannels: [String],     // ['email', 'sms', 'whatsapp']
  
  emailTemplate: {
    subject: String,
    body: String                  // Can include {{variables}}
  },
  smsTemplate: String,            // SMS message body
  whatsappTemplate: String,       // WhatsApp message body
  
  autoCreateRenewalContract: Boolean,
  autoRenewalTemplate: String,
  
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### RenewalHistory
```javascript
{
  contractId: ObjectId,           // Original contract
  previousContractId: ObjectId,   // Previous renewal contract
  propertyId: ObjectId,
  buyerId: ObjectId,
  
  previousExpiryDate: Date,
  newExpiryDate: Date,
  renewalDate: Date,
  
  previousTerm: Number,           // In months
  newTerm: Number,
  
  priceChange: Number,            // Increase/decrease
  termsChanges: Object,           // What changed
  
  processedByUserId: ObjectId,    // Who initiated
  signedByUserId: ObjectId,       // Who signed
  
  processDays: Number,            // How long it took
  status: String,                 // success|failed
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 💾 SERVICE METHODS QUICK REF

### RenewalService
```javascript
// Create & Retrieve
createRenewalAlert(contractId, options) → RenewalAlert
getUpcomingRenewals(days, filters) → [RenewalAlert]
getByContractId(contractId) → RenewalAlert

// Notifications
sendRenewalReminder(renewalId, channels) → {success, results}
checkAndSendReminders() → {sent, failed, count}

// Renewal Process
createRenewalContract(renewalId, options) → Contract
completeRenewal(renewalId, newContractId) → {status}

// History & Metrics
getRenewalHistory(contractId) → [RenewalHistory]
getMetrics(startDate, endDate, groupBy) → {stats}
```

### NotificationService
```javascript
// Channels
sendRenewalEmail(to, data) → {status}
sendRenewalSMS(phone, message) → {status}
sendRenewalWhatsApp(phone, message) → {status}

// App Notifications
createInAppNotification(userId, data) → Notification
getNotificationStatus(renewalId) → {status}
```

### RenewalScheduler
```javascript
// Jobs
checkDailyReminders (8 AM daily)
generateWeeklyReport (Monday 9 AM)
generateMonthlyMetrics (1st of month)
archiveCompleted (Monthly)
```

---

## 🔌 API ENDPOINT QUICK REF

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | /api/renewals/upcoming | List upcoming | ✅ |
| POST | /api/renewals/create | Create alert | ✅ |
| GET | /api/renewals/:id | Get details | ✅ |
| POST | /api/renewals/:id/send-reminder | Send alert | ✅ |
| POST | /api/renewals/:id/create-contract | New contract | ✅ |
| POST | /api/renewals/:id/complete | Mark done | ✅ |
| GET | /api/renewals/contract/:id/history | History | ✅ |
| GET | /api/renewals/metrics | Analytics | ✅ |
| GET | /api/renewals/templates | Templates | ✅ |
| GET | /api/renewals/dashboard | Dashboard | ✅ |

---

## 🎨 COMPONENT QUICK REF

| Component | Purpose | Props | State |
|-----------|---------|-------|-------|
| RenewalDashboard | Main view | filters, onRefresh | renewals, stats |
| RenewalAlertCard | Card display | renewal, onAction | expanded |
| RenewalHistoryView | Timeline | contractId | history, selected |
| RenewalForm | Create form | contractId, onSubmit | formData, errors |
| SendReminderModal | Send alert | renewalId, onClose | channels, scheduled |
| RenewalMetrics | Analytics | dateRange | metrics, charts |

---

## ✅ DAILY CHECKLIST

### Day 1 (Monday)
- [ ] Create RenewalAlert model
- [ ] Create RenewalTemplate model
- [ ] Create RenewalHistory model
- [ ] Create database indexes
- [ ] Run model tests
- [ ] **Verify**: 3 models working, all tests passing

### Day 2 (Tuesday)
- [ ] Implement RenewalService (all 7 methods)
- [ ] Implement NotificationService (all 5 methods)
- [ ] Run service tests
- [ ] **Verify**: Services working, tests passing

### Day 3 (Wednesday)
- [ ] Create RenewalScheduler with 4 jobs
- [ ] Configure job execution
- [ ] Test job processing
- [ ] **Verify**: Scheduler working, jobs executing

### Day 4 (Thursday)
- [ ] Create routes file
- [ ] Implement all 10 endpoints
- [ ] Add validation
- [ ] Test all endpoints
- [ ] **Verify**: All endpoints responding correctly

### Day 5 (Friday)
- [ ] Create RenewalDashboard + CSS
- [ ] Create RenewalAlertCard + CSS
- [ ] Test components
- [ ] **Verify**: Components render, fetch data

### Day 6 (Saturday)
- [ ] Create RenewalForm + CSS
- [ ] Create SendReminderModal + CSS
- [ ] Create RenewalHistoryView + CSS
- [ ] Test components
- [ ] **Verify**: All components working

### Day 7 (Sunday)
- [ ] Create RenewalMetrics + CSS
- [ ] Run all tests
- [ ] Fix bugs
- [ ] Optimize performance
- [ ] **Verify**: All features working, no errors

### Day 8 (Monday)
- [ ] Create documentation
- [ ] Finalize demo script
- [ ] Final testing
- [ ] **Verify**: Ready for Wednesday demo

---

## 🐛 COMMON ISSUES & FIXES

| Issue | Cause | Fix |
|-------|-------|-----|
| Models not defined | File not created | Create model file in server/models/ |
| Service error | Service not imported | Check import path in route |
| API 404 | Route not registered | Add route to server.js |
| Component not rendering | API error | Check console, verify endpoint |
| Notifications not sent | Service error | Check notification logs |
| Scheduler not running | Redis issue | Verify Redis connection |

---

## 📈 SUCCESS METRICS

### Performance
- API response < 300ms (get), < 500ms (create)
- Component render < 1 second
- Metrics dashboard < 3 seconds

### Quality
- 80%+ test coverage
- 0 console errors
- All tests passing
- No security warnings

### Functionality
- All 10 endpoints working
- All 6 components rendering
- All 3 services operational
- All 4 scheduler jobs executing

---

## 🆘 NEED HELP?

1. **Documentation**: Check STEP_6_TECHNICAL_SPECIFICATION.md
2. **Timeline**: Check STEP_6_SPRINT_SCHEDULE.md
3. **Architecture**: Check STEP_6_RENEWAL_ALERTS_PLAN.md
4. **Examples**: Look at existing code in project
5. **Testing**: Run tests to verify functionality

---

## 📞 IMPLEMENTATION STATUS

**Current Phase**: 🟢 Planning Complete  
**Next Phase**: ⏳ Phase 1 - Database Models  
**Expected Start**: January 19, 2026  
**Expected Completion**: January 26, 2026  
**Demo Date**: January 29, 2026  

---

**Ready to begin? Start with Phase 1: Database Models**
