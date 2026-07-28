# White Caves Real Estate — 300% Expanded Master Execution Plan

**Version:** 2026.07-TITAN-V4  
**Governance Standard:** [plans/PLANNING_GOVERNANCE.md](./PLANNING_GOVERNANCE.md)  
**Historical Log:** [plans/HISTORICAL_REQUESTS_AND_ACHIEVEMENTS.md](./HISTORICAL_REQUESTS_AND_ACHIEVEMENTS.md)  
**Three-Folder Knowledge Hierarchy:** `business_docs/` (Business Models & RERA) | `software_docs/` (Architecture & ADRs) | `plans/` (Roadmaps & History)  
**Owners:** @Ada (Chief Architect) + @Margaret (Strategic Planner)  
**Last Updated:** 2026-07-27  
**Readiness Threshold:** **95% Target Gate Passed — Execution Unlocked**

---

## 🎯 Strategic Core Directive & Brand Mandate (35-Point Reconstruction)

White Caves Real Estate LLC is Dubai's ultra-luxury digital property agency platform. All visual and technical interfaces MUST strictly adhere to the **Corporate Brand Palette & Superuser Security Laws**:

- **White Caves Red (`#EF4444`)**: Primary success badges, buttons, active menu states, and brand highlights.
- **Brilliant Crisp White (`#FFFFFF`)**: Primary application background canvas and card containers.
- **Deep Slate Gray (`#1E293B`)**: Contrast text headers, primary typography, and structural borders.
- **Founder Short-Circuit**: Profile `arslanmalikgoraha@gmail.com` is force-injected with `accessLevel: 5` (`LEVEL_5_MASTER`), bypassing lower-tier department blocks and landing directly on `ProfilePage.tsx`.

---

## 🗺️ Master Phase Architecture & ASCII Workflow Maps

```
[User Login / Hydration] ──► [Founder Email Check: arslanmalikgoraha@gmail.com]
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼ (Match)                             ▼ (Standard)
      [Force Level 5 Master Access]             [Hydrate RBAC Level 1-4]
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       │
                                       ▼
                       [UnifiedWorkspaceLayout Render]
                                       │
       ┌───────────────────────────────┼───────────────────────────────┐
       ▼                               ▼                               ▼
[Fixed Left Sidebar]          [Top Navbar Header]           [Main Content Area]
 (280px Grid Shell)           (Glassmorphism Gold)          (GPU View-Swapping)
       │                               │                               │
       ▼                               ▼                               ▼
[10 Department Nodes]        [Global Ctrl+K Search]         [100 Sector Viewports]
```

---

## 📂 Phase Bucket 1: Master Navigation & Structural Layout (Views 01 - 20)

### Visual Specification & Layout Bounds

- **Container**: Fixed left-anchored sidebar (`width: 280px`), top glassmorphism bar (`height: 64px`), viewport flex-1 (`background: #0f0f0f`).
- **Styling Tokens**: Border hairline `1px solid rgba(201, 168, 76, 0.25)`, scrollbar width `4px`, thumb background `#C9A84C`.
- **Responsive Media**: Below `768px`, sidebar collapses automatically, mounting `MobileBottomNav` and `MobileMenuDrawer`.

### ASCII Navigation Workflow

```
[Sidebar Item Click] ➔ [React Router Navigate] ➔ [Check Offline/Online Mode]
                                                         │
                                    ┌────────────────────┴────────────────────┐
                                    ▼                                         ▼
                        [Offline: Hydrate Mock]                   [Online: Redux Fetch]
                                    │                                         │
                                    └────────────────────┬────────────────────┘
                                                         │
                                                         ▼
                                             [Render Component View]
```

---

## 📂 Phase Bucket 2: 10-Department High-Density Control Dashboards (Views 21 - 50)

### 10 Registered Corporate Domains

1. **Sales & Leasing**: Inbound lead management, broker conversion matrices, deal pipeline.
2. **Operations**: 9,378-unit DAMAC Hills 2 spatial unit tracking, maintenance SLA dispatches.
3. **Communications**: 23+ WhatsApp lines unified stream, Nadia AI routing, 15-min SLA clocks.
4. **Finance**: AED/USD/EUR multi-currency conversion, Escrow balances, UAE FTA 5% VAT.
5. **Marketing**: Paid advertising campaign ROI attribution scoreboards, CPL density maps.
6. **Executive**: Full cross-department flight deck deck exclusively for Level 5 Founder account.
7. **Compliance**: RERA broker license tracking, DLD regulatory card verifications, AML screens.
8. **Technology**: System uptime telemetry, local cache memory metrics (`plans/AEGIS_CACHE.json`).
9. **Legal**: DLD Form 7 (Rent Notice 90-day), Form 12 (Eviction 12-mo), Form 6 (Ejari non-renewal).
10. **Intelligence**: Sentinel predictive neighborhood pricing index and building IoT heatmaps.

---

## 📂 Phase Bucket 3: Compensation Engines, Leaderboards & Workflows (Views 51 - 80)

### Gamified Broker Production & Leaderboard

- **Apex Podium**: Top 3 brokers with crown emblems, volume accelerator badges (70/30 split unlock).
- **Accounts Receivable Aging**: 30 / 60 / 90 / 120+ days aging columns for developer payouts.
- **Form 7 / 12 Workflow**: Chronological execution trackers with automated deadline notifications.

---

## 📂 Phase Bucket 4: AI Command Center & Security Middlewares (Views 81 - 100)

### AI Assistant Registry & Routing

- **Zoe (Investment & Strategy)**: Global executive query bar and P&L variance reports.
- **Nadia (Lead Qualifier & WhatsApp Router)**: Automated 15-minute SLA enforcement.
- **Sentinel (Security & IoT Telemetry)**: Building sensor anomaly heatmap monitors.

---

## 📂 Phase Bucket 5: Production Quality, Test Reliability & TODO Resolution (Wave 26)

- **Test Coverage**: Maintain 100% green test suite status across all server-side and client-side modules.
- **Code Health**: Systematically resolve developer TODOs, sweep technical debt, and prevent duplication.

---

## 📂 Phase Bucket 6: Portal Syndication, Careers & Advanced SEO (Wave 25)

### Portal Syndication Engine

- **PropertyFinder XML Feed**: Generated via `server/services/syndication/propertyFinderService.ts`. Trakheesi permit pre-check blocks syndication if expired. Cron every 4 hours.
- **Bayut JSON Feed**: Generated via `server/services/syndication/bayutService.ts` with `portal_sync_log`. Cron every 6 hours.
- **Cloudinary CDN Transforms**: All portal feed photo URLs auto-transformed: `f_auto,q_auto,w_1200,h_800,c_limit`.
- **Sync Health Dashboard**: `/admin/portals` — last sync time, success/failed/skipped counts, manual re-sync.

### Careers Portal

- **Public `/careers` page**: `JobPosting` JSON-LD schema, CV upload (PDF ≤ 5 MB), LinkedIn URL, RERA BRN.
- **Acknowledgement Emails**: Resend template delivery within 2 minutes of application submit.
- **Application Kanban**: 6 stages (Applied → HR Screening → Interview Scheduled → Offer Extended → Hired / Rejected).

### Community Management

- **Announcements**: FCM push + WhatsApp template to building/floor/all scope within 30 seconds.
- **Facility Bookings**: Max 2 active bookings/unit, capacity limits, conflict detection, 24h cancellation policy.
- **Service Charges**: `service_charges` collection, quarterly invoice generation, overdue escalation alerts.
- **Events & RSVP**: `maxAttendees` enforcement, 409 on capacity breach, full RSVP list for community manager.

### Advanced SEO

- **JSON-LD Schemas**: `RealEstateListing` (property detail), `LocalBusiness`+`RealEstateAgent` (homepage), `JobPosting` (careers), `FAQPage` (FAQ).
- **Hreflang**: EN + AR + `x-default` on all public pages; `/ar/properties/...` Arabic URL routing.
- **Auto-Sitemap**: Updates within 60 seconds of `property.published`, `job.published`, `blog.published` events.
- **Image SEO**: Auto-generated `alt` text from property fields; WebP via Cloudinary; lazy loading below fold.

---

## 📂 Phase Bucket 7: Multi-Currency, Dependency Graph & RERA 2025/26 (V5.2)

### Multi-Currency Engine

| Currency | Symbol | Rate Source       | Supported Operations                          |
| -------- | ------ | ----------------- | --------------------------------------------- |
| AED      | د.إ    | Base (1.00)       | Primary currency for all UAE transactions      |
| USD      | $      | Live / Stored     | International buyer portal + reporting         |
| EUR      | €      | Live / Stored     | European investor dashboards                   |
| GBP      | £      | Live / Stored     | UK buyer segment analytics                     |
| SAR      | ر.س   | Live / Stored     | GCC regional leasing and purchase volumes       |

**Implementation**: `server/routes/currency.ts` — `/api/v1/currency/rates` endpoint with 15-minute cache TTL.  
**Frontend**: `FinanceView.tsx` currency toggle (AED / USD / EUR) with zero-overhead local calculation.

### Module Dependency Graph

```
[Auth + RBAC Layer]
       │
       ▼
[UnifiedWorkspaceLayout.tsx]
  ├── [Sidebar Navigation] ──► [React Router v6 Outlet]
  ├── [Top Navbar] ──► [Global Search Ctrl+K] + [Notification Bell]
  └── [Content Canvas] ──► [Department View Components]
                                  │
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
  [Sales & CRM Layer]    [Finance & Analytics]    [AI Command Center]
  ├── LeadsTab.tsx        ├── FinanceView.tsx      ├── AICommandCenter.tsx
  ├── ClientsTab.tsx      ├── commissionEngine.ts  ├── NadiaPage.tsx
  └── PropertiesPage.tsx  └── dubaiFinanceEngine.ts └── AssistantsTab.tsx
          │                       │                       │
          ▼                       ▼                       ▼
  [MongoDB Collections]  [UAE VAT + AED Engine]   [Socket.IO Real-Time]
  ├── leads              ├── vat_returns           ├── whatsapp events
  ├── properties         ├── commission_splits     └── push_notifications
  └── clients            └── ar_aging_buckets
          │
          ▼
  [Syndication Layer]          [Mock/Integration Services]
  ├── propertyFinderService.ts  ├── dldMockService.ts
  └── bayutService.ts           └── ejariMockService.ts
```

### RERA 2025/26 Compliance Requirements

| Requirement                   | RERA Form / Article                    | Status         | Implementation File                          |
| ----------------------------- | -------------------------------------- | -------------- | -------------------------------------------- |
| Broker License Renewal        | RERA License Form 201                  | ✅ Tracked     | `server/routes/compliance.ts`                |
| DLD Form 7 — Rent Notice      | Tenancy Law Art. 25 (90-day notice)    | ✅ Implemented | `server/routes/contracts.js`                 |
| DLD Form 12 — Eviction        | Tenancy Law Art. 25 (12-month)         | ✅ Implemented | `server/routes/contracts.js`                 |
| DLD Form 6 — Ejari Non-Renew  | Ejari Regulation Art. 6               | ✅ Implemented | `server/routes/leases.ts`                    |
| Oqood Registration            | Off-Plan Law No. 13/2008               | ✅ Mock        | `server/services/mock/dldMockService.ts`     |
| Ejari Tenancy Registration    | RERA Circular 2025-01                  | ✅ Mock        | `server/services/mock/ejariMockService.ts`   |
| AML Screening                 | UAE Federal Law No. 20/2018            | ✅ Implemented | `server/routes/compliance.ts`                |
| RERA No-Objection Certificate | Strata Law JOP 2010 Art. 54           | 📋 Planned     | Q3 2026                                      |
| PDPL Data Subject Rights      | UAE PDPL Federal Decree 45/2021        | ✅ Implemented | `server/routes/users.ts` + GDPR middleware   |
| Trakheesi Portal Permit       | RERA Marketing Permit Regulation 2024  | ✅ Validated   | `server/services/syndication/propertyFinderService.ts` |

---

## 🏁 Platform Completion Status (As of 2026-07-27)

| Wave | Focus Area                                | Status       | Completion |
| ---- | ----------------------------------------- | ------------ | ---------- |
| 09   | UX Hardening                              | ✅ Complete  | 100%       |
| 10   | Performance + SEO                         | ✅ Complete  | 100%       |
| 11   | Incomplete Features                       | ✅ Complete  | 100%       |
| 12   | Automation Engine                         | ✅ Complete  | 100%       |
| 13   | Real-Time + Media                         | ✅ Complete  | 100%       |
| 14   | Product Features                          | ✅ Complete  | 100%       |
| 15   | Cache + PWA                               | ✅ Complete  | 100%       |
| 16   | Security Hardening                        | ✅ Complete  | 100%       |
| 17   | Full UI/UX Luxury                         | ✅ Complete  | 100%       |
| 18   | Workflow Parity + Competitor Audit        | ✅ Complete  | 100%       |
| 19   | Identity & Access v2                      | ✅ Complete  | 100%       |
| 20   | RBAC Hardening                            | ✅ Complete  | 100%       |
| 21   | Finance, UAE VAT, Commission              | ✅ Complete  | 100%       |
| 22   | Market Intelligence + AVM                 | ✅ Complete  | 100%       |
| 23   | Mobile CRM + PWA Offline                  | ✅ Complete  | 100%       |
| 24   | WhatsApp + AI Chat Engine                 | ✅ Complete  | 100%       |
| 25   | Portals, Careers, SEO, Community          | ✅ Complete  | 100%       |
| 26   | Production Quality & Audit                | ✅ Complete  | 100%       |
| Wave 27 | Autonomous Unit Test Expansion & Verification | ✅ Complete  | 100%       |
| Wave 28 | Admin Cockpit & Portal Health Unit Test Suites | ✅ Complete  | 100%       |
| Wave 29 | Advanced PWA Offline Write & CRDT Engine       | ✅ Complete  | 100%       |
| Wave 30 | AI Predictive UX & Mouse Trajectory Pre-Fetch  | 🟢 Active   | 100%       |

**Overall Platform Readiness: 95%** — All 18 waves complete. Remaining 5% = live production deployment + final E2E validation.
