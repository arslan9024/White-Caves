# PowerShell Token-Efficiency & Zero-Waste Shell Laws

# Rule Tier: Project (White-Caves-Frontend)

# Crystallized: 2026-11-13 from live session waste analysis (TURING-LAW-000 enforcement)

---

description: Mandatory PowerShell efficiency patterns. Prevents shell retry waste, recursive directory dumps, and redundant reads.
globs: ["**/*"]
alwaysApply: true
---

## LAW 1 — `head` IS BANNED. Always use `Select-Object -First N`.

```powershell
# ❌ NEVER — `head` does not exist in PowerShell (causes error + wasted retry turn)
command 2>&1 | head -20

# ✅ ALWAYS
command 2>&1 | Select-Object -First 20
```

**Cost of violation:** 1 wasted turn + ~300 input tokens per retry.

---

## LAW 2 — NEVER `Get-ChildItem -Recurse` on `.agents/` or large directories.

`.agents/` contains 100+ scripts, skills, plans, strategies — a full recursive dump
floods context with thousands of irrelevant filenames.

```powershell
# ❌ NEVER — dumps everything, most is noise
Get-ChildItem .agents -Recurse | Select-Object Name

# ✅ ALWAYS — use git grep to find exactly what you need
git grep -rl "keyword" .agents/ 2>$null | Select-Object -First 10

# ✅ OR — scan only 1 level deep
Get-ChildItem .agents -Depth 1 | Select-Object Name

# ✅ OR — filter by known pattern directly
Get-ChildItem .agents -Recurse -Filter "*backlog*" | Select-Object FullName
```

**Cost of violation:** ~3,000–5,000 wasted input tokens per dump.

---

## LAW 3 — Use `git grep -n` BEFORE reading files; never read to discover.

If you need to know if a type, function, or feature exists in the codebase,
run `git grep` first (0 token cost). Only read the file if you need the exact implementation.

```powershell
# ❌ NEVER — reads entire file to find one type
Get-Content src/path/to/file.ts

# ✅ Step 1: locate with git grep (0 LLM tokens)
git grep -n "PDCStatus\|bounceReason" src/ 2>$null | Select-Object -First 10

# ✅ Step 2: read ONLY the relevant slice
# read_file with StartLine / EndLine
```

---

## LAW 4 — Never run the same information query twice.

If a command already returned the answer (e.g. queue status from `status.ps1`),
do NOT re-run `progress-report.js` for the same data. One authoritative source per turn.

```powershell
# ❌ NEVER — both return queue depth; pick one
powershell -File .agents/orchestrator/status.ps1
node .agents/orchestrator/aegis-progress-report.js

# ✅ ALWAYS — pick the fastest single source
powershell -File .agents/orchestrator/status.ps1
```

---

## LAW 5 — Always verify a script exists before executing it.

Before `node <path>.js` or `powershell -File <path>.ps1`, confirm the file exists
using `Test-Path` or the directory listing from the same parallel batch. Never
speculatively execute a path that wasn't confirmed in the same turn.

```powershell
# ❌ NEVER — blind execution that may 404 and waste a turn
node .agents/orchestrator/aegis-engine.js health

# ✅ ALWAYS — confirm path in same parallel batch, then execute
Test-Path ".agents/orchestrator/aegis-engine.js"  # run in parallel with other reads
# Then conditionally execute based on result
```

---

## Target Input Token Budget per `/aegis-task` Session

| Phase                                | Max Tokens         |
| ------------------------------------ | ------------------ |
| Pre-flight (health + git log + grep) | ≤ 800              |
| File reads (surgical slices only)    | ≤ 2,000            |
| Implementation (write_file output)   | ≤ 4,000            |
| Test output + git                    | ≤ 500              |
| **Total input budget**               | **≤ 8,000 tokens** |

Exceeding 10,000 input tokens on a single `/aegis-task` requires a post-session
waste analysis identifying which law was violated.
