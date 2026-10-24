# AEGIS — Organisation Index (No Trim)

**Policy:** Keep full orchestration capability. Organise by **department lane**. Do not delete scripts to “simplify”.

Canonical detail: `docs/governance/AEGIS_ORGANISATION.md`

---

## When to run what

| Command | Lane (Dept) | Use |
|---------|-------------|-----|
| `npm run aegis:health` | 1 Executive | Policy / engine health |
| `npm run aegis:cycle` | 1 Executive | Full cycle |
| `npm run aegis:scan` / `dedup` | 1 / 3 | Scan & dedup |
| `npm run typecheck` | 8 SQA | Merge gate |
| `npm run test:run` | 8 SQA | Unit/integration |
| `npm run test:e2e:smoke` | 8 SQA | Critical path |
| `node scripts/check-four-way.mjs` | 3 Frontend + 8 SQA | 4-way inventory |
| `npm run build` | 7 DevOps | Production bundle |
| `npm run db:generate` / `db:push` | 5 Database | Schema |
| WhatsApp / Nina services | 11 Communications | Runtime messaging |

Destructive or bulk issue generators (`aegis:1000`, mass bootstrappers) require **Level 5 MD** intent — do not run on autopilot in shared CI.

---

## Issue generation hygiene

1. Every auto-issue: department code + acceptance criteria + single lane.  
2. Prefer update over duplicate.  
3. Progress docs must quote live open issue/PR counts.  

---

## Agents

Minimum **121** agents under **1–12–108**. Organise under `.agents/departments/01`…`12` over time; **do not delete** agent definitions to reduce count.

See `docs/governance/AGENT_ROSTER_1_12_108.md`.
