# Enterprise SRS Inventory — 2026-08-06

**Status:** Active working inventory  
**Owner:** Product, architecture, and delivery governance  
**Last Updated:** 2026-08-06

## 1. Purpose

This document is the enterprise requirements operating baseline for the software-docs layer. It consolidates the SRS family across departments into a discoverable inventory that can be used for readiness reviews, implementation waves, and cross-document traceability.

Related upstream reference: [`../../business_docs/05_requirements/enterprise-requirement-inventory.md`](../../business_docs/05_requirements/enterprise-requirement-inventory.md)
Generated baseline artifact: [`enterprise-requirement-catalog.json`](./enterprise-requirement-catalog.json)

The inventory is intended to answer four questions quickly:

1. Which requirement families are already explicit and testable?
2. Which departments still need stronger requirement-level detail?
3. Which requirements are ready for implementation waves?
4. Which artifacts should be consulted for use cases, design, tests, and release evidence?

---

## 2. Inventory summary

| Domain | Coverage status | Representative requirement IDs | Readiness note |
| --- | --- | --- | --- |
| Executive & strategy | Covered | FR-EX-001, BR-EX-002 | Mature governance and reporting coverage. |
| Sales & brokerage | Covered | FR-SB-001, FR-SB-002, AC-SB-001 | Strong pipeline and lead lifecycle coverage. |
| Leasing & tenancy | Covered | FR-LT-001, FR-LT-002, POL-LT-001 | Good lifecycle and legal workflow coverage. |
| Property & facilities | Covered | FR-PF-001, FR-PF-002 | Operations and handover coverage is present. |
| Finance & treasury | Covered | FR-FT-001, FR-FT-002, POL-FT-001 | Financial approvals and VAT controls are explicit. |
| Compliance & risk | Covered | POL-CR-001, SEC-CR-001 | Compliance and audit controls are well represented. |
| Legal & contracts | Covered | BR-LD-001, POL-LD-001 | Contract and notice workflows are defined. |
| Marketing & growth | Partial | FR-MG-001, AC-MG-001 | Needs stronger acceptance criteria and traceability. |
| Communications & client care | Partial | FR-CC-001, INT-CC-001 | Messaging and notification flows need tighter evidence links. |
| Technology & platform | Covered | NFR-TP-001, OBS-TP-001 | Platform, observability, and deployment readiness are documented. |
| Data, AI & BI | Covered | FR-DA-001, INT-DA-001 | Analytics and AI integration requirements are present. |
| HR & workforce | Partial | FR-HR-001, AC-HR-001 | Workforce role and onboarding requirements need expansion. |
| Security & audit controls | Covered | SEC-SECURITY-001, OBS-SECURITY-001 | Good control-plane coverage. |
| Privacy & retention | Covered | POL-PDPL-001, SEC-DATA-001 | Privacy and retention expectations are present. |
| Integration & interoperability | Covered | INT-EXTERNAL-001, INT-WHATSAPP-001 | Cross-system and external-service contracts are documented. |
| Release & change governance | Covered | OBS-RELEASE-001, AC-RELEASE-001 | Release readiness and rollback expectations are represented. |

---

## 3. Requirement families and coverage posture

### Functional requirements

Functional requirements are already explicit in the core departments for sales, leasing, finance, property operations, and compliance. These requirements should remain the backbone for implementation wave planning.

### Non-functional requirements

Non-functional requirements are represented through performance, observability, security, privacy, and release-readiness controls. These should be treated as gating constraints for implementation rather than secondary notes.

### Compliance and policy requirements

Compliance requirements are well represented for RERA, DLD, AML, audit evidence, and privacy governance. These requirements need to remain linked to the appropriate evidence artifacts and approval roles.

### Integration requirements

Integration requirements should be tied to the applicable service layer, messaging flows, webhook contracts, and external-provider fallback behavior. The inventory assumes these will always be traced to the design and test surface.

---

## 4. Departmental follow-up priorities

The current inventory indicates that marketing, communications, and HR require the next wave of requirement hardening. The follow-up work should focus on the following:

1. Add explicit acceptance criteria for campaign and communications workflows.
2. Expand HR and workforce process requirements with role-based transition and onboarding rules.
3. Ensure every major feature has links to one requirement ID, one use-case family, one design artifact, and one validation path.
4. Preserve implementation-ready requirement scaffolds for off-plan, investment, facilities, transaction, telemetry, and executive reporting domains so the inventory can be used directly in backlog planning.

---

## 5. Traceability backbone

The enterprise inventory should be read alongside the following artifacts:

- SRS master suite for the canonical requirement taxonomy
- Functional specifications for departmental system bounds
- Use-case master library for behavioral workflows
- Software design master pack for implementation contracts
- Implementation test readiness master for validation and release evidence

The inventory itself is a navigation artifact. The authoritative requirement detail remains in the department-specific SRS files and linked design/use-case artifacts.

## 5.1 Artifact routing for implementation waves

When a wave is planned, the team should route each requirement family through the following path:

1. requirement ID from the inventory or SRS master;
2. linked UC family from the use-case library;
3. design contract or API boundary from the SDD pack;
4. validation evidence from the readiness master;
5. release gate status and owner from the wave tracker.

This route ensures that no requirement is treated as complete without both implementation and evidence coverage.

---

## 6. Recommended release gate

A domain is considered implementation-ready when the following are true:

- requirement IDs are present and consistent,
- acceptance criteria are explicit,
- a use-case mapping exists,
- the relevant design artifact is linked,
- one validation path exists for the requirement family,
- and the wave evidence pack records the final status and owner.

This inventory should be used as the first checkpoint before any new implementation wave begins and as the last checkpoint before release promotion.

## 7. Expansion target

This inventory is the current software-side backbone for the 5000-ID requirement expansion program. The active sequence is priority-first: property listings, full leasing operations, and receipt governance for MD and Leasing Agent journeys before broader cross-department expansion.

### Program alignment note (2026-08)

- Counted SRS audit now tracks canonical IDs from explicit entries and registered range declarations in audited SRS artifacts.
- Priority lanes A/B/C are reserved for listings, leasing, and receipt continuity requirements.
- Remaining expansion capacity is governed in the cross-cutting reserve lane to avoid renumbering churn.
