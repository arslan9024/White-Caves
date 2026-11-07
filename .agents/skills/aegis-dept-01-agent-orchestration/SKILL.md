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
- `.agents/orchestrator/`
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

## AEGIS V5.0 Governance & Protocol Constitution (All Departments)

1. **Protocol Matrices (AEG-001 – AEG-042):** Enforce all 5 CSV matrices in .agents/aegis/protocols/ (PROMETHEUS_CORE_UNBOUND, TURING_SILENT_VELOCITY, PHOENIX_SHIELD_ISOLATION, VALKYRIE_LEDGER_RISE, APOCALYPSE_OVERDRIVE_MATRIX).
2. **Zero Context Overcrowding (AEG-003 / AEG-041):** Global React Context is restricted strictly to the Context Triad (ThemeContext, LanguageContext, CurrencyContext). All transactional state uses Redux Toolkit slices.
3. **Single Purpose File Law & Modular Co-Location (AEG-008):** Every source file must remain under 350 lines and follow the Canonical 7-Category / 12-Way modular architecture.
4. **TypeScript & Pre-Commit Strictness (AEG-016 / AEG-022):** Zero warnings, zero ny bypasses, zero plaintext secrets via .husky/pre-commit.
5. **Continuous Deduplication & Single Source of Truth:** Zero duplicate handlers, zero ghost directories, and all orchestration consolidated inside .agents/.
