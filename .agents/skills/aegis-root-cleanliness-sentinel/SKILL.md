---
name: aegis-root-cleanliness-sentinel
description: "Sovereign path hygiene, root cleanliness enforcement (TURING-ROOT-007), and legacy path canonicalization skill. Automatically intercepts and relocates loose root folders (docs/, plans/, strategies/, business_docs/) into canonical .agents/ directories and rewrites hardcoded legacy script paths."
triggers:
  - "aegis:clean:root"
  - "aegis:canonicalize:paths"
  - "turing-root-007"
---

# 🛡️ AEGIS Skill: Root Cleanliness Sentinel & Path Canonicalizer (`TURING-ROOT-007`)

> **Assigned Subagent:** `@Gwynne` (DevOps & CI/CD Lead) in coordination with `@Nova` (Project Optimizer).  
> **Mandate:** Zero folder pollution in repository root. 100% encapsulation within `.agents/`.

---

## 1. Problem Statement & Invariant Law

Legacy orchestrator scripts, subagents, and third-party tools sometimes reference root paths (`docs/`, `plans/`, `strategies/`, `business_docs/`). When these scripts run `fs.mkdirSync()` or write outputs, they pollute the workspace root and cause directory divergence from `.agents/`.

Under **`TURING-ROOT-007`**, the root directory MUST remain pristine.

| Polluting Root Path | Canonical Target Path |
| :--- | :--- |
| `docs/**` | `.agents/docs/**` |
| `plans/**` | `.agents/plans/**` |
| `strategies/**` | `.agents/strategies/**` |
| `business_docs/**` | `.agents/business_docs/**` |

---

## 2. Standard Operating Procedure (SOP)

Whenever an agent or script notices root folder creation or is asked to audit path hygiene:

### Step 1: Detect Root Folder Violations
Run a fast check across the root directory:
```powershell
Get-ChildItem -Directory -Path docs, plans, strategies, business_docs -ErrorAction SilentlyContinue
```

### Step 2: Safe Merge & Relocation
If any of the folders exist:
1. Recursively copy files into the corresponding `.agents/` directory without overwriting newer canonical files.
2. Remove the polluting root folder:
```powershell
robocopy docs .agents\docs /E /XC /XN /XO /NFL /NDL /NJH /NJS
Remove-Item -Recurse -Force docs -ErrorAction SilentlyContinue
```

### Step 3: Audit & Canonicalize Script References
Search for legacy hardcoded string literals in scripts:
```bash
git grep -n -E "['\"](docs/|plans/|strategies/|business_docs/)" .agents/ scripts/
```
Rewrite all occurrences to prefix with `.agents/`.

---

## 3. Automated One-Liner Fixer Command
You can execute the built-in clean-up anytime:
```bash
node -e "
const fs = require('fs');
const path = require('path');
const folders = ['docs', 'plans', 'strategies', 'business_docs'];
for (const f of folders) {
  const rootP = path.join(process.cwd(), f);
  if (fs.existsSync(rootP)) {
    const dest = path.join(process.cwd(), '.agents', f);
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(rootP, dest, { recursive: true });
    fs.rmSync(rootP, { recursive: true, force: true });
    console.log('Cleaned and relocated:', f);
  }
}
"
```
