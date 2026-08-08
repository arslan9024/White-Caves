# RERA Compliance Checklist

<!-- markdownlint-disable MD060 -->

**Status:** Active  
**Owner:** Compliance + Leasing + Legal Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** RERA-focused checklist control baseline for business requirement verification

## Canonical governance links

- [`README.md`](./README.md)
- [`compliance-requirements.md`](./compliance-requirements.md)
- [`risk-register.md`](./risk-register.md)
- [`POLICY_CONTROL_INDEX_POL_SEED.md`](./POLICY_CONTROL_INDEX_POL_SEED.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)

## Feed targets

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/business_docs/13_testing/qa-checklist.md`
- `docs/business_docs/15_release_management/business-release-and-incident-communication-sop.md`
- `docs/plans/waves/WAVE_36_IMPLEMENTATION_BACKLOG.md`

Use this as a project-level checklist for modules that interact with listings, leasing, notices, or pricing.

## Checklist control matrix

| Checklist ID | Control focus | Related docs |
|-------------|---------------|--------------|
| RERA-CHECK-001 | Listing permit and advertising validation | `REQ-COMP-001`, `REQ-COMP-005` |
| RERA-CHECK-002 | Leasing, Ejari, and notice workflow | `REQ-TP-004`, `REQ-VW-001`, `REQ-VW-005` |
| RERA-CHECK-003 | Pricing and rent guidance | `REQ-NFR-001`, `REQ-INT-004` |
| RERA-CHECK-004 | Audit trail and timestamping | `REQ-COMP-004`, `REQ-WA-001` |

### Checklist evidence rule

- Every checked item should have a matching artifact path, owner, and review date.
- If a workflow lacks evidence, treat the checklist item as pending rather than complete.

- [ ] Listing/business flow references official regulatory source
- [ ] Required notices or forms are identified
- [ ] Pricing/rent logic reflects current published guidance
- [ ] Workflow includes audit trail / timestamping
- [ ] User-facing copy avoids unsupported legal claims
