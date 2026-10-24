# AEGIS Organisation (No Trim — Structure Only)

**Policy:** Keep full AEGIS capability. **Organise** lanes, naming, and ownership. Do not delete orchestration power for “cleanliness”.

**Effective:** 2026-10-24

---

## Problems today

- Large script surface (`aegis:*`, `orchestrator:*`) without a single index of “what to run when”  
- Auto-generated issues/PRs create backlog noise  
- Progress docs claimed zero backlog while GitHub still had hundreds of open items  

---

## Organisation model (aligned to 1 – 12 – 108)

| Lane | Department | Purpose |
|------|------------|---------|
| `aegis:health` / cycle | Executive & Architecture | System health, policy version |
| Frontend waves | Frontend & UX | 4-way migrations, hero, public UI |
| API / server | Backend & API | Routes, services, WhatsApp/Meta |
| Data | Database & Pipelines | Prisma, seeds, indexes |
| Compliance | Security & Legal | RERA/DLD gates |
| **SQA** | Software Quality & Testing | Test policy, flaky quarantine, CI truth |
| Deploy | DevOps | Docker, Vercel, runtime verify |
| Product CRM | Sales & CRM | Dashboard strips, leads |
| Comms | Communications | Nina, WhatsApp, SEO |

Scripts stay; each script should be tagged in a short **lane map** (this file or `aegis/README.md`) with: owner department, when to run, safe vs destructive.

---

## Issue generation rules (reduce noise without removing AEGIS)

1. Auto-issues must include: department code, acceptance criteria, and a single owner lane.  
2. Cap bulk generators unless MD (Level 5) explicitly runs them.  
3. Prefer updating an existing open issue over opening a near-duplicate.  
4. Progress reports must quote **live** open issue/PR counts from GitHub, not aspirational zeros.

---

## Recommended weekly rhythm

1. `npm run typecheck && npm run test:run`  
2. Review open **draft PRs** (unblock or request changes)  
3. AEGIS health + one department wave only  
4. Update `PROJECT_PROGRESS_REPORT.md` with real numbers  

---

## Agent organisation

See `docs/governance/AGENT_ROSTER_1_12_108.md`. Agents remain ≥121; folders under `.agents/` should mirror the 12 departments so progress is separable.
