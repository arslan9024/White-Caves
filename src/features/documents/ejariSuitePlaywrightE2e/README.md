# Ejari Suite Playwright E2E

Child scope of parent issue #1921 (issue #2504).

This directory holds the end-to-end (E2E) test contract, fixtures, and
helper utilities for the Ejari document suite (create → upload → verify →
download), exercised through Playwright against the application UI.

See [`ejariSuitePlaywrightE2e.contract.md`](./ejariSuitePlaywrightE2e.contract.md)
for the full functional/non-functional contract and acceptance gates.

## Scope

- **In scope**: Playwright E2E specs, page-object helpers, and fixture
  builders for the Ejari document lifecycle under this directory only.
- **Out of scope**: closing the parent issue (#1921), bulk GitHub
  mutations, destructive database operations, and production secret
  rewrites. None of the above are performed by anything in this directory.

## Structure (planned)

```
ejariSuitePlaywrightE2e/
├── ejariSuitePlaywrightE2e.contract.md   # Contract & acceptance gates
├── README.md                             # This file
├── fixtures/                             # Test data builders (additive, reversible)
├── pages/                                # Page-object helpers (data-testid based)
└── specs/                                # Playwright *.spec.ts test files
```

Only the contract and this README are introduced at this stage. Spec,
fixture, and page-object files are added incrementally in follow-up work
that must conform to the contract above.

## Running (when specs exist)

```powershell
# Playwright E2E (once specs are added under ./specs)
npx playwright test src/features/documents/ejariSuitePlaywrightE2e/specs

# Vitest unit tests for any pure helper/fixture logic in this directory
npx vitest run src/features/documents/ejariSuitePlaywrightE2e
```

## Design decisions

- **Docs-first**: Because this increment of #2504 only requires the
  contract and README, no test or source `.ts` files are created yet —
  avoiding speculative code that could drift from the eventual spec
  implementation. The contract defines strict TypeScript and vitest
  requirements up front so future specs/fixtures added here have an
  unambiguous bar to meet.
- **Directory scoping**: All planned artifacts are nested under this one
  feature directory to keep the child issue's blast radius auditable and
  independently revertible, per the parent issue's child-scope model.

## Completion evidence

- Files added: `ejariSuitePlaywrightE2e.contract.md`, `README.md`.
- No source or test files were added in this increment, so no test
  command output applies yet; the contract's acceptance gates (G1–G4)
  are satisfied structurally: work is confined to this directory, no
  GitHub issue state was mutated, and no destructive or secret-touching
  operations were performed.
- Parent issue #1921 is left open, as required.

## Rollback

To roll back this increment, delete this directory
(`src/features/documents/ejariSuitePlaywrightE2e/`). No dependencies,
schema, or secrets were modified, so removal fully reverts the change with
no side effects on the rest of the repository.
