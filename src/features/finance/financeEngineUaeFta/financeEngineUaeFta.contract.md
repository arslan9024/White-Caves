# Finance Engine — UAE FTA VAT Contract

Issue: #2472 (child of parent #1927, work stream `W56-FINANCE-VAT`)

## Purpose

Defines the behavioral contract for the UAE Federal Tax Authority (FTA) VAT
calculation module inside `src/features/finance/financeEngineUaeFta/`. This
document is the source of truth for any implementation, test, or refactor of
this module. Where a prior implementation disagrees with this contract, the
contract wins and the implementation must be aligned to it.

## Scope

In scope:

- Computing standard-rated (5%), zero-rated (0%), and exempt VAT line items
  for UAE-domiciled invoices and credit notes.
- Rounding VAT amounts per FTA guidance (round-half-up to 2 decimal places,
  applied per line item, not on the invoice total).
- Producing a VAT summary (output VAT, input VAT, net VAT payable/reclaimable)
  for a given reporting period.
- Validating that a Tax Registration Number (TRN) is a 15-digit numeric
  string before it is attached to a taxable transaction.

Out of scope (excluded from this child issue):

- Filing/submission integration with the FTA e-Services portal.
- Multi-jurisdiction tax engines (only UAE FTA rules are covered here).
- Persisting VAT records to a database (this module is a pure calculation
  layer; persistence is handled by a separate service).
- Parent issue closure, bulk GitHub mutation, destructive database
  operations, and production secret rewrites (per orchestrator exclusions).

## Public API Contract

The module exposes the following exported symbols (implementation file:
`financeEngineUaeFta.ts`, colocated with this contract):

```ts
export type VatRateCategory = 'standard' | 'zeroRated' | 'exempt' | 'outOfScope';

export interface VatLineItem {
  readonly description: string;
  readonly netAmount: number; // AED, exclusive of VAT
  readonly category: VatRateCategory;
}

export interface VatLineItemResult extends VatLineItem {
  readonly vatRate: number; // 0.05 for standard, 0 otherwise
  readonly vatAmount: number; // rounded to 2 decimals
  readonly grossAmount: number; // netAmount + vatAmount
}

export interface VatSummary {
  readonly outputVat: number;
  readonly inputVat: number;
  readonly netVatPayable: number; // may be negative (reclaimable)
  readonly lineItems: readonly VatLineItemResult[];
}

export function calculateLineItemVat(item: VatLineItem): VatLineItemResult;

export function summarizeVat(
  outputLineItems: readonly VatLineItem[],
  inputLineItems: readonly VatLineItem[]
): VatSummary;

export function isValidUaeTrn(trn: string): boolean;

export class InvalidTrnError extends Error {
  constructor(trn: string);
}
```

## Behavioral Rules

1. `calculateLineItemVat`:
   - `category === 'standard'` → `vatRate = 0.05`.
   - `category === 'zeroRated' | 'exempt' | 'outOfScope'` → `vatRate = 0`.
   - `vatAmount = round2(netAmount * vatRate)` using round-half-up.
   - `grossAmount = round2(netAmount + vatAmount)`.
   - Throws `RangeError` if `netAmount` is negative or non-finite.

2. `summarizeVat`:
   - `outputVat` = sum of `vatAmount` across `outputLineItems` (after
     per-line calculation), rounded to 2 decimals.
   - `inputVat` = sum of `vatAmount` across `inputLineItems`, rounded to 2
     decimals.
   - `netVatPayable = round2(outputVat - inputVat)`.
   - `lineItems` contains all output line item results followed by all input
     line item results, each tagged via its own `category`.

3. `isValidUaeTrn`:
   - Returns `true` only for strings matching `^\d{15}$`.
   - Returns `false` for `null`-like, empty, non-numeric, or wrong-length
     input; never throws.

4. `InvalidTrnError`:
   - Message format: `` `Invalid UAE TRN: "${trn}". Expected 15 numeric digits.` ``.
   - Consumers (e.g. invoice issuance flow) must throw this error instead of
     a generic `Error` when attaching an invalid TRN to a taxable
     transaction, so callers can pattern-match on `instanceof`.

## Non-Functional Requirements

- Strict TypeScript, no `any`, no implicit `any` escapes via `unknown`
  casts without narrowing.
- Pure functions only — no I/O, no network, no filesystem access.
- Deterministic: given identical inputs, outputs are byte-identical
  (important for FTA audit trails).

## Test Contract

Any test suite for this module (e.g. `financeEngineUaeFta.test.ts`) must use
`vitest` (`import { describe, expect, it } from 'vitest'`) and assert real
computed values — no placeholder `expect(true).toBe(true)` assertions.
Minimum required cases:

- Standard-rated line item computes 5% VAT correctly with rounding.
- Zero-rated and exempt line items compute 0 VAT.
- `summarizeVat` nets output VAT against input VAT correctly, including the
  reclaimable (negative) case.
- `isValidUaeTrn` accepts a valid 15-digit TRN and rejects short, long,
  non-numeric, and empty strings.
- `InvalidTrnError` carries the offending TRN in its message.

## Completion Evidence

- This contract file and the accompanying `README.md` were authored under
  issue #2472 as the documentation/handoff deliverable for work stream
  `W56-FINANCE-VAT` (parent #1927).
- No source implementation files were created or modified as part of this
  child issue; this deliverable is the SRS/SDD-aligned contract that a
  subsequent implementation child issue must satisfy.

## Rollback Note

This is a net-new documentation artifact with no runtime impact. To roll
back, delete this file and `README.md` in this directory; no other files
depend on them at this stage since no implementation exists yet.
