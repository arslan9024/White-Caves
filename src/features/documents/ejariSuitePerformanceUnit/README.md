# Ejari Suite Performance Unit

Issue: #2493 · Parent: #1923

## Overview

This directory hosts the specification for a benchmarking/measurement unit that evaluates the
performance characteristics (throughput and average latency per unit) of operations in the Ejari
document suite (`src/features/documents/*`). This child issue delivers the **contract and
handoff specification only** — see `ejariSuitePerformanceUnit.contract.md` for the full interface
definition, behavioral rules, and test expectations that any future implementation module in this
directory must satisfy.

## Why this exists

The Ejari document suite (contract generation, validation, submission tracking) needs a
repeatable way to measure whether a given code change regresses performance. Rather than ad-hoc
timing calls scattered through the codebase, this unit defines a single, strictly-typed contract
(`EjariPerformanceSample` → `evaluateEjariPerformance` → `EjariPerformanceReport`) so that:

- Benchmarks produce consistent, comparable output across runs and environments.
- Regressions are caught via an explicit, inclusive threshold check (`withinThreshold`).
- Invalid measurements (negative durations, zero units, mismatched operation names) fail loudly
  instead of silently skewing averages.

## Status

- ✅ Contract defined (`ejariSuitePerformanceUnit.contract.md`).
- ✅ Handoff specifications recorded (`plans/implementation_handoffs/SRS-ISSUE-W55-EJARI-BENCH-1923.md`,
  `plans/implementation_handoffs/SDD-ISSUE-W55-EJARI-BENCH-1923.md`).
- ⏳ Concrete `.ts` implementation and vitest suite: tracked under a subsequent child issue of
  parent #1923; not part of this issue's declared file scope.

## Scope boundaries

This child issue (#2493) intentionally does **not**:

- Close parent issue #1923 (remains open pending reconciliation of all child work).
- Perform bulk GitHub mutations.
- Perform destructive database operations.
- Rewrite or expose production secrets.
- Touch any file outside the four files declared for this issue.

## Rollback

All artifacts in this directory are additive documentation. To roll back, delete or revert this
directory's contents and the two handoff files under
`plans/implementation_handoffs/` named `*-EJARI-BENCH-1923.md`. No runtime code, database state,
or GitHub issue/PR state is affected by this change, so rollback carries no operational risk.
