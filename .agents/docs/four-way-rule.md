# Four-Way File Separation Rule (Mandatory)

**Status:** Binding for all product UI components  
**Effective:** 2026-10-24  
**Authority:** Level 5 Managing Director / AEGIS governance

---

## Rule

Every UI component in `src/` **must** follow co-located four-way separation:

| File | Responsibility | Forbidden |
|------|----------------|-----------|
| `*.tsx` (View) | Markup, composition, accessibility attributes | Business logic, API calls, raw hex, inline complex style objects |
| `*.logic.ts` | Hooks, handlers, selectors, side-effect wiring | JSX |
| `*.style.ts` | styled-components / CSS-in-JS / token-based styles | Business rules, fetch |
| `*.data.ts` | Static copy, maps, option lists, layout constants | Runtime I/O |

Legacy single-file `.jsx` / `.css` components are **debt**. They must be migrated on touch (any non-trivial change) or via a dedicated consolidation wave.

---

## Folder shape (canonical)

```text
src/components/<Area>/<ComponentName>/
  ComponentName.tsx
  ComponentName.logic.ts
  ComponentName.style.ts
  ComponentName.data.ts
  ComponentName.test.tsx   # optional but preferred for high-traffic
```

Small presentational atoms may live as a folder of the same four files; do not invent a fifth “god” file.

---

## Enforcement (how we make it a “rule”, not a wish)

1. **Documentation** — This file + README badge/section.  
2. **PR checklist** — `.github/PULL_REQUEST_TEMPLATE.md` includes a 4-way checkbox.  
3. **CI / lint intent** — Prefer ESLint path rules or a small `scripts/check-four-way.js` gate that fails if a new component under `src/components/**` lacks the four siblings (allowlist for true atoms only).  
4. **AEGIS lane** — Frontend & UX department (Dept 3) owns migrations; SQA (Dept 8) owns the gate.

Until the automated gate is wired, reviewers **must** reject PRs that add new non-compliant components.

---

## Migration policy (mixed-era code)

1. **No big-bang rewrite** of every file in one PR.  
2. **On touch** → convert that component to four-way + TypeScript.  
3. **Consolidation waves** — scheduled AEGIS waves list remaining `.jsx`/`.css` pairs and convert by area (home, crm, auth, contracts).  
4. **Dedup** — before migrating, search for duplicate handlers/views; extract shared logic to `src/shared` or `src/utils` once.

---

## Exceptions (narrow)

- Generated files  
- Third-party wrappers with zero product logic  
- One-off scripts under `scripts/` / `aegis/`  

Exceptions must be listed in `docs/governance/FOUR_WAY_ALLOWLIST.md` if permanent.
