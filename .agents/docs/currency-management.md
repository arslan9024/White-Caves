# Currency Management

> **Owner:** @Anima | **Tool:** DeepSeek Chat (DeepSeek V3)
> **Purpose:** Multi-currency support with live exchange rates (AED base + 8 currencies).
> **Status:** Stub -- awaiting expansion by @Anima.

---

## 1. Overview

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 2. Supported Currencies and ISO Codes

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

## 3. Live Rate Source and Cache Strategy

> _[Action Required: Enforce production-ready engineering constraints]: expand this section with full spec._

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
