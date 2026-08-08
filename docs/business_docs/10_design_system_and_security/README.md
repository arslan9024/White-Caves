# 10 — Design System Specification

<!-- markdownlint-disable MD060 -->

**Status:** Transitional (Reference-Only)  
**Owner:** UX + Security Documentation Governance  
**Last Updated:** 2026-08-07  
**Next Review:** 2026-08-21  
**Source of Truth:** Historical reference lane only; active authority has moved to canonical folders

## Canonical supersession targets

- [`../06_design_architecture/`](../06_design_architecture/)
- [`../05_requirements/`](../05_requirements/)
- [`../09_user_roles_permissions/`](../09_user_roles_permissions/)
- [`../TRANSITIONAL_DIRECTORY_SUPERSESSION_MAP_2026-08-07.md`](../TRANSITIONAL_DIRECTORY_SUPERSESSION_MAP_2026-08-07.md)

## Feed targets

- `docs/business_docs/06_design_architecture/`
- `docs/business_docs/05_requirements/non-functional-requirements.md`
- `docs/business_docs/09_user_roles_permissions/`

Authoritative design system documentation for the White Caves Real Estate platform.

> **Brand Authority (effective 2026-04-27):**
> Primary brand scheme is **Red + White** (not Gold-first).
> Source of truth: `src/styles/theme/colors.ts` + `src/styles/global.ts`.

## Documents in This Section

| File | Description |
|------|-------------|
| `color-palette.md` | Complete luxury gold color palette with usage guidelines |
| `typography.md` | Font families, scale, weights, and responsive typography |
| `component-specs.md` | Design system component specifications and variants |
| `spacing-layout.md` | Spacing system, layout grid, and responsive breakpoints |
| `BRAND_IDENTITY.md` | Authoritative brand colors, usage rules, and implementation references |

## Design Philosophy

White Caves employs a premium design language reflecting Dubai's real estate market while preserving the brand identity baseline:

- **Primary:** Red (#E31E24) — Core White Caves identity and primary actions
- **Canvas:** White (#FFFFFF) — Core background and content contrast
- **Accent:** Emerald (#2E5A4F) — Growth, stability, Dubai heritage
- **Background:** Sand (#F5E6D3) — Warmth, desert elegance
- **Dark:** Charcoal (#2C2C2C) — Sophistication, contrast
- **Typography:** Poppins (headings) + Inter (body) — Modern, clean, professional
- **Motion:** Subtle micro-interactions via Framer Motion — Feels alive without distraction
