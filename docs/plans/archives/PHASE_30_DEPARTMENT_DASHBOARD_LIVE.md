# Phase 30: Department Dashboard Live API Wiring ✅

**Branch:** `development`
**Date:** May 2026
**Status:** COMPLETE — 0 TypeScript errors, 0 ESLint warnings

---

## Overview

The three Enhanced Department Views (`EnhancedSalesDepartmentView`, `EnhancedFinanceDepartmentView`, `EnhancedHRDepartmentView`) previously showed an `ErrorState` because no backend `/api/departments` route existed. Phase 30 creates the full backend route that aggregates live data from existing Prisma collections and serves it in the exact format the frontend expects.

---

## Root Cause

The frontend called `useDepartmentDataOptimized('SALES')` → `apiIntegration.getDepartmentData('SALES')` → `apiClient.get('/departments/SALES/data')`.

No `server/routes/departments.ts` existed. Every call returned a 404, triggering the `ErrorState` component in all three views.

---

## Files Changed (2 total)

| File                           | Change                                                    |
| ------------------------------ | --------------------------------------------------------- |
| `server/routes/departments.ts` | **NEW** — Full departments API route (~330 lines)         |
| `server/index.ts`              | Import + `app.use('/api/departments', departmentsRoutes)` |

---

## Backend Route: `server/routes/departments.ts`

### Endpoints

| Endpoint                             | Auth             | Returns                                    |
| ------------------------------------ | ---------------- | ------------------------------------------ |
| `GET /api/departments`               | `view_analytics` | List of 3 departments (SALES, FINANCE, HR) |
| `GET /api/departments/:code/data`    | `view_analytics` | Aggregated KPI + chart data for that dept  |
| `GET /api/departments/:code/kpis`    | `view_analytics` | KPI array only                             |
| `GET /api/departments/:code/trends`  | `view_analytics` | Monthly trend array                        |
| `GET /api/departments/:code/summary` | `view_analytics` | Summary stats                              |

### Data Sources Per Department

#### SALES (`getSalesData()`)

| Field                         | Source                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------ |
| `totalLeads`                  | `prisma.lead.count()`                                                                      |
| `activeDeals`                 | `prisma.lead.count({ where: { status: { in: ['hot','warm','qualified','contacted'] } } })` |
| `wonLeads` / `conversionRate` | `prisma.lead.count({ where: { status: 'won' } })`                                          |
| `leadSources`                 | `prisma.lead.groupBy(['source'])` → top 5 with labels                                      |
| `monthlyRevenue`              | Latest month `prisma.commission.aggregate({ sum: amount })`                                |
| `monthlySales`                | 6-month `prisma.commission.aggregate` loop                                                 |

#### FINANCE (`getFinanceData()`)

| Field               | Source                                                                          |
| ------------------- | ------------------------------------------------------------------------------- |
| `totalBudget`       | `prisma.property.aggregate({ sum: price, where: status in ['sold','rented'] })` |
| `spent`             | `prisma.commission.aggregate({ where: status='paid', sum: amount })`            |
| `remaining`         | `totalBudget - spent`                                                           |
| `utilizationRate`   | `spent / totalBudget × 100`                                                     |
| `departmentBudgets` | `prisma.commission.groupBy(['type'])` → by commission type                      |
| `monthlySpending`   | 6-month `prisma.commission.aggregate` loop                                      |

#### HR (`getHRData()`)

| Field                   | Source                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------- |
| `totalEmployees`        | `prisma.user.count({ where: { status: 'active' } })`                                                      |
| `employeesByDepartment` | `prisma.user.groupBy(['role'])` → by user role                                                            |
| `openPositions`         | `prisma.jobApplication.count({ where: { status in ['received','reviewed','shortlisted','interview'] } })` |
| `recentHires`           | `prisma.user.count({ where: { createdAt >= 3 months ago } })`                                             |
| `attendanceTrend`       | `prisma.activity.count` per month (proxy for engagement)                                                  |
| `hiresLastQuarter`      | `prisma.user.count` per quarter × 3                                                                       |

### Data Format

The response includes **both** the custom chart-compatible fields (`leadSources`, `monthlySales`, `departmentBudgets` etc.) **and** the `DepartmentData`-compatible fields (`kpis`, `summary`, `trends`). This ensures both:

1. The chart fallback `displayData.leadSources || mockSalesData.leadSources` resolves with live data
2. The `SalesKPIRenderer` / `FinanceKPIRenderer` / `HRKPIRenderer` work with the `kpis` array

---

## Result

| Before Phase 30                                | After Phase 30                                     |
| ---------------------------------------------- | -------------------------------------------------- |
| All 3 dept views showed `ErrorState`           | All 3 dept views render live charts                |
| `/api/departments/*` returns 404               | `/api/departments/*` returns 200 with live data    |
| Mock fallback never reached (error blocked it) | Live data displayed; mock only used if API is down |

---

## ESLint / TypeScript Notes

- `server/routes/departments.ts` is written in full TypeScript with proper types — no `@ts-nocheck`.
- Uses `asyncHandler` from the existing error middleware (same pattern as all other routes).
- Uses `requirePermission('view_analytics')` — same RBAC as `analytics.ts`.
- No `any` casts. No suppression comments needed.

---

## Sign-off

| Checklist                                                      | Status |
| -------------------------------------------------------------- | ------ |
| 0 TypeScript errors (server)                                   | ✅     |
| 0 TypeScript errors (frontend)                                 | ✅     |
| Route registered in `server/index.ts`                          | ✅     |
| SALES data aggregated from `leads` + `commission`              | ✅     |
| FINANCE data aggregated from `property` + `commission`         | ✅     |
| HR data aggregated from `user` + `jobApplication` + `activity` | ✅     |
| Backward compatible (mock fallback still works if API is down) | ✅     |
| Commit on `development`                                        | ✅     |

**Phase 30: COMPLETE. Department dashboards show live CRM data.**
