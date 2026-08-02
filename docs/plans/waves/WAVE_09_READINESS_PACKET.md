# Wave 09 — Readiness Packet

**Wave:** 09  
**Focus:** UX Hardening — Skeleton Screens, Accessibility, Mobile, RTL  
**Status:** 🟢 Ready to Execute  
**Date:** 2026-05-22  
**Readiness Score:** 72% (above 60% unlock threshold)

---

## Gate Checklist

| Gate                      | Check                                            | Status              |
| ------------------------- | ------------------------------------------------ | ------------------- |
| S1 (Wave 08) complete     | TypeScript baseline: 0 errors (client + server)  | ✅ Confirmed May 22 |
| `npm run plans:validate`  | Planning governance pass                         | ✅ Confirmed May 22 |
| Business rules documented | `IMPROVEMENTS_UX.md` items 30–33 fully specified | ✅                  |
| API contract              | No new API endpoints — frontend-only changes     | ✅ N/A              |
| Data schema               | No schema changes                                | ✅ N/A              |
| Test scenarios documented | At least 1 per task (see backlog)                | ✅                  |
| Rollback plan             | Remove skeleton components; revert CSS           | ✅ Low risk         |
| @Ada approval phrase      | Required before coding sprint                    | ⬜ Pending session  |

**Readiness evidence:**

- Items 30–33 in `IMPROVEMENTS_UX.md` have full acceptance criteria
- Wave 09 SDD authored (WAVE_09_SDD.md)
- No backend changes → zero API or DB risk
- All changes are additive (new components, CSS additions) → easy revert

---

## Readiness Breakdown (30 checks × groups)

### Business (5/5 — 100%)

- [x] Scope defined: skeleton screens + accessibility + mobile CRM drawer + RTL
- [x] Acceptance criteria in IMPROVEMENTS_UX.md items 30–33
- [x] Process rules: Redux `isLoading` state drives skeleton visibility
- [x] Ownership: @Una/@Lea (components), @Tracy (mobile), @Inas (RTL), @Katherine (QA)
- [x] Rollback: delete new component files + revert CSS additions

### API (5/5 — 100%)

- [x] No new API endpoints needed
- [x] No auth changes
- [x] No error contract changes
- [x] No pagination changes
- [x] No rate limit changes

### Data (5/5 — 100%)

- [x] No schema changes
- [x] No new indexes
- [x] No relationship changes
- [x] No migrations
- [x] No retention changes

### UX (4/5 — 80%)

- [x] Mobile 375px / 768px breakpoints specified in SDD
- [x] RTL direction via CSS logical properties
- [x] Empty/error/loading states designed
- [x] Accessibility notes (WCAG 2.1 AA, axe criteria)
- [ ] Final visual mockup for skeleton color (gold 15% — @Una to confirm in session)

### QA (4/5 — 80%)

- [x] Unit scenarios: render skeleton when isLoading, render content when loaded
- [x] Integration: each CRM module shows skeleton during fetch
- [x] E2E: Playwright viewport test for 375px / RTL toggle
- [x] Regression: `npm run quality:quick` baseline
- [ ] Axe automated scan in CI (to be wired in this wave)

### Compliance/Sign-Off (2/5 — 40%)

- [x] No RERA/DLD impact (frontend-only)
- [x] No PDPL impact
- [ ] @Margaret reviewed and confirmed scope
- [ ] @Sofia confirmed no compliance implications
- [ ] @Katherine sign-off pending session

---

## Risk Assessment

| Risk                                      | Likelihood | Impact | Mitigation                               |
| ----------------------------------------- | ---------- | ------ | ---------------------------------------- |
| Skeleton color doesn't match brand        | Low        | Medium | Test with design tokens; @Una to confirm |
| RTL overrides break existing layout       | Low        | Medium | Scope to `[dir=rtl]` selectors only      |
| Mobile drawer conflicts with existing nav | Low        | Low    | `MobileCRMDrawer` is isolated component  |
| Accessibility violations increase         | Very Low   | High   | Run axe before + after each PR           |

---

## Estimated Effort

| Task                                 | Owner                | Effort    |
| ------------------------------------ | -------------------- | --------- |
| W9-001: Skeleton component library   | @Lea                 | 1 session |
| W9-002: Apply skeletons to CRM pages | @Lea + @Una          | 1 session |
| W9-003: Accessibility audit + fixes  | @Africa + @Katherine | 1 session |
| W9-004: Mobile CRM drawer            | @Tracy               | 1 session |
| W9-005: RTL layout corrections       | @Inas                | 1 session |
| W9-006: Empty/error state library    | @Una + @Lea          | 1 session |

**Total: ~6 focused sessions (micro-wave execution)**
