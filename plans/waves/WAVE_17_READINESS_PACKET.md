# Wave 17 — Readiness Packet

**Wave:** 17  
**Focus:** Full UI/UX Luxury Upgrade  
**Status:** 📋 Planned  
**Date:** 2026-05-25  
**Readiness Score:** 0% — awaiting Wave 16 completion + free-agent planning packets

---

## Prerequisite Gate

| Gate | Check | Status |
| --- | --- | --- |
| Wave 16 complete | Security hardening + API versioning green | ⬜ Pending |
| `npm run plans:validate` passes | Governance baseline green | ⬜ Pending |
| Free-agent planning locked | All 6 free agents (below) have committed output | ⬜ Pending |

---

## Free-Agent Readiness Checks

| Agent | Output Target | Acceptance Criteria | Status |
| --- | --- | --- | --- |
| @Marissa | `ui-ux-specification.md` — Sections 13–17 | Mobile breakpoints, dark-mode token map, form validation, empty states, skeleton spec committed | ⬜ Pending |
| @Noura | Design token CSS var extensions | Glassmorphism tokens, extended palette, animation duration vars committed to spec | ⬜ Pending |
| @Cyra | Framer Motion animation guidelines | Animation spec: page transitions, card hover, modal entry, reduced-motion handling committed | ⬜ Pending |
| @Sanaa | WCAG 2.2 audit spec | All 8 new WCAG 2.2 AA criteria documented with acceptance tests committed | ⬜ Pending |
| @Rana | PWA vs native spec for CRM | PWA decision rationale + service worker scope documented | ⬜ Pending |
| @Yara | Luxury buyer journey UX benchmarks | UX heuristics and component recommendations committed | ⬜ Pending |

---

## Technical Readiness Checks

| Check | Requirement | Status |
| --- | --- | --- |
| API schemas | No new backend API changes required for 17-1 → 17-5 | ✅ N/A (frontend-only) |
| API schemas | PWA service worker API boundary defined | ⬜ Pending |
| Dependency advisory | `vite-plugin-pwa` vulnerability scan passed | ⬜ Pending |
| Dependency advisory | `@lhci/cli` vulnerability scan passed | ⬜ Pending |
| Dependency advisory | `@axe-core/playwright` vulnerability scan passed | ⬜ Pending |
| Test matrix | Playwright WCAG test scenarios written | ⬜ Pending |
| Test matrix | Lighthouse CI threshold configuration committed | ⬜ Pending |
| Build baseline | `npm run build` passes before wave starts | ⬜ Pending |
| TypeScript baseline | `npm run typecheck` passes before wave starts | ⬜ Pending |

---

## 60% Readiness Definition (Unlock Gate)

Wave 17 is unlocked (60% gate) when:

1. Wave 16 is marked ✅ Green in `PENDING_TASKS_ONLY.md`
2. At least 4 of 6 free-agent spec outputs are committed
3. `vite-plugin-pwa` advisory check passed
4. Build and typecheck green
5. Playwright mobile breakpoint test scaffold exists (even if stubs)

**@Ada approval phrase (exact):**
```
@Ada — Context Ready (60% Readiness) — Coding Phase Approved
```

---

## 90% Readiness Target (Full Wave Confidence)

Wave 17 reaches 90% readiness when all free-agent specs are committed, all test scenarios are defined, and a Lighthouse CI configuration is present in `.github/workflows/`.
