# Mobile Executive Analytics View & 375px Responsive Viewport Standard

> **Tracking:** `DU012` | **Agent:** `@Cassie` (Cross-Platform Mobile Integration Lead) | **Status:** `ACTIVE SPECIFICATION`  
> **CONSUMES:** `server/routes/aegis.ts`, `src/pages/dashboard/ModernDashboardPage.tsx`  
> **FEEDS:** `business_docs/09_crm_features/analytics-dashboard.md`  
> **FEEDS_ACK:** `AEGIS-V5-MOBILE-ANALYTICS-VIEW-ACK`

---

## 1. Ultra-Responsive 375px Mobile Viewport Law
In accordance with `AEG-006` and `AEG-007`:
- All analytics charts, revenue cards, and department SLA dials must render smoothly on standard mobile screens down to **375px width** without horizontal overflow.
- Minimum touch target: **44px × 44px** on all clickable buttons and metric chips.

---

## 2. Mobile Telemetry & KPI Cards
- **Live Sales Velocity**: Gross transaction volume (GTV) and commission revenue YTD.
- **Agent Merit XP**: Real-time staff XP ranks and split bracket progressions (60% -> 70% dynamic split).
- **SLA Radar**: Average department response time (sub-15 min enforcement).
