# Tuesday Recruitment Security Specification

**Updated:** May 22, 2026

## Security Goals

- Protect candidate PII across Nancy, Linda, and Zoe flows
- Limit access to recruitment-only data and operations
- Ensure WhatsApp messaging does not bypass auditability
- Keep screening automation explainable and reviewable

## Sensitive Data Covered

- Candidate names, emails, phone numbers, WhatsApp numbers
- Resume text and extracted experience or education data
- Scoring outputs and recruiter feedback
- Interview links, offer data, and onboarding details

## Required Controls

### Access Control

- In `RECRUITMENT_AUTH_MODE=enforced`, every recruitment route requires a verified upstream `req.user` role. Client-supplied role and identity headers are never authorization or audit identity sources.
- Reads use the recruitment read-role gate; mutations use the write-role gate. Manager-review mutations retain their dedicated manager-role gate.
- Upstream authentication must populate `req.user` before mounting the router. A missing verified identity fails closed with HTTP 401.
- HR users: full access to candidate records and score details
- Hiring managers: role-scoped access to jobs and shortlisted candidates
- Executive dashboards: aggregate metrics only, no raw resume text by default
- Service-to-service calls: authenticated server-side only

### Data Handling

- Do not log full resume text in application logs
- Mask phone numbers in non-HR dashboards where possible
- Store only normalized WhatsApp numbers in outbound messaging layers
- Retain parsed data only as long as required for hiring operations

### Auditability

- Log who triggered scoring
- Log who sent WhatsApp recruitment messages
- Track status changes from `pending` to interview or rejection outcomes
- Record template IDs used for candidate communication

### Validation

- Validate uploaded resume type before extraction
- Reject malformed phone numbers before WhatsApp dispatch
- Sanitize all recruiter-entered variables inserted into templates
- Validate custom scoring weights so total weight remains 1.0

## AI Screening Guardrails

- Auto-actions are allowed for low-risk routing only
- Borderline candidates should remain reviewable by humans
- Scoring explanations must be stored in recruiter-visible feedback
- Model refreshes should be versioned and compared against known baselines

## Messaging Safeguards

- Do not send interview or offer messages without a valid candidate job link
- Do not send duplicate notifications within the same workflow step
- Preserve message history for dispute resolution and compliance review
- Allow opt-out or manual suppression for sensitive cases

## Operational Checklist

- Run focused recruitment tests after status or template changes
- Review access to `/api/recruitment/*` routes quarterly
- Verify dashboard consumers do not leak raw candidate data
- Re-check alias usage before removing backward-compatible keys
