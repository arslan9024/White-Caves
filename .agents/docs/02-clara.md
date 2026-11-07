# 02 — Clara · Leads CRM Manager

> **ID:** `clara`  
> **Department:** Sales  
> **Title:** Leads CRM Manager  
> **Color:** `#EF4444` (Red)  
> **Avatar:** 👩‍🎯  
> **Phase:** Phase 3 (Active)  
> **Status:** ✅ In Code — `src/components/owner/ai/ClaraLeadsCRM_NEW/`  
> **Access:** Managing Director, Sales Manager, Agent (own leads only)

---

## 1. Overview

Clara is the **lead pipeline nerve centre**. She handles the full lifecycle of every sales lead from first enquiry to won/lost outcome. She manages qualification scoring, nurturing sequences, agent assignment, and conversion analytics. Every WhatsApp conversation (Nadia), bot interaction (Nina), and marketing campaign (Olivia) feeds leads into Clara.

---

## 2. Core Responsibilities

1. Receive and log all incoming leads from all channels (web form, WhatsApp, Bayut/PF portals, manual)
2. Qualify leads using Archer's scoring engine (0–100)
3. Assign hot leads to agents via round-robin or manual override
4. Track the full pipeline: New → Contacted → Qualified → Proposal → Negotiation → Won / Lost
5. Log all interactions: calls, emails, WhatsApp messages, viewings, meetings
6. Produce pipeline analytics: conversion rates, source attribution, velocity

---

## 3. Capabilities

| Capability | Description |
|---|---|
| Lead intake | Multi-channel creation (API, WhatsApp hook, portal webhook, manual) |
| Lead scoring | Displays Archer score badge (0–100) on every lead card |
| Pipeline kanban | Drag-and-drop stage board with deal value totals per column |
| Table view | Sortable, filterable list with bulk actions |
| Interaction log | Chronological timeline of all touches per lead |
| Assignment engine | Round-robin, manual, or Archer-recommended agent |
| Follow-up reminders | Overdue badges, WhatsApp nudge via Nadia |
| Source analytics | Pie chart: Bayut / PF / WhatsApp / Web / Referral |
| Export | CSV download of filtered lead list |
| Bulk status update | Select multiple leads → change stage at once |

---

## 4. How It Works — End to End

### Step 1 — Lead Creation
A new lead enters via any channel:
- **Web form** → `POST /api/leads` with `source: 'web'`
- **WhatsApp** → Nina extracts name/budget/area → Nadia posts to `POST /api/leads` with `source: 'whatsapp'`
- **Bayut/PF** → Portal webhook → `POST /api/leads/webhook` with `source: 'bayut'`
- **Manual** → Agent submits the "New Lead" form in Clara's UI

### Step 2 — Scoring
On creation, the backend calls `ArrowService.score(lead)` → returns a 0–100 score based on engagement, demographics, source, and budget range. Score stored as `lead.score`.

### Step 3 — Assignment
If score ≥ 80 (hot): auto-assign to top-performing available agent.
If score < 80: join the agent's queue for manual pickup.
Assignment stored as `lead.assignedToId`.

### Step 4 — Pipeline Management
Agent updates lead status via drag-and-drop on the Kanban board → `PATCH /api/leads/:id` with `{ status: 'qualified' }`. Backend validates the stage transition (cannot skip from `new` to `won`).

### Step 5 — Interaction Logging
After every call/email/viewing, agent logs the interaction → `POST /api/leads/:id/interactions`. Zoe's dashboard counts total interactions.

### Step 6 — Follow-up Automation
If a lead has not been touched in 48 hours, Nadia sends a WhatsApp follow-up message automatically. System marks `lead.lastContactedAt` on each interaction.

### Step 7 — Conversion / Loss
Lead moves to Won → `PATCH /api/leads/:id { status: 'won' }` → Sophia's pipeline picks it up as a new deal → Theodora calculates the commission.
Lead moves to Lost → reason logged → Olivia can re-target via campaign.

### Step 8 — Reporting
`GET /api/leads/analytics` returns conversion funnel data → rendered as Recharts funnel chart in Clara's Insights tab.

---

## 5. API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/leads` | List leads (pagination, filter, search) |
| POST | `/api/leads` | Create new lead |
| GET | `/api/leads/:id` | Get single lead with full interaction log |
| PATCH | `/api/leads/:id` | Update status, score, assignment |
| DELETE | `/api/leads/:id` | Delete lead (owner only) |
| POST | `/api/leads/:id/interactions` | Log a call/email/visit/WhatsApp |
| POST | `/api/leads/:id/assign` | Assign to agent (manual or round-robin) |
| GET | `/api/leads/analytics` | Conversion funnel, source breakdown |
| POST | `/api/leads/webhook` | Inbound from Bayut/PF portals |

---

## 6. Data Flows

- **Receives from:** Nina (NLP-parsed WhatsApp leads), Nadia (WhatsApp contacts), Olivia (campaign responses), Bayut/PF webhooks
- **Sends to:** Sophia (won leads → deals), Archer (lead data for scoring), Nadia (follow-up triggers), Zoe (pipeline KPIs)

---

## 7. Frontend Components

| Component | Path | Status |
|---|---|---|
| `ClaraLeadsCRM_NEW` | `src/components/owner/ai/ClaraLeadsCRM_NEW/` | ✅ Exists |
| `LeadManagementPage` | `src/pages/crm/LeadManagementPage.tsx` | ✅ Exists |
| Lead kanban board | Inside `ClaraLeadsCRM_NEW` | ✅ Exists (mock) |
| Interaction timeline | Inside `ClaraLeadsCRM_NEW` | ✅ Exists (mock) |

---

## 8. Backend Services

| Service | Path | Status |
|---|---|---|
| Leads CRUD | `server/routes/leads.ts` | ✅ Exists |
| Lead interactions | `server/routes/leads.ts` | 🔲 Planned (`/interactions`) |
| Round-robin assignment | `server/services/AssignmentService.ts` | 🔲 Planned |
| Bayut/PF webhook | `server/routes/leads.ts` | 🔲 Planned |

---

## 9. Access Control

| Role | Can View | Can Create | Can Edit | Can Delete |
|---|---|---|---|---|
| `managing_director` | All leads | ✅ | ✅ | ✅ |
| `sales_manager` | All leads | ✅ | ✅ | ❌ |
| `agent` | Own leads only | ✅ | Own only | ❌ |
| `landlord` / `tenant` | ❌ | ❌ | ❌ | ❌ |

---

## 10. Implementation Checklist

- [x] `ClaraLeadsCRM_NEW` renders (mock data)
- [x] `LeadManagementPage` with add/edit/delete modals
- [x] Leads CRUD backend (`server/routes/leads.ts`)
- [x] Leads tests (`server/routes/leads.test.ts`)
- [ ] Wire frontend to real `/api/leads` (replace mock)
- [ ] Interaction log endpoint (`POST /api/leads/:id/interactions`)
- [ ] Round-robin assignment service
- [ ] Pagination on lead list (cursor-based)
- [ ] Bayut/PF portal webhook handler
- [ ] Source analytics endpoint
- [ ] E2E test: `e2e/lead-management.spec.ts`

---

## 11. Dependencies

- Archer (lead scoring) — must be registered first
- Nadia (WhatsApp follow-up triggers)
- Sophia (receives won leads)
- Recharts (analytics charts)

---

## 12. Future Enhancements

- AI-generated "next best action" recommendation per lead
- Two-way email sync (reply to leads from CRM)
- Duplicate detection (same phone/email from multiple channels)
- Lead nurturing sequences (drip: Day 1 WhatsApp, Day 3 email, Day 7 call reminder)
