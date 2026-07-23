# White Caves Real Estate LLC — End-to-End Workflow Pipelines & Lifecycle Blueprint

**Document Version:** 2.0  
**Governance Standard:** @Ada (Chief Architect)  
**Last Updated:** 2026-07-22

---

## 1. Complete Client Journey Overview

This document defines the 4-phase end-to-end operational pipeline for every client interaction at White Caves Real Estate LLC — from portal lead ingestion to automated 5-star social review acquisition:

```
[Phase 1: Ingestion & Match] ──▶ [Phase 2: Qualification & Viewing] ──▶ [Phase 3: Transaction Execution] ──▶ [Phase 4: 5-Star Social Funnel]
```

---

## 2. Structured ASCII Flowchart Breakdown

```
====================================================================================================
 PHASE 1: LEAD INGESTION & AUTOMATED MATCH (15-Minute SLA Round-Robin)
====================================================================================================
   [ Property Finder / Bayut / Webhook ]
                     │
                     ▼
       ┌──────────────────────────┐
       │ CRM Lead Ingestion Hub   │ ──▶ Parse JSON Payload (Location, Budget, Beds)
       └──────────────────────────┘
                     │
                     ▼
       ┌──────────────────────────┐
       │ Round-Robin SLA Router   │ ──▶ Check Agent Availability & Department Balance
       └──────────────────────────┘
                     │
                     ▼
       ┌──────────────────────────┐
       │ Assigned within 15 mins  │ ──▶ Trigger SMS + In-App Push Alert to Agent
       └──────────────────────────┘


====================================================================================================
 PHASE 2: QUALIFICATION & VIEWING OPERATIONS (WhatsApp Auto-Card)
====================================================================================================
   [ Assigned Agent ]
                     │
                     ▼
       ┌──────────────────────────┐
       │ AI Lead Qualifier Node   │ ──▶ Extract Budget, Preferred Locations (DAMAC Hills / Dubizzle)
       └──────────────────────────┘
                     │
                     ▼
       ┌──────────────────────────┐
       │ Auto-Dispatch WhatsApp   │ ──▶ Send Digital Business Card + Property PDF Brochure
       └──────────────────────────┘
                     │
                     ▼
       ┌──────────────────────────┐
       │ Viewing Confirmation     │ ──▶ Schedule Calendar Slot & Pin Geo-Location
       └──────────────────────────┘


====================================================================================================
 PHASE 3: TRANSACTION EXECUTION (Form F / Ejari Leases)
====================================================================================================
   [ Viewing Completed ] ──▶ Client Decision = Yes
                     │
                     ▼
       ┌──────────────────────────┐
       │ Contract Type Selection  │
       └─────────────┬────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   [ Sale Deal ]          [ Lease Deal ]
   Draft Form F (MOU)     Draft Ejari Lease Agreement
   Upload Passport/EID    Verify PDC Cheques
         │                       │
         └───────────┬───────────┘
                     ▼
       ┌──────────────────────────┐
       │ E-Signature Execution    │ ──▶ Submit to DLD Oqood / Ejari Portal
       └──────────────────────────┘
                     │
                     ▼
       ┌──────────────────────────┐
       │ Commission Split Engine  │ ──▶ Calculate Agent Tier Payout (50%-70%) & Points
       └──────────────────────────┘


====================================================================================================
 PHASE 4: FIVE-STAR SOCIAL ACQUISITION FUNNEL (Satisfaction Gate)
====================================================================================================
   [ Transaction Closed ]
                     │
                     ▼
       ┌──────────────────────────┐
       │ Automated Survey Sent    │ ──▶ Client Rates Experience (1.0 to 5.0 Stars)
       └──────────────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
   [ Rating >= 4.5 / 5 ]   [ Rating < 4.5 / 5 ]
         │                       │
         ▼                       ▼
   Generate Direct Link    Auto-Dispatch Priority Ticket
   to Google Maps Review   Directly to Managing Director
   + WhatsApp Thank You    Arsalan Malik's Workspace
====================================================================================================
```

---

## 3. Detailed Phase Specifications

### Phase 1: Lead Ingestion & Automated Match

- **Ingestion SLA:** All incoming webhooks from Property Finder, Bayut, Dubizzle, and the White Caves website must be processed within **15 seconds**.
- **Assignment Router:** Round-robin algorithm assigns leads based on department (`DEPT_RES_LEASING` vs `DEPT_RES_SALES`), active agent workload, and language matching.
- **Escalation Protocol:** If assigned agent does not acknowledge lead within **15 minutes**, the system automatically reassigns the lead to the next available agent.

### Phase 2: Qualification & Viewing Operations

- **AI Qualification:** Parses incoming message for key parameters: Target Location (e.g. DAMAC Hills 2), Budget (AED), Property Type (Villa/Apartment), and Move-in Date.
- **WhatsApp Integration:** Automatically dispatches agent's digital business card and a high-resolution PDF property brochure upon qualification.
- **Viewing Log:** Captures GPS coordinates, viewing feedback, and client interest score.

### Phase 3: Transaction Execution

- **Contract Engine:** Generates legally binding contracts pre-populated with DLD/RERA required clauses.
- **Commission Split Trigger:** Upon transaction status `CLOSED_VERIFIED`, the system automatically invokes `calculateTransactionPayout()` to credit agent payout balances and leaderboard points.

### Phase 4: Five-Star Social Acquisition Funnel

- **Satisfaction Threshold:** 4.5 out of 5.0.
- **High Rating Flow (≥ 4.5):** Auto-generates a personalized WhatsApp message with a 1-click direct review link to White Caves Real Estate LLC Google Maps Profile.
- **Low Rating Flow (< 4.5):** Triggers an instant P0 Priority Escrow Ticket sent directly to Managing Director Arsalan Malik's Executive Cockpit for immediate resolution.
