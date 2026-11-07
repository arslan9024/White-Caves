# Functional Requirements — White Caves CRM Platform

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Status:** Approved  
> **Owner:** Product Team

---

## Overview

This document captures all functional requirements for the White Caves Real Estate CRM Platform. Requirements are organised by module, each with a unique identifier, acceptance criteria, priority, and implementation status.

**Priority Levels**: Critical | High | Medium | Low  
**Status Values**: Implemented | In Progress | Planned | Backlog

---

## Module 1: Authentication & User Management

### REQ-AUTH-001: User Login
**Priority:** Critical | **Status:** Implemented

Users must be able to log in with email and password. On success, the system issues a JWT access token valid for 24 hours. Failed attempts are rate-limited (5 per 15 minutes per IP).

**Acceptance Criteria:**
- [ ] Login form accepts email and password
- [ ] Invalid credentials return HTTP 401 with a safe error message (no user enumeration)
- [ ] Successful login returns JWT token
- [ ] Rate limiter blocks after 5 failed attempts from the same IP
- [ ] Token expiry is enforced on all protected endpoints

### REQ-AUTH-002: Two-Factor Authentication (2FA)
**Priority:** High | **Status:** Implemented

Users with 2FA enabled must provide a TOTP code after password verification before gaining access.

**Acceptance Criteria:**
- [ ] 2FA can be enabled per user from account settings
- [ ] TOTP code is required on every login when 2FA is enabled
- [ ] Invalid or expired TOTP codes are rejected
- [ ] 2FA verification endpoint is separate and strictly rate-limited

### REQ-AUTH-003: Firebase Social Login
**Priority:** High | **Status:** Implemented

Users may log in via Google OAuth (Firebase) as an alternative to email/password.

**Acceptance Criteria:**
- [ ] "Sign in with Google" button triggers Firebase OAuth flow
- [ ] On first Firebase login, a user record is created with role `agent`
- [ ] Subsequent Firebase logins return the existing user record
- [ ] Firebase UID is synced to the user record

### REQ-AUTH-004: Role-Based Access Control (RBAC)
**Priority:** Critical | **Status:** Implemented

Every API endpoint and UI screen enforces role-based permissions. The system supports 22 distinct roles (see `09_user_roles_permissions/roles-matrix.md`).

**Acceptance Criteria:**
- [ ] Requests without a valid token are rejected with HTTP 401
- [ ] Requests with insufficient role are rejected with HTTP 403
- [ ] Role is embedded in JWT and validated server-side on every request
- [ ] UI hides menu items and actions the current role cannot access

### REQ-AUTH-005: Password Reset
**Priority:** High | **Status:** Implemented

Users can request a password reset email. The reset link is valid for 1 hour and single-use.

**Acceptance Criteria:**
- [ ] Reset request endpoint accepts email; returns 200 regardless of whether email exists (prevent enumeration)
- [ ] Reset link expires after 1 hour
- [ ] Reset token is invalidated immediately after use
- [ ] New password must meet complexity rules (8+ chars, mixed case, number)

### REQ-AUTH-006: User Profile Management
**Priority:** Medium | **Status:** Implemented

Users can update their own profile information (name, phone, profile photo). Admins can update any user's profile and change roles.

**Acceptance Criteria:**
- [ ] Users can update name, phone, and profile image
- [ ] Email changes require re-verification
- [ ] Admins can change a user's role
- [ ] Admins can deactivate/suspend user accounts

---

## Module 2: Lead Management (Clara CRM)

### REQ-LEAD-001: Create Lead
**Priority:** Critical | **Status:** Implemented

Any authenticated agent or above can create a new lead record.

**Acceptance Criteria:**
- [ ] Lead form requires: name, phone, source, property interest
- [ ] Email is optional but validated if provided
- [ ] Duplicate detection warns if same phone number already exists
- [ ] Newly created lead appears in agent's lead list immediately
- [ ] System auto-assigns a lead score on creation (0–100)

### REQ-LEAD-002: Lead List with Filtering and Pagination
**Priority:** Critical | **Status:** Implemented

Agents see their own leads; managers see team leads; owners see all leads. Leads can be filtered by status, source, score range, assigned agent, and date range.

**Acceptance Criteria:**
- [ ] Default sort: newest first
- [ ] Filters: status, source, assigned agent, min/max score, date range
- [ ] Text search across name, email, phone, company
- [ ] Pagination: 20 items per page by default, configurable up to 100
- [ ] Total count displayed

### REQ-LEAD-003: Lead Detail View
**Priority:** Critical | **Status:** Implemented

Clicking a lead opens a full detail view showing all lead information, activity timeline, linked properties, and quick actions.

**Acceptance Criteria:**
- [ ] All lead fields displayed
- [ ] Activity timeline shows all interactions (calls, messages, viewings) in chronological order
- [ ] Linked properties shown with thumbnails
- [ ] Quick actions: call, send WhatsApp, schedule viewing, update status

### REQ-LEAD-004: Lead Status Pipeline (Kanban Board)
**Priority:** High | **Status:** Implemented

Visual Kanban board showing leads grouped by pipeline stage: New → Contacted → Qualified → Viewing → Offered → Negotiating → Won / Lost.

**Acceptance Criteria:**
- [ ] All 8 stages visible as columns
- [ ] Drag-and-drop between stages updates status in real time
- [ ] Lead card shows name, score, and last activity date
- [ ] Stage counts and total values shown in column headers
- [ ] Won/Lost leads are archived from the active board

### REQ-LEAD-005: Lead Scoring
**Priority:** High | **Status:** Implemented

Automatic scoring algorithm assigns 0–100 based on budget size, timeline urgency, engagement recency, and source quality.

**Acceptance Criteria:**
- [ ] Score recalculates when budget, timeline, or activity is updated
- [ ] Scores 90–100: "Hot" (red badge)
- [ ] Scores 60–89: "Warm" (amber badge)
- [ ] Scores 0–59: "Cold" (blue badge)
- [ ] Score breakdown tooltip explains contributing factors

### REQ-LEAD-006: Lead Activity Logging
**Priority:** High | **Status:** Implemented

Agents can log any interaction (call, email, WhatsApp, visit, note) against a lead.

**Acceptance Criteria:**
- [ ] Activity types: call, email, sms, whatsapp, visit, note
- [ ] Description is required; outcome is optional
- [ ] Call activities can include duration in minutes
- [ ] Activities appear in chronological timeline on lead detail
- [ ] Last activity timestamp updates on lead list

### REQ-LEAD-007: Lead Assignment
**Priority:** High | **Status:** Implemented

Admins and managers can assign or reassign leads to agents.

**Acceptance Criteria:**
- [ ] Assignment dropdown shows active agents
- [ ] Reassignment is logged as an activity
- [ ] Assigned agent receives an in-app notification
- [ ] Auto-assignment rules can be configured (round-robin by default)

### REQ-LEAD-008: Lead Import (Excel/CSV)
**Priority:** Medium | **Status:** Planned

Bulk import leads from an Excel or CSV file with column mapping.

**Acceptance Criteria:**
- [ ] Upload accepts .xlsx and .csv files up to 10 MB
- [ ] Column mapping UI lets user match file columns to system fields
- [ ] Validation errors shown per row; valid rows import even if some fail
- [ ] Duplicates (same phone) flagged and skippable
- [ ] Import summary shows: imported, skipped, errors

### REQ-LEAD-009: Lead Export
**Priority:** Medium | **Status:** Implemented

Export filtered lead list to Excel or CSV.

**Acceptance Criteria:**
- [ ] Export respects current filters
- [ ] Exports up to 10,000 records
- [ ] Exported file includes all visible columns
- [ ] Sensitive fields (passport, visa) excluded unless role is manager+

### REQ-LEAD-010: Follow-up Reminders
**Priority:** High | **Status:** Planned

Agents can set follow-up reminders on leads; the system sends an in-app notification at the due time.

**Acceptance Criteria:**
- [ ] Reminder date/time picker on lead detail
- [ ] In-app notification sent at reminder time
- [ ] Overdue reminders highlighted in red on lead list
- [ ] Agent can dismiss or reschedule reminders

---

## Module 3: Property Inventory Management (Mary CRM)

### REQ-PROP-001: Add Property
**Priority:** Critical | **Status:** Implemented

Admin and managers can add new property listings to the inventory.

**Acceptance Criteria:**
- [ ] Required fields: title, type, status, price, location, bedrooms, bathrooms, area (sqft)
- [ ] Optional: RERA permit number, DLD reference, description, amenities
- [ ] Property is saved as "draft" until published
- [ ] Duplicate detection by DLD reference number

### REQ-PROP-002: Property List with Advanced Filtering
**Priority:** Critical | **Status:** Implemented

All authenticated users can browse the property list. Filtering by type, status, price range, bedrooms, bathrooms, area.

**Acceptance Criteria:**
- [ ] Filters: type, status, min/max price, min beds, min baths, area/community
- [ ] Full-text search across title, location, description
- [ ] Sort by price, date added, bedrooms
- [ ] Pagination with 20 items per page default

### REQ-PROP-003: Property Detail View
**Priority:** Critical | **Status:** Implemented

Full property page showing all details, photos, floor plan, and related leads/transactions.

**Acceptance Criteria:**
- [ ] Image gallery with zoom support
- [ ] Floor plan display
- [ ] Amenities list
- [ ] Related leads and transactions (managers+)
- [ ] RERA permit number displayed prominently
- [ ] Map location (latitude/longitude)

### REQ-PROP-004: Property Status Management
**Priority:** High | **Status:** Implemented

Properties cycle through statuses: Available → Reserved → Sold/Rented → Archived.

**Acceptance Criteria:**
- [ ] Status change requires confirmation dialog
- [ ] Status change is logged with timestamp and user
- [ ] "Reserved" status shows reservation expiry date
- [ ] Sold/Rented properties are excluded from public search by default

### REQ-PROP-005: Property Media Upload
**Priority:** High | **Status:** Implemented

Upload photos, videos, floor plans, and documents against a property.

**Acceptance Criteria:**
- [ ] Accepts: JPEG, PNG, WebP (photos); MP4 (video); PDF (documents)
- [ ] Max file size: 50 MB per file; 500 MB total per property
- [ ] Photos can be reordered (drag-and-drop)
- [ ] Primary photo designable
- [ ] Upload progress indicator

### REQ-PROP-006: Bulk Property Import (Excel)
**Priority:** High | **Status:** Implemented

Import multiple properties from an Excel template (pre-defined column structure for DAMAC Hills 2).

**Acceptance Criteria:**
- [ ] Download template button provides correct column structure
- [ ] Import processes up to 500 rows per file
- [ ] Validation errors shown per row
- [ ] Existing properties updated if DLD reference matches
- [ ] Import log stored for audit

### REQ-PROP-007: RERA Compliance Tracking
**Priority:** Critical | **Status:** Planned

System tracks RERA permit numbers and warns when permits are missing or about to expire.

**Acceptance Criteria:**
- [ ] `permitNumber` field required before property can be published
- [ ] `permitExpiryDate` field triggers warning 30 days before expiry
- [ ] Expired permits auto-unpublish the listing
- [ ] Compliance dashboard shows % of active listings with valid permits

### REQ-PROP-008: Property Portal Syndication
**Priority:** High | **Status:** Planned

Sync listings to PropertyFinder and Bayut via API.

**Acceptance Criteria:**
- [ ] One-click sync to PropertyFinder and Bayut
- [ ] Sync status shown per property: Synced / Pending / Error
- [ ] Inbound leads from portals captured in Clara CRM automatically
- [ ] Sync errors displayed with portal error message
- [ ] Real-time availability update when status changes to Rented/Sold

---

## Module 4: WhatsApp Communication (Nadia + Nina)

### REQ-WA-001: Multi-Agent WhatsApp Inbox
**Priority:** Critical | **Status:** Implemented (UI); Partial backend

Unified inbox showing all WhatsApp conversations across 23+ connected agent numbers. Agents see only their assigned conversations; managers see all.

**Acceptance Criteria:**
- [ ] Conversation list with latest message preview and unread count
- [ ] Sort by: most recent, unread first, assigned agent
- [ ] Filter by: status (open, closed, escalated), agent, date
- [ ] Conversation opens with full message thread
- [ ] Agents can send text, images, documents from inbox

### REQ-WA-002: Message Templates
**Priority:** High | **Status:** Implemented (UI)

Pre-approved WhatsApp message templates for common scenarios (greeting, property link, viewing confirmation, follow-up).

**Acceptance Criteria:**
- [ ] Template library with search and category filter
- [ ] Templates support variable substitution ({{name}}, {{property}}, {{date}})
- [ ] Templates can be inserted into compose window with one click
- [ ] Admin can create, edit, and deactivate templates
- [ ] Templates comply with WhatsApp Business API policies

### REQ-WA-003: Lead Creation from WhatsApp
**Priority:** Critical | **Status:** Planned

New inbound WhatsApp contacts can be converted to leads in Clara CRM with one click.

**Acceptance Criteria:**
- [ ] "Create Lead" button on conversation sidebar
- [ ] Pre-fills lead form from conversation data (name, phone)
- [ ] Conversation is linked to the new lead record
- [ ] Lead appears in Clara CRM immediately

### REQ-WA-004: WhatsApp Bot (Nina)
**Priority:** High | **Status:** Planned

Automated bot handles first-response, FAQ, appointment scheduling, and lead pre-qualification. Escalates to human agent when confidence is below 60% or customer requests human.

**Acceptance Criteria:**
- [ ] Bot auto-responds within 10 seconds to new inbound messages
- [ ] Bot handles: property inquiries, viewing bookings, FAQ, price queries
- [ ] Language detection: responds in Arabic or English automatically
- [ ] Escalation: "Talk to agent" trigger or confidence < 60%
- [ ] Bot sessions visible in admin dashboard
- [ ] Bot can collect lead qualification data (budget, timeline, type)

### REQ-WA-005: Broadcast Campaigns
**Priority:** Medium | **Status:** Planned

Send bulk WhatsApp messages to segmented contact lists.

**Acceptance Criteria:**
- [ ] Audience builder: filter contacts by lead status, source, area, last activity
- [ ] Campaign must use an approved template
- [ ] Schedule option: send now or schedule for future time
- [ ] Delivery report: sent, delivered, read, failed per recipient
- [ ] Respect opt-out: contacts who opted out are excluded automatically

---

## Module 5: Sales Pipeline & Transactions (Sophia)

### REQ-PIPELINE-001: Pipeline Dashboard
**Priority:** Critical | **Status:** Implemented

Visual summary of all active deals by stage with total value and count per stage.

**Acceptance Criteria:**
- [ ] Stages: Inquiry → Offer Made → Negotiating → Contract Signed → Payment Pending → Closed
- [ ] Pipeline funnel chart showing counts and AED values
- [ ] Filters by agent, date range, property type
- [ ] Clickable stages drill down to deal list

### REQ-PIPELINE-002: Transaction CRUD
**Priority:** Critical | **Status:** Implemented

Create, read, update, and delete sale and lease transactions linked to leads and properties.

**Acceptance Criteria:**
- [ ] Transaction requires: type (sale/lease), lead, property, agent, offer price
- [ ] Status transitions are audited (who changed, when, from/to)
- [ ] Transaction cannot be deleted if commission has been paid
- [ ] Sale transactions auto-create DLD fee line items

### REQ-PIPELINE-003: Sales Forecasting
**Priority:** High | **Status:** Planned

Revenue forecast based on current pipeline stage probabilities.

**Acceptance Criteria:**
- [ ] Default stage probabilities: Inquiry 5%, Offer 30%, Negotiating 50%, Contract 80%, Payment 95%
- [ ] Forecast shows: 30-day, 60-day, 90-day expected revenue
- [ ] Probabilities configurable by admin
- [ ] Forecast chart with trend line

### REQ-PIPELINE-004: Commission Calculation
**Priority:** Critical | **Status:** Implemented

Automatic commission calculation on transaction close.

**Acceptance Criteria:**
- [ ] Default rate: 2% sale, 5% annual rent (configurable)
- [ ] Agent split configurable per transaction (default 50/50)
- [ ] Commission record created with status "pending" on deal close
- [ ] Manager approves commission before payment
- [ ] Agent can view own commission history

---

## Module 6: Finance Management (Theodora)

### REQ-FIN-001: Commission Management
**Priority:** Critical | **Status:** Implemented

Track all commission records from creation through approval to payment.

**Acceptance Criteria:**
- [ ] Commission list filterable by status, agent, date range, type
- [ ] Commission detail shows transaction reference, agent, amount, split breakdown
- [ ] Approve/reject workflow: manager approves, owner pays
- [ ] Bulk approval for multiple commissions
- [ ] Payment confirmation records payment date and method

### REQ-FIN-002: Financial Summary Dashboard
**Priority:** High | **Status:** Implemented

KPI dashboard showing total revenue, commissions paid, pipeline value, profit margin.

**Acceptance Criteria:**
- [ ] Period selector: monthly, quarterly, annual
- [ ] KPIs: total revenue, total commissions, net profit, margin %
- [ ] Revenue trend chart (12 months)
- [ ] Top agents by commission earned
- [ ] Restricted to finance/manager/owner roles

### REQ-FIN-003: Financial Reports Export
**Priority:** High | **Status:** Planned

Export P&L, commission detail, and transaction summary reports to Excel or PDF.

**Acceptance Criteria:**
- [ ] Report types: P&L, Commission Detail, Transaction Summary, Agent Performance
- [ ] Date range selector
- [ ] Excel and PDF export formats
- [ ] Reports include company letterhead and RERA license number
- [ ] Export log for audit trail

### REQ-FIN-004: Rent Collection Tracking
**Priority:** High | **Status:** Planned

Track monthly rent payments against active leases.

**Acceptance Criteria:**
- [ ] Automatic rent schedule generated from lease start/end and monthly amount
- [ ] Payment status per instalment: pending, paid, overdue
- [ ] Late fee calculation after configurable grace period
- [ ] WhatsApp notification triggered for overdue payments
- [ ] Payment reconciliation dashboard

---

## Module 7: Tenant & Lease Management (Daisy)

### REQ-TENANT-001: Tenant Onboarding
**Priority:** High | **Status:** Implemented (basic)

Create tenant records with required KYC documents.

**Acceptance Criteria:**
- [ ] Required fields: full name, email, phone, nationality, Emirates ID number
- [ ] Document uploads: Emirates ID (front/back), passport, visa, salary certificate
- [ ] KYC status: Pending, Verified, Rejected
- [ ] Tenant status: Application, Approved, Active, Inactive

### REQ-TENANT-002: Lease Agreement Management
**Priority:** High | **Status:** Implemented (basic)

Create, manage, and track lease agreements linked to properties and tenants.

**Acceptance Criteria:**
- [ ] Lease requires: property, tenant, start date, end date, monthly rent, security deposit
- [ ] Lease status lifecycle: Draft → Signed → Active → Expired → Terminated
- [ ] Auto-reminder 60 days before lease expiry
- [ ] Lease documents (PDF) generated and stored

### REQ-TENANT-003: Ejari Registration Tracking
**Priority:** High | **Status:** Planned

Track Ejari registration number and dates for each active lease.

**Acceptance Criteria:**
- [ ] `ejariContractNumber` field on lease record
- [ ] `ejariRegistrationDate` and `ejariExpiryDate` fields
- [ ] Warning when Ejari is missing for an active lease
- [ ] Ejari expiry reminder 30 days before

### REQ-TENANT-004: Maintenance Request Management
**Priority:** Medium | **Status:** Planned

Tenants and landlords can raise maintenance requests; operations team tracks resolution.

**Acceptance Criteria:**
- [ ] Request categories: plumbing, electrical, AC, structural, cleaning, other
- [ ] Priority: Urgent, High, Normal, Low
- [ ] Assignment to maintenance contractor
- [ ] Status: Open → In Progress → Pending Approval → Closed
- [ ] Resolution time tracked; alerts for requests open > 48 hours

---

## Module 8: Compliance & Regulatory (Laila)

### REQ-COMP-001: RERA Compliance Dashboard
**Priority:** Critical | **Status:** Implemented (basic)

Dashboard showing compliance score across: property permits, agent licenses, KYC coverage.

**Acceptance Criteria:**
- [ ] Overall compliance score (%)
- [ ] Section scores: property documentation, agent credentials, KYC/AML
- [ ] Red/Amber/Green indicators per section
- [ ] Clickable sections drill down to non-compliant records

### REQ-COMP-002: KYC Verification Workflow
**Priority:** High | **Status:** Planned

Structured KYC workflow for all clients and tenants before transaction completion.

**Acceptance Criteria:**
- [ ] KYC checklist: ID, proof of address, source of funds
- [ ] Document upload against each KYC item
- [ ] KYC status: Pending, Under Review, Verified, Rejected
- [ ] Transactions cannot close until buyer/tenant KYC is Verified
- [ ] KYC records retained for 5 years (AML requirement)

### REQ-COMP-003: Audit Log
**Priority:** High | **Status:** Implemented (basic)

Immutable log of all data changes, user logins, and system events.

**Acceptance Criteria:**
- [ ] Every create, update, delete operation logged with user, timestamp, changed fields
- [ ] Login attempts (success and failure) logged
- [ ] Audit log is append-only (no deletes)
- [ ] Admin can search/filter audit log by user, date, entity, action type
- [ ] Audit log exportable for external audit

---

## Module 9: Reporting & Analytics (Zoe)

### REQ-RPT-001: Executive Dashboard
**Priority:** Critical | **Status:** Implemented

High-level KPI dashboard for owner/executive showing business health at a glance.

**Acceptance Criteria:**
- [ ] KPIs: total leads, hot leads, transactions closed, pipeline value, revenue MTD
- [ ] Period comparison: current vs previous month/quarter
- [ ] Quick access to top agents, top properties, recent activity
- [ ] Accessible only to owner, managing director, executive roles

### REQ-RPT-002: Agent Performance Report
**Priority:** High | **Status:** Planned

Report showing each agent's leads, conversions, transaction value, and commission earned.

**Acceptance Criteria:**
- [ ] Date range selector
- [ ] Metrics per agent: leads handled, views arranged, offers made, deals closed, revenue, commission
- [ ] Sortable by any metric
- [ ] Downloadable as Excel/PDF

### REQ-RPT-003: Property Performance Report
**Priority:** Medium | **Status:** Planned

Report showing how long properties stay on market, view counts, enquiry counts.

**Acceptance Criteria:**
- [ ] Days on market per property
- [ ] Inquiry and viewing counts
- [ ] Average asking vs sale price
- [ ] Properties with no inquiries for 30+ days highlighted

---

## Module 10: System Configuration & Admin

### REQ-ADMIN-001: User Management
**Priority:** Critical | **Status:** Implemented

Super admin can create, edit, deactivate, and delete user accounts. Role assignment.

**Acceptance Criteria:**
- [ ] User list with search and filter by role, department, status
- [ ] Create user form: name, email, role, department, phone
- [ ] Reset password on behalf of user (sends email)
- [ ] Deactivate account (login blocked, data retained)
- [ ] Role change audit logged

### REQ-ADMIN-002: System Settings
**Priority:** Medium | **Status:** Planned

Configurable platform settings: commission rates, RERA defaults, notification preferences, API keys.

**Acceptance Criteria:**
- [ ] Commission default rates configurable (sale %, lease %)
- [ ] WhatsApp API credentials configurable
- [ ] Email SMTP settings configurable
- [ ] Notification preferences per role
- [ ] Settings changes audit-logged

### REQ-ADMIN-003: Data Backup & Restore
**Priority:** High | **Status:** Planned

Daily automated backups of all database data. Manual restore capability.

**Acceptance Criteria:**
- [ ] Daily automated backup at 02:00 UTC
- [ ] Backup stored in separate cloud region from production
- [ ] Restore tested monthly (documented in runbook)
- [ ] Backup retention: 30 days daily, 12 months monthly

---

## Traceability Matrix Summary

| Module | Total REQs | Implemented | In Progress | Planned | Backlog |
|--------|-----------|-------------|-------------|---------|---------|
| Authentication | 6 | 5 | 0 | 1 | 0 |
| Lead Management | 10 | 7 | 0 | 3 | 0 |
| Property Inventory | 8 | 4 | 0 | 4 | 0 |
| WhatsApp | 5 | 1 | 1 | 3 | 0 |
| Pipeline/Transactions | 4 | 2 | 0 | 2 | 0 |
| Finance | 4 | 2 | 0 | 2 | 0 |
| Tenant/Lease | 4 | 1 | 1 | 2 | 0 |
| Compliance | 3 | 1 | 0 | 2 | 0 |
| Reporting | 3 | 1 | 0 | 2 | 0 |
| Admin | 3 | 1 | 0 | 2 | 0 |
| **TOTAL** | **50** | **25** | **2** | **23** | **0** |

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Product Team

---

## Appendix A: MoSCoW Priority Reference

All requirements above carry MoSCoW labels. Existing labels are recorded in each requirement block. The overall distribution is:

| Priority | Symbol | Definition |
|----------|--------|-----------|
| Critical (Must Have) | 🔴 | System cannot launch without this; regulatory or contractual obligation |
| High (Should Have) | 🟠 | High business value; workaround exists but it is costly |
| Medium (Could Have) | 🟡 | Adds value; can be deferred to the next sprint without user impact |
| Low (Won't Have This Cycle) | 🟢 | Nice to have; planned for a future version |

---

## Appendix B: Acceptance Criteria Template (Given/When/Then)

All acceptance criteria in this document follow the format:
- **Given** [a context or precondition], **When** [an action is performed], **Then** [an expected outcome is observed]

---

## Appendix C: Test Traceability Matrix (Requirements → Test Cases)

| Requirement ID | Test Case ID | Test Type | Priority | Owner | Status |
|---------------|:------------:|-----------|:--------:|-------|--------|
| REQ-AUTH-001 | TC-AUTH-001 | Automated (E2E) | Critical | QA | Planned |
| REQ-AUTH-002 | TC-AUTH-002 | Automated (Unit) | Critical | QA | Planned |
| REQ-AUTH-003 | TC-AUTH-003 | Automated (Integration) | Critical | QA | Planned |
| REQ-AUTH-004 | TC-AUTH-004 | Automated (E2E) | High | QA | Planned |
| REQ-AUTH-005 | TC-AUTH-005 | Automated (Unit) | High | QA | Planned |
| REQ-AUTH-006 | TC-AUTH-006 | Manual Security Test | Critical | Security | Planned |
| REQ-LEAD-001 | TC-LEAD-001 | Automated (E2E) | Critical | QA | Planned |
| REQ-LEAD-002 | TC-LEAD-002 | Automated (Unit) | Critical | QA | Planned |
| REQ-LEAD-003 | TC-LEAD-003 | Automated (Unit) | High | QA | Planned |
| REQ-LEAD-004 | TC-LEAD-004 | Automated (Unit) | High | QA | Planned |
| REQ-LEAD-005 | TC-LEAD-005 | Automated (E2E) | Critical | QA | Planned |
| REQ-LEAD-006 | TC-LEAD-006 | Automated (E2E) | Medium | QA | Planned |
| REQ-LEAD-007 | TC-LEAD-007 | Automated (Integration) | Medium | QA | Planned |
| REQ-PROP-001 | TC-PROP-001 | Automated (E2E) | Critical | QA | Planned |
| REQ-PROP-002 | TC-PROP-002 | Automated (Unit) | Critical | QA | Planned |
| REQ-PROP-003 | TC-PROP-003 | Automated (E2E) | High | QA | Planned |
| REQ-PROP-004 | TC-PROP-004 | Automated (Unit) | High | QA | Planned |
| REQ-PROP-005 | TC-PROP-005 | Automated (Integration) | High | QA | Planned |
| REQ-PROP-006 | TC-PROP-006 | Automated (Unit) | Medium | QA | Planned |
| REQ-PROP-007 | TC-PROP-007 | Automated (Compliance Gate) | Critical | QA | Planned |
| REQ-PROP-008 | TC-PROP-008 | Automated (Integration) | High | QA | Planned |
| REQ-WA-001 | TC-WA-001 | Automated (E2E) | Critical | QA | Planned |
| REQ-WA-002 | TC-WA-002 | Automated (Unit) | High | QA | Planned |
| REQ-WA-003 | TC-WA-003 | Automated (Integration) | Critical | QA | Planned |
| REQ-WA-004 | TC-WA-004 | Automated (Integration) | High | QA | Planned |
| REQ-WA-005 | TC-WA-005 | Automated (E2E) | Medium | QA | Planned |
| REQ-PIPELINE-001 | TC-PIPELINE-001 | Automated (E2E) | Critical | QA | Planned |
| REQ-PIPELINE-002 | TC-PIPELINE-002 | Automated (E2E) | Critical | QA | Planned |
| REQ-PIPELINE-003 | TC-PIPELINE-003 | Automated (Unit) | High | QA | Planned |
| REQ-PIPELINE-004 | TC-PIPELINE-004 | Automated (Unit + Integration) | Critical | QA | Planned |

---

## Appendix D: Enhanced Acceptance Criteria — Key Requirements (Given/When/Then)

### REQ-AUTH-001 — Acceptance Criteria (Enhanced)
**Given** a user with email `admin@whitecaves.ae` and correct password attempts login, **When** they submit the form, **Then** a JWT is issued with 24-hour expiry and the user is redirected to the dashboard within 2 seconds.  
**Given** an incorrect password is entered 5 times consecutively, **When** the 5th failed attempt occurs, **Then** the account is locked for 30 minutes and a lockout email is sent to the account owner.  
**Test Reference:** TC-AUTH-001

### REQ-LEAD-001 — Acceptance Criteria (Enhanced)
**Given** an agent fills in the lead creation form with: name, phone, source=WhatsApp, **When** the form is submitted, **Then** the lead is created within 1 second with a unique ID, source = "WhatsApp" is set, the lead appears in the agent's lead list immediately, and the lead score is initialised to the source baseline value.  
**Given** a lead with phone `+971 50 XXX XXXX` already exists, **When** a new lead with the same phone is submitted, **Then** a duplicate warning is shown: "Lead with this phone number already exists — [Lead Name]" with a link to the existing record.  
**Test Reference:** TC-LEAD-001

### REQ-LEAD-002 — Acceptance Criteria (Enhanced)
**Given** a lead record exists with source=WhatsApp and a conversation thread, **When** an agent updates the lead's budget to AED 3.5M, **Then** the activity log entry is created within 3 seconds showing: who made the change, what changed (budget: null → AED 3,500,000), and the timestamp in UTC+4.  
**Test Reference:** TC-LEAD-002

### REQ-PROP-007 — RERA Compliance (Enhanced — Given/When/Then)
**Given** a property has `permitNumber = null`, **When** an agent attempts to change status to "Available", **Then** the system returns a 422 validation error: "RERA Trakheesi Permit number required (RERA Circular 4/2021). Penalty for non-compliance: AED 50,000 per listing."  
**Given** a property's `permitExpiryDate` is exactly midnight tonight, **When** the nightly compliance job executes, **Then** the property status is changed to "Draft", the event is logged in the audit trail, and the assigned agent receives both an in-app notification and a WhatsApp message.  
**Test Reference:** TC-PROP-007

### REQ-PIPELINE-004 — Commission (Enhanced — Given/When/Then)
**Given** a sale transaction at AED 2,000,000 with 2% commission rate and a 50/50 split closes, **When** the "Close Deal" button is clicked, **Then** a commission record is auto-created: total = AED 40,000; company = AED 20,000; agent = AED 20,000; status = "Pending Approval"; and a notification is sent to the Sales Manager.  
**Given** a commission record has status = "Paid", **When** any user calls `PATCH /api/commissions/{id}`, **Then** the response is HTTP 403 with body `{"error": "commission_locked", "message": "Commission record is locked after payment"}`.  
**Test Reference:** TC-PIPELINE-004

---

**Version:** 1.1 | **Last Updated:** June 2026 | **Maintained By:** Product Team  
**Change Log:** v1.0 — Initial requirements REQ-AUTH through REQ-ADMIN (March 2026); v1.1 — Added Appendix A (MoSCoW legend), Appendix B (acceptance criteria template), Appendix C (test traceability matrix), Appendix D (enhanced Given/When/Then for critical requirements) (June 2026)
