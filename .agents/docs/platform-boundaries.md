# Platform Boundaries and Consolidation Decisions

Status: Vite + Express is the canonical application path. The Next.js tree is a parallel migration/experiment and is not part of the release quality gate.

## Runtime and route ownership

### Canonical application

The supported browser application is Vite:

`index.html` → `src/index.tsx` → `src/App.tsx` → `src/AppRouter.tsx`

Vite is the package `dev` and `build` path, and `src/index.tsx` is its only React bootstrap. That entrypoint owns the Redux provider and global providers. `App.tsx` composes application-level UI and must not create a second Redux store provider.

`src/AppRouter.tsx` is the route registry for the Vite application. It currently registers `/`, `/marketing`, `/sales`, `/off-plan`, `/documents`, `/settings`, and `/feature-status`. A component in `src/pages/` is not automatically a route: it is active only when reached through this registry or another explicitly registered route/component. `src/pages/` also contains domain screens and shared modules imported by the dashboard; keep route registration centralized rather than deriving routes from filenames.

### Next.js tree

Root `app/` and `next.config.mjs` form a separate Next.js App Router implementation; `pages/_app.tsx` is a Pages Router shim. The Next tree includes its own page and API routes, including a second leads API path. `next:build` is not the release build, and `next.config.mjs` currently suppresses TypeScript and ESLint build errors. Do not deploy or treat this tree as production-ready until the team explicitly promotes it, removes those suppressed checks, and verifies route, API, authentication, and data-contract parity. Avoid adding a feature to both stacks.

## Domain boundaries for new features

Do not reorganize established modules in bulk. For new or substantially extended functionality, keep the vertical slice together under `src/features/<domain>/`, using relevant folders such as `components/`, `hooks/`, `services/`, `state/`, `schemas/`, and `__tests__/`. Put shared layouts and cross-domain UI in `src/components/`; keep page composition in the route registry and domain state in Redux slices/services. A feature should have one owner for its UI route, state, API client, and tests.

On the server, keep HTTP contracts in `server/routes/`, reusable business behavior in `server/services/`, and cross-cutting policy in `server/middleware/`. Do not introduce competing route, state, database, or validation frameworks.

## Persistence and API contracts

For net-new work in the canonical TypeScript Express server, use the shared Prisma client from `server/database.ts` and models in `prisma/schema.prisma`. This is the primary persistence path, not yet the only persistence implementation: legacy JavaScript entrypoints and modules still use Mongoose through `server/lib/database.js` and `server/models/`. Treat those as compatibility surfaces; do not silently duplicate or migrate their data models. A future migration should be domain-by-domain, with explicit data-parity and rollback checks.

Define request schemas and response DTOs at the route boundary, validate before service/database calls, and test invalid as well as successful inputs. Prefer the existing Zod dependency for new shared schemas rather than adding another validation library. The current `server/middleware/validation.ts` contains bespoke validators; it is not yet a universal route-schema layer. Expand or replace it incrementally and keep response envelopes consistent.

## Quality gates

The Vite build is `npm run build`. TypeScript quality requires both `npm run typecheck` (client/shared project) and `npm run typecheck:server` (Express/server project); lint and tests remain separate gates. `next:build` is optional migration validation only, not a substitute for either canonical check. CI and the quick quality script should run the server check as well as the existing client check.

## Feature completion priorities

Prefer closing complete user workflows over creating more standalone modules. Use these as the first outcome slices:

1. Lead → viewing → offer: authenticated ownership, validated state transitions, auditable assignment and stage changes, user-visible errors, and reporting from lead through accepted/rejected offer.
2. Lease → payment → maintenance: tenant/landlord authorization, payment and cheque status history, maintenance SLA and escalation trail, resilient empty/error states, and an end-to-end status view.
3. Compliance document review: role-gated upload/review/decision, field-level validation, immutable decision history, clear missing-document states, and exportable review status.

For each slice, define acceptance criteria across authorization, persistence, audit events, failure/empty states, and an observable completion metric before implementation.
