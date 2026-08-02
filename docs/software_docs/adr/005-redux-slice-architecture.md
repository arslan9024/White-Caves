# ADR-005: Redux Slice Architecture

**Status:** Accepted  
**Date:** 2026-03-31  
**Deciders:** Platform Team  

## Context

The White Caves CRM manages complex client-side state across multiple domains: authentication, properties, leads, contracts, commissions, AI assistants, WhatsApp conversations, and UI preferences. State must be:

- Shared across deeply nested component trees
- Persisted across route transitions
- Type-safe (TypeScript strict mode)
- Testable in isolation

## Decision

Use **Redux Toolkit** with domain-scoped slices and typed selectors.

### Slice inventory (13 slices)

| Slice | Domain | Key State |
|---|---|---|
| `authSlice` | Authentication | user, token, role, isAuthenticated |
| `uiSlice` | UI preferences | theme, sidebar state, active tab |
| `propertiesSlice` | Property listings | items[], filters, pagination |
| `leadsSlice` | Sales pipeline | items[], status filters |
| `contractsSlice` | Tenancy/sales | items[], status |
| `commissionsSlice` | Agent payouts | items[], calculations |
| `assistantsSlice` | AI assistants | configs[], active assistant |
| `conversationsSlice` | WhatsApp/chat | threads[], messages[] |
| `usersSlice` | User management | users[], roles |
| `analyticsSlice` | Dashboard KPIs | metrics, charts data |
| `notificationsSlice` | In-app alerts | items[], unread count |
| `settingsSlice` | System config | key-value pairs |
| `clientsSlice` | Freelancer clients | items[], CRUD operations |

### Patterns enforced

1. **Typed selectors** — Every slice exports `selectXxx` selectors (e.g., `selectSelectedDepartment`, `selectSelectedService`, `selectSelectedAssistant`)
2. **Async thunks** — All API calls go through `createAsyncThunk` with standardised loading/error/success states
3. **Normalised state** — Entity adapters for lists with IDs
4. **No `any`** — All actions and state are fully typed

### Store configuration

```typescript
// src/store/store.ts
configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    properties: propertiesReducer,
    // ... all 13 slices
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});
```

## Consequences

### Positive
- Each domain has clear ownership and boundaries
- Selectors prevent unnecessary re-renders
- Async thunks standardise loading/error patterns
- Type safety catches state shape errors at compile time

### Negative
- 13 slices = significant boilerplate
- Some slices (analytics, notifications) are thin wrappers that could use React Query instead
- `serializableCheck: false` needed for Date objects in state

## Files
- `src/store/store.ts` — Store configuration
- `src/store/slices/` — All 13 slice files
- `src/store/hooks.ts` — Typed `useAppDispatch`, `useAppSelector`
