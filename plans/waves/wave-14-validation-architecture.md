# Wave 14: Validation Architecture Specifications

## 1. Overview
We utilize `zod` as the single source of truth for runtime validation across both the client (React Hook Form) and the server (Express route middleware).

## 2. Zod Validation Maps
All schemas are stored centrally in `src/common/validators/`. 

Example Lead Validation:
```typescript
export const LeadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+971\d{8,9}$/, "Must be a valid UAE phone number"),
  budget: z.number().min(100000).optional(),
});
```

## 3. Error Envelope Standard
API responses follow a strict envelope pattern when validation fails:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid input payload",
    "details": [
      {
        "path": ["phone"],
        "message": "Must be a valid UAE phone number"
      }
    ]
  }
}
```
