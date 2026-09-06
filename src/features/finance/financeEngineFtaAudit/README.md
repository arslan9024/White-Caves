# financeEngineFtaAudit

FTA (Federal Tax Authority) audit-trail module for the White Caves finance engine.

- Parent issue: #1944
- Child issue: #2403

## Overview

This module will provide a tamper-evident audit trail for finance-engine calculations
(VAT computation, invoice totals, ledger postings) so results can be verified against
FTA compliance requirements. The full data and behavioral contract is documented in
[`financeEngineFtaAudit.contract.md`](./financeEngineFtaAudit.contract.md).

## Scope of this change (issue #2403)

This change adds the module's documentation only:

- `financeEngineFtaAudit.contract.md` — data shape, validation rules, and public API
  surface that a future TypeScript implementation and its vitest test suite must satisfy.
- `README.md` (this file) — module overview, evidence, and rollback note.

No TypeScript source or test files were created or modified under this directory as part
of this change. Implementing `createFtaAuditRecord`, `validateFtaAuditRecord`, and
`computeFtaAuditHash` per the contract is tracked as follow-up work under the parent
issue #1944 and is intentionally out of scope here.

### Explicitly excluded from this change

- Parent issue closure — #1944 remains open until all child work is reconciled.
- Bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.
- Any file outside `src/features/finance/financeEngineFtaAudit/`.

## Completion evidence

- `src/features/finance/financeEngineFtaAudit/financeEngineFtaAudit.contract.md` created,
  defining `FtaAuditRecord`, `FtaAuditIssue`, `FtaAuditIssueCode`, and the expected
  `createFtaAuditRecord` / `validateFtaAuditRecord` / `computeFtaAuditHash` API surface.
- `src/features/finance/financeEngineFtaAudit/README.md` created (this file), recording
  scope, exclusions, evidence, and rollback instructions.
- No files outside this directory were read, created, or modified.
- No shell commands that mutate git history, packages, or databases were executed.

## Validation performed

Because this change is documentation-only (no `.ts`/`.tsx` source added), there is no
compiled or test surface to execute yet:

- No TypeScript files were added, so `tsc`/type-checking has no new surface to validate.
- No test files were added; a future implementation must add
  `financeEngineFtaAudit.test.ts` using `import { describe, expect, it } from 'vitest'`
  with real assertions (record creation, hash determinism, validation error codes,
  rounding behavior) against the contract defined here.
- Markdown content was manually reviewed for internal consistency (field lists, API
  surface, and acceptance-criteria mapping all cross-reference the same names).

## Rollback note

This change is additive and isolated:

1. Delete the two files added by this change:
   - `src/features/finance/financeEngineFtaAudit/financeEngineFtaAudit.contract.md`
   - `src/features/finance/financeEngineFtaAudit/README.md`
2. Remove the now-empty `src/features/finance/financeEngineFtaAudit/` directory if no
   other files were placed inside it by later work.
3. No database, secret, dependency, or build-configuration changes were made, so no
   further remediation is required to fully revert this change.
