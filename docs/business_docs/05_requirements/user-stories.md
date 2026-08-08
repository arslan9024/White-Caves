# User Stories — White Caves CRM Platform

<!-- markdownlint-disable MD022 MD032 MD060 -->

**Status:** Active  
**Owner:** Product + UX + Department Operations Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Business-layer user-story narrative baseline mapped to requirement families

> **Version:** 1.0  
> **Last Updated:** March 2026  
> **Format:** As a [role], I want to [action], so that [benefit]

## Canonical governance links

- [`README.md`](./README.md)
- [`functional-requirements.md`](./functional-requirements.md)
- [`business-rules.md`](./business-rules.md)
- [`requirements-framework.md`](./requirements-framework.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`](../../software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md)

## Feed targets

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
- `docs/business_docs/13_testing/uat-scenarios.md`
- `docs/plans/waves/WAVE_37_IMPLEMENTATION_BACKLOG.md`

---

## Story traceability catalog

### STY-LEAD-001: WhatsApp to lead capture

As a sales agent, I want to create a lead from a WhatsApp conversation, so that I capture a new opportunity without leaving the chat.

**Traceability:** `REQ-WA-001`, `REQ-WA-002`, `REQ-LEAD-001`

### STY-LEASE-001: Tenant self-service visibility

As a tenant, I want to log in and see my lease details and payment schedule, so that I know when my next payment is due.

**Traceability:** `REQ-TP-001`, `REQ-TP-002`, `REQ-TP-004`

### STY-VIEW-001: Viewing scheduling and follow-up

As a sales agent, I want to schedule a property viewing and send a confirmation instantly, so that clients can book with confidence.

**Traceability:** `REQ-VW-001`, `REQ-VW-003`, `REQ-VW-005`

### STY-COMP-001: Listing compliance review

As a compliance officer, I want to see a dashboard of all active listings without a RERA permit, so that I fix non-compliance before a fine is issued.

**Traceability:** `REQ-COMP-001`, `REQ-COMP-005`

### STY-HR-001: Hiring visibility and profile governance

As an HR manager, I want to manage job postings and track applicants, so that I streamline the hiring process.

**Traceability:** `REQ-HR-001` through `REQ-HR-005`

### Story coverage note

The stories below remain the narrative source for product planning, while the traceability catalog above is the implementation-facing bridge to requirement IDs and validation artifacts.

## Sales Agent Stories

### Lead Management
- As a **sales agent**, I want to create a lead from a WhatsApp conversation, so that I capture a new opportunity without leaving the chat.
- As a **sales agent**, I want to see my leads in a Kanban pipeline view, so that I know which deals need attention today.
- As a **sales agent**, I want to filter my leads by score (hot/warm/cold), so that I focus on the most promising opportunities first.
- As a **sales agent**, I want to log a call outcome against a lead in under 30 seconds, so that my activity record stays accurate without slowing me down.
- As a **sales agent**, I want to set a follow-up reminder on a lead, so that I never forget to call back a prospect.
- As a **sales agent**, I want to see recommended properties for each lead based on their budget and preferences, so that I show relevant listings immediately.
- As a **sales agent**, I want to share a property link via WhatsApp directly from the property detail page, so that sending listings to clients is seamless.

### Properties
- As a **sales agent**, I want to search properties by type, bedrooms, and price range, so that I find the right unit for each client quickly.
- As a **sales agent**, I want to see the RERA permit number on each listing, so that I can quote it confidently to clients.
- As a **sales agent**, I want to save a property to my favourites list, so that I can pull up a shortlist during a client call.

### WhatsApp
- As a **sales agent**, I want to see all WhatsApp messages from my leads in one inbox, so that I respond quickly without switching apps.
- As a **sales agent**, I want to use pre-approved message templates, so that I respond professionally and fast.
- As a **sales agent**, I want to know when a client reads my WhatsApp message, so that I can follow up at the right time.

### Commission
- As a **sales agent**, I want to see my earned and pending commissions in one dashboard, so that I know my monthly income.
- As a **sales agent**, I want to receive a notification when my commission is approved for payment, so that I know when to expect my transfer.

---

## Sales Manager Stories

### Team Oversight
- As a **sales manager**, I want to see all my team's leads and their current pipeline stage, so that I can forecast revenue this month.
- As a **sales manager**, I want to identify leads that have had no activity for 7+ days, so that I can intervene before they go cold.
- As a **sales manager**, I want to reassign a stalled lead from one agent to another, so that it gets the attention it needs.
- As a **sales manager**, I want to see a conversion rate funnel by pipeline stage, so that I know where leads are dropping off.
- As a **sales manager**, I want to see each agent's number of closes and total deal value this month, so that I can recognise top performers.

### Commissions
- As a **sales manager**, I want to review and approve pending commission records, so that agents are paid accurately and on time.
- As a **sales manager**, I want to adjust the agent commission split for a specific deal, so that I can reward exceptional performance.

### Reporting
- As a **sales manager**, I want to download an agent performance report for last quarter, so that I can prepare for appraisals.
- As a **sales manager**, I want to see a weekly lead volume trend chart, so that I can evaluate the effectiveness of our marketing.

---

## Leasing Agent Stories

- As a **leasing agent**, I want to create a tenant application and link it to a property, so that I track the tenancy from start to finish.
- As a **leasing agent**, I want to upload tenant KYC documents against their record, so that all paperwork is in one place.
- As a **leasing agent**, I want to generate a lease agreement from a template pre-filled with tenant and property data, so that I save time on paperwork.
- As a **leasing agent**, I want to see which leases expire in the next 60 days, so that I can start renewal conversations proactively.
- As a **leasing agent**, I want to see the Ejari registration status for each active lease, so that I know which ones need registration.
- As a **leasing agent**, I want to receive an alert when a tenant's rent payment is overdue by 5 days, so that I follow up before it becomes a serious issue.

---

## Branch Manager / Leasing Manager Stories

- As a **branch manager**, I want to see overall occupancy rate for the properties I manage, so that I report it to the owner accurately.
- As a **leasing manager**, I want to see the total rent collected vs expected for this month, so that I can identify collection shortfalls.
- As a **leasing manager**, I want to see all active maintenance requests and their resolution status, so that I ensure tenant satisfaction.
- As a **leasing manager**, I want to approve a lease agreement before it is sent to the tenant, so that I ensure terms are correct.

---

## Finance Director (Theodora) Stories

- As a **finance director**, I want to see total commission liability by agent for this month, so that I know how much to pay out.
- As a **finance director**, I want to reconcile rent payments against bank statements, so that I identify discrepancies quickly.
- As a **finance director**, I want to generate a monthly P&L report with one click, so that I can present it to the owner every month-end.
- As a **finance director**, I want to track late fee income separately, so that I report it accurately to management.
- As a **finance director**, I want to export all transactions for the quarter to Excel, so that I prepare for the external audit.
- As a **finance director**, I want to see an alert when any transaction's escrow has not been reconciled within 7 days, so that I maintain clean accounts.

---

## Compliance Officer (Laila) Stories

- As a **compliance officer**, I want to see a dashboard of all active listings without a RERA permit, so that I fix non-compliance before a fine is issued.
- As a **compliance officer**, I want to review KYC documents for high-value transactions (AED 1M+), so that I meet AML requirements.
- As a **compliance officer**, I want to see an AML risk score for each transaction, so that I prioritise reviews efficiently.
- As a **compliance officer**, I want to generate a regulatory filing report for DLD, so that I meet quarterly submission deadlines.
- As a **compliance officer**, I want to create a suspicious activity report (SAR) and escalate it, so that I comply with UAE AML law.
- As a **compliance officer**, I want the audit log to be tamper-proof and searchable, so that I can respond to regulator requests within 24 hours.

---

## Marketing Manager (Olivia) Stories

- As a **marketing manager**, I want to see lead source attribution by channel (social, WhatsApp, portal, referral), so that I allocate budget to what works.
- As a **marketing manager**, I want to create a segmented WhatsApp broadcast campaign to all leads interested in villas, so that I promote a new listing.
- As a **marketing manager**, I want to see campaign open rates and conversion rates, so that I optimise future campaigns.
- As a **marketing manager**, I want to export the property listing feed in a format suitable for PropertyFinder and Bayut, so that I keep portals updated.
- As a **marketing manager**, I want to see which neighbourhoods generate the most leads, so that I target campaigns geographically.

---

## HR Manager (Nancy) Stories

- As an **HR manager**, I want to see all agent profiles with their RERA registration numbers, so that I ensure everyone is properly licensed.
- As an **HR manager**, I want to track agent contract end dates and renewal reminders, so that I proactively manage the team's status.
- As an **HR manager**, I want to manage job postings and track applicants, so that I streamline the hiring process.
- As an **HR manager**, I want to log disciplinary actions against a user record, so that I maintain an accurate HR file.

---

## Landlord (Portal User) Stories

- As a **landlord**, I want to log in and see all my properties on one page, so that I have an overview of my portfolio.
- As a **landlord**, I want to see rent payment history for each of my properties, so that I track my income without calling the office.
- As a **landlord**, I want to receive an email/WhatsApp when a tenant raises a maintenance request, so that I am informed immediately.
- As a **landlord**, I want to approve or reject a proposed tenant before the lease is signed, so that I have control over who rents my property.
- As a **landlord**, I want to download my annual rental income statement, so that I prepare my financial records.

---

## Tenant (Portal User) Stories

- As a **tenant**, I want to log in and see my lease details and payment schedule, so that I know when my next payment is due.
- As a **tenant**, I want to raise a maintenance request with a photo, so that repairs are addressed quickly.
- As a **tenant**, I want to download my tenancy contract and Ejari registration, so that I have the documents I need for visa and DEWA.
- As a **tenant**, I want to receive reminders 14 days before my rent is due, so that I arrange payment on time.

---

## Owner / Managing Director (Zoe) Stories

- As the **owner**, I want to see a single dashboard with all key business metrics (leads, revenue, occupancy, compliance score), so that I have a real-time view of the business.
- As the **owner**, I want to be alerted to any transaction above AED 5 million, so that I can personally oversee high-value deals.
- As the **owner**, I want to see 3-month revenue forecast based on pipeline, so that I make informed decisions about hiring and marketing spend.
- As the **owner**, I want to receive a weekly summary report every Monday morning, so that I start each week informed.
- As the **owner**, I want to export the company's full financial summary for the board, so that I present accurate data at board meetings.
- As the **owner**, I want all AI assistants to be configurable from one place, so that I maintain consistent service quality.

---

## System Administrator Stories

- As a **super admin**, I want to create and deactivate user accounts, so that only current employees have system access.
- As a **super admin**, I want to assign and change user roles, so that permissions are always up to date.
- As a **super admin**, I want to view the full audit log for any user over any date range, so that I investigate suspicious activity.
- As a **super admin**, I want to configure system-wide settings (commission defaults, notification rules), so that the platform reflects current business policy.
- As a **super admin**, I want to trigger a manual database backup, so that I ensure data safety before a major change.
- As a **super admin**, I want to see real-time system health (API response time, DB status, error rate), so that I respond to incidents quickly.

---

**Version:** 1.0 | **Last Updated:** March 2026 | **Maintained By:** Product Team
