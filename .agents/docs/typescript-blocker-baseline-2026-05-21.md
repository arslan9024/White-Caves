# TypeScript Blocker Baseline — May 21, 2026

## Summary

A TypeScript validation baseline was captured for both client and server configs.

- `tsconfig.json`: **FAILED**
  - Approx error count: **125**
- `tsconfig.server.json`: **FAILED**
  - Initial approx error count: **88**
  - Current approx error count after JS route declaration fix: **85**
  - Current approx error count after Prisma client regeneration: **17**
- Combined visible baseline: **213 TypeScript errors**

This is the current Week 1 blocker baseline for the acceleration plan.

### Progress Since Baseline Capture

- Fixed the missing declaration cluster for:
  - `./routes/nina.js`
  - `./routes/importHistory.routes.js`
  - `./routes/smartImport.routes.js`
- Result: server TypeScript baseline improved from **88 → 85** errors.
- Regenerated Prisma client from the current schema.
- Result: `prisma.systemSetting` errors dropped out of the TypeScript output.
- Current server TypeScript baseline: **17** errors remaining.

---

## Client (`tsconfig.json`)

### Top Error Codes

- `TS2345` × 69
- `TS2339` × 19
- `TS2322` × 10
- `TS2614` × 9
- `TS18046` × 7
- `TS2724` × 6
- `TS2769` × 3
- `TS7006` × 2

### Top Files by Error Volume

- `src/components/ui/FormField/FormField.tsx` × 24
- `src/components/features/Departments/Sales/styled.ts` × 23
- `src/components/features/AIAssistantDashboard/AIAssistantDashboard.tsx` × 10
- `src/components/features/DepartmentDashboard/DepartmentDashboard.tsx` × 9
- `src/pages/crm/hooks/useNotifications.ts` × 7
- `src/components/examples/DashboardExamples.tsx` × 7
- `src/pages/crm/hooks/useFavorites.ts` × 6
- `src/components/dashboard/RelationalDashboardLayout.tsx` × 6

### Recurring Themes

1. `string | number` values passed into APIs expecting `string`
2. prop/state shape mismatches in CRM modules
3. missing/incorrect exports and named import mismatches
4. styled-components interpolation typing issues
5. unknown/null safety gaps surfacing under strict mode

### Sample Problem Areas

- `NancyHRCRM_NEW` state shape incompatibilities
- `NinaWhatsAppBotCRM_NEW` state contract mismatches
- `RelationalDashboardLayout` styled typing issue
- UI form components with repeated generic/type contract problems

---

## Server (`tsconfig.server.json`)

### Top Error Codes

- `TS2339` × 62
- `TS2322` × 15
- `TS7006` × 5
- `TS7016` × 3
- `TS2304` × 2
- `TS2345` × 1

### Top Files by Error Volume

- `server/routes/notifications.ts` × 9
- `server/routes/compliance.ts` × 3
- `server/index.ts` × 2
- `server/routes/linda.ts` × 2
- `server/routes/meta-webhook.ts` × 1

### Recurring Themes

1. remaining route/controller property typing mismatches
2. request/response payload incompatibilities
3. residual backend symbol/property typing gaps
4. a few route-level null/shape issues

### Sample Problem Areas

- `server/routes/notifications.ts` is now the main backend hotspot
- `server/routes/compliance.ts` and `server/routes/linda.ts` are the next smaller clusters
- `server/index.ts` has only a small residual error footprint after Prisma regeneration

---

## Suggested Week 1 Priority Order

### P0 — Fix First

1. **Notifications route typing cleanup**
   - highest remaining backend hotspot with 9 errors
2. **High-volume frontend type hotspots**
   - `FormField.tsx`
   - `Sales/styled.ts`
3. **CRM state contract mismatches**
   - `NancyHRCRM_NEW`
   - `NinaWhatsAppBotCRM_NEW`
4. **Residual backend route typing cleanup**
   - `compliance.ts`
   - `linda.ts`
   - `meta-webhook.ts`

### P1 — Next Wave

1. hook typing cleanup in CRM pages
2. dashboard/styled-components interpolation fixes
3. implicit `any` cleanup across backend routes

### P2 — After Baseline Stabilization

1. import/export hygiene sweep
2. stricter generics cleanup
3. residual UI prop compatibility work

---

## Recommended Execution Split

### Frontend lane

- resolve the two highest-volume files first
- standardize `string | number` normalization at component boundaries
- align CRM state interfaces with actual tab props

### Backend lane

- fix `server/routes/notifications.ts` first
- then clear `compliance.ts` and `linda.ts`
- preserve the new route declaration shims and regenerated Prisma client baseline

---

## Commands Used

```powershell
npx tsc --noEmit --pretty false -p tsconfig.json
npx tsc --noEmit --pretty false -p tsconfig.server.json
```

---

## Status

- Resource automation: **implemented and validated**
- TypeScript baseline: **captured**
- Quick win completed: **3 server TS7016 route declaration errors removed**
- Quick win completed: **Prisma client regenerated; server baseline reduced to 17 errors**
- Next highest-value action: **fix `server/routes/notifications.ts` and re-run the server scan**
