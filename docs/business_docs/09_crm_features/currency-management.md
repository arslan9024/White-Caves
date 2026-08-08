# Currency Management

> **Owner:** @Anima | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Multi-currency support with live exchange rates (AED base + 8 currencies).
> **Status:** Active -- requirement catalog expanded.
> **Last Updated:** 2026-08-07
> **Next Review:** 2026-08-21
> **Source of Truth:** CRM currency management feature specification (business layer)

## Canonical governance links

- [`../05_requirements/functional-requirements.md`](../05_requirements/functional-requirements.md)
- [`../05_requirements/non-functional-requirements.md`](../05_requirements/non-functional-requirements.md)
- [`../../plans/documentation/REQ_CROSSWALK.md`](../../plans/documentation/REQ_CROSSWALK.md)
- [`../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`](../../software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md)

## Feed targets

- `docs/software_docs/01_requirements_engineering/SRS_MASTER_12_DEPARTMENTS.md`
- `docs/plans/documentation/REQ_CROSSWALK.md`
- frontend reporting/formatting reliability lanes in `docs/plans/waves/WAVE_39_*` and `WAVE_40_*`

---

## 1. Overview

Currency management keeps AED as the base currency while supporting controlled display and conversion in secondary currencies.

## Requirement catalog

### REQ-CUR-001: Supported currency list and conversion display

The system shall support the documented set of display currencies with ISO codes and symbols.

**Acceptance criteria:**

- [ ] AED remains the accounting base currency
- [ ] Secondary display currencies are selectable where allowed
- [ ] Currency symbols and codes are shown consistently

**Evidence:** currency settings snapshot and display render test.

### REQ-CUR-002: Rate source and cache policy

The system shall fetch exchange rates from live providers and cache them for a controlled TTL.

**Acceptance criteria:**

- [ ] Live rates are fetched from the primary provider
- [ ] Secondary fallback is used when the primary fails
- [ ] Cached rates remain available during provider outages

**Evidence:** rate fetch log, fallback log, and cache snapshot.

### REQ-CUR-003: Historical rates and report consistency

The system shall retain historical daily rates for backdated financial reporting.

**Acceptance criteria:**

- [ ] Daily close rates are persisted
- [ ] Historical reports reproduce the exact past rate
- [ ] Immutable snapshots are retained

**Evidence:** historical rate record and report reconciliation.

### REQ-CUR-004: Conversion API and user validation

The system shall expose a conversion API with tolerance checks against provider variance.

**Acceptance criteria:**

- [ ] Conversion results match provider tolerance bounds
- [ ] Invalid currency codes are rejected
- [ ] All conversions are logged for audit purposes

**Evidence:** conversion log and API validation result.

## Traceability

- Maps to `REQ-FRPT-002` and finance display workflows in `functional-requirements.md`
- Aligns to `WC-SRS-010` and currency reporting artifacts
- Feeds report rendering, conversions, and reconciliation validation

## 2. Supported Currencies and ISO Codes

Supported currencies should remain AED base with the documented secondary list and ISO metadata.

## 3. Live Rate Source and Cache Strategy

Currency management requirements are now captured in the catalog below, covering conversion display, cache policy, historical rates, and user preference controls.

## 4. AED Base Policy

- All financial storage and reconciliation in AED.
- Display conversions are presentation-only.

## 5. Rate Provider Fallback

- Primary provider + secondary fallback source.
- Outage fallback to last-known-good rates.

## 6. Cache and TTL

- In-memory cache with 4-hour TTL.
- Optional Redis layer for multi-instance parity.

## 7. Historical Rates

- Daily close rates persisted for backdated reports.
- Immutable historical snapshots.

## 8. API Contract

- `GET /api/currency/rates`
- `GET /api/currency/rates/history`
- `POST /api/currency/convert`

## 9. Acceptance Criteria and Tests

- Converted values match provider tolerance bounds.
- Provider failover is transparent to users.
- Historical-rate reporting reproduces exact past values.

---

_This file was scaffolded by scripts/orchestrator/scaffold-docs.ps1.
Expand each section to reach the gate-check target using the owning agent's free AI tool._
