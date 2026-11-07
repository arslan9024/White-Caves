# 03. 4-Way Folder Architecture Standard

> **Document Code:** DOC-SWE-03  
> **Module ID:** `architecture`  
> **Category:** Frontend Architecture Standards  
> **Primary Authority:** @Una (CSS & UI Lead) & @Grace (Lead Engineer)  
> **Human Interactive Viewer:** [`src/data/auroraSoftwareDocsRegistry.ts` (Item Code: DOC-SWE-03)](file:///c:/Users/HP/Documents/My%20Web%20Sites/AntigravityWC/White-Caves/src/data/auroraSoftwareDocsRegistry.ts)

---

## 1. The Atomic 4-Folder Segregation Law
Every major component in the White Caves codebase MUST be organized into dedicated, co-located layers:

```
ComponentName/
├── ComponentName.tsx        # Pure View Layer (JSX markup, framer-motion animations)
├── ComponentName.logic.ts   # Pure Logic Layer (React hooks, state, handlers, data transforms)
├── ComponentName.styles.ts  # Pure Style Layer (Styled Components, CSS token bindings)
└── ComponentName.types.ts   # Pure Type Layer (TypeScript interfaces, props, models)
```

## 2. Benefits & Separation of Concerns
1. **Maintainability:** UI designers can modify markup and styling without risking regressions in complex business logic.
2. **Testability:** Business logic hooks (`.logic.ts`) can be tested independently with Vitest without mounting complex DOM trees.
3. **Machine Readability:** Static analysis tools and AI agents can accurately parse logic vs styling tokens.
