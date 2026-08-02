# 🟡 Architecture & Code Quality Improvements

> **Phase assignments**: Phase 3, Phase 9  
> **Parent backlog**: [IMPROVEMENTS_BACKLOG.md](./IMPROVEMENTS_BACKLOG.md)  
> **Priority**: Medium-High — these are foundational correctness issues that affect every feature built on top

---

## Item 13 — No Request Validation Library (Zod)

**Phase**: Phase 3  
**Current state**: Route handlers do ad-hoc field checks with `if (!req.body.name)` patterns. `sanitize.ts` handles XSS but not schema shape, types, or range validation. Malformed payloads silently pass through.

### What Needs Doing
- [ ] Install: `npm install zod`
- [ ] Create `server/validation/schemas/` — one schema file per resource:
  - `leadSchemas.ts` — `CreateLeadSchema`, `UpdateLeadSchema`
  - `propertySchemas.ts` — `CreatePropertySchema`, `UpdatePropertySchema`
  - `clientSchemas.ts`, `userSchemas.ts`, `agentSchemas.ts`, `contractSchemas.ts`
- [ ] Create `server/middleware/validateRequest.ts` — generic Express middleware that wraps `schema.parse(req.body)` and returns a `422 Unprocessable Entity` on failure
- [ ] Apply `validateRequest(schema)` middleware to all `POST` and `PATCH` routes
- [ ] Ensure Zod errors are serialized into the standard `AppError` format (consistent with Item 15)
- [ ] Remove ad-hoc field checks from route handlers once Zod middleware is in place

### Acceptance Criteria
- `POST /api/leads` with missing `name` field → returns `422` with `{ errors: [{ field: 'name', message: 'Required' }] }`
- `POST /api/properties` with `price: 'abc'` → returns `422` with type error
- All existing tests still pass after switching to Zod validation

---

## Item 14 — No API Versioning

**Phase**: Phase 9  
**Current state**: All routes are at `/api/*` (e.g., `/api/leads`). Any breaking change to a route instantly affects all clients (web, mobile, WhatsApp webhook) with no migration window.

### What Needs Doing
- [ ] Introduce a versioned router prefix: mount all current routes under `/api/v1/`
- [ ] Keep `/api/*` as an alias pointing to `/api/v1/*` during a 6-month deprecation window
- [ ] Add `Deprecation` and `Sunset` response headers to the unversioned routes
- [ ] Update all frontend `crmService.ts`, `apiService.ts` fetch calls to use `/api/v1/` paths
- [ ] Update all test files to use the new `/api/v1/` prefix
- [ ] Document the versioning strategy in `API_DOCUMENTATION.md`

### Acceptance Criteria
- `GET /api/v1/leads` works identically to current `GET /api/leads`
- `GET /api/leads` still works but returns a `Deprecation: true` response header
- All existing tests pass with only the URL prefix change

---

## Item 15 — Inconsistent Error Response Format

**Phase**: Phase 3  
**Current state**: Different routes return errors as `{ error: '...' }`, `{ message: '...' }`, plain strings, or unhandled rejections. Frontend has conditional error parsing spread across every component.

### What Needs Doing
- [ ] Standardize on a single error envelope using the existing `AppError` class:
  ```json
  {
    "status": "error",
    "statusCode": 400,
    "message": "Human-readable message",
    "code": "LEAD_NOT_FOUND",
    "errors": [{ "field": "email", "message": "Invalid email format" }]
  }
  ```
- [ ] Audit all route files and replace `res.json({ error: '...' })` calls with `next(new AppError(...))`
- [ ] Ensure the centralized error middleware in `server/middleware/errorHandler.ts` serializes all errors into the standard envelope
- [ ] Create a `server/utils/errorCodes.ts` enum of all application error codes (e.g., `LEAD_NOT_FOUND`, `UNAUTHORIZED`, `VALIDATION_ERROR`)
- [ ] Update frontend error handling in `crmService.ts` to read `error.response.data.message` consistently

### Acceptance Criteria
- Every non-2xx response from the API returns the standard envelope
- No route directly calls `res.status(xxx).json({ error: ... })` — all go through `next(new AppError(...))`
- Frontend shows the human-readable `message` from the error envelope

---

## Item 16 — No Pagination on Heavy List Endpoints

**Phase**: Phase 3  
**Current state**: `GET /api/properties`, `GET /api/leads`, `GET /api/clients` can return all records (potentially thousands) in a single response. This will cause timeouts as the database grows.

### What Needs Doing
- [ ] Enforce `limit` + `offset` (or cursor-based) pagination on all list endpoints:
  - `GET /api/properties?limit=20&offset=0`
  - `GET /api/leads?limit=20&offset=0&status=new`
  - `GET /api/clients?limit=20&offset=0`
  - `GET /api/agents`, `GET /api/transactions`, `GET /api/activities`
- [ ] Return pagination metadata in all list responses:
  ```json
  { "data": [...], "meta": { "total": 450, "limit": 20, "offset": 0, "hasMore": true } }
  ```
- [ ] Set a hard cap: `limit` cannot exceed 100 (return `400` if exceeded)
- [ ] Update frontend Redux slices to store `{ items, meta }` instead of flat arrays
- [ ] Update all list-rendering components to show "Load More" or page number controls
- [ ] Update all existing tests to account for paginated response shape

### Acceptance Criteria
- `GET /api/leads` without query params returns the first 20 leads + `meta.total`
- `GET /api/leads?limit=200` returns `400 Bad Request`
- Existing tests for list endpoints pass with updated response shape

---

## Item 17 — Redux State Over-Fetching

**Phase**: Phase 3  
**Current state**: Several Redux slices dispatch actions that fetch entire datasets on component mount (e.g., `fetchAllProperties` loads all properties into memory on every CRM tab open). This is slow, memory-intensive, and makes pagination impossible.

### What Needs Doing
- [ ] Audit all Redux slices in `src/store/slices/` — identify those that load full arrays
- [ ] Refactor each over-fetching slice to:
  - Accept `{ page, limit, filters }` parameters
  - Store `{ items: [], meta: { total, page, limit } }` instead of flat arrays
  - Use RTK Query (or manual `createAsyncThunk`) with cache keyed by `page+filters`
- [ ] Replace full-array selectors with paginated selectors
- [ ] Add loading/error state to each slice's paginated state shape
- [ ] Ensure filter changes reset to page 1 and clear the cache

### Acceptance Criteria
- Opening the Leads tab in CRM fetches only 20 records, not all leads
- Switching between pages in the Leads table makes individual API calls per page
- Memory usage in the browser does not grow unboundedly as the user navigates

---

## Item 18 — Missing Startup Environment Variable Validation

**Phase**: Phase 3  
**Current state**: The server starts successfully even when `DATABASE_URL`, `JWT_SECRET`, or other required env vars are missing. Errors only surface at runtime (first DB call or first auth attempt), making debugging difficult in production.

### What Needs Doing
- [ ] Create `server/config/validateEnv.ts` — defines the list of required env vars and their types
- [ ] Use `zod` (already added in Item 13) to validate `process.env` at startup:
  ```typescript
  const EnvSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    // ... all required vars
  });
  ```
- [ ] Call `validateEnv()` as the very first line of `server/index.ts` before any middleware is registered
- [ ] On validation failure: log the missing/invalid variables and call `process.exit(1)` with a clear message
- [ ] Update `DEPLOYMENT_GUIDE.md` with the full list of required env vars

### Acceptance Criteria
- Starting the server without `DATABASE_URL` → immediate exit with message: `❌ Missing required environment variables: DATABASE_URL`
- Starting the server without `JWT_SECRET` → immediate exit
- Starting the server with all variables set → starts normally
- The startup check adds less than 50ms to boot time
