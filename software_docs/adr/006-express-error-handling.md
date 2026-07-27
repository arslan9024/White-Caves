# ADR-006: Express Error Handling & API Patterns

**Status:** Accepted  
**Date:** 2026-03-31  
**Deciders:** Platform Team  

## Context

The backend serves 50+ API endpoints across 10+ route modules. Every route needs:

- Authentication (JWT)
- Authorisation (RBAC)
- Input validation
- Structured error responses
- Async error propagation (no uncaught promise rejections)

## Decision

Implement a **layered middleware architecture** with centralised error handling.

### Middleware stack (order matters)

```
Request → [auth] → [rbac] → [scopeToOwn] → [handler] → [errorHandler]
```

### Key components

| Component | Path | Purpose |
|---|---|---|
| `AppError` class | `server/middleware/errorHandler.ts` | Typed errors with status codes |
| `asyncHandler` | `server/middleware/errorHandler.ts` | Wraps route handlers to catch rejected promises |
| `errorHandler` | `server/middleware/errorHandler.ts` | Global Express error middleware; structured responses |
| `auth` middleware | `server/middleware/auth.ts` | JWT verification, `req.user` attachment |
| RBAC middleware | `server/middleware/rbac.ts` | 5 composable guards (see ADR-002) |

### Error response format

```json
{
  "success": false,
  "error": "Human-readable message",
  "statusCode": 403
}
```

Stack traces are **only included in development** (`NODE_ENV === 'development'`).

### Route pattern

```typescript
router.get(
  '/api/leads',
  requirePermission('view_leads'),
  scopeToOwn(),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const where = { ...req.ownershipFilter };
    const leads = await prisma.lead.findMany({ where });
    res.json({ success: true, data: leads });
  })
);
```

### Why `asyncHandler` wrapper

Express 4.x does not natively catch async errors. Without the wrapper, a rejected promise inside an `async` route handler **crashes the process**. `asyncHandler` ensures all errors reach the global `errorHandler`.

## Consequences

### Positive
- Zero uncaught promise rejections
- Consistent error format across all 50+ endpoints
- No stack traces leak to production
- RBAC + ownership scoping composable per-route

### Negative
- Every route must use `asyncHandler` (easy to forget)
- `AppError` is imported everywhere — couples error shape to server
- No automatic input validation (Zod/Joi not integrated yet)

## Files
- `server/middleware/errorHandler.ts` — `AppError`, `asyncHandler`, `errorHandler`
- `server/middleware/auth.ts` — JWT verification
- `server/middleware/rbac.ts` — RBAC guards
- `server/index.ts` — Global middleware registration (line ~140)
