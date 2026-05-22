# WAVE_05_READINESS_PACKET — Communications Core Upgrade

## 1. Wave Metadata

- **Wave ID:** WAVE_05
- **Date:** May 16, 2026
- **Target modules:** Linda lane sync, Nadia WABA hardening, Nina supervisor upgrade
- **Scope mode:** Fast-track (3-6 modules/day macro/huge-wave execution)

## 2. Preconditions Checklist

- [x] Feature identified (communications core assistants)
- [x] Business context available (`business_docs/03_ai_assistants/*`)
- [x] Existing implementation surfaces identified (`server/routes/linda.ts`, `server/routes/nadia.ts`, `server/services/WhatsAppBotService.ts`, `server/services/nadia/whatsappAssistant.ts`)
- [x] Planning artifacts drafted (this packet + SDD + backlog + tests)
- [ ] Margaret sign-off entry in daily tracker
- [ ] Ada explicit approval phrase in active session
- [ ] Premium quota/daily cap refreshed in `PROJECT_PROGRESS.md`

## 3. Readiness Scorecard (60% Gate)

### Business (5)

- Scope and boundaries: ✅
- Acceptance criteria: ✅
- Ownership map: ✅
- Rollback concept: ✅
- KPI definitions: ✅

### API (5)

- Core contracts drafted: ✅
- Auth and permissions: ✅
- Error model baseline: ✅
- Rate-limit strategy: ✅
- Idempotency/webhook controls: ✅

### Data (5)

- Shared message contract: ✅
- Provider/lane fields: ✅
- Supervisor decision log design: ✅
- Retention/audit requirements: ✅
- Migration strategy: ⚠️ pending implementation detail

### UX (5)

- Command center perspective defined: ✅
- Queue/error states identified: ✅
- Multi-lane visibility requirements: ✅
- Mobile/agent view impact: ⚠️ pending explicit wireframes
- Accessibility notes: ⚠️ pending audit

### QA (5)

- Unit+integration targets drafted: ✅
- E2E scenarios defined: ✅
- Load/failure drills listed: ✅
- Regression scope defined: ✅
- Monitoring verification path: ✅

### Compliance/Sign-off (5)

- WABA policy controls identified: ✅
- Opt-in enforcement required: ✅
- PDPL alignment baseline: ✅
- Sign-off records: ⚠️ pending
- Credentials verification: ⚠️ pending

## 4. Readiness Result

- **Checks passed:** 24/30
- **Readiness score:** **80%**
- **Gate status:** READY (pending explicit sign-off + quota refresh)

## 5. Dependency & Risk Summary

### Upstream Dependencies

- Linda source repo access and branch pin
- Meta app credentials and webhook secrets
- Signed webhook raw-body pipeline (already present baseline)

### Key Risks

1. **Scope collision between Nadia and Linda**
   - Mitigation: hard lane contract and adapter boundaries
2. **WABA quality/rate penalties from campaign misuse**
   - Mitigation: throttle profiles + opt-in enforcement + template governance
3. **Supervisor overreach increasing false escalations**
   - Mitigation: policy confidence thresholds + shadow mode phase

## 6. Go/No-Go Decision

- **Decision:** CONDITIONAL GO
- **Required phrase before premium coding:**
  - `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`
