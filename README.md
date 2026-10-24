# White Caves Real Estate LLC — Global Digital Asset Ecosystem

[![DET](https://img.shields.io/badge/DET_License-1388443-red.svg)](https://whitecaves.com)
[![RERA](https://img.shields.io/badge/RERA_ORN-44483-blue.svg)](https://whitecaves.com)
[![Formula](https://img.shields.io/badge/Staff-1--12--108-0F172A.svg)](PROJECT_VISION.md)
[![Agents](https://img.shields.io/badge/Agents-%E2%89%A5121-EF4444.svg)](docs/governance/AGENT_ROSTER_1_12_108.md)

---

## Governance (2026-10-24)

| Rule | Detail |
|------|--------|
| **Staff** | **1** MD · **12** department managers · **108** supervisors (**9 per department**) |
| **Agents** | **≥121**, organised under 1–12–108 — **do not trim** |
| **Dept 8** | **Software Quality & Testing (SQA)** |
| **UI** | **Four-way mandatory** for all components — [FOUR_WAY_RULE.md](docs/governance/FOUR_WAY_RULE.md) |
| **AEGIS** | Full power retained; **organise** by lane — [AEGIS_ORGANISATION.md](docs/governance/AEGIS_ORGANISATION.md) |
| **Testing** | Lean, high-value — [TESTING_POLICY.md](docs/governance/TESTING_POLICY.md) |

**Vision:** [PROJECT_VISION.md](PROJECT_VISION.md) · **Progress:** [PROJECT_PROGRESS_REPORT.md](PROJECT_PROGRESS_REPORT.md) · **Daily:** [DAILY_MILESTONE_TRACKER.md](DAILY_MILESTONE_TRACKER.md)

---

## Technology

- **Frontend:** React 18 + Vite · TypeScript · Redux Toolkit · styled-components · Framer Motion  
- **i18n:** English · Arabic (RTL) · Spanish · Russian  
- **Brand:** Red `#EF4444` · White `#FFFFFF` · Slate `#0F172A` / `#1E293B`  
- **Data:** Prisma + MongoDB  
- **Component standard:** `View.tsx` / `.logic.ts` / `.style.ts` / `.data.ts` (all UI)

---

## 12 Corporate Departments

1. Executive & Architecture  
2. Research Intelligence  
3. Frontend & UX Architecture  
4. Backend & API Systems  
5. Database & Data Pipelines  
6. Security, Compliance & Legal  
7. DevOps & Infrastructure  
8. **Software Quality & Testing**  
9. Finance & VAT Analytics  
10. Sales & CRM Operations  
11. Communications & Marketing  
12. Operations & Facility Maintenance  

---

## Getting started

```bash
npm install
npm run dev
npm run typecheck          # 0 errors required on main
npm run test:run
npm run build
node scripts/check-four-way.mjs   # 4-way vs legacy inventory (report)
npm run aegis:health              # AEGIS health (organised, not removed)
```

---

## Recent deliveries (2026-10-24)

| Area | Status |
|------|--------|
| Governance 1–12–108 + 4-way rule + SQA policy | On `main` (#2527) |
| Homepage Hero four-way + EN/AR RTL | On `main` (#2526) |
| Hero dark/light theme toggle | On `main` (#2528 / #2529) |
| CRM DLD UAE market intelligence strip | On `main` (#2524) |

**Housekeeping:** Close superseded draft [#2525](https://github.com/arslan9024/White-Caves/pull/2525) (do not merge).

**Next:** legacy → 4-way waves · organise `.agents/` (≥121) · Vercel reliability.

---

## Contact

- **Managing Director:** Arslan Malik Bashir Ahmad · `arslanmalikgoraha@gmail.com`  
- **Portal:** [whitecaves.com](https://whitecaves.com) · **WhatsApp:** +971 50 511 0636  
- **HQ:** Office D-72, El Shaye - 4 Building, Dubai, UAE  
