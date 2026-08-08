# White Caves Canonical Documentation Root

**Status:** Active  
**Owner:** Documentation Governance  
**Last Updated:** 2026-08-07

This is the canonical entrypoint for all repository documentation under `docs/`.

---

## Navigation

1. Business authority: [`business_docs/README.md`](./business_docs/README.md)
2. Software authority: [`software_docs/INDEX.md`](./software_docs/INDEX.md)
3. Planning authority: [`plans/MASTER_PLAN.md`](./plans/MASTER_PLAN.md)
4. Active queue: [`plans/PENDING_TASKS_ONLY.md`](./plans/PENDING_TASKS_ONLY.md)
5. Wave registry: [`plans/waves/README.md`](./plans/waves/README.md)
6. Upgrade governance scorecard: [`UPGRADE_REFERENCE_READINESS_SCORECARD_2026-08.md`](./UPGRADE_REFERENCE_READINESS_SCORECARD_2026-08.md)

---

## Canonical precedence

When documentation conflicts occur, follow this order:

1. `docs/plans/*` (execution truth)
2. `docs/software_docs/*` (implementation truth)
3. `docs/business_docs/*` (business intent and policy)
4. historical root-level files (reference only)

---

## Runtime contract authority (backend)

- Canonical API contract verification source: `server/routes/*`
- Canonical backend entrypoint: `server/index.ts`
- `src/server/*` is compatibility/legacy unless an active wave explicitly scopes it.
