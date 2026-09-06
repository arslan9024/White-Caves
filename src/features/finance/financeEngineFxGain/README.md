# Finance Engine — FX Gain/Loss

- Issue: [#2422](../../../../../plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md)
- Parent issue: #1939 (Finance Engine — multi-currency support)

## What this is

This folder is the child-scope handoff for the **FX gain/loss calculation**
sub-feature of the finance engine, tracked under parent issue #1939. It
contains the functional contract (`financeEngineFxGain.contract.md`) that
defines the expected inputs, outputs, rounding, and edge-case behavior for
realized and unrealized FX gain/loss calculations on multi-currency finance
transactions.

Implementation source (`financeEngineFxGain.ts`) and its vitest test suite
(`financeEngineFxGain.test.ts`) are delivered by the implementation child
issue that consumes this contract; this handoff establishes the agreed
contract, the SRS, and the SDD so that implementation and QA can proceed
without ambiguity.

## Why it exists

The finance engine must support transactions booked in a currency other than
the organization's base reporting currency. Whenever the exchange rate moves
between booking and settlement (or between booking and a reporting valuation
date), the organization realizes or accrues an FX gain or loss. This must be
calculated consistently, deterministically, and independently of any single
UI or persistence layer so it can be reused across invoicing, payments, and
reporting features.

## Scope boundaries

- **In scope**: pure calculation contract for realized/unrealized FX
  gain-or-loss, rounding rules, and invalid-input handling.
- **Out of scope**: persistence, API routes, UI, live rate-fetching, and any
  action that would close the parent issue (#1939) or perform bulk GitHub
  mutations, destructive database operations, or production secret rewrites.

## Related documents

- Contract: `./financeEngineFxGain.contract.md`
- SRS: `../../../../plans/implementation_handoffs/SRS-ISSUE-W56-FINANCE-FX-1939.md`
- SDD: `../../../../plans/implementation_handoffs/SDD-ISSUE-W56-FINANCE-FX-1939.md`

## Status

This handoff documents the contract only. Parent issue #1939 remains open
until all child work items (including the calculation implementation, its
tests, and downstream integration) are reconciled.
