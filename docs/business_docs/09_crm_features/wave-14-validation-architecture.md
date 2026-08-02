# Wave 14 — Validation Architecture: Request Validation + API Consistency

**Drafted by:** @Zod  
**Model:** Llama 3.1 70B via Groq  
**Status:** ✅ READY (retrospective spec for implemented Wave 14)  
**Last Updated:** 2026-05-25  

CONSUMES←@Mira: `server/middleware/validation.js`, `server/services/ValidationService.js`  
FEEDS→@Radia: `business_docs/05_requirements/non-functional-requirements.md#validation`  
FEEDS_ACK←@Katherine: accepted | `business_docs/09_crm_features/wave-14-validation-architecture.md`

---

## 1. Overview

Wave 14 introduces a unified request validation layer across all CRM API routes. The architecture uses a combination of `express-validator` (field-level middleware) and a `ValidationService` utility class to enforce consistent input sanitisation, type coercion, and error response formatting.

---

## 2. Validation Stack

| Layer | File | Responsibility |
|-------|------|----------------|
| Route validators | `server/middleware/validation.js` | Express middleware chains per route group |
| Validation service | `server/services/ValidationService.js` | Shared logic: sanitise strings, validate enums, coerce types |
| Error envelope | `server/middleware/errorHandler.ts` | Formats `validationResult` errors into `{ errors: [...] }` |

---

## 3. Standard Error Envelope

All validation failures return `400 Bad Request` with:

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address",
      "value": "not-an-email"
    }
  ]
}
```

This shape is enforced by `errorHandler.ts` via `validationResult(req).array()`.

---

## 4. ValidationService API

```typescript
class ValidationService {
  static sanitiseString(value: string): string
  // Trims whitespace, removes null bytes, collapses internal whitespace

  static validateEnum<T>(value: unknown, allowed: T[]): T
  // Throws AppError(400) if value not in allowed list

  static isValidAED(amount: unknown): boolean
  // Returns true if number, finite, >= 0, max 2 decimal places

  static coercePaginationParams(query: Record<string, unknown>): { page: number; limit: number }
  // Defaults: page=1, limit=20; max limit=100

  static validateDateRange(from?: string, to?: string): { from: Date; to: Date } | null
  // Returns null if both absent; throws if from > to or invalid ISO format
}
```

---

## 5. Route Validation Chains

### 5.1 Leads

```javascript
validateCreateLead: [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('source').optional().isIn(LEAD_SOURCES),
  body('budget').optional().isFloat({ min: 0 }),
]

validateUpdateLead: [
  param('id').notEmpty(),
  body('status').optional().isIn(LEAD_STATUSES),
  body('score').optional().isInt({ min: 0, max: 100 }),
]
```

### 5.2 Properties

```javascript
validateCreateProperty: [
  body('title').trim().notEmpty().isLength({ max: 200 }),
  body('type').isIn(PROPERTY_TYPES),
  body('price').isFloat({ min: 0 }),
  body('bedrooms').optional().isInt({ min: 0, max: 20 }),
  body('area').trim().notEmpty(),
  body('community').trim().notEmpty(),
]
```

### 5.3 Leases / Contracts

```javascript
validateCreateLease: [
  body('propertyId').notEmpty(),
  body('tenantId').notEmpty(),
  body('startDate').isISO8601(),
  body('endDate').isISO8601(),
  body('monthlyRent').isFloat({ min: 0 }),
  body('currency').optional().isISO4217(),
]
```

### 5.4 Appointments / Calendar

```javascript
validateCreateAppointment: [
  body('propertyId').optional().isString(),
  body('scheduledAt').isISO8601(),
  body('durationMinutes').optional().isInt({ min: 15, max: 480 }),
  body('type').isIn(APPOINTMENT_TYPES),
]
```

---

## 6. Shared Validation Middleware Pattern

Every route that mutates data uses this pattern:

```typescript
router.post('/leads',
  authenticate,
  ...validateCreateLead,   // express-validator chain
  handleValidationErrors,   // extracts errors, returns 400 if any
  asyncHandler(createLead), // business logic (only reached if valid)
);
```

`handleValidationErrors` middleware:

```typescript
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}
```

---

## 7. Input Sanitisation Rules

| Input Type | Sanitisation Applied |
|-----------|---------------------|
| String fields | `.trim()` + `escape()` for display fields |
| Email | `.normalizeEmail()` (lowercase, remove dots in Gmail) |
| Phone | Strip non-digits except `+` prefix |
| AED amount | `parseFloat` + round to 2 decimal places |
| IDs (cuid/uuid) | `isString` + length check (max 36 chars) |
| Free text (notes) | `.trim()` + max length 5000 chars |

---

## 8. Acceptance Criteria

- [x] All mutating routes (POST/PUT/PATCH) have a validator chain
- [x] Validation errors return `400` with `{ success: false, errors: [...] }` shape
- [x] `sanitiseString` removes null bytes and collapses whitespace
- [x] `coercePaginationParams` defaults page=1, limit=20, max limit=100
- [x] `validateDateRange` throws if `from > to`
- [x] Email normalisation applied to all email inputs
- [x] No SQL/NoSQL injection via unvalidated string inputs
