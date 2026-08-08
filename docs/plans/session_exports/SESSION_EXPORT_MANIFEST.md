# Session Export Manifest

**Status:** Active  
**Last Updated:** 2026-08-03

## Purpose

Track exported session-memory artifacts into canonical `docs/plans/session_exports/` paths with source traceability.

## Export inventory

| Export File | Source | Exported At (UTC) | Type | Notes |
| --- | --- | --- | --- | --- |
| `SESSION_EXPORT_2026-08-03.md` | `/memories/session/plan.md`, `/memories/session/created-files-notes.md`, `/memories/session/test-file.md` | 2026-08-03T00:00:00Z | consolidated | Synced with latest session memory set |
| `raw/plan_2026-08-03.md` | `/memories/session/plan.md` | 2026-08-03T00:00:00Z | raw 1:1 | Active plan snapshot (latest sync) |
| `raw/created-files-notes_2026-08-03.md` | `/memories/session/created-files-notes.md` | 2026-08-03T00:00:00Z | raw 1:1 | Session notes snapshot |
| `raw/test-file_2026-08-03.md` | `/memories/session/test-file.md` | 2026-08-03T00:00:00Z | raw 1:1 | Session test memory snapshot |

## Quality checks

1. Source path recorded for every export item.
2. No destructive edits to `raw/` snapshots.
3. Consolidated summary includes RUP phase and next action.
