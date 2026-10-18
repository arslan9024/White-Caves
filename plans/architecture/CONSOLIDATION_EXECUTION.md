# Runtime and Domain Consolidation Checklist

Goal: make the currently shipped Vite + Express application and its data boundaries explicit, remove redundant Vite provider wiring, and ensure CI checks both application and server TypeScript.

## Scope

- Canonical runtime and ownership notes: `docs/architecture/PLATFORM_BOUNDARIES.md`
- Vite application composition: `src/App.tsx`
- CI quality gates: `package.json`, `.github/workflows/ci.yml`, `.github/workflows/ci-cd.yml`, `tsconfig.server.json`
- Server typecheck blockers exposed and fixed in: `server/services/SchedulerService.ts`, `server/routes/invoicesLease.ts`, `server/routes/whatsapp.ts`, `server/services/whatsapp/lindaClient.ts`, and `server/services/whatsapp/linda-core/contracts/lindaCore.types.ts`
- Validation: application/server typechecks, lint, build, and focused App test when dependencies are available.

## Checklist

- [x] Inspect runtime scripts, entrypoints, routing, CI, Prisma, and legacy Mongoose use.
- [x] Document the Vite/Express production path, the separate Next.js experiment, and route ownership.
- [x] Document domain-slice conventions, active persistence authority, route-boundary contracts, and outcome-focused workflow priorities.
- [x] Remove the duplicate Redux provider from `src/App.tsx`; keep the single Vite provider in `src/index.tsx`.
- [x] Add server TypeScript checking to CI and `quality:quick`.
- [ ] Run full available validation and record any remaining environment blockers.
