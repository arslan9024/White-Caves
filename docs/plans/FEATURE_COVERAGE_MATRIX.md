# Feature Coverage Matrix

**Last Updated:** 2026-06-17
**Status:** Active governance baseline

| Feature | Business Rule Doc | Workflow Doc | Wave Backlog | Code Module | Test Surface | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aegis control plane | `plans/PLANNING_GOVERNANCE.md` | `AGENTS.md` | Governance track | `.github/copilot-instructions.md`, `.github/instructions/agentic-workflow.instructions.md`, `scripts/orchestrator/policy.json` | `npm run plans:validate`, `npm run aegis:health` | Active | Canonical ownership + drift control |
| Free-first model routing | `plans/PLANNING_GOVERNANCE.md` | `AGENTS.md` | Governance track | `scripts/orchestrator/policy.json`, `scripts/orchestrator/governance-utils.js`, `scripts/orchestrator/confidence-router.js` | `npm run aegis:context:validate` | Active | Task-class routing replaces agent-name-only routing |
| Plan-first execution gate | `plans/PLANNING_GOVERNANCE.md` | `.github/instructions/agentic-workflow.instructions.md` | Governance track | `scripts/orchestrator/context-manager.js`, `scripts/orchestrator/autopilot-session.js` | `npm run aegis:context:manifest`, `npm run aegis:context:bootstrap` | Active | Premium execution requires plan packet evidence |
| Context manifest + compact handoff | `plans/PLANNING_GOVERNANCE.md` | `plans/archives/SESSION_COMPACTION_HANDOFF_2026-05-21.md` | Governance track | `scripts/orchestrator/context-manager.js`, `scripts/orchestrator/governance-utils.js` | `npm run aegis:context:status` | Active | Raw logs retained; bootstrap uses compact summaries |
| VS Code Aegis control surface | `plans/PLANNING_GOVERNANCE.md` | `AGENTS.md` | Governance track | `.vscode/tasks.json`, `.vscode/launch.json`, `.vscode/settings.json` | Workspace tasks + launch profiles | Active | Terminal-first scripts remain source of truth |
| Identity & Access v2 | `business_docs/05_requirements/functional-requirements.md` | `business_docs/04_workflows/README.md` | `plans/waves/WAVE_19_IMPLEMENTATION_BACKLOG.md` | `src/pages/auth/*`, `server/routes/auth.ts`, `src/hooks/useSignIn.ts` | Auth regression suites + Wave 19 rollout | Planned | Canonical roadmap promoted; implementation still gated |
| `/crm` routing + MD workspace split | `business_docs/05_requirements/functional-requirements.md` | `business_docs/04_workflows/README.md` | `plans/waves/WAVE_19_IMPLEMENTATION_BACKLOG.md` | `src/App.tsx`, `src/config/crmModuleRegistry.tsx`, `src/pages/UnifiedDashboardPage.tsx` | Routing tests + Wave 19 rollout | Planned | Maps product navigation to Wave 19 bundle |
| AI persona registry consistency | `business_docs/README.md` | `business_docs/03_ai_assistants/README.md` | Governance track | `business_docs/README.md`, `scripts/orchestrator/governance-audit.js` | `npm run plans:validate` | Active | Business-doc count aligned to 40 personas |
