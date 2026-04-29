# Step 6: Renewal Alerts - Technical Specification & Implementation Checklist

**Date**: January 18, 2026  
**Status**: Ready for Implementation  
**Complexity**: Medium  
**Estimated Duration**: 6-9 days  

---

## 📋 DETAILED IMPLEMENTATION CHECKLIST

### PHASE 1: Database Models (1 day)

#### RenewalAlert Model
- [ ] Create `server/models/RenewalAlert.js`
  - [ ] contractId reference
  - [ ] expiryDate field
  - [ ] renewalWindowDays setting
  - [ ] reminderDates array
  - [ ] status enum (Pending, Notified, Renewed, Expired, Archived)
  - [ ] notificationsSent tracking
  - [ ] renewalContractId reference
  - [ ] timestamps and audit fields
  - [ ] indexes for performance

- [ ] Model Methods
  - [ ] `getUpcoming()` - static method
  - [ ] `getDueForReminder()` - static method
  - [ ] `calculateReminderDates()` - instance method
  - [ ] `markNotificationSent()` - instance method
  - [ ] `completeRenewal()` - instance method

#### RenewalTemplate Model
- [ ] Create `server/models/RenewalTemplate.js`
  - [ ] name and description
  - [ ] reminderDaysBeforeExpiry array
  - [ ] reminderChannels array
  - [ ] email/SMS/WhatsApp templates
  - [ ] autoCreateRenewalContract flag
  - [ ] autoRenewalTemplate reference
  - [ ] isActive flag
  - [ ] timestamps

- [ ] Model Methods
  - [ ] `getActive()` - static method
  - [ ] `validate()` - instance method

#### RenewalHistory Model
- [ ] Create `server/models/RenewalHistory.js`
  - [ ] contractId reference
  - [ ] previousContractId reference
  - [ ] propertyId reference
  - [ ] timeline fields (expiry, renewal, new expiry)
  - [ ] term comparison (previous vs new)
  - [ ] changes tracking
  - [ ] metrics (process days, success)
  - [ ] user tracking (initiated by, signed by)

- [ ] Model Methods
  - [ ] `create()` - static factory method
  - [ ] `getByContract()` - static method
  - [ ] `getMetrics()` - static method

#### Database Indexes
- [ ] renewalAlerts: (contractId)
- [ ] renewalAlerts: (expiryDate, status)
- [ ] renewalAlerts: (propertyId, status)
- [ ] renewalAlerts: (buyerId, status)
- [ ] renewalAlerts: (createdAt)
- [ ] renewalHistory: (contractId, createdAt)
- [ ] renewalHistory: (propertyId)
- [ ] renewalTemplates: (name, isActive)

---

### PHASE 2: Backend Services (2 days)

#### RenewalService
- [ ] Create `server/services/RenewalService.js`
  
- [ ] Method: `createRenewalAlert(contractId, options)`
  - [ ] Fetch contract from database
  - [ ] Validate expiry date exists
  - [ ] Calculate reminder dates
  - [ ] Create RenewalAlert document
  - [ ] Initialize status to 'Pending'
  - [ ] Return created alert

- [ ] Method: `getUpcomingRenewals(days, filters)`
  - [ ] Query renewals expiring in next X days
  - [ ] Apply filters (property, agent, tenant, status)
  - [ ] Sort by expiry date ascending
  - [ ] Include pagination
  - [ ] Return with related contract info

- [ ] Method: `getByContractId(contractId)`
  - [ ] Find renewal alert
  - [ ] Include notification history
  - [ ] Include renewal contract if exists
  - [ ] Return complete record

- [ ] Method: `sendRenewalReminder(renewalId, channels)`
  - [ ] Fetch renewal alert
  - [ ] Validate it's due for reminder
  - [ ] Get notification template
  - [ ] Render message with contract data
  - [ ] Send via each channel
  - [ ] Log notification sent
  - [ ] Update notificationsSent array
  - [ ] Handle errors gracefully

- [ ] Method: `checkAndSendReminders()`
  - [ ] Get all Pending renewals
  - [ ] Filter those due for reminder today
  - [ ] For each renewal:
    - [ ] Send reminders via configured channels
    - [ ] Update status if all sent
    - [ ] Log activity
  - [ ] Handle failures and retry logic

- [ ] Method: `createRenewalContract(renewalId, options)`
  - [ ] Fetch renewal alert
  - [ ] Fetch original contract
  - [ ] Copy terms from original
  - [ ] Apply any modifications
  - [ ] Create new contract document
  - [ ] Link to renewal alert
  - [ ] Update renewal status to 'Notified'
  - [ ] Return new contract

- [ ] Method: `completeRenewal(renewalId, newContractId)`
  - [ ] Fetch renewal alert
  - [ ] Validate new contract exists
  - [ ] Create RenewalHistory record
  - [ ] Update renewal status to 'Renewed'
  - [ ] Set renewalSignedAt timestamp
  - [ ] Archive old contract
  - [ ] Trigger notification to user
  - [ ] Return completion confirmation

- [ ] Method: `getRenewalHistory(contractId)`
  - [ ] Find all renewals for contract
  - [ ] Sort by date descending
  - [ ] Include metrics for each
  - [ ] Include terms comparison
  - [ ] Return complete history

- [ ] Method: `getMetrics(startDate, endDate, groupBy)`
  - [ ] Count total renewals in period
  - [ ] Count successful renewals
  - [ ] Calculate success rate
  - [ ] Calculate average renewal days
  - [ ] Sum renewal revenue
  - [ ] Breakdown by channel
  - [ ] Breakdown by property/agent if requested
  - [ ] Return comprehensive metrics

- [ ] Method: `archiveRenewal(renewalId)`
  - [ ] Update status to 'Archived'
  - [ ] Move to archive collection (optional)
  - [ ] Log action
  - [ ] Return confirmation

#### NotificationService (Extend existing)
- [ ] Create/enhance `server/services/NotificationService.js`

- [ ] Method: `sendRenewalEmail(to, templateData)`
  - [ ] Render email template
  - [ ] Include renewal link
  - [ ] Send via SMTP
  - [ ] Log delivery
  - [ ] Return status

- [ ] Method: `sendRenewalSMS(phoneNumber, message)`
  - [ ] Format message
  - [ ] Send via Twilio (or similar)
  - [ ] Log delivery
  - [ ] Return status

- [ ] Method: `sendRenewalWhatsApp(phoneNumber, message)`
  - [ ] Use existing WhatsApp integration
  - [ ] Include renewal link
  - [ ] Send message
  - [ ] Log delivery
  - [ ] Return status

- [ ] Method: `createInAppNotification(userId, data)`
  - [ ] Create notification object
  - [ ] Store in database
  - [ ] Trigger WebSocket to user
  - [ ] Mark as unread
  - [ ] Return notification ID

- [ ] Method: `getNotificationStatus(renewalId)`
  - [ ] Fetch all notifications for renewal
  - [ ] Check delivery status
  - [ ] Compile summary
  - [ ] Return status

#### RenewalScheduler (Job Queue)
- [ ] Create `server/services/RenewalScheduler.js`

- [ ] Initialize Bull job queue
  - [ ] Setup Redis connection
  - [ ] Configure queue options
  - [ ] Setup error handling

- [ ] Job: `checkDailyReminders`
  - [ ] Run at 8:00 AM every day
  - [ ] Call `checkAndSendReminders()`
  - [ ] Log results
  - [ ] Handle errors with retry

- [ ] Job: `generateWeeklyReport`
  - [ ] Run every Monday at 9:00 AM
  - [ ] Calculate weekly metrics
  - [ ] Create report document
  - [ ] Send to admins
  - [ ] Store for dashboard

- [ ] Job: `generateMonthlyMetrics`
  - [ ] Run on 1st of each month
  - [ ] Calculate all metrics
  - [ ] Update analytics tables
  - [ ] Create summary report
  - [ ] Notify admin team

- [ ] Job: `archiveCompleted`
  - [ ] Run monthly
  - [ ] Find completed renewals >90 days old
  - [ ] Archive to archive collection
  - [ ] Clean up notifications
  - [ ] Compact storage

---

### PHASE 3: API Routes (1.5 days)

#### Create Routes File
- [ ] Create `server/routes/renewals.js`

#### Endpoint 1: GET /api/renewals/upcoming
- [ ] Query parameters: days, property, agent, status, page, limit
- [ ] Validation
  - [ ] days is positive number
  - [ ] page/limit are valid
  - [ ] IDs are valid ObjectIds
- [ ] Call RenewalService.getUpcomingRenewals()
- [ ] Format response
- [ ] Error handling
- [ ] Return paginated results

#### Endpoint 2: POST /api/renewals/create
- [ ] Request validation
  - [ ] contractId required
  - [ ] reminderDaysBeforeExpiry is array of numbers
  - [ ] reminderChannels has valid options
- [ ] Authorization: user must be contract party
- [ ] Call RenewalService.createRenewalAlert()
- [ ] Log creation
- [ ] Return created alert

#### Endpoint 3: GET /api/renewals/:renewalId
- [ ] Validate renewalId
- [ ] Authorization: user is contract party
- [ ] Call RenewalService.getByContractId()
- [ ] Format response with related data
- [ ] Return detailed alert

#### Endpoint 4: POST /api/renewals/:renewalId/send-reminder
- [ ] Request body: channels array
- [ ] Validate channels are supported
- [ ] Authorization: user is seller
- [ ] Call NotificationService methods
- [ ] Log notifications
- [ ] Return status for each channel

#### Endpoint 5: POST /api/renewals/:renewalId/create-contract
- [ ] Request body: renewal contract data
- [ ] Validate required fields
- [ ] Authorization: user is seller
- [ ] Call RenewalService.createRenewalContract()
- [ ] Start e-signature flow for new contract
- [ ] Return new contract details

#### Endpoint 6: POST /api/renewals/:renewalId/complete
- [ ] Request body: newContractId, notes
- [ ] Validate new contract exists
- [ ] Authorization: user is seller
- [ ] Call RenewalService.completeRenewal()
- [ ] Create history record
- [ ] Return completion confirmation

#### Endpoint 7: GET /api/renewals/contract/:contractId/history
- [ ] Validate contractId
- [ ] Call RenewalService.getRenewalHistory()
- [ ] Include all historical renewals
- [ ] Include metrics for each
- [ ] Return complete history

#### Endpoint 8: GET /api/renewals/metrics
- [ ] Query parameters: startDate, endDate, groupBy
- [ ] Validate dates
- [ ] Call RenewalService.getMetrics()
- [ ] Include breakdown by requested dimension
- [ ] Return comprehensive metrics

#### Endpoint 9: GET /api/renewals/templates
- [ ] Get all active templates
- [ ] Include channel info
- [ ] Include default reminder dates
- [ ] Authorization: any authenticated user
- [ ] Return template list

#### Endpoint 10: GET /api/renewals/dashboard
- [ ] Aggregate dashboard data
  - [ ] Expiring soon count
  - [ ] Notified today count
  - [ ] Renewed this month count
  - [ ] Expiring this month count
- [ ] Get upcoming renewals (next 30 days)
- [ ] Get recently renewed
- [ ] Get metrics summary
- [ ] Return all dashboard data

---

### PHASE 4: Frontend Components (2 days)

#### Component 1: RenewalDashboard
- [ ] File: `src/components/RenewalDashboard.jsx`
  - [ ] Stats cards section
    - [ ] Expiring soon widget
    - [ ] Notified today widget
    - [ ] Renewed this month widget
    - [ ] Expiring this month widget
  - [ ] Upcoming renewals section
    - [ ] List/table of renewals
    - [ ] Sortable by expiry date
    - [ ] Filterable by property/agent/status
    - [ ] Search functionality
    - [ ] Pagination
  - [ ] Action buttons
    - [ ] Send reminder button
    - [ ] Create contract button
    - [ ] View details link
  - [ ] Loading states
  - [ ] Error handling
  - [ ] Empty state

- [ ] File: `src/components/RenewalDashboard.css`
  - [ ] Cards styling
  - [ ] List/table styling
  - [ ] Responsive layout
  - [ ] Color-coded status badges
  - [ ] Animations and transitions

#### Component 2: RenewalAlertCard
- [ ] File: `src/components/RenewalAlertCard.jsx`
  - [ ] Property image
  - [ ] Contract/property details
  - [ ] Expiry date with countdown
  - [ ] Status badge
  - [ ] Notifications sent count
  - [ ] Action buttons (Send reminder, Create contract, Details)
  - [ ] Expandable details section
  - [ ] Tooltip for expiry countdown

- [ ] File: `src/components/RenewalAlertCard.css`
  - [ ] Card styling
  - [ ] Badge styling
  - [ ] Button styling
  - [ ] Responsive adjustments

#### Component 3: RenewalHistoryView
- [ ] File: `src/components/RenewalHistoryView.jsx`
  - [ ] Timeline visualization
  - [ ] Renewal entries with dates
  - [ ] Terms comparison (expandable)
    - [ ] Price comparison
    - [ ] Term length comparison
    - [ ] Other changes
  - [ ] Metrics for each renewal
    - [ ] Process duration
    - [ ] Days before expiry
    - [ ] Success indicator
  - [ ] Navigation between renewals
  - [ ] Filter/search functionality

- [ ] File: `src/components/RenewalHistoryView.css`
  - [ ] Timeline styling
  - [ ] Comparison table styling
  - [ ] Expandable sections styling

#### Component 4: RenewalForm
- [ ] File: `src/components/RenewalForm.jsx`
  - [ ] Select contract or create from existing
  - [ ] Choose renewal template
  - [ ] Set reminder days
  - [ ] Select reminder channels
  - [ ] Customize message (optional)
  - [ ] Preview notification messages
  - [ ] Schedule send time
  - [ ] Submit button
  - [ ] Cancel button
  - [ ] Form validation

- [ ] File: `src/components/RenewalForm.css`
  - [ ] Form layout
  - [ ] Input styling
  - [ ] Preview section styling
  - [ ] Button styling

#### Component 5: SendReminderModal
- [ ] File: `src/components/SendReminderModal.jsx`
  - [ ] Modal header
  - [ ] Channel selection checkboxes
  - [ ] Message preview area
  - [ ] Schedule options
    - [ ] Send now
    - [ ] Schedule for later (date/time picker)
  - [ ] Recipient preview
  - [ ] Confirm button
  - [ ] Cancel button
  - [ ] Loading state
  - [ ] Success/error messages

- [ ] File: `src/components/SendReminderModal.css`
  - [ ] Modal styling
  - [ ] Checkbox styling
  - [ ] Preview styling
  - [ ] Button styling

#### Component 6: RenewalMetrics
- [ ] File: `src/components/RenewalMetrics.jsx`
  - [ ] Date range selector
  - [ ] Key metrics cards
    - [ ] Success rate
    - [ ] Average renewal days
    - [ ] Total renewals
    - [ ] Renewal revenue
  - [ ] Charts
    - [ ] Success rate over time (line chart)
    - [ ] Renewal timeline (bar chart)
    - [ ] Channel effectiveness (pie chart)
    - [ ] Revenue by property (bar chart)
  - [ ] Export button
  - [ ] Filter options

- [ ] File: `src/components/RenewalMetrics.css`
  - [ ] Cards styling
  - [ ] Chart container styling
  - [ ] Responsive grid layout
  - [ ] Legend styling

---

### PHASE 5: Integration (1.5 days)

#### Contract Model Enhancement
- [ ] Add renewalAlertId reference
- [ ] Add isRenewal flag
- [ ] Add originalContractId reference

#### Event System Integration
- [ ] Create RenewalAlert when contract signed
- [ ] Trigger when reminder time comes
- [ ] Trigger when renewal completed
- [ ] Publish events for analytics

#### Email Templates
- [ ] Create renewal reminder email template
- [ ] Create renewal successful email template
- [ ] Create expiry warning email template
- [ ] Create renewal contract created email

#### Database Migrations
- [ ] Create RenewalAlert collection with indexes
- [ ] Create RenewalTemplate collection
- [ ] Create RenewalHistory collection
- [ ] Migrate existing contracts if needed
- [ ] Create default templates

---

### PHASE 6: Testing (1 day)

#### Unit Tests
- [ ] RenewalService methods
- [ ] NotificationService methods
- [ ] RenewalScheduler jobs
- [ ] API endpoint validation

#### Integration Tests
- [ ] Create alert, send reminder, complete renewal flow
- [ ] Multi-channel notification flow
- [ ] Scheduler execution and job queue
- [ ] Database operations

#### Component Tests
- [ ] RenewalDashboard rendering
- [ ] Form submission
- [ ] Modal interactions
- [ ] Chart rendering
- [ ] Responsive design

#### End-to-End Tests
- [ ] Complete renewal workflow
- [ ] Scheduler task execution
- [ ] Notification delivery
- [ ] History tracking

---

### PHASE 7: Documentation (0.5 days)

- [ ] Technical implementation guide
- [ ] API endpoint documentation
- [ ] Component prop specifications
- [ ] Testing procedures
- [ ] User guide
- [ ] Administrator guide

---

## 🎯 Key Implementation Details

### Scheduler Implementation
```javascript
// Initialize daily reminder job
const dailyJob = queue.add(
  'send-reminders',
  {},
  {
    repeat: {
      cron: '0 8 * * *' // 8 AM daily
    }
  }
);

// Process job
queue.process('send-reminders', async (job) => {
  return await RenewalService.checkAndSendReminders();
});
```

### Notification Multi-Channel
```javascript
// Send to multiple channels
const channels = ['email', 'sms', 'whatsapp'];
const results = await Promise.allSettled(
  channels.map(channel => 
    NotificationService.send(channel, data)
  )
);
```

### Error Handling Strategy
```javascript
// Resilient notification system
- Retry failed notifications (3 times, exponential backoff)
- Log all failures
- Don't block renewal creation on notification failure
- Alert admin if channel failures exceed threshold
```

---

## 📊 Data Volume Estimates

### Expected Data
- **RenewalAlerts**: ~100-500 per month (growing)
- **RenewalHistory**: Archive old completed renewals
- **RenewalTemplates**: 5-20 total (low volume)
- **Notifications sent**: 300-1000+ per month

### Storage Needs
- RenewalAlerts: ~2KB per record = 1-10 MB/month
- RenewalHistory: ~3KB per record = 1-15 MB/month
- Total: ~10-50 MB/year (manageable)

---

## ⚡ Performance Targets

### API Endpoints
- GET upcoming: < 300ms (cached if possible)
- POST create: < 500ms
- GET metrics: < 1000ms (aggregation query)

### Scheduled Jobs
- Daily reminder check: < 10 seconds for 500 renewals
- Weekly report: < 30 seconds
- Monthly metrics: < 60 seconds

### Frontend
- Dashboard load: < 2 seconds
- Component render: < 1 second
- Metric charts: < 3 seconds

---

## 🔒 Security Checklist

- [ ] Authorization on all endpoints
- [ ] Only contract parties see renewal details
- [ ] Notifications sent to verified contacts
- [ ] Sensitive data encrypted
- [ ] Audit logging for all actions
- [ ] Rate limiting on notification endpoints
- [ ] Input validation on all forms
- [ ] CSRF protection
- [ ] SQL injection prevention (using Mongoose)

---

## 📞 Support & Questions

### Questions During Implementation?
1. Check this checklist for guidance
2. Review the implementation plan
3. Check API endpoint specifications
4. Test with sample data

### Common Pitfalls to Avoid
1. Not validating expiry date format
2. Sending notifications to wrong contact
3. Not handling scheduler failures
4. Not archiving old renewals
5. Not testing multi-channel notifications
6. Not validating user permissions

---

**Status**: Ready for Implementation Start  
**Next Step**: Begin Phase 1 (Database Models)  
**Estimated Start**: January 19, 2026  
**Estimated Completion**: January 26, 2026
