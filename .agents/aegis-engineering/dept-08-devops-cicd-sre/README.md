# Department 8: DevOps CI/CD Pipelines & Site Reliability Automation (SRE)

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Gwynne` — Principal Code Delivery Automation Director  
> **Tech Stack:** Git, GitHub Actions, Docker, Vercel, TypeScript, Husky, lint-staged  
> **Skill Reference:** [`.agents/skills/aegis-dept-08-devops-sre/SKILL.md`](../../skills/aegis-dept-08-devops-sre/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Gwynne** *(Director)* | Principal Code Delivery Automation Director | Engineers master build verification pipelines, testing bars, and automated deployment blocks. | [`config`](./node-01-gwynne.agent.json) |
| 2 | **@Lisa** | Cloud Edge Production Routing Configurator | Manages system deployment configurations inside distributed cloud edge infrastructure arrays. | [`config`](./node-02-lisa.agent.json) |
| 3 | **@Annie** | Docker Container Ecosystem Scaffolding Specialist | Containerizes core codebase folders into optimized multi-stage production environments. | [`config`](./node-03-annie.agent.json) |
| 4 | **@Corinne** | Cross-Platform Environment State Unifier | Ensures environment variable consistency across local workspaces, staging, and live endpoints. | [`config`](./node-04-corinne.agent.json) |
| 5 | **@Rachel** | Repository Secret Disclosure Interceptor | Monitors git pull histories to identify and wipe accidentally tracked developer credentials. | [`config`](./node-05-rachel.agent.json) |
| 6 | **@Radia_Perlman** | Internal Topology Networking Programmer | Optimizes cloud server communication hops to completely minimize package transmission delays. | [`config`](./node-06-radia-perlman.agent.json) |
| 7 | **@Sister_Mary_Keller** | Static Code Style Rule Engine Architect | Configures compiler validation tools to enforce style properties before repository integration. | [`config`](./node-07-sister-mary-keller.agent.json) |
| 8 | **@Adele_Goldberg** | Sandboxed Local Dev Workspace Virtualizer | Builds lightweight local virtualization runtimes for reliable offline debugging loops. | [`config`](./node-08-adele-goldberg.agent.json) |
| 9 | **@Evelyn_Boyd_Granville** | Automated Zero-Downtime Rollback Coordinator | Authors automated safe deployment scripts to roll back software branches instantly if telemetry drops. | [`config`](./node-09-evelyn-boyd-granville.agent.json) |

---

## Key Codebase Ownership

- `.github/`
- `scripts/orchestrator/`
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

---

## Operational Procedures

- **TypeScript Pre-flight:** `npx tsc --noEmit --skipLibCheck`
- **Full Test Suite:** `npx vitest run`
- **Lint Check:** `npx eslint --max-warnings 0 .`
- **PR Unblock:** `node scripts/orchestrator/aegis-unblock-pr.js <pr_number>`
- **Branch Cleanup:** `git remote prune origin && git branch --merged main | grep -v main | xargs git branch -d`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
