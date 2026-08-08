# Session Exports (Plan-Mode Artifacts)

**Status:** Active  
**Owner:** Documentation Governance  
**Last Updated:** 2026-08-03

This folder stores plan-mode session exports from memory artifacts, so working context can be preserved in canonical `docs/` paths without relying heavily on agent mode.

## Structure

- `SESSION_EXPORT_YYYY-MM-DD.md` — consolidated daily session export report
- `raw/` — 1:1 raw snapshots of memory-session source files
- `SESSION_EXPORT_MANIFEST.md` — inventory and trace metadata

## Export policy

1. Every exported file must include source path and export timestamp.
2. Raw files are immutable snapshots for auditability.
3. Consolidated export should summarize decisions, progress delta, blockers, and next actions.
4. Business docs remain first priority; software docs follow after business-doc readiness gates.

## RUP phase tagging

Each consolidated export should tag the active phase:

- Inception
- Elaboration
- Construction
- Transition

## Canonical linkage

- [`../INDEX.md`](../INDEX.md)
- [`../../business_docs/README.md`](../../business_docs/README.md)
- [`../INCEPTION_EXIT_READINESS_SCORECARD.md`](../INCEPTION_EXIT_READINESS_SCORECARD.md)
