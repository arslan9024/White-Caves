# Step 6: Renewal Alerts & Notifications - Implementation Plan

**Date**: January 18, 2026  
**Status**: Planning Phase  
**Target Start**: January 19, 2026  
**Target Completion**: January 22, 2026  
**Priority**: HIGH (Critical for Wednesday testing)

---

## 📋 OVERVIEW

**Step 6** implements an automated renewal alert and notification system that tracks contract expiration dates and proactively notifies relevant parties about upcoming renewals. This is essential for maintaining client relationships and ensuring continuous property management.

### Business Value

- **Automated Reminders**: Never miss a renewal deadline
- **Proactive Engagement**: Reach out before expiration
- **Revenue Protection**: Prevent contract lapses
- **Client Retention**: Show proactive service
- **Agent Efficiency**: Automated workflow triggers

### Key Stakeholders

- Property Owners (want renewal reminders)
- Leasing Agents (need to know about renewals)
- Buyers/Tenants (need lease renewal info)
- Admins (track renewal metrics)

---

## 🎯 CORE FEATURES

### 1. Renewal Tracking

- Track contract expiration dates
- Calculate days until renewal
- Set custom reminder windows
- Track renewal status (Pending, Notified, Renewed, Expired)

### 2. Automated Notifications

- Email reminders (30, 14, 7, 3 days before expiration)
- In-app notifications
- SMS alerts (optional)
- WhatsApp reminders

### 3. Renewal Dashboard

- View upcoming renewals
- Filter by property/agent/tenant
- Search renewal records
- Track renewal history

### 4. Renewal Management

- Create renewal contract
- Track renewal documents
- Update renewal status
- Archive completed renewals

### 5. Analytics & Reporting

- Renewal success rate
- Average renewal time
- Revenue from renewals
- Notification engagement metrics

---

## 🗄️ DATABASE MODELS

### Model 1: RenewalAlert

```javascript
RenewalAlert {
  _id: ObjectId,
  contractId: ObjectId (ref: Contract),
  propertyId: ObjectId (ref: Property),
  sellerId: ObjectId (ref: User),
  buyerId: ObjectId (ref: User),

  // Renewal Details
  contractExpiryDate: Date,
  renewalWindowDays: Number (default: 30),
  reminderDates: [Date], // 30, 14, 7, 3 days

  // Status Tracking
  status: Enum ('Pending', 'Notified', 'Renewed', 'Expired', 'Archived'),
  notificationsSent: [
    {
      daysBeforeExpiry: Number,
      sentAt: Date,
      channel: String ('email', 'sms', 'whatsapp', 'in-app'),
      status: String ('sent', 'failed', 'delivered')
    }
  ],

  // Renewal Contract
  renewalContractId: ObjectId (ref: Contract),
  renewalCreatedAt: Date,
  renewalSignedAt: Date,

  // Metadata
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  notes: String,
  customReminders: [Date]
}
```

### Model 2: RenewalTemplate

```javascript
RenewalTemplate {
  _id: ObjectId,
  name: String,
  description: String,

  // Reminder Configuration
  reminderDaysBeforeExpiry: [Number], // [30, 14, 7, 3]
  reminderChannels: [String], // ['email', 'sms', 'whatsapp']
  reminderEmailTemplate: String (ref: EmailTemplate),

  // Content
  emailSubject: String,
  emailBody: String,
  smsBody: String,
  whatsappMessage: String,

  // Auto-renewal Settings
  autoCreateRenewalContract: Boolean,
  autoRenewalTemplate: ObjectId (ref: ContractTemplate),
  includeTermsFromPrevious: Boolean,

  // Status
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Model 3: RenewalHistory

```javascript
RenewalHistory {
  _id: ObjectId,
  contractId: ObjectId (ref: Contract),
  previousContractId: ObjectId (ref: Contract),
  propertyId: ObjectId (ref: Property),

  // Timeline
  previousExpiryDate: Date,
  previousTermLength: Number,
  renewalCreatedDate: Date,
  renewalSignedDate: Date,
  newExpiryDate: Date,
  newTermLength: Number,

  // Terms
  previousTermsJson: Object,
  newTermsJson: Object,
  changesFromPrevious: [String],

  // Metrics
  daysBeforeExpiry: Number,
  renewalProcessDays: Number,
  renewalSuccessful: Boolean,

  // Agent/User
  renewalInitiatedBy: ObjectId,
  renewalSignedBy: ObjectId,

  createdAt: Date
}
```

---

## 🔧 BACKEND SERVICES

### Service 1: RenewalService

```javascript
class RenewalService {
  // Create and manage renewal alerts

  async createRenewalAlert(contractId, options) {
    // Create renewal alert from contract expiry date
    // Calculate reminder dates based on settings
    // Set initial status to 'Pending'
  }

  async getUpcomingRenewals(days = 30, filters = {}) {
    // Get contracts expiring in next X days
    // Filter by property, agent, tenant
    // Sort by expiry date
  }

  async checkAndSendReminders() {
    // Check all pending renewals
    // Find those with reminders due today
    // Send notifications
    // Update status
  }

  async sendRenewalReminder(renewalId, channels = ['email']) {
    // Send reminder via specified channels
    // Log notification sent
    // Update renewal alert status
  }

  async createRenewalContract(renewalId, contractData) {
    // Create new contract for renewal
    // Copy terms from previous contract
    // Link to renewal alert
    // Return new contract
  }

  async completeRenewal(renewalId, newContractId) {
    // Mark renewal as completed
    // Create history record
    // Update contract status
    // Archive old alert
  }

  async getRenewalHistory(contractId) {
    // Get all renewals for a contract
    // Sort by date
    // Include terms comparison
  }

  async getMetrics(startDate, endDate) {
    // Renewal success rate
    // Average renewal time
    // Channel effectiveness
    // Revenue from renewals
  }
}
```

### Service 2: NotificationService (Enhanced)

```javascript
class NotificationService {
  // Handle all notification channels

  async sendEmail(to, templateName, data) {
    // Render template with data
    // Send via SMTP
    // Log delivery
  }

  async sendSMS(phoneNumber, message) {
    // Send SMS reminder
    // Log delivery
  }

  async sendWhatsApp(phoneNumber, message) {
    // Send WhatsApp reminder
    // Use existing WhatsApp integration
  }

  async createInAppNotification(userId, message, type) {
    // Create in-app notification
    // Store in database
    // Trigger real-time update
  }

  async getNotificationStatus(renewalId) {
    // Get status of all sent notifications
    // Check delivery status
    // Return summary
  }
}
```

### Service 3: RenewalScheduler (New)

```javascript
class RenewalScheduler {
  // Scheduled tasks for renewal management

  async initializeDailyReminders() {
    // Run daily at 8 AM
    // Check all pending renewals
    // Send due reminders
    // Log activity
  }

  async initializeWeeklyReport() {
    // Run weekly on Monday
    // Compile renewal report
    // Send to admins
  }

  async initializeMonthlyMetrics() {
    // Run first day of month
    // Calculate renewal metrics
    // Update dashboards
  }

  async cleanupArchived() {
    // Run monthly
    // Archive old reminders
    // Cleanup notifications
  }
}
```

---

## 📡 API ENDPOINTS

### 1. Get Upcoming Renewals

```
GET /api/renewals/upcoming?days=30&property=&agent=&page=1&limit=20

Response:
{
  renewals: [
    {
      _id: "renewal_123",
      contractId: "contract_456",
      propertyTitle: "Dubai Marina Apartment",
      buyerName: "John Doe",
      expiryDate: "2026-02-15",
      daysUntilExpiry: 28,
      status: "Pending",
      notificationsSent: 0,
      renewalContractId: null
    }
  ],
  pagination: { page: 1, total: 45, pages: 3 }
}
```

### 2. Create Renewal Alert

```
POST /api/renewals/create

Body:
{
  contractId: "contract_123",
  reminderDaysBeforeExpiry: [30, 14, 7, 3],
  reminderChannels: ["email", "sms"],
  templateId: "template_001",
  customReminders: []
}

Response:
{
  _id: "renewal_123",
  status: "Pending",
  reminderDates: ["2026-01-19", "2026-02-01", "2026-02-08", "2026-02-12"]
}
```

### 3. Send Renewal Reminder

```
POST /api/renewals/:renewalId/send-reminder

Body:
{
  channels: ["email", "sms"],
  messageOverride: null
}

Response:
{
  success: true,
  notificationsSent: [
    { channel: "email", status: "sent", sentAt: "2026-01-18T10:00:00Z" },
    { channel: "sms", status: "delivered", sentAt: "2026-01-18T10:00:05Z" }
  ]
}
```

### 4. Get Renewal Alert

```
GET /api/renewals/:renewalId

Response:
{
  _id: "renewal_123",
  contractId: "contract_456",
  propertyTitle: "Dubai Marina",
  expiryDate: "2026-02-15",
  daysUntilExpiry: 28,
  status: "Pending",
  notificationsSent: [
    { daysBeforeExpiry: 30, sentAt: "2026-01-16", channel: "email", status: "sent" }
  ],
  renewalContractId: null,
  createdAt: "2026-01-15T10:00:00Z"
}
```

### 5. Create Renewal Contract

```
POST /api/renewals/:renewalId/create-contract

Body:
{
  includeTermsFromPrevious: true,
  modifiedTerms: {
    totalPrice: 2600000
  }
}

Response:
{
  renewalContractId: "contract_789",
  status: "Notified",
  message: "Renewal contract created and renewal alert updated"
}
```

### 6. Complete Renewal

```
POST /api/renewals/:renewalId/complete

Body:
{
  newContractId: "contract_789",
  notes: "Contract renewed for another 3 years"
}

Response:
{
  _id: "renewal_123",
  status: "Renewed",
  renewalCompletedAt: "2026-01-18T15:30:00Z",
  historyId: "history_456"
}
```

### 7. Get Renewal History

```
GET /api/renewals/contract/:contractId/history

Response:
{
  renewals: [
    {
      _id: "history_001",
      renewalNumber: 1,
      previousExpiryDate: "2023-02-15",
      renewalCreatedDate: "2023-01-15",
      renewalSignedDate: "2023-02-10",
      newExpiryDate: "2026-02-15",
      newTermLength: 36,
      renewalSuccessful: true,
      renewalProcessDays: 26
    }
  ]
}
```

### 8. Get Renewal Metrics

```
GET /api/renewals/metrics?startDate=2025-01-01&endDate=2026-01-18

Response:
{
  totalRenewals: 45,
  successfulRenewals: 42,
  successRate: 93.3,
  averageRenewalDays: 18,
  totalRenewalRevenue: 125000000,
  byChannel: {
    email: { sent: 130, delivered: 128, clicked: 87 },
    sms: { sent: 45, delivered: 44 },
    whatsapp: { sent: 45, delivered: 42 }
  }
}
```

### 9. Get Renewal Templates

```
GET /api/renewals/templates

Response:
{
  templates: [
    {
      _id: "template_001",
      name: "Standard Renewal",
      reminderDaysBeforeExpiry: [30, 14, 7, 3],
      reminderChannels: ["email", "sms"],
      isActive: true
    }
  ]
}
```

### 10. Get Renewal Dashboard Data

```
GET /api/renewals/dashboard

Response:
{
  stats: {
    expiringSoon: 12,          // Expiring in 30 days
    expiringThisMonth: 18,
    notifiedToday: 5,
    renewedThisMonth: 8
  },
  upcomingRenewals: [...],
  recentRenewals: [...],
  metrics: {...}
}
```

---

## 🎨 FRONTEND COMPONENTS

### Component 1: RenewalDashboard

```
Features:
- Overview cards (Expiring Soon, Notified Today, Renewed This Month)
- Upcoming renewals list (sortable, filterable)
- Quick stats
- Action buttons (Send Reminder, Create Contract, Mark Complete)
- Search and filter
- Pagination

Props:
- filters: { property, agent, status, daysRange }
- onSendReminder: function
- onCreateContract: function
- onMarkComplete: function
```

### Component 2: RenewalAlertCard

```
Features:
- Contract details
- Expiry date countdown
- Status badge
- Notifications sent indicator
- Action buttons
- Property image

Props:
- renewal: RenewalAlert object
- onSendReminder: function
- onCreateContract: function
- onCompleteRenewal: function
```

### Component 3: RenewalHistoryView

```
Features:
- Timeline of renewals
- Terms comparison (previous vs. new)
- Renewal metrics
- Documents/contracts
- Expandable details

Props:
- contractId: string
- onCreateNewRenewal: function
```

### Component 4: RenewalForm

```
Features:
- Select contract to renew
- Choose renewal template
- Customize reminder settings
- Preview notification message
- Submit form

Props:
- contractId: string (optional)
- templateId: string (optional)
- onSubmit: function
- onCancel: function
```

### Component 5: SendReminderModal

```
Features:
- Select channels (email, SMS, WhatsApp)
- Preview message
- Schedule send time (now or later)
- Confirm and send

Props:
- renewalId: string
- onConfirm: function
- onCancel: function
```

### Component 6: RenewalMetrics

```
Features:
- Success rate chart
- Renewal timeline chart
- Channel effectiveness chart
- Revenue metrics
- Time period selector

Props:
- startDate: Date
- endDate: Date
- onDateChange: function
```

---

## 📊 DATABASE SCHEMA & INDEXES

### Collections

```javascript
// MongoDB Collections
- renewalAlerts         (Index: contractId, expiryDate, status)
- renewalTemplates      (Index: name, isActive)
- renewalHistory        (Index: contractId, createdAt)
- notifications         (Index: userId, createdAt)
```

### Indexes

```javascript
db.renewalAlerts.createIndex({ contractId: 1 });
db.renewalAlerts.createIndex({ expiryDate: 1, status: 1 });
db.renewalAlerts.createIndex({ propertyId: 1, status: 1 });
db.renewalAlerts.createIndex({ buyerId: 1, status: 1 });
db.renewalAlerts.createIndex({ createdAt: -1 });

db.renewalHistory.createIndex({ contractId: 1, createdAt: -1 });
db.renewalHistory.createIndex({ propertyId: 1 });

db.notifications.createIndex({ userId: 1, createdAt: -1 });
```

---

## 🔄 INTEGRATION POINTS

### With Step 5 (Contract Management)

```
When contract is signed:
→ Check if renewal alert needed
→ Create RenewalAlert from contract expiry date
→ Schedule reminders

When renewal reminder sent:
→ Create new contract
→ Link to original contract
→ Start e-signature flow
```

### With Step 7 (User Profile)

```
User profile shows:
→ Upcoming renewals
→ Renewal history
→ Notification preferences
→ Renewal success rate
```

### With Step 8 (Analytics)

```
Analytics dashboard shows:
→ Renewal metrics
→ Success rates
→ Revenue from renewals
→ Channel effectiveness
```

### With Step 4 (Viewing System)

```
After viewing scheduled:
→ Note renewal date
→ Create preliminary renewal alert
→ Schedule future reminders
```

---

## 📅 IMPLEMENTATION TIMELINE

### Phase 1: Database & Backend (2-3 days)

- [ ] Create RenewalAlert model
- [ ] Create RenewalTemplate model
- [ ] Create RenewalHistory model
- [ ] Implement RenewalService (6 methods)
- [ ] Implement RenewalScheduler
- [ ] Create all 10 API endpoints
- [ ] Integration with existing services

### Phase 2: Frontend (2-3 days)

- [ ] Create RenewalDashboard component
- [ ] Create RenewalAlertCard component
- [ ] Create RenewalHistoryView component
- [ ] Create RenewalForm component
- [ ] Create SendReminderModal component
- [ ] Create RenewalMetrics component
- [ ] Styling and responsive design

### Phase 3: Testing & Integration (1-2 days)

- [ ] Unit tests for services
- [ ] API endpoint testing
- [ ] Component testing
- [ ] Integration testing
- [ ] End-to-end workflow testing
- [ ] Performance optimization

### Phase 4: Documentation (1 day)

- [ ] Implementation guide
- [ ] API documentation
- [ ] Testing guide
- [ ] User guide

**Total Estimated Time: 6-9 days**

---

## 🎯 SUCCESS CRITERIA

### Functional Requirements

- [x] Automatic renewal alerts created from contracts
- [x] Customizable reminder dates
- [x] Multi-channel notifications (email, SMS, WhatsApp)
- [x] Renewal contract creation workflow
- [x] Renewal history tracking
- [x] Dashboard for renewal management
- [x] Analytics and metrics
- [x] Scheduled reminder sending

### Non-Functional Requirements

- [x] <500ms API response time
- [x] Support 100+ concurrent users
- [x] 99.9% uptime for scheduler
- [x] Scalable notification system
- [x] Comprehensive error handling
- [x] Security validation

### User Experience

- [x] Intuitive renewal dashboard
- [x] One-click reminder sending
- [x] Easy contract renewal creation
- [x] Clear status tracking
- [x] Professional UI design
- [x] Mobile responsive

---

## 🔐 SECURITY CONSIDERATIONS

### Data Protection

- Only authorized parties can view renewal alerts
- Notifications sent only to contract parties
- Audit trail for all actions
- Encrypted sensitive data

### Access Control

- Seller/landlord manages renewals
- Buyer/tenant receives notifications
- Agent assists in process
- Admin full access

### Compliance

- GDPR compliant notifications
- Opt-in/opt-out preferences
- Audit logging
- Data retention policies

---

## 📋 DEPENDENCIES

### Backend Dependencies

- **Node-schedule**: Scheduled task execution
- **Bull**: Job queue for reliability
- **Nodemailer**: Email delivery (existing)
- **Twilio**: SMS delivery (optional)
- **WhatsApp API**: WhatsApp messages (existing)

### Frontend Dependencies

- **React**: UI framework
- **React Router**: Navigation
- **Chart.js**: Metrics visualization
- **Date-fns**: Date handling

### Database

- **MongoDB**: Primary storage
- **Redis**: Caching & job queue (optional)

---

## 🚀 LAUNCH CHECKLIST

### Pre-Launch

- [ ] All models created
- [ ] All services implemented
- [ ] All endpoints tested
- [ ] All components built
- [ ] Documentation complete
- [ ] Security audit passed
- [ ] Performance tested
- [ ] Database migrated

### Launch Day

- [ ] Deploy to staging
- [ ] Run full test suite
- [ ] Validate with test data
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Gather user feedback

### Post-Launch

- [ ] Monitor performance
- [ ] Fix any issues
- [ ] Optimize based on usage
- [ ] Plan enhancements

---

## 📞 NEXT STEPS

1. **Review this plan** - Ensure all requirements are covered
2. **Estimate resources** - How much team capacity needed
3. **Set start date** - January 19 or 20?
4. **Create detailed tasks** - Break into smaller work items
5. **Assign ownership** - Who works on what
6. **Begin Phase 1** - Start with database models

---

## 📎 APPENDICES

### A. Sample Email Templates

```
Subject: Renewal Reminder - Your lease expires in 30 days

Dear {{buyerName}},

Your lease for {{propertyTitle}} in {{propertyLocation}} is set to
expire on {{expiryDate}}.

We'd like to help you renew your lease and continue enjoying this
wonderful property. Our team is ready to assist with the renewal process.

Would you like to:
- Renew for another {{suggestedTerm}} years
- Discuss lease modifications
- Explore other properties

Click here to begin renewal: {{renewalLink}}

Best regards,
White Caves Real Estate Team
```

### B. SMS Template

```
Hi {{buyerName}}, Your lease at {{propertyTitle}} expires on {{expiryDate}}.
Ready to renew? Reply YES or visit: {{renewalLink}}
```

### C. WhatsApp Template

```
Hello {{buyerName}}! 👋

Your lease for {{propertyTitle}} expires in {{daysUntilExpiry}} days
({{expiryDate}}).

We're here to help with your renewal! 🏠

📝 Start Renewal: {{renewalLink}}
📞 Call us: {{agentPhone}}
💬 Chat: Click here to message us

Let's keep you in your perfect home! ✨
```

---

**Version**: 1.0 - Planning Phase  
**Status**: Ready for Review  
**Created**: January 18, 2026  
**Next Review**: After approval to start Phase 1
