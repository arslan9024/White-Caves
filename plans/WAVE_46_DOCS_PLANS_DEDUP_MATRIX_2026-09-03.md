# Wave 46 — Documentation Dedup Matrix (`docs/plans/`)

**Task ID:** W46-004  
**Date:** 2026-09-03  
**Owner:** @Margaret  
**Status:** ✅ Complete

## Goal

Classify `docs/plans/` into **active reference**, **archive**, and **superseded** zones with explicit owner/action routing so mirror drift can be reduced in Wave 46.

## Evidence Snapshot

- Source scan: `Get-ChildItem docs/plans -Directory` + recursive file counts per folder.
- Total scanned top-level folders: 20
- Largest buckets:
  - `archives` → 388 files
  - `waves` → 229 files
  - `ai_assistants` → 41 files
  - `improvements` → 29 files
  - `ui-ux-upgrades` → 21 files

---

## A) Folder-Level Dedup Classification Matrix

| Folder             | Files | Class                | Owner      | Action                                                            | Priority | Notes                                                     |
| ------------------ | ----: | -------------------- | ---------- | ----------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| `waves/`           |   229 | Active Reference     | @Margaret  | Keep as bundle archive + enforce canonical links from `/plans`    | P0       | Contains active Wave 46 backlog + historical wave bundles |
| `archives/`        |   388 | Archive              | @Margaret  | Freeze as read-only historical set                                | P0       | Largest drift-safe bucket; no live edits                  |
| `ai_assistants/`   |    41 | Superseded/Reference | @Joelle    | Review for canonical relocation pointers to `/plans` or `/docs`   | P1       | Mixed planning/reference content                          |
| `improvements/`    |    29 | Superseded/Reference | @Ada       | Validate overlap with `/plans/IMPROVEMENTS_*.md`; add pointer map | P1       | Potential duplicate intent with canonical root            |
| `ui-ux-upgrades/`  |    21 | Superseded/Reference | @Una       | Keep as historical pack; add single index pointer                 | P2       | Not active execution authority                            |
| `departments/`     |    13 | Superseded/Reference | @Margaret  | Classify as archive unless actively linked by current wave        | P2       | Department plans legacy                                   |
| `implementations/` |    12 | Superseded           | @Mira      | De-duplicate against `waves/` and `plans/` trackers               | P1       | Naming overlaps with implementation streams               |
| `implementation/`  |     8 | Superseded           | @Mira      | Merge index/pointers with `implementations/`                      | P1       | Parallel folder naming conflict                           |
| `documentation/`   |     8 | Superseded/Reference | @Margaret  | Keep only unique docs; archive duplicates                         | P2       | Generic bucket prone to drift                             |
| `guides/`          |     7 | Reference            | @Margaret  | Retain with clear non-canonical bannering                         | P2       | Training/reference content                                |
| `COMPLIANCE/`      |     5 | Reference            | @Sofia     | Keep; validate legal-content authority mapping                    | P1       | Compliance material likely still useful                   |
| `templates/`       |     4 | Reference            | @Margaret  | Keep template-only, no status ownership                           | P2       | Scaffolding utility                                       |
| `status/`          |     3 | Superseded           | @Katherine | Map against root trackers; archive outdated files                 | P1       | Status duplication risk                                   |
| `technical-specs/` |     2 | Reference            | @Mira      | Keep if uniquely linked from active wave docs                     | P2       | Narrow technical references                               |
| `zoe-dashboard/`   |     1 | Reference            | @Joelle    | Preserve as historical dashboard artifact                         | P3       | Single-file niche content                                 |
| `architecture/`    |     1 | Reference            | @Ada       | Ensure pointer to canonical `docs/architecture/`                  | P2       | Potential location overlap                                |
| `phase-docs/`      |     1 | Superseded/Reference | @Margaret  | Consolidate with `waves/` or `archives/`                          | P2       | Legacy phase pack                                         |
| `linda-templates/` |     1 | Reference            | @Margaret  | Preserve template and add explicit provenance note                | P3       | Isolated template                                         |
| `session-logs/`    |     1 | Archive              | @Katherine | Retain as immutable history                                       | P2       | Historical evidence bucket                                |
| `sdd/`             |     1 | Reference            | @Mira      | Validate uniqueness vs wave SDD files                             | P2       | Potential duplicate of `waves/*_SDD.md`                   |

---

## B) Root-Level Mirror/Conflict Matrix (`docs/plans/*.md`)

| Mirror/Artifact                         | Canonical Source                 | Class             | Owner      | Action                                                   | Priority |
| --------------------------------------- | -------------------------------- | ----------------- | ---------- | -------------------------------------------------------- | -------- |
| `docs/plans/MASTER_PLAN.md`             | `plans/MASTER_PLAN.md`           | Active Mirror     | @Margaret  | Keep reference-only banner; no direct edits              | P0       |
| `docs/plans/PENDING_TASKS_ONLY.md`      | `plans/PENDING_TASKS_ONLY.md`    | Active Mirror     | @Margaret  | Keep reference-only banner; no direct edits              | P0       |
| `docs/plans/DAILY_MILESTONE_TRACKER.md` | `DAILY_MILESTONE_TRACKER.md`     | Active Mirror     | @Katherine | Add/confirm reference banner parity                      | P0       |
| `docs/plans/INDEX.md`                   | `plans/INDEX.md`                 | Mirror            | @Margaret  | Add canonical pointer + drift check policy               | P1       |
| `docs/plans/README.md`                  | `plans/README` equivalent intent | Reference Gateway | @Margaret  | Keep current as archive gateway; refresh on wave changes | P1       |

---

## C) Execution Sequence (Post W46-004)

1. **W46-005 (P1):** business-doc canonical root decision + migration map.
2. **W46-006/007 (P1):** frontend/backend overlap audits using same owner/action framework.
3. **W46-008 (P2):** safe-delete pass only after pointer checks and link validation.
4. **W46-009 (P0):** CI anti-dup checks to prevent re-drift.

## Acceptance Criteria Check

- [x] Active vs archive vs superseded classification completed for `docs/plans/` folders.
- [x] Owner/action columns provided for each classification row.
- [x] Root mirror conflicts mapped with canonical sources.
- [x] Next-task execution sequence defined for dependent Wave 46 tasks.
