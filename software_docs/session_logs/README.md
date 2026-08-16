# Session Logs Repository

This directory serves as the immutable historical record of all interactions, prompts, and code generation steps performed by AI agents in this repository. By maintaining these logs, we ensure complete traceability of design decisions, implementation logic, and architectural shifts.

## Directory Structure

```text
session_logs/
├── README.md               # This file
├── templates/
│   └── SESSION_TEMPLATE.md # Standard markdown template for logging sessions
└── YYYY_MM/                # Folders grouped by Year and Month (e.g., 2026_08)
    └── YYYYMMDD_AgentName_SessionSummary.md
```

## Protocol for AI Agents

1. **At the start or end of a major implementation block**, the executing agent MUST record their session.
2. The agent MUST duplicate `templates/SESSION_TEMPLATE.md` into the appropriate `YYYY_MM/` directory.
3. The filename MUST follow the convention: `YYYYMMDD_AgentName_BriefSummary.md` (e.g., `20260816_Margaret_400xOverdrive.md`).
4. The agent MUST fill out the Prompt, Steps Taken, and Results comprehensively.

This ensures that any future agent or human developer can analyze past design improvements and architectural decisions with complete context.
