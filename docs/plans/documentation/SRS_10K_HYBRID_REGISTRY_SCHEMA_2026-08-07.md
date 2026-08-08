# SRS-10K Hybrid Registry Schema

**Status:** Active  
**Owner:** SRS Governance + Data/Architecture  
**Last Updated:** 2026-08-07  
**Source of Truth:** Canonical registry row schema for hybrid requirements + UC linkage

## Purpose

Provide the canonical row schema used to track 10,000 requirement records and their UC/design/test/wave links.

## Required columns

| Column | Type | Required | Description |
| --- | --- | --- | --- |
| canonicalId | string | Yes | `FAMILY-DOMAIN-NNNNN` |
| aliasIds | string[] | No | Legacy IDs (e.g., `REQ-*`) |
| domain | string | Yes | Domain code and name |
| priority | enum | Yes | `P0`, `P1`, `P2`, `P3` |
| lifecycleState | enum | Yes | Draft, Reviewed, Approved, Traced, Scheduled, Implemented, Tested, Accepted, Superseded |
| owner | string | Yes | Responsible owner/team |
| primaryUcId | string | Yes | Primary UC linkage |
| secondaryUcIds | string[] | No | Additional UC linkages |
| designOrApiLink | string | Yes | Design/API authority link |
| testLink | string | Yes | Test evidence link |
| waveLink | string | Yes | Wave task/backlog linkage |
| releaseGateLink | string | Yes | Release/readiness evidence link |
| supersedes | string | No | Replaced canonical ID |
| supersededBy | string | No | Replacement canonical ID |
| notes | string | No | Controlled notes |

## Promotion gates

A row cannot move to `Approved` unless all required columns are populated.

A row cannot move to `Accepted` unless `testLink`, `waveLink`, and `releaseGateLink` point to valid artifacts.

## Integrity rules

1. `canonicalId` must be unique.
2. `aliasIds` cannot duplicate any canonical ID.
3. `primaryUcId` must exist in UC authority surfaces.
4. `supersedes` and `supersededBy` pairs must be reciprocal when both present.

## Checkpoint audits

At each 1,000-ID checkpoint:

- uniqueness check
- orphan-link check
- lifecycle-state gate check
- crosswalk consistency check

## Related artifacts

- `docs/plans/documentation/REQ_CROSSWALK.md`
- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/software_docs/03_use_cases/UC_MASTER_LIBRARY_12_DEPARTMENTS.md`
