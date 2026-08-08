# Compliance Control Matrix

**Status:** Draft  
**Owner:** @Sofia + @Timnit  
**Last Updated:** 2026-08-02

This matrix seeds the bridge between business compliance requirements and software control surfaces.

## Control mapping principles

- `COMP-*` IDs remain the canonical regulatory requirement identifiers.
- A software control surface may be a route, workflow, gating rule, dashboard, audit log, retention lock, or wave evidence artifact.
- Where implementation is partial or still planned, this matrix records the nearest current software/governance anchor.

## Control mapping matrix

| Compliance ID / domain | Business source | Software / governance target | Validation / evidence surface | Notes |
| --- | --- | --- | --- | --- |
| `COMP-RERA-001` Broker License Display | `compliance-requirements.md` | export/report rendering; listing/public page surfaces | `TC-COMP-001` | Requires explicit render enforcement across outputs |
| `COMP-RERA-002` Trakheesi Permit Number | `compliance-requirements.md`; `trakheesi-integration.md` | property publication gates; portal syndication block logic | `TC-COMP-002`; Wave 20 compliance hardening evidence | High-priority listing gate |
| `COMP-RERA-003` Agent BRN | `compliance-requirements.md`; roles/agent docs | agent profile validation and assignment gating | `TC-COMP-003` | Requires HR/compliance coordination |
| `COMP-DLD-001` Title Deed Transfer Tracking | `compliance-requirements.md`; `dld-integration.md` | transaction close gating, fee calculation logic | `TC-COMP-004` | DLD reference and fee surfaces |
| `COMP-DLD-002` Oqood Registration | `compliance-requirements.md`; off-plan docs | off-plan workflow status gate | `TC-COMP-005` | DLD/Oqood progression dependency |
| `COMP-EJARI-001` Mandatory Ejari Registration | `compliance-requirements.md`; `tenancy-ejari.md` | lease activation gate and Ejari tracking workflows | `TC-COMP-006`; Wave 20–22 tenancy evidence | Key leasing compliance gate |
| `COMP-AML-001` Customer Due Diligence | `compliance-requirements.md`; AML/KYC docs | KYC verification workflow, transaction-advance blocks | `TC-COMP-007`; Wave 20 KYC controls | Core AML gate |
| `COMP-AML-002` Enhanced Due Diligence | same | high-value transaction EDD triggers | `TC-COMP-008` | Threshold-based compliance rule |
| `COMP-AML-003` Suspicious Activity Reports | same | SAR workflow and audit trail | `TC-COMP-009` | Compliance officer action path |
| `COMP-AML-004` Record Retention | same | retention locks, purge-eligible queue, audit preservation | future retention tests | Business doc still contains older references in some sections—standardize to 7 years where applicable |
| `COMP-AML-005` PEP / sanctions screening | same | third-party screening integration and review queue | future screening tests | Partial planning anchor today |
| `COMP-AML-006` CPF screening / CFT obligations | same expanded sections | sanctions / TFS screening and hold logic | `TC-COMP-AML-006` | Newer legal obligation needs explicit software evidence |
| `COMP-AML-007` Cash Transaction Reporting | same expanded sections | CTR generation and overdue alert path | `TC-COMP-AML-007` | Finance + compliance joint workflow |
| `COMP-AML-008` UBO Declaration | same expanded sections | corporate-client KYC / company gate | `TC-COMP-AML-008` | Corporate ownership validation |
| `COMP-PDPL-001` Consent | `compliance-requirements.md`; PDPL docs | consent collection, storage, withdrawal, audit | `TC-COMP-010`; Wave 20 PDPL consent hardening | Current route guards and consent lifecycle exist |
| `COMP-PDPL-006` Breach 72h rule | expanded PDPL section | breach dashboard timer, escalation and notification logic | `TC-COMP-PDPL-006` | Governance anchor present, implementation depth still needed |
| `COMP-PDPL-007` Cross-border transfer controls | expanded PDPL section | integration registry and residency review | `TC-COMP-PDPL-007` | Documentation/governance-heavy today |
| `COMP-PDPL-008` Data retention schedule | expanded PDPL section | retention lock and purge-approval workflow | `TC-COMP-PDPL-008` | Shared with AML retention controls |
| `COMP-PDPL-009` Consent management specification | expanded PDPL section | per-purpose consent audit and withdrawal propagation | `TC-COMP-PDPL-009` | Tied to consent routes and opt-out propagation |

## Current evidence anchors

- Wave 20 route hardening and compliance mutation guards
- Wave 31 corporate-document governance baseline
- Wave 32 traceability and documentation governance artifacts
- compliance route tests and targeted governance validation noted in `PROJECT_PROGRESS.md`

## Next expansion targets

1. Add direct route/service file references for each high-priority control where stable.
2. Mark controls as implemented / partial / planned explicitly in a future revision.
3. Reconcile older retention-language drift across business docs into one canonical rule set.
