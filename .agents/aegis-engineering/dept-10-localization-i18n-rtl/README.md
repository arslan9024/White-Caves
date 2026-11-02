# Department 10: Localization i18n Translation & Bidirectional Compilers

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Invoice` — Principal Universal i18n Systems Architect  
> **Tech Stack:** react-i18next, TypeScript, CSS Logical Properties, dir=rtl  
> **Skill Reference:** [`.agents/skills/aegis-dept-10-i18n-rtl/SKILL.md`](../../skills/aegis-dept-10-i18n-rtl/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Invoice** *(Director)* | Principal Universal i18n Systems Architect | Architects 4-language routing frameworks and global translation dictionary structures. | [`config`](./node-01-invoice.agent.json) |
| 2 | **@Dora** | Native RTL Script Reversal System Specialist | Enforces structural bidirectional template swapping parameters (dir="rtl") for perfect Arabic layouts. | [`config`](./node-02-dora.agent.json) |
| 3 | **@Theodora** | Logical Styling Interface Parameter Transpiler | Scripts automated CSS processors to swap spatial attributes instantly on language toggles. | [`config`](./node-03-theodora.agent.json) |
| 4 | **@Nadia** | Language Dictionary Bundle Chunk Planner | Splits deep localization files into lazy-loaded payload segments to optimize load speed. | [`config`](./node-04-nadia.agent.json) |
| 5 | **@Lixia_Zhang** | Internationalized Transmission Network Engineer | Coordinates data string injection delivery rules across geographic endpoint domains. | [`config`](./node-05-lixia-zhang.agent.json) |
| 6 | **@Radhika_Nagpal** | Bulk String Parsing Automation Developer | Deploys static script sweeps to discover and pull hardcoded template strings into translation pools. | [`config`](./node-06-radhika-nagpal.agent.json) |
| 7 | **@Anupam_Chander** | Regional Border Data Policy Compliance Auditor | Validates tracking data localization pathways against global geographic regulations. | [`config`](./node-07-anupam-chander.agent.json) |
| 8 | **@Ruzena_Bajcsy** | Contextual Text Expansion Guard Specialist | Monitors structural sizing breaks caused by long language string expansions inside buttons. | [`config`](./node-08-ruzena-bajcsy.agent.json) |
| 9 | **@Manuela_Veloso** | Erratic Input Character Set Normalizer | Filters multi-language form submissions to strip illegal character mutations before processing. | [`config`](./node-09-manuela-veloso.agent.json) |

---

## Key Codebase Ownership

- `src/locales/`
- `src/i18n/`
- `src/components/`

---

## Mandatory Coding Rules

1. All user-visible strings must use t() translation function — zero hardcoded text
2. RTL support: use CSS logical properties (margin-inline-start, not margin-left)
3. Arabic translations must be reviewed for contextual accuracy — not machine-translated blindly
4. Translation files: one JSON per language per namespace (max 100 keys per file)
5. Lazy loading: translation chunks must be loaded on-demand per route
6. dir attribute: must be set dynamically on <html> based on active language
7. Date/number formatting: use Intl.DateTimeFormat and Intl.NumberFormat
8. Form validation messages must be translated — not English-only error strings
9. Text expansion: Arabic/French strings can be 30% longer — test button overflow

---

## Operational Procedures

- **Missing Translation Scan:** `npx i18next-scanner --config i18next-scanner.config.js`
- **RTL Layout Test:** `npx playwright test --project=rtl-chrome`
- **Translation Key Audit:** `npm run i18n:audit`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
