# Department 1: Autonomous Agent Orchestration & Prompt Engineering Core

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Ada` — Principal Multi-Agent System Architect  
> **Tech Stack:** Antigravity IDE, VS Code, Node.js, TypeScript  
> **Skill Reference:** [`.agents/skills/aegis-dept-01-agent-orchestration/SKILL.md`](../../skills/aegis-dept-01-agent-orchestration/SKILL.md)  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility | Config |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **@Ada** *(Director)* | Principal Multi-Agent System Architect | Architects cross-agent workflow pipelines and global state orchestration frameworks in Antigravity. | [`config`](./node-01-ada.agent.json) |
| 2 | **@Margaret** | Agent Context Boundary Guardrail Specialist | Enforces prompt isolation parameters, execution tokens, and system-wide agent context lengths. | [`config`](./node-02-margaret.agent.json) |
| 3 | **@Grace** | Dynamic Token Preservation Shield Developer | Monitors memory context usage limits during iterative code generation execution loops. | [`config`](./node-03-grace.agent.json) |
| 4 | **@Elena** | Asynchronous Multi-Agent Sync Hook Architect | Binds parallel agent workspace routines to prevent race conditions during file generation. | [`config`](./node-04-elena.agent.json) |
| 5 | **@Zoe** | Agent Core Memory Pipeline Engineer | Structures historical codebase context arrays to optimize runtime agent file editing speeds. | [`config`](./node-05-zoe.agent.json) |
| 6 | **@Marissa_Mayer** | Agent Output Verification Supervisor | Validates code changes compiled by agents before triggering main branch push events. | [`config`](./node-06-marissa-mayer.agent.json) |
| 7 | **@Gwynne_Shotwell** | Autonomous Compilation Flow Controller | Manages heavy code generation tasks across isolated background thread clusters safely. | [`config`](./node-07-gwynne-shotwell.agent.json) |
| 8 | **@Diane_Greene** | Agent-to-Human Handshake Configurator | Programs system hooks that elevate critical compilation blockers directly to human operators. | [`config`](./node-08-diane-greene.agent.json) |
| 9 | **@Safra_Catz** | Agent Cluster Computing Load Balancer | Optimizes background processing power across simultaneous agent code refactoring runs. | [`config`](./node-09-safra-catz.agent.json) |

---

## Key Codebase Ownership

- `.agents/aegis.agent.json`
- `.agents/aegis-engineering/`
- `scripts/orchestrator/`
- `AGENTS.md`

---

## Mandatory Coding Rules

1. All agent orchestration configs MUST live under .agents/ directory
2. Prompt context boundaries must be enforced — never exceed 15,000 tokens per task
3. Agent output verification must run npx tsc --noEmit --skipLibCheck before any push
4. Race conditions between parallel agents must be prevented via file-level locking
5. Human escalation hooks must be triggered for any P0/P1 compilation failure
6. Token preservation: batch related child slices into single parent prompts
7. Context memory arrays must be structured for O(1) lookup by file path

---

## Operational Procedures

- **Agent Output Verification:** `npx tsc --noEmit --skipLibCheck`
- **Orchestrator Health Check:** `npm run aegis:health`
- **Context Validation:** `npm run aegis:context:validate`
- **Plans Validation:** `npm run plans:validate`

---

## Governance

- Single Purpose File Law (< 350 lines)
- TypeScript Strict (zero warnings)
- Zero Backlog Law
- Continuous Deduplication
- Conventional Commits
