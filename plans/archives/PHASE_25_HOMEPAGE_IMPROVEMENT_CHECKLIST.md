# Phase 25 — Homepage Improvement Checklist

**Date:** May 2, 2026  
**Owner:** @Una + @Lea + @Katherine + @Rachel  
**Related Plan:** `PHASE_23_24_25_IMPLEMENTATION_PLAN.md`

---

## Objective

Improve homepage quality in performance, resilience, SEO consistency, and user conversion flow while preserving current production behavior.

---

## P0 (Must Do)

- [ ] Revisit above-the-fold loading strategy for Hero and key CTA surfaces (LCP-focused)
- [ ] Replace unstable external preview/media placeholders with owned assets or reliable CDN references
- [ ] Add explicit degraded-data indicator when homepage API fallback is active
- [ ] Ensure error and loading UI uses shared components (reduce inline loading UI divergence)

---

## P1 (Should Do)

- [ ] Add route-prefetch strategy for high-conversion paths (e.g., `/properties`)
- [ ] Harden homepage JSON-LD defaults so missing fields never produce weak schema payloads
- [ ] Add homepage accessibility mini-audit pass (landmarks, keyboard order, motion preferences)
- [ ] Add stale-data timestamp surface using `lastFetchedAt` semantics where relevant

---

## Verification

1. Dev startup check
   - `npm run dev`
   - Validate homepage loads and key hero/search sections are visible

2. Build check
   - `npm run build`
   - Confirm production build succeeds

3. UX/SEO check
   - Confirm hero CTA and search controls render without broken critical assets
   - Validate JSON-LD generation path does not error on missing optional fields

---

## Success Criteria

- Homepage remains stable in dev and production build
- LCP-impacting surfaces are prioritized in loading sequence
- Fallback/error state is explicit and user-friendly
- Improvement tasks are traceable and assigned
