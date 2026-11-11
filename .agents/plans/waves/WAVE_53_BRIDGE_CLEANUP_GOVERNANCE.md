# Wave 53 — Bridge, Cleanup & Governance

> Branch: `copilot/wave-53-bridge-cleanup-governance`
> Source: Ask-agent audit session 2026-11-12 (Docker/Vercel/backend architecture review)
> Objective: Fix live production bugs, bridge the local full backend to the Vercel frontend
> via Cloudflare Tunnel, remove dual-tech dead weight, and codify prevention laws
> (TURING-RULE-005..009) so the drift cannot recur.

## Execution order

| #   | Wave                           | Scope                                                                                                                                                                                                                                                                                                                                                                                                                                              | Gate                                  |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| 1   | B — Production bug repairs     | Wrong engine imports in `api/index.js` (L270-272); unify API URL fallbacks (`socketService.ts` 3001 → shared constant); honest `501` envelopes for mock WhatsApp/landlord endpoints                                                                                                                                                                                                                                                                | `npm run typecheck`                   |
| 2   | A — Cloudflare tunnel bridge   | `server/config/cors.ts` static origins + safe suffixes (`.trycloudflare.com`, `-arslan-maliks-projects.vercel.app`); `realtimeService.ts` shared CORS validator; `scripts/start-tunnel.ps1` (port auto-detect, restart loop); `scripts/server-watchdog.ps1`; npm scripts `tunnel:quick/named`, `serve:bridge`; `docs/CLOUDFLARE_TUNNEL_SETUP.md`; `.env.example` CORS_ORIGIN docs                                                                  | typecheck + `cors.test.ts`            |
| 3   | C — Dead-weight cleanup        | Delete broken `docker-compose.dev.yml` + unused compose/Dockerfiles (keep `Dockerfile.prod`, `.dockerignore`); remove CI `docker-package` job + CD SSH deploy; remove Next.js (`next.config.mjs`, scripts, dep); uninstall dead deps (`axios`, `joi`, `react-query`, `react-spring`); migrate 1 axios file to fetch; delete twin `.jsx` login buttons; delete `LegacyLogger.js`; dedupe `firebase.d.ts`; verify + remove `api/relational-sidebar/` | typecheck + build                     |
| 4   | G — Turing protocol governance | TURING-RULE-005 (Single Data Layer), 006 (Dependency Singularity), 007 (No Twin Files / Zombie Suffix), 008 (UI Component Hierarchy), 009 (TS-only accretion) in `turingRules.ts`; `.github/instructions/ui-component-hierarchy.instructions.md`; `scripts/validate-structure.mjs` enforcement; `.gitattributes` + renormalize                                                                                                                     | `node scripts/validate-structure.mjs` |
| 5   | D — Frontend resilience        | `fetchWithRetry` (502-504 backoff); `useBackendStatus` hook + reconnect banner                                                                                                                                                                                                                                                                                                                                                                     | typecheck + unit tests                |
| 6   | F — Decomposition (started)    | Split `server/index.ts` route mounting into registry modules; split `api/index.js` by domain. `App.tsx`, `useSignIn.ts`, `complianceRoutes.js` tracked as follow-up batch                                                                                                                                                                                                                                                                          | typecheck + build + smoke boot        |
| 7   | E — Hygiene                    | Rename `NinaWhatsAppBotCRM_NEW`; docs sync; dep prune/audit                                                                                                                                                                                                                                                                                                                                                                                        | `quality:quick` + `plans:validate`    |

## Deferred (documented, NOT in this wave)

- **Wave H — ORM unification ADR**: Mongoose (82 files) vs Prisma (44 files) both target
  MongoDB. Interim law: TURING-RULE-005 freezes the non-designated ORM (no new Prisma
  files) until a dedicated migration wave with its own plan, data-layer tests, and
  sequencing. Full migration is weeks of work across 120+ files — out of scope here.
- **PR #2550 split strategy**: extract green dependency upgrades into a standalone PR;
  keep E2E-blocked work isolated.

## Manual operator steps (non-automatable)

1. `cloudflared tunnel login` (Cloudflare account)
2. `cloudflared tunnel create white-caves-api`
3. `cloudflared tunnel route dns white-caves-api api.whitecaves.com`
4. Vercel → Settings → Environment Variables → `VITE_API_URL=https://api.whitecaves.com` → redeploy

## Laws enforced during this wave

- Single Purpose File Law (350-line ceiling) on all new files
- Diff batches < 500 lines per commit; one coherent commit per sub-wave
- No `--no-verify`; named branch; tag `wave-53-complete` before merge
- No new `.js`/`.jsx` files; strict TypeScript for all new code
