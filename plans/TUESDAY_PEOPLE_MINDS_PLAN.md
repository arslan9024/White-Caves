# Tuesday People & Minds Plan

**Focus:** HR, hiring workflow, AI command center coordination
**Project Status:** Active implementation
**Start Date:** January 17, 2026
**Last Updated:** May 22, 2026
**Project Lead:** HR Director + CTO

## Executive Summary

Tuesday People & Minds is the recruitment and talent workflow program for White-Caves. Its goal is to connect Nancy, Linda, and Zoe into one hiring system that improves candidate quality, reduces manual work, and keeps operating cost under control.

Primary targets:

- Reduce cost-per-hire from AED 15,500 to AED 7,200.
- Reduce time-to-hire from 40 days to 20 days.
- Automate up to 95% of repeatable recruitment operations.
- Improve 90-day retention from 85% to 95%.

## Scope

In scope:

- Resume parsing and candidate scoring in Nancy workflows.
- Linda WhatsApp messaging for screening, interview, and offer communication.
- Zoe KPI reporting for recruitment performance and executive visibility.
- Recruitment API contracts, security rules, testing strategy, and operational checklist.

Out of scope for the current implementation slice:

- Full recruiter-facing Zoe dashboard UI.
- Offer acceptance automation beyond current planning artifacts.
- Onboarding workflow automation endpoints.
- Final removal of backward-compatible API aliases.

## AI Command Center Workflow

### Nancy

- Owns jobs, candidates, applications, and score records.
- Runs resume extraction and candidate scoring.
- Persists recruiter-visible feedback and screening status.

### Linda

- Sends candidate-facing WhatsApp messages.
- Uses scoring outputs to choose the correct communication path.
- Stores outbound communication history for tracking.

### Zoe

- Consumes aggregate recruitment metrics.
- Surfaces executive KPIs and ROI indicators.
- Should rely on canonical recruitment metrics as consumers migrate.

### Recommended Flow

1. Candidate applies and uploads resume.
2. Nancy parses the resume and scores the candidate.
3. Candidate is assigned a canonical screening status.
4. Linda sends the matching message or reminder flow.
5. Zoe consumes aggregated metrics for leadership review.

## Timeline

### Phase 1: Foundation and Screening

Status: Mostly implemented in backend.

- Resume parsing service exists.
- Candidate scoring service exists.
- Linda template service exists.
- Screening-to-WhatsApp test exists and passes.

### Phase 2: Workflow Automation

Status: Planned.

- Offer generation contract.
- Interview and onboarding workflow expansion.
- Manager review and shortlist flow.

### Phase 3: Intelligence and Optimization

Status: Planned.

- Zoe recruitment KPI dashboard implementation.
- Department hiring comparisons.
- Retention and performance tracking.

### Phase 4: Hardening and Scale

Status: Planned.

- Security hardening of recruitment routes.
- Removal of legacy metric aliases.
- Production KPI dashboard rollout and reporting stabilization.

## Resource Allocation

Core team:

- Project Manager: delivery and stakeholder coordination.
- Technical Lead: architecture and integration control.
- Backend Developers: recruitment APIs, scoring, Linda integrations.
- Frontend Developer: Zoe recruitment dashboard and manager workflow UI.
- Data Scientist: scoring calibration and model evolution.
- QA Engineer: regression, route, and workflow testing.
- HR Lead: recruiter workflow review and acceptance.
- DevOps and Security support: deployment, monitoring, and access control.

Budget model:

- Development: AED 1.44M.
- Tools and licenses: AED 340K.
- Training and change management: AED 240K.
- Contingency: AED 240K.

## Completed Tasks

- [x] Plans folder structure is present in the repo.
- [x] Phase 1A recruitment foundation is documented and implemented.
- [x] Phase 1B resume parsing and candidate scoring are implemented.
- [x] Phase 1C Linda messaging integration is implemented.
- [x] Canonical screening statuses are now aligned in the live scoring service.
- [x] Message status formatting now supports canonical and legacy status values.
- [x] Recruitment metrics now expose canonical keys with compatibility aliases.
- [x] Focused scoring-to-WhatsApp regression test passes.
- [x] API specification added at `plans/technical-specs/TUESDAY_RECRUITMENT_API_SPEC.md`.
- [x] Security specification added at `plans/technical-specs/TUESDAY_RECRUITMENT_SECURITY_SPEC.md`.
- [x] Linda template catalog added at `plans/linda-templates/RECRUITMENT_WHATSAPP_TEMPLATES.json`.
- [x] Zoe KPI framework added at `plans/zoe-dashboard/RECRUITMENT_KPI_FRAMEWORK.json`.
- [x] Implementation checklist added at `plans/implementation/TUESDAY_IMPLEMENTATION_CHECKLIST.md`.
- [x] Testing strategy added at `plans/implementation/TUESDAY_TESTING_STRATEGY.md`.
- [x] Recruitment router is now mounted in the main server entry.
- [x] Zoe now has a first live recruitment analytics tab in the executive CRM.
- [x] Recruitment overview endpoint added for executive KPI consumption.
- [x] Offer dispatch workflow added for applications in offer stage.
- [x] Onboarding start workflow added for accepted candidates.
- [x] Recruitment helper tests added for metrics aliases, overview totals, and onboarding payloads.
- [x] Live Express-level recruitment route tests added for `score-candidate` and `screening-metrics` canonical status coverage.
- [x] Recruitment route access-control tests added for unauthorized and role-scoped request handling.
- [x] Offer workflow now includes explicit offer approval and candidate acceptance/decline response routes.
- [x] Recruitment workflow actions now emit structured audit logs for scoring, offer, and onboarding transitions.
- [x] Manager self-service shortlist and review workflow endpoints added with role-scoped access and audit trails.

## Pending Tasks

- [ ] Expand the Zoe recruitment KPI UI from the first slice into the full framework.
- [ ] Migrate all consumers away from legacy metric aliases.
- [ ] Add recruiter-facing shortlist and review UI.

## Future Improvements

- [ ] Remove compatibility aliases after all consumers migrate.
- [ ] Add richer Linda templates for offer acceptance and onboarding reminders.
- [ ] Add model version tracking for future scoring upgrades.
- [ ] Add retention and quality-of-hire analytics into Zoe reporting.
- [ ] Add department-level cost-per-hire and time-to-hire trend views.

## KPI Targets

| Metric | Baseline | Target |
| --- | --- | --- |
| Cost-per-hire | AED 15,500 | AED 7,200 |
| Time-to-hire | 40 days | 20 days |
| Automation rate | 0% | 95% |
| 90-day retention | 85% | 95% |
| Monthly savings | AED 0 | AED 240K |

## Immediate Next Actions

1. Expand the Zoe recruitment KPI UI from the first live analytics slice.
2. Wire recruiter-facing shortlist and review UI to the new manager endpoints.
3. Migrate remaining consumers off legacy recruitment metric aliases.
4. Verify Linda WhatsApp templates against production constraints in staging.
