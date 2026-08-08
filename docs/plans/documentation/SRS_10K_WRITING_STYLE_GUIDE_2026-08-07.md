# SRS-10K Writing Style Guide

**Status:** Active  
**Owner:** SRS Governance + Product/Architecture  
**Last Updated:** 2026-08-07  
**Source of Truth:** Quality language and structure policy for 10k SRS run

## Core writing rules

1. **Atomicity** — one requirement, one verifiable behavior/constraint.
2. **Testability** — each row must be objectively verifiable.
3. **Clarity** — no ambiguous terms without measurable bounds.
4. **Traceability** — link to UC, design/API, test, wave, and release gate.
5. **Lifecycle control** — no `Approved` status without owner/priority/dependency.
6. **Conflict control** — use supersession metadata; do not silently overwrite.
7. **Security baseline** — security/failure clauses required where risk applies.
8. **Frontend-first tagging** — frontend-impacting requirements tagged for first cluster execution.
9. **Modal consistency** — `must`, `must not`, `should`, `may` semantics are fixed.
10. **Non-duplication** — duplicates become alias links, not new canonical IDs.

## Canonical requirement template

- **ID:** `FAMILY-DOMAIN-NNNNN`
- **Alias IDs:** legacy links (optional)
- **Title:** short and precise
- **Statement:** one atomic requirement sentence
- **Rationale:** why this is required
- **Acceptance Criteria:** measurable checks
- **Failure Behavior:** expected fallback/error behavior
- **Security/Compliance:** obligations (if applicable)
- **Trace Links:** UC, design/API, test, wave, release gate
- **Lifecycle State:** Draft/Reviewed/Approved/Traced/Scheduled/Implemented/Tested/Accepted/Superseded

## Modal verb policy

- `must` / `must not`: mandatory requirement
- `should` / `should not`: strong recommendation (exception must be documented)
- `may`: optional behavior

## Anti-patterns (prohibited)

- Multi-behavior requirement sentences.
- Requirements without acceptance criteria.
- Vague statements (e.g., "fast", "user-friendly") without metrics.
- Broken trace links at promotion checkpoints.
