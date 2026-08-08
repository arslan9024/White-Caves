# SRS-10K ID Allocation Matrix

**Status:** Active  
**Owner:** SRS Governance  
**Last Updated:** 2026-08-07  
**Source of Truth:** Canonical allocation policy for 10k SRS run

## Purpose

Define collision-safe canonical ID ranges for the hybrid 10k SRS program.

## Canonical format

`{FAMILY}-{DOMAIN}-{NNNNN}`

- `FAMILY`: `FR`, `BR`, `NFR`, `POL`, `SEC`, `INT`, `OBS`, `AC`
- `DOMAIN`: three-letter functional domain code
- `NNNNN`: fixed 5-digit sequence

## Family range allocation (10,000 total)

| Family | Range start | Range end | Capacity | Notes |
| --- | --- | --- | --- | --- |
| FR | 00001 | 03000 | 3000 | Functional behavior |
| BR | 03001 | 04500 | 1500 | Business rules |
| NFR | 04501 | 05800 | 1300 | Quality attributes |
| POL | 05801 | 07000 | 1200 | Policy and governance constraints |
| SEC | 07001 | 08000 | 1000 | Security controls |
| INT | 08001 | 09000 | 1000 | Integration/interface obligations |
| OBS | 09001 | 09600 | 600 | Observability and telemetry behaviors |
| AC | 09601 | 10000 | 400 | Acceptance and release-gate requirements |

## Domain code starter set

| Domain code | Meaning |
| --- | --- |
| LEA | Leads/CRM pipeline |
| PRO | Property/listings |
| TEN | Tenancy/leasing |
| FIN | Finance/commission/payments |
| CMP | Compliance/regulatory |
| CHN | Communication channels (WhatsApp/email) |
| ANA | Analytics/reporting |
| PLT | Platform/runtime |
| UXR | Frontend UX/resilience |
| SEC | Security/auth |

## Collision-prevention rules

1. IDs are immutable once published.
2. Deleted requirements are superseded, never renumbered.
3. Legacy business `REQ-*` identifiers are stored as aliases only.
4. Promotion to `Approved` is blocked if canonical ID already exists.

## Checkpoint policy

Run collision audit and orphan-link audit at every 1,000 requirement checkpoint (`C1`..`C10`).
