# Department 3: Cross-Platform Mobile Engine Engineering

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Iris` — Principal Cross-Platform Mobile Architect  
> **Tech Stack:** React Native / PWA, TypeScript, Capacitor, Expo  
> **Skill Reference:** [`.agents/skills/aegis-dept-03-mobile-engineering/SKILL.md`](../../skills/aegis-dept-03-mobile-engineering/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Iris** *(Director)* | Principal Cross-Platform Mobile Architect | Designs responsive layout definitions and native application build configurations. | [`config`](./node-01-iris.agent.json) |
| 2 | **@Cassie** | iOS Native App Integration Developer | Optimizes mobile asset processing pathways explicitly for Apple device deployment zones. | [`config`](./node-02-cassie.agent.json) |
| 3 | **@Fei-Fei** | Android Core System Runtime Programmer | Builds responsive client-side app files for deployment on Google OS architectures. | [`config`](./node-03-fei-fei.agent.json) |
| 4 | **@Anima** | Mobile Client Local Persistence Cache Developer | Configures secure offline memory spaces and transactional local synchronization parameters. | [`config`](./node-04-anima.agent.json) |
| 5 | **@Dina_Katabi** | Hardware Sensor Protocol Integrator | Binds mobile app assets directly to camera captures, biometric sensors, and GPS targets. | [`config`](./node-05-dina-katabi.agent.json) |
| 6 | **@Ayah_Bdeir** | Mobile Peripheral Communication Specialist | Manages local connection layers to tie mobile screens safely to telemetry loops. | [`config`](./node-06-ayah-bdeir.agent.json) |
| 7 | **@Limor_Fried** | Mobile Battery Consumption Optimizer | Refines data processing intervals to minimize battery drain during foreground sync loops. | [`config`](./node-07-limor-fried.agent.json) |
| 8 | **@Jerri_Ellsworth** | Mobile Canvas Hardware Graphics Programmer | Optimizes GPU rendering layers for fluid tracking transitions on small viewports. | [`config`](./node-08-jerri-ellsworth.agent.json) |
| 9 | **@Jade_Raymond** | Concurrent Mobile Thread Flow Engineer | Isolates application execution scripts from main UI threads to bypass layout rendering stalls. | [`config`](./node-09-jade-raymond.agent.json) |

---

## Key Codebase Ownership

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

## Operational Procedures

- **PWA Lighthouse Audit:** `npx lighthouse --preset=desktop --output=json`
- **Service Worker Test:** `npx vitest run src/utils/registerServiceWorker.test.ts`
- **Mobile Viewport Test:** `npx playwright test --project=mobile-chrome`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
