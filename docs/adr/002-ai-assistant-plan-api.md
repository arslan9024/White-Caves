# ADR-002: AI Assistant Plan Management API (Phase 0.8)

**Date:** 2026-03-30  
**Status:** Accepted  
**Deciders:** Technical Lead (Aurora), Executive (Zoe)

---

## Context

AI assistant profiles and their operational plans are documented as Markdown files in
`business_docs/03_ai_assistants/`. Previously these were static files only accessible
to developers. Phase 0.8 requires:

1. An API to expose the list of assistants and their markdown plans to the frontend.
2. Super-user–only CRUD endpoints so the MD (Managing Director) can update plans via the CRM.
3. Frontend integration so clicking an assistant in the AI Command Center shows their plan.

---

## Decision

### Backend

- New Express router at `server/routes/assistants.ts`, mounted at `/api/assistants`.
- Plans stored as `.md` files in `business_docs/03_ai_assistants/` (existing source of truth).
- **GET /api/assistants** — public, returns metadata registry (no file I/O).
- **GET /api/assistants/:id/plan** — requires auth, reads `{id}.md` from disk.
- **POST/PUT /api/assistants/:id** — requires auth + super-user role (`owner`|`admin`).
- **DELETE /api/assistants/:id** — requires auth + super-user role.

### Security

- **Path traversal prevention:** `:id` validated against `/^[a-z0-9-]{1,64}$/` allowlist.
- **Directory confinement:** resolved path must start with `PLANS_DIR`.
- **XSS sanitisation:** `sanitizeMarkdown()` strips `<script>` tags, `on*=` event handlers,
  and `javascript:` URLs before writing to disk.
- **Auth:** all write endpoints use existing `authMiddleware` + `assertSuperUser()`.

### Frontend

- `src/services/assistantsService.ts` — typed wrapper over `apiClient`.
- `fetchAssistantPlan` async thunk in `aiAssistantDashboardSlice`.
- `plans`, `plansLoading`, `plansError` added to `AIAssistantDashboardState`.
- `AssistantPlanView` component — lazy-fetches plan on mount, renders pre-formatted markdown.
- `AssistantPlanEditor` component (super-user only) — full CRUD via dropdowns + textarea.

---

## Alternatives Considered

| Option | Reason rejected |
|--------|----------------|
| Store plans in PostgreSQL/Prisma | Adds DB migration overhead; markdown files are simpler and already exist |
| Store plans in MongoDB | Not using MongoDB in this project (Prisma/PostgreSQL) |
| Serve files via static middleware | No auth control; no write capability |
| Use a CMS | Over-engineered for 24 assistant plans |

---

## Consequences

- Plans remain in version control (git) alongside code — good for traceability.
- Write operations go through the API (not direct file edits in production).
- If plan files grow large, consider moving to DB; current max is ~50KB per file.
- `sanitizeMarkdown()` is a lightweight allowlist; if rich markdown rendering is added
  later, integrate `DOMPurify` on the client side.
