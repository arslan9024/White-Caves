# WAVE 10: Compliance & Legal Remediation Plan (Performance & SEO)

## Metadata
- **Owner:** @Sofia (Compliance & Legal Planner)
- **Target Wave:** Wave 10
- **Scope:** Frontend/Backend/API/Data, UI/UX, Accessibility, Performance, Security, Testing, Ops Readiness

## Executive Summary
This document outlines the compliance, legal, and UX stability gaps identified in the Wave 10 SDD (Performance, SEO, and Security) and provides an implementation-ready backlog. The focus is to ensure that performance optimizations and security hardening do not inadvertently violate UAE PDPL, RERA advertising guidelines, or WCAG 2.1 AAA accessibility standards.

## 1. Top Issues & Opportunities (Root Causes)

### Issue 1: Third-Party Tracker CSP & UAE PDPL Consent Gap
- **Root Cause:** The Wave 10 SDD specifies allowing Meta Pixel and Vercel Analytics via CSP (`default-src 'self'`), but lacks a strict cookie consent gateway preventing these scripts from executing prior to explicit user opt-in.
- **API/Data Impact:** Unlawful processing and transmission of user behavioral data to third parties.
- **Risk Level:** **P0** (Regulatory penalty risk).

### Issue 2: Real Estate Listing (JSON-LD) RERA Verification Gap
- **Root Cause:** SEO structured data (`StructuredData.tsx`) injects property data into the DOM without enforcing validation of RERA permit numbers or Ejari compliance within the schema.
- **API/Data Impact:** Missing regulatory attributes in Google's index could flag listings as non-compliant or fraudulent.
- **Risk Level:** **P0** (Platform suspension / RERA fines).

### Issue 3: Rate Limiting UX & Accessibility (429 Errors)
- **Root Cause:** Redis rate limiting blocks brute-force attempts but returns a hard 429 error. The frontend lacks a localized, screen-reader-friendly UI to explain the block gracefully.
- **UI/UX Impact:** Users face raw API errors; screen readers fail to announce the blockage.
- **Risk Level:** **P1** (WCAG failure, UX degradation).

### Issue 4: Lazy Loading Layout Shifts (CLS) & ARIA States
- **Root Cause:** `React.lazy` and `Suspense` wrappers (`LazyRoute.tsx`) are implemented without strict dimension constraints or `aria-busy` states on fallbacks.
- **UI/UX Impact:** CLS (Cumulative Layout Shift) spikes during chunk loading; screen readers are unaware of pending content.
- **Risk Level:** **P1** (Performance regression, Accessibility failure).

### Issue 5: Input Sanitization Data Retention & PII
- **Root Cause:** The new `express-validator` sanitization middleware (`sanitize.ts`) might inadvertently strip legitimate Arabic characters or log sensitive PII (Personally Identifiable Information) during validation failures.
- **API/Data Impact:** Data loss for non-English names; unauthorized logging of PII in standard server logs.
- **Risk Level:** **P2** (Data integrity and privacy risk).

## 2. Implementation-Ready Backlog

| ID | Title | Priority | Acceptance Criteria | Test Strategy | Target Handoff |
|---|---|---|---|---|---|
| **C10-01** | Implement PDPL Cookie Consent Gateway | **P0** | User must explicitly opt-in before Meta Pixel or Analytics fire. Consent state must be saved locally and respect "Reject All". | E2E Playwright test validating `<script>` injection only occurs post-consent. | @Mira |
| **C10-02** | RERA Permit Validator in JSON-LD Schema | **P0** | `StructuredData.tsx` must require and validate `reraPermitNumber`. If missing, fallback to generic `LocalBusiness` schema without property details. | Unit tests validating schema generation outputs against valid/invalid RERA numbers. | @Mala |
| **C10-03** | Accessible 429 Rate Limit UI Gateway | **P1** | Axios interceptor catches 429 errors, triggering a localized (EN/AR) Toast/Modal with `aria-live="assertive"`. | Accessibility audit (Lighthouse) and manual VoiceOver/NVDA testing. | @Mira |
| **C10-04** | Suspense Fallback CLS & ARIA Hardening | **P1** | All `LazyRoute` skeleton fallbacks must have fixed minimum heights/widths and include `aria-busy="true"` and `aria-live="polite"`. | Lighthouse CLS metric consistently < 0.1 during throttled loading. | @Mira |
| **C10-05** | Privacy-Aware Sanitization Middleware | **P2** | `sanitize.ts` must allow full UTF-8 (Arabic) character sets, exclude password fields from trimming, and redact PII in `console.error`. | API unit tests verifying Arabic string integrity and redacted error logs. | @Katherine |

## 3. Ops Readiness & Deployment Risks

- **Rollback Strategy:** If the Cookie Consent Gateway blocks core CRM functionality, fall back to a "legitimate interest" simplified banner while investigating. If strict rate-limiting triggers false positives for corporate IP addresses (e.g., agency offices), allowlist CIDR blocks via environment variables.
- **Monitoring:** Set up Sentry alerts specifically for `429 Too Many Requests` (to tune Redis limits) and CSP Violation Reports (to ensure Meta Pixel isn't firing illicitly).

## 4. Collaboration Contract

- **CONSUMES:** `docs/plans/waves/WAVE_10_SDD.md`
- **FEEDS:** @Mira (Frontend/Backend Execution), @Mala (Finance/Market Data Execution), @Katherine (Analytics Execution)
- **FEEDS_ACK:** 
  - `FEEDS_ACK←@Mira: awaiting confirmation`
  - `FEEDS_ACK←@Mala: awaiting confirmation`
  - `FEEDS_ACK←@Katherine: awaiting confirmation`
