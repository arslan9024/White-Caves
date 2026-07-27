# ADR-003 — Lazy-Loaded CRM Module Registry Pattern

**Status:** Accepted  
**Date:** 2026-03-10  
**Owners:** @Una + @Mira  
**Related files:** `src/config/crmModuleRegistry.tsx`, `src/pages/UnifiedDashboardPage.tsx`,
`src/components/crm/FeatureRenderer.jsx`, `src/pages/crm/CRMHubPage.tsx`

---

## Context

White Caves CRM grew from ~8 functional modules in Phase 1 to 28+ modules (Zoe,
Nadia, Clara, Mary, Nina, Nancy, Sophia, Daisy, Theodora, Olivia, Laila, Aurora,
Hazel, Willow, Linda, Henry, Evangeline, Sentinel, Hunter, Henry Audit, Cipher,
Atlas, Vesta, Juno, Kairos, Maven, and more planned through Wave 25).

Loading all 28 module components at application startup would produce a single JS
bundle that exceeds 4 MB gzipped — unacceptable for the mobile-first luxury UX
target (LCP < 2.5 s on 4G). Each module imports its own chart libraries, map
components, and AI SDK clients.

Additionally, different user roles should see different subsets of modules:
a standard agent should never load the Evangeline Legal or Kairos Luxury modules,
even if they exist in the bundle.

---

## Decision

**Centralise all CRM module metadata and lazy-loaders in a single registry file
(`src/config/crmModuleRegistry.tsx`) and render modules on demand via
`FeatureRenderer.jsx`.**

Each entry in the registry declares:
- `id` — stable module identifier (used in navigation slice + URL hash)
- `label` — display name
- `icon` — icon class or emoji
- `zone` — one of: `executive | sales_leads | inventory_listings | leasing_contracts | finance_compliance | ai_command`
- `Component` — React.lazy() import (code-split at build time by Vite)
- `roles` — optional allow-list of roles that may access this module
- `section` — optional grouping label (e.g., "Advanced") per user preference

`FeatureRenderer.jsx` renders the `<Suspense>` wrapper with the Wave 09 skeleton
library as the fallback, ensuring every module shows a loading skeleton instead of
a blank white panel on first load.

---

## Alternatives Considered

| Alternative | Reason Rejected |
| --- | --- |
| **Monolithic bundle (no code splitting)** | 4 MB+ initial bundle; LCP target unachievable on mobile. Ruled out at Wave 09 performance audit. |
| **Route-based code splitting only** | Splits the bundle by page (e.g., `/crm`), but all modules on the `/crm` page would still be loaded together. The CRM is a single-page SPA with tab-based navigation, so route splitting alone does not help. |
| **Dynamic `import()` inline at each usage site** | Works technically but creates implicit, undiscoverable module dependencies scattered across dozens of components. The registry pattern creates a single auditable manifest of all modules. |
| **Module federation (Webpack 5 / Vite federation)** | Significant added build complexity. Module federation is appropriate for independently deployed micro-frontends; White Caves deploys as a single Vercel deployment. Overkill for this use case. |
| **Per-role separate builds** | Would require building and deploying N separate bundles. Operationally expensive and negates the single-deployment model. |

---

## Consequences

### Positive

- Vite automatically creates a separate chunk for each `React.lazy()` import in
  the registry, reducing the initial bundle to core shell + eagerly-loaded modules only.
- Adding a new CRM module is a one-line change to `crmModuleRegistry.tsx` — no
  changes to routing, sidebar, or dashboard layout code.
- Role-based filtering is enforced at the registry level before any component code is
  loaded, preventing accidental access to restricted modules.
- The `section: "Advanced"` field allows low-priority modules to be grouped in an
  "Advanced" section per user preference.

### Negative / Risks

- **Registry is a single point of configuration:** A typo in the `id` field will
  silently break navigation-slice state sync.
- **Lazy boundary error handling:** If a module's chunk fails to load (network error),
  the `<Suspense>` fallback remains forever unless an `ErrorBoundary` wraps
  `FeatureRenderer`. Wave 09 wired the ErrorBoundary — this must not be removed.
- **Role check is client-side only:** The registry's `roles` field prevents rendering,
  but does not prevent a determined user from directly calling the module's backend
  route. Server-side RBAC middleware (`requireMinRole` / `requirePermission`) is the
  authoritative enforcement layer.
