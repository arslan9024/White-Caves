# Deduplication Ledger & Code Consolidation Rules

**Last Updated:** 2026-07-16
**Status:** Active Governance Matrix

## 1. Abstraction Consolidation Protocol

- **Rule of One:** Multiple duplicate abstractions must be merged into clean, single-source implementations. For example, if multiple sidebar layouts exist (`RelationalSidebar.tsx`, `Sidebar.tsx`, `LegacySidebar.tsx`), they must be consolidated into a single extensible `GlobalSidebar.tsx` component.
- **Enforcement:** Code review gates (`adversarial-review.ps1`) will flag similar abstractions using AST comparisons.

## 2. Automated Dead-Code Removal

- **Routine Scans:** `dead-code-sweep.ps1` runs daily to detect unused components, old backup variables, unreferenced CSS modules, and dangling test utilities.
- **Action:** Any unused file untouched in 30 days must be permanently archived and deleted from the main src tree.

## 3. Strict Software Lifecycle

- **Version Skew Prevention:** Legacy endpoint versions (`/api/v1`) must have hard deprecation dates logged.
- **Migration Execution:** Once a feature flag achieves 100% rollout, the older codepath must be removed within the same sprint.

## 4. Known Deduplication Targets

| Subsystem | Duplicate Assets                         | Consolidation Target | Status                                                              |
| --------- | ---------------------------------------- | -------------------- | ------------------------------------------------------------------- |
| Layouts   | `Sidebar.tsx`, `LegacySidebar.tsx`       | `GlobalSidebar.tsx`  | Active — consolidation tracked through architecture governance.     |
| Config    | `.env.local.backup`, `.env.consolidated` | `.env`               | Active — backup/env cleanup governed by deduplication policy.       |
