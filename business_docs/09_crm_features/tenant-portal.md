# Tenant Portal — CRM Feature Specification

<!-- markdownlint-disable MD024 MD031 MD032 MD040 MD058 MD060 -->

> **Status:** 🟡 STUB — expand with @Annie (Google AI Studio, Gemini 2.0 Flash)
> **Owner:** @Annie | **Target:** 14 sections | **Module:** TenantPortal (src/components/portal/tenant/)
> **Module Owner:** Daisy (Leasing Manager AI) | **Last Updated:** May 2026 | **Priority:** High
> **API Endpoints:** `/api/leases?tenantId=:userId`, `/api/maintenance`, `/api/activities`

## 🚀 Next Step — Invoke @Annie

Copy this prompt into **Google AI Studio (Gemini 2.0 Flash)**:

```
@Annie — DRAFT: tenant-portal.md → spec all 6 tabs: TenantLeaseTab (lease details, start/end, monthly rent, status badge), TenantPaymentHistoryTab (payment records table, overdue detection, PDC status), TenantMaintenanceTab (submit request form, status tracking, contractor updates), TenantDocumentsTab (Ejari cert download, tenancy agreement PDF, NOC request button), TenantProfileTab (personal details, Emirates ID, passport expiry alert), TenantPortalHome (KPI tiles: active lease countdown, next payment due amount, open maintenance count). Include: API endpoint for each tab, authFetch pattern, error states, empty states.
```

---

## Overview

The Tenant Portal is a dedicated self-service interface for tenants to manage their tenancy lifecycle — from lease viewing and rent payments to maintenance requests and community engagement. The portal is designed for Dubai's diverse tenant population, supporting English and Arabic with a mobile-first approach.

### Priority Module Alignment (May 2026)

Tenant portal is now explicitly bound to the P0 end-to-end leasing flow:

- Entry from homepage lead conversion and agent onboarding workflow
- Continuity with tenancy/Ejari contract state
- Shared lifecycle with landlord and leasing agent for payment, maintenance, and renewal outcomes

Primary success signal: tenant can complete critical tasks without back-office intervention except for legal/approval checkpoints.

### Purpose

Provide tenants with a convenient, transparent digital experience for all tenancy-related activities, reducing the burden on property managers while increasing tenant satisfaction and retention.

### Business Value

- **Tenant Satisfaction**: Self-service access to lease info, payments, and requests
- **Operational Efficiency**: Reduce inbound calls and manual processes by 60%+
- **Faster Payments**: Online payment options improve rent collection speed
- **Maintenance Velocity**: Digital request pipeline reduces resolution time
- **Compliance**: Automated Ejari tracking ensures regulatory adherence
- **Retention**: Positive tenant experience drives lease renewals

---

## User Stories

### Tenant Perspective

- **As a** tenant, **I want to** see my lease details and payment schedule, **so that** I know exactly when and how much to pay
- **As a** tenant, **I want to** pay rent online, **so that** I don't need to deliver cheques or visit the office
- **As a** tenant, **I want to** submit maintenance requests with photos, **so that** issues get fixed quickly
- **As a** tenant, **I want to** track my maintenance request status, **so that** I know when to expect a resolution
- **As a** tenant, **I want to** download my Ejari certificate, **so that** I can use it for visa and bank applications
- **As a** tenant, **I want to** request lease renewal, **so that** I can secure my tenancy before expiry
- **As a** tenant, **I want to** see community announcements, **so that** I stay informed about building events and rules
- **As a** tenant, **I want to** book building amenities (gym, pool, BBQ area), **so that** I can plan my activities
- **As a** tenant, **I want to** communicate with my property manager, **so that** I can raise concerns and get responses
- **As a** tenant, **I want to** view my security deposit status, **so that** I know what to expect at move-out

### Property Manager Perspective

- **As a** property manager, **I want to** receive maintenance requests digitally, **so that** I can triage and assign them efficiently
- **As a** property manager, **I want to** send announcements to all tenants, **so that** I communicate important information
- **As a** property manager, **I want to** track online rent payments, **so that** I reconcile accounts faster
- **As a** property manager, **I want to** manage move-in/move-out checklists, **so that** I document unit condition

### Leasing Agent Perspective

- **As a** leasing agent, **I want to** process renewal requests through the portal, **so that** I streamline the renewal workflow
- **As a** leasing agent, **I want to** share move-in checklists digitally, **so that** tenants complete them before arrival

---

## Dashboard

### Tenant Home Screen

The dashboard provides an at-a-glance view of the tenant's tenancy status.

#### Key Information Cards

| Card            | Content                          | Visual                    |
| --------------- | -------------------------------- | ------------------------- |
| Lease Status    | Active / Expiring / Expired      | Green / Amber / Red badge |
| Next Payment    | Amount, due date, days remaining | Countdown timer           |
| Payment History | Last 3 payments with status      | Mini timeline             |
| Maintenance     | Active requests count            | Number with status dots   |
| Ejari Status    | Registered / Pending / Expired   | Status badge              |
| Messages        | Unread message count             | Notification badge        |

#### Quick Actions

- **Pay Rent**: Direct link to payment page
- **New Maintenance Request**: One-tap request creation
- **Message Manager**: Open conversation with property manager
- **Download Documents**: Quick access to lease and Ejari

---

## Lease Management

### View Contract Details

| Field                   | Displayed                 |
| ----------------------- | ------------------------- |
| Contract reference      | ✅                        |
| Property address & unit | ✅                        |
| Lease start date        | ✅                        |
| Lease end date          | ✅                        |
| Annual rent             | ✅ (AED + USD equivalent) |
| Payment frequency       | ✅ (Cheques: 1/2/4/6/12)  |
| Security deposit        | ✅ (Amount + status)      |
| Ejari number            | ✅                        |
| Landlord name           | ✅                        |
| Property manager        | ✅ (Name + contact)       |
| Special conditions      | ✅                        |
| Download lease PDF      | ✅                        |

### Renewal Requests

#### Renewal Workflow

```
Lease expiring (90 days) ──── System notification to tenant
        │
        ▼
Tenant initiates renewal request
        │
        ▼
System calculates proposed rent ──── RERA rent index check
        │
        ▼
Property manager reviews
        │
        ▼
Landlord approval (if rent change)
        │
        ▼
New lease terms presented to tenant
        │
        ▼
Tenant accepts / negotiates / declines
        │
        ▼
New contract generated ──── Ejari renewed
```

#### Renewal Features

- **Auto-notification**: System notifies tenant 90, 60, and 30 days before expiry
- **RERA index integration**: Proposed rent increase validated against RERA calculator
- **Online acceptance**: Tenant accepts new terms digitally
- **Counter-offer**: Tenant can propose alternative terms
- **Renewal history**: Track all previous renewal cycles

### Termination Notices

- **Early termination request**: Submit with reason and preferred move-out date
- **Notice period calculation**: Auto-calculate based on contract terms (typically 90 days)
- **Penalty display**: Show early termination penalty per contract
- **Move-out scheduling**: Select preferred inspection date
- **Checklist assignment**: Receive move-out checklist upon termination

---

## Payment Processing

### Online Rent Payment

#### Supported Payment Methods

| Method                | Status       | Processing Time   |
| --------------------- | ------------ | ----------------- |
| Credit/Debit Card     | ✅ Supported | Instant           |
| Bank Transfer         | ✅ Supported | 1–3 business days |
| Apple Pay             | ✅ Supported | Instant           |
| Google Pay            | ✅ Supported | Instant           |
| Direct Debit (UAEPGS) | 🔜 Planned   | Same day          |

#### Payment Features

- **Payment schedule view**: Full year calendar showing all due dates and amounts
- **Partial payment**: Pay portion of due amount (if enabled by manager)
- **Advance payment**: Pay future installments early
- **Auto-pay setup**: Recurring card payment on due date
- **Payment confirmation**: Instant receipt via email and portal
- **Payment reminders**: 7 days and 1 day before due date
- **Late payment alerts**: Notification on overdue status
- **Currency**: All payments in AED; USD equivalent displayed for reference

### Payment History

| Column    | Description                          |
| --------- | ------------------------------------ |
| Date      | Payment date                         |
| Amount    | AED amount paid                      |
| Method    | Card, bank transfer, cheque          |
| Status    | Completed, Pending, Failed, Refunded |
| Receipt   | Download PDF receipt                 |
| Reference | Transaction reference number         |

### Cheque Tracking

For tenants using post-dated cheques (PDC):

- **Cheque schedule**: List of all PDCs with deposit dates
- **Status tracking**: Not deposited, Deposited, Cleared, Bounced
- **Replacement**: Request cheque replacement for bounced cheques
- **Notification**: Alert when cheque is deposited

---

## Maintenance Requests

### Submit Request

#### Request Form Fields

| Field               | Type                                                                  | Required |
| ------------------- | --------------------------------------------------------------------- | -------- |
| Category            | Dropdown (Plumbing, Electrical, AC, Painting, Pest, Appliance, Other) | ✅       |
| Priority            | Select (Low, Medium, High, Emergency)                                 | ✅       |
| Title               | Text (max 120 chars)                                                  | ✅       |
| Description         | Textarea (max 2000 chars)                                             | ✅       |
| Photos              | Upload up to 5 images                                                 | Optional |
| Video               | Upload 1 video (max 30s)                                              | Optional |
| Preferred time slot | Date + morning/afternoon/evening                                      | Optional |
| Permission to enter | Checkbox (grant access if tenant absent)                              | ✅       |

#### Emergency Categories

The following trigger immediate escalation:

- Water leak / flooding
- Gas leak
- No electricity
- Broken lock / security issue
- AC failure (summer months: June–September)

### Track Request Status

```
┌───────────┐   ┌────────────┐   ┌──────────┐   ┌───────────┐   ┌───────────┐
│ Submitted │──▶│ In Review  │──▶│ Assigned │──▶│ In        │──▶│ Completed │
│           │   │            │   │          │   │ Progress  │   │           │
└───────────┘   └────────────┘   └──────────┘   └───────────┘   └───────────┘
                      │                                               │
                      ▼                                               ▼
                 ┌──────────┐                                   ┌──────────┐
                 │ Declined │                                   │  Rated   │
                 │ (reason) │                                   │ (1-5 ⭐) │
                 └──────────┘                                   └──────────┘
```

### Request History

- Full list of all past and current requests
- Filter by status, category, date range
- Photo evidence attached to each request
- Contractor details visible once assigned
- Resolution notes and completion photos

### Rate Resolution

After completion, tenant can:

- **Star rating**: 1–5 stars for quality of work
- **Speed rating**: 1–5 stars for response time
- **Comments**: Free-text feedback (max 500 chars)
- **Reopen**: Request follow-up if issue not fully resolved

---

## Document Access

### Available Documents

| Document                       | Auto-Generated    | Download           |
| ------------------------------ | ----------------- | ------------------ |
| Lease agreement (signed PDF)   | No                | ✅                 |
| Ejari certificate              | No                | ✅                 |
| Rent receipts                  | Yes (per payment) | ✅                 |
| Move-in checklist (signed)     | No                | ✅                 |
| Move-out checklist             | No                | ✅                 |
| Building rules & regulations   | No                | ✅                 |
| Parking permit                 | No                | ✅                 |
| Access cards/key receipt       | No                | ✅                 |
| NOC (No Objection Certificate) | No                | ✅ (if applicable) |

### Document Notifications

- New document available → Email + portal notification
- Document expiring → 30-day and 7-day reminders
- Ejari renewal required → Automated alert with instructions

---

## Communication

### Chat with Property Manager

- **Threaded conversations**: Organized by topic (maintenance, payment, general)
- **File sharing**: Attach photos, documents, screenshots
- **Read receipts**: Know when messages are seen
- **Response SLA**: Display expected response time (e.g., "Within 4 business hours")
- **Conversation history**: Full searchable archive
- **Auto-responses**: AI-powered initial responses for common queries

### Emergency Contacts

| Contact               | Availability                 |
| --------------------- | ---------------------------- |
| Property manager      | Business hours (9 AM – 6 PM) |
| Emergency maintenance | 24/7 hotline                 |
| Building security     | 24/7                         |
| Dubai Civil Defence   | 997 (fire)                   |
| Dubai Police          | 999                          |
| DEWA Emergency        | 991                          |

### Notification Channels

| Event                  | Email | SMS | Push | Portal |
| ---------------------- | ----- | --- | ---- | ------ |
| Payment due reminder   | ✅    | ✅  | ✅   | ✅     |
| Payment overdue        | ✅    | ✅  | ✅   | ✅     |
| Payment received       | ✅    | ❌  | ✅   | ✅     |
| Maintenance update     | ✅    | ❌  | ✅   | ✅     |
| Lease expiry reminder  | ✅    | ✅  | ✅   | ✅     |
| Community announcement | ❌    | ❌  | ✅   | ✅     |
| New document available | ✅    | ❌  | ✅   | ✅     |
| Message from manager   | ❌    | ❌  | ✅   | ✅     |

---

## Community Features

### Building Announcements

- **Announcement feed**: Chronological list of building-wide notices
- **Categories**: General, Maintenance schedule, Events, Rules, Emergency
- **Pinned announcements**: Important notices stay at top
- **Read tracking**: Property manager sees who has read announcements
- **Multilingual**: Announcements in English and Arabic

### Amenity Booking

| Amenity       | Booking Type      | Advance Booking | Duration |
| ------------- | ----------------- | --------------- | -------- |
| Gym           | No booking needed | N/A             | N/A      |
| Swimming pool | Time slot         | Up to 7 days    | 2 hours  |
| BBQ area      | Date reservation  | Up to 14 days   | 4 hours  |
| Party hall    | Date reservation  | Up to 30 days   | 6 hours  |
| Tennis court  | Time slot         | Up to 3 days    | 1 hour   |
| Meeting room  | Time slot         | Up to 7 days    | 2 hours  |

#### Booking Features

- Calendar view of availability
- One-tap booking with confirmation
- Cancellation up to 24 hours before
- Waitlist for fully booked slots
- Usage rules displayed before booking

---

## Ejari Registration Status

### Tracking Dashboard

| Status              | Description                                 | Tenant Action        |
| ------------------- | ------------------------------------------- | -------------------- |
| **Not Registered**  | Lease not yet registered with Ejari         | Contact manager      |
| **Pending**         | Registration submitted, awaiting processing | Wait                 |
| **Registered**      | Active Ejari registration                   | Download certificate |
| **Renewal Pending** | Lease renewed, Ejari update in progress     | Wait                 |
| **Expired**         | Ejari expired (lease ended)                 | N/A                  |
| **Cancelled**       | Ejari cancelled (early termination)         | N/A                  |

### Ejari Information Displayed

- Ejari registration number
- Registration date
- Expiry date
- Registered rent amount
- Property address (as registered)
- Link to download Ejari certificate PDF
- Reminder alerts for renewal

### Compliance Notes

- Ejari registration is mandatory per Dubai Decree No. 26 of 2013
- Required for visa processing, bank accounts, school enrollment
- Must be renewed with each new lease or renewal
- System flags unregistered active leases to compliance AI (Laila)

---

## Security Deposit Management

### Deposit Tracking

| Field               | Displayed                              |
| ------------------- | -------------------------------------- |
| Deposit amount      | ✅ (AED)                               |
| Date paid           | ✅                                     |
| Payment method      | ✅                                     |
| Receipt             | ✅ (Download)                          |
| Status              | Held / Partial refund / Fully refunded |
| Deductions (if any) | Itemized list                          |
| Refund amount       | ✅ (calculated)                        |
| Refund date         | ✅ (estimated or actual)               |

### Deposit Refund Process

```
Lease ends / Termination
        │
        ▼
Move-out inspection
        │
        ▼
Deductions calculated ──── Damages, unpaid bills, cleaning
        │
        ▼
Deduction report shared with tenant
        │
        ▼
Tenant acknowledges or disputes
        │
        ▼
Refund processed (within 30 days)
        │
        ▼
Refund receipt issued
```

### Dispute Resolution

- Tenant can dispute deductions with supporting evidence (photos)
- Property manager reviews and responds within 5 business days
- Escalation path: Manager → Senior Manager → RERA dispute resolution

---

## Move-In / Move-Out Checklist

### Move-In Checklist

| Category           | Items                                                          |
| ------------------ | -------------------------------------------------------------- |
| **Keys & Access**  | Unit keys, building access card, parking card, mailbox key     |
| **Utilities**      | DEWA connection confirmed, internet setup, gas (if applicable) |
| **Unit Condition** | Room-by-room inspection with photos                            |
| **Fixtures**       | AC units, water heaters, kitchen appliances, light fixtures    |
| **Documentation**  | Lease signed, Ejari registered, security deposit paid          |
| **Building Info**  | Rules received, emergency contacts, waste disposal info        |
| **Amenities**      | Gym access, pool access, parking allocation                    |

### Move-Out Checklist

| Category           | Items                                                           |
| ------------------ | --------------------------------------------------------------- |
| **Notice**         | Termination notice submitted, notice period confirmed           |
| **Utilities**      | DEWA final reading, internet cancellation, forwarding address   |
| **Unit Condition** | Final inspection scheduled, cleaning completed                  |
| **Keys & Access**  | All keys returned, access cards returned, parking card returned |
| **Financial**      | Outstanding payments cleared, deposit deduction reviewed        |
| **Documentation**  | Ejari cancelled, move-out form signed                           |
| **Forwarding**     | Forwarding address provided, mail forwarding set up             |

### Digital Checklist Features

- Interactive checklist with checkboxes
- Photo upload per item (before/after for move-in/out)
- Digital signature upon completion
- Both tenant and property manager must sign off
- PDF generated and stored in documents section
- Comparison view: move-in photos vs. move-out photos

---

## Acceptance Criteria

### Dashboard

- [ ] Dashboard loads within 3 seconds on mobile and desktop
- [ ] All metric cards display accurate, real-time data
- [ ] Quick actions navigate to correct pages
- [ ] Unread notification count updates in real-time (WebSocket)

### Lease Management

- [ ] Tenant can view complete lease details
- [ ] Renewal request can be submitted from the portal
- [ ] RERA calculator validates proposed rent increases
- [ ] Early termination penalty is calculated and displayed correctly
- [ ] Lease PDF downloads successfully

### Payments

- [ ] Online payment completes within 10 seconds
- [ ] Payment receipt is generated immediately after successful payment
- [ ] Payment history displays all transactions with correct status
- [ ] Auto-pay can be configured and cancelled
- [ ] Late payment notifications fire on time

### Maintenance

- [ ] Request form validates all required fields
- [ ] Photos upload successfully (up to 5 images)
- [ ] Emergency requests trigger immediate escalation
- [ ] Status updates appear within 1 minute of change
- [ ] Rating system works after request completion

### Documents

- [ ] All tenant documents are accessible and downloadable
- [ ] Ejari status is accurate and updates reflect within 24 hours
- [ ] Document expiry notifications fire at configured intervals
- [ ] New document notifications reach tenant via configured channels

### Communication

- [ ] Messages deliver within 5 seconds
- [ ] File attachments upload and display correctly
- [ ] Emergency contacts are always accessible
- [ ] Notification preferences are respected across all channels

### Security

- [ ] Tenant cannot access other tenants' data
- [ ] Session expires after 30 minutes of inactivity
- [ ] All data transmitted over HTTPS/TLS 1.3
- [ ] Payment data is PCI-DSS compliant (no card data stored)

---

## Technical Notes

### API Endpoints

| Method | Endpoint                                     | Description               |
| ------ | -------------------------------------------- | ------------------------- |
| GET    | `/api/tenant-portal/dashboard`               | Dashboard summary         |
| GET    | `/api/tenant-portal/lease`                   | Current lease details     |
| POST   | `/api/tenant-portal/lease/renewal`           | Submit renewal request    |
| POST   | `/api/tenant-portal/lease/termination`       | Submit termination        |
| GET    | `/api/tenant-portal/payments`                | Payment history           |
| POST   | `/api/tenant-portal/payments`                | Make a payment            |
| GET    | `/api/tenant-portal/payments/schedule`       | Payment schedule          |
| POST   | `/api/tenant-portal/payments/auto-pay`       | Configure auto-pay        |
| GET    | `/api/tenant-portal/maintenance`             | List maintenance requests |
| POST   | `/api/tenant-portal/maintenance`             | Submit new request        |
| PATCH  | `/api/tenant-portal/maintenance/:id/rate`    | Rate completed request    |
| GET    | `/api/tenant-portal/documents`               | List documents            |
| GET    | `/api/tenant-portal/documents/:id/download`  | Download document         |
| GET    | `/api/tenant-portal/messages`                | List conversations        |
| POST   | `/api/tenant-portal/messages`                | Send message              |
| GET    | `/api/tenant-portal/community/announcements` | Building announcements    |
| GET    | `/api/tenant-portal/community/amenities`     | Available amenities       |
| POST   | `/api/tenant-portal/community/bookings`      | Book amenity              |
| GET    | `/api/tenant-portal/ejari`                   | Ejari status              |
| GET    | `/api/tenant-portal/deposit`                 | Security deposit status   |
| GET    | `/api/tenant-portal/checklist/:type`         | Move-in/out checklist     |
| POST   | `/api/tenant-portal/checklist/:type/sign`    | Sign checklist            |

### Role-Based Access

| Feature            | Owner | Manager | Agent | Landlord | Tenant |
| ------------------ | ----- | ------- | ----- | -------- | ------ |
| View dashboard     | N/A   | N/A     | N/A   | N/A      | ✅ Own |
| View lease         | N/A   | N/A     | N/A   | N/A      | ✅ Own |
| Make payment       | N/A   | N/A     | N/A   | N/A      | ✅ Own |
| Submit maintenance | N/A   | N/A     | N/A   | N/A      | ✅ Own |
| View documents     | N/A   | N/A     | N/A   | N/A      | ✅ Own |
| Book amenities     | N/A   | N/A     | N/A   | N/A      | ✅     |
| Send messages      | N/A   | N/A     | ✅    | N/A      | ✅     |

> Internal roles manage tenant data through the main CRM interface. Landlords see tenant info through the landlord portal.

### AI Integration

- **Daisy (Leasing Manager)**: Manages renewal workflows and lease document generation
- **Laila (Compliance)**: Monitors Ejari registration and flags non-compliant leases
- **Noor (Client Relations)**: Handles automated tenant communications and reminders
- **Khalid (Maintenance)**: Triages maintenance requests and assigns contractors

### Payment Security

- PCI-DSS Level 1 compliant payment processing
- No card data stored on White Caves servers
- Tokenized card storage via payment gateway
- 3D Secure authentication for card payments
- Transaction encryption (TLS 1.3)

### Mobile-First Design

- **Responsive breakpoints**: 320px, 768px, 1024px, 1440px
- **Touch targets**: Minimum 44px × 44px
- **Progressive Web App**: Installable, push notifications, offline caching
- **Dark mode**: Supported via system preference detection
- **RTL support**: Arabic language right-to-left layout

---

## Dependencies

- Payment gateway (Stripe / Checkout.com / Network International)
- RERA rent index API (rent increase validation)
- Cloud storage (documents and photos)
- SMS gateway (Twilio / MessageBird)
- Push notification service (Firebase Cloud Messaging)
- WebSocket server (real-time updates)
- Email delivery (SendGrid / AWS SES)

---

## Future Enhancements

- In-app video calling with property manager
- AI chatbot for common tenant queries (powered by White Caves AI)
- Smart home integration (AC, lights, locks via IoT)
- Tenant insurance marketplace
- Community social features (neighbor directory, events RSVP)
- Multi-language support (Hindi, Urdu, Mandarin, Tagalog)
- Automated DEWA bill tracking and payment
