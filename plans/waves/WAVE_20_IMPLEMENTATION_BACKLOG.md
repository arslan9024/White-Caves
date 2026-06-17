# Wave 20 — Implementation Backlog

**Wave:** 20  
**Focus:** Full Leasing & Tenancy Implementation  
**Status:** 📋 Planned  
**Date:** 2026-06-17  
**Entry Gate:** Wave 19 closeout + readiness 60% + `@Ada — Context Ready (60% Readiness) — Coding Phase Approved`

---

| ID | Requirement IDs | Priority | Task | Owner | Validation Command | Status |
|---|---|---|---|---|---|---|
| W20-001 | REQ-LEASE-001, REQ-LEASE-002 | P0 | Build tenant application form + KYC document upload (Emirates ID, passport, visa, NOC) with expiry-alert engine | @Mira + @Barbara | Unit: KYC validation rules; E2E: application submit flow | 📋 Planned |
| W20-002 | REQ-LEASE-003 | P0 | Implement bilingual tenancy agreement PDF generation (Puppeteer template — parties, unit, term, rent, PDC schedule, signatures) | @Mira | Integration: PDF generation with all variable slots populated | 📋 Planned |
| W20-003 | REQ-LEASE-004 | P0 | Wire DocuSign/Adobe Sign e-signature webhook: send for signature → webhook on completion → store signed PDF → update lease status | @Mira | Integration: webhook test with mock signature event | 📋 Planned |
| W20-004 | REQ-LEASE-005 | P0 | Implement Ejari registration status tracking: number input, certificate upload, status badges (Pending/Registered/Expired) | @Mira + @Una | Unit: status transitions; UI: status badge renders correctly | 📋 Planned |
| W20-005 | REQ-LEASE-006 | P0 | Build PDC schedule auto-generator: from lease dates + rent amount + frequency → produce cheque schedule with amounts and due dates | @Barbara + @Mira | Unit: schedule math, frequency variants; validation: total = annual rent | 📋 Planned |
| W20-006 | REQ-LEASE-007, REQ-LEASE-008 | P0 | Implement bounced cheque workflow: bounce recording → 1-hour WhatsApp alert to agent + landlord → Form 12 legal notice PDF generation | @Mira + @Katherine | Integration: bounce event → notification → PDF stored; E2E: bounce flow | 📋 Planned |
| W20-007 | REQ-LEASE-007 | P1 | Build PDC replacement flow: replacement cheque creation, bank guarantee alternative, link original to replacement | @Mira | Unit: replacement creates new PDC and marks original as REPLACED | 📋 Planned |
| W20-008 | REQ-LEASE-009, REQ-LEASE-010, REQ-LEASE-011 | P0 | Implement lease renewal workflow: 90/60/30-day cron reminders, RERA rental index check display, Form 7 rent-increase notice PDF (90-day compliance guard) | @Mira + @Barbara | Integration: cron fires at correct intervals; Unit: Form 7 notice content | 📋 Planned |
| W20-009 | REQ-LEASE-012 | P1 | Build early termination workflow: type selection (mutual/breach), penalty calculator per RERA Article, deposit refund computation, move-out checklist | @Mira | Unit: penalty calculator for all RERA Article 11 cases | 📋 Planned |
| W20-010 | REQ-LEASE-013 | P0 | Build Tenant Portal six-tab UI: LeaseDetails, PaymentHistory, Maintenance, Documents, Profile, PortalHome — all with loading/error/empty/success states | @Una + @Lea | E2E: all six tabs render + empty/error states validated | 📋 Planned |
| W20-011 | REQ-LEASE-014 | P0 | Build Landlord Portal: portfolio overview (all properties), rent collection status, PDC calendar, quarterly owner statement PDF | @Una + @Mira | E2E: portfolio view; Unit: quarterly statement PDF output | 📋 Planned |
| W20-012 | REQ-LEASE-015 | P1 | Implement maintenance cost approval: repairs > AED 500 trigger WhatsApp approval request to landlord; proceed only on approval; rejection notifies agent | @Mira | Integration: approval flow end-to-end; Unit: threshold guard | 📋 Planned |
| W20-013 | REQ-LEASE-001 through REQ-LEASE-015 | P0 | RBAC enforcement: tenant sees own lease/payments only; landlord sees own properties; agent sees assigned leases; manager/owner sees all | @Katherine + @Radia | Integration: RBAC boundary tests for all roles | 📋 Planned |
| W20-014 | REQ-LEASE-013 | P1 | Lease renewal + early termination UI flows in Tenant Portal: renewal acceptance, payment confirmation, termination request with reason | @Una | E2E: tenant-initiated renewal flow | 📋 Planned |
| W20-015 | All REQ-LEASE-* | P0 | Wave 20 closeout: governance validation, tracker sync, `npm run plans:validate` green | @Katherine | `npm run plans:validate` passes; trackers updated | 📋 Planned |

---

## Dependency Order

1. W20-001 (KYC) → W20-002 (PDF) → W20-003 (e-sign) → W20-004 (Ejari)
2. W20-005 (PDC schedule) → W20-006 (bounce workflow) → W20-007 (replacement)
3. W20-008 (renewal workflow) → W20-009 (termination)
4. W20-010 (Tenant Portal) + W20-011 (Landlord Portal) → W20-014 (portal flows)
5. W20-013 (RBAC) runs in parallel, validated before W20-015
6. All tasks → W20-015 (closeout)

---

## Acceptance Gate (Wave-Level)

Wave 20 can be marked complete only when:

1. Lease lifecycle (create → sign → Ejari → active → renewal/termination) is fully functional
2. PDC schedule → bounce → Form 12 → replacement flow is end-to-end verified
3. Tenant Portal and Landlord Portal render all states across all tabs
4. RBAC boundaries enforced and tested for all roles
5. All PDF outputs (tenancy agreement, Form 7, Form 12, quarterly statement) verified
6. `npm run plans:validate` passes
7. Evidence reflected in `PROJECT_PROGRESS.md` and `DAILY_MILESTONE_TRACKER.md`
