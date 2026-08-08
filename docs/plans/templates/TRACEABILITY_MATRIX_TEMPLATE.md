# Traceability Matrix Template

<!-- markdownlint-disable MD060 -->

> **Program mode:** Priority-first documentation and SRS implementation
> **Current priority personas:** MD (`owner`) and Leasing Agent (`leasing_agent`)
> **Expansion objective:** 5000 unique requirement IDs with canonical ownership and evidence mapping

| Canonical ID | Taxonomy | Priority Lane | Requirement Statement | Business Doc Section | SRS Section | API/Design Contract | Test ID(s) | Owner Role | Evidence Artifact | Status |
| ------------ | -------- | ------------- | --------------------- | -------------------- | ----------- | ------------------- | ---------- | ---------- | ----------------- | ------ |
| FR-LIST-00001 | FR | A (Listings) |  |  |  |  |  |  |  | Draft |
| BR-LIST-00001 | BR | A (Listings) |  |  |  |  |  |  |  | Draft |
| POL-LEASE-02001 | POL | B (Leasing Ops) |  |  |  |  |  |  |  | Draft |
| FR-LEASE-02002 | FR | B (Leasing Ops) |  |  |  |  |  |  |  | Draft |
| FR-RCPT-03701 | FR | C (Receipts/Finance) |  |  |  |  |  |  |  | Draft |
| SEC-RCPT-03702 | SEC | C (Receipts/Finance) |  |  |  |  |  |  |  | Draft |
| OBS-XCUT-04601 | OBS | D (Cross-cutting) |  |  |  |  |  |  |  | Draft |

## Coverage Rules

- Every requirement row must map business-doc source and SRS realization location.
- Every acceptance criterion must map to at least one test ID and one evidence artifact.
- Every API and data requirement must map to at least one failure scenario.
- Priority lanes A/B/C must include explicit MD or Leasing Agent owner visibility.
- Canonical IDs must be unique in owner files; mirrored references do not increase counted totals.
- Unmapped rows block coding-readiness and release-readiness gates.

## Taxonomy Reference

- `FR` — Functional Requirement
- `BR` — Business Rule
- `NFR` — Non-Functional Requirement
- `POL` — Policy / Regulatory Requirement
- `SEC` — Security Requirement
- `INT` — Integration Requirement
- `OBS` — Observability Requirement
- `AC` — Acceptance-Criteria Requirement

## Lane Allocation Reference

- **Lane A (`00001-02000`)**: Property listings and listing-to-leasing conversion
- **Lane B (`02001-03700`)**: Leasing full operations and tenancy/Ejari lifecycle
- **Lane C (`03701-04600`)**: Receipt generation and finance continuity
- **Lane D (`04601-05000`)**: Cross-cutting controls and reserve capacity
