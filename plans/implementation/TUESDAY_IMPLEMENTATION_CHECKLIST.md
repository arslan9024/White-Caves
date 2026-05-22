# Tuesday Recruitment Implementation Checklist

**Updated:** May 22, 2026

## Completed

- [x] Phase 1A data model and recruitment API foundation
- [x] Phase 1B resume parsing and candidate scoring service
- [x] Phase 1C WhatsApp template service and messaging flow
- [x] Screening status alignment to centralized score constants
- [x] Backward-compatible analytics aliases preserved in recruitment metrics
- [x] API and security specification documents added under `plans/technical-specs`
- [x] Linda template catalog added under `plans/linda-templates`
- [x] Zoe KPI framework added under `plans/zoe-dashboard`
- [x] Recruitment router mounted in the main server
- [x] Recruitment overview endpoint added for Zoe analytics
- [x] Offer dispatch endpoint added for application workflows
- [x] Onboarding start endpoint added for accepted candidates
- [x] Zoe recruitment analytics slice added to the executive CRM
- [x] Recruitment route helper tests added for metrics and onboarding contracts

## In Progress

- [ ] Migrate all recruitment consumers to canonical status labels
- [ ] Expand Zoe recruitment analytics beyond the first executive slice
- [ ] Verify Linda workflows against production WhatsApp Business constraints

## Pending

- [ ] Add manager self-service review and shortlist flow
- [ ] Add security-focused route tests for recruitment access control
- [ ] Remove legacy metric aliases after all consumers migrate

## Exit Criteria

- [ ] Canonical statuses are used end-to-end in backend and UI
- [ ] Recruitment KPI dashboard renders live data
- [ ] WhatsApp screening and interview flows are verified in staging
- [ ] API docs match live endpoint behavior