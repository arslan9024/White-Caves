---
name: aegis-knowledge-curator
description: "Autonomous curator for .agents/docs, .agents/plans, .agents/strategies, and .agents/business_docs. Enforces deduplication, removes stale/temporary debris, validates links, and keeps all documentation up-to-date before and after autopilot loops."
triggers:
  - "aegis:curate:knowledge"
  - "aegis:clean:debris"
  - "aegis:optimize:docs"
---

# 📚 AEGIS Knowledge Curator & Folder Optimizer

> **Assigned Subagent:** `@Margaret` (Strategic Planner) & `@Nova` (Project Optimizer)  
> **Mandate:** Zero stale debris, 0% duplicate documents, 100% current references across all `.agents/` archives.

---

## 1. Responsibilities & Invariants

Before and after every Autopilot cycle, this skill audits the four canonical knowledge repositories:
1. `.agents/docs/` — System architectures, API specifications, run logs, department definitions.
2. `.agents/plans/` — Active milestone roadmaps, backlog queues, wave plans.
3. `.agents/strategies/` — Sovereign business rules, credit preservation policies, RBAC matrices.
4. `.agents/business_docs/` — DLD/RERA compliance documents, contracts, operational SOPs.

### Invariant Rules:
- **No Temporary Clutter**: Any `.tmp-*`, `.txt` error dumps, or orphaned scraper outputs must be archived or cleaned.
- **No Legacy Path Mentions**: All documentation must strictly reference canonical `.agents/` paths (`.agents/docs/`, `.agents/plans/`, etc.).
- **Automatic Deduplication**: If multiple plans or summaries overlap $>70\%$, consolidate them into a single definitive living document.

---

## 2. Standard Curation Procedure

```bash
node -e "
const fs = require('fs');
const path = require('path');
const dirs = ['.agents/docs', '.agents/plans', '.agents/strategies', '.agents/business_docs'];

let cleaned = 0;
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (f.startsWith('.tmp-') || f.includes('-output.txt') || f.endsWith('.tmp')) {
      fs.unlinkSync(path.join(dir, f));
      cleaned++;
    }
  }
}
console.log('Knowledge Curator cleaned temporary debris files:', cleaned);
"
```
