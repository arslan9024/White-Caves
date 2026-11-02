---
name: aegis-dept-02-ui-ux-primitives
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 2: User Interface (UI/UX) View Primitive Architecture"
---

# Department 2: User Interface (UI/UX) View Primitive Architecture

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Una` — Principal UI Component Palette Architect  
> **Tech Stack:** React 18+, TypeScript, Tailwind CSS, Framer Motion, Radix UI  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Una` *(Director)* | Principal UI Component Palette Architect | Designs atomic layout primitives matching strict 4-Way Folder Segregation standards. |
| 2 | `@Lea` | Responsive Viewport Framework Programmer | Develops dashboard layout systems to preserve perfect presentation symmetry across viewports. |
| 3 | `@Marissa` | Luxury Design System CSS Token Engineer | Locks down system styling profiles, dark mode canvases, and corporate red variables (#EF4444). |
| 4 | `@Tracy` | Hardware-Accelerated Animation Core Specialist | Scripts interface micro-interactions and smooth component transition rules via Framer Motion. |
| 5 | `@Africa` | Client Symmetrical Layout Balance Engineer | Calculates geometry positions to locate floating UI tools symmetrically over view spaces. |
| 6 | `@Lea_Verou` | Advanced Browser Styling Transpiler Specialist | Engineers specialized CSS workarounds to maintain visual parity across web view engines. |
| 7 | `@Rachel_Andrew` | Multi-Grid Layout Sizing Engineer | Maintains complex tabular matrix data positioning templates across dashboard screens. |
| 8 | `@Sara_Soueidan` | DOM Accessibility & ARIA Layout Auditor | Optimizes structural layout properties to pass strict platform usability validation checks. |
| 9 | `@Estelle_Weyl` | Mobile Web View Optimization Specialist | Truncates asset loading scripts to ensure instantaneous canvas component rendering times. |

---

## Key Codebase Files & Directories

- `src/components/`
- `src/pages/`
- `src/styles/`
- `src/hooks/`

---

## Mandatory Coding Rules

1. All components MUST follow 4-Way Folder Segregation: View (.view.tsx), Logic (.logic.ts), Style (.styles.ts), Data (.data.ts)
2. Design tokens: primary red #EF4444, dark background #1a1a2e, luxury gold #D4AF37
3. Dark mode must use CSS variables — never hardcode colors in components
4. All interactive elements require Framer Motion transitions (duration: 0.2s ease)
5. ARIA attributes required on every interactive element (buttons, links, modals)
6. Component files MUST NOT exceed 350 lines — split into sub-components
7. Tailwind classes only — no inline styles or external CSS files
8. Every component must be responsive: mobile-first with sm/md/lg/xl breakpoints

---

## Standard Operating Procedures

### Component Render Test
```bash
npx vitest run src/components/
```

### Accessibility Audit
```bash
npx axe-core --tags wcag2a,wcag2aa
```

### TypeScript Check
```bash
npx tsc --noEmit --skipLibCheck
```

### Storybook Build
```bash
npm run storybook:build
```

---

## Aegis V4.1 Governance (All Departments)

1. **Single Purpose File Law:** Every source file must have a single responsibility and remain under 350 lines.
2. **Canonical 5-Way File Standard:** View (`.view.tsx`), Logic (`.logic.ts`), Styles (`.styles.ts`), Data (`.data.ts`), Config (`.config.ts`).
3. **TypeScript Strict:** Zero warnings, zero `any` bypasses, zero `@ts-ignore` comments.
4. **Continuous Deduplication:** Zero duplicate handlers, zero ghost directories, zero redundant imports.
5. **Zero-Backlog Law:** All PRs and issues must be resolved before moving to the next sprint.
6. **Token Preservation Shield:** Hard 15,000 token ceiling per task — no runaway retry loops.
7. **Conventional Commits:** All commits must follow `feat|fix|chore|refactor|test|docs(scope): message` format.
