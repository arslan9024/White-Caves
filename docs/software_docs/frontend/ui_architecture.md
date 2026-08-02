# RUP Frontend UI/UX Architecture Specification

**Document Class:** FE-ARCH-001  
**Module:** User Interface Design System & Layout Core  
**Version:** 2026.08-FE-V1  
**Owner:** @Una (CSS Specialist) + @Lea (UI Engineer)  
**Status:** ✅ Active — Strict Enforcement  

---

## 1. The Three-Folder Isolation Rule (View-Logic-Style Separation)

All enterprise React components across `src/components/` must be structured using the 3-Folder Isolation Rule:

1. **`*.tsx` (The Pure Graphic View)**:
   - Contains JSX element structures, ARIA accessibility attributes, and Framer Motion animations.
   - Strictly stateless or consumes state via logic hooks. Zero inline calculations or API fetching.

2. **`*.logic.ts` (The Logic Controller Hook)**:
   - Contains state management, side effects, API fetchers, data formatters, and form handlers.
   - Returns clean, typed state objects and callbacks to the View.

3. **`*.style.ts` (The Styled-Component Module)**:
   - Houses all styled-components CSS definitions, layout grids, and media queries.
   - Hardcoded to White Caves Design System CSS variable tokens.

---

## 2. Universal Color & Theme Lockdown

- **White Caves Red (`var(--wc-red-primary, #EF4444)`)**: Primary brand highlights, active menu items, submit buttons, KPI trend markers, and alert badges.
- **Brilliant Crisp White (`var(--wc-bg-card, #FFFFFF)`)**: App background canvas, card surfaces, and modal backgrounds.
- **Deep Slate Gray (`var(--wc-text-primary, #1E293B)`)**: Primary typography headers, navigation sidebars, and high-contrast text elements.
- **Subtle Slate (`var(--wc-border-light, #E2E8F0)`)**: Card borders, table dividers, and input borders.

*Banned Colors:* Obsidian Black sheets, raw un-themed gold gradients, and emerald greens outside status badges.

---

## 3. Navigation Shell Contract

- **Fixed Top Navbar (`TopNavbar.tsx`)**: Fixed at `top: 0; z-index: 1000; height: 70px; background: #FFFFFF; border-bottom: 1px solid #E2E8F0;`.
- **Floating Search Pill (`FloatingSearchPill.tsx`)**: Centered at `top: 80px; z-index: 990;`. Triggers Framer Motion global search modal.
- **Collapsible 12-Department Left Sidebar (`UnifiedWorkspaceLayout.tsx`)**: Houses 1-12-108 organizational hierarchy department links.
