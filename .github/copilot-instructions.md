# White Caves Real Estate LLC — Copilot Instructions

## ⚠️ BRAND COLORS — NON-NEGOTIABLE RULE ⚠️

**The ONLY brand colors for White Caves are:**

- **Primary: Red `#E31E24`** (and its shades `#B71C1C` dark, `#EF5350` light)
- **Neutral: White `#FFFFFF`**
- **Dark background: Near-black `#1A1A1A` / `#1F1F1F`**
- **Secondary accent: Dark Green `#2E5A4F`** (for nature/sustainability accents only)

**❌ NEVER USE gold, yellow, amber, or tan colors in any UI component:**

- ❌ No `#D4AF37`, `#C9A84C`, `#E8CC6E`, `#FFD700`, `#FFB300`, `#FFC107`, `#f5dc88`
- ❌ No CSS variable `--luxury-true-gold` or any `--*-gold-*` that resolves to a gold hex
- ❌ No "Dubai Luxury Gold" aesthetic — this project is Red/White only
- ❌ No `accentGold` overrides pointing to actual gold colors

**The CSS variable `--accent-gold` in this project = `#E31E24` (brand red). It is misnamed for historical reasons but ALWAYS resolves to red.**

---

## Background Operations

- **Chain Execution:** Once a task is finished, move to the next logical task in the roadmap automatically.
- **Silent Error Correction:** If the `@terminal` shows a linting or build error, `@Katherine` must fix it silently.
- **Sub-Agent Handoff:** When `@Una` (Frontend) finishes a form, `@Mira` (API) should automatically step in to build the endpoint for it.
- **Commit Logic:** Group changes by "Milestone". All agents follow the **Red/White brand guide** — no gold, no luxury palette.

---

## Technology Stack

- **Frontend:** React + TypeScript + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + Prisma + PostgreSQL
- **Deployment:** Vercel (frontend) + Railway/Render (backend)

---

## Code Quality Rules

- All TypeScript must pass `eslint --max-warnings 0`
- All new components need tests (Vitest + React Testing Library)
- WCAG AA accessibility on all interactive elements
- Mobile-first responsive design
