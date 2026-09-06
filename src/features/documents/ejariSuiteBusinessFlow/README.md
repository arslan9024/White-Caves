# Ejari Suite Business Flow

Module scope: `src/features/documents/ejariSuiteBusinessFlow/`

- Parent issue: #1922
- Child issue: #2500 (this issue)

## What this module is

`ejariSuiteBusinessFlow` documents and, in follow-on child issues, will
implement the business flow that governs Ejari (Dubai tenancy contract
registration) document processing inside the `documents` feature area.
It defines a state machine describing how a tenancy record moves from
initial draft through document collection, submission, registrar review,
and final certificate issuance (or cancellation).

See [`ejariSuiteBusinessFlow.contract.md`](./ejariSuiteBusinessFlow.contract.md)
for the authoritative contract: states, allowed transitions, required
inputs, invariants, and validation expectations.

## Why this exists

The Ejari registration process touches multiple concerns (document
upload/validation, submission to the registrar, status polling,
remediation on rejection). Centralizing the business flow contract in one
place ensures:

- A single source of truth for valid states/transitions that all
  consuming components, hooks, and slices must respect.
- Predictable, testable behavior instead of ad-hoc status flags scattered
  across components.
- A stable seam for future implementation work tracked under the #1922
  parent issue without re-litigating the state model each time.

## Current status

This child issue (#2500) establishes the contract and this README only.
No TypeScript implementation, hooks, or UI components are introduced here.
Implementation, wiring, and tests are expected in subsequent child issues
under #1922, which must conform to the contract documented alongside this
README.

## Scope boundaries

In scope for this module (present and future child issues):

- The Ejari business flow state machine and its consumers within
  `src/features/documents/`.

Out of scope (see contract for full exclusions):

- Parent issue #1922 closure.
- Bulk GitHub mutations.
- Destructive database operations.
- Production secret rewrites.

## Validation expectations for implementers

Any TypeScript module added under this directory must:

- Use strict TypeScript with no `any` types.
- Be covered by vitest tests (`import { describe, expect, it } from 'vitest'`)
  asserting real state-transition behavior (valid/invalid transitions,
  terminal-state guards, document-completeness invariant) rather than
  placeholder assertions.
- Avoid introducing new dependencies unless explicitly required and
  approved as part of that child issue's scope.

## Rollback

Deleting this directory fully removes the documentation added by #2500
with no impact on other modules, since no runtime code or exports exist
here yet.
