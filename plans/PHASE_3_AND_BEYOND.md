# Phase 4 and Beyond — Deferred Features

> **Priority**: #4 — Deferred  
> **Goal**: All advanced backend integrations, compliance, multi-user onboarding, and expansion features  
> **Prerequisite**: Phase 3 (CRM Full Super User Access) must be complete first  
> **Status**: 🔲 Not Started

---

## Overview

These features are intentionally deferred until the homepage, portals, and Phase 3 CRM work are polished and working.
They require external services, third-party agreements, or significant backend work
that is not needed to demonstrate the core product.

Phase 3 is **not deferred** and is tracked separately in
**[PHASE_3_CRM_SUPERUSER.md](./PHASE_3_CRM_SUPERUSER.md)**.

---

## Phase 3 — CRM Full Super User Access (After Phase 2)

See **[PHASE_3_CRM_SUPERUSER.md](./PHASE_3_CRM_SUPERUSER.md)** for the full task list.

**Goal**: `arslanmalikgoraha@gmail.com` (managing_director) can use every CRM tab and feature
end-to-end with real live data — Properties, Leads, Agents, Contracts, Analytics, Users, Settings,
and all 13 AI assistant dashboards.

- [ ] All 8 managing_director CRM tabs fully wired to live data
- [ ] All 13 AI assistant dashboards render and are navigable
- [ ] Analytics charts show real Recharts visualisations with live DB data
- [ ] AI Hub shows all 17+ registered assistants with clickable dashboards
- [ ] AI Command Center accepts text instructions to assistants
- [ ] AssistantPlanEditor accessible to managing_director (view and edit assistant plans)
- [ ] All CRUD flows tested end-to-end (properties, leads, agents, users)

---

## Phase 4 — WhatsApp Real Integration (After Phase 3)

**Goal**: Replace all WhatsApp stubs with real Meta Cloud API connections.

### 4.1 — WhatsApp Cloud API Setup

- [ ] Register for Meta Business WABA account (external dependency)
- [ ] Approve business phone number
- [ ] Set `WHATSAPP_BOT_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in production env
- [ ] Implement `WhatsAppBotService.ts` methods: `sendMessage()`, `sendTemplateMessage()`, `handleIncomingMessage()`
- [ ] HMAC webhook verification (currently webhook token only — upgrade to full HMAC)
- [ ] Real-time conversation state: WebSocket or long-poll from Nadia inbox to server
- [ ] Agent inbox: incoming messages assigned to agents, read/unread status

### 4.2 — Nina Bot (Automated First Response)

- [ ] Conversation state machine in `server/services/NinaBotService.ts`
- [ ] Intent classification: property inquiry, viewing request, FAQ, escalation
- [ ] Language detection: English / Arabic
- [ ] Property inquiry flow: budget → type → area → matched listings → send 3 cards
- [ ] Viewing booking flow: calendar availability → confirm → auto-create appointment
- [ ] Escalation to Nadia (human agent) when confidence < 60% or user types "agent"
- [ ] Lead auto-creation in Clara from bot conversation

### 4.3 — Olivia Broadcast Campaigns

- [ ] Campaign builder: audience filter (status, area, budget range)
- [ ] Template message creation and scheduling
- [ ] Send execution with per-recipient personalisation
- [ ] Delivery tracking: sent / delivered / read counts
- [ ] Campaign analytics dashboard in `OliviaMarketingCRM_NEW`

---

## Phase 5 — Lease & Tenancy Full Module (After Phase 4)

**Goal**: Complete tenancy lifecycle from application to move-out.

### 5.1 — Prisma Schema Status

> **✅ Already in schema**: `Lease` and `Maintenance` models exist in `prisma/schema.prisma`.
> The `RentPayment` model does **not** yet exist and must be added.

Add `RentPayment` to `prisma/schema.prisma`:

```prisma
model RentPayment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  leaseId   String   @db.ObjectId
  dueDate   DateTime
  paidDate  DateTime?
  amount    Float
  status    String   @default("pending") // pending, paid, overdue
  lateFee   Float    @default(0)
}
```

> Reference the existing `Lease` model fields in `prisma/schema.prisma` for relation definition.
> Reference the existing `Maintenance` model for the maintenance request API (do not re-create it).

### 5.2 — Lease API (`/api/leases`)

- [ ] CRUD endpoints for Lease model
- [ ] Lease status lifecycle enforcement
- [ ] Ejari field validation: cannot set status "active" without `ejariContractNumber`

### 5.3 — Rent Schedule Auto-Generation

- [ ] On lease activation → auto-create monthly `RentPayment` records
- [ ] Day 5/10: automated WhatsApp reminder (requires Phase 4)
- [ ] Day 15: late fee calculation applied
- [ ] Day 25: escalation to compliance dashboard

---

## Phase 6 — Compliance & Regulatory (After Phase 5)

**Goal**: Full UAE RERA/KYC/AML/PDPL compliance.

### 6.1 — RERA Permit Enforcement

- [ ] Add `permitNumber`, `permitExpiryDate` to Property schema
- [ ] Block property publish if permit missing or expired
- [ ] Auto-unpublish properties with expired permits (daily cron job via `node-cron`)
- [ ] 30-day expiry warning in Laila compliance dashboard

### 6.2 — KYC Document Workflow

- [ ] Install `multer` for file uploads
- [ ] KYC document upload endpoints: passport, Emirates ID, proof of funds
- [ ] KYC status: Pending → Under Review → Verified → Rejected
- [ ] Block transaction creation when client KYC is not verified

### 6.3 — AML Screening

- [ ] ComplyAdvantage API integration (requires contract)
- [ ] Auto-screen client on creation
- [ ] PEP/Sanctions match alerts in Laila compliance dashboard
- [ ] SAR (Suspicious Activity Report) workflow

### 6.4 — PDPL Consent Management

- [ ] Consent checkbox on all data-collection forms
- [ ] `Consent` Prisma model: userId, date, version, purpose, ipAddress
- [ ] Opt-out for marketing communications
- [ ] Right of access: export all data for a user
- [ ] Account deletion request flow

---

## Phase 7 — Analytics & Portal Syndication (After Phase 6)

### 7.1 — PropertyFinder & Bayut Integration

- [ ] `PortalSyncService` — XML feed generator
- [ ] PropertyFinder feed endpoint (partner agreement required)
- [ ] Bayut feed endpoint (partner agreement required)
- [ ] Inbound lead webhook from both portals → auto-create lead in Clara
- [ ] Sync status per property

### 7.2 — Advanced Financial Reporting

- [ ] Install `exceljs` and `pdfkit`
- [ ] Commission Detail Report → Excel export
- [ ] Agent Commission Statement → PDF with company letterhead
- [ ] Monthly P&L Report → PDF
- [ ] Scheduled report delivery via email

### 7.3 — Multi-Currency Display

- [ ] ExchangeRate API integration (hourly refresh)
- [ ] Currency selector component in property listings
- [ ] AED, USD, EUR, GBP, SAR, INR display
- [ ] "Approximate conversion" disclaimer

### 7.4 — Agent Performance Full Module

- [ ] Monthly target setting per agent
- [ ] Progress tracking vs. targets
- [ ] Response time KPI measurement
- [ ] Agent self-service performance dashboard

---

## Phase 8 — Arabic RTL & Internationalisation (After Phase 7)

- [ ] Populate `ar` key in `src/i18n/translations.ts` with Arabic strings for all UI labels
- [ ] RTL CSS layout toggle (`dir="rtl"` on `<html>`)
- [ ] Arabic number and date formats
- [ ] Right-to-left navigation, sidebar positioning
- [ ] Arabic WhatsApp bot responses in Nina

---

## Phase 9 — Multi-User CRM & RBAC (After Phase 8)

### 9.1 — User Registration & Role Approval Flow

- [ ] New user signs up → enters email, name, selects role category
- [ ] Account created with status `pending`
- [ ] Owner sees pending users in "Users" tab with Approve/Reject actions
- [ ] Approved users get the correct role and can log in
- [ ] `PendingApprovalPage.tsx` already exists — wire it up to the approval flow
- [ ] `POST /api/users/role-request` → saves to DB (Prisma model needed: `RoleRequest`)

### 9.2 — Role-Specific CRM Views

- [ ] Each of the 29 roles in `ROLE_TAB_MAPPING` shows only their permitted tabs
- [ ] Agents see: leads assigned to them, their properties, their commissions only
- [ ] Data segmentation: agents cannot see other agents' leads/commissions (backend filter by `assignedToId`)
- [ ] RBAC middleware on all backend routes: validate `req.user.role` matches the allowed roles list

### 9.3 — Agent Onboarding Flow

- [ ] First login → profile completion wizard (photo, phone, department, bio)
- [ ] Welcome email sent on approval (email service TBD)

---

## Phase 10 — Mobile PWA & Advanced Features (Final)

- [ ] Progressive Web App: `manifest.json` + service worker
- [ ] Mobile-optimised navigation (bottom tab bar)
- [ ] Push notifications: new lead, commission paid, rent reminder
- [ ] Offline read mode for property list
- [ ] Cipher (AI Market Intelligence): OpenAI GPT-4 powered DLD market analysis
- [ ] Maven (Investment ROI Calculator): yield predictions by area

---

## Technical Debt to Address Across All Phases

| Item                                       | Relevant Phase        | Notes                                                   |
| ------------------------------------------ | --------------------- | ------------------------------------------------------- |
| `node-cron` not installed                  | Phase 6 (RERA cron)   | `npm install node-cron @types/node-cron`                |
| `exceljs` + `pdfkit` not installed         | Phase 7 (reports)     | `npm install exceljs pdfkit @types/pdfkit`              |
| `multer` not installed                     | Phase 6 (file upload) | `npm install multer @types/multer`                      |
| 2FA returns 501                            | Phase 9 (security)    | Implement TOTP or Twilio SMS                            |
| Stripe backend returns 503                 | Phase 5 or later      | Install Stripe SDK when payments are in scope           |
| Only 2 ADRs written                        | Ongoing               | Write ADR per significant architectural decision        |
| CSS approach inconsistent                  | Phase 9               | Standardise on styled-components across all components  |
| Archer, Quill, Oracle not in code registry | Phase 3               | Add to `src/store/slices/aiAssistant/registry.ts`       |
| OpenAPI spec not wired to server           | Phase 9               | Install `swagger-ui-express`, auto-serve `openapi.json` |
| Test coverage at ~60%                      | Phase 9               | Target 80% with Vitest; critical flows in Playwright    |

---

## Milestone Summary (Updated April 2026)

| Milestone         | Target         | Key Deliverables                                                                      | Depends On                         |
| ----------------- | -------------- | ------------------------------------------------------------------------------------- | ---------------------------------- |
| Phase 1 Complete  | May 2026       | Full homepage, all sections, mobile-ready                                             | Nothing                            |
| Phase 2 Complete  | May 2026       | Landlord & Tenant portals live, `arslanmalikgoraha@gmail.com` managing_director login | Phase 1                            |
| Phase 3 Complete  | June 2026      | Full CRM all tabs for managing_director with live data                                | Phase 2                            |
| Phase 4 Complete  | July 2026      | WhatsApp live, Nina bot, Olivia campaigns                                             | Phase 3 + WABA account             |
| Phase 5 Complete  | August 2026    | Full lease/tenancy, Ejari, rent schedule                                              | Phase 4                            |
| Phase 6 Complete  | September 2026 | KYC/AML/PDPL/RERA enforcement                                                         | Phase 5 + ComplyAdvantage contract |
| Phase 7 Complete  | October 2026   | Portal syndication, financial exports, multi-currency                                 | Phase 6 + portal agreements        |
| Phase 8 Complete  | November 2026  | Arabic RTL full i18n                                                                  | Phase 7                            |
| Phase 9 Complete  | December 2026  | Multi-user RBAC, agent onboarding, role approval                                      | Phase 8                            |
| Phase 10 Complete | Q1 2027        | PWA, push notifications, Cipher/Maven                                                 | Phase 9 + OpenAI API               |
