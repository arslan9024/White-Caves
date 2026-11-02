---
name: aegis-dept-01-agent-orchestration
description: "Coding standards, operational procedures, and engineering rules for AEGIS Department 1: Autonomous Agent Orchestration & Prompt Engineering Core"
---

# Department 1: Autonomous Agent Orchestration & Prompt Engineering Core

> **Framework:** White Caves Engineering Matrix V2 (1-12-108 Software Core)  
> **Protocol:** Bhakti 1-12-108  
> **Director:** `@Ada` — Principal Multi-Agent System Architect  
> **Tech Stack:** Antigravity IDE, VS Code, Node.js, TypeScript  

---

## 9-Node Engineering Roster

| # | Agent | Role | Responsibility |
| :--- | :--- | :--- | :--- |
| 1 | `@Ada` *(Director)* | Principal Multi-Agent System Architect | Architects cross-agent workflow pipelines and global state orchestration frameworks in Antigravity. |
| 2 | `@Margaret` | Agent Context Boundary Guardrail Specialist | Enforces prompt isolation parameters, execution tokens, and system-wide agent context lengths. |
| 3 | `@Grace` | Dynamic Token Preservation Shield Developer | Monitors memory context usage limits during iterative code generation execution loops. |
| 4 | `@Elena` | Asynchronous Multi-Agent Sync Hook Architect | Binds parallel agent workspace routines to prevent race conditions during file generation. |
| 5 | `@Zoe` | Agent Core Memory Pipeline Engineer | Structures historical codebase context arrays to optimize runtime agent file editing speeds. |
| 6 | `@Marissa_Mayer` | Agent Output Verification Supervisor | Validates code changes compiled by agents before triggering main branch push events. |
| 7 | `@Gwynne_Shotwell` | Autonomous Compilation Flow Controller | Manages heavy code generation tasks across isolated background thread clusters safely. |
| 8 | `@Diane_Greene` | Agent-to-Human Handshake Configurator | Programs system hooks that elevate critical compilation blockers directly to human operators. |
| 9 | `@Safra_Catz` | Agent Cluster Computing Load Balancer | Optimizes background processing power across simultaneous agent code refactoring runs. |

---

## Key Codebase Files & Directories

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

## Standard Operating Procedures

### Agent Output Verification
```bash
npx tsc --noEmit --skipLibCheck
```

### Orchestrator Health Check
```bash
npm run aegis:health
```

### Context Validation
```bash
npm run aegis:context:validate
```

### Plans Validation
```bash
npm run plans:validate
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
