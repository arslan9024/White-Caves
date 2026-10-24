# Structural Problems — Solutions (MD-approved constraints)

**Date:** 2026-10-24 (updated end of session)  
**Constraints:** Keep AEGIS full power; keep ≥121 agents; sibling repos for future; 4-way mandatory; 12×9 supervisors fixed.

---

## 1. Issue / automation explosion

**Solution:** Organise generation rules (see `AEGIS_ORGANISATION.md`). Cap bulk issue bots unless Level 5 runs them. Deduplicate by title+department. Progress docs must show live counts.

**Status:** Policy documented; enforcement still in progress.

## 2. Docs vs code drift

**Solution:** Single source of truth: GitHub open issues/PRs + CI. Update progress trackers when merges land. Ban “0 open issues” claims unless API confirms.

**Status:** ✅ Progress + daily tracker + this plan refreshed 2026-10-24 after merge wave.

## 3. Mixed-era code (JSX/CSS vs 4-way TS)

**Solution:** On-touch migration + scheduled consolidation waves. Dedup before convert. Inventory: `node scripts/check-four-way.mjs`.

**Status:** Hero + CRM news strip are four-way examples on `main`. Legacy wave still open.

## 4. AEGIS complexity

**Solution:** Lane map + department ownership — **no trim**. See `aegis/README.md` and `AEGIS_ORGANISATION.md`.

**Status:** ✅ Index on `main`.

## 5. `.agents/` scale

**Solution:** Organise into 12 department folders + shared/orchestrator. Keep all agents; fill 1–12–108 slots to ≥121.

**Status:** 📋 Planned (do not trim).

## 6. Logging

**Solution:** Prefer `src/utils/logger` and `server/utils/logger`; fix remaining `console.*` on touch.

## 7. Sibling repos

**Solution:** Retain for future milestones; do not merge or delete in this phase.

## 8. Product PRs (wave status)

| PR | Topic | Outcome |
|----|--------|--------|
| #2527 | Governance | ✅ Merged |
| #2526 | Hero 4-way + RTL | ✅ Merged |
| #2528 / #2529 | Hero theme toggle | ✅ Merged |
| #2524 | CRM DLD UAE strip | ✅ Merged |
| #2525 | Old hero theme rewrite | ❌ **Close only** — dirty conflicts; superseded |

**Do not force-merge #2525.**
