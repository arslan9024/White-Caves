---
name: aegis-dept-08-devops-sre
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 8: DevOps CI/CD Pipelines & Site Reliability Automation (SRE)"
---

# Department 8: DevOps CI/CD Pipelines & Site Reliability Automation (SRE)

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Gwynne` — Principal Code Delivery Automation Director  
> **Tech Stack:** Git, GitHub Actions, Docker, Vercel, TypeScript, Husky, lint-staged  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Gwynne` *(Director)* | Principal Code Delivery Automation Director | Engineers master build verification pipelines, testing bars, and automated deployment blocks. |
| 2 | `@Lisa` | Cloud Edge Production Routing Configurator | Manages system deployment configurations inside distributed cloud edge infrastructure arrays. |
| 3 | `@Annie` | Docker Container Ecosystem Scaffolding Specialist | Containerizes core codebase folders into optimized multi-stage production environments. |
| 4 | `@Corinne` | Cross-Platform Environment State Unifier | Ensures environment variable consistency across local workspaces, staging, and live endpoints. |
| 5 | `@Rachel` | Repository Secret Disclosure Interceptor | Monitors git pull histories to identify and wipe accidentally tracked developer credentials. |
| 6 | `@Radia_Perlman` | Internal Topology Networking Programmer | Optimizes cloud server communication hops to completely minimize package transmission delays. |
| 7 | `@Sister_Mary_Keller` | Static Code Style Rule Engine Architect | Configures compiler validation tools to enforce style properties before repository integration. |
| 8 | `@Adele_Goldberg` | Sandboxed Local Dev Workspace Virtualizer | Builds lightweight local virtualization runtimes for reliable offline debugging loops. |
| 9 | `@Evelyn_Boyd_Granville` | Automated Zero-Downtime Rollback Coordinator | Authors automated safe deployment scripts to roll back software branches instantly if telemetry drops. |

---

## Key Codebase Files & Directories

- `.github/`
- `.agents/orchestrator/`
- `.husky/`
- `package.json`
- `vercel.json`

---

## Mandatory Coding Rules

1. All commits must use Conventional Commits format (feat/fix/chore/refactor)
2. Pre-commit: Husky + lint-staged must run prettier + eslint on staged files
3. Branch protection: main is protected — all changes via PR only
4. PR merge: resolve all review threads before merge (use aegis-unblock-pr.js)
5. Zero dangling branches: delete feature branches after merge
6. Docker: multi-stage builds — dev dependencies excluded from production image
7. Rollback: automated revert if post-deploy health check fails within 5 minutes
8. Secrets: GitHub Secrets for all tokens — never hardcode in CI configs
9. Root Cleanliness (TURING-ROOT-007): All docs, plans, strategies, and audits belong under `.agents/`. Any loose root folders must be relocated immediately. Use `@skill:aegis-root-cleanliness-sentinel`.

---

## Standard Operating Procedures

### TypeScript Pre-flight
```bash
npx tsc --noEmit --skipLibCheck
```

### Full Test Suite
```bash
npx vitest run
```

### Lint Check
```bash
npx eslint --max-warnings 0 .
```

### PR Unblock
```bash
node .agents/orchestrator/aegis-unblock-pr.js <pr_number>
```

### Branch Cleanup
```bash
git remote prune origin && git branch --merged main | grep -v main | xargs git branch -d
```

---

## AEGIS V5.0 Governance & Protocol Constitution (All Departments)

1. **Protocol Matrices (AEG-001 – AEG-042):** Enforce all 5 CSV matrices in .agents/aegis/protocols/ (PROMETHEUS_CORE_UNBOUND, TURING_SILENT_VELOCITY, PHOENIX_SHIELD_ISOLATION, VALKYRIE_LEDGER_RISE, APOCALYPSE_OVERDRIVE_MATRIX).
2. **Zero Context Overcrowding (AEG-003 / AEG-041):** Global React Context is restricted strictly to the Context Triad (ThemeContext, LanguageContext, CurrencyContext). All transactional state uses Redux Toolkit slices.
3. **Single Purpose File Law & Modular Co-Location (AEG-008):** Every source file must remain under 350 lines and follow the Canonical 7-Category / 12-Way modular architecture.
4. **TypeScript & Pre-Commit Strictness (AEG-016 / AEG-022):** Zero warnings, zero ny bypasses, zero plaintext secrets via .husky/pre-commit.
5. **Continuous Deduplication & Single Source of Truth:** Zero duplicate handlers, zero ghost directories, and all orchestration consolidated inside .agents/.
