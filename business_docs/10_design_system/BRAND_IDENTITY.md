# White Caves — Brand Identity Authority

**Effective Date:** 2026-04-27  
**Status:** ACTIVE SOURCE OF TRUTH

## 1) Core Brand Colors

- **Primary Brand Red:** `#E31E24`
- **Primary Dark Red:** `#B71C1C`
- **Primary Light Red:** `#EF5350`
- **Primary Canvas White:** `#FFFFFF`

These colors define the public-facing identity for White Caves.

## 2) Color Governance Rules

1. Public website pages must use the red/white brand baseline.
2. CRM and dashboard surfaces may use secondary accents, but must not override primary brand identity on public routes.
3. Error/destructive colors are semantic tokens and must remain distinct from primary branding where possible.
4. New UI work must use theme tokens (no hardcoded brand color literals in feature files).

## 3) Implementation Source of Truth

- `src/styles/theme/colors.ts`
- `src/styles/global.ts`
- `public/manifest.json`
- `index.html` (`meta[name="theme-color"]`)

## 4) Public vs CRM UX Boundary

- Public routes (`/`, `/about`, `/services`, `/contact`, `/properties`) must not render CRM sidebars or CRM data chrome.
- CRM shell (`AppLayout` with sidebar/topbar) is reserved for authenticated routes only.

## 5) Change Control

Any future branding changes must update:
1. This file
2. `business_docs/10_design_system/README.md`
3. `business_docs/10_design_system/color-palette.md`
4. Theme token implementation files listed above

This prevents design drift and keeps brand decisions auditable.
