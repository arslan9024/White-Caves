# documentExtractDataPassports

Passport data-extraction contract for the document processing feature
area. Tracked under issue #2375, child of parent issue #2027.

## What this is

This folder currently defines the **data contract** for extracting
structured fields from a passport document (document number, names,
nationality, dates, sex, issuing country) along with per-field
confidence scores and a discriminated result union
(`success` / `partial` / `failed`).

See [`documentExtractDataPassports.contract.md`](./documentExtractDataPassports.contract.md)
for the full TypeScript type definitions and behavioral rules.

## What this is not

- No OCR/ML provider is called or configured here.
- No database schema or persistence logic lives in this folder.
- No UI components for uploading/reviewing passports are included.
- No GitHub issues are opened, modified, or closed by this change,
  including the parent issue #2027, which remains open pending
  reconciliation of all sibling child issues.

## Scope boundaries (issue #2375)

**In scope:** contract/type definitions and documentation for passport
data extraction, confined to
`src/features/documents/documentExtractDataPassports/`.

**Explicitly excluded:**

- Parent issue closure.
- Bulk GitHub mutation.
- Destructive database operations.
- Production secret rewrites.

## Validation performed

This change adds documentation-only artifacts (`.contract.md`,
`README.md`). No `.ts`/`.tsx` source or test files were part of the
declared file list for this child issue, so no vitest suite was added
or executed as part of this change. Validation consisted of:

- Manual review of the contract for internal consistency (field names,
  confidence bounds, status transitions).
- Confirming no files outside the declared list were created or
  modified.

Required validation command for this repository's future TypeScript
implementation of this contract (to be run once the adapter code
lands in a subsequent child issue):

```
npx vitest run src/features/documents/documentExtractDataPassports
```

## Completion evidence

- Created: `documentExtractDataPassports.contract.md` — full data
  contract (request/response types, confidence rules, status
  transitions, acceptance-criteria mapping).
- Created: `README.md` (this file) — scope summary, exclusions, and
  rollback note.
- No other files in the repository were read, modified, or deleted.

## Rollback note

To roll back this change, delete the two files added in this commit:

```
src/features/documents/documentExtractDataPassports/documentExtractDataPassports.contract.md
src/features/documents/documentExtractDataPassports/README.md
```

Since no other files were modified and no code wires into these
documents yet, deleting them fully reverts this change with no
side effects on the rest of the codebase. Parent issue #2027 tracking
state is unaffected either way.
