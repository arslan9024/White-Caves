# Landlord Portal — CRM Feature Specification

> **Status:** Planned  
> **Module Owner:** Omar (Financial Advisor AI)  
> **Last Updated:** April 2026  
> **Priority:** High  
> **API Endpoints:** `/api/landlord-portal`, `/api/landlord/properties`, `/api/landlord/financials`

---

## Overview

The Landlord Portal provides property owners with a dedicated, self-service interface to manage their real estate portfolio, track rental income, monitor tenant status, and communicate with their property management team. The portal is designed as a secure, role-restricted view into the White Caves CRM with mobile-responsive access.

### Priority Module Alignment (May 2026)

The landlord portal is a mandatory pillar of the P0 leasing journey:

- Input from homepage-originated leasing leads after conversion to active leases
- Real-time visibility into contract, Ejari, payment, and maintenance states
- Approval checkpoints (offers, high-cost maintenance, renewal terms)

The landlord experience must remain continuity-safe with tenant and leasing-agent workflows (no orphan state transitions).

### Purpose

Empower landlords with real-time visibility into their property portfolio, financial performance, and tenant management — reducing the need for manual reporting and phone calls to property managers.

### Business Value

- **Transparency**: Landlords see real-time status of their properties, tenants, and income
- **Reduced Overhead**: Self-service access eliminates frequent status-update calls
- **Retention**: Professional portal experience builds landlord trust and loyalty
- **Compliance**: Centralized document management ensures Ejari and NOC availability
- **Financial Clarity**: Automated reporting provides ROI, expense, and income analysis

---

## User Stories

### Landlord Perspective

- **As a** landlord, **I want to** see a dashboard of all my properties, **so that** I understand my portfolio status at a glance
- **As a** landlord, **I want to** view rental income and expense breakdowns, **so that** I can track my investment returns
- **As a** landlord, **I want to** see which tenants occupy each unit, **so that** I know my occupancy status
- **As a** landlord, **I want to** download Ejari certificates and contracts, **so that** I have documents for bank or visa requirements
- **As a** landlord, **I want to** track maintenance requests on my properties, **so that** I ensure my assets are maintained
- **As a** landlord, **I want to** communicate with my property manager via the portal, **so that** I have a record of all communications
- **As a** landlord, **I want to** receive notifications about lease renewals, **so that** I can plan ahead
- **As a** landlord, **I want to** approve or decline tenant applications, **so that** I have control over who rents my property
- **As a** landlord, **I want to** view my portfolio on mobile, **so that** I can check status while traveling

### Property Manager (Agent) Perspective

- **As a** property manager, **I want to** share financial reports with landlords, **so that** I maintain transparency
- **As a** property manager, **I want to** notify landlords about maintenance needs, **so that** I get approvals quickly
- **As a** property manager, **I want to** upload documents visible to the landlord, **so that** they have self-service access
- **As a** property manager, **I want to** restrict which properties a landlord can see, **so that** data stays private

### Manager Perspective

- **As a** manager, **I want to** see landlord satisfaction metrics, **so that** I can address issues proactively
- **As a** manager, **I want to** audit portal access logs, **so that** I ensure security compliance

---

## Dashboard

### Portfolio Overview

The landing page displays a summary of the landlord's entire property portfolio.

#### Key Metrics Cards

| Metric               | Description                    | Format                      |
| -------------------- | ------------------------------ | --------------------------- |
| Total Properties     | Count of owned properties      | Number                      |
| Occupied Units       | Units with active tenants      | Number + percentage         |
| Vacant Units         | Units without tenants          | Number (highlighted if > 0) |
| Total Monthly Income | Sum of active rents            | AED / USD toggle            |
| Pending Payments     | Overdue rent amounts           | AED (red highlight)         |
| Active Maintenance   | Open maintenance requests      | Number                      |
| Upcoming Renewals    | Leases expiring in 90 days     | Number                      |
| Portfolio Value      | Estimated total property value | AED / USD toggle            |

#### Visual Components

- **Occupancy donut chart**: Occupied vs. vacant vs. under maintenance
- **Income trend line chart**: Monthly rental income (12-month rolling)
- **Property map**: Google Maps with pins for all owned properties
- **Recent activity feed**: Last 20 actions (payments, requests, messages)

---

## Property Portfolio Management

### Property List View

- Sortable and filterable table of all landlord's properties
- Columns: Property name, unit, type, status, tenant, rent, lease expiry
- Color-coded status badges (Occupied, Vacant, Under Maintenance, Listed)
- Quick-action buttons: View details, Download contract, Message manager

### Property Detail View

Each property shows:

- **Property details**: Type, area, bedrooms, bathrooms, amenities, photos
- **Current tenant**: Name, lease start/end, rent amount, payment status
- **Financial summary**: Total income YTD, expenses YTD, net income
- **Maintenance history**: All requests with status and cost
- **Documents**: Lease, Ejari, title deed, NOC, photos
- **Listing status**: If vacant — syndication status across portals
- **Valuation**: Current estimated market value and price per sq ft

### Vacancy Management

- **Vacant property alerts**: Notification when unit becomes vacant
- **Listing approval**: Landlord approves listing price and marketing terms
- **Viewing schedule**: See upcoming property viewings
- **Application pipeline**: View tenant applications with status

---

## Tenant Management

### Tenant Overview

Landlords can view (but not directly modify) tenant information.

| Field              | Visibility                |
| ------------------ | ------------------------- |
| Tenant name        | ✅ Visible                |
| Contact details    | ✅ Visible (phone, email) |
| Nationality        | ✅ Visible                |
| Lease start/end    | ✅ Visible                |
| Rent amount        | ✅ Visible                |
| Payment method     | ✅ Visible                |
| Number of cheques  | ✅ Visible                |
| KYC documents      | ❌ Not visible (privacy)  |
| Emirates ID number | ❌ Not visible (privacy)  |
| Employment details | ❌ Not visible (privacy)  |

### Lease Status Tracking

- **Active leases**: Current lease terms, rent, and expiry
- **Renewal status**: Pending, Accepted, Declined, Expired
- **Rent increases**: Proposed increase (per RERA calculator), landlord approval required
- **Early termination**: Penalty calculations per contract terms
- **Lease history**: Previous tenants with lease periods and rent amounts

### Payment History

- **Payment timeline**: All rent payments with dates and amounts
- **Payment status**: Paid, Pending, Overdue, Bounced
- **Cheque tracking**: Cheque numbers, bank, deposit date, clearance status
- **PDC schedule**: Post-dated cheque deposit schedule
- **Export**: Download payment history as CSV/PDF

---

## Financial Reports

### Income Summary

- **Gross rental income**: Monthly/quarterly/annual breakdown
- **Net income**: After management fees, maintenance, and other deductions
- **Income by property**: Contribution of each unit to total income
- **Payment collection rate**: Percentage of rent collected on time
- **Currency display**: AED primary, USD secondary (toggle)

### Expense Tracking

| Expense Category      | Examples                             |
| --------------------- | ------------------------------------ |
| Maintenance & Repairs | Plumbing, AC, painting, pest control |
| Service Charges       | Annual building service charges      |
| Management Fees       | Property management commission       |
| Insurance             | Building/unit insurance              |
| DEWA Deposits         | Utility deposits for vacant units    |
| Registration Fees     | Ejari, DLD, tawtheeq                 |
| Marketing Costs       | Portal listing fees, photography     |

### ROI Analysis

- **Annual ROI**: (Net Income / Property Value) × 100
- **Capital appreciation**: Year-over-year property value change
- **Total return**: Income yield + capital appreciation
- **Comparison**: ROI across portfolio properties
- **Benchmark**: Compare against Dubai market average yields

### Tax Documents

- **Annual income statement**: Total rental income for tax reporting
- **Expense summary**: Deductible expenses categorized
- **Export formats**: PDF, Excel
- **Multi-year comparison**: Side-by-side annual financials

---

## Maintenance Request Tracking

### Request Visibility

Landlords can view all maintenance requests for their properties.

| Field               | Landlord Action   |
| ------------------- | ----------------- |
| Request description | View              |
| Photos/videos       | View              |
| Priority            | View              |
| Status              | View              |
| Assigned contractor | View              |
| Estimated cost      | Approve / Decline |
| Actual cost         | View              |
| Completion date     | View              |
| Tenant rating       | View              |

### Approval Workflow

```
Tenant submits request
        │
        ▼
Property manager reviews
        │
        ▼
Cost estimate prepared
        │
        ▼
Landlord notification ──── If cost > threshold ──── Landlord approval required
        │                                                    │
        ▼                                                    ▼
Auto-approved (below threshold)              Approve / Decline / Negotiate
        │                                                    │
        ▼                                                    ▼
Work scheduled                              Work scheduled (if approved)
        │
        ▼
Completed & invoiced
```

### Configurable Thresholds

- **Auto-approve limit**: Landlord sets maximum cost for auto-approval (default: AED 500)
- **Emergency bypass**: Emergency maintenance (AC, plumbing leak, lock) proceeds without approval
- **Category rules**: Different thresholds per maintenance category

---

## Document Management

### Document Categories

| Category    | Documents                                        | Auto-Generated |
| ----------- | ------------------------------------------------ | -------------- |
| Contracts   | Lease agreements, addendums, termination notices | Some           |
| Regulatory  | Ejari certificates, DLD receipts, NOCs           | No             |
| Financial   | Invoices, receipts, statements                   | Yes            |
| Property    | Title deed, floor plans, photos, valuations      | No             |
| Insurance   | Insurance policies, claims                       | No             |
| Maintenance | Work orders, invoices, completion certificates   | Some           |

### Document Features

- **Secure storage**: Encrypted at rest, access-controlled
- **Upload**: Property manager uploads documents visible to landlord
- **Download**: Landlord can download any document as PDF
- **Expiry alerts**: Notifications for expiring documents (Ejari, insurance, trade license)
- **Version history**: Track document updates (e.g., amended lease)
- **Digital signatures**: E-signature support for lease agreements and NOCs
- **Bulk download**: Download all documents as ZIP archive

### Ejari Certificate Tracking

- Registration status: Pending, Registered, Renewed, Cancelled
- Ejari number and registration date
- Expiry date with renewal reminders
- Download Ejari certificate PDF
- Link to RERA-compliant lease contract

---

## Communication

### Messaging System

- **In-portal messaging**: Threaded conversations with property manager
- **Message types**: Text, file attachments, images
- **Read receipts**: Track when messages are read
- **Message history**: Complete conversation archive
- **Search**: Full-text search within messages

### Notification System

| Event                          | Channel Options          |
| ------------------------------ | ------------------------ |
| Rent payment received          | Email, SMS, Push, Portal |
| Payment overdue                | Email, SMS, Push, Portal |
| Maintenance request submitted  | Email, Push, Portal      |
| Maintenance approval needed    | Email, SMS, Push, Portal |
| Lease expiring (90/60/30 days) | Email, Push, Portal      |
| New tenant application         | Email, Push, Portal      |
| Document uploaded              | Email, Portal            |
| Monthly financial report       | Email, Portal            |

### Notification Preferences

- Landlord configures preferred channels per event type
- Quiet hours setting (default: 10 PM – 8 AM)
- Digest option: Daily summary instead of individual notifications
- Language preference: English or Arabic

---

## Access Control

### Authentication

- **Login methods**: Email + password, Magic link, Google OAuth
- **Two-factor authentication**: Optional but recommended
- **Session management**: Auto-logout after 30 minutes of inactivity
- **Device management**: View and revoke active sessions

### Property-Level Permissions

- **Multi-owner support**: Multiple landlords can co-own a property
- **View-only access**: Landlord can grant view-only access to accountants, partners
- **Delegated access**: Landlord can delegate portal access to a representative (POA)
- **Property scoping**: Each landlord sees only their own properties

### Audit Logging

- All portal actions logged with timestamp and IP address
- Document downloads tracked
- Login attempts (successful and failed) recorded
- Accessible to system administrators only

---

## Mobile-Responsive Design

### Responsive Requirements

- **Breakpoints**: Mobile (< 768px), Tablet (768–1024px), Desktop (> 1024px)
- **Touch-friendly**: Minimum 44px tap targets on mobile
- **Swipe gestures**: Swipe to navigate between properties
- **Pull-to-refresh**: Update dashboard data on mobile
- **Offline indicators**: Clear messaging when data may be stale

### Mobile-Optimized Views

| Feature          | Desktop          | Mobile             |
| ---------------- | ---------------- | ------------------ |
| Dashboard        | Full grid layout | Stacked cards      |
| Property list    | Table view       | Card list          |
| Financial charts | Full charts      | Simplified charts  |
| Documents        | Table + preview  | List with download |
| Messages         | Split panel      | Full-screen thread |

### Progressive Web App (PWA)

- **Installable**: Add to home screen on iOS/Android
- **Push notifications**: Native push via service worker
- **Offline caching**: Dashboard data cached for offline viewing
- **App-like experience**: No browser chrome when launched from home screen

---

## Acceptance Criteria

### Dashboard

- [ ] Dashboard loads within 3 seconds with all metrics populated
- [ ] Occupancy chart accurately reflects current tenant status
- [ ] Income trend chart displays 12 months of data
- [ ] Property map displays all landlord properties with correct pins
- [ ] Currency toggle switches between AED and USD globally

### Property Management

- [ ] Landlord can view details for every owned property
- [ ] Tenant information respects privacy rules (no KYC data visible)
- [ ] Vacancy alerts trigger within 1 hour of tenant move-out
- [ ] Landlord can approve/decline tenant applications

### Financial Reports

- [ ] Income and expense data match internal accounting records
- [ ] ROI calculations use current property valuations
- [ ] Reports can be exported as PDF and Excel
- [ ] Multi-currency display is accurate based on daily exchange rates

### Maintenance

- [ ] Landlord receives notification within 5 minutes of new request
- [ ] Auto-approval works correctly for requests below threshold
- [ ] Emergency maintenance bypasses approval workflow
- [ ] Landlord can view photos and status updates for all requests

### Documents

- [ ] All uploaded documents are accessible within 1 minute of upload
- [ ] Ejari expiry alerts fire at 60, 30, and 7 days before expiry
- [ ] Bulk download generates a ZIP file within 30 seconds
- [ ] Documents are encrypted at rest and in transit

### Security

- [ ] Two-factor authentication can be enabled and enforced
- [ ] Sessions expire after 30 minutes of inactivity
- [ ] Landlord cannot access properties not assigned to them
- [ ] All access is logged in the audit trail

---

## Technical Notes

### API Endpoints

| Method | Endpoint                                          | Description                   |
| ------ | ------------------------------------------------- | ----------------------------- |
| GET    | `/api/landlord-portal/dashboard`                  | Dashboard metrics and summary |
| GET    | `/api/landlord-portal/properties`                 | List landlord's properties    |
| GET    | `/api/landlord-portal/properties/:id`             | Property detail               |
| GET    | `/api/landlord-portal/properties/:id/tenants`     | Tenant info for property      |
| GET    | `/api/landlord-portal/properties/:id/financials`  | Financial summary             |
| GET    | `/api/landlord-portal/properties/:id/maintenance` | Maintenance requests          |
| PATCH  | `/api/landlord-portal/maintenance/:id/approve`    | Approve maintenance           |
| GET    | `/api/landlord-portal/documents`                  | List all documents            |
| GET    | `/api/landlord-portal/documents/:id/download`     | Download document             |
| GET    | `/api/landlord-portal/financials/report`          | Financial report (date range) |
| GET    | `/api/landlord-portal/messages`                   | List conversations            |
| POST   | `/api/landlord-portal/messages`                   | Send message                  |
| GET    | `/api/landlord-portal/notifications`              | List notifications            |
| PUT    | `/api/landlord-portal/notifications/preferences`  | Update preferences            |

### Role-Based Access

| Feature             | Owner | Manager | Agent | Landlord | Tenant |
| ------------------- | ----- | ------- | ----- | -------- | ------ |
| View dashboard      | N/A   | N/A     | N/A   | ✅ Own   | ❌     |
| View properties     | N/A   | N/A     | N/A   | ✅ Own   | ❌     |
| View financials     | N/A   | N/A     | N/A   | ✅ Own   | ❌     |
| Approve maintenance | N/A   | N/A     | N/A   | ✅ Own   | ❌     |
| Download documents  | N/A   | N/A     | N/A   | ✅ Own   | ❌     |
| Send messages       | N/A   | N/A     | ✅    | ✅       | ❌     |

> Internal roles (owner, manager, agent) manage landlord data through the main CRM interface, not the landlord portal.

### AI Integration

- **Omar (Financial Advisor)**: Generates financial reports and ROI analysis
- **Laila (Compliance)**: Monitors Ejari status and regulatory documents
- **Noor (Client Relations)**: Sends automated notifications and reminders
- **Hassan (Property Specialist)**: Provides property valuation updates

### Security Requirements

- All data transmitted over HTTPS/TLS 1.3
- Personal data encrypted at rest (AES-256)
- GDPR-aligned data handling (even though UAE-based)
- Rate limiting on all API endpoints (100 req/min per user)
- CSRF protection on all state-changing requests

---

## Dependencies

- Authentication service (JWT-based, shared with main CRM)
- Google Maps Platform (property map display)
- Cloud storage (document hosting)
- Email/SMS/Push notification service
- Payment gateway (for future online payment features)
- Exchange rate API (AED/USD conversion)

---

## Future Enhancements

- Online rent collection via the portal (credit card, bank transfer)
- Landlord mobile app (native iOS/Android)
- AI-powered rental price recommendations
- Automated annual rent increase calculations per RERA index
- Integration with UAE banking for direct statement import
- Multi-language support (Arabic, Hindi, Urdu, Mandarin)
