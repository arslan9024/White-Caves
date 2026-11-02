# Department 2: User Interface (UI/UX) View Primitive Architecture

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Una` — Principal UI Component Palette Architect  
> **Tech Stack:** React 18+, TypeScript, Tailwind CSS, Framer Motion, Radix UI  
> **Skill Reference:** [`.agents/skills/aegis-dept-02-ui-ux-primitives/SKILL.md`](../../skills/aegis-dept-02-ui-ux-primitives/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Una** *(Director)* | Principal UI Component Palette Architect | Designs atomic layout primitives matching strict 4-Way Folder Segregation standards. | [`config`](./node-01-una.agent.json) |
| 2 | **@Lea** | Responsive Viewport Framework Programmer | Develops dashboard layout systems to preserve perfect presentation symmetry across viewports. | [`config`](./node-02-lea.agent.json) |
| 3 | **@Marissa** | Luxury Design System CSS Token Engineer | Locks down system styling profiles, dark mode canvases, and corporate red variables (#EF4444). | [`config`](./node-03-marissa.agent.json) |
| 4 | **@Tracy** | Hardware-Accelerated Animation Core Specialist | Scripts interface micro-interactions and smooth component transition rules via Framer Motion. | [`config`](./node-04-tracy.agent.json) |
| 5 | **@Africa** | Client Symmetrical Layout Balance Engineer | Calculates geometry positions to locate floating UI tools symmetrically over view spaces. | [`config`](./node-05-africa.agent.json) |
| 6 | **@Lea_Verou** | Advanced Browser Styling Transpiler Specialist | Engineers specialized CSS workarounds to maintain visual parity across web view engines. | [`config`](./node-06-lea-verou.agent.json) |
| 7 | **@Rachel_Andrew** | Multi-Grid Layout Sizing Engineer | Maintains complex tabular matrix data positioning templates across dashboard screens. | [`config`](./node-07-rachel-andrew.agent.json) |
| 8 | **@Sara_Soueidan** | DOM Accessibility & ARIA Layout Auditor | Optimizes structural layout properties to pass strict platform usability validation checks. | [`config`](./node-08-sara-soueidan.agent.json) |
| 9 | **@Estelle_Weyl** | Mobile Web View Optimization Specialist | Truncates asset loading scripts to ensure instantaneous canvas component rendering times. | [`config`](./node-09-estelle-weyl.agent.json) |

---

## Key Codebase Ownership

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

## Operational Procedures

- **Component Render Test:** `npx vitest run src/components/`
- **Accessibility Audit:** `npx axe-core --tags wcag2a,wcag2aa`
- **TypeScript Check:** `npx tsc --noEmit --skipLibCheck`
- **Storybook Build:** `npm run storybook:build`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
