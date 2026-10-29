# Five-Way File Category Standard & Single Purpose File Law

> **Canonical Architecture Rule — White Caves Real Estate LLC**  
> Enforced across all domains, features, pages, and components.

---

## 1. The 5-Way File Category Standard

Every feature, page, and complex component folder is strictly divided into **5 distinct file categories**:

```
[FeatureName]/
├── FeatureName.tsx         ← [1. VIEW]   Pure JSX rendering & presentation
├── FeatureName.logic.ts    ← [2. LOGIC]  Custom hooks, state, handlers, business rules
├── FeatureName.styles.ts   ← [3. STYLES] Styled-components, tokens, responsive CSS
├── FeatureName.data.ts     ← [4. DATA]   Static registries, options, mock seed lists
└── FeatureName.config.ts   ← [5. CONFIG] TypeScript interfaces, types, schemas, flags
```

### Layer Definitions & Responsibilities

| Layer | File Pattern | Allowed Content | Strictly Forbidden Content |
|---|---|---|---|
| **1. View** | `*.tsx` / `*.view.tsx` | JSX markup, semantic HTML, layout composition | Inline business logic, direct network fetches, raw style declarations |
| **2. Logic** | `*.logic.ts` / `use*.ts` | Custom React hooks (`useState`, `useMemo`), handlers, calculations | JSX markup, DOM styling, hardcoded static lists |
| **3. Styles** | `*.styles.ts` | Styled-components, CSS variables, `@media` queries | State hooks, API calls, business logic |
| **4. Data** | `*.data.ts` / `*.registries.ts` | Static arrays, dropdown options, lookup maps | Runtime state hooks, side-effects, mutable data |
| **5. Config** | `*.config.ts` / `*.types.ts` | TypeScript `interface`, `type`, Zod schemas, feature flags | Component rendering, hooks, side-effects |

---

## 2. The Single Purpose File Law

1. **One Responsibility per File:**
   - Every file must have exactly one reason to change.
   - Do not mix database models, route handlers, and data transformation scripts in a single file.

2. **Bite-Sized Modular Files:**
   - Aim for files under 250–350 lines of code.
   - Files exceeding 400 lines must be evaluated for decomposition into focused sub-modules.

3. **Maximum UI Component Reuse:**
   - Always reuse core design system components located in `src/components/ui/` (`Button`, `Badge`, `Card`, `Modal`, `Input`, `SearchableSelect`).
   - Do not write custom inline button styles or badge markup when a shared component exists.

4. **Zero Code Duplication:**
   - Consolidate repeated formatting helpers (e.g. `formatAED()`, `formatDate()`) into `src/utils/`.
   - Never duplicate role checks, token parsers, or API fetch wrappers.

---

## 3. Compliance Checklist for All Agents & Engineers

- [ ] Does this file have only one primary purpose?
- [ ] Is JSX separated from business logic custom hooks?
- [ ] Are styled-components extracted into `*.styles.ts`?
- [ ] Are static lists and registries placed in `*.data.ts`?
- [ ] Are TypeScript types and interfaces isolated in `*.config.ts`?
- [ ] Is the file size minimized and easy to test?

