# Handover Management — CRM Feature Specification

<!-- markdownlint-disable MD024 MD031 MD032 MD040 MD058 MD060 -->

> **Owner:** @Maya | **Tool:** Groq Console (Llama 3.1 70B)
> **Purpose:** VestaHandoverCRM module for snagging checklists, punch list tracking and keys issuance log.
> **Status:** ✅ Complete — full spec (May 2026)
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM handover management feature specification (business layer)
> **CRM Module:** VestaHandoverCRM (`src/components/crm/VestaHandoverCRM/`)
> **API Base:** `/api/handover`

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/compliance-requirements.md`](../05_requirements/compliance-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend handover workflow/reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

VestaHandoverCRM manages the end-to-end property handover workflow for off-plan units from developer to buyer. It covers snagging inspection, punch list tracking, keys and access issuance, DEWA utility connection, and the legally required handover completion certificate.

## Requirement catalog

### REQ-HND-001: Snagging checklist and defect tracking

The system shall create snagging checklists with categorized defects and status tracking.

**Acceptance criteria:**

- [ ] Checklist items are grouped by defect category
- [ ] Each item supports pass, fail, or punch status
- [ ] Photo evidence is captured per defect where required

**Evidence:** checklist record and defect photo archive.

### REQ-HND-002: Punch list lifecycle and RERA deadline handling

The system shall track punch list resolution with RERA-aligned deadlines and escalations.

**Acceptance criteria:**

- [ ] Developer response deadline is derived from submission date
- [ ] Overdue defects are escalated through the legal workflow
- [ ] Re-inspection creates a new immutable version

**Evidence:** punch list log and escalation record.

### REQ-HND-003: Handover appointment coordination

The system shall coordinate multi-party handover appointments and reminder schedules.

**Acceptance criteria:**

- [ ] Appointment includes buyer, agent, developer rep, and optional specialist
- [ ] Reminder schedule is delivered before the appointment
- [ ] Preparation checklist is required before sign-off

**Evidence:** appointment invite, reminder log, and preparation checklist.

### REQ-HND-004: Keys, access issuance, and completion certificate

The system shall log key issuance and generate a completion certificate on final sign-off.

**Acceptance criteria:**

- [ ] Keys and access items are logged with serial numbers
- [ ] Returned items can be tracked
- [ ] Completion certificate is generated only after required sign-off

**Evidence:** access log and certificate artifact.

## Traceability

- Maps to `REQ-VW-001` through `REQ-VW-005` and `REQ-LGL-004`
- Aligns to `WC-SRS-011`, `WC-SRS-012`, and handover evidence artifacts
- Feeds snagging, legal escalation, and completion certificate validation

**Key capabilities:**

- Snagging checklist builder with photo evidence capture
- Snagging report PDF sent to developer within RERA-mandated 30 days for defect resolution
- Punch list with per-defect status tracking through to sign-off
- Handover appointment scheduling (linked to `/api/viewings`)
- Keys, parking, and access card issuance log with serial numbers
- DEWA connection tracker (application → meter activation)
- Handover completion certificate PDF generation

---

## 2. Snagging Checklist Template

### 2.1 Checklist Categories

| Category           | Example Items                                               |
| ------------------ | ----------------------------------------------------------- |
| Walls & Ceilings   | Cracks, paint finish, damp patches, alignment               |
| Flooring           | Tile chips, grout gaps, levelling, parquet scratches        |
| Doors & Windows    | Alignment, locks, seals, glass scratches, handles           |
| Plumbing           | Faucet pressure, drainage, leaks, water temperature         |
| Electrical         | Socket function, RCCB trip test, light switches, MCB labels |
| HVAC               | AC cooling per spec, thermostat, duct sealing, airflow      |
| Kitchen Appliances | Hob ignition, oven function, extractor, dishwasher cycle    |
| Bathroom Fittings  | Shower pressure, bath sealing, toilet flush, mirror fixing  |
| Common Areas       | Lobby, elevator, parking allocation, mailbox                |

### 2.2 Item Status Values

- `pass` — No defect found
- `fail` — Defect found; must be resolved before sign-off
- `punch` — Minor cosmetic issue; acceptable with outstanding resolution logged

### 2.3 Data Model

```typescript
SnaggingItem {
  id: string;
  checklistId: string;
  category: SnaggingCategory;
  description: string;
  status: 'pass' | 'fail' | 'punch';
  photos: string[];           // max 5 photo URLs per item
  agentNotes?: string;
  developerResponse?: string;
  resolvedAt?: Date;
}

SnaggingChecklist {
  id: string;
  propertyId: string;
  unitNumber: string;
  inspectionDate: Date;
  inspectorName: string;
  buyerId: string;
  developerId: string;
  items: SnaggingItem[];
  status: 'draft' | 'submitted' | 'developer_responded' | 'reinspection' | 'signed_off';
  submittedToDeveloperAt?: Date;
  developerResolutionDeadline?: Date;  // submittedToDeveloperAt + 30 days (RERA standard)
  signedOffAt?: Date;
  signedOffBy?: string;
}
```

### 2.4 API Endpoints

| Method  | Path                                         | Description                          |
| ------- | -------------------------------------------- | ------------------------------------ |
| `POST`  | `/api/handover/checklists`                   | Create new snagging checklist        |
| `GET`   | `/api/handover/checklists/:id`               | Get checklist with all items         |
| `PATCH` | `/api/handover/checklists/:id/items/:itemId` | Update item status + photos          |
| `POST`  | `/api/handover/checklists/:id/submit`        | Submit to developer; lock items      |
| `POST`  | `/api/handover/checklists/:id/signoff`       | Buyer sign-off; generate certificate |

---

## 3. Punch List Tracking and Sign-Off Workflow

### 3.1 Punch List Lifecycle

```
Defect identified (status: punch/fail)
    ↓
Developer notified via email + CRM alert
    ↓
Developer assigns contractor (developerContractorName, scheduledFixDate)
    ↓
Fix completed → developer marks item resolved
    ↓
Re-inspection appointment booked (linked to /api/viewings)
    ↓
Agent confirms fix → item status → signed_off
    ↓ (all items signed off)
Checklist status → signed_off → unlock completion certificate
```

### 3.2 SLA Rules

| Item Type           | Developer Resolution Deadline  | Escalation                             |
| ------------------- | ------------------------------ | -------------------------------------- |
| `fail` (structural) | 30 days from report submission | Escalate to RERA/DLD after 30 days     |
| `fail` (finishing)  | 30 days from report submission | Buyer may withhold final payment       |
| `punch` (cosmetic)  | 60 days from handover          | Tracked but does not block certificate |

### 3.3 Escalation Path

If developer fails to resolve `fail` items within 30 days:

1. System auto-generates escalation letter PDF addressed to developer with outstanding items list
2. Copy sent to RERA on buyer request (RERA complaint form pre-filled from CRM data)
3. Case flagged in legal-management dispute workflow

---

## 4. Handover Appointment Workflow

### 4.1 Multi-Party Scheduling

Handover appointments require:

- Buyer (or buyer's representative with POA)
- White Caves Agent
- Developer Representative
- Optional: independent snagging specialist

All parties receive calendar invites via `/api/viewings` (type: `property_handover`).

### 4.2 Appointment Preparation Checklist

Before the handover appointment the agent must confirm:

- [ ] All punch list items from pre-handover inspection are resolved or documented
- [ ] DEWA No Objection received from developer
- [ ] Original title deed or interim title deed available
- [ ] Service charge clearance letter from developer
- [ ] Handover meeting minutes template loaded in CRM

### 4.3 Reminder Schedule

| Trigger          | Notification                  | Channel          |
| ---------------- | ----------------------------- | ---------------- |
| 7 days before    | Appointment reminder          | Email + WhatsApp |
| 24 hours before  | Full checklist reminder       | Email            |
| 2 hours before   | Location/access codes         | WhatsApp         |
| Post-appointment | Feedback request + next steps | Email            |

---

## 5. Defect Classification

### 5.1 Severity Levels

| Severity     | Definition                                                         | Effect on Handover                                        |
| ------------ | ------------------------------------------------------------------ | --------------------------------------------------------- |
| **Critical** | Structural crack, flooding risk, electrical safety hazard          | Blocks handover; keys withheld                            |
| **Major**    | HVAC not functioning, water pressure below spec, appliance missing | Blocks certificate until resolved                         |
| **Minor**    | Paint scuff, tile grout gap < 2mm, door misalignment < 3mm         | Punch list; certificate issued with outstanding items log |

### 5.2 Photo Evidence Requirements

- Minimum 1 photo per `fail` or `punch` item
- Photos uploaded directly in mobile CRM app or desktop
- Auto-compressed to max 1MB per photo before storage
- Storage path: `uploads/handover/{checklistId}/{itemId}/{n}.jpg`
- Photos timestamped and geotagged where device permits

---

## 6. Snagging Report Generation

### 6.1 Report Content

1. Property details (unit, building, project, developer)
2. Inspection date, inspector name, buyer name
3. Summary table: Pass / Fail / Punch item counts per category
4. Detailed defect list with photos and agent notes
5. Developer response deadline (inspection date + 30 days)
6. Buyer signature block
7. White Caves company stamp and agent BRN

### 6.2 PDF Generation

- Engine: Puppeteer (server-side) via `/api/documents/generate`
- Template: `templates/handover/snagging-report.hbs`
- Output path: `uploads/documents/{propertyId}/snagging-report-{checklistId}.pdf`
- Download endpoint: `GET /api/handover/checklists/:id/report`
- Auto-email to developer on submission; copy to buyer

### 6.3 Versioning

- Each re-inspection creates a new checklist version (`v1`, `v2`, ...)
- Prior versions are immutable (read-only after submission)
- Versions linked via `parentChecklistId` field

---

## 7. Keys and Access Issuance

### 7.1 Issuance Log Schema

```typescript
AccessIssuanceRecord {
  id: string;
  propertyId: string;
  buyerId: string;
  agentId: string;
  issuedAt: Date;
  items: AccessItem[];
  buyerSignatureUrl: string;
  witnessName: string;
  notes?: string;
}

AccessItem {
  type: 'unit_key' | 'mailbox_key' | 'parking_remote' | 'access_card' | 'gate_fob' | 'pool_fob';
  serialNumber: string;
  quantity: number;
  returnedAt?: Date;
}
```

### 7.2 Process

1. Handover appointment marked `completed`
2. Agent opens Access Issuance form in VestaHandoverCRM
3. Agent enters serial numbers for all keys/fobs/cards issued
4. Buyer signs digitally on tablet/mobile
5. System generates Access Issuance Receipt PDF
6. PDF emailed to buyer and stored in property documents

---

## 8. DEWA and Utility Tracking

### 8.1 Required Documents for DEWA Application

| Document                                      | Source                                    |
| --------------------------------------------- | ----------------------------------------- |
| Title Deed or Interim Title Deed              | DLD                                       |
| No Objection Certificate (NOC) from developer | Developer                                 |
| Tenancy contract (rental) or sale agreement   | White Caves                               |
| Emirates ID of buyer/tenant                   | Buyer/Tenant                              |
| DEWA plot number                              | From title deed / developer handover pack |

### 8.2 DEWA Tracker Fields

```typescript
DewaConnection {
  propertyId: string;
  applicationDate?: Date;
  dewaReferenceNumber?: string;
  premisesNumber?: string;
  meterNumber?: string;
  activationDate?: Date;
  status: 'not_started' | 'applied' | 'pending_noc' | 'activated' | 'failed';
  nocReceived: boolean;
  nocDate?: Date;
  notes?: string;
}
```

### 8.3 Process Timeline

| Step      | Action                            | Typical Duration               |
| --------- | --------------------------------- | ------------------------------ |
| 1         | Obtain NOC from developer         | 5–10 working days              |
| 2         | Submit DEWA online application    | Same day                       |
| 3         | DEWA inspection (new connections) | 1–3 working days               |
| 4         | Meter activation                  | 1 working day after inspection |
| **Total** | **New connection**                | **7–14 working days**          |

---

## 9. API Contract

| Method  | Path                                         | Auth   | Description                     |
| ------- | -------------------------------------------- | ------ | ------------------------------- |
| `POST`  | `/api/handover/checklists`                   | Agent+ | Create snagging checklist       |
| `GET`   | `/api/handover/checklists/:id`               | Agent+ | Get checklist                   |
| `PATCH` | `/api/handover/checklists/:id/items/:itemId` | Agent  | Update item                     |
| `POST`  | `/api/handover/checklists/:id/submit`        | Agent  | Submit to developer             |
| `POST`  | `/api/handover/checklists/:id/signoff`       | Agent  | Buyer sign-off                  |
| `GET`   | `/api/handover/checklists/:id/report`        | Agent+ | Download snagging PDF           |
| `GET`   | `/api/handover/:propertyId/certificate`      | Agent+ | Download completion certificate |
| `PATCH` | `/api/handover/dewa/:propertyId`             | Agent  | Update DEWA tracker             |
| `POST`  | `/api/handover/access-issuance`              | Agent  | Record keys/access issuance     |

---

## 10. Acceptance Criteria

- [ ] Full snagging lifecycle captured with auditability (draft → submitted → resolved → signed_off)
- [ ] Punch-list closure requires verification evidence (photo + agent confirmation)
- [ ] Keys/utilities checklist complete before final handover certificate is generated
- [ ] `fail` items block certificate generation until marked `signed_off`
- [ ] Developer response deadline (30 days) displayed and triggers alert on breach
- [ ] DEWA tracker status visible in property detail view
- [ ] All PDFs (snagging report, completion certificate, access receipt) generated within 30 seconds
- [ ] Buyer signature stored as image URL; audit trail entry created on sign-off

---

## 11. Test Plan

- Defect lifecycle: draft → fail item → submit → developer resolves → agent confirms → signed_off
- Reinspection scenario: re-inspection appointment created; new checklist version linked
- Deadline breach: developer misses 30-day deadline → escalation letter auto-generated
- Appointment conflict detection via /api/viewings double-booking check
- Reminder delivery: email + WhatsApp sent at correct intervals before appointment
- Certificate blocked when `fail` items exist; unblocked after all `signed_off`
