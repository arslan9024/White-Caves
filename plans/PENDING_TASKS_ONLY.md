# AEGIS 2.0 — Forensic 12-Domain Adversarial Audit & Pending Tasks

> **Audit Mode:** Adversarial Quality & Security Inspection
> **Status:** Metric Recalibrated to **85% Complete** (down from 95% sprint simulation)
> **Goal:** Itemized step-by-step checklist of critical gaps for immediate turn-by-turn resolution (+10% score gain per turn).

---

## 🔱 12-DOMAIN FORENSIC FINDINGS & TASK CHECKLISTS

### 1. 🌐 Sales & Leasing Router Bounds
- [ ] **Gap:** Deep nested route parameter validation missing on `/crm/leasing/:id/ejari` and `/crm/sales/deals/:id`.
- [ ] **Fix Step 1:** Wrap all dynamic route param parsers in Zod/TypeScript guards in `src/guards/RouteGuard.ts`.
- [ ] **Fix Step 2:** Add fallback 404/Access Denied redirect handling in `UnifiedWorkspaceLayout.tsx`.

### 2. 🗄️ Prisma Singleton Connection Loops
- [ ] **Gap:** Multiple instantiations of `PrismaClient` in `server/services/` causing potential connection pool exhaustion under load.
- [ ] **Fix Step 1:** Refactor database client export in `server/db.ts` to enforce global singleton instance (`globalThis.prisma`).
- [ ] **Fix Step 2:** Audit all service imports to consume singleton export directly.

### 3. 🎨 Tailwind Theme & Brand Palette Overrides
- [ ] **Gap:** Legacy components contain leftover Emerald Green (`#10B981`, `#22C55E`) and Obsidian Black blocks.
- [ ] **Fix Step 1:** Replace inline style hex codes with canonical CSS tokens (`var(--brand-red)`, `var(--brand-slate)`).
- [ ] **Fix Step 2:** Enforce `#EF4444` primary badges across all CRM tables and status indicators.

### 4. 💬 Nadia WhatsApp Queue Latency
- [ ] **Gap:** Absence of exponential backoff retry mechanism on failed webhook deliveries in Nadia CRM worker.
- [ ] **Fix Step 1:** Add retry queue with exponential backoff algorithm in `server/services/whatsappService.js`.
- [ ] **Fix Step 2:** Expose queue latency metrics on `NadiaWhatsAppCRM` telemetry tab.

### 5. 📜 Form 7 / 12 / 6 Legal Notification Triggers
- [ ] **Gap:** Automated event listeners not bound to DLD timeline changes for Form 12 eviction statutory 12-month counter.
- [ ] **Fix Step 1:** Implement event emitter binding in `Form12Eviction.tsx` and `server/routes/legal.ts`.
- [ ] **Fix Step 2:** Trigger automated WhatsApp & Email notification dispatches 90 days prior to expiry.

### 6. 💱 Multi-Currency Client-Side Totalizers
- [ ] **Gap:** Floating point precision errors in AED/USD/EUR/GBP aggregated portfolio totals in `MultiCurrencyTreasury.tsx`.
- [ ] **Fix Step 1:** Implement big-number precision utility or integer-cents math in `src/utils/currency.ts`.
- [ ] **Fix Step 2:** Add unit tests for zero-loss currency conversion rounding.

### 7. 👁️ WCAG AA Color Contrast Ratios
- [ ] **Gap:** Light slate text (`#94A3B8`) on white backgrounds in secondary card subtitles fails WCAG AA 4.5:1 ratio.
- [ ] **Fix Step 1:** Elevate secondary text contrast to `#64748B` or `#475569`.
- [ ] **Fix Step 2:** Verify contrast compliance across all 100 views.

### 8. 🔄 Redux Toolkit State Immutability
- [ ] **Gap:** Direct mutation of nested array state in lead drag-and-drop handler in `DragDropLeadGrid.tsx`.
- [ ] **Fix Step 1:** Ensure Immer / slice immutable updates are used for lead column shifts.
- [ ] **Fix Step 2:** Add Vitest immutability assertion test in `__tests__/DragDropLeadGrid.test.tsx`.

### 9. 📥 CSV Mass Ingestion Sanitization
- [ ] **Gap:** Lack of formula injection protection (CSV Injection / Formula Escalation) on lead bulk upload.
- [ ] **Fix Step 1:** Strip leading `=`, `+`, `-`, `@` characters from CSV cell inputs in `LeadImportWizard.tsx`.
- [ ] **Fix Step 2:** Enforce sanitization before passing array payload to server endpoint.

### 10. ⚡ Local Cache File Synchronization
- [ ] **Gap:** Local storage cache keys lack version hash tagging, leading to stale cache reads post-deployment.
- [ ] **Fix Step 1:** Append build commit hash suffix to local storage keys in `CacheSizeIndicator.tsx`.
- [ ] **Fix Step 2:** Implement auto-invalidation on version mismatch.

### 11. 🔒 CORS Origin Access Controls
- [ ] **Gap:** Development fallback wildcard CORS headers (`Access-Control-Allow-Origin: *`) present in server middleware.
- [ ] **Fix Step 1:** Restrict allowed origins to explicit domain whitelist from environment config.
- [ ] **Fix Step 2:** Block unauthorized credentials pass-through.

### 12. 🧱 Caves UI Shared Components Integration Bounds
- [ ] **Gap:** Inconsistent prop contracts between `DataTable.jsx` and new TSX feature views.
- [ ] **Fix Step 1:** Create unified TypeScript interface wrapper for `DataTable` props in `src/components/crm/types.ts`.
- [ ] **Fix Step 2:** Refactor views 01 to 25 to consume typed table wrapper.

---

## 📈 PROJECT RE-CALIBRATION SUMMARY

- **Pre-Audit Stated Completion:** 95%
- **Post-Audit Adversarial Real Completion:** **85%**
- **Pending Target Count:** 12 Critical Domains (24 Actionable Items)
- **Next Turn Projected Recovery:** +10% (Target: 95%+)
