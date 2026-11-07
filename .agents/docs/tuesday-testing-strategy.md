# Tuesday Recruitment Testing Strategy

**Updated:** May 22, 2026

## Objectives

- Catch status drift between scoring, messaging, and reporting
- Verify recruiter-facing message generation before rollout
- Keep API metrics stable while compatibility aliases exist

## Test Layers

### Focused Service Tests

- Candidate scoring thresholds map correctly to canonical statuses
- Message template rendering produces the expected next action per status
- Phone normalization remains valid for UAE WhatsApp numbers

### Route Tests

- Screening metrics include canonical keys and legacy aliases
- Batch scoring returns ranked candidates with persisted scores
- WhatsApp notification routes skip candidates without contact details

### Integration Tests

- Score candidate -> persist score -> render Linda message
- Batch score job -> fetch metrics -> feed Zoe dashboard aggregates
- Interview scheduling updates candidate score or workflow state correctly

### Security Tests

- Unauthorized users cannot access recruitment scoring routes
- Executive dashboards do not expose raw resume text
- Invalid uploads or malformed weight payloads are rejected cleanly

## Immediate Regression Commands

Run after changes to scoring, templates, or recruitment metrics:

```powershell
node server/tests/phase1c-scoring-whatsapp.test.js
node server/tests/message-template-production-validation.test.js
```

Recommended follow-up once route tests exist:

```powershell
npm test -- recruitment
```

## Release Gate

- Focused service test passes
- No new errors in touched files
- Recruitment metrics contract reviewed for alias compatibility
- Plan document updated with completed, pending, and future work