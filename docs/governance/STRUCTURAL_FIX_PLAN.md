# Structural Problems — Solutions (MD-approved constraints)

**Date:** 2026-10-24  
**Constraints:** Keep AEGIS full power; keep ≥121 agents; sibling repos for future; 4-way mandatory; 12×9 supervisors fixed.

---

## 1. Issue / automation explosion

**Solution:** Organise generation rules (see `AEGIS_ORGANISATION.md`). Cap bulk issue bots unless Level 5 runs them. Deduplicate by title+department. Progress docs must show live counts.

## 2. Docs vs code drift

**Solution:** Single source of truth: GitHub open issues/PRs + CI. Update `PROJECT_PROGRESS_REPORT.md` and `DAILY_MILESTONE_TRACKER.md` on this revision to match reality. Ban “0 open issues” claims unless API confirms.

## 3. Mixed-era code (JSX/CSS vs 4-way TS)

**Solution:** On-touch migration + scheduled consolidation waves. Dedup before convert. Track remaining legacy files in a living inventory under `plans/LEGACY_COMPONENT_INVENTORY.md` (create when wave starts).

## 4. AEGIS complexity

**Solution:** Lane map + department ownership — **no trim**. Document when each script is safe.

## 5. `.agents/` scale

**Solution:** Organise into 12 department folders + shared/orchestrator. Keep all agents; fill 1–12–108 slots to ≥121.

## 6. Logging

**Solution:** Prefer `src/utils/logger` and `server/utils/logger`; treat remaining `console.*` in services as tech debt fixed on touch.

## 7. Sibling repos

**Solution:** Retain `White-Caves-DB` and `white-caves-real-estate` for future milestones; do not merge or delete in this phase.

## 8. Open draft PRs (unblock)

| PR | Topic | State |
|----|--------|--------|
| #2524 | CRM UAE market intelligence strip | Draft, unstable |
| #2525 | Hero dark/light + bilingual | Draft, unstable |
| #2526 | Hero cinematic + RTL 4-way | Draft, unstable |

**Solution path:** Mark ready for review when CI is green; resolve conflicts with `main`; merge in order **2526 → 2525 → 2524** (or rebase 2525 onto 2526 if both touch Hero). Do not force-merge while `mergeable_state` is unstable.
