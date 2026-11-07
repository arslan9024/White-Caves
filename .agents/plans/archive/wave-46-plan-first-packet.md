# Wave 46 — Plan-First Packet (Deduplication & Canonicalization)

**Task ID:** W46-KICKOFF-001  
**Owner:** @Ada + @Margaret + @Mira + @Katherine  
**Date:** 2026-09-03  
**Status:** 🟢 Active

## Goal

Launch the repository-wide deduplication and canonicalization program in controlled waves to remove duplicate artifacts, merge overlapping implementations, and enforce a single-source-of-truth operating model.

## Files in Scope (Phase 0/1 kickoff)

- `plans/MASTER_PLAN.md`
- `plans/PENDING_TASKS_ONLY.md`
- `plans/INDEX.md`
- `plans/DEDUP_INVENTORY_BASELINE_2026-09-03.md`
- `docs/plans/waves/WAVE_46_IMPLEMENTATION_BACKLOG.md`
- `docs/plans/waves/README.md`

## Validation Path

1. Confirm structural baseline and duplicate hotspots.
2. Register Wave 46 backlog + kickoff packet in canonical planning stack.
3. Run planning validation gate.
4. Update operational trackers only after successful validation.

## Recommended Model Tier

- Planning and analysis: free planning model tier
- Code and structural refactors: senior coding tier with adversarial verification

## Context-Size Expectation

- Medium-high context due to cross-tree duplication (`plans/`, `docs/plans/`, `src/`, `server/`)
- Execute in small dependency-safe batches (<500-line diffs per wave task)

## Acceptance Criteria

- [x] Wave 46 kickoff packet created.
- [x] Baseline dedup inventory created with measurable evidence.
- [x] Wave 46 implementation backlog created.
- [ ] Canonical trackers updated after validation.
- [ ] Phase 0 inventory tasks completed and signed off.

## Blocker Status

- No hard blocker at kickoff.
- Soft risk: historical mirrors in `docs/plans/` can cause accidental drift without canonical tags.
