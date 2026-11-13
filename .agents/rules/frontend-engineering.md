# White-Caves Frontend — Antigravity Engineering Rules

## 1. Core Directives

- **Zero-Token Scripts & Targeted Tests:** When testing React components or hooks, run single-file Vitest commands (`npx vitest run <path/to/test>`) rather than full test suites.
- **Tailwind & UI Primitives:** Follow the established White Caves luxury design system (`#EF4444`, glassmorphism, native RTL support `dir="rtl"`).
- **TypeScript Strictness:** Never introduce `any` types; export strong type definitions alongside components.
- **Single-Purpose Files:** Maintain a soft ceiling of <= 350 lines per file by decomposing large view logic into hooks and subcomponents.
