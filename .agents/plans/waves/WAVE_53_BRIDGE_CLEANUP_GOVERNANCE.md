# Wave 53 — Bridge, Cleanup & Governance

> Branch: `copilot/wave-53-bridge-cleanup-governance`
> Source: Ask-agent audit session 2026-11-12 (Docker/Vercel/backend architecture review)
> Objective: Fix live production bugs, bridge the local full backend to the Vercel frontend
> via Cloudflare Tunnel, remove dual-tech dead weight, and codify prevention laws
> (TURING-RULE-005..009) so the drift cannot recur.

## Completion repair cycle (2026-11-12)

Status: LOCAL REPAIRS VERIFIED; LIVE DEPLOYMENT BLOCKED. Previous completion tagging did not
establish end-to-end readiness.

- Ownership-safe supervision now rejects occupied ports and owns one direct Node
  child. The bridge uses production mode, disables development auth bypass, and
  requires authenticated health identity before exposing a service.
- Shared retry logic never replays writes after gateway/network failure; backoff
  is abortable. Auth/V1 clients honor the configured backend. Status polling,
  outage dismissal/recovery and relative Socket.io configuration are wired.
- `server/index.ts`, `api/index.ts`, `src/App.tsx` and `src/hooks/useSignIn.ts`
  are composition/compatibility entries with co-located typed modules. Root
  route decisions live in logic hooks, not presentation files.
- The serverless entry now has valid engine exports, explicit database wiring,
  Express 5-safe 404 handling, bounded pricing input and safe error envelopes.
  Inventory routes mount once at startup, with statistics before the dynamic id.
  Shared JWT/RBAC guards reject anonymous and unscoped agent access before any
  database call; private reads require manager level, writes require edit
  permission, and audit attribution uses the authenticated actor.
- Mock-only sourcing, owner, analytics, booking and recommendation-persistence
  operations return explicit 501 responses rather than invented persistence or
  completion. These are unavailable capabilities, not completed features.
- Deployment verification YAML is valid and does not claim to deploy. Exact
  preview CORS origins replace suffix trust; CSP permits the named API and socket.
- Structure enforcement uses per-path debt: replacement JS, oversized-file growth,
  frozen-directory swaps and baseline updates that bless violations fail.
  Both current ORM consumers remain supported; no winner was selected.
- The approved runtime floor is Node 22.19.0. Version-manager hints, runtime guard,
  CI minimum/current matrix, agent guidance and optional Docker build agree.
  Lighthouse CLI is 0.16.1; production audit is clean and full audit has no high/
  critical findings (14 low/moderate development findings remain).
- Live Cloudflare login/DNS, Vercel configuration, remote CI and authenticated E2E
  remain unverified until their actual prerequisites are available.

No credentials, unrelated working-tree changes, deployment or merge are authorized
by this checklist. Earlier cleanup commits remain separate from this repair cycle.

## Validation evidence

- Final `npm run quality:quick`: passed after runtime, routing and authorization
  repairs (client/server types, full lint, structure and production build).
- Final focused Vitest aggregate: 19 suites, 285 tests passed across routing,
  sign-in, API/resilience, authentication/RBAC, runtime and governance.
- All three PowerShell supervisor/tunnel scripts parse successfully.
- `git diff --check` passes; all new source modules meet the 350-line ceiling.
- `src/App.test.tsx`: all 34 pass after repairing stale route mocks/expectations.
  The earlier 10 failures were also reproduced at unchanged HEAD. Tests now
  exercise the current modern dashboard and `/dashboard2` CRM entry contracts;
  production routing was not changed to fit obsolete tests.
- `src/hooks/useSignIn.test.ts`: all 36 passed.
- Owned-process smoke: bundled serverless health 200 and API 404; full backend
  health identity/auth requirement, protected API 401 and Engine.IO handshake 200.
  The owned process was stopped; no unrelated process was stopped.
- Local Chromium production preview: 2 passed, 3 skipped. The new outage/recovery
  test passed, including repeated outage visibility and 44px dismissal target.
  Existing dashboard smoke skips are not authenticated journey coverage.
- `npm run plans:validate`: passed. Full progress intelligence and the one-shot
  dashboard expose daily/monthly developed/fixed/upgraded counts plus ETA and
  velocity. Their queue-based completion/quality signals are not test results.
- `npm audit --omit=dev --audit-level=low`: zero vulnerabilities.
  Full audit: 0 high/critical, 12 moderate and 2 low, all development tooling.
- Initial `npm install` hit a Windows lock replacing the unchanged Prisma engine.
  `npm install --ignore-scripts` completed the tooling-only update without stopping
  another process. No Prisma schema or migration changed. Do not claim a fresh
  successful Prisma generation; retry it after the engine's owner releases it.
- Remote workflows, actual Vercel function packaging, named-tunnel reconnect/reboot,
  and authenticated live journeys have not been verified.

## Deferred (documented, NOT in this wave)

- **Wave H — ORM ownership ADR**: Prisma and Mongoose both have current consumers.
  Document collection ownership, parity tests and rollback before migration. There
  is no approved designated winner and no blanket Prisma import freeze.
- **Inactive compliance prototype**: `server/routes/api/complianceRoutes.js` is an
  unmounted CommonJS prototype, not the registered `server/routes/compliance.ts`.
  Do not activate or split it into new production endpoints without statutory API
  parity and RBAC review. Active compliance behavior is intentionally preserved.
- Remaining low/moderate development advisories require a separately scoped
  compatible toolchain update; audit's suggested downgrades/forced overrides were
  not applied.
- **PR #2550 split strategy**: extract green dependency upgrades into a standalone PR;
  keep E2E-blocked work isolated.

## Manual operator steps (non-automatable)

1. Install `cloudflared` and configure production backend secrets outside Git.
2. `cloudflared tunnel login` and `cloudflared tunnel create white-caves-api`.
3. Configure external ingress and `cloudflared tunnel route dns white-caves-api api.whitecaves.com`.
4. Vercel → Settings → Environment Variables → `VITE_API_URL=https://api.whitecaves.com`.
   The built-in serverless API also requires server-only `JWT_SECRET` and
   `DATABASE_URL` for its shared authenticated configuration, including startup
   for health checks. Never expose these through `VITE_*` variables. Redeploy.
5. Verify HTTPS REST, authenticated journeys, WebSocket upgrade/reconnect, restart
   ownership and remote CI/review before any merge or completion tag.

## Laws enforced during this wave

- Single Purpose File Law (350-line ceiling) on all new files
- Diff batches < 500 lines per commit; one coherent commit per sub-wave
- No `--no-verify`; named branch; tag `wave-53-complete` before merge
- No new `.js`/`.jsx` files; strict TypeScript for all new code
