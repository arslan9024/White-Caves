---
name: aegis-dept-03-mobile-engineering
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 3: Cross-Platform Mobile Engine Engineering"
---

# Department 3: Cross-Platform Mobile Engine Engineering

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Iris` — Principal Cross-Platform Mobile Architect  
> **Tech Stack:** React Native / PWA, TypeScript, Capacitor, Expo  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Iris` *(Director)* | Principal Cross-Platform Mobile Architect | Designs responsive layout definitions and native application build configurations. |
| 2 | `@Cassie` | iOS Native App Integration Developer | Optimizes mobile asset processing pathways explicitly for Apple device deployment zones. |
| 3 | `@Fei-Fei` | Android Core System Runtime Programmer | Builds responsive client-side app files for deployment on Google OS architectures. |
| 4 | `@Anima` | Mobile Client Local Persistence Cache Developer | Configures secure offline memory spaces and transactional local synchronization parameters. |
| 5 | `@Dina_Katabi` | Hardware Sensor Protocol Integrator | Binds mobile app assets directly to camera captures, biometric sensors, and GPS targets. |
| 6 | `@Ayah_Bdeir` | Mobile Peripheral Communication Specialist | Manages local connection layers to tie mobile screens safely to telemetry loops. |
| 7 | `@Limor_Fried` | Mobile Battery Consumption Optimizer | Refines data processing intervals to minimize battery drain during foreground sync loops. |
| 8 | `@Jerri_Ellsworth` | Mobile Canvas Hardware Graphics Programmer | Optimizes GPU rendering layers for fluid tracking transitions on small viewports. |
| 9 | `@Jade_Raymond` | Concurrent Mobile Thread Flow Engineer | Isolates application execution scripts from main UI threads to bypass layout rendering stalls. |

---

## Key Codebase Files & Directories

- `src/components/`
- `src/hooks/`
- `src/utils/registerServiceWorker.ts`
- `src/utils/offlineCRDT.ts`

---

## Mandatory Coding Rules

1. PWA service worker must be registered via registerServiceWorker.ts
2. Offline-first: all critical data must be cached in IndexedDB via offlineCRDT.ts
3. Touch targets must be minimum 44x44px for mobile accessibility
4. Images must use srcset with WebP fallbacks for bandwidth optimization
5. GPS/camera access must request permissions gracefully with fallback UI
6. Battery-conscious: reduce background sync intervals on low battery
7. GPU-accelerated animations only — use transform/opacity, never top/left
8. Main thread must never be blocked — use Web Workers for heavy computation

---

## Standard Operating Procedures

### PWA Lighthouse Audit
```bash
npx lighthouse --preset=desktop --output=json
```

### Service Worker Test
```bash
npx vitest run src/utils/registerServiceWorker.test.ts
```

### Mobile Viewport Test
```bash
npx playwright test --project=mobile-chrome
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
