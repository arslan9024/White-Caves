# CURRENT SPRINT — Homepage Production-Readiness

**Sprint Goal:** Eliminate all TypeScript errors blocking `tsc --noEmit` on the homepage and its component tree. Ensure the Vite production build remains green.

**Date:** 2026-05-08
**Status:** In Progress

---

## Bug Inventory

| #   | Severity   | File                                                              | Error                                                                                                                                                                                                                                         | Status                                     |
| --- | ---------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | 🔴 BLOCKER | `src/components/homepage/Hero/Hero.tsx:156`                       | TS2322 — `fetchPriority` not in `@types/react`                                                                                                                                                                                                | ✅ Fixed                                   |
| 2   | 🟡 MEDIUM  | `src/styles/theme.ts` legacy objects                              | Design-token drift: `shadows.card`, `transitions.easing.easeOut`, `colors.background.darkSecondary`, `colors.background.overlay`, `colors.luxury`, `typography.sizes`, `shadows.luxuryHover/Card/Glow/Elevated`, `theme.mediaQueries` missing | ✅ Fixed                                   |
| 3   | 🟡 MEDIUM  | `UnifiedDashboardPage.tsx` + 18 `.jsx` CRM files                  | TS7016 — implicit `any` for `.jsx` modules (`allowJs: false`)                                                                                                                                                                                 | ✅ Fixed (`allowJs: true, checkJs: false`) |
| 4   | 🟡 MEDIUM  | `src/redux/slices/relationalSidebarSlice.js`                      | TS7016 — implicit `any` from JS slice causing 15+ cascading errors in `RelationalDashboardLayout.tsx`                                                                                                                                         | ✅ Fixed (`allowJs: true, checkJs: false`) |
| 5   | 🟡 MEDIUM  | `src/components/shared/dashboard/DataCard.tsx`                    | Missing TypeScript props interface → required-any errors in `AnalyticsView.tsx`                                                                                                                                                               | ✅ Fixed (added `DataCardProps` interface) |
| 6   | 🟡 MEDIUM  | `src/pages/departments/finance/EnhancedFinanceDepartmentView.tsx` | `ErrorState` called with `title`/`message` props (expects `error`); `displayData` typed as `{}`                                                                                                                                               | ✅ Fixed                                   |
| 7   | 🟡 MEDIUM  | `src/pages/departments/hr/EnhancedHRDepartmentView.tsx`           | Same `ErrorState` props mismatch + `displayData` typed as `{}`                                                                                                                                                                                | ✅ Fixed                                   |

---

## Acceptance Criteria

- [ ] `npx tsc --noEmit` reports **zero errors** in `src/components/homepage/**` and `src/pages/HomePage.tsx`
- [ ] `npm run build` succeeds (Vite production build ≤ 30s)
- [ ] No new runtime regressions on the Homepage route
- [ ] All Vercel env vars (`VITE_API_URL`, `VITE_DOMAIN`, `VITE_APP_URL`, `VITE_FIREBASE_*`, `DATABASE_URL`, `JWT_SECRET`) confirmed in Vercel project settings

---

## Remaining Warnings (non-blocking)

- ESLint: 302 errors (mostly `no-undef` in `test/utils/testUtilities.js` and `security/*` warnings in CRM files) — not blocking Vite build
- `RelationalDashboardLayout.tsx` styled-component interpolation errors — only affect CRM dashboard, not homepage

---

## Git Workflow

```bash
git add .
git commit -m "fix: homepage production-readiness — fetchPriority, theme tokens, allowJs, DataCard types, ErrorState props"
git pull --rebase origin main
git push origin main
```

---

## Environment Variable Checklist

| Variable                    | Required    | Notes                                        |
| --------------------------- | ----------- | -------------------------------------------- |
| `VITE_API_URL`              | ✅          | Default `/api` — works without setting       |
| `VITE_DOMAIN`               | ✅          | Set to production domain                     |
| `VITE_APP_URL`              | ✅          | Set to production URL                        |
| `VITE_FIREBASE_API_KEY`     | ⚠️ Optional | Social login disabled gracefully when absent |
| `VITE_FIREBASE_AUTH_DOMAIN` | ⚠️ Optional | Social login disabled gracefully when absent |
| `VITE_FIREBASE_PROJECT_ID`  | ⚠️ Optional | Social login disabled gracefully when absent |
| `DATABASE_URL`              | ✅          | Must be set in Vercel                        |
| `JWT_SECRET`                | ✅          | Must be set in Vercel                        |
| `VITE_WHATSAPP_NUMBER`      | ⚠️ Optional | WhatsApp CTA button                          |
| `VITE_BANK_*`               | ⚠️ Optional | Finance/invoice module                       |
