# WAVE_04_SDD — Compliance Baseline

## 1. Feature Overview

- **Feature/Module:** Compliance baseline (RERA permit enforcement, KYC workflow, AML screening foundation, PDPL consent controls)
- **Wave ID:** WAVE_04
- **Owner:** @Sofia + @Mira
- **Date:** May 15, 2026

## 2. Business Context & Objectives

- Prevent non-compliant listings and transactions
- Automate required compliance checkpoints for UAE real-estate operations
- Establish a durable compliance foundation before broader scaling waves

**Success metrics**

- Listings cannot be activated without permit requirements
- KYC document workflow exists and blocks non-compliant transactions
- AML screening foundation is wired behind provider abstraction
- Consent capture and revoke/export/delete paths are defined

**Out-of-scope**

- Full enterprise AML workflow maturity beyond baseline screening + flagging
- Deep legal review artifacts beyond required technical controls

## 3. Architecture Context

**Related modules**

- `server/routes/compliance.ts`
- `src/components/crm/LailaComplianceCRM_NEW/`
- client/user/property/transaction models and services
- document storage/upload surface

**Integration boundaries**

- Compliance checks sit at route validation and workflow transition boundaries
- AML provider is external and should be abstracted behind service layer
- PDPL consent intersects public forms and authenticated CRM flows

**Dependencies**

- Wave 02 governance closeout
- RBAC permission map for compliance actions
- storage/upload strategy and provider credentials

## 4. API Contract

**Core endpoints**

- KYC upload/list/review endpoints
- consent create/revoke/export/delete endpoints
- compliance dashboard query endpoints
- property publish/update validation hooks

**Error model**

- 400/422 for missing permit or invalid documents
- 403 for unauthorized review actions
- 502 for external AML provider failures

**Auth/permissions**

- compliance review actions restricted to approved roles
- export/delete actions fully audited

## 5. Data Model & Storage

- Extend/reuse `Document` model for KYC/SAR artifacts
- Ensure property permit fields exist and are indexed as needed
- Add consent model/storage if absent
- Track AML status, last checked timestamp, and flag state on client records

## 6. Validation & Failure Handling

- Block listed status without valid permit fields
- Block transaction creation when KYC not verified
- Flag AML hits rather than auto-silent-pass risky clients
- Gracefully degrade AML screen when provider unavailable while preserving review queue visibility

## 7. Security & Compliance

- PII/document uploads need safe storage and controlled access
- audit log required for review actions and consent changes
- retention and export/delete behavior must align with UAE compliance expectations

## 8. UX States

- Laila dashboard needs review queues and clear alert states
- Upload/review flows need loading/empty/error states
- Accessibility required for compliance queue actions

## 9. Testing Strategy

- Unit: permit validation, consent rules, AML result mapping
- Integration: property listing block, KYC upload/review, transaction block, consent export/revoke
- E2E: compliance reviewer verifies KYC and sees resulting workflow change
- Regression: non-compliant listing cannot leak into active inventory or syndicated flows

## 10. Observability

- Metrics: permit-expiry count, KYC pending count, AML flagged count, consent events
- Logs: review actions, AML failures, blocked publish/transaction attempts
- Alerts: expiring permits, AML provider failure spikes, consent API failures

## 11. Rollout & Rollback

- Start with validation/report-only where appropriate, then enforce blocks after verification
- Enable permit enforcement before syndication wave
- Roll back by reverting hard blocks to warning-only if emergency issue appears

## 12. Readiness Scoring

- **DU (Depth Units):** 40
- **DRI (Doc Readiness Index):** 0.66
- **Readiness score (%):** 66%
- **Sign-offs:** Pending @Margaret / @Sofia / @Katherine / @Ada
